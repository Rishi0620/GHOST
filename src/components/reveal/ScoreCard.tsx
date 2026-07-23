'use client'

import { useStore } from '@/lib/store'
import type { RevealResponse } from '@/lib/types'

export function ScoreCard({ reveal }: { reveal: RevealResponse }) {
  const agentsById = useStore((s) => s.agentsById)
  const correct = reveal.results.filter((r) => r.correct).length
  const total = reveal.results.length
  const chancePoints = Math.round(reveal.maxScore * (10 / 15) * 0.5)
  const delta = reveal.score - chancePoints

  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-20">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-[var(--color-text-muted)]">
            Your score
          </p>
          <p className="mt-4 text-7xl font-bold tabular-nums text-[var(--color-text)]">
            {reveal.score}
            <span className="text-3xl text-[var(--color-text-muted)]"> / {reveal.maxScore}</span>
          </p>
          <p className="mt-6 text-lg text-[var(--color-text-secondary)]">
            You identified <span className="text-[var(--color-text)]">{correct} of {total}</span>{' '}
            correctly.
          </p>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Random guessing lands near {chancePoints} points.{' '}
            {delta > 6
              ? `You scored ${delta} above chance.`
              : delta < -6
                ? `You scored ${Math.abs(delta)} below chance.`
                : 'You scored at chance.'}
          </p>
        </div>

        {/* breakdown grid */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {reveal.results.map((r) => {
            const agent = agentsById.get(r.agentId)
            return (
              <div
                key={r.agentId}
                className={`rounded-lg border p-3 text-center ${
                  r.correct
                    ? 'border-[var(--color-deep)]/40 bg-[var(--color-deep)]/5'
                    : 'border-[var(--color-shell)]/40 bg-[var(--color-shell)]/5'
                }`}
              >
                <div className="truncate font-mono text-[11px] text-[var(--color-text-secondary)]">
                  @{agent?.username ?? '…'}
                </div>
                <div
                  className={`mt-1 font-mono text-xs font-semibold ${
                    r.correct ? 'text-[var(--color-deep)]' : 'text-[var(--color-shell)]'
                  }`}
                >
                  {r.correct ? '✓' : '✗'} {r.points >= 0 ? '+' : ''}
                  {r.points}
                </div>
                <div className="mt-1 text-[9px] uppercase tracking-wider text-[var(--color-text-muted)]">
                  said {r.guess === 'shell' ? 'synth' : 'real'} · {r.confidence}%
                </div>
              </div>
            )
          })}
        </div>

        <p className="mx-auto mt-12 max-w-lg text-center text-sm leading-relaxed text-[var(--color-text-secondary)]">
          You spent minutes with this network. You read their posts. You built
          opinions about who these people were. It moved your accuracy a few
          points off a coin flip.
        </p>
      </div>
    </section>
  )
}
