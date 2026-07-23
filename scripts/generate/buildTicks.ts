import type {
  EdgeUpdate,
  NodeUpdate,
  Post,
  SimEvent,
  Tick,
} from '../../src/lib/types'
import type { BuiltAgent } from './buildAgents'
import type { FollowEdge } from './buildNetwork'
import { chance, pick, randInt, shuffle, type Rng } from './rng'

const TICKS = 500

/**
 * Turns the static agents + posts + follow graph into a tick-by-tick replay:
 *
 *  - each post becomes a `post` event at its tick
 *  - high-engagement posts spawn `like`/`repost` events from followers and,
 *    above a threshold, a `viral` event
 *  - follow edges are staggered across the timeline so the graph visibly grows
 *  - nodeUpdates carry the running follower count so node size animates
 *  - edgeUpdates carry cumulative interaction weight so edges thicken
 */
export function buildTicks(
  rng: Rng,
  agents: BuiltAgent[],
  posts: Post[],
  followEdges: FollowEdge[],
): Tick[] {
  const byId = new Map(agents.map((a) => [a.id, a]))
  const eventsByTick: SimEvent[][] = Array.from({ length: TICKS }, () => [])
  const nodeUpdatesByTick: NodeUpdate[][] = Array.from({ length: TICKS }, () => [])
  const edgeUpdatesByTick: EdgeUpdate[][] = Array.from({ length: TICKS }, () => [])

  // --- Follow edges: assign an appearance tick to each ---------------------
  // Baseline structural edges appear early; the rest arrive as the network
  // "discovers" accounts, weighted toward each followee's high-engagement posts.
  const postsByAuthor = new Map<string, Post[]>()
  for (const p of posts) {
    if (!postsByAuthor.has(p.authorId)) postsByAuthor.set(p.authorId, [])
    postsByAuthor.get(p.authorId)!.push(p)
  }

  const followAppearance = new Map<string, number>() // key follower->followee
  for (const edge of followEdges) {
    const key = `${edge.sourceId}->${edge.targetId}`
    if (chance(rng, 0.4)) {
      followAppearance.set(key, randInt(rng, 0, 12))
      continue
    }
    // Otherwise tie appearance to one of the followee's stronger posts.
    const authorPosts = postsByAuthor.get(edge.targetId) ?? []
    const strong = authorPosts.filter((p) => p.engagementScore > 40)
    if (strong.length > 0) {
      const trigger = pick(rng, strong)
      followAppearance.set(key, Math.min(TICKS - 1, trigger.tick + randInt(rng, 0, 8)))
    } else {
      followAppearance.set(key, randInt(rng, 0, TICKS - 1))
    }
  }

  // Running follower counts to emit node updates.
  const followerCount = new Map<string, number>()
  for (const a of agents) followerCount.set(a.id, 0)

  // Emit follow events + node updates in tick order.
  const followsByTick: FollowEdge[][] = Array.from({ length: TICKS }, () => [])
  for (const edge of followEdges) {
    const t = followAppearance.get(`${edge.sourceId}->${edge.targetId}`) ?? 0
    followsByTick[Math.min(TICKS - 1, t)].push(edge)
  }

  // --- Cumulative edge weights (interaction frequency) ---------------------
  const edgeWeight = new Map<string, number>()
  const bump = (a: string, b: string, tick: number) => {
    const key = a < b ? `${a}|${b}` : `${b}|${a}`
    const w = (edgeWeight.get(key) ?? 0) + 1
    edgeWeight.set(key, w)
    const [sourceId, targetId] = key.split('|')
    edgeUpdatesByTick[tick].push({ sourceId, targetId, weight: w })
  }

  // --- Walk ticks ----------------------------------------------------------
  const postsByTick: Post[][] = Array.from({ length: TICKS }, () => [])
  for (const p of posts) postsByTick[Math.min(TICKS - 1, p.tick)].push(p)

  for (let tick = 0; tick < TICKS; tick++) {
    // Follows first (network grows), then activity.
    const touchedNodes = new Set<string>()
    for (const edge of followsByTick[tick]) {
      eventsByTick[tick].push({ type: 'follow', actorId: edge.sourceId, targetId: edge.targetId })
      followerCount.set(edge.targetId, (followerCount.get(edge.targetId) ?? 0) + 1)
      touchedNodes.add(edge.targetId)
      bump(edge.sourceId, edge.targetId, tick)
    }

    for (const post of postsByTick[tick]) {
      const author = byId.get(post.authorId)!
      eventsByTick[tick].push({ type: 'post', actorId: post.authorId, postId: post.id })

      if (post.engagementScore >= 85) {
        eventsByTick[tick].push({ type: 'viral', actorId: post.authorId, postId: post.id })
      }

      // Follower engagement — sample a subset to keep event volume sane.
      const followers = shuffle(rng, author.followers)
      const reactCap = Math.min(followers.length, 6 + Math.floor(post.engagementScore / 12))
      for (let i = 0; i < reactCap; i++) {
        const fId = followers[i]
        const p = engagementProbability(post.engagementScore)
        if (!chance(rng, p)) continue
        const reactTick = Math.min(TICKS - 1, tick + randInt(rng, 0, 6))
        const type = chance(rng, 0.72) ? 'like' : 'repost'
        eventsByTick[reactTick].push({ type, actorId: fId, targetId: post.authorId, postId: post.id })
        bump(fId, post.authorId, reactTick)
      }

      // Replies on higher-engagement posts create fresh cross-edges.
      if (post.engagementScore > 55 && chance(rng, 0.6)) {
        const community = shuffle(rng, agents.filter((a) => a.id !== post.authorId))
        const replyCount = randInt(rng, 1, 3)
        for (let i = 0; i < replyCount && i < community.length; i++) {
          const replier = community[i]
          const reactTick = Math.min(TICKS - 1, tick + randInt(rng, 0, 10))
          eventsByTick[reactTick].push({ type: 'reply', actorId: replier.id, targetId: post.authorId, postId: post.id })
          bump(replier.id, post.authorId, reactTick)
        }
      }

      touchedNodes.add(post.authorId)
    }

    // Node updates for everyone whose follower count changed this tick.
    for (const id of touchedNodes) {
      nodeUpdatesByTick[tick].push({ agentId: id, followerCount: followerCount.get(id) ?? 0 })
    }
  }

  const ticks: Tick[] = []
  for (let t = 0; t < TICKS; t++) {
    ticks.push({
      tick: t,
      events: eventsByTick[t],
      nodeUpdates: nodeUpdatesByTick[t],
      edgeUpdates: edgeUpdatesByTick[t],
    })
  }
  return ticks
}

function engagementProbability(score: number): number {
  // Higher-engagement posts pull reactions from a larger share of followers.
  return Math.min(0.9, 0.1 + (score / 100) * 0.7)
}
