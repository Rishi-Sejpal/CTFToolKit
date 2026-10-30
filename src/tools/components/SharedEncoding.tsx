import { useState, useEffect } from "react"
import { IO, ToolCard } from '../../components/ui/ToolCard'
import * as E from '../impl/encoding'
import * as C from '../impl/compression'
import { readSettings } from '../../lib/settings'

type Mode = 'b64e' | 'b64d' | 'b32e' | 'b32d' | 'hexe' | 'hexd' | 'bine' | 'bind' | 'urle' | 'urld' | 'htmle' | 'htmld' | 'rot' | 'caesar' | 'xor' | 'xord' | 'json' | 'jsonmin' | 'uni' | 'ascii' | 'ts2date' | 'date2ts' | 'regex' | 'diff' | 'comp' | 'decomp'

export function SharedEncoding({ mode, title, desc }: { mode: Mode; title: string; desc: string }) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [settings, setSettings] = useState(() => readSettings())
  const [key, setKey] = useState('key')
  const [shift, setShift] = useState(3)
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [other, setOther] = useState('')
  const copy = async () => { try { await navigator.clipboard.writeText(output) } catch {} }
  useEffect(() => {
    const h = (e: Event) => setSettings((e as CustomEvent).detail)
    window.addEventListener('ctftoolkit:settings', h)
    return () => window.removeEventListener('ctftoolkit:settings', h)
  }, [])
  useEffect(() => { if (settings.live) run() }, [input, settings.live, settings.delimiter, key, shift, pattern, flags, other])

  const transformOne = async (v: string): Promise<string> => {
    let r = ''
    try {
      switch (mode) {
        case 'b64e': r = E.b64Encode(v); break
        case 'b64d': r = E.b64Decode(v); break
        case 'b32e': r = E.b32Encode(v); break
        case 'b32d': r = E.b32Decode(v); break
        case 'hexe': r = E.toHex(v); break
        case 'hexd': r = E.fromHex(v); break
        case 'bine': r = E.toBinary(v); break
        case 'bind': r = E.fromBinary(v); break
        case 'urle': r = E.urlEncode(v); break
        case 'urld': r = E.urlDecode(v); break
        case 'htmle': r = E.htmlEncode(v); break
        case 'htmld': r = E.htmlDecode(v); break
        case 'rot': r = E.rot13(v); break
        case 'caesar': r = E.caesar(v, shift); break
        case 'xor': r = E.xorText(v, key); break
        case 'xord': r = E.xorFromHex(v, key); break
        case 'json': r = E.jsonFormat(v, false); break
        case 'jsonmin': r = E.jsonFormat(v, true); break
        case 'uni': r = E.unicodeToAscii(v); break
        case 'ascii': r = E.asciiToUnicode(v); break
        case 'ts2date': r = E.timestampToDate(v); break
        case 'date2ts': r = E.dateToTimestamp(v); break
        case 'regex': {
          const re = new RegExp(pattern, flags)
          const m = v.match(re)
          r = m ? JSON.stringify(m, null, 2) : 'No match'
          break
        }
        case 'diff': r = v.split('\n').map((l, i) => (other.split('\n')[i] === l ? '  ' + l : '- ' + l)).join('\n'); break
        case 'comp': r = await C.compressText(v); break
        case 'decomp': r = await C.decompressText(v); break
      }
      return r
    } catch (e) {
      return 'Error: ' + (e as Error).message
    }
  }
  const run = async () => {
    const key = settings.delimiter
    const delim = key === 'auto' || key === 'newline' ? '\n' : key === 'comma' ? ',' : key === 'space' ? ' ' : key === 'semicolon' ? ';' : key === 'tab' ? '\t' : '\n'
    if (key !== 'none') {
      const lines = input.split(delim)
      const res = await Promise.all(lines.map((l) => transformOne(l)))
      setOutput(res.join(delim))
    } else {
      setOutput(await transformOne(input))
    }
  }

  return (
    <ToolCard title={title} description={desc}>
      {mode === 'caesar' && (
        <div className="row">
          <label className="muted">Shift</label>
          <input className="input" style={{ width: 80 }} type="number" value={shift} onChange={(e) => setShift(Number(e.target.value))} />
        </div>
      )}
      {(mode === 'xor' || mode === 'xord') && (
        <div className="row">
          <label className="muted">Key</label>
          <input className="input" value={key} onChange={(e) => setKey(e.target.value)} />
        </div>
      )}
      {mode === 'regex' && (
        <div className="row">
          <input className="input" placeholder="pattern" value={pattern} onChange={(e) => setPattern(e.target.value)} />
          <input className="input" style={{ width: 80 }} placeholder="flags" value={flags} onChange={(e) => setFlags(e.target.value)} />
        </div>
      )}
      {mode === 'diff' && (
        <>
          <label className="muted">Other text</label>
          <textarea value={other} onChange={(e) => setOther(e.target.value)} />
        </>
      )}
      <IO input={input} setInput={setInput} output={output} onRun={run} onCopy={copy} onReset={() => { setInput(''); setOutput('') }} />
    </ToolCard>
  )
}
