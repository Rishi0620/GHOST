'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import type { AgentType, RevealResponse } from '@/lib/types'
import { REAL_WORLD_ACCOUNTS } from '@/lib/realWorldAccounts'

export function RealWorldTest({ reveal }: { reveal: RevealResponse }) {
  const router = useRouter()
  const resetGame = useStore((s) => s.resetGame)
  const [verdicts, setVerdicts] = useState<Record<string, AgentType>>({})

  const decided = Object.keys(verdicts).length
  const done = decided === REAL_WORLD_ACCOUNTS.length

  return (
    <section className="border-t border-[var(--color-border)] bg-[var(--color-bg)] px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center font-mono text-xs uppercase tracking-[0.4em] text-[var(--color-text-muted)]">
          Now the real world
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-[var(--color-text-secondary)]">
          Ten accounts written to resemble what actually circulates online. Some
          are people. Some are not. Some are people who post like machines. Some
          are machines built to post like people. Same game. Same interface.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {REAL_WORLD_ACCOUNTS.map((acc) => {
            const verdict = verdicts[acc.id]
            return (
              <div
                key={acc.id}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[var(--color-text)]">{acc.displayName}</div>
                    <div className="font-mono text-xs text-[var(--color-text-secondary)]">
                      @{acc.handle} · {acc.followers} followers
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {acc.posts.map((p, i) => (
                    <p
                      key={i}
                      className="rounded border border-[var(--color-border)] bg-[var(--color-bg)]/40 px-3 py-2 text-sm text-[var(--color-text-secondary)]"
                    >
                      {p}
                    </p>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setVerdicts((v) => ({ ...v, [acc.id]: 'deep' }))}
                    className="rounded-md border py-2 font-mono text-[11px] uppercase tracking-widest transition-all"
                    style={{
                      borderColor: verdict === 'deep' ? 'var(--color-deep)' : 'var(--color-border)',
                      color: verdict === 'deep' ? 'var(--color-deep)' : 'var(--color-text-muted)',
                      background:
                        verdict === 'deep' ? 'color-mix(in srgb, var(--color-deep) 12%, transparent)' : 'transparent',
                    }}
                  >
                    Real
                  </button>
                  <button
                    onClick={() => setVerdicts((v) => ({ ...v, [acc.id]: 'shell' }))}
                    className="rounded-md border py-2 font-mono text-[11px] uppercase tracking-widest transition-all"
                    style={{
                      borderColor: verdict === 'shell' ? 'var(--color-shell)' : 'var(--color-border)',
                      color: verdict === 'shell' ? 'var(--color-shell)' : 'var(--color-text-muted)',
                      background:
                        verdict === 'shell' ? 'color-mix(in srgb, var(--color-shell) 12%, transparent)' : 'transparent',
                    }}
                  >
                    Synthetic
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* final screen */}
        <div
          className={`mt-16 rounded-2xl border p-10 text-center transition-all duration-700 ${
            done
              ? 'border-[var(--color-border-bright)] bg-[var(--color-surface)] opacity-100'
              : 'border-[var(--color-border)] opacity-60'
          }`}
        >
          {done ? (
            <div className="animate-ghost-fade-in">
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-[var(--color-text-muted)]">
                No answers will be given
              </p>
              <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-[var(--color-text)]">
                You just classified ten accounts and no score will appear.
              </p>
              <p className="mx-auto mt-4 max-w-lg leading-relaxed text-[var(--color-text-secondary)]">
                The network you played had {reveal.shellCount} synthetic accounts.
                You caught {reveal.results.filter((r) => r.actual === 'shell' && r.correct).length}{' '}
                of the {reveal.results.filter((r) => r.actual === 'shell').length} you were tested on.
                Out here, the real number is unknown, unlabeled, and not counting itself for you.
              </p>
              <p className="mx-auto mt-6 max-w-lg text-sm italic text-[var(--color-text-muted)]">
                You already know why no answer is coming.
              </p>
            </div>
          ) : (
            <p className="font-mono text-sm text-[var(--color-text-muted)]">
              {decided}/{REAL_WORLD_ACCOUNTS.length} classified — decide on all ten to finish.
            </p>
          )}
        </div>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={() => {
              resetGame()
              router.push('/simulation')
            }}
            className="rounded-lg border border-[var(--color-border-bright)] px-6 py-3 font-mono text-xs uppercase tracking-widest text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface)]"
          >
            View the network again
          </button>
          <button
            onClick={() => {
              resetGame()
              router.push('/')
            }}
            className="rounded-lg px-6 py-3 font-mono text-xs uppercase tracking-widest text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
          >
            Start over
          </button>
        </div>
      </div>
    </section>
  )
}
