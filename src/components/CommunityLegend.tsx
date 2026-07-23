import { COMMUNITY_HEX } from '@/lib/store'
import { COMMUNITY_LABEL } from '@/lib/format'

const ORDER = ['tech', 'political', 'lifestyle', 'niche', 'bridge']

export function CommunityLegend({ reveal }: { reveal?: boolean }) {
  return (
    <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-3 backdrop-blur">
      <div className="mb-0.5 font-mono text-[9px] uppercase tracking-widest text-[var(--color-text-muted)]">
        {reveal ? 'Verdict' : 'Communities'}
      </div>
      {reveal ? (
        <>
          <LegendRow color="#ff4444" label="Synthetic" />
          <LegendRow color="#44ff88" label="Real" />
        </>
      ) : (
        ORDER.map((c) => <LegendRow key={c} color={COMMUNITY_HEX[c]} label={COMMUNITY_LABEL[c]} />)
      )}
    </div>
  )
}

function LegendRow({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      <span className="text-[11px] text-[var(--color-text-secondary)]">{label}</span>
    </div>
  )
}
