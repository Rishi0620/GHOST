'use client'

import { useEffect } from 'react'
import { useStore } from '@/lib/store'

/**
 * Ensures the simulation is loaded before rendering children. Shared by every
 * in-app page so the store is populated regardless of entry point.
 */
export function SimulationGate({ children }: { children: React.ReactNode }) {
  const data = useStore((s) => s.data)
  const loading = useStore((s) => s.loading)
  const error = useStore((s) => s.error)
  const loadSimulation = useStore((s) => s.loadSimulation)

  useEffect(() => {
    loadSimulation()
  }, [loadSimulation])

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="font-mono text-sm text-[var(--color-danger)]">Failed to load network</div>
        <p className="max-w-sm text-sm text-[var(--color-text-secondary)]">{error}</p>
        <button
          onClick={() => loadSimulation()}
          className="mt-2 rounded-md border border-[var(--color-border-bright)] px-4 py-2 font-mono text-xs uppercase tracking-widest text-[var(--color-text)] hover:bg-[var(--color-surface)]"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!data || loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 animate-ghost-pulse rounded-full border-2 border-[var(--color-accent)]/40" />
          <div className="absolute inset-2 animate-ghost-pulse rounded-full border-2 border-[var(--color-accent)]/60" style={{ animationDelay: '0.3s' }} />
          <div className="absolute inset-4 animate-ghost-pulse rounded-full border-2 border-[var(--color-accent)]" style={{ animationDelay: '0.6s' }} />
        </div>
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
          Loading network…
        </p>
      </div>
    )
  }

  return <>{children}</>
}
