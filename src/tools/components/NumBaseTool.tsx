import { useState } from 'react'
import { ToolCard } from '../../components/ui/ToolCard'

export default function NumBaseTool() {
  const [input, setInput] = useState('')
  const [from, setFrom] = useState(16)
  const [out, setOut] = useState('')
  const run = () => {
    try {
      const n = parseInt(input.trim(), from)
      if (isNaN(n)) throw new Error('Invalid number')
      setOut(`Decimal: ${n}\nHex: ${n.toString(16)}\nOctal: ${n.toString(8)}\nBinary: ${n.toString(2)}\nASCII: ${n >= 0 && n <= 0x10ffff ? String.fromCodePoint(n) : '(none)'}`)
    } catch (e) { setOut('Error: ' + (e as Error).message) }
  }
  return (
    <ToolCard title="Number Base Converter" description="Convert between binary, octal, decimal, hex and ASCII">
      <div className="row">
        <select className="input" style={{ width: 140 }} value={from} onChange={(e) => setFrom(Number(e.target.value))}>
          <option value={2}>Binary</option>
          <option value={8}>Octal</option>
          <option value={10}>Decimal</option>
          <option value={16}>Hex</option>
        </select>
      </div>
      <input className="input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="value" />
      <button className="btn primary" onClick={run}>Convert</button>
      <textarea value={out} readOnly />
    </ToolCard>
  )
}
