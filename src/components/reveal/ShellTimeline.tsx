'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import type { RevealResponse, ShellRevealProfile } from '@/lib/types'
import { tickToDate } from '@/lib/networkState'
import { Avatar } from '@/components/Avatar'

export function ShellTimeline({
  profile,
  reveal,
}: {
  profile: ShellRevealProfile
  reveal: RevealResponse
}) {
  const agentsById = useStore((s) => s.agentsById)
  const postsByAuthor = useStore((s) => s.postsByAuthor)
  const [open, setOpen] = useState(false)

  const agent = agentsById.get(profile.agentId)
  if (!agent) return null

  const yourGuess = reveal.results.find((r) => r.agentId === profile.agentId)
  const posts = postsByAuthor.get(profile.agentId) ?? []
  const postById = new Map(posts.map((p) => [p.id, p]))
  const keyPost = profile.keyPostId ? postById.get(profile.keyPostId) : undefined

  const foolyou = yourGuess && !yourGuess.correct

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-[var(--color-elevated)]/40"
      >
        <Avatar
          displayName={agent.displayName}
          community={agent.community}
          size={44}
          ring="var(--color-shell)"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--color-text)]">@{agent.username}</span>
            <span className="rounded bg-[var(--color-shell)]/20 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--color-shell)]">
              Synthetic
            </span>
          </div>
          <p className="mt-0.5 truncate text-sm text-[var(--color-text-secondary)]">
            {profile.hiddenObjective}
          </p>
        </div>
        {yourGuess && (
          <div className="shrink-0 text-right">
            <div
              className={`font-mono text-[11px] ${foolyou ? 'text-[var(--color-shell)]' : 'text-[var(--color-deep)]'}`}
            >
              you said {yourGuess.guess === 'shell' ? 'synthetic' : 'real'}
            </div>
            <div className="font-mono text-[10px] text-[var(--color-text-muted)]">
              {yourGuess.confidence}% confident
            </div>
          </div>
        )}
        <span className="shrink-0 font-mono text-xs text-[var(--color-text-muted)]">
          {open ? '−' : '+'}
        </span>
      </button>

      {open && (
        <div className="animate-ghost-fade-in border-t border-[var(--color-border)] p-5">
          {/* objective + outcome */}
          <div className="mb-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]/40 p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">
              Objective
            </div>
            <p className="mt-1 text-[var(--color-text)]">{profile.hiddenObjective}</p>
            <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">
              Outcome
            </div>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              {profile.objectiveOutcome}
            </p>
          </div>

          {/* timeline */}
          <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">
            The engineering timeline
          </div>
          <ol className="mt-4 space-y-5 border-l border-[var(--color-border-bright)] pl-5">
            {profile.manipulationTimeline.map((step, i) => {
              const post = step.postId ? postById.get(step.postId) : undefined
              return (
                <li key={i} className="relative">
                  <span className="absolute -left-[23px] top-1 h-2.5 w-2.5 rounded-full bg-[var(--color-shell)]" />
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-semibold text-[var(--color-text)]">
                      {step.action}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] text-[var(--color-text-muted)]">
                      {step.weekLabel} · {tickToDate(step.tick)}
                    </span>
                  </div>
                  {post && (
                    <p className="mt-2 rounded border border-[var(--color-border)] bg-[var(--color-bg)]/40 px-3 py-2 text-sm italic text-[var(--color-text-secondary)]">
                      &ldquo;{post.content}&rdquo;
                    </p>
                  )}
                  <p className="mt-1.5 font-mono text-[11px] text-[var(--color-text-muted)]">
                    {step.result}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--color-shell)]/80">
                    {step.note}
                  </p>
                </li>
              )
            })}
          </ol>

          {/* key post */}
          {keyPost && (
            <div className="mt-6 rounded-lg border border-[var(--color-shell)]/30 bg-[var(--color-shell)]/5 p-4">
              <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-shell)]">
                The post that did the most work
              </div>
              <p className="mt-2 text-sm italic text-[var(--color-text)]">
                &ldquo;{keyPost.content}&rdquo;
              </p>
              <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                {profile.keyPostWhy}
              </p>
            </div>
          )}

          {/* trust signals */}
          <div className="mt-6">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">
              What you used to trust them
            </div>
            <ul className="mt-3 space-y-1.5">
              {profile.trustSignalsEngineered.map((sig, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                  <span className="mt-0.5 font-mono text-[10px] text-[var(--color-shell)]">
                    engineered
                  </span>
                  <span>{sig}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
              Every signal you used to detect authenticity was the first thing built.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
