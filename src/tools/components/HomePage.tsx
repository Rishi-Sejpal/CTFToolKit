export default function HomePage({ onEnter }: { onEnter?: () => void }) {
  const enter = () => { if (onEnter) onEnter(); else window.dispatchEvent(new CustomEvent('ctftoolkit:nav', { detail: 'b64-enc' })) }
  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#f5f5f5', position: 'relative', overflow: 'hidden', fontFamily: 'ui-sans-serif, system-ui' }}>
      <style>{`
        @keyframes float1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,-20px)} }
        @keyframes float2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-20px,30px)} }
        @keyframes glow { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .hp-card { transition: transform .25s ease, box-shadow .25s ease; }
        .hp-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(245,158,11,.25); }
        .hp-btn { transition: transform .2s ease, box-shadow .2s ease; }
        .hp-btn:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 12px 30px rgba(245,158,11,.5); }
      `}</style>
      <div style={{ position: 'absolute', top: -120, left: -80, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,.35), transparent 70%)', filter: 'blur(40px)', animation: 'float1 8s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', bottom: -140, right: -60, width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(234,88,12,.3), transparent 70%)', filter: 'blur(50px)', animation: 'float2 10s ease-in-out infinite' }} />
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 1040, animation: 'slideUp .7s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 999, background: 'rgba(245,158,11,.1)', border: '1px solid rgba(245,158,11,.3)', fontSize: 11, letterSpacing: '.25em', color: '#fbbf24', animation: 'glow 3s ease-in-out infinite' }}>OFFLINE-FIRST · NO BACKEND</div>
            <h1 style={{ fontSize: 64, margin: '20px 0 10px', fontWeight: 900, letterSpacing: '-.02em', color: '#f5f5f5' }}>
              CTF<span style={{ color: '#f59e0b' }}>Tool</span>Kit
            </h1>
            <p style={{ color: '#a3a3a3', fontSize: 19, maxWidth: 600, margin: '0 auto', lineHeight: 1.5 }}>A clean, minimal workstation for encoding, crypto, shells and recon — running entirely in your browser.</p>
            <button className="hp-btn" onClick={enter} style={{ marginTop: 28, padding: '15px 40px', borderRadius: 12, border: '1px solid rgba(245,158,11,.4)', background: 'linear-gradient(135deg,#f59e0b,#ea580c)', color: '#0a0a0a', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 30px rgba(245,158,11,.35)' }}>
              Get Started →
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14 }}>
            {[
              ['Encoding & Crypto', 'Base64, hex, JWT, hashes, HMAC', '⬡'],
              ['Reverse Shells', '20+ templates, fully local', '⟐'],
              ['Recipe Workbench', 'Chain transformations visually', '.BUTTON'],
              ['Native Installer', 'Kali/Debian/Ubuntu/Arch tools', '⚙'],
              ['Cheat Sheets', 'Quick refs, collapsible', '☰'],
              ['Hex Editor', 'Inspect file bytes instantly', '  '],
            ].map(([t, d, ic]) => (
              <div key={t} className="hp-card" style={{ padding: 20, borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(245,158,11,.15)', backdropFilter: 'blur(8px)' }}>
                <div style={{ fontSize: 22, color: '#f59e0b', marginBottom: 8 }}>{ic}</div>
                <div style={{ fontWeight: 700, color: '#fafafa', marginBottom: 4, fontSize: 15 }}>{t}</div>
                <div style={{ color: '#737373', fontSize: 13 }}>{d}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
            {['Ctrl+K Palette', '/ Search', 'Esc Close', 'Ctrl+Enter Run'].map((k) => (
              <span key={k} style={{ padding: '7px 14px', borderRadius: 10, background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.25)', fontSize: 12, color: '#fbbf24' }}>{k}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
