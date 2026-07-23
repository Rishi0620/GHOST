import { initials } from '@/lib/format'
import { COMMUNITY_HEX } from '@/lib/store'

interface Props {
  displayName: string
  community: string
  size?: number
  ring?: string
}

export function Avatar({ displayName, community, size = 40, ring }: Props) {
  const color = COMMUNITY_HEX[community] ?? '#4a9eff'
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-mono font-semibold text-black"
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: size * 0.36,
        boxShadow: ring ? `0 0 0 2px var(--color-bg), 0 0 0 4px ${ring}` : undefined,
      }}
    >
      {initials(displayName)}
    </div>
  )
}
