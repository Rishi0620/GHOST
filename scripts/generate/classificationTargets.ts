import type { BuiltAgent } from './buildAgents'
import { shuffle, type Rng } from './rng'

/**
 * Selects the 10 agents the player classifies: 5 synthetic, 5 real, spread
 * across communities, and biased toward agents with enough posts to actually
 * study. A balanced set keeps the game honest — the score should reflect skill,
 * not the base rate.
 */
export function selectClassificationTargets(rng: Rng, agents: BuiltAgent[]): string[] {
  const shells = shuffle(rng, agents.filter((a) => a.type === 'shell'))
  const deep = shuffle(rng, agents.filter((a) => a.type === 'deep'))

  // Prefer variety of communities among the 5 shells.
  const pickedShells = pickDiverse(shells, 5)
  const pickedDeep = pickDiverse(deep, 5)

  // Interleave so the game doesn't present all shells together.
  const interleaved: string[] = []
  for (let i = 0; i < 5; i++) {
    if (pickedShells[i]) interleaved.push(pickedShells[i].id)
    if (pickedDeep[i]) interleaved.push(pickedDeep[i].id)
  }
  return shuffle(rng, interleaved)
}

function pickDiverse(pool: BuiltAgent[], n: number): BuiltAgent[] {
  const chosen: BuiltAgent[] = []
  const seenCommunities = new Set<string>()

  for (const a of pool) {
    if (chosen.length >= n) break
    if (!seenCommunities.has(a.community)) {
      chosen.push(a)
      seenCommunities.add(a.community)
    }
  }
  // Backfill if we couldn't hit n distinct communities.
  for (const a of pool) {
    if (chosen.length >= n) break
    if (!chosen.includes(a)) chosen.push(a)
  }
  return chosen
}
