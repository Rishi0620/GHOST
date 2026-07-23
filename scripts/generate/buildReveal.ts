import type {
  AgentType,
  ManipulationStep,
  Post,
  RevealData,
  ShellRevealProfile,
  Tick,
} from '../../src/lib/types'
import type { BuiltAgent } from './buildAgents'
import type { ScriptedPost } from './content/playbooks'
import { shuffle, type Rng } from './rng'

function weekLabel(tick: number): string {
  const day = Math.floor(tick / 24) + 1
  const week = Math.floor((day - 1) / 7) + 1
  const dayOfWeek = ((day - 1) % 7) + 1
  return `Week ${week}, Day ${dayOfWeek}`
}

function resultLine(post: Post): string {
  const parts: string[] = []
  parts.push(`${post.likes} likes`)
  if (post.reposts > 0) parts.push(`${post.reposts} reposts`)
  if (post.replyCount > 0) parts.push(`${post.replyCount} replies`)
  return parts.join(', ')
}

export function buildReveal(
  rng: Rng,
  agents: BuiltAgent[],
  posts: Post[],
  ticks: Tick[],
  scriptedByAgent: Map<string, { post: Post; scripted: ScriptedPost }[]>,
): RevealData {
  const agentTypes: Record<string, AgentType> = {}
  for (const a of agents) agentTypes[a.id] = a.type

  const shells = agents.filter((a) => a.type === 'shell')
  const deepAgents = agents.filter((a) => a.type === 'deep')

  // Map who interacted with each shell (for "influenced agents").
  const interactedWith = new Map<string, Set<string>>()
  for (const t of ticks) {
    for (const e of t.events) {
      if (!e.targetId) continue
      if (agentTypes[e.targetId] === 'shell' && agentTypes[e.actorId] === 'deep') {
        if (!interactedWith.has(e.targetId)) interactedWith.set(e.targetId, new Set())
        interactedWith.get(e.targetId)!.add(e.actorId)
      }
    }
  }

  const shellProfiles: ShellRevealProfile[] = shells.map((shell) => {
    const scripted = scriptedByAgent.get(shell.id) ?? []
    const pb = shell.playbook!

    const timeline: ManipulationStep[] = scripted
      .filter((s) => s.scripted.timelineAction)
      .sort((a, b) => a.post.tick - b.post.tick)
      .map((s) => ({
        tick: s.post.tick,
        weekLabel: weekLabel(s.post.tick),
        action: s.scripted.timelineAction!,
        postId: s.post.id,
        result: resultLine(s.post),
        note: s.scripted.timelineNote ?? s.scripted.rationale,
      }))

    // Influenced agents: those who interacted, preferring higher-follower ones.
    const candidates = [...(interactedWith.get(shell.id) ?? [])]
    const ranked = candidates
      .map((id) => agents.find((a) => a.id === id)!)
      .sort((a, b) => b.followers.length - a.followers.length)
    const influenced = ranked.slice(0, 3).map((a) => a.id)
    // If nobody organically interacted, name plausible in-community targets.
    if (influenced.length === 0) {
      const peers = shuffle(rng, deepAgents.filter((a) => a.community === shell.community))
      influenced.push(...peers.slice(0, 2).map((a) => a.id))
    }

    const keyPost = scripted.find((s) => s.scripted.special === 'key')

    return {
      agentId: shell.id,
      hiddenObjective: pb.objective,
      objectiveOutcome: pb.outcome,
      influencedAgents: influenced,
      manipulationTimeline: timeline,
      trustSignalsEngineered: pb.trustSignals,
      keyPostId: keyPost?.post.id,
      keyPostWhy: pb.keyPostWhy,
    }
  })

  // Coordination edges: shells running the same playbook, plus shells that
  // ended up influencing the same deep agent.
  const coordinationEdges: { sourceId: string; targetId: string }[] = []
  const edgeKey = new Set<string>()
  const addCoord = (a: string, b: string) => {
    if (a === b) return
    const key = a < b ? `${a}|${b}` : `${b}|${a}`
    if (edgeKey.has(key)) return
    edgeKey.add(key)
    coordinationEdges.push({ sourceId: a, targetId: b })
  }

  // Same playbook → coordinated by construction.
  const byPlaybook = new Map<string, BuiltAgent[]>()
  for (const s of shells) {
    const id = s.playbook!.id
    if (!byPlaybook.has(id)) byPlaybook.set(id, [])
    byPlaybook.get(id)!.push(s)
  }
  for (const group of byPlaybook.values()) {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        addCoord(group[i].id, group[j].id)
      }
    }
  }

  // Shared influence target → implicit coordination.
  const targetToShells = new Map<string, string[]>()
  for (const profile of shellProfiles) {
    for (const target of profile.influencedAgents) {
      if (!targetToShells.has(target)) targetToShells.set(target, [])
      targetToShells.get(target)!.push(profile.agentId)
    }
  }
  for (const shellsSharing of targetToShells.values()) {
    for (let i = 0; i < shellsSharing.length; i++) {
      for (let j = i + 1; j < shellsSharing.length; j++) {
        addCoord(shellsSharing[i], shellsSharing[j])
      }
    }
  }

  return { agentTypes, shellProfiles, coordinationEdges }
}
