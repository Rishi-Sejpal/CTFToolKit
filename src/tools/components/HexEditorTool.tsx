import { useRef, useState } from 'react'
import { ToolCard } from '../../components/ui/ToolCard'

const MAX = 2 * 1024 * 1024

export default function HexEditorTool() {
  const [file, setFile] = useState<{ name: string; size: number; type: string } | null>(null)
  const [bytes, setBytes] = useState<Uint8Array | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [view, setView] = useState<'both' | 'hex' | 'ascii'>('both')
  const [offsetInput, setOffsetInput] = useState('')
  const [selected, setSelected] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const loadFile = async (f: File) => {
    setError('')
    setLoading(true)
    try {
      const buf = await f.arrayBuffer()
      const data = new Uint8Array(buf)
      if (data.length > MAX) {
        setBytes(data.slice(0, MAX))
        setError(`File larger than 2MB; showing first ${MAX} bytes.`)
      } else {
        setBytes(data)
      }
      setFile({ name: f.name, size: f.size, type: f.type || 'unknown' })
      setSelected(null)
    } catch (e) {
      setError('Could not read file: ' + (e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if (f) loadFile(f)
  }

  const clear = () => { setFile(null); setBytes(null); setError(''); setSelected(null) }

  const gotoOffset = () => {
    if (!bytes) return
    let off = 0
    const v = offsetInput.trim().toLowerCase()
    if (v.startsWith('0x')) off = parseInt(v, 16)
    else off = parseInt(v, 10)
    if (isNaN(off) || off < 0 || off >= bytes.length) { setError('Invalid offset'); return }
    setError('')
    const row = Math.floor(off / 16) * 16
    const el = containerRef.current?.querySelector(`[data-row="${row}"]`) as HTMLElement | null
    el?.scrollIntoView({ block: 'center' })
    setSelected(off)
  }

  const hexDump = bytes ? Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join(' ') : ''
  const copyHex = () => { if (hexDump) navigator.clipboard.writeText(hexDump) }
  const exportDump = () => {
    if (!bytes) return
    const lines: string[] = []
    for (let i = 0; i < bytes.length; i += 16) {
      const chunk = bytes.slice(i, i + 16)
      const off = i.toString(16).padStart(8, '0')
      const hex = [...chunk].map((b) => b.toString(16).padStart(2, '0')).join(' ').padEnd(47, ' ')
      const asc = [...chunk].map((b) => (b >= 32 && b < 127 ? String.fromCharCode(b) : '.')).join('')
      lines.push(`${off}  ${hex}  ${asc}`)
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const u = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = u; a.download = (file?.name || 'dump') + '.hex.txt'; a.click(); URL.revokeObjectURL(u)
  }

  const rows = bytes ? Math.ceil(bytes.length / 16) : 0

  return (
    <div>
      <ToolCard title="Hex Editor" description="View and understand the bytes inside a file.">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          style={{ border: `2px dashed ${dragOver ? '#f59e0b' : 'rgba(245,158,11,.35)'}`, borderRadius: 12, padding: 24, textAlign: 'center', background: dragOver ? 'rgba(245,158,11,.08)' : '#111111', marginBottom: 12 }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Drop a file here or Browse files</div>
          <div className="muted" style={{ marginBottom: 10 }}>Files are read locally in your browser.</div>
          <label className="btn primary" style={{ cursor: 'pointer' }}>
            Browse files
            <input type="file" style={{ display: 'none' }} onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])} />
          </label>
        </div>

        {file && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(245,158,11,.2)', background: '#111111', marginBottom: 12 }}>
            <span style={{ color: '#f59e0b' }}>📄</span>
            <strong>{file.name}</strong>
            <span className="muted">{file.size} bytes · {file.type}</span>
            <button className="btn" onClick={clear}>Remove</button>
          </div>
        )}

        {loading && <div className="muted">Loading…</div>}
        {error && <div style={{ color: '#f87171', fontSize: 13, marginBottom: 8 }}>{error}</div>}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8, alignItems: 'center' }}>
          <input className="input" style={{ width: 200, padding: '6px 10px' }} placeholder="Offset (0x.. or decimal)" value={offsetInput} onChange={(e) => setOffsetInput(e.target.value)} />
          <button className="btn" onClick={gotoOffset} disabled={!bytes}>Go</button>
          <button className="btn" onClick={copyHex} disabled={!bytes}>Copy Hex</button>
          <button className="btn" onClick={exportDump} disabled={!bytes}>Export</button>
        </div>
        <div style={{ marginBottom: 12 }}>
          <select className="input" style={{ width: 160 }} value={view} onChange={(e) => setView(e.target.value as any)}>
            <option value="both">Hex + ASCII</option>
            <option value="hex">Hex only</option>
            <option value="ascii">ASCII only</option>
          </select>
        </div>

        {bytes ? (
          <div ref={containerRef} style={{ border: '1px solid rgba(245,158,11,.2)', borderRadius: 8, overflow: 'auto', maxHeight: 420, background: '#0a0a0a', fontFamily: 'monospace', fontSize: 13 }}>
            {Array.from({ length: rows }).map((_, r) => {
              const i = r * 16
              const chunk = bytes.slice(i, i + 16)
              return (
                <div key={i} data-row={i} style={{ display: 'flex', gap: 8, padding: '2px 8px', borderBottom: '1px solid rgba(255,255,255,.03)' }}>
                  <span style={{ color: '#f59e0b', minWidth: 70 }}>{i.toString(16).padStart(8, '0')}</span>
                  {(view === 'both' || view === 'hex') && (
                    <span style={{ flex: 1, letterSpacing: 1 }}>
                      {Array.from(chunk).map((b, j) => {
                        const idx = i + j
                        const isSel = selected === idx
                        return (
                          <span key={j} onClick={() => setSelected(idx)} style={{ cursor: 'pointer', padding: '0 2px', background: isSel ? 'rgba(245,158,11,.35)' : 'transparent', color: isSel ? '#0a0a0a' : '#e5e5e5' }}>
                            {b.toString(16).padStart(2, '0')}{' '}
                          </span>
                        )
                      })}
                    </span>
                  )}
                  {(view === 'both' || view === 'ascii') && (
                    <span style={{ minWidth: 180, color: '#a3a3a3' }}>
                      {Array.from(chunk).map((b, j) => {
                        const idx = i + j
                        const isSel = selected === idx
                        const ch = b >= 32 && b < 127 ? String.fromCharCode(b) : '.'
                        return (
                          <span key={j} onClick={() => setSelected(idx)} style={{ cursor: 'pointer', background: isSel ? 'rgba(245,158,11,.35)' : 'transparent', color: isSel ? '#0a0a0a' : '#a3a3a3' }}>
                            {ch}
                          </span>
                        )
                      })}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: view === 'both' ? '1fr 1fr' : '1fr', gap: 12 }}>
            <div style={{ border: '1px dashed rgba(245,158,11,.25)', borderRadius: 8, padding: 24, textAlign: 'center', color: '#737373', minHeight: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Upload a file to see its hexadecimal representation here.
            </div>
            {view === 'both' && (
              <div style={{ border: '1px dashed rgba(245,158,11,.25)', borderRadius: 8, padding: 24, textAlign: 'center', color: '#737373', minHeight: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Upload a file to see its ASCII representation here.
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(245,158,11,.18)', background: '#111111', fontSize: 13, color: '#a3a3a3' }}>
          Tip: Each pair of hexadecimal characters represents one byte. Click a byte to highlight its ASCII counterpart.
        </div>
      </ToolCard>
    </div>
  )
}
