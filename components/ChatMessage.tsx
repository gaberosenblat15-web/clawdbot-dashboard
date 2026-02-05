'use client'

import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { Bot, User } from 'lucide-react'

interface ChatMessageProps {
  message: {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }
  isThinking?: boolean
}

export default function ChatMessage({ message, isThinking }: ChatMessageProps) {
  const isUser = message.role === 'user'
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-gradient-to-br from-primary to-primary-dark'
            : 'bg-gradient-to-br from-accent to-accent-dark'
        }`}
      >
        {isUser ? (
          <User size={20} className="text-white" />
        ) : (
          <Bot size={20} className="text-white" />
        )}
      </div>

      {/* Message bubble */}
      <div
        className={`max-w-[80%] md:max-w-[70%] ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        <div
          className={`glass-card p-4 ${
            isUser
              ? 'bg-gradient-to-br from-primary/20 to-primary-dark/10 border-primary/30'
              : 'bg-gradient-to-br from-surface-light/80 to-surface/80'
          }`}
        >
          {isThinking ? (
            <div className="flex items-center gap-2 text-gray-400">
              <span>ClawdBot is thinking</span>
              <span className="thinking-dots flex gap-1">
                <span className="w-2 h-2 bg-primary rounded-full" />
                <span className="w-2 h-2 bg-primary rounded-full" />
                <span className="w-2 h-2 bg-primary rounded-full" />
              </span>
            </div>
          ) : (
            <div className="markdown-content text-gray-100">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>
        
        {/* Timestamp */}
        <div
          className={`mt-1 text-xs text-gray-500 ${
            isUser ? 'text-right' : 'text-left'
          }`}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>
    </motion.div>
  )
}
