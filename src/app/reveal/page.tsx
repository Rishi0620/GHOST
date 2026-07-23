'use client'

import { SimulationGate } from '@/components/SimulationGate'
import { RevealExperience } from '@/components/reveal/RevealExperience'

export default function RevealPage() {
  return (
    <SimulationGate>
      <RevealExperience />
    </SimulationGate>
  )
}
