import React from 'react'
import { useEffect, useMemo, useState } from 'react'
import type { ToolDefinition } from '../../lib/types'
import { readJson, writeJson, STORAGE_KEYS } from '../../lib/storage'
import { readSettings, writeSettings } from '../../lib/settings'

interface Props {
  tools: ToolDefinition[]
  activeId: string | null
  onSelect: (id: string) => void
  children: React.ReactNode
}

export function Shell({ tools, activeId, onSelect, children }: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const [search, setSearch] = useState('')
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [favorites, setFavorites] = useState<string[]>(() => readJson(STORAGE_KEYS.favorites, []))
  const [recent, setRecent] = useState<string[]>(() => readJson(STORAGE_KEYS.recent, []))
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ Favorites: true, Recent: true })
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settings, setSettings] = useState(readSettings)

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
    <div className="app" style={{ gridTemplateColumns: collapsed ? '60px 1fr 220px' : '260px 1fr 220px' }}>
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
                  <div className="cat" style={{ cursor: 'pointer' }} onClick={() => setOpenSections((o) => ({ ...o, [cat]: !(o[cat] ?? true) }))}>
                    {(openSections[cat] ?? true) ? '▾' : '▸'} {cat}
                  </div>
                  {(openSections[cat] ?? true) && items.map((t) => (
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
                        <span style={{ color: '#f59e0b' }}>{favorites.includes(t.id) ? '★' : '☆'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              ))}
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
          <button className="btn" onClick={() => setSettingsOpen(true)} aria-label="Settings">⚙</button>
          <button className="btn" onClick={() => setPaletteOpen(true)}>
            ⌘K
          </button>
        </div>
        <div className="content">{children}</div>
      </div>
      <aside style={{ background: 'var(--panel)', borderLeft: '1px solid var(--border)', padding: 12, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 4, color: '#f59e0b', fontWeight: 700, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase' }}>Favorites</div>
        {favorites.length === 0 && <div className="muted">None</div>}
        {favorites.map((id) => {
          const t = tools.find((x) => x.id === id)
          if (!t) return null
          return <div key={id} className="item" onClick={() => onSelect(id)}>{t.name}</div>
        })}
        <div style={{ flex: 1, minHeight: 60 }} />
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 12 }}>
          <div style={{ marginBottom: 4, color: '#f59e0b', fontWeight: 700, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase' }}>Recent</div>
          {recent.map((id) => {
            const t = tools.find((x) => x.id === id)
            if (!t) return null
            return <div key={id} className="item" onClick={() => onSelect(id)}>{t.name}</div>
          })}
        </div>
      </aside>
      {settingsOpen && (
        <div className="cmdpalette" onClick={() => setSettingsOpen(false)}>
          <div className="box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div style={{ padding: 12, borderBottom: '1px solid var(--border)', fontWeight: 600 }}>Settings</div>
            <div style={{ padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span>Live encoding/decoding</span>
                <button onClick={() => { const ns = { ...settings, live: !settings.live }; setSettings(ns); writeSettings(ns) }} style={{ width: 42, height: 22, borderRadius: 11, border: 'none', background: settings.live ? '#f59e0b' : '#333', position: 'relative', cursor: 'pointer' }}>
                  <span style={{ position: 'absolute', top: 2, left: settings.live ? 22 : 2, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .2s' }} />
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Delimiter</span>
                <select className="input" style={{ width: 140 }} value={settings.delimiter} onChange={(e) => { const ns = { ...settings, delimiter: e.target.value }; setSettings(ns); writeSettings(ns) }}>
                  <option value="auto">Auto (newline)</option>
                  <option value="newline">Newline</option>
                  <option value="comma">Comma</option>
                  <option value="space">Space</option>
                  <option value="semicolon">Semicolon</option>
                  <option value="tab">Tab</option>
                  <option value="none">None</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

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
