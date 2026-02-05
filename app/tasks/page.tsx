'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, CheckCircle2, Loader2, Clock } from 'lucide-react'
import TaskCard, { Task } from '@/components/TaskCard'

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [autoRefresh, setAutoRefresh] = useState(true)

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks')
      const data = await response.json()
      
      // Convert date strings back to Date objects
      const tasksWithDates = data.tasks.map((task: any) => ({
        ...task,
        startTime: new Date(task.startTime),
        endTime: task.endTime ? new Date(task.endTime) : undefined,
      }))
      
      setTasks(tasksWithDates)
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  useEffect(() => {
    if (!autoRefresh) return
    
    const interval = setInterval(fetchTasks, 30000) // 30 seconds
    return () => clearInterval(interval)
  }, [autoRefresh])

  const completedTasks = tasks.filter((t) => t.status === 'completed')
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress')
  const queuedTasks = tasks.filter((t) => t.status === 'queued')

  const formatLastRefresh = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(date)
  }

  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Tasks Dashboard</h1>
          <p className="text-gray-400 mt-1">
            Monitor ClawdBot's work in real-time
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Last updated: {formatLastRefresh(lastRefresh)}
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4 rounded bg-surface border-primary/30 text-primary focus:ring-primary"
            />
            Auto-refresh
          </label>
          <motion.button
            onClick={fetchTasks}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-primary/10 text-primary-light hover:bg-primary/20 transition-colors"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </motion.button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* In Progress Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Loader2 size={20} className="text-yellow-400 animate-spin" />
              <h2 className="text-xl font-semibold text-white">
                In Progress
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 text-sm">
                {inProgressTasks.length}
              </span>
            </div>
            {inProgressTasks.length === 0 ? (
              <div className="glass-card p-6 text-center text-gray-500">
                No tasks currently running
              </div>
            ) : (
              <div className="space-y-3">
                {inProgressTasks.map((task, index) => (
                  <TaskCard key={task.id} task={task} index={index} />
                ))}
              </div>
            )}
          </section>

          {/* Queued Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Clock size={20} className="text-gray-400" />
              <h2 className="text-xl font-semibold text-white">Queued</h2>
              <span className="px-2 py-0.5 rounded-full bg-gray-400/10 text-gray-400 text-sm">
                {queuedTasks.length}
              </span>
            </div>
            {queuedTasks.length === 0 ? (
              <div className="glass-card p-6 text-center text-gray-500">
                No tasks in queue
              </div>
            ) : (
              <div className="space-y-3">
                {queuedTasks.map((task, index) => (
                  <TaskCard key={task.id} task={task} index={index} />
                ))}
              </div>
            )}
          </section>

          {/* Completed Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={20} className="text-accent" />
              <h2 className="text-xl font-semibold text-white">
                Completed
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-sm">
                {completedTasks.length}
              </span>
            </div>
            {completedTasks.length === 0 ? (
              <div className="glass-card p-6 text-center text-gray-500">
                No completed tasks yet
              </div>
            ) : (
              <div className="space-y-3">
                {completedTasks.map((task, index) => (
                  <TaskCard key={task.id} task={task} index={index} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
