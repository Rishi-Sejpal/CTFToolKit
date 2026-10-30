import { useState } from 'react'
import { ToolCard } from '../../components/ui/ToolCard'
import { TOOL_CATALOG } from '../catalog'

export default function CatalogTool() {
  const [q, setQ] = useState('')
  const [os, setOs] = useState('all')
  const filtered = TOOL_CATALOG.filter((t) => {
    if (os !== 'all' && !t.os.includes(os)) return false
    const hay = (t.name + t.description + t.category).toLowerCase()
    return !q || hay.includes(q.toLowerCase())
  })
  return (
    <ToolCard title="Native Tool Catalog" description="Kali Linux tools and package mappings">
      <div className="card" style={{ background: 'var(--panel-2)', marginBottom: 8 }}>
        <div className="muted" style={{ marginBottom: 4 }}>One-line installer (copy)</div>
        <div className="row">
          <code style={{ flex: 1, fontFamily: 'monospace', fontSize: 12, wordBreak: 'break-all' }}>curl -fsSL https://raw.githubusercontent.com/Rishi-Sejpal/CTFToolKit/main/install.sh | bash -s -- --profile full</code>
          <button className="btn" onClick={() => navigator.clipboard.writeText('curl -fsSL https://raw.githubusercontent.com/Rishi-Sejpal/CTFToolKit/main/install.sh | bash -s -- --profile full')}>Copy</button>
        </div>
      </div>
      <div className="row">
        <input className="input" placeholder="Search catalog…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input" style={{ width: 140 }} value={os} onChange={(e) => setOs(e.target.value)}>
          <option value="all">All OS</option>
          <option value="linux">Linux</option>
        </select>
      </div>
      <div style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead><tr><th align="left">Name</th><th align="left">Category</th><th align="left">Packages</th><th align="left">Link</th></tr></thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.name} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: 6 }}>{t.name}<div className="muted">{t.description}</div></td>
                <td style={{ padding: 6 }}>{t.category}</td>
                <td style={{ padding: 6, fontFamily: 'monospace', fontSize: 11 }}>{Object.entries(t.packages).map(([k, v]) => `${k}:${v}`).join(', ')}</td>
                <td style={{ padding: 6 }}><a href={t.link} target="_blank" rel="noreferrer">site</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ToolCard>
  )
}
