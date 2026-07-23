import 'server-only'
import type {
  Agent,
  ClassificationInput,
  ClassificationResult,
  Post,
  PublicAgent,
  PublicPost,
  RevealResponse,
  SimulationData,
  SimulationResponse,
} from './types'
import rawData from '../data/simulation.json'

/**
 * The full generated dataset, including secret fields (`type`,
 * `hiddenObjective`, `generationRationale`). This module is server-only —
 * `import 'server-only'` makes the build fail if it is ever pulled into a
 * client bundle, which is the guardrail that keeps the answers hidden.
 */
const data = rawData as unknown as SimulationData

/** Public payload: agent types and post rationales stripped out. */
export function getPublicSimulation(): SimulationResponse {
  const agents: PublicAgent[] = data.agents.map((a) => {
    const pub = { ...a } as Partial<Agent>
    delete pub.type
    delete pub.hiddenObjective
    return pub as PublicAgent
  })
  const posts: PublicPost[] = data.posts.map((p) => {
    const pub = { ...p } as Partial<Post>
    delete pub.generationRationale
    return pub as PublicPost
  })

  return {
    generated: data.generated,
    tickCount: data.tickCount,
    agents,
    posts,
    ticks: data.ticks,
    interestingMoments: data.interestingMoments,
    classificationTargets: data.classificationTargets,
  }
}

/**
 * Scores a set of classifications and returns full reveal data.
 *
 * Scoring (max 150 across 10 targets, so 15 per target ceiling):
 *   correct  + high confidence (>70%) → 15  (10 base × 1.5)
 *   correct  + mid  confidence        → 10
 *   correct  + low  confidence (<30%) → 8
 *   wrong    + high confidence (>70%) → -5  (overconfidence penalty)
 *   wrong    + low/mid confidence     → 0
 */
export function scoreClassifications(inputs: ClassificationInput[]): RevealResponse {
  const results: ClassificationResult[] = []
  let score = 0

  for (const input of inputs) {
    const actual = data.revealData.agentTypes[input.agentId]
    if (!actual) continue
    const correct = input.guess === actual
    const conf = clampConfidence(input.confidence)

    let points: number
    if (correct) {
      if (conf > 70) points = 15
      else if (conf < 30) points = 8
      else points = 10
    } else {
      points = conf > 70 ? -5 : 0
    }

    score += points
    results.push({
      agentId: input.agentId,
      actual,
      guess: input.guess,
      correct,
      confidence: conf,
      points,
    })
  }

  const maxScore = results.length * 15
  const correctCount = results.filter((r) => r.correct).length
  const shellsInSet = results.filter((r) => r.actual === 'shell').length
  const shellCount = data.agents.filter((a) => a.type === 'shell').length

  // Only reveal shell profiles for the shells the player actually classified.
  const classifiedShellIds = new Set(
    results.filter((r) => r.actual === 'shell').map((r) => r.agentId),
  )
  const shellProfiles = data.revealData.shellProfiles.filter((p) =>
    classifiedShellIds.has(p.agentId),
  )

  return {
    score,
    maxScore,
    results,
    shellProfiles,
    summary: buildSummary(correctCount, results.length, shellsInSet, score, maxScore),
    agentTypes: data.revealData.agentTypes,
    coordinationEdges: data.revealData.coordinationEdges,
    shellCount,
    agentCount: data.agents.length,
  }
}

function clampConfidence(c: number): number {
  if (Number.isNaN(c)) return 50
  return Math.max(0, Math.min(100, Math.round(c)))
}

function buildSummary(
  correct: number,
  total: number,
  shellsInSet: number,
  score: number,
  maxScore: number,
): string {
  const chance = Math.round(total * 0.5)
  const chancePoints = Math.round(maxScore * 0.5 * (10 / 15)) // ~ random baseline
  const delta = score - chancePoints
  const verb = delta > 8 ? 'above' : delta < -8 ? 'below' : 'at'
  return (
    `You identified ${correct} of ${total} correctly. ` +
    `Random guessing lands near ${chance}. ` +
    `You scored ${verb} chance. ` +
    `The set contained ${shellsInSet} synthetic accounts, each engineered to pass the exact test you just took.`
  )
}

/** True if a given agent id is one of the classification targets. */
export function isClassificationTarget(agentId: string): boolean {
  return data.classificationTargets.includes(agentId)
}
