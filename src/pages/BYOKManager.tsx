import { useBYOK } from '@/hooks/useBYOK'
import { PROVIDERS, maskKey } from '@/providers/byok'
import { ExternalLink, Trash2, TestTube } from 'lucide-react'

export default function BYOKManager() {
  const { keys, prefs, setKey, deleteKey, setPrefs } = useBYOK()

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, paddingBottom: 16, borderBottom: '3px solid var(--ink)', flexWrap: 'wrap', gap: 16 }}>
        <div className="text-h1" style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, background: 'var(--pink)', color: 'var(--paper)', padding: '4px 8px' }}>▸</span>
          API Keys
        </div>
      </div>

      {/* Info Box */}
      <div style={{ background: 'var(--ink)', color: 'var(--paper)', padding: 20, marginBottom: 24, border: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--yellow)', marginBottom: 8 }}>
          ▸ HOW BYOK WORKS
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.6 }}>
          Resume Hackknow runs on <strong style={{ background: 'var(--yellow)', color: 'var(--ink)', padding: '0 3px' }}>your API keys</strong> — never on our servers.
          Your keys are stored <strong>only in your browser's localStorage</strong> on this device.
          Add one key to start; multiple keys = automatic fallback when one rate-limits.
        </p>
      </div>

      {/* Provider Preference */}
      <div className="panel" style={{ marginBottom: 24 }}>
        <div className="text-label" style={{ marginBottom: 12 }}>▸ PREFERRED PROVIDER</div>
        <select
          value={prefs.preferredProvider}
          onChange={e => setPrefs({ ...prefs, preferredProvider: e.target.value })}
          className="input-brutal"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', maxWidth: 300 }}
        >
          <option value="auto">▸ AUTO (best available)</option>
          {Object.entries(PROVIDERS).map(([id, p]) => (
            <option key={id} value={id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Provider Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        {Object.entries(PROVIDERS).map(([id, p]) => {
          const hasKey = !!keys[id]
          const keyValue = keys[id] || ''
          return (
            <div key={id} style={{ border: 'var(--border)', background: 'var(--card)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ padding: '14px 16px', background: 'var(--paper-warm)', borderBottom: 'var(--border-thin)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, textTransform: 'uppercase' }}>{p.name}</div>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  padding: '3px 6px',
                  background: hasKey ? 'var(--lime)' : 'var(--card)',
                  color: hasKey ? 'var(--ink)' : 'var(--ink-faint)',
                  border: '1.5px solid var(--ink)',
                  textTransform: 'uppercase',
                }}>
                  {hasKey ? 'ACTIVE' : 'EMPTY'}
                </span>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.6, marginBottom: 8 }}>{p.note}</div>
                <div style={{ marginBottom: 8 }}>
                  <input
                    type="password"
                    value={keyValue}
                    onChange={e => setKey(id, e.target.value)}
                    placeholder={p.keyHint}
                    className="input-brutal"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
                  />
                  {hasKey && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, marginTop: 4, opacity: 0.5 }}>
                      Saved: {maskKey(keyValue)}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <a
                    href={p.keyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: 10, display: 'inline-flex', alignItems: 'center', gap: 4, background: 'var(--yellow)', padding: '4px 8px', border: 'none', fontWeight: 700 }}
                  >
                    <ExternalLink size={12} /> GET FREE KEY
                  </a>
                  {hasKey && (
                    <>
                      <button
                        onClick={() => alert(`Testing ${p.name} key...`)}
                        style={{ fontFamily: 'var(--font-mono)', fontSize: 10, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', border: 'var(--border-thin)', background: 'var(--paper)', cursor: 'pointer', fontWeight: 700 }}
                      >
                        <TestTube size={12} /> TEST
                      </button>
                      <button
                        onClick={() => deleteKey(id)}
                        style={{ fontFamily: 'var(--font-mono)', fontSize: 10, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', border: 'var(--border-thin)', background: 'var(--pink)', color: 'var(--paper)', cursor: 'pointer', fontWeight: 700 }}
                      >
                        <Trash2 size={12} /> DELETE
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-faint)', marginTop: 24, lineHeight: 1.6, letterSpacing: '0.03em' }}>
        ▸ All providers above offer <strong>free tiers</strong>. Groq is fastest. Gemini has the largest context (1M tokens). 
        OpenRouter routes across 100+ models. <strong>Keys never leave your browser.</strong>
      </div>
    </div>
  )
}
