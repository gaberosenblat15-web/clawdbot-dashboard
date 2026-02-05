'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle2, Clock, AlertCircle, ListTodo,
  Brain, TrendingUp, Lightbulb, Wrench,
  DollarSign, Activity, RefreshCw, Zap
} from 'lucide-react'

interface DashboardData {
  timestamp: string
  taskQueue: {
    ready: string[]
    inProgress: string[]
    blocked: string[]
    doneToday: string[]
  }
  reflectMetrics: {
    totalSessionsAnalyzed: number
    totalSignalsDetected: number
    totalChangesAccepted: number
    acceptanceRate: number
    confidenceBreakdown: { high: number; medium: number; low: number }
    skillsCreated: number
  }
  skills: Array<{
    name: string
    status: 'active' | 'needs-setup'
    description: string
  }>
  ideas: string[]
  recentActivity: Array<{ date: string; summary: string }>
  costTracking: {
    todayTokens: number
    todayEstimatedCost: number
    modelDistribution: { opus: number; sonnet: number; haiku: number }
  }
}

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-gray-900/50 backdrop-blur border border-purple-500/20 rounded-xl p-6 ${className}`}
  >
    {children}
  </motion.div>
)

const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) => (
  <div className={`flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r ${color}`}>
    <div className="p-3 bg-white/10 rounded-lg">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-white/70 text-sm">{label}</p>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  </div>
)

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const fetchData = async () => {
    try {
      const res = await fetch('/api/dashboard')
      const json = await res.json()
      setData(json)
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-purple-400">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-red-400">Failed to load dashboard data</p>
      </div>
    )
  }

  const totalTasks = data.taskQueue.ready.length + data.taskQueue.inProgress.length + 
                     data.taskQueue.blocked.length + data.taskQueue.doneToday.length

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ClawdBot Command Center
            </h1>
            <p className="text-gray-400 mt-1">AI Chief of Staff Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-sm">
              Last refresh: {lastRefresh.toLocaleTimeString()}
            </span>
            <button 
              onClick={fetchData}
              className="p-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 transition"
            >
              <RefreshCw className="w-5 h-5 text-purple-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Task Queue - Full Width on Mobile, 2 cols on desktop */}
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <ListTodo className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-semibold">Task Queue</h2>
            <span className="ml-auto text-sm text-gray-500">{totalTasks} total</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard icon={Clock} label="Ready" value={data.taskQueue.ready.length} color="from-blue-600/40 to-blue-800/40" />
            <StatCard icon={Zap} label="In Progress" value={data.taskQueue.inProgress.length} color="from-yellow-600/40 to-yellow-800/40" />
            <StatCard icon={AlertCircle} label="Blocked" value={data.taskQueue.blocked.length} color="from-red-600/40 to-red-800/40" />
            <StatCard icon={CheckCircle2} label="Done Today" value={data.taskQueue.doneToday.length} color="from-green-600/40 to-green-800/40" />
          </div>

          <div className="space-y-4">
            {data.taskQueue.ready.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-blue-400 mb-2">Ready</h3>
                <ul className="space-y-1">
                  {data.taskQueue.ready.map((task, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-blue-400">○</span> {task}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {data.taskQueue.inProgress.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-yellow-400 mb-2">In Progress</h3>
                <ul className="space-y-1">
                  {data.taskQueue.inProgress.map((task, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-yellow-400">◐</span> {task}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {data.taskQueue.doneToday.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-green-400 mb-2">Completed Today</h3>
                <ul className="space-y-1">
                  {data.taskQueue.doneToday.slice(0, 5).map((task, i) => (
                    <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                      <span className="text-green-400">✓</span> {task}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>

        {/* Self-Learning Metrics */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-5 h-5 text-pink-400" />
            <h2 className="text-xl font-semibold">Self-Learning</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-800/50">
              <span className="text-gray-400">Sessions Analyzed</span>
              <span className="text-white font-bold">{data.reflectMetrics.totalSessionsAnalyzed}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-800/50">
              <span className="text-gray-400">Signals Detected</span>
              <span className="text-white font-bold">{data.reflectMetrics.totalSignalsDetected}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-800/50">
              <span className="text-gray-400">Changes Accepted</span>
              <span className="text-white font-bold">{data.reflectMetrics.totalChangesAccepted}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-800/50">
              <span className="text-gray-400">Acceptance Rate</span>
              <span className="text-green-400 font-bold">{data.reflectMetrics.acceptanceRate}%</span>
            </div>
            
            <div className="pt-4 border-t border-gray-700">
              <h4 className="text-sm text-gray-500 mb-3">Confidence Breakdown</h4>
              <div className="flex gap-2">
                <div className="flex-1 p-2 rounded bg-green-900/30 text-center">
                  <p className="text-xs text-green-400">High</p>
                  <p className="text-lg font-bold text-green-300">{data.reflectMetrics.confidenceBreakdown.high}</p>
                </div>
                <div className="flex-1 p-2 rounded bg-yellow-900/30 text-center">
                  <p className="text-xs text-yellow-400">Medium</p>
                  <p className="text-lg font-bold text-yellow-300">{data.reflectMetrics.confidenceBreakdown.medium}</p>
                </div>
                <div className="flex-1 p-2 rounded bg-gray-800/50 text-center">
                  <p className="text-xs text-gray-400">Low</p>
                  <p className="text-lg font-bold text-gray-300">{data.reflectMetrics.confidenceBreakdown.low}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Skills Status */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <Wrench className="w-5 h-5 text-orange-400" />
            <h2 className="text-xl font-semibold">Skills</h2>
            <span className="ml-auto text-sm text-gray-500">{data.skills.length} installed</span>
          </div>
          
          <div className="space-y-3">
            {data.skills.map((skill, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50">
                <div className={`w-2 h-2 mt-2 rounded-full ${skill.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white">{skill.name}</p>
                  <p className="text-xs text-gray-400 truncate">{skill.description}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  skill.status === 'active' 
                    ? 'bg-green-900/50 text-green-400' 
                    : 'bg-yellow-900/50 text-yellow-400'
                }`}>
                  {skill.status === 'active' ? 'Active' : 'Setup'}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Ideas & Opportunities */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-semibold">Ideas & Opportunities</h2>
          </div>
          
          {data.ideas.length > 0 ? (
            <ul className="space-y-2">
              {data.ideas.map((idea, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-yellow-400">💡</span>
                  {idea}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <Lightbulb className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500">No ideas logged yet</p>
              <p className="text-xs text-gray-600 mt-1">Create ideas/IDEAS.md to track opportunities</p>
            </div>
          )}
        </Card>

        {/* Cost Tracking */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="w-5 h-5 text-green-400" />
            <h2 className="text-xl font-semibold">Cost Tracking</h2>
          </div>
          
          <div className="space-y-4">
            <div className="text-center py-4 rounded-lg bg-gradient-to-r from-green-900/30 to-emerald-900/30">
              <p className="text-sm text-gray-400">Estimated Today</p>
              <p className="text-3xl font-bold text-green-400">
                ${data.costTracking.todayEstimatedCost.toFixed(2)}
              </p>
            </div>
            
            <div className="pt-4 border-t border-gray-700">
              <h4 className="text-sm text-gray-500 mb-3">Model Distribution</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-400">Opus</span>
                  <span className="text-sm text-gray-300">{data.costTracking.modelDistribution.opus} calls</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-400">Sonnet</span>
                  <span className="text-sm text-gray-300">{data.costTracking.modelDistribution.sonnet} calls</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-400">Haiku</span>
                  <span className="text-sm text-gray-300">{data.costTracking.modelDistribution.haiku} calls</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </div>
          
          {data.recentActivity.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {data.recentActivity.map((activity, i) => (
                <div key={i} className="p-4 rounded-lg bg-gray-800/50">
                  <p className="text-xs text-cyan-400 mb-2">{activity.date}</p>
                  <p className="text-sm text-gray-300 line-clamp-3">{activity.summary}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500">No recent activity</p>
            </div>
          )}
        </Card>

      </div>
    </div>
  )
}
