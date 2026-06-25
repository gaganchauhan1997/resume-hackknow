import { useState } from 'react'
import { Check } from 'lucide-react'

const TEMPLATES = [
  { id: 'modern', name: 'Modern', desc: 'Clean, professional, ATS-optimized', category: 'Professional', color: '#0a0a0a' },
  { id: 'classic', name: 'Classic', desc: 'Traditional elegance with modern touches', category: 'Professional', color: '#1a1a2e' },
  { id: 'minimal', name: 'Minimal', desc: 'Swiss-inspired whitespace design', category: 'Creative', color: '#2d4cff' },
  { id: 'brutalist', name: 'Brutalist', desc: 'Bold shadows, thick borders, yellow accents', category: 'Creative', color: '#ffea00' },
  { id: 'tech', name: 'Tech Stack', desc: 'Developer-focused with skills matrix', category: 'Technical', color: '#b6ff39' },
  { id: 'executive', name: 'Executive', desc: 'Board-level, strategy-focused layout', category: 'Professional', color: '#1a1812' },
  { id: 'startup', name: 'Startup', desc: 'Builder energy, product-focused', category: 'Creative', color: '#ff6b1a' },
  { id: 'academic', name: 'Academic', desc: 'Publications, research, education-first', category: 'Professional', color: '#2a2a2a' },
  { id: 'creative', name: 'Creative', desc: 'Portfolio-forward, visual impact', category: 'Creative', color: '#ff2e63' },
  { id: 'compact', name: 'Compact', desc: 'Fits maximum info in one page', category: 'Technical', color: '#0a0a0a' },
]

export default function Templates() {
  const [selected, setSelected] = useState('modern')
  const [primaryColor, setPrimaryColor] = useState('#0a0a0a')
  const [accentColor, setAccentColor] = useState('#ffea00')

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, paddingBottom: 16, borderBottom: '3px solid var(--ink)', flexWrap: 'wrap', gap: 16 }}>
        <div className="text-h1" style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, background: 'var(--lime)', color: 'var(--ink)', padding: '4px 8px' }}>10+</span>
          Resume Templates
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }} className="templates-grid">
        {/* Template Selector */}
        <div>
          <div className="panel" style={{ marginBottom: 16 }}>
            <div className="text-label" style={{ marginBottom: 12 }}>▸ CHOOSE TEMPLATE</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setSelected(t.id); setPrimaryColor(t.color) }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    border: selected === t.id ? 'var(--border)' : '2px solid transparent',
                    background: selected === t.id ? 'var(--yellow)' : 'var(--paper-warm)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  {selected === t.id && <Check size={16} />}
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700 }}>{t.name}</div>
                    <div style={{ fontSize: 10, opacity: 0.6 }}>{t.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="text-label" style={{ marginBottom: 12 }}>▸ CUSTOMIZE COLORS</div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, display: 'block', marginBottom: 4 }}>PRIMARY</label>
              <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} style={{ width: '100%', height: 40, border: 'var(--border)', cursor: 'pointer' }} />
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, display: 'block', marginBottom: 4 }}>ACCENT</label>
              <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} style={{ width: '100%', height: 40, border: 'var(--border)', cursor: 'pointer' }} />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div>
          <div className="panel">
            <div className="text-label" style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
              <span>▸ LIVE PREVIEW</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.6 }}>{TEMPLATES.find(t => t.id === selected)?.name}</span>
            </div>
            <div style={{
              background: 'white',
              border: 'var(--border)',
              padding: '32px',
              minHeight: 600,
              fontFamily: selected === 'brutalist' ? 'var(--font-display)' : 'var(--font-body)',
              color: primaryColor,
              boxShadow: selected === 'brutalist' ? '8px 8px 0 ' + primaryColor : 'none',
            }}>
              {selected === 'brutalist' ? (
                <div>
                  <h1 style={{ fontSize: 36, textTransform: 'uppercase', letterSpacing: '-0.04em', marginBottom: 4, background: accentColor, display: 'inline-block', padding: '0 8px', border: '3px solid ' + primaryColor }}>JANE DOE</h1>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, marginBottom: 24, background: primaryColor, color: 'white', display: 'inline-block', padding: '2px 8px' }}>SENIOR PRODUCT MANAGER</div>
                  <div style={{ border: '3px solid ' + primaryColor, padding: 16, marginBottom: 16, background: '#faf6e9' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, background: 'var(--pink)', color: 'white', display: 'inline-block', padding: '2px 6px', marginBottom: 8 }}>SUMMARY</div>
                    <div style={{ fontSize: 13, lineHeight: 1.5 }}>Results-driven product manager with 8+ years scaling B2B SaaS products from $0 to $10M ARR.</div>
                  </div>
                  <div style={{ border: '3px solid ' + primaryColor, padding: 16, background: accentColor }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, background: primaryColor, color: 'white', display: 'inline-block', padding: '2px 6px', marginBottom: 8 }}>EXPERIENCE</div>
                    <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                      <strong>TechCorp</strong> — Senior PM (2021-Present)<br />
                      Shipped AI engine → +34% conversion<br />
                      Grew users 50K → 500K
                    </div>
                  </div>
                </div>
              ) : selected === 'minimal' ? (
                <div style={{ maxWidth: 520, margin: '0 auto' }}>
                  <h1 style={{ fontSize: 28, fontWeight: 300, letterSpacing: '0.05em', marginBottom: 4, textTransform: 'uppercase' }}>Jane Doe</h1>
                  <div style={{ fontSize: 11, color: '#666', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 32 }}>Senior Product Manager</div>
                  <div style={{ height: 1, background: primaryColor, marginBottom: 24 }} />
                  <div style={{ fontSize: 13, lineHeight: 1.6, color: '#333' }}>Results-driven product manager with 8+ years scaling B2B SaaS products.</div>
                </div>
              ) : (
                <div>
                  <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 2, color: primaryColor }}>Jane Doe</h1>
                  <div style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>Senior Product Manager</div>
                  <div style={{ height: 2, background: accentColor, marginBottom: 16 }} />
                  <div style={{ fontSize: 12, lineHeight: 1.5, marginBottom: 16, color: '#333' }}>
                    Results-driven product manager with 8+ years scaling B2B SaaS products from $0 to $10M ARR.
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, color: primaryColor }}>Experience</div>
                  <div style={{ fontSize: 12, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 8 }}>
                      <strong>TechCorp</strong> — Senior Product Manager (2021-Present)<br />
                      <span style={{ color: '#555' }}>• Shipped AI recommendation engine (+34% conversion)</span><br />
                      <span style={{ color: '#555' }}>• Grew user base 50K → 500K</span>
                    </div>
                    <div>
                      <strong>StartupX</strong> — Product Manager (2018-2021)<br />
                      <span style={{ color: '#555' }}>• Built product team from scratch</span><br />
                      <span style={{ color: '#555' }}>• Reduced churn by 22%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button onClick={() => window.print()} className="btn-brutal btn-primary">↓ EXPORT PDF</button>
            <button onClick={() => navigator.clipboard.writeText('Resume content')} className="btn-brutal btn-ghost">⧉ COPY TEXT</button>
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 880px) { .templates-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}
