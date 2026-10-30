import { useState, useEffect } from "react"
import { Shell } from './components/layout/Shell'
import { TOOLS } from './tools/registry'

export default function App() {
  const [activeId, setActiveId] = useState<string | null>('home')

  useEffect(() => {
    const h = (e: Event) => setActiveId((e as CustomEvent).detail)
    window.addEventListener('ctftoolkit:nav', h)
    return () => window.removeEventListener('ctftoolkit:nav', h)
  }, [])
  const Active = TOOLS.find((t) => t.id === activeId)?.component

  return (
    <Shell tools={TOOLS} activeId={activeId} onSelect={setActiveId}>
      {Active ? <Active /> : null}
    </Shell>
  )
}
