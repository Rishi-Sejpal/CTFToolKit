export default function HomePage({ onEnter }: { onEnter?: () => void }) {
  const enter = () => { if (onEnter) onEnter(); else window.dispatchEvent(new CustomEvent('ctftoolkit:nav', { detail: 'b64-enc' })) }
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)', color: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'ui-sans-serif, system-ui' }}>
      <div style={{ width: '100%', maxWidth: 980 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-block', padding: '8px 18px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 12, letterSpacing: '.2em', color: '#a5b4fc' }}>OFFLINE-FIRST CTF TOOLKIT</div>
          <h1 style={{ fontSize: 56, margin: '18px 0 8px', fontWeight: 800, background: 'linear-gradient(90deg,#818cf8,#c084fc,#38bdf8)', WebkitBackgroundClip: 'text', color: 'transparent' }}>CTFToolKit</h1>
          <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 560, margin: '0 auto' }}>A rich, minimal workstation for encoding, crypto, shells and more — running entirely in your browser.</p>
          <button onClick={enter} style={{ marginTop: 24, padding: '14px 34px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer', boxShadow: '0 8px 24px rgba(99,102,241,.45), inset 0 1px 0 rgba(255,255,255,.2)' }}>
            Get Started
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {[
            ['Encoding & Crypto', 'Base64, hex, JWT, hashes, HMAC'],
            ['Reverse Shells', '20+ templates, fully local'],
            ['Recipe Workbench', 'Chain transformations visually'],
            ['Native Installer', 'Kali/Debian/Ubuntu/Arch tools'],
            ['Cheat Sheets', 'Quick references, collapsible'],
            ['Hex Editor', 'Inspect file bytes instantly'],
          ].map(([t, d]) => (
            <div key={t} style={{ padding: 20, borderRadius: 16, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.06)' }}>
              <div style={{ fontWeight: 700, color: '#c7d2fe', marginBottom: 6 }}>{t}</div>
              <div style={{ color: '#94a3b8', fontSize: 13 }}>{d}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24, padding: 20, borderRadius: 16, background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: 'inset 0 2px 8px rgba(0,0,0,.3)' }}>
          <div style={{ fontWeight: 700, marginBottom: 8, color: '#e2e8f0' }}>Shortcuts</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {['Ctrl+K Palette', '/ Search', 'Esc Close', 'Ctrl+Enter Run'].map((k) => (
              <span key={k} style={{ padding: '6px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 12, color: '#cbd5e1', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.08)' }}>{k}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
