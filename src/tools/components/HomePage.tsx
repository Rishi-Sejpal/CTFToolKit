
export default function HomePage() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div className="card" style={{ textAlign: 'center', padding: 24, background: 'linear-gradient(135deg, rgba(78,161,255,.15), rgba(124,92,255,.15))' }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>CTFToolKit</h1>
        <p className="muted" style={{ fontSize: 15 }}>Offline-first CTF utilities for encoding, crypto, shells, and more.</p>
        <button className="btn primary" style={{ marginTop: 12 }} onClick={() => window.dispatchEvent(new CustomEvent('ctftoolkit:nav', { detail: 'b64-enc' }))}>Get Started</button>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Quick tips</h3>
        <ul style={{ color: 'var(--muted)', fontSize: 13 }}>
          <li>Use Ctrl+K to open the command palette.</li>
          <li>Press / to focus search.</li>
          <li>All processing happens locally in your browser.</li>
          <li>Install native tools with the curl installer.</li>
        </ul>
      </div>
    </div>
  )
}
