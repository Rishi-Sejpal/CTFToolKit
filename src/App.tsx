import { useState, useEffect } from "react"
import { Shell } from './components/layout/Shell'
import { TOOLS } from './tools/registry'

export default function App() {
  const [activeId, setActiveId] = useState<string | null>(TOOLS[0].id)
  const [offlineReady, setOfflineReady] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => setOfflineReady(true)).catch(() => {})
    }
  }, [])

  const Active = TOOLS.find((t) => t.id === activeId)?.component

  return (
    <Shell tools={TOOLS} activeId={activeId} onSelect={setActiveId} offlineReady={offlineReady}>
      {Active ? <Active /> : null}
    </Shell>
  )
}
