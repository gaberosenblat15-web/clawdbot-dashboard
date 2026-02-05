import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import { cookies } from 'next/headers'

const CODE_FILE = '/tmp/dashboard_auth_code.json'
const AUTH_SECRET = 'clawdbot_dashboard_' + Date.now().toString(36) + Math.random().toString(36).slice(2)

// Store the secret for session validation
const SECRET_FILE = '/tmp/dashboard_auth_secret.txt'

export async function POST(request: Request) {
  try {
    const { code } = await request.json()

    if (!code || code.length !== 6) {
      return NextResponse.json({ success: false, error: 'Invalid code format' }, { status: 400 })
    }

    // Read stored code
    let storedData
    try {
      const data = await fs.readFile(CODE_FILE, 'utf-8')
      storedData = JSON.parse(data)
    } catch {
      return NextResponse.json({ success: false, error: 'No code requested. Please request a new code.' }, { status: 400 })
    }

    // Check expiration
    if (Date.now() > storedData.expiresAt) {
      return NextResponse.json({ success: false, error: 'Code expired. Please request a new code.' }, { status: 400 })
    }

    // Verify code
    if (code !== storedData.code) {
      return NextResponse.json({ success: false, error: 'Incorrect code' }, { status: 400 })
    }

    // Generate session token
    const sessionToken = AUTH_SECRET
    
    // Store secret for middleware validation
    await fs.writeFile(SECRET_FILE, sessionToken)

    // Delete used code
    await fs.unlink(CODE_FILE).catch(() => {})

    // Set cookie
    const response = NextResponse.json({ success: true })
    response.cookies.set('dashboard_auth', sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}
