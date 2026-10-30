import { useState } from 'react'
import { ToolCard } from '../../components/ui/ToolCard'
import * as Crypto from '../impl/crypto'

const WORDS = ['password','123456','admin','letmein','qwerty','welcome','monkey','dragon','master','hello','secret','password1','abc123','iloveyou','trustno1','123456789','sunshine','princess','football','charlie']

export default function RainbowTableTool() {
  const [hash, setHash] = useState('')
  const [algo, setAlgo] = useState('sha256')
  const [table, setTable] = useState<Record<string,string> | null>(null)
  const [out, setOut] = useState('')
  const build = async () => {
    const t: Record<string,string> = {}
    for (const w of WORDS) {
      const h = algo === 'md5' ? w : await Crypto.hashText(algo === 'sha1' ? 'SHA-1' : 'SHA-256', w)
      t[h] = w
    }
    setTable(t)
    setOut('Table built with ' + WORDS.length + ' entries.')
  }
  const lookup = () => {
    if (!table) { setOut('Build table first.'); return }
    const h = hash.trim().toLowerCase()
    setOut(table[h] ? `Found: ${table[h]}` : 'Not found.')
  }
  return (
    <ToolCard title="Rainbow Table Search" description="Build and search a small rainbow table locally">
      <div className="row">
        <select className="input" style={{ width: 140 }} value={algo} onChange={(e) => setAlgo(e.target.value)}>
          <option value="sha1">SHA-1</option>
          <option value="sha256">SHA-256</option>
        </select>
        <button className="btn" onClick={build}>Build table</button>
      </div>
      <input className="input" value={hash} onChange={(e) => setHash(e.target.value)} placeholder="hash" />
      <button className="btn primary" onClick={lookup}>Lookup</button>
      <textarea value={out} readOnly />
    </ToolCard>
  )
}
