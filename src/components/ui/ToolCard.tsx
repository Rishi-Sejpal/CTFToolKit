import React from 'react'

interface Props {
  title: string
  description?: string
  children: React.ReactNode
}

export function ToolCard({ title, description, children }: Props) {
  return (
    <div className="card" style={{ maxWidth: 900 }}>
      <h2 style={{ margin: '0 0 4px', fontSize: 18 }}>{title}</h2>
      {description && <p className="muted" style={{ marginTop: 0 }}>{description}</p>}
      <div className="col" style={{ marginTop: 8 }}>{children}</div>
    </div>
  )
}

export function IO({ input, setInput, output, onRun, onCopy, onReset, runLabel = 'Run' }: {
  input: string
  setInput: (v: string) => void
  output: string
  onRun: () => void
  onCopy: () => void
  onReset: () => void
  runLabel?: string
}) {
  return (
    <>
      <label className="muted">Input</label>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} />
      <div className="row">
        <button className="btn primary" onClick={onRun}>{runLabel}</button>
        <button className="btn" onClick={onCopy}>Copy output</button>
        <button className="btn" onClick={onReset}>Reset</button>
      </div>
      <label className="muted">Output</label>
      <textarea value={output} readOnly />
    </>
  )
}
