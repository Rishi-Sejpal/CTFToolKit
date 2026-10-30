import { useState } from 'react'
import { ToolCard } from '../../components/ui/ToolCard'

export default function HexEditorTool() {
  const [hex, setHex] = useState('')
  const [ascii, setAscii] = useState('')
  const [name, setName] = useState('')

  const onFile = async (f: File) => {
    setName(f.name)
    const buf = await f.arrayBuffer()
    const bytes = new Uint8Array(buf)
    const lines: string[] = []
    const asciis: string[] = []
    for (let i = 0; i < bytes.length; i += 16) {
      const chunk = bytes.slice(i, i + 16)
      lines.push(Array.from(chunk).map((b) => b.toString(16).padStart(2, '0')).join(' ').padEnd(47, ' '))
      asciis.push(Array.from(chunk).map((b) => (b >= 32 && b < 127 ? String.fromCharCode(b) : '.')).join(''))
    }
    setHex(lines.join('\n'))
    setAscii(asciis.join('\n'))
  }

  return (
    <div className="hex-editor">
      <ToolCard title="Hex Editor" description="Inspect file bytes locally">
        <input type="file" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        {name && <div className="muted">{name}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div>
            <label className="muted">Hex</label>
            <textarea value={hex} readOnly style={{ minHeight: 240, fontFamily: 'monospace' }} />
          </div>
          <div>
            <label className="muted">ASCII</label>
            <textarea value={ascii} readOnly style={{ minHeight: 240, fontFamily: 'monospace' }} />
          </div>
        </div>
      </ToolCard>
    </div>
  )
}
