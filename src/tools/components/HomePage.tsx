export default function HomePage({ onEnter }: { onEnter?: () => void }) {
  const enter = () => { if (onEnter) onEnter(); else window.dispatchEvent(new CustomEvent('ctftoolkit:nav', { detail: 'b64-enc' })) }
  const openPalette = () => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
  const features = [
    ['Encoding & Crypto', 'Base64, hex, URL, JWT, hashes, HMAC', '⬡', 'b64-enc'],
    ['Reverse Shells', '20+ templates, fully local generation', '⟐', 'rsg'],
    ['Recipe Workbench', 'Chain transformations visually', '⇄', 'recipe'],
    ['Native Installer', 'Kali, Debian, Ubuntu, Arch tools', '⚙', 'catalog'],
    ['Cheat Sheets', 'Quick refs, collapsible sections', '☰', 'cheatsheets'],
    ['Hex Editor', 'Inspect file bytes instantly', '  ', 'hexeditor'],
  ] as const
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f5f5f5', padding: '24px 16px 40px' }}>
      <style>{`
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
        .hp-feature { transition: border-color .15s ease, transform .15s ease; }
        .hp-feature:hover { border-color: rgba(245,158,11,.45); transform: translateY(-2px); }
        .hp-feature:focus { outline: 2px solid #f59e0b; outline-offset: 2px; }
      `}</style>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img src="/logo.svg" alt="CTFToolKit" style={{ width: '100%', maxWidth: 420, margin: '0 auto 8px', display: 'block' }} />
          <h1 style={{ fontSize: 44, margin: 0, fontWeight: 800, letterSpacing: '-.01em', textAlign: 'center' }}>CTF<span style={{ color: '#f59e0b' }}>Tool</span>Kit</h1>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={enter} style={{ padding: '10px 22px', borderRadius: 10, border: 'none', background: '#f59e0b', color: '#0a0a0a', fontWeight: 700, cursor: 'pointer' }}>Open Toolkit</button>
            <button onClick={openPalette} style={{ padding: '10px 22px', borderRadius: 10, border: '1px solid rgba(245,158,11,.35)', background: 'transparent', color: '#fbbf24', fontWeight: 600, cursor: 'pointer' }}>Search Tools (Ctrl+K)</button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }} className="hp-grid">
          {features.map(([t, d, ic, id]) => (
            <button key={t} className="hp-feature" onClick={() => window.dispatchEvent(new CustomEvent('ctftoolkit:nav', { detail: id }))} style={{ textAlign: 'left', padding: 16, borderRadius: 12, border: '1px solid rgba(245,158,11,.18)', background: '#111111', color: '#f5f5f5', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 20, color: '#f59e0b' }}>{ic}</span>
                <span style={{ color: '#737373', fontSize: 14 }}>→</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{t}</div>
              <div style={{ color: '#a3a3a3', fontSize: 13, lineHeight: 1.4 }}>{d}</div>
            </button>
          ))}
        </div>
        <style>{`@media (max-width: 768px) { .hp-grid { grid-template-columns: 1fr !important; } } @media (min-width: 769px) and (max-width: 1024px) { .hp-grid { grid-template-columns: repeat(2,1fr) !important; } }`}</style>
        <div style={{ marginTop: 24, padding: 20, borderRadius: 14, border: '1px solid rgba(245,158,11,.25)', background: 'linear-gradient(135deg, rgba(245,158,11,.06), #111111)', boxShadow: '0 4px 20px rgba(0,0,0,.3)' }}>
          <div style={{ fontWeight: 700, marginBottom: 8, color: '#fbbf24', fontSize: 14 }}>Offline-first & privacy</div>
          <p style={{ color: '#a3a3a3', fontSize: 13, margin: '0 0 8px' }}>Your browser-based CTF workstation. Encode, inspect, transform and explore — privately, locally, without a backend.</p>
          <ul style={{ color: '#a3a3a3', fontSize: 13, lineHeight: 1.7, margin: 0, paddingLeft: 18 }}>
            <li>All encoding, crypto and file inspection run entirely client-side.</li>
            <li>No tool input or uploaded files leave your browser.</li>
            <li>After the first load, the app works without internet access.</li>
            <li>The native installer is a separate, explicitly launched Bash script.</li>
            <li>Supported systems: Arch, Debian, Ubuntu, Kali Linux.</li>
          </ul>
        </div>
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
          <a href="https://github.com/Rishi-Sejpal/CTFToolKit" target="_blank" rel="noreferrer" style={{ color: '#a3a3a3' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2.00-3.20.70-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.70.08-.70 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.69 1.25 3.35.96.10-.75.40-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.10-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.0 11.0 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.10 0 4.42-2.70 5.39-5.27 5.68.42.36.79 1.08.79 2.18 0 1.58-.01 2.85-.01 3.24 0 .31.21.68.80.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z"/></svg>
          </a>
          <span style={{ color: '#737373', fontSize: 12 }}>by Rishi Sejpal</span>
        </div>
      </div>
    </div>
  )
}
