import { useState } from 'react'
import { ToolCard } from '../../components/ui/ToolCard'

export default function WorkspaceTool() {
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('ctftoolkit:v1:workspaces') || '[]') } catch { return [] }
  })
  const save = () => {
    const next = [...saved, JSON.stringify({ title, notes, ts: Date.now() })]
    setSaved(next)
    localStorage.setItem('ctftoolkit:v1:workspaces', JSON.stringify(next))
    setTitle(''); setNotes('')
  }
  const exportAll = () => {
    const blob = new Blob([JSON.stringify(saved, null, 2)], { type: 'application/json' })
    const u = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = u; a.download = 'workspaces.json'; a.click()
  }
  return (
    <ToolCard title="Challenge Workspace" description="Save notes and findings locally">
      <label className="muted">Title</label>
      <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
      <label className="muted">Notes</label>
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      <div className="row">
        <button className="btn primary" onClick={save}>Save</button>
        <button className="btn" onClick={exportAll}>Export</button>
      </div>
      <label className="muted">Saved ({saved.length})</label>
      <textarea value={saved.join('\n')} readOnly />
    </ToolCard>
  )
}
