'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import type { PlaybackSpeed } from '@/lib/types'
import { tickToDate } from '@/lib/networkState'

const SPEEDS: PlaybackSpeed[] = [1, 5, 10, 20]

export function PlaybackControls() {
  const router = useRouter()
  const data = useStore((s) => s.data)
  const currentTick = useStore((s) => s.currentTick)
  const isPlaying = useStore((s) => s.isPlaying)
  const speed = useStore((s) => s.speed)
  const togglePlay = useStore((s) => s.togglePlay)
  const setSpeed = useStore((s) => s.setSpeed)
  const jumpToTick = useStore((s) => s.jumpToTick)
  const tickForward = useStore((s) => s.tickForward)
  const pause = useStore((s) => s.pause)

  const [momentsOpen, setMomentsOpen] = useState(false)
  const tickCount = data?.tickCount ?? 500

  // Playback driver: advances the tick on an interval while playing.
  const rafRef = useRef<number | null>(null)
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => tickForward(), 120)
    return () => clearInterval(interval)
  }, [isPlaying, tickForward])
  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

  if (!data) return null

  const pct = (currentTick / (tickCount - 1)) * 100

  return (
    <div className="flex items-center gap-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3">
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-bold tracking-widest text-[var(--color-text)]">
          GHOST
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-[var(--color-bg)] px-2 py-0.5">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isPlaying ? 'bg-[var(--color-success)] animate-ghost-pulse' : 'bg-[var(--color-text-muted)]'
            }`}
          />
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-secondary)]">
            {isPlaying ? 'live' : 'paused'}
          </span>
        </span>
      </div>

      {/* transport */}
      <div className="flex items-center gap-1">
        <IconButton label="restart" onClick={() => jumpToTick(0)}>⏮</IconButton>
        <IconButton label={isPlaying ? 'pause' : 'play'} onClick={togglePlay} primary>
          {isPlaying ? '⏸' : '▶'}
        </IconButton>
        <IconButton label="end" onClick={() => jumpToTick(tickCount - 1)}>⏭</IconButton>
      </div>

      {/* scrubber */}
      <div className="flex flex-1 items-center gap-3">
        <input
          type="range"
          min={0}
          max={tickCount - 1}
          value={currentTick}
          onChange={(e) => jumpToTick(Number(e.target.value))}
          className="ghost-range flex-1"
          style={{ '--pct': `${pct}%` } as React.CSSProperties}
        />
        <span className="w-40 shrink-0 text-right font-mono text-[11px] text-[var(--color-text-secondary)]">
          {tickToDate(currentTick)} · <span className="text-[var(--color-text-muted)]">t{currentTick}</span>
        </span>
      </div>

      {/* speed */}
      <div className="flex items-center gap-1 rounded-md border border-[var(--color-border)] p-0.5">
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={`rounded px-2 py-1 font-mono text-[11px] transition-colors ${
              speed === s
                ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
            }`}
          >
            {s}×
          </button>
        ))}
      </div>

      {/* moments dropdown */}
      <div className="relative">
        <button
          onClick={() => setMomentsOpen((o) => !o)}
          className="rounded-md border border-[var(--color-border)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border-bright)] hover:text-[var(--color-text)]"
        >
          Moments ▾
        </button>
        {momentsOpen && (
          <div className="absolute right-0 top-full z-30 mt-2 w-72 rounded-lg border border-[var(--color-border-bright)] bg-[var(--color-elevated)] p-1.5 shadow-2xl">
            {data.interestingMoments.map((m) => (
              <button
                key={m.label + m.tick}
                onClick={() => {
                  jumpToTick(m.tick)
                  setMomentsOpen(false)
                }}
                className="block w-full rounded px-3 py-2 text-left transition-colors hover:bg-[var(--color-surface)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text)]">{m.label}</span>
                  <span className="font-mono text-[10px] text-[var(--color-text-muted)]">t{m.tick}</span>
                </div>
                <p className="mt-0.5 text-[11px] leading-snug text-[var(--color-text-secondary)]">
                  {m.description}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => {
          pause()
          router.push('/classify')
        }}
        className="rounded-md bg-[var(--color-accent)] px-4 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-black transition-opacity hover:opacity-90"
      >
        Begin classification →
      </button>
    </div>
  )
}

function IconButton({
  children,
  onClick,
  label,
  primary,
}: {
  children: React.ReactNode
  onClick: () => void
  label: string
  primary?: boolean
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors ${
        primary
          ? 'bg-[var(--color-elevated)] text-[var(--color-text)] hover:bg-[var(--color-border)]'
          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-elevated)] hover:text-[var(--color-text)]'
      }`}
    >
      {children}
    </button>
  )
}
