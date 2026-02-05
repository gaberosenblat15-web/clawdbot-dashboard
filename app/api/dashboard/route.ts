import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// Check if running on Vercel (production) or locally
const isVercel = process.env.VERCEL === '1'

const WORKSPACE = '/data/.openclaw/workspace'
const REFLECT_DIR = '/data/.reflect'

interface TaskQueue {
  ready: string[]
  inProgress: string[]
  blocked: string[]
  doneToday: string[]
}

interface ReflectMetrics {
  totalSessionsAnalyzed: number
  totalSignalsDetected: number
  totalChangesAccepted: number
  acceptanceRate: number
  confidenceBreakdown: { high: number; medium: number; low: number }
  skillsCreated: number
}

interface Skill {
  name: string
  status: 'active' | 'needs-setup'
  description: string
}

async function parseTaskQueue(): Promise<TaskQueue> {
  try {
    const content = await fs.readFile(path.join(WORKSPACE, 'tasks/QUEUE.md'), 'utf-8')
    
    const sections = {
      ready: [] as string[],
      inProgress: [] as string[],
      blocked: [] as string[],
      doneToday: [] as string[]
    }
    
    let currentSection = ''
    const lines = content.split('\n')
    
    for (const line of lines) {
      if (line.includes('## Ready')) currentSection = 'ready'
      else if (line.includes('## In Progress')) currentSection = 'inProgress'
      else if (line.includes('## Blocked')) currentSection = 'blocked'
      else if (line.includes('## Done Today')) currentSection = 'doneToday'
      else if (line.trim().startsWith('- [')) {
        const task = line.replace(/^- \[.\]\s*/, '').trim()
        if (task && !task.startsWith('<!--') && currentSection) {
          sections[currentSection as keyof typeof sections].push(task)
        }
      }
    }
    
    return sections
  } catch {
    return { ready: [], inProgress: [], blocked: [], doneToday: [] }
  }
}

async function parseReflectMetrics(): Promise<ReflectMetrics> {
  try {
    const content = await fs.readFile(path.join(REFLECT_DIR, 'reflect-metrics.yaml'), 'utf-8')
    
    const getNum = (key: string): number => {
      const match = content.match(new RegExp(`${key}:\\s*(\\d+)`))
      return match ? parseInt(match[1]) : 0
    }
    
    return {
      totalSessionsAnalyzed: getNum('total_sessions_analyzed'),
      totalSignalsDetected: getNum('total_signals_detected'),
      totalChangesAccepted: getNum('total_changes_accepted'),
      acceptanceRate: getNum('acceptance_rate'),
      confidenceBreakdown: {
        high: getNum('high'),
        medium: getNum('medium'),
        low: getNum('low')
      },
      skillsCreated: getNum('skills_created')
    }
  } catch {
    return {
      totalSessionsAnalyzed: 0,
      totalSignalsDetected: 0,
      totalChangesAccepted: 0,
      acceptanceRate: 0,
      confidenceBreakdown: { high: 0, medium: 0, low: 0 },
      skillsCreated: 0
    }
  }
}

async function parseSkills(): Promise<Skill[]> {
  try {
    const content = await fs.readFile(path.join(WORKSPACE, 'TOOLS.md'), 'utf-8')
    const skills: Skill[] = []
    
    const skillBlocks = content.split('### ').slice(1)
    for (const block of skillBlocks) {
      const lines = block.split('\n')
      const name = lines[0]?.trim()
      if (!name || name === 'Cameras' || name === 'SSH Hosts' || name === 'TTS') continue
      
      const statusLine = lines.find(l => l.includes('**Status:**'))
      const isActive = statusLine?.includes('✅') || false
      const purposeLine = lines.find(l => l.includes('**Purpose:**'))
      const purpose = purposeLine?.replace('**Purpose:**', '').trim() || ''
      
      skills.push({
        name,
        status: isActive ? 'active' : 'needs-setup',
        description: purpose
      })
    }
    
    return skills
  } catch {
    return []
  }
}

async function parseIdeas(): Promise<string[]> {
  try {
    const ideasPath = path.join(WORKSPACE, 'ideas/IDEAS.md')
    const content = await fs.readFile(ideasPath, 'utf-8')
    const ideas: string[] = []
    
    for (const line of content.split('\n')) {
      if (line.trim().startsWith('- ')) {
        ideas.push(line.replace(/^-\s*/, '').trim())
      }
    }
    
    return ideas.slice(0, 10)
  } catch {
    return []
  }
}

async function parseRecentActivity(): Promise<{ date: string; summary: string }[]> {
  try {
    const memoryDir = path.join(WORKSPACE, 'memory')
    const files = await fs.readdir(memoryDir)
    const mdFiles = files.filter(f => f.match(/^\d{4}-\d{2}-\d{2}\.md$/)).sort().reverse().slice(0, 7)
    
    const activities: { date: string; summary: string }[] = []
    
    for (const file of mdFiles) {
      const content = await fs.readFile(path.join(memoryDir, file), 'utf-8')
      const date = file.replace('.md', '')
      
      const lines = content.split('\n').filter(l => 
        l.trim() && !l.startsWith('#') && !l.startsWith('<!--')
      ).slice(0, 3)
      
      activities.push({
        date,
        summary: lines.join(' ').substring(0, 150) || 'Activity logged'
      })
    }
    
    return activities
  } catch {
    return []
  }
}

async function getStaticData() {
  // For Vercel deployment, use bundled static data
  const staticData = await import('../../../data/dashboard-data.json')
  return staticData.default || staticData
}

export async function GET() {
  // If on Vercel, return static data
  if (isVercel) {
    const staticData = await getStaticData()
    return NextResponse.json({
      ...staticData,
      timestamp: new Date().toISOString(),
      source: 'static'
    })
  }
  
  // If local, read from filesystem
  const [taskQueue, reflectMetrics, skills, ideas, recentActivity] = await Promise.all([
    parseTaskQueue(),
    parseReflectMetrics(),
    parseSkills(),
    parseIdeas(),
    parseRecentActivity()
  ])
  
  const costTracking = {
    todayTokens: 0,
    todayEstimatedCost: 0,
    modelDistribution: {
      opus: 0,
      sonnet: 0,
      haiku: 0
    }
  }
  
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    taskQueue,
    reflectMetrics,
    skills,
    ideas,
    recentActivity,
    costTracking,
    source: 'live'
  })
}
