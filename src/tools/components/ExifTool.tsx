import { useRef, useState } from 'react'
import exifr from 'exifr'
import { ToolCard } from '../../components/ui/ToolCard'

export default function ExifTool() {
  const [out, setOut] = useState('')
  const [imgUrl, setImgUrl] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onFile = async (f: File) => {
    try {
      const data = await exifr.parse(f, { tiff: true, exif: true, gps: true, iptc: true, xmp: true, icc: true, jfif: true, ihdr: true })
      setOut(JSON.stringify(data, null, 2))
      const url = URL.createObjectURL(f)
      setImgUrl(url)
    } catch (e) {
      setOut('Error: ' + (e as Error).message)
    }
  }
  const strip = () => {
    if (!imgUrl || !canvasRef.current) return
    const img = new Image()
    img.onload = () => {
      const c = canvasRef.current!
      c.width = img.width; c.height = img.height
      const ctx = c.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      c.toBlob((blob) => {
        if (!blob) return
        const u = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = u; a.download = 'stripped.png'; a.click()
        URL.revokeObjectURL(u)
      }, 'image/png')
    }
    img.src = imgUrl
  }
  return (
    <ToolCard title="EXIF Viewer & Editor" description="Inspect image metadata and strip it locally">
      <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <textarea value={out} readOnly style={{ minHeight: 200 }} />
      <div className="row">
        <button className="btn" onClick={() => navigator.clipboard.writeText(out)}>Copy JSON</button>
        <button className="btn primary" onClick={strip} disabled={!imgUrl}>Strip metadata & download</button>
      </div>
    </ToolCard>
  )
}
