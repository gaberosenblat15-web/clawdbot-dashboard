import { NextRequest, NextResponse } from 'next/server'

// Gateway config
const GATEWAY_URL = process.env.GATEWAY_URL || 'http://127.0.0.1:63362'
const GATEWAY_TOKEN = process.env.GATEWAY_TOKEN || 'QfVzNltK9encynTViC4jpdrZ5nnOc1k5'

// Session storage for conversation continuity
// In production, use Redis or similar
const sessionMessages: Map<string, Array<{role: string, content: string}>> = new Map()

async function sendToGateway(
  message: string, 
  sessionId: string = 'dashboard-default'
): Promise<string> {
  // Get or create conversation history
  let messages = sessionMessages.get(sessionId) || []
  
  // Add user message
  messages.push({ role: 'user', content: message })
  
  // Keep last 20 messages to avoid context overflow
  if (messages.length > 20) {
    messages = messages.slice(-20)
  }

  const response = await fetch(`${GATEWAY_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GATEWAY_TOKEN}`,
      'x-openclaw-agent-id': 'main'
    },
    body: JSON.stringify({
      model: 'openclaw:main',
      messages: messages,
      user: sessionId, // Provides session continuity in Gateway
      stream: false
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Gateway error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  
  // Extract assistant response
  const assistantContent = data.choices?.[0]?.message?.content || 'No response received'
  
  // Save to conversation history
  messages.push({ role: 'assistant', content: assistantContent })
  sessionMessages.set(sessionId, messages)

  return assistantContent
}

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    try {
      const response = await sendToGateway(message, sessionId || 'dashboard-default')
      return NextResponse.json({
        response,
        timestamp: new Date().toISOString(),
        source: 'gateway'
      })
    } catch (gatewayError: any) {
      console.error('Gateway error:', gatewayError.message)
      
      // Check if it's because the endpoint isn't enabled
      if (gatewayError.message.includes('404') || gatewayError.message.includes('Not Found')) {
        return NextResponse.json({
          response: `⚠️ **Chat API Not Enabled**\n\nThe OpenAI-compatible chat endpoint needs to be enabled on the Gateway.\n\nThis should have been configured automatically. Try refreshing in a moment.\n\n_Error: ${gatewayError.message}_`,
          timestamp: new Date().toISOString(),
          source: 'error'
        })
      }
      
      return NextResponse.json({
        response: `⚠️ **Gateway Connection Issue**\n\nCouldn't reach the OpenClaw Gateway.\n\n**Possible causes:**\n- Dashboard running on Vercel (use Cloudflare tunnel instead)\n- Gateway is restarting\n- Auth token mismatch\n\n_Error: ${gatewayError.message}_`,
        timestamp: new Date().toISOString(),
        source: 'fallback'
      })
    }
  } catch (error: any) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process message', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Health check - test if chat completions endpoint is available
  try {
    const check = await fetch(`${GATEWAY_URL}/v1/chat/completions`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GATEWAY_TOKEN}`
      },
      body: JSON.stringify({
        model: 'openclaw:main',
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 5
      }),
      signal: AbortSignal.timeout(10000)
    })
    
    return NextResponse.json({ 
      status: check.ok ? 'ok' : `error-${check.status}`,
      gateway: GATEWAY_URL,
      endpoint: '/v1/chat/completions',
      note: 'POST a message to chat'
    })
  } catch (e: any) {
    return NextResponse.json({ 
      status: 'gateway-unreachable',
      gateway: GATEWAY_URL,
      error: e.message,
      note: 'Gateway not reachable - use Cloudflare tunnel URL if on Vercel'
    })
  }
}

// Clear session history
export async function DELETE(request: NextRequest) {
  try {
    const { sessionId } = await request.json()
    if (sessionId) {
      sessionMessages.delete(sessionId)
    } else {
      sessionMessages.clear()
    }
    return NextResponse.json({ ok: true, message: 'Session cleared' })
  } catch {
    return NextResponse.json({ ok: true, message: 'Sessions cleared' })
  }
}
