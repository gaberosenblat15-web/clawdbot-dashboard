import { NextResponse } from 'next/server'
import staticData from '../../../data/dashboard-data.json'

export async function GET() {
  // Return the static data with current timestamp
  return NextResponse.json({
    ...staticData,
    timestamp: new Date().toISOString(),
  })
}
