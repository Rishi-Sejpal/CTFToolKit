import React from "react"
import { useEffect, useMemo, useState } from 'react'
import type { ToolDefinition } from '../../lib/types'
import { readJson, writeJson, STORAGE_KEYS } from '../../lib/storage'

interface Props {
  tools: ToolDefinition[]
  activeId: string | null
  onSelect: (id: string) => void
  children: React.ReactNode
  offlineReady: boolean
}

export function Shell({ tools, activeId, onSelect, children, offlineReady }: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const [search, setSearch] = useState('')
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [favorites, setFavorites] = useState<string[]>(() => readJson(STORAGE_KEYS.favorites, []))
  const [recent, setRecent] = useState<string[]>(() => readJson(STORAGE_KEYS.recent, []))

  useEffect(() => writeJson(STORAGE_KEYS.favorites, favorites), [favorites])
  useEffect(() => writeJson(STORAGE_KEYS.recent, recent), [recent])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const typing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
      } else if (e.key === '/' && !typing) {
        e.preventDefault()
        const el = document.getElementById('global-search') as HTMLInputElement | null
        el?.focus()
      } else if (e.key === 'Escape') {
        setPaletteOpen(false)
        setMobileOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return tools
    return tools.filter((t) =>
      (t.name + ' ' + t.description + ' ' + t.keywords.join(' ') + ' ' + t.category).toLowerCase().includes(q),
    )
  }, [tools, search])

  const grouped = useMemo(() => {
    const map = new Map<string, ToolDefinition[]>()
    for (const t of filtered) {
      if (!map.has(t.category)) map.set(t.category, [])
      map.get(t.category)!.push(t)
    }
    return [...map.entries()]
  }, [filtered])

  const toggleFav = (id: string) => {
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))
  }

  const recordRecent = (id: string) => {
    setRecent((r) => [id, ...r.filter((x) => x !== id)].slice(0, 10))
  }

  useEffect(() => {
    if (activeId) recordRecent(activeId)
  }, [activeId])

  const activeTool = tools.find((t) => t.id === activeId)

  return (
    <div className="app" style={{ gridTemplateColumns: collapsed ? "60px 1fr" : "260px 1fr" }}>
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'open' : ''}`}>
        <div className="topbar" style={{ border: 'none' }}>
          <button className="btn" onClick={() => setCollapsed((c) => !c)} aria-label="Toggle sidebar">
            ☰
          </button>
          {!collapsed && <strong>CTFToolKit</strong>}
        </div>
        {!collapsed && (
          <>
            <div style={{ padding: '8px 12px' }}>
              <input
                id="global-search"
                className="input"
                placeholder="Search tools…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div style={{ overflow: 'auto', flex: 1 }}>
              {grouped.map(([cat, items]) => (
                <div key={cat}>
                  <div className="cat">{cat}</div>
                  {items.map((t) => (
                    <div
                      key={t.id}
                      className={`item ${activeId === t.id ? 'active' : ''}`}
                      onClick={() => {
                        onSelect(t.id)
                        setMobileOpen(false)
                      }}
                    >
                      <span style={{ flex: 1 }}>{t.name}</span>
                      <button
                        className="btn"
                        style={{ padding: '0 4px', fontSize: 12 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFav(t.id)
                        }}
                        aria-label="Favorite"
                      >
                        {favorites.includes(t.id) ? '★' : '☆'}
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--border)', padding: 8 }}>
              <div className="muted" style={{ marginBottom: 4 }}>Favorites</div>
              {favorites.length === 0 && <div className="muted">None</div>}
              {favorites.map((id) => {
                const t = tools.find((x) => x.id === id)
                if (!t) return null
                return (
                  <div key={id} className="item" onClick={() => onSelect(id)}>
                    {t.name}
                  </div>
                )
              })}
              <div className="muted" style={{ marginTop: 8, marginBottom: 4 }}>Recent</div>
              {recent.map((id) => {
                const t = tools.find((x) => x.id === id)
                if (!t) return null
                return (
                  <div key={id} className="item" onClick={() => onSelect(id)}>
                    {t.name}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </aside>
      <div className="main">
        <div className="topbar">
          <button className="btn" onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
            ☰
          </button>
          <div style={{ flex: 1, fontWeight: 600 }}>{activeTool?.name ?? 'CTFToolKit'}</div>
          <span className={`offline-badge ${offlineReady ? 'ready' : 'not'}`}>
            {offlineReady ? 'Offline ready' : 'Online'}
          </span>
          <button className="btn" onClick={() => setPaletteOpen(true)}>
            ⌘K
          </button>
        </div>
        <div className="content">{children}</div>
      </div>
      {paletteOpen && (
        <CommandPalette
          tools={tools}
          onClose={() => setPaletteOpen(false)}
          onSelect={(id) => {
            onSelect(id)
            setPaletteOpen(false)
          }}
        />
      )}
    </div>
  )
}

function CommandPalette({
  tools,
  onClose,
  onSelect,
}: {
  tools: ToolDefinition[]
  onClose: () => void
  onSelect: (id: string) => void
}) {
  const [q, setQ] = useState('')
  const [idx, setIdx] = useState(0)
  const results = useMemo(() => {
    const query = q.toLowerCase().trim()
    const list = query ? tools.filter((t) => (t.name + t.description + t.keywords.join(' ')).toLowerCase().includes(query)) : tools
    return list.slice(0, 50)
  }, [q, tools])
  useEffect(() => setIdx(0), [q])
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIdx((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      if (results[idx]) onSelect(results[idx].id)
    }
  }
  return (
    <div className="cmdpalette" onClick={onClose}>
      <div className="box" onClick={(e) => e.stopPropagation()}>
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} placeholder="Search tools…" />
        <ul>
          {results.map((t, i) => (
            <li key={t.id} className={i === idx ? 'active' : ''} onClick={() => onSelect(t.id)}>
              <span>{t.name}</span>
              <span className="muted">{t.category}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
