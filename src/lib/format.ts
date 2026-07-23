/** Compact follower/like counts: 1234 → "1.2k". */
export function compact(n: number): string {
  if (n < 1000) return String(n)
  if (n < 10000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  return Math.round(n / 1000) + 'k'
}

/** Deterministic avatar initials from a display name. */
export function initials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export const COMMUNITY_LABEL: Record<string, string> = {
  tech: 'Tech',
  political: 'Political',
  lifestyle: 'Lifestyle',
  niche: 'Niche',
  bridge: 'Bridge',
}
