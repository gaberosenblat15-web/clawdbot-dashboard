'use client'

import { motion } from 'framer-motion'
import { Clock, CheckCircle, Loader2, CircleDashed } from 'lucide-react'

export interface Task {
  id: string
  name: string
  status: 'completed' | 'in_progress' | 'queued'
  startTime: Date
  endTime?: Date
  description?: string
}

interface TaskCardProps {
  task: Task
  index: number
}

export default function TaskCard({ task, index }: TaskCardProps) {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date)
  }

  const formatDuration = (start: Date, end?: Date) => {
    if (!end) return 'In progress...'
    const diff = end.getTime() - start.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
  }

  const statusConfig = {
    completed: {
      icon: CheckCircle,
      color: 'text-accent',
      bg: 'bg-accent/10',
      border: 'border-accent/30',
      label: 'Completed',
    },
    in_progress: {
      icon: Loader2,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
      border: 'border-yellow-400/30',
      label: 'In Progress',
    },
    queued: {
      icon: CircleDashed,
      color: 'text-gray-400',
      bg: 'bg-gray-400/10',
      border: 'border-gray-400/30',
      label: 'Queued',
    },
  }

  const config = statusConfig[task.status]
  const StatusIcon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`glass-card glass-card-hover p-4 ${config.border}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Status icon */}
          <div className={`p-2 rounded-lg ${config.bg} flex-shrink-0`}>
            <StatusIcon 
              size={20} 
              className={`${config.color} ${task.status === 'in_progress' ? 'animate-spin' : ''}`} 
            />
          </div>
          
          {/* Task info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-white truncate">{task.name}</h3>
            {task.description && (
              <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {formatTime(task.startTime)}
              </span>
              {task.status === 'completed' && (
                <span className="text-accent">
                  Duration: {formatDuration(task.startTime, task.endTime)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Status badge */}
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color} flex-shrink-0`}
        >
          {config.label}
        </span>
      </div>
    </motion.div>
  )
}
