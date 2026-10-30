import { useState } from 'react'
import { ToolCard } from '../../components/ui/ToolCard'

const SIGS: [string, string][] = [
  ['89504e47', 'PNG image'],
  ['ffd8ffe0', 'JPEG image (JFIF)'],
  ['ffd8ffe1', 'JPEG image (Exif)'],
  ['47494638', 'GIF image'],
  ['25504446', 'PDF document'],
  ['504b0304', 'ZIP archive'],
  ['7f454c46', 'ELF binary'],
  ['4d5a', 'Windows PE executable'],
  ['52494646', 'RIFF (WAV/AVI)'],
  ['1f8b', 'Gzip'],
]

export default function FileSigTool() {
  const [out, setOut] = useState('')
  const onFile = async (f: File) => {
    const buf = await f.arrayBuffer()
    const bytes = new Uint8Array(buf).slice(0, 8)
    const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
    let match = 'Unknown'
    for (const [sig, name] of SIGS) {
      if (hex.startsWith(sig)) { match = name; break }
    }
    setOut(`File: ${f.name}\nSize: ${f.size} bytes\nMagic: ${hex}\nType: ${match}`)
  }
  return (
    <ToolCard title="File Signature Detection" description="Identify file type by magic bytes">
      <input type="file" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      <textarea value={out} readOnly />
    </ToolCard>
  )
}
