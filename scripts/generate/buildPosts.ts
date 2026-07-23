import type { Post, WritingStyle } from '../../src/lib/types'
import type { BuiltAgent } from './buildAgents'
import {
  SLOTS,
  UNIVERSAL_POSTS,
  COMMUNITY_POSTS,
} from './content/deepContent'
import type { Phase, ScriptedPost } from './content/playbooks'
import { chance, engagementRoll, pick, randInt, shuffle, type Rng } from './rng'

const TICKS = 500

/** phase -> [minTick, maxTick] window */
const PHASE_WINDOWS: Record<Phase, [number, number]> = {
  1: [0, 100],
  2: [100, 200],
  3: [200, 300],
  4: [300, 400],
  5: [400, 500],
}

const POSTS_BY_FREQ: Record<string, [number, number]> = {
  high: [26, 38],
  medium: [16, 24],
  erratic: [12, 22],
  low: [8, 14],
}

function fillSlots(rng: Rng, template: string): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const options = SLOTS[key]
    return options ? pick(rng, options) : `{${key}}`
  })
}

/** Applies capitalization + typo styling so posts feel individually voiced. */
function applyStyle(rng: Rng, text: string, style: WritingStyle): string {
  let out = text

  if (style.capitalizationStyle === 'normal') {
    out = out.charAt(0).toUpperCase() + out.slice(1)
  } else if (style.capitalizationStyle === 'no_punctuation') {
    out = out.replace(/[.,]/g, '')
  }
  // all_lowercase: templates are already lowercase — leave as-is.

  if (style.usesEmojis && chance(rng, 0.35)) {
    out += ' ' + pick(rng, ['🙂', '😭', '🔥', '☕️', '👀', '✨', '💀', '🫠'])
  }

  if (chance(rng, style.typoRate * 4)) {
    out = injectTypo(rng, out)
  }

  return out
}

function injectTypo(rng: Rng, text: string): string {
  const swaps: [RegExp, string][] = [
    [/\bthe\b/, 'teh'],
    [/\band\b/, 'adn'],
    [/\byou\b/, 'yoy'],
    [/\bjust\b/, 'jsut'],
    [/\bthat\b/, 'taht'],
    [/\bwith\b/, 'wiht'],
    [/\breally\b/, 'realy'],
  ]
  const applicable = swaps.filter(([re]) => re.test(text))
  if (applicable.length === 0) return text
  const [re, sub] = pick(rng, applicable)
  return text.replace(re, sub)
}

function engagementToLikes(rng: Rng, score: number): { likes: number; reposts: number; replyCount: number } {
  const likes = Math.floor(score * (0.6 + rng() * 1.4))
  const reposts = Math.floor(likes * (0.05 + rng() * 0.2))
  const replyCount = Math.floor(likes * (0.08 + rng() * 0.18))
  return { likes, reposts, replyCount }
}

export interface BuiltPosts {
  posts: Post[]
  /** shell agentId -> ordered scripted post ids (for reveal timeline) */
  scriptedByAgent: Map<string, { post: Post; scripted: ScriptedPost }[]>
}

export function buildPosts(rng: Rng, agents: BuiltAgent[]): BuiltPosts {
  const posts: Post[] = []
  const scriptedByAgent = new Map<string, { post: Post; scripted: ScriptedPost }[]>()
  let postCounter = 0
  const nextPostId = (agentId: string) => `post_${String(postCounter++).padStart(4, '0')}_${agentId}`

  for (const agent of agents) {
    const style = agent.personality.writingStyle
    const startTick = agent.joinedTick

    if (agent.type === 'shell' && agent.playbook) {
      // Scripted arc: place each playbook post inside its phase window.
      const scripted: { post: Post; scripted: ScriptedPost }[] = []
      const usedVariants = new Set<string>()

      // Sort by phase so ticks are chronological within the arc.
      const ordered = [...agent.playbook.posts].sort((a, b) => a.phase - b.phase)

      for (const sp of ordered) {
        const [lo, hi] = PHASE_WINDOWS[sp.phase]
        const tick = randInt(rng, Math.max(lo, startTick), hi - 1)

        // Choose an unused variant when possible (two shells share a playbook).
        const freshVariants = sp.variants.filter((v) => !usedVariants.has(v))
        const raw = freshVariants.length > 0 ? pick(rng, freshVariants) : pick(rng, sp.variants)
        usedVariants.add(raw)

        const content = applyStyle(rng, raw, style)
        const score = sp.engagement
        const { likes, reposts, replyCount } = engagementToLikes(rng, score)
        const post: Post = {
          id: nextPostId(agent.id),
          authorId: agent.id,
          content,
          tick,
          engagementScore: score,
          likes,
          reposts,
          replyCount,
          isReply: sp.special === 'social',
          generationRationale: sp.rationale,
        }
        posts.push(post)
        scripted.push({ post, scripted: sp })
      }

      // Fill the rest of the shell's timeline with mundane cover posts so the
      // arc is diluted — a shell that ONLY posts its arc is easy to spot.
      const coverCount = randInt(rng, 8, 14)
      for (let i = 0; i < coverCount; i++) {
        const tick = randInt(rng, startTick, TICKS - 1)
        const raw = fillSlots(rng, pickCoverPost(rng, agent))
        const content = applyStyle(rng, raw, style)
        const score = engagementRoll(rng)
        const { likes, reposts, replyCount } = engagementToLikes(rng, score)
        posts.push({
          id: nextPostId(agent.id),
          authorId: agent.id,
          content,
          tick,
          engagementScore: score,
          likes,
          reposts,
          replyCount,
          isReply: false,
          generationRationale: 'Cover post. No objective content — dilutes the arc so the account reads as an ordinary user.',
        })
      }

      scriptedByAgent.set(agent.id, scripted)
    } else {
      // Deep agent: sample from universal + community pools.
      const [lo, hi] = POSTS_BY_FREQ[agent.personality.postingFrequency]
      const count = randInt(rng, lo, hi)
      const pool = shuffle(rng, [
        ...UNIVERSAL_POSTS,
        ...UNIVERSAL_POSTS, // weight universal content
        ...COMMUNITY_POSTS[agent.community],
        ...COMMUNITY_POSTS[agent.community],
      ])
      let poolIdx = 0

      for (let i = 0; i < count; i++) {
        const tick = randInt(rng, startTick, TICKS - 1)
        const raw = fillSlots(rng, pool[poolIdx % pool.length])
        poolIdx++
        const content = applyStyle(rng, raw, style)
        const score = engagementRoll(rng)
        const { likes, reposts, replyCount } = engagementToLikes(rng, score)
        posts.push({
          id: nextPostId(agent.id),
          authorId: agent.id,
          content,
          tick,
          engagementScore: score,
          likes,
          reposts,
          replyCount,
          isReply: false,
        })
      }
    }
  }

  posts.sort((a, b) => a.tick - b.tick)
  return { posts, scriptedByAgent }
}

function pickCoverPost(rng: Rng, agent: BuiltAgent): string {
  if (chance(rng, 0.5)) return pick(rng, COMMUNITY_POSTS[agent.community])
  return pick(rng, UNIVERSAL_POSTS)
}
