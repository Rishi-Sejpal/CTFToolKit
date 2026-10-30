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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
            <svg width="44" height="44" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="url(#lg)"/><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#ea580c"/></linearGradient></defs><text x="32" y="43" font-family="ui-sans-serif,system-ui" font-weight="900" font-size="28" text-anchor="middle" fill="#0a0a0a">CT</text></svg>
            <h1 style={{ fontSize: 44, margin: 0, fontWeight: 800, letterSpacing: '-.01em' }}>CTF<span style={{ color: '#f59e0b' }}>Tool</span>Kit</h1>
          </div>
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
        <div style={{ marginTop: 24, padding: 16, borderRadius: 12, border: '1px solid rgba(245,158,11,.18)', background: '#111111' }}>
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
        <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['Ctrl+K', '/', 'Esc', 'Ctrl+Enter'].map((k) => (
            <kbd key={k} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(245,158,11,.25)', background: '#111111', color: '#fbbf24', fontSize: 12, fontFamily: 'monospace' }}>{k}</kbd>
          ))}
        </div>
        <div style={{ marginTop: 24, textAlign: 'center' }}><img src="/images/ctftoolkit-brand-art.svg" alt="CTFToolKit" loading="lazy" style={{ width: 120, opacity: .7, marginBottom: 8 }} /></div>
        <div style={{ textAlign: 'center', color: '#525252', fontSize: 12 }}>
          MIT License · CTFToolKit · Documentation, installation and credits in repository
        </div>
      </div>
    </div>
  )
}
