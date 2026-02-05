import { NextResponse } from 'next/server'

// Mock status data for demo purposes
// In production, this will connect to OpenClaw Gateway
const mockStatus = {
  gateway: 'healthy' as const,
  model: {
    name: 'Claude Opus 4',
    status: 'healthy' as const,
  },
  channels: [
    {
      name: 'Telegram',
      status: 'healthy' as const,
      details: '@ClawdBot connected',
    },
    {
      name: 'Discord',
      status: 'healthy' as const,
      details: '3 servers active',
    },
    {
      name: 'Slack',
      status: 'offline' as const,
      details: 'Not configured',
    },
    {
      name: 'Email',
      status: 'healthy' as const,
      details: 'IMAP connected',
    },
    {
      name: 'WhatsApp',
      status: 'warning' as const,
      details: 'Session expiring soon',
    },
    {
      name: 'Web Chat',
      status: 'healthy' as const,
      details: 'This dashboard',
    },
  ],
  tokenUsage: {
    used: 847523,
    limit: 2000000,
    percentage: 42,
  },
  uptime: '14d 7h 23m',
  version: '1.2.0',
}

export async function GET() {
  try {
    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 200))

    // In production, this would call:
    // const response = await fetch('http://localhost:3210/api/status')
    // const status = await response.json()

    return NextResponse.json(mockStatus)
  } catch (error) {
    console.error('Status API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch status' },
      { status: 500 }
    )
  }
}
