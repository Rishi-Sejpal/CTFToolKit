import { useState, useEffect } from 'react'
import { Shell } from './components/layout/Shell'
import { TOOLS } from './tools/registry'
import HomePage from './tools/components/HomePage'

function readActive() {
  try { return localStorage.getItem('ctftoolkit:active') || 'home' } catch { return 'home' }
}

export default function App() {
  const [route, setRoute] = useState(readActive())

  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.replace(/^#\/?/, '') || 'home'
      setRoute(hash)
    }
    window.addEventListener('hashchange', sync)
    if (!window.location.hash) window.location.hash = '#/home'
    else sync()
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  useEffect(() => {
    try { localStorage.setItem('ctftoolkit:active', route) } catch {}
  }, [route])

  const navigate = (id: string) => {
    window.location.hash = '#/' + id
  }

  const showHome = route === 'home' || route === ''
  const activeId = showHome ? null : route
  const Active = TOOLS.find((t) => t.id === activeId)?.component

  useEffect(() => {
    const h = (e: Event) => navigate((e as CustomEvent).detail)
    window.addEventListener('ctftoolkit:nav', h)
    return () => window.removeEventListener('ctftoolkit:nav', h)
  }, [])

  if (showHome) {
    return <HomePage onEnter={() => navigate(TOOLS[0].id)} />
  }

  return (
    <Shell tools={TOOLS} activeId={activeId} onSelect={navigate}>
      {Active ? <Active /> : <div>Select a tool</div>}
    </Shell>
  )
}
