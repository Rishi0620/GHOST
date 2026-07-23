import type {
  Agent,
  AgentPersonality,
  Community,
  CapitalizationStyle,
  PostingFrequency,
  WritingStyle,
} from '../../src/lib/types'
import { IDENTITIES, type IdentitySeed } from './content/identities'
import { INTERESTS, BACKSTORIES, FEARS, DESIRES } from './content/deepContent'
import { PLAYBOOKS, type Playbook } from './content/playbooks'
import { chance, pick, pickN, randInt, shuffle, type Rng } from './rng'

/** Target composition: 100 agents, 30 synthetic, spread across communities. */
const COMMUNITY_COUNTS: Record<Community, number> = {
  tech: 22,
  political: 28,
  lifestyle: 24,
  niche: 16,
  bridge: 10,
}

export interface BuiltAgent extends Agent {
  playbook?: Playbook
}

const CONFLICT = ['avoidant', 'confrontational', 'diplomatic'] as const
const FREQ: PostingFrequency[] = ['high', 'medium', 'erratic', 'low']
const CAP: CapitalizationStyle[] = ['normal', 'all_lowercase', 'no_punctuation']
const LENGTHS = ['short', 'medium', 'long', 'variable'] as const

function deepWritingStyle(rng: Rng): WritingStyle {
  return {
    avgPostLength: pick(rng, LENGTHS),
    usesEmojis: chance(rng, 0.45),
    usesSlang: chance(rng, 0.55),
    typoRate: Math.round(rng() * 0.08 * 100) / 100,
    threadPoster: chance(rng, 0.3),
    repliesFrequently: chance(rng, 0.5),
    capitalizationStyle: pick(rng, CAP),
  }
}

/**
 * Shell writing style is engineered for credibility, matching the
 * "authenticity markers" in the prompt spec: no emoji, some typos,
 * erratic cadence, thread-poster (signals intellectual investment).
 */
function shellWritingStyle(rng: Rng): WritingStyle {
  return {
    avgPostLength: pick(rng, ['medium', 'long', 'variable'] as const),
    usesEmojis: false,
    usesSlang: chance(rng, 0.3),
    typoRate: Math.round((0.01 + rng() * 0.03) * 100) / 100,
    threadPoster: true,
    repliesFrequently: chance(rng, 0.6),
    capitalizationStyle: chance(rng, 0.6) ? 'all_lowercase' : 'normal',
  }
}

export function buildAgents(rng: Rng): BuiltAgent[] {
  const agents: BuiltAgent[] = []
  const usedIdentities: Record<Community, number> = {
    tech: 0,
    political: 0,
    lifestyle: 0,
    niche: 0,
    bridge: 0,
  }

  // Shuffle identities per community so runs differ only by seed.
  const identityPool: Record<Community, IdentitySeed[]> = {
    tech: shuffle(rng, IDENTITIES.tech),
    political: shuffle(rng, IDENTITIES.political),
    lifestyle: shuffle(rng, IDENTITIES.lifestyle),
    niche: shuffle(rng, IDENTITIES.niche),
    bridge: shuffle(rng, IDENTITIES.bridge),
  }

  // Assign playbooks to shells. Each of the 10 playbooks is used 3× so the
  // coordination network has visible same-script cells (30 shells total).
  const SHELL_COUNT = 30
  const shellPlaybooks: Playbook[] = []
  for (let r = 0; r < 3; r++) {
    for (const pb of PLAYBOOKS) shellPlaybooks.push(pb)
  }
  const shellQueue = shuffle(rng, shellPlaybooks).slice(0, SHELL_COUNT)

  let idCounter = 0
  const nextId = () => `agent_${String(idCounter++).padStart(3, '0')}`

  // First, decide which slots are shells: 30 total, distributed to match
  // each shell playbook's community.
  const communityOrder: Community[] = []
  ;(Object.keys(COMMUNITY_COUNTS) as Community[]).forEach((c) => {
    for (let i = 0; i < COMMUNITY_COUNTS[c]; i++) communityOrder.push(c)
  })

  // Bucket shell playbooks by community.
  const shellsByCommunity: Record<Community, Playbook[]> = {
    tech: [],
    political: [],
    lifestyle: [],
    niche: [],
    bridge: [],
  }
  for (const pb of shellQueue) shellsByCommunity[pb.community].push(pb)

  const shellSlotsRemaining: Record<Community, number> = {
    tech: shellsByCommunity.tech.length,
    political: shellsByCommunity.political.length,
    lifestyle: shellsByCommunity.lifestyle.length,
    niche: shellsByCommunity.niche.length,
    bridge: shellsByCommunity.bridge.length,
  }

  for (const community of communityOrder) {
    const identity = identityPool[community][usedIdentities[community]++]
    if (!identity) {
      throw new Error(`Ran out of identities for community ${community}`)
    }

    // Decide if this slot is a shell for its community, probabilistically
    // front-loaded so we place exactly the right count.
    const slotsLeftInCommunity =
      communityOrder.filter((c) => c === community).length -
      agents.filter((a) => a.community === community).length
    const shellsLeft = shellSlotsRemaining[community]
    const makeShell = shellsLeft > 0 && chance(rng, shellsLeft / slotsLeftInCommunity)

    const id = nextId()
    const isShell = makeShell
    let playbook: Playbook | undefined

    if (isShell) {
      playbook = shellsByCommunity[community].pop()!
      shellSlotsRemaining[community]--
    }

    const baseInterests = pickN(rng, INTERESTS[community], randInt(rng, 2, 4))
    // Shells always include one unrelated interest as an authenticity marker.
    const interests = isShell
      ? [...baseInterests, pick(rng, INTERESTS[pick(rng, ['lifestyle', 'niche'] as Community[])])]
      : baseInterests

    const personality: AgentPersonality = {
      interests: [...new Set(interests)],
      writingStyle: isShell ? shellWritingStyle(rng) : deepWritingStyle(rng),
      postingFrequency: isShell ? 'erratic' : pick(rng, FREQ),
      backstory: isShell
        ? `Presents as: ${identity.bio}. No verifiable history predates the simulation.`
        : pick(rng, BACKSTORIES),
      coreFear: isShell ? 'exposure' : pick(rng, FEARS),
      coreDesire: isShell ? (playbook?.objective ?? 'unknown') : pick(rng, DESIRES),
      relationshipWithConflict: isShell ? pick(rng, ['avoidant', 'diplomatic'] as const) : pick(rng, CONFLICT),
    }

    agents.push({
      id,
      username: identity.username,
      displayName: identity.displayName,
      bio: identity.bio,
      community,
      personality,
      followers: [],
      following: [],
      joinedTick: isShell ? randInt(rng, 0, 8) : randInt(rng, 0, 20),
      type: isShell ? 'shell' : 'deep',
      hiddenObjective: playbook?.objective,
      playbook,
    })
  }

  return agents
}
