# GHOST

An interactive simulation of a social network in which authentic and synthetic
accounts are indistinguishable. The user observes a network of 100 accounts
evolving over a three-week window, attempts to classify a sample of them as real
or synthetic, and is then shown how each synthetic account was constructed.

The premise is that the signals people rely on to judge authenticity online —
posting cadence, emotional vulnerability, occasional disagreement, off-topic
content — are also the signals that are easiest to engineer.

## How it works

The simulation is generated once, offline, and replayed in the browser. There
are no external API calls at runtime, which makes the result reproducible and
scrubbable like a recording.

```
scripts/generate/  ->  src/data/simulation.json  ->  /api/simulation  ->  replay UI
```

The generator (`scripts/generate/`) is deterministic and seeded. It produces
100 accounts (70 authentic, 30 synthetic), roughly 2,000 posts, and 500
tick-by-tick event frames, along with a balanced 10-account classification set
and the full reveal data.

- Synthetic accounts follow one of ten manipulation "playbooks"
  (`scripts/generate/content/playbooks.ts`). Each playbook is a five-phase arc —
  trust-building, topic introduction, soft framing, confident position, and
  payload — and every scripted post carries a hidden rationale used to build the
  reveal timeline.
- Authentic-account posts are sampled from community-specific content pools in
  `scripts/generate/content/deepContent.ts`.

### Data boundary

The ground-truth fields (`type`, `hiddenObjective`, and per-post
`generationRationale`) exist only in the generated data file. `src/lib/simulation.ts`
is marked `import 'server-only'` and strips them before assembling the public
`/api/simulation` response, so the client never receives the answers. They are
returned only by `/api/reveal`, and only after a classification is submitted.

## Application flow

| Route         | Description                                                                 |
| ------------- | --------------------------------------------------------------------------- |
| `/`           | Landing page                                                                |
| `/simulation` | Force-directed network with playback, account inspection, and activity feed |
| `/classify`   | Classify 10 accounts as real or synthetic, with a confidence value          |
| `/reveal`     | Score, per-account manipulation timelines, and a final unlabeled test set   |

The network graph uses D3 for force simulation only; React renders all SVG from
the positions D3 computes.

## Tech stack

Next.js (App Router), React, TypeScript, Tailwind CSS, Zustand, D3, Zod.

## Getting started

Requires Node.js 20 or later.

```bash
npm install
npm run generate   # builds src/data/simulation.json
npm run dev        # http://localhost:3000
```

`src/data/simulation.json` is committed, so `npm run generate` is only needed to
rebuild the dataset (optionally with a seed: `npm run generate -- 42`).

## Scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start the development server         |
| `npm run build`     | Production build                     |
| `npm run start`     | Serve the production build           |
| `npm run generate`  | Regenerate `src/data/simulation.json`|
| `npm run typecheck` | Type-check with `tsc --noEmit`       |
| `npm run lint`      | Run ESLint                           |

## Project structure

```
scripts/generate/     Deterministic simulation generator
src/data/             Generated simulation.json
src/lib/              Types, store, server-only data access, helpers
src/app/              Routes and API handlers
src/components/       UI components (network graph, profile, classify, reveal)
```

## Deployment

The project is a standard Next.js application and deploys without additional
configuration. It requires no environment variables. On Vercel, import the
repository and accept the detected framework settings.
