import { useState } from 'react'
import { BSON } from 'bson'
import { ToolCard } from '../../components/ui/ToolCard'

export default function BsonTool() {
  const [input, setInput] = useState('')
  const [out, setOut] = useState('')
  const [enc, setEnc] = useState(true)
  const run = () => {
    try {
      if (enc) {
        const obj = JSON.parse(input)
        const buf = BSON.serialize(obj)
        setOut(btoa(String.fromCharCode(...buf)))
      } else {
        const buf = Uint8Array.from(atob(input), (c) => c.charCodeAt(0))
        const obj = BSON.deserialize(buf)
        setOut(JSON.stringify(obj, null, 2))
      }
    } catch (e) { setOut('Error: ' + (e as Error).message) }
  }
  return (
    <ToolCard title="BSON Encode/Decode" description="BSON serialization">
      <div className="row"><button className={`btn ${enc?'primary':''}`} onClick={()=>setEnc(true)}>Encode</button><button className={`btn ${!enc?'primary':''}`} onClick={()=>setEnc(false)}>Decode</button></div>
      <textarea value={input} onChange={(e)=>setInput(e.target.value)} />
      <button className="btn primary" onClick={run}>Run</button>
      <textarea value={out} readOnly />
    </ToolCard>
  )
}
