import { useState } from 'react'
import { ToolCard } from '../../components/ui/ToolCard'

interface Step { id: string; op: string; config?: string }

const OPS = ['Base64 Decode', 'Base64 Encode', 'URL Decode', 'URL Encode', 'Hex Decode', 'Hex Encode', 'ROT13', 'JSON Format']

export default function RecipeWorkbench() {
  const [input, setInput] = useState('')
  const [steps, setSteps] = useState<Step[]>([])
  const [outputs, setOutputs] = useState<string[]>([])
  const [recipes, setRecipes] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem('ctftoolkit:v1:recipes') || '[]') } catch { return [] }
  })

  const addStep = (op: string) => setSteps((s) => [...s, { id: crypto.randomUUID(), op }])
  const removeStep = (id: string) => setSteps((s) => s.filter((x) => x.id !== id))
  const move = (id: string, dir: -1 | 1) => setSteps((s) => {
    const i = s.findIndex((x) => x.id === id)
    if (i < 0) return s
    const j = i + dir
    if (j < 0 || j >= s.length) return s
    const c = [...s]; [c[i], c[j]] = [c[j], c[i]]; return c
  })

  const applyOp = (op: string, v: string): string => {
    switch (op) {
      case 'Base64 Decode': return atob(v)
      case 'Base64 Encode': return btoa(v)
      case 'URL Decode': return decodeURIComponent(v)
      case 'URL Encode': return encodeURIComponent(v)
      case 'Hex Decode': {
        const h = v.replace(/\s/g, '')
        const b = new Uint8Array(h.length / 2)
        for (let i = 0; i < b.length; i++) b[i] = parseInt(h.slice(i * 2, i * 2 + 2), 16)
        return new TextDecoder().decode(b)
      }
      case 'Hex Encode': return [...new TextEncoder().encode(v)].map((x) => x.toString(16).padStart(2, '0')).join(' ')
      case 'ROT13': return v.replace(/[a-zA-Z]/g, (c) => { const base = c <= 'Z' ? 65 : 97; return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base) })
      case 'JSON Format': return JSON.stringify(JSON.parse(v), null, 2)
      default: return v
    }
  }

  const run = () => {
    let cur = input
    const outs: string[] = []
    for (const st of steps) {
      try { cur = applyOp(st.op, cur); outs.push(cur) }
      catch (e) { outs.push('Error: ' + (e as Error).message); break }
    }
    setOutputs(outs)
  }

  const saveRecipe = () => {
    const r = { version: 1, steps }
    const next = [...recipes, r]
    setRecipes(next)
    localStorage.setItem('ctftoolkit:v1:recipes', JSON.stringify(next))
  }
  const exportRecipe = () => {
    const blob = new Blob([JSON.stringify({ version: 1, steps }, null, 2)], { type: 'application/json' })
    const u = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = u; a.download = 'recipe.json'; a.click()
  }
  const importRecipe = (file: File) => {
    const fr = new FileReader()
    fr.onload = () => {
      try {
        const j = JSON.parse(String(fr.result))
        setSteps(j.steps || [])
      } catch {}
    }
    fr.readAsText(file)
  }

  const finalOutput = outputs.length ? outputs[outputs.length - 1] : ''

  return (
    <ToolCard title="Recipe Workbench" description="Chain transformations using shared operations">
      <label className="muted">Input</label>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} />
      <div className="row">
        {OPS.map((op) => <button key={op} className="btn" onClick={() => addStep(op)}>+ {op}</button>)}
      </div>
      <div className="col">
        {steps.map((st) => (
          <div key={st.id} className="row" style={{ background: 'var(--panel-2)', padding: 8, borderRadius: 6 }}>
            <span style={{ flex: 1 }}>{st.op}</span>
            <button className="btn" onClick={() => move(st.id, -1)}>↑</button>
            <button className="btn" onClick={() => move(st.id, 1)}>↓</button>
            <button className="btn danger" onClick={() => removeStep(st.id)}>✕</button>
          </div>
        ))}
      </div>
      <div className="row">
        <button className="btn primary" onClick={run}>Run chain</button>
        <button className="btn" onClick={() => { setSteps([]); setOutputs([]) }}>Reset</button>
        <button className="btn" onClick={saveRecipe}>Save recipe</button>
        <button className="btn" onClick={exportRecipe}>Export JSON</button>
        <label className="btn">Import<input type="file" accept="application/json" style={{ display: 'none' }} onChange={(e) => e.target.files?.[0] && importRecipe(e.target.files[0])} /></label>
      </div>
      <label className="muted">Intermediate outputs</label>
      <textarea value={outputs.join('\n---\n')} readOnly />
      <label className="muted">Final output</label>
      <textarea value={finalOutput} readOnly />
      <button className="btn" onClick={() => navigator.clipboard.writeText(finalOutput)}>Copy final</button>
    </ToolCard>
  )
}
