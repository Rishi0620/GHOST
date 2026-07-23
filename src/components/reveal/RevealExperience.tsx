'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { NetworkGraph } from '@/components/network/NetworkGraph'
import { CommunityLegend } from '@/components/CommunityLegend'
import { ScoreCard } from './ScoreCard'
import { ShellTimeline } from './ShellTimeline'
import { RealWorldTest } from './RealWorldTest'

/**
 * The reveal, staged as a scroll:
 *   1. the network graph animates its shells red, one by one
 *   2. the score lands
 *   3. shell manipulation timelines become explorable
 *   4. the real-world test — same interface, no answers
 */
export function RevealExperience() {
  const router = useRouter()
  const data = useStore((s) => s.data)
  const reveal = useStore((s) => s.reveal)

  const allShellIds = useMemo(() => {
    if (!reveal) return []
    return Object.entries(reveal.agentTypes)
      .filter(([, t]) => t === 'shell')
      .map(([id]) => id)
  }, [reveal])

  const selectAgent = useStore((s) => s.selectAgent)
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const [phase, setPhase] = useState<'animating' | 'done'>('animating')

  // Clear any lingering selection so the reveal shows the whole network at full
  // brightness, not a dimmed neighborhood.
  useEffect(() => {
    selectAgent(null)
  }, [selectAgent])

  // Stagger shells turning red across the whole network.
  useEffect(() => {
    if (!reveal || allShellIds.length === 0) return
    setRevealed(new Set())
    setPhase('animating')
    let i = 0
    const interval = setInterval(() => {
      i++
      setRevealed(new Set(allShellIds.slice(0, i)))
      if (i >= allShellIds.length) {
        clearInterval(interval)
        setTimeout(() => setPhase('done'), 400)
      }
    }, 90)
    return () => clearInterval(interval)
  }, [reveal, allShellIds])

  // If the user lands here without having played, send them to classify.
  useEffect(() => {
    if (data && !reveal) router.replace('/classify')
  }, [data, reveal, router])

  if (!data || !reveal) return null

  const revealedCount = revealed.size

  return (
    <div className="min-h-screen">
      {/* Section 0: the animation + count */}
      <section className="relative h-screen">
        <CommunityLegend reveal />
        <div className="absolute inset-0">
          <NetworkGraph
            revealMode
            revealedShells={revealed}
            coordinationEdges={reveal.coordinationEdges}
          />
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-10 z-10 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-[var(--color-shell)]">
            Synthetic agents
          </p>
          <p className="mt-2 font-mono text-5xl font-bold text-[var(--color-text)] tabular-nums">
            {revealedCount}
            <span className="text-[var(--color-text-muted)]"> / {reveal.agentCount}</span>
          </p>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            {phase === 'animating'
              ? 'The network you were admiring, revealing itself.'
              : 'Thin red lines mark accounts that ran coordinated scripts.'}
          </p>
        </div>
        {phase === 'done' && (
          <div className="animate-ghost-fade-in pointer-events-none absolute inset-x-0 bottom-8 z-10 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
              ↓ scroll ↓
            </p>
          </div>
        )}
      </section>

      {/* Section A: score */}
      <ScoreCard reveal={reveal} />

      {/* Section B: shell timelines */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-center font-mono text-xs uppercase tracking-[0.4em] text-[var(--color-text-muted)]">
          How they did it
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-[var(--color-text-secondary)]">
          Every synthetic account you were shown, reconstructed move by move.
          Each step below was engineered before the network ever saw it.
        </p>
        <div className="mt-12 space-y-5">
          {reveal.shellProfiles.map((profile) => (
            <ShellTimeline key={profile.agentId} profile={profile} reveal={reveal} />
          ))}
        </div>
      </section>

      {/* Section C: the real world */}
      <RealWorldTest reveal={reveal} />
    </div>
  )
}
