'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Send, Key, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [step, setStep] = useState<'initial' | 'code' | 'success'>('initial')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const requestCode = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/send-code', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setStep('code')
      } else {
        setError(data.error || 'Failed to send code')
      }
    } catch (e) {
      setError('Failed to send code')
    } finally {
      setLoading(false)
    }
  }

  const verifyCode = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })
      const data = await res.json()
      if (data.success) {
        setStep('success')
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 1500)
      } else {
        setError(data.error || 'Invalid code')
      }
    } catch (e) {
      setError('Verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#08080c] flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 p-[2px]">
              <div className="w-full h-full rounded-2xl bg-[#08080c] flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">Dashboard Access</h1>
            <p className="text-gray-400 mt-2 text-sm">Authenticate via Telegram</p>
          </div>

          {/* Step: Initial */}
          {step === 'initial' && (
            <div className="space-y-4">
              <p className="text-gray-300 text-center text-sm">
                Click below to receive a one-time code on your Telegram
              </p>
              <button
                onClick={requestCode}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Code to Telegram
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step: Enter Code */}
          {step === 'code' && (
            <div className="space-y-4">
              <p className="text-gray-300 text-center text-sm">
                Enter the 6-digit code sent to your Telegram
              </p>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full py-3 px-4 pl-12 rounded-xl bg-gray-800/50 border border-gray-700/50 text-white text-center text-2xl font-mono tracking-[0.5em] placeholder:tracking-[0.5em] placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50"
                  maxLength={6}
                />
              </div>
              <button
                onClick={verifyCode}
                disabled={loading || code.length !== 6}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Verify Code'
                )}
              </button>
              <button
                onClick={() => setStep('initial')}
                className="w-full py-2 text-gray-400 text-sm hover:text-white transition-colors"
              >
                Request new code
              </button>
            </div>
          )}

          {/* Step: Success */}
          {step === 'success' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-emerald-400 font-medium">Access Granted!</p>
              <p className="text-gray-400 text-sm">Redirecting to dashboard...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}
        </div>

        <p className="text-center text-gray-600 text-xs mt-4">
          ClawdBot Command Center • Secured Access
        </p>
      </motion.div>
    </div>
  )
}
