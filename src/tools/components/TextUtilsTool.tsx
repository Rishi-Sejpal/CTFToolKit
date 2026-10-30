import { useState } from 'react'
import { ToolCard } from '../../components/ui/ToolCard'

export default function TextUtilsTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const stats = () => {
    const bytes = new TextEncoder().encode(input).length
    const chars = input.length
    const words = input.trim() ? input.trim().split(/\s+/).length : 0
    const lines = input ? input.split('\n').length : 0
    setOutput(`Bytes: ${bytes}\nChars: ${chars}\nWords: ${words}\nLines: ${lines}`)
  }
  const ops: [string, () => void][] = [
    ['Uppercase', () => setOutput(input.toUpperCase())],
    ['Lowercase', () => setOutput(input.toLowerCase())],
    ['Reverse', () => setOutput([...input].reverse().join(''))],
    ['Trim', () => setOutput(input.trim())],
    ['Sort lines', () => setOutput(input.split('\n').sort().join('\n'))],
    ['Dedup lines', () => setOutput(Array.from(new Set(input.split('\n'))).join('\n'))],
    ['Remove empty lines', () => setOutput(input.split('\n').filter((l) => l.trim() !== '').join('\n'))],
  ]
  return (
    <ToolCard title="Text Utils" description="Text statistics and transformations">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} />
      <div className="row">
        <button className="btn primary" onClick={stats}>Count</button>
        {ops.map(([name, fn]) => <button key={name} className="btn" onClick={fn}>{name}</button>)}
      </div>
      <textarea value={output} readOnly />
      <button className="btn" onClick={() => navigator.clipboard.writeText(output)}>Copy</button>
    </ToolCard>
  )
}
