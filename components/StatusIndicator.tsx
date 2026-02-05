'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

export type StatusLevel = 'healthy' | 'warning' | 'error' | 'offline'

interface StatusIndicatorProps {
  label: string
  status: StatusLevel
  value?: string
  icon?: LucideIcon
  details?: string
}

export default function StatusIndicator({
  label,
  status,
  value,
  icon: Icon,
  details,
}: StatusIndicatorProps) {
  const statusConfig = {
    healthy: {
      color: 'bg-accent',
      text: 'text-accent',
      glow: 'shadow-[0_0_10px_rgba(56,161,105,0.5)]',
      label: 'Healthy',
    },
    warning: {
      color: 'bg-yellow-400',
      text: 'text-yellow-400',
      glow: 'shadow-[0_0_10px_rgba(250,204,21,0.5)]',
      label: 'Warning',
    },
    error: {
      color: 'bg-red-500',
      text: 'text-red-500',
      glow: 'shadow-[0_0_10px_rgba(239,68,68,0.5)]',
      label: 'Error',
    },
    offline: {
      color: 'bg-gray-500',
      text: 'text-gray-500',
      glow: '',
      label: 'Offline',
    },
  }

  const config = statusConfig[status]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card glass-card-hover p-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon size={20} className="text-primary-light" />
            </div>
          )}
          <div>
            <h3 className="font-medium text-white">{label}</h3>
            {value && <p className="text-2xl font-bold text-white mt-1">{value}</p>}
            {details && <p className="text-sm text-gray-400 mt-1">{details}</p>}
          </div>
        </div>
        
        {/* Status indicator dot */}
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium ${config.text}`}>
            {config.label}
          </span>
          <motion.div
            animate={status === 'healthy' ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-3 h-3 rounded-full ${config.color} ${config.glow}`}
          />
        </div>
      </div>
    </motion.div>
  )
}
