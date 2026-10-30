import { useState } from 'react'
import { ToolCard } from '../../components/ui/ToolCard'

export default function ZeroWidthTool() {
  const [input, setInput] = useState('')
  const [out, setOut] = useState('')
  const run = () => {
    const chars = [...input]
    const hidden = chars.filter((c) => c.charCodeAt(0) === 0x200b || c.charCodeAt(0) === 0x200c || c.charCodeAt(0) === 0x200d || c.charCodeAt(0) === 0xfeff)
    const zwsp = (input.match(/\u200b/g) || []).length
    const zwnj = (input.match(/\u200c/g) || []).length
    const zwj = (input.match(/\u200d/g) || []).length
    const bom = (input.match(/\ufeff/g) || []).length
    setOut(`Zero-width spaces: ${zwsp}\nZWNJ: ${zwnj}\nZWJ: ${zwj}\nBOM: ${bom}\nTotal hidden chars: ${hidden.length}\n\nVisible text:\n${input.replace(/[\u200b\u200c\u200d\ufeff]/g, '')}`)
  }
  return (
    <ToolCard title="Zero-Width Character Detector" description="Detect hidden Unicode characters in text">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} />
      <button className="btn primary" onClick={run}>Analyse</button>
      <textarea value={out} readOnly />
    </ToolCard>
  )
}
