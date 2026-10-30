import { useState } from 'react'
import { ToolCard } from '../../components/ui/ToolCard'

export default function StringsTool() {
  const [minLen, setMinLen] = useState(4)
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const run = () => {
    const re = new RegExp(`[\\x20-\\x7e]{${minLen},}`, 'g')
    const m = input.match(re) || []
    setOutput(m.join('\n'))
  }
  const onFile = async (f: File) => {
    const buf = await f.arrayBuffer()
    const text = new TextDecoder('latin1').decode(buf)
    setInput(text)
  }
  return (
    <ToolCard title="Strings Extractor" description="Extract printable strings from text or files">
      <input type="file" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      <div className="row">
        <label className="muted">Min length</label>
        <input className="input" style={{ width: 80 }} type="number" value={minLen} onChange={(e) => setMinLen(Number(e.target.value))} />
      </div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste text/binary as latin1…" />
      <button className="btn primary" onClick={run}>Extract</button>
      <textarea value={output} readOnly />
      <button className="btn" onClick={() => navigator.clipboard.writeText(output)}>Copy</button>
    </ToolCard>
  )
}
