import { useState } from 'react'
import exifr from 'exifr'
import { ToolCard } from '../../components/ui/ToolCard'

export default function ExifTool() {
  const [out, setOut] = useState('')
  const onFile = async (f: File) => {
    try {
      const data = await exifr.parse(f, { tiff: true, exif: true, gps: true, iptc: true, xmp: true, icc: true, jfif: true, ihdr: true })
      setOut(JSON.stringify(data, null, 2))
    } catch (e) {
      setOut('Error: ' + (e as Error).message)
    }
  }
  return (
    <ToolCard title="EXIF Viewer" description="Inspect image metadata locally">
      <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      <textarea value={out} readOnly style={{ minHeight: 240 }} />
      <button className="btn" onClick={() => navigator.clipboard.writeText(out)}>Copy JSON</button>
    </ToolCard>
  )
}
