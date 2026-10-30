import { useRef, useState } from 'react'
import { ToolCard } from '../../components/ui/ToolCard'

export default function LsbTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [info, setInfo] = useState('')
  const onFile = (f: File) => {
    const img = new Image()
    const url = URL.createObjectURL(f)
    img.onload = () => {
      const c = canvasRef.current!
      c.width = img.width
      c.height = img.height
      const ctx = c.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      const data = ctx.getImageData(0, 0, img.width, img.height)
      for (let i = 0; i < data.data.length; i += 4) {
        const lsb = data.data[i] & 1
        const v = lsb ? 255 : 0
        data.data[i] = v
        data.data[i + 1] = v
        data.data[i + 2] = v
      }
      ctx.putImageData(data, 0, 0)
      setInfo(`${img.width}x${img.height}`)
      URL.revokeObjectURL(url)
    }
    img.src = url
  }
  return (
    <ToolCard title="LSB Inspector" description="Visualise least significant bit plane of an image">
      <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      <div className="muted">{info}</div>
      <canvas ref={canvasRef} style={{ maxWidth: '100%', border: '1px solid var(--border)' }} />
    </ToolCard>
  )
}
