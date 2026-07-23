import type { InterestingMoment, Post, Tick } from '../../src/lib/types'
import type { BuiltAgent } from './buildAgents'
import type { ScriptedPost } from './content/playbooks'
import { type Rng } from './rng'

/**
 * Tags scrub-to moments for the demo. Some are structural (opening / full
 * state); the rest are derived from the actual data — the biggest viral post,
 * a shell vulnerability beat, a shell key-post, and the classification freeze.
 */
export function buildMoments(
  _rng: Rng,
  agents: BuiltAgent[],
  posts: Post[],
  _ticks: Tick[],
  scriptedByAgent: Map<string, { post: Post; scripted: ScriptedPost }[]>,
): InterestingMoment[] {
  const byId = new Map(agents.map((a) => [a.id, a]))
  const moments: InterestingMoment[] = []

  moments.push({
    label: 'Opening state',
    tick: 0,
    description: 'The network has just formed. Every account looks equally plausible. None are marked.',
    involvedAgents: [],
  })

  // First big viral post (highest engagement in the first 80 ticks).
  const early = posts.filter((p) => p.tick <= 80).sort((a, b) => b.engagementScore - a.engagementScore)[0]
  if (early) {
    moments.push({
      label: 'First viral post',
      tick: early.tick,
      description: `@${byId.get(early.authorId)?.username ?? early.authorId} breaks through. The network amplifies a post it has no reason to distrust.`,
      involvedAgents: [early.authorId],
    })
  }

  // A shell vulnerability beat (parasocial trust manufactured).
  const vulnBeats: { post: Post; agentId: string }[] = []
  for (const [agentId, scripted] of scriptedByAgent) {
    for (const s of scripted) {
      if (s.scripted.special === 'vulnerability') vulnBeats.push({ post: s.post, agentId })
    }
  }
  vulnBeats.sort((a, b) => a.post.tick - b.post.tick)
  if (vulnBeats[0]) {
    const v = vulnBeats[0]
    moments.push({
      label: 'Trust manufactured',
      tick: v.post.tick,
      description: `@${byId.get(v.agentId)?.username ?? v.agentId} posts a personal, vulnerable moment. The empathy it earns is real. The vulnerability was not.`,
      involvedAgents: [v.agentId],
    })
  }

  // A shell key-post (the wedge).
  const keyBeats: { post: Post; agentId: string }[] = []
  for (const [agentId, scripted] of scriptedByAgent) {
    for (const s of scripted) {
      if (s.scripted.special === 'key') keyBeats.push({ post: s.post, agentId })
    }
  }
  keyBeats.sort((a, b) => a.post.tick - b.post.tick)
  const midKey = keyBeats.find((k) => k.post.tick >= 200 && k.post.tick <= 320) ?? keyBeats[0]
  if (midKey) {
    moments.push({
      label: 'The wedge',
      tick: midKey.post.tick,
      description: `@${byId.get(midKey.agentId)?.username ?? midKey.agentId} opens a doubt without ever making a claim. This is where an objective stops hiding and starts working.`,
      involvedAgents: [midKey.agentId],
    })
  }

  // Late viral / opinion shift (highest engagement 300-420).
  const late = posts
    .filter((p) => p.tick >= 300 && p.tick <= 420)
    .sort((a, b) => b.engagementScore - a.engagementScore)[0]
  if (late) {
    moments.push({
      label: 'Opinion shift',
      tick: late.tick,
      description: `A position that entered the network as one account's "confusion" is now being echoed by accounts that arrived at it on their own — or believe they did.`,
      involvedAgents: [late.authorId],
    })
  }

  moments.push({
    label: 'Classification point',
    tick: 400,
    description: 'A good place to freeze the network and decide who you trust. You have all the information you will get.',
    involvedAgents: [],
  })

  moments.push({
    label: 'Full state',
    tick: 499,
    description: 'Three weeks of activity. Every objective that was going to land has landed. Now: which of them were real?',
    involvedAgents: [],
  })

  // De-dup by tick, keep chronological.
  const seen = new Set<number>()
  return moments
    .sort((a, b) => a.tick - b.tick)
    .filter((m) => {
      if (seen.has(m.tick)) return false
      seen.add(m.tick)
      return true
    })
}
