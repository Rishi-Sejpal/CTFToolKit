import { useState } from 'react'
import { ToolCard, IO } from '../../components/ui/ToolCard'
import * as E from '../impl/encoding'
import * as A from '../impl/aes'
import * as Ent from '../impl/entropy'
import * as IP from '../impl/ip'

export function Base58Tool() {
  const [input, setInput] = useState(''); const [output, setOutput] = useState(''); const [enc, setEnc] = useState(true)
  const run = () => { try { setOutput(enc ? E.b58Encode(input) : E.b58Decode(input)) } catch (e) { setOutput('Error: '+(e as Error).message) } }
  return <ToolCard title="Base58" description="Encode/decode Base58"><div className="row"><button className={`btn ${enc?'primary':''}`} onClick={()=>setEnc(true)}>Encode</button><button className={`btn ${!enc?'primary':''}`} onClick={()=>setEnc(false)}>Decode</button></div><IO input={input} setInput={setInput} output={output} onRun={run} onCopy={()=>navigator.clipboard.writeText(output)} onReset={()=>{setInput('');setOutput('')}} /></ToolCard>
}
export function Base85Tool() {
  const [input, setInput] = useState(''); const [output, setOutput] = useState(''); const [enc, setEnc] = useState(true)
  const run = () => { try { setOutput(enc ? E.b85Encode(input) : E.b85Decode(input)) } catch (e) { setOutput('Error: '+(e as Error).message) } }
  return <ToolCard title="Base85 (Ascii85)" description="Encode/decode Base85"><div className="row"><button className={`btn ${enc?'primary':''}`} onClick={()=>setEnc(true)}>Encode</button><button className={`btn ${!enc?'primary':''}`} onClick={()=>setEnc(false)}>Decode</button></div><IO input={input} setInput={setInput} output={output} onRun={run} onCopy={()=>navigator.clipboard.writeText(output)} onReset={()=>{setInput('');setOutput('')}} /></ToolCard>
}
export function MorseTool() {
  const [input, setInput] = useState(''); const [output, setOutput] = useState(''); const [enc, setEnc] = useState(true)
  const run = () => { setOutput(enc ? E.morseEncode(input) : E.morseDecode(input)) }
  return <ToolCard title="Morse Code" description="Encode/decode Morse"><div className="row"><button className={`btn ${enc?'primary':''}`} onClick={()=>setEnc(true)}>Encode</button><button className={`btn ${!enc?'primary':''}`} onClick={()=>setEnc(false)}>Decode</button></div><IO input={input} setInput={setInput} output={output} onRun={run} onCopy={()=>navigator.clipboard.writeText(output)} onReset={()=>{setInput('');setOutput('')}} /></ToolCard>
}
export function VigenereTool() {
  const [input, setInput] = useState(''); const [key, setKey] = useState('KEY'); const [output, setOutput] = useState(''); const [dec, setDec] = useState(false)
  const run = () => { setOutput(E.vigenere(input, key, dec)) }
  return <ToolCard title="Vigenère Cipher" description="Vigenère encode/decode"><div className="row"><label className="muted">Key</label><input className="input" value={key} onChange={(e)=>setKey(e.target.value)} /><button className={`btn ${dec?'primary':''}`} onClick={()=>setDec(!dec)}>{dec?'Decode':'Encode'}</button></div><IO input={input} setInput={setInput} output={output} onRun={run} onCopy={()=>navigator.clipboard.writeText(output)} onReset={()=>{setInput('');setOutput('')}} /></ToolCard>
}
export function AesTool() {
  const [input, setInput] = useState(''); const [pass, setPass] = useState(''); const [output, setOutput] = useState(''); const [enc, setEnc] = useState(true)
  const run = async () => { try { setOutput(enc ? await A.aesEncrypt(input, pass) : await A.aesDecrypt(input, pass)) } catch (e) { setOutput('Error: '+(e as Error).message) } }
  return <ToolCard title="AES Encrypt/Decrypt" description="AES-GCM with password (PBKDF2)"><div className="row"><button className={`btn ${enc?'primary':''}`} onClick={()=>setEnc(true)}>Encrypt</button><button className={`btn ${!enc?'primary':''}`} onClick={()=>setEnc(false)}>Decrypt</button></div><label className="muted">Password</label><input className="input" type="password" value={pass} onChange={(e)=>setPass(e.target.value)} /><IO input={input} setInput={setInput} output={output} onRun={run} onCopy={()=>navigator.clipboard.writeText(output)} onReset={()=>{setInput('');setOutput('');setPass('')}} /></ToolCard>
}
export function EntropyTool() {
  const [input, setInput] = useState(''); const [out, setOut] = useState('')
  const run = () => { setOut(`Shannon entropy: ${Ent.shannonEntropy(input).toFixed(4)} bits/char\nLength: ${input.length}`) }
  const onFile = async (f: File) => { const buf=await f.arrayBuffer(); const data=new Uint8Array(buf); setInput(''); setOut(`Byte entropy: ${Ent.byteEntropy(data).toFixed(4)} bits/byte\nSize: ${data.length} bytes`) }
  return <ToolCard title="Entropy Analysis" description="Shannon entropy for text or files"><input type="file" onChange={(e)=>e.target.files?.[0]&&onFile(e.target.files[0])} /><textarea value={input} onChange={(e)=>setInput(e.target.value)} /><button className="btn primary" onClick={run}>Analyse text</button><textarea value={out} readOnly /></ToolCard>
}
export function SubnetTool() {
  const [input, setInput] = useState('192.168.1.0/24'); const [out, setOut] = useState('')
  const run = () => { try { setOut(IP.subnetInfo(input)) } catch (e) { setOut('Error: '+(e as Error).message) } }
  return <ToolCard title="IP Subnet Calculator" description="IPv4 CIDR subnet info"><input className="input" value={input} onChange={(e)=>setInput(e.target.value)} /><button className="btn primary" onClick={run}>Calculate</button><textarea value={out} readOnly /></ToolCard>
}
