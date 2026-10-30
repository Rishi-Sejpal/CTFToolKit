import { useState } from 'react'
import { ToolCard, IO } from '../../components/ui/ToolCard'
import * as Crypto from '../impl/crypto'
import * as Jwt from '../impl/jwt'

export function HashTool() {
  const [input, setInput] = useState('')
  const [alg, setAlg] = useState('SHA-256')
  const [output, setOutput] = useState('')
  const run = async () => {
    const map: Record<string, string> = { 'SHA-1': 'SHA-1', 'SHA-256': 'SHA-256', 'SHA-384': 'SHA-384', 'SHA-512': 'SHA-512' }
    setOutput(await Crypto.hashText(map[alg], input))
  }
  return (
    <ToolCard title="Hash" description="Compute cryptographic hashes">
      <div className="row">
        <select className="input" style={{ width: 160 }} value={alg} onChange={(e) => setAlg(e.target.value)}>
          {['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'].map((a) => <option key={a}>{a}</option>)}
        </select>
      </div>
      <IO input={input} setInput={setInput} output={output} onRun={run} onCopy={() => navigator.clipboard.writeText(output)} onReset={() => { setInput(''); setOutput('') }} />
    </ToolCard>
  )
}

export function HmacTool() {
  const [input, setInput] = useState('')
  const [secret, setSecret] = useState('')
  const [alg, setAlg] = useState('SHA-256')
  const [output, setOutput] = useState('')
  const run = async () => {
    const map: Record<string, string> = { 'SHA-256': 'SHA-256', 'SHA-384': 'SHA-384', 'SHA-512': 'SHA-512' }
    setOutput(await Crypto.hmacText(map[alg], secret, input))
  }
  return (
    <ToolCard title="HMAC" description="Generate HMAC">
      <div className="row">
        <select className="input" style={{ width: 160 }} value={alg} onChange={(e) => setAlg(e.target.value)}>
          {['SHA-256', 'SHA-384', 'SHA-512'].map((a) => <option key={a}>{a}</option>)}
        </select>
      </div>
      <label className="muted">Secret (kept in memory)</label>
      <input className="input" type="password" value={secret} onChange={(e) => setSecret(e.target.value)} />
      <IO input={input} setInput={setInput} output={output} onRun={run} onCopy={() => navigator.clipboard.writeText(output)} onReset={() => { setInput(''); setOutput(''); setSecret('') }} />
    </ToolCard>
  )
}

export function HashIdTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const run = () => {
    const r = Crypto.hashIdentifier(input)
    setOutput(r.map((x) => `${x.name} (${Math.round(x.score * 100)}%): ${x.reason}`).join('\n'))
  }
  return <ToolCard title="Hash Identifier" description="Ranked candidates"><IO input={input} setInput={setInput} output={output} onRun={run} onCopy={() => navigator.clipboard.writeText(output)} onReset={() => { setInput(''); setOutput('') }} /></ToolCard>
}

export function FileHashTool() {
  const [file, setFile] = useState<File | null>(null)
  const [alg, setAlg] = useState('SHA-256')
  const [output, setOutput] = useState('')
  const run = async () => {
    if (!file) { setOutput('Select a file'); return }
    setOutput(await Crypto.fileHash(alg, file))
  }
  return (
    <ToolCard title="File Hash" description="Hash a file locally">
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <select className="input" style={{ width: 160 }} value={alg} onChange={(e) => setAlg(e.target.value)}>
        {['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'].map((a) => <option key={a}>{a}</option>)}
      </select>
      <button className="btn primary" onClick={run}>Hash</button>
      <textarea value={output} readOnly />
    </ToolCard>
  )
}

export function JwtTool() {
  const [mode, setMode] = useState<'decode' | 'sign' | 'verify'>('decode')
  const [token, setToken] = useState('')
  const [payload, setPayload] = useState('{}')
  const [secret, setSecret] = useState('')
  const [alg, setAlg] = useState('HS256')
  const [output, setOutput] = useState('')
  const run = async () => {
    try {
      if (mode === 'decode') {
        const p = Jwt.decodeJwt(token)
        setOutput(JSON.stringify(p, null, 2))
      } else if (mode === 'sign') {
        const t = await Jwt.signJwt(alg, JSON.parse(payload), secret, '1h')
        setOutput(t)
      } else {
        const r = await Jwt.verifyJwt(token, alg, secret)
        setOutput(JSON.stringify(r, null, 2))
      }
    } catch (e) { setOutput('Error: ' + (e as Error).message) }
  }
  return (
    <ToolCard title="JWT" description="Inspect, sign and verify JWTs (states shown separately)">
      <div className="row">
        <button className={`btn ${mode === 'decode' ? 'primary' : ''}`} onClick={() => setMode('decode')}>Decode</button>
        <button className={`btn ${mode === 'sign' ? 'primary' : ''}`} onClick={() => setMode('sign')}>Sign</button>
        <button className={`btn ${mode === 'verify' ? 'primary' : ''}`} onClick={() => setMode('verify')}>Verify</button>
      </div>
      <select className="input" style={{ width: 160 }} value={alg} onChange={(e) => setAlg(e.target.value)}>
        {['HS256', 'HS384', 'HS512'].map((a) => <option key={a}>{a}</option>)}
      </select>
      {mode === 'decode' && <textarea value={token} onChange={(e) => setToken(e.target.value)} placeholder="token" />}
      {mode === 'sign' && <textarea value={payload} onChange={(e) => setPayload(e.target.value)} placeholder="payload JSON" />}
      {mode === 'verify' && <textarea value={token} onChange={(e) => setToken(e.target.value)} placeholder="token" />}
      <label className="muted">Secret / public key (memory only)</label>
      <input className="input" type="password" value={secret} onChange={(e) => setSecret(e.target.value)} />
      <button className="btn primary" onClick={run}>Run</button>
      <label className="muted">Output</label>
      <textarea value={output} readOnly />
    </ToolCard>
  )
}
