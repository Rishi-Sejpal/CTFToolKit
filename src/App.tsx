import { useState } from "react"
import { Shell } from './components/layout/Shell'
import { TOOLS } from './tools/registry'

export default function App() {
  const [activeId, setActiveId] = useState<string | null>(TOOLS[0].id)
  const Active = TOOLS.find((t) => t.id === activeId)?.component

  return (
    <Shell tools={TOOLS} activeId={activeId} onSelect={setActiveId}>
      {Active ? <Active /> : null}
    </Shell>
  )
}
