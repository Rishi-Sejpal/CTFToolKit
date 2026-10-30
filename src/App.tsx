import { useState, useEffect } from "react"
import { Shell } from './components/layout/Shell'
import { TOOLS } from './tools/registry'
import HomePage from './tools/components/HomePage'

export default function App() {
  const [showHome, setShowHome] = useState(true)
  const [activeId, setActiveId] = useState<string | null>(TOOLS[0].id)

  useEffect(() => {
    const h = (e: Event) => { setActiveId((e as CustomEvent).detail); setShowHome(false) }
    window.addEventListener('ctftoolkit:nav', h)
    return () => window.removeEventListener('ctftoolkit:nav', h)
  }, [])
  const Active = TOOLS.find((t) => t.id === activeId)?.component

  if (showHome) {
    return <HomePage onEnter={() => { setShowHome(false); setActiveId(TOOLS[0].id) }} />
  }

  return (
    <Shell tools={TOOLS} activeId={activeId} onSelect={setActiveId}>
      {Active ? <Active /> : null}
    </Shell>
  )
}
