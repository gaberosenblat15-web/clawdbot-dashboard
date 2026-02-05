'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  Server,
  MessageSquare,
  Cpu,
  HardDrive,
  Zap,
  RefreshCw,
  Loader2,
} from 'lucide-react'
import StatusIndicator, { StatusLevel } from '@/components/StatusIndicator'

interface SystemStatus {
  gateway: StatusLevel
  model: {
    name: string
    status: StatusLevel
  }
  channels: {
    name: string
    status: StatusLevel
    details?: string
  }[]
  tokenUsage: {
    used: number
    limit: number
    percentage: number
  }
  uptime: string
  version: string
}

export default function StatusPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/status')
      const data = await response.json()
      setStatus(data)
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Failed to fetch status:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 60000) // 1 minute
    return () => clearInterval(interval)
  }, [])

  const formatLastRefresh = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    )
  }

  if (!status) {
    return (
      <div className="px-4 py-6 max-w-5xl mx-auto">
        <div className="glass-card p-8 text-center">
          <p className="text-gray-400">Failed to load system status</p>
          <button
            onClick={fetchStatus}
            className="mt-4 px-4 py-2 rounded-lg bg-primary/10 text-primary-light hover:bg-primary/20 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">System Status</h1>
          <p className="text-gray-400 mt-1">
            ClawdBot health and connectivity
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Last updated: {formatLastRefresh(lastRefresh)}
          </div>
          <motion.button
            onClick={fetchStatus}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-primary/10 text-primary-light hover:bg-primary/20 transition-colors"
          >
            <RefreshCw size={20} />
          </motion.button>
        </div>
      </div>

      {/* Overall Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 mb-8"
      >
        <div className="flex items-center gap-4">
          <div
            className={`p-4 rounded-xl ${
              status.gateway === 'healthy'
                ? 'bg-accent/10'
                : status.gateway === 'warning'
                ? 'bg-yellow-400/10'
                : 'bg-red-500/10'
            }`}
          >
            <Activity
              size={32}
              className={
                status.gateway === 'healthy'
                  ? 'text-accent'
                  : status.gateway === 'warning'
                  ? 'text-yellow-400'
                  : 'text-red-500'
              }
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {status.gateway === 'healthy'
                ? 'All Systems Operational'
                : status.gateway === 'warning'
                ? 'Degraded Performance'
                : 'System Issues Detected'}
            </h2>
            <p className="text-gray-400 mt-1">
              Version {status.version} • Uptime: {status.uptime}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gateway Status */}
        <StatusIndicator
          label="OpenClaw Gateway"
          status={status.gateway}
          icon={Server}
          details="Core system connection"
        />

        {/* Model Status */}
        <StatusIndicator
          label="AI Model"
          status={status.model.status}
          value={status.model.name}
          icon={Cpu}
          details="Current inference model"
        />

        {/* Token Usage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-4 md:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Zap size={20} className="text-primary-light" />
              </div>
              <div>
                <h3 className="font-medium text-white">Token Usage</h3>
                <p className="text-sm text-gray-400">Current billing period</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-white">
              {status.tokenUsage.percentage}%
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="h-3 bg-surface-light rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${status.tokenUsage.percentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                status.tokenUsage.percentage < 50
                  ? 'bg-gradient-to-r from-accent to-accent-light'
                  : status.tokenUsage.percentage < 80
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-300'
                  : 'bg-gradient-to-r from-red-500 to-red-400'
              }`}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>{status.tokenUsage.used.toLocaleString()} tokens used</span>
            <span>{status.tokenUsage.limit.toLocaleString()} limit</span>
          </div>
        </motion.div>
      </div>

      {/* Connected Channels */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <MessageSquare size={20} className="text-primary-light" />
          Connected Channels
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {status.channels.map((channel, index) => (
            <motion.div
              key={channel.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card glass-card-hover p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white">{channel.name}</h3>
                  {channel.details && (
                    <p className="text-sm text-gray-400 mt-1">{channel.details}</p>
                  )}
                </div>
                <div
                  className={`w-3 h-3 rounded-full ${
                    channel.status === 'healthy'
                      ? 'bg-accent status-pulse'
                      : channel.status === 'warning'
                      ? 'bg-yellow-400'
                      : channel.status === 'offline'
                      ? 'bg-gray-500'
                      : 'bg-red-500'
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
