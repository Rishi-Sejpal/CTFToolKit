import { useState, useMemo } from 'react'
import { ToolCard } from '../../components/ui/ToolCard'
import { rsgTemplates, generateRsg } from '../impl/reverseShell'

export default function ReverseShellTool() {
  const [ip, setIp] = useState('127.0.0.1')
  const [port, setPort] = useState(4444)
  const [cat, setCat] = useState('All')
  const [selected, setSelected] = useState(rsgTemplates()[0].id)
  const [base64, setBase64] = useState(false)
  const [urlenc, setUrlenc] = useState(false)
  const [output, setOutput] = useState('')
  const [listener, setListener] = useState('')
  const cats = ['All', ...Array.from(new Set(rsgTemplates().map((t) => t.category)))]
  const filtered = useMemo(() => rsgTemplates().filter((t) => cat === 'All' || t.category === cat), [cat])
  const tpl = rsgTemplates().find((t) => t.id === selected)!
  const run = () => {
    const r = generateRsg(tpl, ip, port, { base64, url: urlenc })
    setOutput(r.payload)
    setListener(r.listener)
  }
  const copy = (v: string) => navigator.clipboard.writeText(v)
  return (
    <ToolCard title="Reverse Shell Generator" description="Original implementation; inspired by 0dayCTF/reverse-shell-generator. Runs locally.">
      <div className="row">
        <label className="muted">IP</label>
        <input className="input" style={{ width: 200 }} value={ip} onChange={(e) => setIp(e.target.value)} />
        <label className="muted">Port</label>
        <input className="input" style={{ width: 100 }} type="number" value={port} onChange={(e) => setPort(Number(e.target.value))} />
      </div>
      <div className="row">
        <select className="input" style={{ width: 160 }} value={cat} onChange={(e) => setCat(e.target.value)}>
          {cats.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="input" value={selected} onChange={(e) => setSelected(e.target.value)}>
          {filtered.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.platform})</option>)}
        </select>
      </div>
      <div className="row">
        <label><input type="checkbox" checked={base64} onChange={(e) => setBase64(e.target.checked)} /> Base64</label>
        <label><input type="checkbox" checked={urlenc} onChange={(e) => setUrlenc(e.target.checked)} /> URL encode</label>
      </div>
      <button className="btn primary" onClick={run}>Generate</button>
      <label className="muted">Payload</label>
      <textarea value={output} readOnly />
      <div className="row">
        <button className="btn" onClick={() => copy(output)}>Copy payload</button>
        <button className="btn" onClick={() => { const b = new Blob([output]); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = 'shell.txt'; a.click() }}>Download</button>
      </div>
      <label className="muted">Listener</label>
      <textarea value={listener} readOnly />
      <button className="btn" onClick={() => copy(listener)}>Copy listener</button>
      <p className="muted">Template: {tpl.name} — {tpl.shell} on {tpl.platform}. {tpl.template}</p>
    </ToolCard>
  )
}
