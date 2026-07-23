import type { SimulationData } from '../../src/lib/types'

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Post-generation sanity checks. Hard errors abort the write; warnings are
 * printed but non-fatal.
 */
export function validateSimulation(data: SimulationData): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  const shells = data.agents.filter((a) => a.type === 'shell')
  if (shells.length < 25 || shells.length > 35) {
    errors.push(`Shell count out of range: ${shells.length} (want 25–35)`)
  }

  if (data.agents.length !== 100) {
    warnings.push(`Agent count is ${data.agents.length}, expected 100`)
  }

  const avgPosts = data.posts.length / data.agents.length
  if (avgPosts < 12 || avgPosts > 40) {
    warnings.push(`Avg posts/agent = ${avgPosts.toFixed(1)} (want 12–40)`)
  }

  // Every shell must carry a hidden objective and at least one vulnerability.
  for (const shell of shells) {
    if (!shell.hiddenObjective) {
      errors.push(`Shell ${shell.id} missing hiddenObjective`)
    }
    const shellPosts = data.posts.filter((p) => p.authorId === shell.id)
    const hasVuln = shellPosts.some((p) => p.generationRationale?.includes('VULNERABILITY'))
    if (!hasVuln) {
      warnings.push(`Shell ${shell.id} has no vulnerability post`)
    }
  }

  // Reveal must cover every shell.
  if (data.revealData.shellProfiles.length !== shells.length) {
    errors.push(
      `Reveal profiles (${data.revealData.shellProfiles.length}) != shell count (${shells.length})`,
    )
  }

  // Classification targets: 10, balanced.
  if (data.classificationTargets.length !== 10) {
    errors.push(`Expected 10 classification targets, got ${data.classificationTargets.length}`)
  }
  const targetTypes = data.classificationTargets.map(
    (id) => data.agents.find((a) => a.id === id)?.type,
  )
  const targetShells = targetTypes.filter((t) => t === 'shell').length
  if (targetShells !== 5) {
    warnings.push(`Classification targets have ${targetShells} shells (want 5 for balance)`)
  }

  // Tick coverage.
  const maxTick = Math.max(...data.ticks.map((t) => t.tick))
  if (maxTick < 490) {
    errors.push(`Simulation only reaches tick ${maxTick} (want 490+)`)
  }

  // No orphan agents (everyone should have at least one follow relationship).
  const orphans = data.agents.filter((a) => a.followers.length === 0 && a.following.length === 0)
  if (orphans.length > 0) {
    warnings.push(`${orphans.length} agents have no connections`)
  }

  // Public payload must never leak type/objective into posts... (that's the app's
  // job, but assert the reveal is the only place types live here).
  return { valid: errors.length === 0, errors, warnings }
}
