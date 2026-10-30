import { useState } from 'react'
import { ToolCard } from '../../components/ui/ToolCard'

export default function ApiTesterTool() {
  const [method, setMethod] = useState('GET')
  const [url, setUrl] = useState('')
  const [headers, setHeaders] = useState('')
  const [body, setBody] = useState('')
  const [out, setOut] = useState('')
  const run = async () => {
    try {
      const h: Record<string,string> = {}
      headers.split('\n').forEach((l) => { const [k,v] = l.split(':'); if (k && v) h[k.trim()] = v.trim() })
      const res = await fetch(url, { method, headers: h, body: method !== 'GET' ? body : undefined })
      const text = await res.text()
      setOut(`Status: ${res.status} ${res.statusText}\n\n${text}`)
    } catch (e) { setOut('Error: ' + (e as Error).message) }
  }
  return (
    <ToolCard title="API Tester" description="Simple HTTP client (CORS permitting)">
      <div className="row">
        <select className="input" style={{ width: 100 }} value={method} onChange={(e) => setMethod(e.target.value)}>
          {['GET','POST','PUT','DELETE','PATCH'].map((m) => <option key={m}>{m}</option>)}
        </select>
        <input className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
      </div>
      <label className="muted">Headers (one per line: Key: Value)</label>
      <textarea value={headers} onChange={(e) => setHeaders(e.target.value)} style={{ minHeight: 60 }} />
      <label className="muted">Body</label>
      <textarea value={body} onChange={(e) => setBody(e.target.value)} style={{ minHeight: 60 }} />
      <button className="btn primary" onClick={run}>Send</button>
      <textarea value={out} readOnly style={{ minHeight: 160 }} />
    </ToolCard>
  )
}
