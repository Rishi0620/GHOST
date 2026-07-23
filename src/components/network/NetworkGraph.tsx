'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  forceX,
  forceY,
  zoom,
  zoomIdentity,
  select,
  type Simulation,
  type ZoomBehavior,
} from 'd3'
import type { PublicAgent } from '@/lib/types'
import { useStore, COMMUNITY_HEX } from '@/lib/store'
import { computeNetworkState, edgeKey } from '@/lib/networkState'

interface SimNode {
  id: string
  community: string
  x: number
  y: number
  vx?: number
  vy?: number
  fx?: number | null
  fy?: number | null
}

interface SimLink {
  source: SimNode | string
  target: SimNode | string
  key: string
}

interface Props {
  revealMode?: boolean
  revealedShells?: Set<string>
  coordinationEdges?: { sourceId: string; targetId: string }[]
}

/**
 * D3 runs the force *physics* only; React renders every SVG element from the
 * positions D3 computes. The two never fight over the DOM. A ticking counter
 * bumps React on each simulation step.
 */
export function NetworkGraph({ revealMode, revealedShells, coordinationEdges }: Props) {
  const data = useStore((s) => s.data)
  const currentTick = useStore((s) => s.currentTick)
  const selectedAgentId = useStore((s) => s.selectedAgentId)
  const hoveredAgentId = useStore((s) => s.hoveredAgentId)
  const selectAgent = useStore((s) => s.selectAgent)
  const hoverAgent = useStore((s) => s.hoverAgent)

  const wrapRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const gRef = useRef<SVGGElement>(null)
  const simRef = useRef<Simulation<SimNode, undefined> | null>(null)
  const nodesRef = useRef<SimNode[]>([])
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null)

  const [, force] = useState(0)
  const [size, setSize] = useState({ w: 900, h: 640 })
  const [transform, setTransform] = useState(zoomIdentity)

  // Build static structure once (final follow graph = layout skeleton).
  const { nodes, links } = useMemo(() => {
    if (!data) return { nodes: [] as SimNode[], links: [] as SimLink[] }
    // Start each node near its community anchor so the layout settles fast and
    // already reads as clustered on the first frame.
    const nodes: SimNode[] = data.agents.map((a: PublicAgent) => {
      const anchor = communityAnchor(a.community, size)
      return {
        id: a.id,
        community: a.community,
        x: anchor.x + (Math.random() - 0.5) * 120,
        y: anchor.y + (Math.random() - 0.5) * 120,
      }
    })
    const seen = new Set<string>()
    const links: SimLink[] = []
    for (const a of data.agents) {
      for (const followeeId of a.following) {
        const k = edgeKey(a.id, followeeId)
        if (seen.has(k)) continue
        seen.add(k)
        links.push({ source: a.id, target: followeeId, key: k })
      }
    }
    return { nodes, links }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  // Resize observer — only propagate real (>2px) changes so sub-pixel layout
  // jitter can't re-heat the simulation in a loop.
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth
      const h = el.clientHeight
      setSize((prev) =>
        Math.abs(prev.w - w) > 2 || Math.abs(prev.h - h) > 2 ? { w, h } : prev,
      )
    })
    ro.observe(el)
    setSize({ w: el.clientWidth, h: el.clientHeight })
    return () => ro.disconnect()
  }, [])

  // Set up the simulation once nodes exist.
  useEffect(() => {
    if (nodes.length === 0) return
    nodesRef.current = nodes

    const sim = forceSimulation<SimNode>(nodes)
      .force(
        'link',
        forceLink<SimNode, SimLink>(links)
          .id((d) => d.id)
          .distance(60)
          .strength(0.35),
      )
      .force('charge', forceManyBody().strength(-120))
      .force('center', forceCenter(size.w / 2, size.h / 2))
      .force('collide', forceCollide(15))
      // Community clustering: pull each community toward its own anchor.
      .force('x', forceX<SimNode>((d) => communityAnchor(d.community, size).x).strength(0.12))
      .force('y', forceY<SimNode>((d) => communityAnchor(d.community, size).y).strength(0.12))
      .velocityDecay(0.55)
      .alpha(0.9)
      .alphaMin(0.02)
      .alphaDecay(0.03)

    sim.on('tick', () => force((n) => n + 1))
    // Freeze positions once settled so nodes are reliably clickable.
    sim.on('end', () => {
      for (const n of nodes) {
        n.fx = n.x
        n.fy = n.y
      }
    })
    simRef.current = sim

    return () => {
      sim.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, links])

  // Keep center/cluster forces in sync with size, but skip the first run so we
  // don't re-heat the simulation immediately after the initial layout settles.
  const sizeSynced = useRef(false)
  useEffect(() => {
    const sim = simRef.current
    if (!sim) return
    if (!sizeSynced.current) {
      sizeSynced.current = true
      return
    }
    sim.force('center', forceCenter(size.w / 2, size.h / 2))
    sim.force('x', forceX<SimNode>((d) => communityAnchor(d.community, size).x).strength(0.12))
    sim.force('y', forceY<SimNode>((d) => communityAnchor(d.community, size).y).strength(0.12))
    sim.alpha(0.3).restart()
  }, [size])

  // Zoom/pan.
  useEffect(() => {
    if (!svgRef.current) return
    const svg = select(svgRef.current)
    const z = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 4])
      .on('zoom', (event) => setTransform(event.transform))
    zoomRef.current = z
    svg.call(z)
    return () => {
      svg.on('.zoom', null)
    }
  }, [])

  // Network state at current tick (follower counts, edge weights, pulses).
  const netState = useMemo(() => {
    if (!data) return null
    return computeNetworkState(data.ticks, currentTick)
  }, [data, currentTick])

  const maxFollowers = useMemo(() => {
    if (!netState) return 1
    let m = 1
    for (const v of netState.followerCount.values()) m = Math.max(m, v)
    return m
  }, [netState])

  if (!data) return null

  const nodeById = new Map(nodesRef.current.map((n) => [n.id, n]))
  const neighborSet = selectedAgentId ? neighborsOf(selectedAgentId, data.agents) : null

  const radiusFor = (id: string): number => {
    const f = netState?.followerCount.get(id) ?? 0
    return 4 + Math.sqrt(f / maxFollowers) * 14
  }

  const isRecent = (id: string): boolean => {
    const last = netState?.lastPostTick.get(id)
    return last != null && currentTick - last <= 3
  }

  const resetView = () => {
    if (svgRef.current && zoomRef.current) {
      select(svgRef.current).transition().duration(400).call(zoomRef.current.transform, zoomIdentity)
    }
  }

  return (
    <div ref={wrapRef} className="relative h-full w-full">
      <svg
        ref={svgRef}
        className="h-full w-full cursor-grab active:cursor-grabbing"
        onClick={() => selectAgent(hoveredAgentId)}
      >
        <g ref={gRef} transform={transform.toString()}>
          {/* interaction edges */}
          {links.map((l) => {
            const s = nodeById.get(typeof l.source === 'string' ? l.source : l.source.id)
            const t = nodeById.get(typeof l.target === 'string' ? l.target : l.target.id)
            if (!s || !t) return null
            const w = netState?.edgeWeight.get(l.key) ?? 0
            const active = w > 0
            const touchesSelection =
              selectedAgentId != null && (s.id === selectedAgentId || t.id === selectedAgentId)
            return (
              <line
                key={l.key}
                x1={s.x}
                y1={s.y}
                x2={t.x}
                y2={t.y}
                stroke={touchesSelection ? '#4a9eff' : '#3a3a4f'}
                strokeWidth={Math.min(2.5, 0.4 + w * 0.12)}
                strokeOpacity={touchesSelection ? 0.6 : active ? Math.min(0.35, 0.08 + w * 0.03) : 0.05}
              />
            )
          })}

          {/* coordination edges (reveal only) */}
          {revealMode &&
            coordinationEdges?.map((e, i) => {
              const s = nodeById.get(e.sourceId)
              const t = nodeById.get(e.targetId)
              if (!s || !t) return null
              const shown =
                revealedShells?.has(e.sourceId) && revealedShells?.has(e.targetId)
              if (!shown) return null
              return (
                <line
                  key={`coord-${i}`}
                  x1={s.x}
                  y1={s.y}
                  x2={t.x}
                  y2={t.y}
                  stroke="#ff4444"
                  strokeWidth={1}
                  strokeOpacity={0.4}
                  strokeDasharray="3 3"
                  className="animate-ghost-fade-in"
                />
              )
            })}

          {/* nodes */}
          {nodesRef.current.map((n) => {
            const r = radiusFor(n.id)
            const selected = n.id === selectedAgentId
            const hovered = n.id === hoveredAgentId
            const recent = isRecent(n.id)
            const isShell = revealedShells?.has(n.id)
            let fill = COMMUNITY_HEX[n.community] ?? '#4a9eff'
            if (revealMode && revealedShells) {
              fill = isShell ? '#ff4444' : '#44ff88'
            }
            const dim =
              selectedAgentId != null && !selected && !(neighborSet?.has(n.id) ?? false)
            return (
              <g
                key={n.id}
                transform={`translate(${n.x},${n.y})`}
                onClick={() => selectAgent(n.id)}
                onMouseEnter={() => hoverAgent(n.id)}
                onMouseLeave={() => hoverAgent(null)}
                className="cursor-pointer"
              >
                {recent && (
                  <circle
                    r={r + 6}
                    fill="none"
                    stroke={fill}
                    strokeWidth={1.5}
                    opacity={0.5}
                    className="animate-ghost-pulse"
                  />
                )}
                {selected && (
                  <circle r={r + 5} fill="none" stroke="#e8e8f0" strokeWidth={1.5} opacity={0.9} />
                )}
                <circle
                  r={selected || hovered ? r * 1.25 : r}
                  fill={fill}
                  opacity={dim ? 0.2 : 0.92}
                  stroke={revealMode ? fill : 'rgba(0,0,0,0.35)'}
                  strokeWidth={1}
                  style={{ transition: 'r 0.15s ease, opacity 0.3s ease, fill 0.6s ease' }}
                />
              </g>
            )
          })}
        </g>
      </svg>

      {/* hover tooltip */}
      <HoverTooltip nodeById={nodeById} transform={transform} netState={netState} />

      <button
        onClick={resetView}
        className="absolute bottom-3 right-3 rounded border border-[var(--color-border)] bg-[var(--color-surface)]/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)] backdrop-blur transition-colors hover:text-[var(--color-text)]"
      >
        reset view
      </button>
    </div>
  )
}

function HoverTooltip({
  nodeById,
  transform,
  netState,
}: {
  nodeById: Map<string, SimNode>
  transform: { apply: (p: [number, number]) => [number, number] }
  netState: ReturnType<typeof computeNetworkState> | null
}) {
  const hoveredAgentId = useStore((s) => s.hoveredAgentId)
  const agentsById = useStore((s) => s.agentsById)
  if (!hoveredAgentId) return null
  const node = nodeById.get(hoveredAgentId)
  const agent = agentsById.get(hoveredAgentId)
  if (!node || !agent) return null
  const [px, py] = transform.apply([node.x, node.y])
  const followers = netState?.followerCount.get(hoveredAgentId) ?? 0
  return (
    <div
      className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded border border-[var(--color-border-bright)] bg-[var(--color-elevated)] px-3 py-2 shadow-xl"
      style={{ left: px, top: py - 14 }}
    >
      <div className="font-mono text-xs text-[var(--color-text)]">@{agent.username}</div>
      <div className="mt-0.5 text-[10px] text-[var(--color-text-secondary)]">
        {followers} followers · {agent.community}
      </div>
    </div>
  )
}

function communityAnchor(community: string, size: { w: number; h: number }) {
  const positions: Record<string, [number, number]> = {
    tech: [0.28, 0.32],
    political: [0.72, 0.34],
    lifestyle: [0.3, 0.72],
    niche: [0.74, 0.72],
    bridge: [0.5, 0.5],
  }
  const [fx, fy] = positions[community] ?? [0.5, 0.5]
  return { x: fx * size.w, y: fy * size.h }
}

function neighborsOf(selectedId: string, agents: PublicAgent[]): Set<string> {
  const set = new Set<string>()
  const self = agents.find((a) => a.id === selectedId)
  if (!self) return set
  for (const id of self.following) set.add(id)
  for (const id of self.followers) set.add(id)
  return set
}
