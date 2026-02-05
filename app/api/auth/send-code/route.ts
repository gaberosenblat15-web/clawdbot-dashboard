import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// Telegram config - Gabe's details
const TELEGRAM_BOT_TOKEN = '8410375469:AAFcQvzJ83uvxjUyEuMjdO-q2doTe1Osdhs'
const TELEGRAM_CHAT_ID = '6341788424'

// Code storage path
const CODE_FILE = '/tmp/dashboard_auth_code.json'

async function sendTelegramMessage(message: string) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    })
  })
  return response.ok
}

export async function POST() {
  try {
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = Date.now() + 5 * 60 * 1000 // 5 minutes

    // Store code
    await fs.writeFile(CODE_FILE, JSON.stringify({ code, expiresAt }))

    // Send to Telegram
    const message = `🔐 *Dashboard Access Code*\n\nYour one-time code: \`${code}\`\n\nExpires in 5 minutes.`
    const sent = await sendTelegramMessage(message)

    if (!sent) {
      return NextResponse.json({ success: false, error: 'Failed to send Telegram message' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Send code error:', error)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}
