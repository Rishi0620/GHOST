import type { Community } from '../../src/lib/types'
import type { BuiltAgent } from './buildAgents'
import { chance, shuffle, type Rng } from './rng'

/**
 * Builds the initial follow graph (mutates agents' followers/following at
 * tick 0). Homophily: agents mostly follow within their community; bridge
 * agents and shells wire across communities.
 *
 * Returns the set of directed follow edges so the tick engine can stagger
 * their appearance over time and grow additional edges from engagement.
 */
export interface FollowEdge {
  sourceId: string // follower
  targetId: string // followee
}

const P_SAME_COMMUNITY = 0.14
const P_CROSS_COMMUNITY = 0.02
const P_BRIDGE_CROSS = 0.06

export function buildNetwork(rng: Rng, agents: BuiltAgent[]): FollowEdge[] {
  const byId = new Map(agents.map((a) => [a.id, a]))
  const edgeSet = new Set<string>()
  const edges: FollowEdge[] = []

  const addEdge = (followerId: string, followeeId: string) => {
    if (followerId === followeeId) return
    const key = `${followerId}->${followeeId}`
    if (edgeSet.has(key)) return
    edgeSet.add(key)
    edges.push({ sourceId: followerId, targetId: followeeId })
    byId.get(followeeId)!.followers.push(followerId)
    byId.get(followerId)!.following.push(followeeId)
  }

  for (const follower of agents) {
    for (const followee of agents) {
      if (follower.id === followee.id) continue
      const sameCommunity = follower.community === followee.community
      let p: number
      if (sameCommunity) {
        p = P_SAME_COMMUNITY
      } else if (follower.community === 'bridge' || followee.community === 'bridge') {
        p = P_BRIDGE_CROSS
      } else {
        p = P_CROSS_COMMUNITY
      }

      // Shells strategically follow high-value targets across communities to
      // build their cultivation/coordination infrastructure.
      if (follower.type === 'shell') p *= 1.6

      if (chance(rng, p)) addEdge(follower.id, followee.id)
    }
  }

  // Ensure nobody is fully isolated: give every agent at least 3 in-community
  // follows so the force graph has no orphans.
  const byCommunity = new Map<Community, BuiltAgent[]>()
  for (const a of agents) {
    if (!byCommunity.has(a.community)) byCommunity.set(a.community, [])
    byCommunity.get(a.community)!.push(a)
  }

  for (const a of agents) {
    let following = a.following.length
    if (following >= 3) continue
    const peers = shuffle(rng, byCommunity.get(a.community)!.filter((p) => p.id !== a.id))
    for (const peer of peers) {
      if (following >= 3) break
      addEdge(a.id, peer.id)
      following++
    }
  }

  return edges
}
