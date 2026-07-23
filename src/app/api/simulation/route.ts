import { NextResponse } from 'next/server'
import { getPublicSimulation } from '@/lib/simulation'

/** Static payload — the type/objective fields are stripped server-side. */
export async function GET() {
  const data = getPublicSimulation()
  return NextResponse.json(data)
}
