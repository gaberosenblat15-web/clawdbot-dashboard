'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, AlertCircle, ArrowUpRight, BarChart3, Bot, Brain,
  CheckCircle2, ChevronRight, Clock, Cpu, DollarSign, 
  Gauge, GitBranch, Lightbulb, ListTodo, MessageSquare,
  RefreshCw, Rocket, Server, Sparkles, Target, Terminal,
  TrendingUp, Wrench, Zap, Circle, ArrowDown, ArrowUp
} from 'lucide-react'

interface DashboardData {
  timestamp: string
  lastSync: string
  sessionStats: {
    currentModel: string
    contextUsed: number
    contextMax: number
    contextPercent: number
    compactions: number
    sessionId: string
  }
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
    autoReflectEnabled: boolean
    confidenceBreakdown: { high: number; medium: number; low: number }
    skillsCreated: number
  }
  skills: Array<{
    name: string
    status: 'active' | 'needs-setup'
    description: string
    version: string
  }>
  ideas: string[]
  recentActivity: Array<{ date: string; summary: string }>
  costTracking: {
    todayTokensIn: number
    todayTokensOut: number
    todayEstimatedCost: number
    modelDistribution: {
      opus: { calls: number; tokens: number; cost: number }
      sonnet: { calls: number; tokens: number; cost: number }
      haiku: { calls: number; tokens: number; cost: number }
    }
    weeklySpend: number
    monthlyBudget: number
  }
  systemHealth: {
    status: string
    uptime: string
    lastHeartbeat: string
    activeChannels: string[]
    pendingAlerts: number
  }
}

// Animated number component
const AnimatedNumber = ({ value, prefix = '', suffix = '', decimals = 0 }: { value: number; prefix?: string; suffix?: string; decimals?: number }) => {
  const [displayValue, setDisplayValue] = useState(0)
  
  useEffect(() => {
    const duration = 1000
    const steps = 30
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(current)
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [value])
  
  return <span>{prefix}{displayValue.toFixed(decimals)}{suffix}</span>
}

// Progress ring component
const ProgressRing = ({ percent, size = 120, strokeWidth = 8, color = '#8b5cf6' }: { percent: number; size?: number; strokeWidth?: number; color?: string }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percent / 100) * circumference
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-mono font-bold text-white">{percent}%</span>
      </div>
    </div>
  )
}

// Metric card with trend
const MetricCard = ({ 
  icon: Icon, 
  label, 
  value, 
  subValue,
  trend,
  trendUp,
  color = 'purple'
}: { 
  icon: any
  label: string
  value: string | number
  subValue?: string
  trend?: string
  trendUp?: boolean
  color?: 'purple' | 'emerald' | 'amber' | 'blue' | 'rose'
}) => {
  const colorMap = {
    purple: { bg: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/30', icon: 'text-purple-400', glow: 'shadow-purple-500/20' },
    emerald: { bg: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/30', icon: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
    amber: { bg: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/30', icon: 'text-amber-400', glow: 'shadow-amber-500/20' },
    blue: { bg: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/30', icon: 'text-blue-400', glow: 'shadow-blue-500/20' },
    rose: { bg: 'from-rose-500/20 to-rose-600/10', border: 'border-rose-500/30', icon: 'text-rose-400', glow: 'shadow-rose-500/20' },
  }
  const c = colorMap[color]
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: `0 20px 40px -10px ${c.glow}` }}
      className={`relative bg-gradient-to-br ${c.bg} backdrop-blur-xl border ${c.border} rounded-2xl p-5 overflow-hidden transition-all duration-300`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl bg-black/20 ${c.icon}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-full ${
            trendUp ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
          }`}>
            {trendUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {trend}
          </div>
        )}
      </div>
      <div className="font-mono">
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
      </div>
      <p className="text-sm text-gray-400 mt-2">{label}</p>
    </motion.div>
  )
}

// Live status indicator
const LiveIndicator = ({ status }: { status: string }) => (
  <div className="flex items-center gap-2">
    <span className="relative flex h-2.5 w-2.5">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
        status === 'operational' ? 'bg-emerald-400' : 'bg-amber-400'
      }`}></span>
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
        status === 'operational' ? 'bg-emerald-500' : 'bg-amber-500'
      }`}></span>
    </span>
    <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
      {status}
    </span>
  </div>
)

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchData = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const res = await fetch('/api/dashboard')
      const json = await res.json()
      setData(json)
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Failed to fetch:', error)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [fetchData])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080c] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 p-[2px]"
            >
              <div className="w-full h-full rounded-2xl bg-[#08080c] flex items-center justify-center">
                <Bot className="w-8 h-8 text-purple-400" />
              </div>
            </motion.div>
          </div>
          <div className="text-center">
            <p className="text-white font-medium">Loading Command Center</p>
            <p className="text-gray-500 text-sm font-mono">Initializing systems...</p>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!data) return null

  const totalTasks = data.taskQueue.ready.length + data.taskQueue.inProgress.length + 
                     data.taskQueue.blocked.length + data.taskQueue.doneToday.length
  
  const totalTokens = data.costTracking.todayTokensIn + data.costTracking.todayTokensOut
  const totalCalls = data.costTracking.modelDistribution.opus.calls + 
                     data.costTracking.modelDistribution.sonnet.calls + 
                     data.costTracking.modelDistribution.haiku.calls

  return (
    <div className="min-h-screen bg-[#08080c] text-white">
      {/* Subtle grid background */}
      <div 
        className="fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Gradient orbs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 p-6 lg:p-8 max-w-[1800px] mx-auto">
        
        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <motion.div 
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              className="relative"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 p-[2px]">
                <div className="w-full h-full rounded-2xl bg-[#08080c] flex items-center justify-center">
                  <Rocket className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#08080c] flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            </motion.div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
                ClawdBot <span className="text-purple-400">Command Center</span>
              </h1>
              <div className="flex items-center gap-4 mt-1">
                <LiveIndicator status={data.systemHealth.status} />
                <span className="text-xs font-mono text-gray-500">
                  v2026.2.2 • {data.sessionStats.currentModel}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-500 font-mono">Last sync</p>
              <p className="text-sm text-gray-300 font-mono">
                {new Date(data.lastSync).toLocaleTimeString()}
              </p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchData}
              disabled={isRefreshing}
              className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-purple-400' : 'text-gray-400'}`} />
            </motion.button>
          </div>
        </header>

        {/* Top Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <MetricCard 
            icon={MessageSquare} 
            label="LLM Calls Today" 
            value={totalCalls}
            subValue={`${data.costTracking.modelDistribution.opus.calls} opus`}
            color="purple"
          />
          <MetricCard 
            icon={Cpu} 
            label="Tokens Used" 
            value={`${(totalTokens / 1000).toFixed(0)}k`}
            subValue={`${(data.costTracking.todayTokensIn / 1000).toFixed(0)}k in • ${(data.costTracking.todayTokensOut / 1000).toFixed(0)}k out`}
            color="blue"
          />
          <MetricCard 
            icon={DollarSign} 
            label="Cost Today" 
            value={`$${data.costTracking.todayEstimatedCost.toFixed(2)}`}
            subValue={`$${data.costTracking.monthlyBudget} budget`}
            trend="2.5%"
            trendUp={false}
            color="emerald"
          />
          <MetricCard 
            icon={CheckCircle2} 
            label="Tasks Done" 
            value={data.taskQueue.doneToday.length}
            subValue={`${totalTasks} total`}
            trend="+14"
            trendUp={true}
            color="emerald"
          />
          <MetricCard 
            icon={Wrench} 
            label="Active Skills" 
            value={data.skills.filter(s => s.status === 'active').length}
            subValue={`${data.skills.length} installed`}
            color="amber"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Context & Model - Left sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Context Usage */}
            <div className="bg-white/[0.02] backdrop-blur border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Gauge className="w-5 h-5 text-purple-400" />
                <h3 className="font-semibold">Context Window</h3>
              </div>
              <div className="flex justify-center mb-4">
                <ProgressRing 
                  percent={data.sessionStats.contextPercent} 
                  color={data.sessionStats.contextPercent > 80 ? '#f43f5e' : '#8b5cf6'}
                />
              </div>
              <div className="text-center">
                <p className="font-mono text-lg text-white">
                  {(data.sessionStats.contextUsed / 1000).toFixed(0)}k / {(data.sessionStats.contextMax / 1000).toFixed(0)}k
                </p>
                <p className="text-xs text-gray-500 mt-1">tokens used</p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Compactions</span>
                  <span className="font-mono text-white">{data.sessionStats.compactions}</span>
                </div>
              </div>
            </div>

            {/* Model Distribution */}
            <div className="bg-white/[0.02] backdrop-blur border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold">Model Usage</h3>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Opus', data: data.costTracking.modelDistribution.opus, color: 'purple' },
                  { name: 'Sonnet', data: data.costTracking.modelDistribution.sonnet, color: 'blue' },
                  { name: 'Haiku', data: data.costTracking.modelDistribution.haiku, color: 'emerald' },
                ].map((model) => (
                  <div key={model.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">{model.name}</span>
                      <span className="font-mono text-white">{model.data.calls} calls</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((model.data.calls / Math.max(totalCalls, 1)) * 100, 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full bg-${model.color}-500`}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 font-mono">
                      ${model.data.cost.toFixed(2)} • {(model.data.tokens / 1000).toFixed(0)}k tokens
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white/[0.02] backdrop-blur border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Server className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold">System Health</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Uptime</span>
                  <span className="font-mono text-emerald-400">{data.systemHealth.uptime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Channels</span>
                  <div className="flex gap-1">
                    {data.systemHealth.activeChannels.map(ch => (
                      <span key={ch} className="text-xs bg-white/10 px-2 py-0.5 rounded font-mono">{ch}</span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Alerts</span>
                  <span className={`font-mono ${data.systemHealth.pendingAlerts > 0 ? 'text-amber-400' : 'text-gray-500'}`}>
                    {data.systemHealth.pendingAlerts}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Center - Tasks & Activity */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Task Queue */}
            <div className="bg-white/[0.02] backdrop-blur border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  <h3 className="font-semibold">Task Queue</h3>
                </div>
                <span className="text-xs font-mono text-gray-500">{totalTasks} total</span>
              </div>

              <div className="space-y-6">
                {/* Ready */}
                {data.taskQueue.ready.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-sm font-medium text-blue-400">Ready</span>
                      <span className="text-xs font-mono text-gray-500">{data.taskQueue.ready.length}</span>
                    </div>
                    {data.taskQueue.ready.map((task, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 mb-2">
                        <Circle className="w-4 h-4 text-blue-400 mt-0.5" />
                        <span className="text-sm text-gray-300">{task}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Blocked */}
                {data.taskQueue.blocked.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-sm font-medium text-amber-400">Blocked</span>
                      <span className="text-xs font-mono text-gray-500">{data.taskQueue.blocked.length}</span>
                    </div>
                    {data.taskQueue.blocked.map((task, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 mb-2">
                        <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5" />
                        <span className="text-sm text-gray-300">{task}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Done */}
                {data.taskQueue.doneToday.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-sm font-medium text-emerald-400">Done Today</span>
                      <span className="text-xs font-mono text-gray-500">{data.taskQueue.doneToday.length}</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-1 pr-2">
                      {data.taskQueue.doneToday.map((task, i) => (
                        <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                          <span className="text-sm text-gray-400">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Ideas */}
            <div className="bg-white/[0.02] backdrop-blur border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  <h3 className="font-semibold">Ideas & Opportunities</h3>
                </div>
                <span className="text-xs font-mono text-gray-500">{data.ideas.length}</span>
              </div>
              <div className="space-y-2">
                {data.ideas.slice(0, 5).map((idea, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-amber-500/5 border border-transparent hover:border-amber-500/20 transition-all cursor-pointer group"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400/50 group-hover:text-amber-400 transition-colors mt-0.5" />
                    <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">{idea}</span>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-amber-400 ml-auto transition-colors" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right - Skills & Learning */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 space-y-6"
          >
            {/* Self-Learning */}
            <div className="bg-white/[0.02] backdrop-blur border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-pink-400" />
                  <h3 className="font-semibold">Self-Learning</h3>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-mono ${
                  data.reflectMetrics.autoReflectEnabled 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {data.reflectMetrics.autoReflectEnabled ? 'AUTO ON' : 'MANUAL'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 rounded-xl bg-white/5">
                  <p className="text-3xl font-mono font-bold text-white">{data.reflectMetrics.totalSessionsAnalyzed}</p>
                  <p className="text-xs text-gray-500 mt-1">Sessions</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5">
                  <p className="text-3xl font-mono font-bold text-white">{data.reflectMetrics.totalSignalsDetected}</p>
                  <p className="text-xs text-gray-500 mt-1">Signals</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5">
                  <p className="text-3xl font-mono font-bold text-white">{data.reflectMetrics.totalChangesAccepted}</p>
                  <p className="text-xs text-gray-500 mt-1">Accepted</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-3xl font-mono font-bold text-emerald-400">{data.reflectMetrics.acceptanceRate}%</p>
                  <p className="text-xs text-gray-500 mt-1">Rate</p>
                </div>
              </div>

              <div className="flex gap-2">
                {[
                  { label: 'High', value: data.reflectMetrics.confidenceBreakdown.high, color: 'emerald' },
                  { label: 'Med', value: data.reflectMetrics.confidenceBreakdown.medium, color: 'amber' },
                  { label: 'Low', value: data.reflectMetrics.confidenceBreakdown.low, color: 'gray' },
                ].map((item) => (
                  <div key={item.label} className={`flex-1 p-3 rounded-xl text-center bg-${item.color}-500/10`}>
                    <p className={`text-xs text-${item.color}-400`}>{item.label}</p>
                    <p className={`text-xl font-mono font-bold text-${item.color}-300`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white/[0.02] backdrop-blur border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-orange-400" />
                  <h3 className="font-semibold">Installed Skills</h3>
                </div>
                <span className="text-xs font-mono text-gray-500">{data.skills.length}</span>
              </div>

              <div className="space-y-2">
                {data.skills.map((skill, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      skill.status === 'active' ? 'bg-emerald-500/20' : 'bg-amber-500/20'
                    }`}>
                      <Terminal className={`w-4 h-4 ${
                        skill.status === 'active' ? 'text-emerald-400' : 'text-amber-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-white truncate">{skill.name}</p>
                      <p className="text-xs text-gray-500 truncate">{skill.description}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded font-mono ${
                      skill.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {skill.status === 'active' ? 'ACTIVE' : 'SETUP'}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/[0.02] backdrop-blur border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold">Recent Activity</h3>
              </div>
              <div className="space-y-3">
                {data.recentActivity.map((activity, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/5">
                    <p className="text-xs font-mono text-cyan-400 mb-1">{activity.date}</p>
                    <p className="text-sm text-gray-300">{activity.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-gray-600 font-mono">
            ClawdBot Command Center • Calford AI • Data synced {new Date(data.lastSync).toLocaleString()}
          </p>
        </footer>
      </div>
    </div>
  )
}

// Missing Check icon
const Check = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
)
