'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { computeNetworkState, visiblePosts } from '@/lib/networkState'
import { compact, COMMUNITY_LABEL } from '@/lib/format'
import { Avatar } from './Avatar'
import { PostCard } from './PostCard'

interface Props {
  /** classify mode restricts full-profile view to targets and shows a CTA */
  classifyCta?: boolean
}

export function AgentProfile({ classifyCta }: Props) {
  const data = useStore((s) => s.data)
  const selectedAgentId = useStore((s) => s.selectedAgentId)
  const agentsById = useStore((s) => s.agentsById)
  const postsByAuthor = useStore((s) => s.postsByAuthor)
  const currentTick = useStore((s) => s.currentTick)
  const reveal = useStore((s) => s.reveal)

  const netState = useMemo(() => {
    if (!data) return null
    return computeNetworkState(data.ticks, currentTick)
  }, [data, currentTick])

  if (!selectedAgentId) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
        <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
          No account selected
        </div>
        <p className="max-w-xs text-sm text-[var(--color-text-secondary)]">
          Click a node in the network to inspect an account — its posts, its
          reach, its arc.
        </p>
      </div>
    )
  }

  const agent = agentsById.get(selectedAgentId)
  if (!agent) return null

  const allPosts = postsByAuthor.get(selectedAgentId) ?? []
  const posts = visiblePosts(allPosts, currentTick).slice().reverse()
  const followers = netState?.followerCount.get(selectedAgentId) ?? 0

  const revealedType = reveal?.agentTypes[selectedAgentId]
  const isTarget = data?.classificationTargets.includes(selectedAgentId)

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[var(--color-border)] p-5">
        <div className="flex items-start gap-3">
          <Avatar
            displayName={agent.displayName}
            community={agent.community}
            size={52}
            ring={
              revealedType === 'shell'
                ? 'var(--color-shell)'
                : revealedType === 'deep'
                  ? 'var(--color-deep)'
                  : undefined
            }
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-lg font-semibold text-[var(--color-text)]">
                {agent.displayName}
              </h2>
              {revealedType && (
                <span
                  className={`rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                    revealedType === 'shell'
                      ? 'bg-[var(--color-shell)]/20 text-[var(--color-shell)]'
                      : 'bg-[var(--color-deep)]/20 text-[var(--color-deep)]'
                  }`}
                >
                  {revealedType === 'shell' ? 'Synthetic' : 'Real'}
                </span>
              )}
            </div>
            <div className="font-mono text-xs text-[var(--color-text-secondary)]">
              @{agent.username}
            </div>
          </div>
        </div>

        <p className="mt-3 text-sm text-[var(--color-text-secondary)]">{agent.bio}</p>

        <div className="mt-4 flex items-center gap-5 font-mono text-xs">
          <Stat label="followers" value={compact(followers)} />
          <Stat label="following" value={compact(agent.following.length)} />
          <Stat label="posts" value={compact(posts.length)} />
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <Tag>{COMMUNITY_LABEL[agent.community]}</Tag>
          {agent.personality.interests.slice(0, 4).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>

        {classifyCta && isTarget && (
          <Link
            href="/classify"
            className="mt-4 block rounded-md border border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 py-2 text-center font-mono text-xs uppercase tracking-widest text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)]/20"
          >
            Classify this account →
          </Link>
        )}
      </div>

      <div className="flex-1 space-y-2.5 overflow-y-auto p-4">
        {posts.length === 0 ? (
          <p className="py-8 text-center text-sm text-[var(--color-text-muted)]">
            No posts yet at this point in the timeline.
          </p>
        ) : (
          posts.map((p) => <PostCard key={p.id} post={p} />)
        )}
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[var(--color-text)]">{value}</span>{' '}
      <span className="text-[var(--color-text-muted)]">{label}</span>
    </div>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg)]/50 px-2 py-0.5 text-[10px] text-[var(--color-text-secondary)]">
      {children}
    </span>
  )
}
