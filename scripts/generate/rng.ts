/**
 * Deterministic seeded RNG (mulberry32) so `npm run generate`
 * always produces the same simulation.json for a given seed.
 */
export type Rng = () => number

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function pick<T>(rng: Rng, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]
}

export function pickN<T>(rng: Rng, arr: readonly T[], n: number): T[] {
  return shuffle(rng, arr).slice(0, n)
}

export function shuffle<T>(rng: Rng, arr: readonly T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function randInt(rng: Rng, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1))
}

export function chance(rng: Rng, p: number): boolean {
  return rng() < p
}

/** skewed toward low values — most posts are low engagement */
export function engagementRoll(rng: Rng): number {
  const r = rng()
  return Math.min(100, Math.max(1, Math.floor(Math.pow(r, 2.6) * 100) + randInt(rng, 1, 8)))
}
