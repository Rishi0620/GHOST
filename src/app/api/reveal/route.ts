import { NextResponse } from 'next/server'
import { z } from 'zod'
import { scoreClassifications } from '@/lib/simulation'

const schema = z.object({
  classifications: z
    .array(
      z.object({
        agentId: z.string(),
        guess: z.enum(['deep', 'shell']),
        confidence: z.number().min(0).max(100),
      }),
    )
    .min(1)
    .max(10),
})

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid classifications', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const reveal = scoreClassifications(parsed.data.classifications)
  return NextResponse.json(reveal)
}
