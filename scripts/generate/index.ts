/**
 * GHOST simulation generator.
 *
 *   npm run generate            # default seed
 *   npm run generate -- 42      # explicit seed
 *
 * Deterministic and offline: no API calls. Produces
 * src/data/simulation.json — the single artifact the app replays.
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { SimulationData } from '../../src/lib/types'
import { mulberry32 } from './rng'
import { buildAgents } from './buildAgents'
import { buildNetwork } from './buildNetwork'
import { buildPosts } from './buildPosts'
import { buildTicks } from './buildTicks'
import { buildReveal } from './buildReveal'
import { buildMoments } from './buildMoments'
import { selectClassificationTargets } from './classificationTargets'
import { validateSimulation } from './validate'

const __dirname = dirname(fileURLToPath(import.meta.url))

function main() {
  const seedArg = process.argv[2]
  const seed = seedArg ? Number.parseInt(seedArg, 10) : 20260713
  if (Number.isNaN(seed)) {
    console.error(`Invalid seed: ${seedArg}`)
    process.exit(1)
  }

  const t0 = Date.now()
  const rng = mulberry32(seed)

  process.stdout.write(`GHOST generator — seed ${seed}\n`)

  const agents = buildAgents(rng)
  const shells = agents.filter((a) => a.type === 'shell')
  process.stdout.write(`  agents:        ${agents.length} (${shells.length} synthetic)\n`)

  const followEdges = buildNetwork(rng, agents)
  process.stdout.write(`  follow edges:  ${followEdges.length}\n`)

  const { posts, scriptedByAgent } = buildPosts(rng, agents)
  process.stdout.write(`  posts:         ${posts.length}\n`)

  const ticks = buildTicks(rng, agents, posts, followEdges)
  const eventCount = ticks.reduce((sum, t) => sum + t.events.length, 0)
  process.stdout.write(`  ticks:         ${ticks.length} (${eventCount} events)\n`)

  const revealData = buildReveal(rng, agents, posts, ticks, scriptedByAgent)
  const moments = buildMoments(rng, agents, posts, ticks, scriptedByAgent)
  const classificationTargets = selectClassificationTargets(rng, agents)
  process.stdout.write(`  moments:       ${moments.length}\n`)
  process.stdout.write(`  targets:       ${classificationTargets.length}\n`)

  // Strip the generator-only `playbook` field before serializing.
  const cleanAgents = agents.map((a) => {
    const rest = { ...a }
    delete rest.playbook
    return rest
  })

  const data: SimulationData = {
    generated: new Date().toISOString(),
    agentCount: agents.length,
    tickCount: ticks.length,
    agents: cleanAgents,
    posts,
    ticks,
    interestingMoments: moments,
    classificationTargets,
    revealData,
  }

  const result = validateSimulation(data)
  if (!result.valid) {
    process.stderr.write(`\nValidation FAILED:\n`)
    for (const e of result.errors) process.stderr.write(`  ✗ ${e}\n`)
    process.exit(1)
  }
  for (const w of result.warnings) process.stdout.write(`  ⚠ ${w}\n`)

  const outPath = join(__dirname, '..', '..', 'src', 'data', 'simulation.json')
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, JSON.stringify(data))

  const bytes = Buffer.byteLength(JSON.stringify(data))
  const mb = (bytes / 1_000_000).toFixed(2)
  process.stdout.write(`\n  ✓ wrote ${outPath} (${mb} MB) in ${Date.now() - t0}ms\n`)
}

main()
