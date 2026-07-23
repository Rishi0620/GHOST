'use client'

import { useMemo } from 'react'
import { useStore } from '@/lib/store'
import { recentEvents } from '@/lib/networkState'
import type { SimEvent } from '@/lib/types'

/** Auto-scrolling bottom ticker of recent network events. */
export function ActivityFeed() {
  const data = useStore((s) => s.data)
  const currentTick = useStore((s) => s.currentTick)
  const agentsById = useStore((s) => s.agentsById)
  const selectAgent = useStore((s) => s.selectAgent)

  const events = useMemo(() => {
    if (!data) return []
    return recentEvents(data.ticks, currentTick, 30)
  }, [data, currentTick])

  if (!data) return null

  return (
    <div className="flex items-center gap-2 overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2">
      <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">
        activity
      </span>
      <div className="flex flex-1 items-center gap-2 overflow-x-auto">
        {events.length === 0 ? (
          <span className="text-xs text-[var(--color-text-muted)]">
            No activity yet — press play or scrub forward.
          </span>
        ) : (
          events.map((e, i) => {
            const actor = agentsById.get(e.actorId)
            const target = e.targetId ? agentsById.get(e.targetId) : null
            return (
              <button
                key={`${e.tick}-${i}`}
                onClick={() => selectAgent(e.actorId)}
                className="shrink-0 rounded-full border border-[var(--color-border)] bg-[var(--color-bg)]/60 px-2.5 py-1 font-mono text-[10px] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border-bright)] hover:text-[var(--color-text)]"
              >
                <span className="text-[var(--color-text)]">@{actor?.username ?? '…'}</span>{' '}
                {describe(e, target?.username)}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

function describe(e: SimEvent, targetUsername?: string): string {
  switch (e.type) {
    case 'post':
      return 'posted'
    case 'reply':
      return `replied to @${targetUsername ?? '…'}`
    case 'like':
      return `liked @${targetUsername ?? '…'}`
    case 'repost':
      return `reposted @${targetUsername ?? '…'}`
    case 'follow':
      return `followed @${targetUsername ?? '…'}`
    case 'viral':
      return 'went viral 🔥'
    default:
      return e.type
  }
}
