'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle2, Clock, AlertCircle, ListTodo,
  Brain, TrendingUp, Lightbulb, Wrench,
  DollarSign, Activity, RefreshCw, Zap,
  ChevronRight, Sparkles, Target, Rocket,
  BarChart3, CircleDot, ArrowUpRight
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

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerChildren = {
  animate: { transition: { staggerChildren: 0.1 } }
}

const GlowingOrb = ({ color, size = 300, className = '' }: { color: string; size?: number; className?: string }) => (
  <div 
    className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`}
    style={{ 
      background: color,
      width: size,
      height: size,
    }}
  />
)

const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  trend,
  color 
}: { 
  icon: any
  label: string
  value: string | number
  trend?: string
  color: string 
}) => (
  <motion.div 
    whileHover={{ scale: 1.02, y: -2 }}
    className="relative group"
  >
    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />
    <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-5 overflow-hidden">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
            <ArrowUpRight className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-sm text-gray-400 mt-1">{label}</p>
      </div>
    </div>
  </motion.div>
)

const TaskItem = ({ task, status }: { task: string; status: 'ready' | 'done' | 'blocked' | 'progress' }) => {
  const statusConfig = {
    ready: { color: 'bg-blue-500', ring: 'ring-blue-500/20' },
    done: { color: 'bg-emerald-500', ring: 'ring-emerald-500/20' },
    blocked: { color: 'bg-amber-500', ring: 'ring-amber-500/20' },
    progress: { color: 'bg-purple-500', ring: 'ring-purple-500/20' }
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
    >
      <div className={`w-2 h-2 mt-2 rounded-full ${statusConfig[status].color} ring-4 ${statusConfig[status].ring}`} />
      <span className="text-sm text-gray-300 group-hover:text-white transition-colors flex-1">{task}</span>
      {status === 'done' && <CheckCircle2 className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
    </motion.div>
  )
}

const SkillCard = ({ skill }: { skill: { name: string; status: string; description: string } }) => (
  <motion.div 
    whileHover={{ scale: 1.01 }}
    className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:border-gray-600/50 transition-all group"
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
      skill.status === 'active' 
        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' 
        : 'bg-gradient-to-br from-amber-500 to-amber-600'
    }`}>
      <Wrench className="w-5 h-5 text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-white truncate">{skill.name}</p>
      <p className="text-xs text-gray-500 truncate">{skill.description}</p>
    </div>
    <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
      skill.status === 'active'
        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
    }`}>
      {skill.status === 'active' ? 'Active' : 'Setup'}
    </span>
  </motion.div>
)

const IdeaCard = ({ idea, index }: { idea: string; index: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    whileHover={{ scale: 1.01, x: 4 }}
    className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-amber-500/5 to-transparent border border-amber-500/10 hover:border-amber-500/30 transition-all cursor-pointer group"
  >
    <div className="p-2 rounded-lg bg-amber-500/10">
      <Lightbulb className="w-4 h-4 text-amber-400" />
    </div>
    <p className="text-sm text-gray-300 group-hover:text-white transition-colors flex-1">{idea}</p>
    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-amber-400 transition-colors" />
  </motion.div>
)

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchData = async () => {
    setIsRefreshing(true)
    try {
      const res = await fetch('/api/dashboard')
      const json = await res.json()
      setData(json)
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 animate-pulse" />
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-purple-400 animate-bounce" />
          </div>
          <p className="text-gray-400 animate-pulse">Loading Command Center...</p>
        </motion.div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <p className="text-red-400">Failed to load dashboard data</p>
      </div>
    )
  }

  const totalTasks = data.taskQueue.ready.length + data.taskQueue.inProgress.length + 
                     data.taskQueue.blocked.length + data.taskQueue.doneToday.length

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <GlowingOrb color="rgba(139, 92, 246, 0.3)" size={600} className="-top-64 -left-64" />
        <GlowingOrb color="rgba(236, 72, 153, 0.2)" size={500} className="top-1/2 -right-64" />
        <GlowingOrb color="rgba(59, 130, 246, 0.2)" size={400} className="-bottom-32 left-1/3" />
      </div>

      <div className="relative z-10 p-6 lg:p-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0a0a0f]" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                    ClawdBot Command Center
                  </h1>
                  <p className="text-sm text-gray-500">AI Chief of Staff • Calford AI</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-gray-500">Last updated</p>
                <p className="text-sm text-gray-300">{lastRefresh.toLocaleTimeString()}</p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchData}
                disabled={isRefreshing}
                className="p-3 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all"
              >
                <RefreshCw className={`w-5 h-5 text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Stats Row */}
        <motion.div 
          variants={staggerChildren}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <motion.div variants={fadeInUp}>
            <StatCard icon={ListTodo} label="Ready Tasks" value={data.taskQueue.ready.length} color="from-blue-500 to-blue-600" />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <StatCard icon={Zap} label="In Progress" value={data.taskQueue.inProgress.length} color="from-purple-500 to-purple-600" />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <StatCard icon={AlertCircle} label="Blocked" value={data.taskQueue.blocked.length} color="from-amber-500 to-amber-600" />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <StatCard icon={CheckCircle2} label="Done Today" value={data.taskQueue.doneToday.length} trend="+8" color="from-emerald-500 to-emerald-600" />
          </motion.div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Task Queue - Spans 2 cols */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                  <Target className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-lg font-semibold">Task Queue</h2>
              </div>
              <span className="text-sm text-gray-500">{totalTasks} total</span>
            </div>

            <div className="space-y-6">
              {data.taskQueue.ready.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-sm font-medium text-blue-400">Ready</span>
                  </div>
                  <div className="space-y-1">
                    {data.taskQueue.ready.map((task, i) => (
                      <TaskItem key={i} task={task} status="ready" />
                    ))}
                  </div>
                </div>
              )}

              {data.taskQueue.blocked.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-sm font-medium text-amber-400">Blocked</span>
                  </div>
                  <div className="space-y-1">
                    {data.taskQueue.blocked.slice(0, 3).map((task, i) => (
                      <TaskItem key={i} task={task} status="blocked" />
                    ))}
                  </div>
                </div>
              )}

              {data.taskQueue.doneToday.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium text-emerald-400">Completed Today</span>
                  </div>
                  <div className="space-y-1 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                    {data.taskQueue.doneToday.map((task, i) => (
                      <TaskItem key={i} task={task} status="done" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Self-Learning */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20">
                <Brain className="w-5 h-5 text-pink-400" />
              </div>
              <h2 className="text-lg font-semibold">Self-Learning</h2>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Sessions Analyzed', value: data.reflectMetrics.totalSessionsAnalyzed },
                { label: 'Signals Detected', value: data.reflectMetrics.totalSignalsDetected },
                { label: 'Changes Accepted', value: data.reflectMetrics.totalChangesAccepted },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-800/30">
                  <span className="text-sm text-gray-400">{item.label}</span>
                  <span className="text-lg font-bold text-white">{item.value}</span>
                </div>
              ))}
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20">
                <span className="text-sm text-gray-400">Acceptance Rate</span>
                <span className="text-lg font-bold text-emerald-400">{data.reflectMetrics.acceptanceRate}%</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-800/50">
              <p className="text-xs text-gray-500 mb-3">Confidence Breakdown</p>
              <div className="flex gap-2">
                {[
                  { label: 'High', value: data.reflectMetrics.confidenceBreakdown.high, color: 'emerald' },
                  { label: 'Med', value: data.reflectMetrics.confidenceBreakdown.medium, color: 'amber' },
                  { label: 'Low', value: data.reflectMetrics.confidenceBreakdown.low, color: 'gray' },
                ].map((item, i) => (
                  <div key={i} className={`flex-1 p-3 rounded-xl text-center bg-${item.color}-500/10`}>
                    <p className={`text-xs text-${item.color}-400`}>{item.label}</p>
                    <p className={`text-xl font-bold text-${item.color}-300`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20">
                  <Wrench className="w-5 h-5 text-orange-400" />
                </div>
                <h2 className="text-lg font-semibold">Skills</h2>
              </div>
              <span className="text-sm text-gray-500">{data.skills.length} installed</span>
            </div>

            <div className="space-y-3">
              {data.skills.map((skill, i) => (
                <SkillCard key={i} skill={skill} />
              ))}
            </div>
          </motion.div>

          {/* Ideas - Spans 2 cols */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                </div>
                <h2 className="text-lg font-semibold">Ideas & Opportunities</h2>
              </div>
              <span className="text-sm text-gray-500">{data.ideas.length} ideas</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.ideas.slice(0, 6).map((idea, i) => (
                <IdeaCard key={i} idea={idea} index={i} />
              ))}
            </div>
          </motion.div>

          {/* Cost & Activity */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20">
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-lg font-semibold">Cost Tracking</h2>
            </div>

            <div className="text-center py-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 mb-6">
              <p className="text-sm text-gray-400 mb-1">Estimated Today</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                ${data.costTracking.todayEstimatedCost.toFixed(2)}
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Model Distribution</p>
              {[
                { name: 'Opus', value: data.costTracking.modelDistribution.opus, color: 'purple' },
                { name: 'Sonnet', value: data.costTracking.modelDistribution.sonnet, color: 'blue' },
                { name: 'Haiku', value: data.costTracking.modelDistribution.haiku, color: 'emerald' },
              ].map((model, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-800/30">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-${model.color}-500`} />
                    <span className="text-sm text-gray-300">{model.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-400">{model.value} calls</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-gray-600">
            ClawdBot Command Center • Calford AI • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.footer>
      </div>
    </div>
  )
}
