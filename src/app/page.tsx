import Link from 'next/link'
import { LandingBackdrop } from '@/components/LandingBackdrop'

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6">
      <div className="ghost-grid absolute inset-0" aria-hidden />
      <LandingBackdrop />

      <main className="relative z-10 flex flex-col items-center text-center">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.5em] text-[var(--color-text-muted)]">
          A living network
        </p>
        <h1 className="text-7xl font-bold tracking-tight text-[var(--color-text)] sm:text-8xl">
          GHOST
        </h1>
        <p className="mt-6 max-w-md text-lg text-[var(--color-text-secondary)]">
          100 identities. Some are real people. Some are synthetic personas built
          to pass as real. The game is telling them apart.
        </p>

        <Link
          href="/simulation"
          className="group mt-10 inline-flex items-center gap-3 rounded-full border border-[var(--color-border-bright)] bg-[var(--color-surface)]/60 px-8 py-3.5 font-mono text-sm uppercase tracking-widest text-[var(--color-text)] backdrop-blur transition-all hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10"
        >
          Enter the network
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </main>

      <footer className="absolute bottom-10 z-10 max-w-lg px-6 text-center">
        <p className="text-sm italic leading-relaxed text-[var(--color-text-muted)]">
          &ldquo;The criteria you use to decide someone is real online are exactly
          the criteria that get engineered first.&rdquo;
        </p>
      </footer>
    </div>
  )
}
