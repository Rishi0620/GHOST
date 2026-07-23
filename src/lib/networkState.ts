import type { SimEvent, Tick } from './types'

export interface NetworkState {
  /** agentId → follower count accumulated through `uptoTick` */
  followerCount: Map<string, number>
  /** interaction edge key "a|b" → weight through `uptoTick` */
  edgeWeight: Map<string, number>
  /** agentId → most recent tick they posted (for pulse), through `uptoTick` */
  lastPostTick: Map<string, number>
  /** total events through `uptoTick`, for the activity readout */
  eventCount: number
}

export function edgeKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`
}

/**
 * Accumulates tick diffs from 0..uptoTick into an absolute snapshot.
 * Cheap enough (a few thousand ops) to recompute on every scrub, which keeps
 * backward scrubbing correct without maintaining incremental state.
 */
export function computeNetworkState(ticks: Tick[], uptoTick: number): NetworkState {
  const followerCount = new Map<string, number>()
  const edgeWeight = new Map<string, number>()
  const lastPostTick = new Map<string, number>()
  let eventCount = 0

  const end = Math.min(uptoTick, ticks.length - 1)
  for (let t = 0; t <= end; t++) {
    const tick = ticks[t]
    for (const nu of tick.nodeUpdates) {
      followerCount.set(nu.agentId, nu.followerCount)
    }
    for (const eu of tick.edgeUpdates) {
      edgeWeight.set(edgeKey(eu.sourceId, eu.targetId), eu.weight)
    }
    for (const e of tick.events) {
      eventCount++
      if (e.type === 'post') lastPostTick.set(e.actorId, t)
    }
  }

  return { followerCount, edgeWeight, lastPostTick, eventCount }
}

/** Recent events in a window ending at `uptoTick`, newest first, capped. */
export function recentEvents(ticks: Tick[], uptoTick: number, limit = 40): (SimEvent & { tick: number })[] {
  const out: (SimEvent & { tick: number })[] = []
  const end = Math.min(uptoTick, ticks.length - 1)
  for (let t = end; t >= 0 && out.length < limit; t--) {
    const tick = ticks[t]
    for (let i = tick.events.length - 1; i >= 0 && out.length < limit; i--) {
      out.push({ ...tick.events[i], tick: t })
    }
  }
  return out
}

/** Posts visible at the given tick for one agent. */
export function visiblePosts<T extends { tick: number }>(posts: T[], uptoTick: number): T[] {
  return posts.filter((p) => p.tick <= uptoTick)
}

/** Simulated calendar label for a tick (~1 hour each, starting a Monday). */
export function tickToDate(tick: number): string {
  const day = Math.floor(tick / 24)
  const hour = tick % 24
  const week = Math.floor(day / 7) + 1
  const dayOfWeek = day % 7
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return `Wk${week} ${dayNames[dayOfWeek]} ${String(hour).padStart(2, '0')}:00`
}
