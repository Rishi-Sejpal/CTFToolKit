import { useState } from 'react'
import { ToolCard } from '../../components/ui/ToolCard'

export default function UrlParserTool() {
  const [input, setInput] = useState('')
  const [out, setOut] = useState('')
  const run = () => {
    try {
      const u = new URL(input)
      const params = [...u.searchParams.entries()].map(([k,v]) => `${k} = ${v}`).join('\n')
      setOut(`Protocol: ${u.protocol}\nHost: ${u.host}\nHostname: ${u.hostname}\nPort: ${u.port}\nPath: ${u.pathname}\nQuery: ${u.search}\nHash: ${u.hash}\n\nParameters:\n${params}`)
    } catch (e) { setOut('Error: '+(e as Error).message) }
  }
  return <ToolCard title="URL Parser" description="Parse URL components"><input className="input" value={input} onChange={(e)=>setInput(e.target.value)} /><button className="btn primary" onClick={run}>Parse</button><textarea value={out} readOnly /></ToolCard>
}
