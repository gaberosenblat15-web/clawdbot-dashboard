'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, Trash2 } from 'lucide-react'
import ChatMessage from '@/components/ChatMessage'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string // Changed to string for JSON serialization
}

const STORAGE_KEY = 'clawdbot-chat-history'
const SESSION_ID = 'dashboard-default'

const welcomeMessage: Message = {
  id: 'welcome',
  role: 'assistant',
  content: "👋 Hey Gabe! I'm **ClawdBot**, your AI Chief of Staff.\n\nThis chat connects directly to me — same brain as Telegram and webchat. Your conversation history persists even when you switch tabs.\n\nWhat do you need?",
  timestamp: new Date().toISOString(),
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Load messages from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed)
        }
      }
    } catch (e) {
      console.error('Failed to load chat history:', e)
    }
    setIsLoaded(true)
  }, [])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (isLoaded && messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
      } catch (e) {
        console.error('Failed to save chat history:', e)
      }
    }
  }, [messages, isLoaded])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isThinking, scrollToBottom])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isThinking) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsThinking(true)

    // Resize textarea back to normal
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input.trim(),
          sessionId: SESSION_ID 
        }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "⚠️ Couldn't reach ClawdBot. Check your connection or try again.",
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsThinking(false)
    }
  }

  const handleClearHistory = async () => {
    if (confirm('Clear chat history? This cannot be undone.')) {
      setMessages([welcomeMessage])
      localStorage.removeItem(STORAGE_KEY)
      // Also clear server-side session
      try {
        await fetch('/api/chat', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: SESSION_ID }),
        })
      } catch (e) {
        // Ignore errors
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    // Auto-resize textarea
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px'
  }

  // Don't render until we've loaded from localStorage to prevent flash
  if (!isLoaded) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] items-center justify-center">
        <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header with clear button */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
        <span className="text-sm text-gray-500">
          {messages.length - 1} messages
        </span>
        <button
          onClick={handleClearHistory}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-500/10"
        >
          <Trash2 size={14} />
          Clear
        </button>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isThinking && (
              <ChatMessage
                key="thinking"
                message={{
                  id: 'thinking',
                  role: 'assistant',
                  content: '',
                  timestamp: new Date().toISOString(),
                }}
                isThinking
              />
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-primary/20 bg-surface-dark/80 backdrop-blur-lg p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="glass-card flex items-end gap-2 p-2 pr-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Message ClawdBot..."
                className="flex-1 bg-transparent border-none outline-none resize-none text-white placeholder-gray-500 px-3 py-2 max-h-[200px] min-h-[44px]"
                rows={1}
                disabled={isThinking}
              />
              <motion.button
                type="submit"
                disabled={!input.trim() || isThinking}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-xl transition-all ${
                  input.trim() && !isThinking
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-glow'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isThinking ? (
                  <Sparkles size={20} className="animate-pulse" />
                ) : (
                  <Send size={20} />
                )}
              </motion.button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </form>
      </div>
    </div>
  )
}
