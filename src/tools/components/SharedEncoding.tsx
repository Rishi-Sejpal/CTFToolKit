import { useState } from 'react'
import { IO, ToolCard } from '../../components/ui/ToolCard'
import * as E from '../impl/encoding'
import * as C from '../impl/compression'

type Mode = 'b64e' | 'b64d' | 'b32e' | 'b32d' | 'hexe' | 'hexd' | 'bine' | 'bind' | 'urle' | 'urld' | 'htmle' | 'htmld' | 'rot' | 'caesar' | 'xor' | 'xord' | 'json' | 'jsonmin' | 'uni' | 'ascii' | 'ts2date' | 'date2ts' | 'regex' | 'diff' | 'comp' | 'decomp'

export function SharedEncoding({ mode, title, desc }: { mode: Mode; title: string; desc: string }) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [key, setKey] = useState('key')
  const [shift, setShift] = useState(3)
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [other, setOther] = useState('')
  const copy = async () => { try { await navigator.clipboard.writeText(output) } catch {} }

  const run = async () => {
    try {
      let r = ''
      switch (mode) {
        case 'b64e': r = E.b64Encode(input); break
        case 'b64d': r = E.b64Decode(input); break
        case 'b32e': r = E.b32Encode(input); break
        case 'b32d': r = E.b32Decode(input); break
        case 'hexe': r = E.toHex(input); break
        case 'hexd': r = E.fromHex(input); break
        case 'bine': r = E.toBinary(input); break
        case 'bind': r = E.fromBinary(input); break
        case 'urle': r = E.urlEncode(input); break
        case 'urld': r = E.urlDecode(input); break
        case 'htmle': r = E.htmlEncode(input); break
        case 'htmld': r = E.htmlDecode(input); break
        case 'rot': r = E.rot13(input); break
        case 'caesar': r = E.caesar(input, shift); break
        case 'xor': r = E.xorText(input, key); break
        case 'xord': r = E.xorFromHex(input, key); break
        case 'json': r = E.jsonFormat(input, false); break
        case 'jsonmin': r = E.jsonFormat(input, true); break
        case 'uni': r = E.unicodeToAscii(input); break
        case 'ascii': r = E.asciiToUnicode(input); break
        case 'ts2date': r = E.timestampToDate(input); break
        case 'date2ts': r = E.dateToTimestamp(input); break
        case 'regex': {
          const re = new RegExp(pattern, flags)
          const m = input.match(re)
          r = m ? JSON.stringify(m, null, 2) : 'No match'
          break
        }
        case 'diff': r = input.split('\n').map((l, i) => (other.split('\n')[i] === l ? '  ' + l : '- ' + l)).join('\n'); break
        case 'comp': r = await C.compressText(input); break
        case 'decomp': r = await C.decompressText(input); break
      }
      setOutput(r)
    } catch (e) {
      setOutput('Error: ' + (e as Error).message)
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
