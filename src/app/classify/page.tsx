'use client'

import { SimulationGate } from '@/components/SimulationGate'
import { ClassifyDeck } from '@/components/classify/ClassifyDeck'

export default function ClassifyPage() {
  return (
    <SimulationGate>
      <ClassifyDeck />
    </SimulationGate>
  )
}
