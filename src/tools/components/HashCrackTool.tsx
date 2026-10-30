import { useState } from 'react'
import { ToolCard } from '../../components/ui/ToolCard'
import * as Crypto from '../impl/crypto'

const WORDS = ['password','123456','admin','letmein','qwerty','welcome','monkey','dragon','master','hello','secret','password1','abc123','iloveyou','trustno1','123456789','12345678','12345','1234','111111','sunshine','princess','football','charlie','aa123456','donald','password123','qwerty123']

function md5(s: string): string {
  // minimal MD5 (RFC 1321) - basic implementation
  function rotl(x: number, c: number) { return (x << c) | (x >>> (32 - c)) }
  const msg = new TextEncoder().encode(s)
  // padding
  const bitLen = msg.length * 8
  const padLen = (56 - (msg.length % 64) + 64) % 64
  const total = msg.length + padLen + 8
  const buf = new Uint8Array(total)
  buf.set(msg)
  buf[msg.length] = 0x80
  const view = new DataView(buf.buffer)
  view.setUint32(total - 8, bitLen >>> 0, true)
  view.setUint32(total - 4, Math.floor(bitLen / 0x100000000), true)
  let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476
  const K = []
  for (let i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000)
  const sh = [7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21]
  for (let off = 0; off < total; off += 64) {
    const M = new Uint32Array(16)
    for (let i = 0; i < 16; i++) M[i] = view.getUint32(off + i * 4, true)
    let A = a, B = b, C = c, D = d
    for (let i = 0; i < 64; i++) {
      let f: number, g: number
      if (i < 16) { f = (B & C) | (~B & D); g = i }
      else if (i < 32) { f = (D & B) | (~D & C); g = (5 * i + 1) % 16 }
      else if (i < 48) { f = B ^ C ^ D; g = (3 * i + 5) % 16 }
      else { f = C ^ (B | ~D); g = (7 * i) % 16 }
      const tmp = D
      D = C
      C = B
      B = (B + rotl((A + f + K[i] + M[g]) >>> 0, sh[i])) >>> 0
      A = tmp
    }
    a = (a + A) >>> 0; b = (b + B) >>> 0; c = (c + C) >>> 0; d = (d + D) >>> 0
  }
  const le = (x: number) => [x & 0xff, (x >> 8) & 0xff, (x >> 16) & 0xff, (x >> 24) & 0xff].map((b) => b.toString(16).padStart(2, '0')).join('')
  return le(a) + le(b) + le(c) + le(d)
}

export default function HashCrackTool() {
  const [hash, setHash] = useState('')
  const [algo, setAlgo] = useState('md5')
  const [out, setOut] = useState('')
  const [busy, setBusy] = useState(false)
  const run = async () => {
    setBusy(true); setOut('Cracking…')
    const target = hash.trim().toLowerCase()
    let found = ''
    for (const w of WORDS) {
      let h = ''
      if (algo === 'md5') h = md5(w)
      else if (algo === 'sha1') h = await Crypto.hashText('SHA-1', w)
      else if (algo === 'sha256') h = await Crypto.hashText('SHA-256', w)
      if (h === target) { found = w; break }
    }
    setOut(found ? `Found: ${found}` : 'Not found in built-in wordlist.')
    setBusy(false)
  }
  return (
    <ToolCard title="Hash Crack Station" description="Dictionary attack against common hashes (local wordlist)">
      <div className="row">
        <select className="input" style={{ width: 140 }} value={algo} onChange={(e) => setAlgo(e.target.value)}>
          <option value="md5">MD5</option>
          <option value="sha1">SHA-1</option>
          <option value="sha256">SHA-256</option>
        </select>
      </div>
      <input className="input" value={hash} onChange={(e) => setHash(e.target.value)} placeholder="hash" />
      <button className="btn primary" onClick={run} disabled={busy}>{busy ? 'Working…' : 'Crack'}</button>
      <textarea value={out} readOnly />
    </ToolCard>
  )
}
