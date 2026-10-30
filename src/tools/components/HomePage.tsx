export default function HomePage({ onEnter }: { onEnter?: () => void }) {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 8 }}>
      <div className="card" style={{ textAlign: 'center', padding: 40, background: 'linear-gradient(135deg, rgba(78,161,255,.2), rgba(124,92,255,.2), rgba(45,212,191,.15))', border: 'none' }}>
        <h1 style={{ margin: 0, fontSize: 40, background: 'linear-gradient(90deg,#4ea1ff,#7c5cff,#2dd4bf)', WebkitBackgroundClip: 'text', color: 'transparent' }}>CTFToolKit</h1>
        <p style={{ fontSize: 18, color: 'var(--muted)', marginTop: 8 }}>Your offline-first CTF workstation</p>
        <p style={{ color: 'var(--muted)', maxWidth: 600, margin: '8px auto' }}>Encoding, cryptography, reverse shells, recipes, and native tool installation — all running locally in your browser.</p>
        <button className="btn primary" style={{ marginTop: 16, padding: '10px 24px', fontSize: 15 }} onClick={() => { if (onEnter) onEnter(); else window.dispatchEvent(new CustomEvent('ctftoolkit:nav', { detail: 'b64-enc' })) }}>
          Get Started
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginTop: 16 }}>
        {[
          ['Encoding', 'Base64, hex, URL, JWT, hashes and more'],
          ['Reverse Shell', 'Original generator with 20+ templates'],
          ['Recipe Workbench', 'Chain transformations visually'],
          ['Native Tools', 'Catalog + Linux installer'],
          ['Cheat Sheets', 'Quick references for common tools'],
          ['Offline', 'Works after first load, no backend'],
        ].map(([t, d]) => (
          <div className="card" key={t}>
            <h3 style={{ margin: '0 0 4px', color: 'var(--accent)' }}>{t}</h3>
            <p className="muted" style={{ margin: 0, fontSize: 13 }}>{d}</p>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Quick start</h3>
        <ol style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.8 }}>
          <li>Press Get Started or pick a tool from the sidebar.</li>
          <li>Use Ctrl+K to search all tools instantly.</li>
          <li>Press / to focus search, Esc to close dialogs.</li>
          <li>Install native tools via the curl command in the catalog.</li>
        </ol>
      </div>
    </div>
  )
}
