import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Skip auth for all API routes (APIs handle their own auth)
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }
  
  // Skip for login page
  if (request.nextUrl.pathname === '/login') {
    return NextResponse.next()
  }
  
  // Skip for static assets
  if (request.nextUrl.pathname.startsWith('/_next') || 
      request.nextUrl.pathname.startsWith('/favicon')) {
    return NextResponse.next()
  }

  // Check for auth cookie
  const authToken = request.cookies.get('dashboard_auth')?.value
  
  if (!authToken) {
    // Redirect to login page
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Token exists - allow access (token validation happens server-side)
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
