'use client'

import { SimulationGate } from '@/components/SimulationGate'
import { PlaybackControls } from '@/components/PlaybackControls'
import { NetworkGraph } from '@/components/network/NetworkGraph'
import { AgentProfile } from '@/components/AgentProfile'
import { ActivityFeed } from '@/components/ActivityFeed'
import { CommunityLegend } from '@/components/CommunityLegend'

export default function SimulationPage() {
  return (
    <SimulationGate>
      <div className="flex h-screen flex-col">
        <PlaybackControls />
        <div className="flex min-h-0 flex-1">
          <div className="relative min-w-0 flex-1 border-r border-[var(--color-border)]">
            <CommunityLegend />
            <NetworkGraph />
          </div>
          <aside className="w-[380px] shrink-0 bg-[var(--color-surface)]">
            <AgentProfile classifyCta />
          </aside>
        </div>
        <ActivityFeed />
      </div>
    </SimulationGate>
  )
}
