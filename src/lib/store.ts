import { create } from 'zustand'
import type {
  ClassificationInput,
  GamePhase,
  PlaybackSpeed,
  PublicAgent,
  PublicPost,
  RevealResponse,
  SimulationResponse,
} from './types'

interface SimulationStore {
  // Data
  data: SimulationResponse | null
  loading: boolean
  error: string | null

  // Fast lookups (built once on load)
  agentsById: Map<string, PublicAgent>
  postsByAuthor: Map<string, PublicPost[]>

  // Reveal
  reveal: RevealResponse | null
  submitting: boolean

  // Playback
  currentTick: number
  isPlaying: boolean
  speed: PlaybackSpeed

  // UI
  selectedAgentId: string | null
  hoveredAgentId: string | null

  // Game
  gamePhase: GamePhase
  classifications: Record<string, ClassificationInput>

  // Actions
  loadSimulation: () => Promise<void>
  play: () => void
  pause: () => void
  togglePlay: () => void
  setSpeed: (speed: PlaybackSpeed) => void
  jumpToTick: (tick: number) => void
  tickForward: () => void
  selectAgent: (id: string | null) => void
  hoverAgent: (id: string | null) => void
  setGamePhase: (phase: GamePhase) => void
  classify: (input: ClassificationInput) => void
  clearClassification: (agentId: string) => void
  submitClassifications: () => Promise<void>
  resetGame: () => void
}

export const useStore = create<SimulationStore>((set, get) => ({
  data: null,
  loading: false,
  error: null,
  agentsById: new Map(),
  postsByAuthor: new Map(),
  reveal: null,
  submitting: false,

  currentTick: 0,
  isPlaying: false,
  speed: 5,

  selectedAgentId: null,
  hoveredAgentId: null,

  gamePhase: 'observe',
  classifications: {},

  loadSimulation: async () => {
    if (get().data || get().loading) return
    set({ loading: true, error: null })
    try {
      const res = await fetch('/api/simulation')
      if (!res.ok) throw new Error(`Failed to load simulation (${res.status})`)
      const data: SimulationResponse = await res.json()

      const agentsById = new Map(data.agents.map((a) => [a.id, a]))
      const postsByAuthor = new Map<string, PublicPost[]>()
      for (const p of data.posts) {
        if (!postsByAuthor.has(p.authorId)) postsByAuthor.set(p.authorId, [])
        postsByAuthor.get(p.authorId)!.push(p)
      }
      for (const list of postsByAuthor.values()) list.sort((a, b) => a.tick - b.tick)

      set({ data, agentsById, postsByAuthor, loading: false, currentTick: data.tickCount - 1 })
    } catch (err) {
      set({ loading: false, error: err instanceof Error ? err.message : 'Unknown error' })
    }
  },

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setSpeed: (speed) => set({ speed }),

  jumpToTick: (tick) => {
    const max = (get().data?.tickCount ?? 1) - 1
    set({ currentTick: Math.max(0, Math.min(max, tick)) })
  },

  tickForward: () => {
    const { currentTick, data, speed } = get()
    const max = (data?.tickCount ?? 1) - 1
    const next = currentTick + speed
    if (next >= max) {
      set({ currentTick: max, isPlaying: false })
    } else {
      set({ currentTick: next })
    }
  },

  selectAgent: (id) => set({ selectedAgentId: id }),
  hoverAgent: (id) => set({ hoveredAgentId: id }),
  setGamePhase: (gamePhase) => set({ gamePhase }),

  classify: (input) =>
    set((s) => ({ classifications: { ...s.classifications, [input.agentId]: input } })),

  clearClassification: (agentId) =>
    set((s) => {
      const next = { ...s.classifications }
      delete next[agentId]
      return { classifications: next }
    }),

  submitClassifications: async () => {
    const { classifications } = get()
    set({ submitting: true, error: null })
    try {
      const res = await fetch('/api/reveal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classifications: Object.values(classifications) }),
      })
      if (!res.ok) throw new Error(`Reveal failed (${res.status})`)
      const reveal: RevealResponse = await res.json()
      set({ reveal, submitting: false, gamePhase: 'reveal' })
    } catch (err) {
      set({ submitting: false, error: err instanceof Error ? err.message : 'Unknown error' })
    }
  },

  resetGame: () =>
    set({
      gamePhase: 'observe',
      classifications: {},
      reveal: null,
      selectedAgentId: null,
    }),
}))

/** Community → CSS color variable, for node fills and tags. */
export const COMMUNITY_COLOR: Record<string, string> = {
  tech: 'var(--color-tech)',
  political: 'var(--color-political)',
  lifestyle: 'var(--color-lifestyle)',
  niche: 'var(--color-niche)',
  bridge: 'var(--color-bridge)',
}

export const COMMUNITY_HEX: Record<string, string> = {
  tech: '#4a9eff',
  political: '#ff6b6b',
  lifestyle: '#51cf66',
  niche: '#cc5de8',
  bridge: '#ffd43b',
}
