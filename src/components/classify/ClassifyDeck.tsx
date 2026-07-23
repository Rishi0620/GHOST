'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import type { AgentType, PublicPost } from '@/lib/types'
import { computeNetworkState, visiblePosts } from '@/lib/networkState'
import { compact, COMMUNITY_LABEL } from '@/lib/format'
import { Avatar } from '@/components/Avatar'
import { PostCard } from '@/components/PostCard'

const CLASSIFY_TICK = 400

export function ClassifyDeck() {
  const router = useRouter()
  const data = useStore((s) => s.data)
  const agentsById = useStore((s) => s.agentsById)
  const postsByAuthor = useStore((s) => s.postsByAuthor)
  const classifications = useStore((s) => s.classifications)
  const classify = useStore((s) => s.classify)
  const submit = useStore((s) => s.submitClassifications)
  const submitting = useStore((s) => s.submitting)

  const targets = data?.classificationTargets ?? []
  const [index, setIndex] = useState(0)
  const [confidence, setConfidence] = useState(50)
  const [guess, setGuess] = useState<AgentType | null>(null)

  const netState = useMemo(() => {
    if (!data) return null
    return computeNetworkState(data.ticks, CLASSIFY_TICK)
  }, [data])

  if (!data) return null

  const currentId = targets[index]
  const agent = agentsById.get(currentId)
  const doneCount = Object.keys(classifications).length
  const allDone = doneCount === targets.length

  if (!agent) return null

  const posts: PublicPost[] = visiblePosts(postsByAuthor.get(currentId) ?? [], CLASSIFY_TICK)
    .slice()
    .reverse()
    .slice(0, 8)
  const followers = netState?.followerCount.get(currentId) ?? 0

  const existing = classifications[currentId]

  const lockIn = () => {
    if (!guess) return
    classify({ agentId: currentId, guess, confidence })
    advance()
  }

  const advance = () => {
    // Move to the next unclassified target, else the first still-open one.
    const nextOpen = findNextOpen(index, targets, {
      ...classifications,
      [currentId]: { agentId: currentId, guess: guess ?? 'deep', confidence },
    })
    if (nextOpen === -1) {
      // all done — stay, the submit bar appears
      return
    }
    setIndex(nextOpen)
    resetControls(nextOpen)
  }

  const resetControls = (i: number) => {
    const id = targets[i]
    const prev = classifications[id]
    setGuess(prev?.guess ?? null)
    setConfidence(prev?.confidence ?? 50)
  }

  const goTo = (i: number) => {
    setIndex(i)
    resetControls(i)
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-10">
      <div className="ghost-grid absolute inset-0" aria-hidden />

      {/* header */}
      <div className="relative z-10 mb-6 flex w-full max-w-2xl items-center justify-between">
        <button
          onClick={() => router.push('/simulation')}
          className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
        >
          ← back to network
        </button>
        <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-secondary)]">
          Classify · {doneCount}/{targets.length} decided
        </div>
      </div>

      {/* progress dots */}
      <div className="relative z-10 mb-6 flex gap-2">
        {targets.map((id, i) => {
          const decided = !!classifications[id]
          return (
            <button
              key={id}
              onClick={() => goTo(i)}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                i === index
                  ? 'scale-125 bg-[var(--color-accent)]'
                  : decided
                    ? 'bg-[var(--color-text-secondary)]'
                    : 'bg-[var(--color-border)]'
              }`}
              aria-label={`Target ${i + 1}`}
            />
          )
        })}
      </div>

      {/* card */}
      <div
        key={currentId}
        className="animate-ghost-fade-in relative z-10 w-full max-w-2xl rounded-2xl border border-[var(--color-border-bright)] bg-[var(--color-surface)] shadow-2xl"
      >
        <div className="flex items-start gap-3 border-b border-[var(--color-border)] p-5">
          <Avatar displayName={agent.displayName} community={agent.community} size={52} />
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">{agent.displayName}</h2>
            <div className="font-mono text-xs text-[var(--color-text-secondary)]">
              @{agent.username}
            </div>
            <p className="mt-1.5 text-sm text-[var(--color-text-secondary)]">{agent.bio}</p>
          </div>
          <div className="shrink-0 text-right font-mono text-[11px] text-[var(--color-text-muted)]">
            <div>
              <span className="text-[var(--color-text)]">{compact(followers)}</span> followers
            </div>
            <div className="mt-0.5">{COMMUNITY_LABEL[agent.community]}</div>
          </div>
        </div>

        <div className="max-h-[38vh] space-y-2.5 overflow-y-auto p-4">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>

        {/* controls */}
        <div className="border-t border-[var(--color-border)] p-5">
          <div className="mb-3 text-center font-mono text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
            Who is this?
          </div>
          <div className="grid grid-cols-2 gap-3">
            <VerdictButton
              active={guess === 'deep'}
              color="var(--color-deep)"
              onClick={() => setGuess('deep')}
            >
              Real person
            </VerdictButton>
            <VerdictButton
              active={guess === 'shell'}
              color="var(--color-shell)"
              onClick={() => setGuess('shell')}
            >
              Synthetic
            </VerdictButton>
          </div>

          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between font-mono text-[11px] text-[var(--color-text-secondary)]">
              <span>Confidence</span>
              <span className="text-[var(--color-text)]">{confidence}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={confidence}
              onChange={(e) => setConfidence(Number(e.target.value))}
              className="ghost-range w-full"
              style={{ '--pct': `${confidence}%` } as React.CSSProperties}
            />
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              disabled={!guess}
              onClick={lockIn}
              className="flex-1 rounded-lg bg-[var(--color-accent)] py-2.5 font-mono text-sm font-semibold uppercase tracking-widest text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
            >
              {existing ? 'Update' : 'Lock in'}
            </button>
            {index < targets.length - 1 && (
              <button
                onClick={() => goTo(index + 1)}
                className="rounded-lg border border-[var(--color-border)] px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text)]"
              >
                Skip →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* submit bar */}
      {allDone && (
        <div className="animate-ghost-fade-in relative z-10 mt-6 flex w-full max-w-2xl items-center justify-between rounded-xl border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 px-5 py-4">
          <span className="text-sm text-[var(--color-text)]">
            All {targets.length} accounts classified. Ready for the reveal.
          </span>
          <button
            onClick={async () => {
              await submit()
              router.push('/reveal')
            }}
            disabled={submitting}
            className="rounded-lg bg-[var(--color-accent)] px-6 py-2.5 font-mono text-sm font-semibold uppercase tracking-widest text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Revealing…' : 'Reveal →'}
          </button>
        </div>
      )}
    </div>
  )
}

function VerdictButton({
  children,
  active,
  color,
  onClick,
}: {
  children: React.ReactNode
  active: boolean
  color: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border py-3 font-mono text-sm uppercase tracking-widest transition-all"
      style={{
        borderColor: active ? color : 'var(--color-border)',
        background: active ? `color-mix(in srgb, ${color} 15%, transparent)` : 'transparent',
        color: active ? color : 'var(--color-text-secondary)',
      }}
    >
      {children}
    </button>
  )
}

function findNextOpen(
  from: number,
  targets: string[],
  classifications: Record<string, unknown>,
): number {
  for (let step = 1; step <= targets.length; step++) {
    const i = (from + step) % targets.length
    if (!classifications[targets[i]]) return i
  }
  return -1
}
