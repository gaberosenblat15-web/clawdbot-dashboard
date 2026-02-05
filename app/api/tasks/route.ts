import { NextResponse } from 'next/server'

// Mock tasks data for demo purposes
// In production, this will connect to OpenClaw Gateway
const mockTasks = [
  {
    id: '1',
    name: 'Process email inbox',
    status: 'in_progress',
    description: 'Scanning and categorizing 23 new emails...',
    startTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 mins ago
  },
  {
    id: '2',
    name: 'Generate weekly report',
    status: 'in_progress',
    description: 'Compiling metrics and creating visualizations',
    startTime: new Date(Date.now() - 12 * 60 * 1000).toISOString(), // 12 mins ago
  },
  {
    id: '3',
    name: 'Update documentation',
    status: 'queued',
    description: 'Review and update API documentation',
    startTime: new Date(Date.now()).toISOString(),
  },
  {
    id: '4',
    name: 'Backup workspace files',
    status: 'queued',
    description: 'Create backup of all workspace data',
    startTime: new Date(Date.now()).toISOString(),
  },
  {
    id: '5',
    name: 'Analyze user feedback',
    status: 'completed',
    description: 'Processed 47 feedback entries and generated summary',
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    endTime: new Date(Date.now() - 90 * 60 * 1000).toISOString(), // 90 mins ago
  },
  {
    id: '6',
    name: 'Deploy website updates',
    status: 'completed',
    description: 'Successfully deployed version 2.4.1 to production',
    startTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    endTime: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(), // 3.5 hours ago
  },
  {
    id: '7',
    name: 'Code review for PR #142',
    status: 'completed',
    description: 'Reviewed authentication module changes',
    startTime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    endTime: new Date(Date.now() - 4.8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '8',
    name: 'Database optimization',
    status: 'completed',
    description: 'Optimized 12 slow queries, improved response time by 40%',
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    endTime: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '9',
    name: 'Security audit',
    status: 'completed',
    description: 'Completed full security scan, no critical issues found',
    startTime: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
    endTime: new Date(Date.now() - 46 * 60 * 60 * 1000).toISOString(),
  },
]

export async function GET() {
  try {
    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 300))

    // In production, this would call:
    // const response = await fetch('http://localhost:3210/api/tasks')
    // const tasks = await response.json()

    return NextResponse.json({
      tasks: mockTasks,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Tasks API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}
