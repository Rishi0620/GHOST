import type { PublicPost } from '@/lib/types'
import { compact } from '@/lib/format'
import { tickToDate } from '@/lib/networkState'

interface Props {
  post: PublicPost
  highlight?: boolean
}

export function PostCard({ post, highlight }: Props) {
  return (
    <div
      className={`rounded-lg border p-3 transition-colors ${
        highlight
          ? 'border-[var(--color-shell)]/60 bg-[var(--color-shell)]/5'
          : 'border-[var(--color-border)] bg-[var(--color-bg)]/40'
      }`}
    >
      <p className="text-sm leading-relaxed text-[var(--color-text)]">{post.content}</p>
      <div className="mt-2.5 flex items-center gap-4 font-mono text-[10px] text-[var(--color-text-muted)]">
        <span>{tickToDate(post.tick)}</span>
        <span className="ml-auto flex items-center gap-3">
          <span>♥ {compact(post.likes)}</span>
          <span>↻ {compact(post.reposts)}</span>
          <span>💬 {compact(post.replyCount)}</span>
        </span>
      </div>
    </div>
  )
}
