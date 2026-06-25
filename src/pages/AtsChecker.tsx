import { useState } from 'react'
import { useBYOK } from '@/hooks/useBYOK'
import { aiCall, computeLocalAtsScore, mdToHtml } from '@/providers/byok'
import type { AtsScore } from '@/types'

export default function AtsChecker() {
  const { keys, prefs } = useBYOK()
  const [resume, setResume] = useState('')
  const [jd, setJd] = useState('')
  const [localScore, setLocalScore] = useState<AtsScore | null>(null)
  const [aiResult, setAiResult] = useState('')
  const [providerUsed, setProviderUsed] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!resume.trim() || !jd.trim()) {
      setError('Paste both resume and job description')
      return
    }
    setLoading(true)
    setError('')
    setAiResult('')
    setLocalScore(null)

    const local = computeLocalAtsScore(resume, jd)
    setLocalScore(local)

    try {
      const { result, provider } = await aiCall(
        keys,
        prefs,
        [
          {
            role: 'system',
            content: `You are an enterprise ATS parsing engine combined with a senior technical recruiter. Analyze the resume against the job description.

Output format:
## ATS SCORE: [number out of 100]
**Verdict:** [BLOCKED | WEAK | DECENT | STRONG | ELITE]

## KEYWORD GAP
Top 8-12 missing keywords and how to inject them.

## SECTION ANALYSIS
Summary, Skills, Experience, Education — each with strength + fix.

## TOP 3 PRIORITY FIXES
Numbered, actionable, copy-pasteable.

## RECRUITER 6-SECOND READ
What a recruiter sees in 6 seconds.

Be brutally specific. No fluff.`
          },
          {
            role: 'user',
            content: `RESUME:\n${resume}\n\n---\n\nJOB DESCRIPTION:\n${jd}\n\nScore and analyze now.`
          }
        ],
        { temperature: 0.3, max_tokens: 2000 }
      )
      setAiResult(result)
      setProviderUsed(provider)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const scoreGrade = (score: number) => {
    if (score >= 85) return 'ELITE'
    if (score >= 70) return 'STRONG'
    if (score >= 55) return 'DECENT'
    if (score >= 40) return 'WEAK'
    return 'BLOCKED'
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, paddingBottom: 16, borderBottom: '3px solid var(--ink)', flexWrap: 'wrap', gap: 16 }}>
        <div className="text-h1" style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, background: 'var(--pink)', color: 'var(--paper)', padding: '4px 8px' }}>08</span>
          ATS Score Checker
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--ink-faint)', fontWeight: 700 }}>
          JD vs resume score + breakdown
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }} className="ats-grid">
        <div className="panel">
          <div className="text-label" style={{ marginBottom: 16 }}>▸ YOUR RESUME</div>
          <textarea
            value={resume}
            onChange={e => setResume(e.target.value)}
            placeholder="Paste your full resume..."
            rows={14}
            className="input-brutal textarea-brutal"
          />
        </div>
        <div className="panel">
          <div className="text-label" style={{ marginBottom: 16 }}>▸ JOB DESCRIPTION</div>
          <textarea
            value={jd}
            onChange={e => setJd(e.target.value)}
            placeholder="Paste the job description..."
            rows={14}
            className="input-brutal textarea-brutal"
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
        <button onClick={handleAnalyze} disabled={loading} className="btn-brutal btn-primary">
          {loading ? (
            <span style={{ display: 'inline-flex', gap: 4 }}>
              {[0, 0.2, 0.4].map(d => (
                <span key={d} style={{ width: 8, height: 8, background: 'var(--ink)', animation: 'loadDot 1.4s ease-in-out infinite', animationDelay: `${d}s`, display: 'inline-block' }} />
              ))}
            </span>
          ) : (
            '▸ GENERATE ATS REPORT'
          )}
        </button>
        {aiResult && (
          <button onClick={() => navigator.clipboard.writeText(aiResult)} className="btn-brutal btn-ghost">⧉ COPY</button>
        )}
      </div>

      {error && (
        <div style={{ border: '3px solid var(--pink)', background: 'rgba(255,46,99,0.08)', padding: 18, marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--pink)', marginBottom: 10 }}>ERROR</div>
          <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{error}</pre>
        </div>
      )}

      {localScore && (
        <div style={{ marginBottom: 24 }}>
          <div className="score-block">
            <div className="score-num">{localScore.score}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 4, opacity: 0.7 }}>
                LOCAL ATS SCORE · /100
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, textTransform: 'uppercase' }}>
                {scoreGrade(localScore.score)}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 24 }}>
            {Object.entries(localScore.breakdown).map(([key, val]) => (
              <div key={key} style={{ background: 'var(--card)', border: 'var(--border)', padding: 16, boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--ink-faint)', marginBottom: 8 }}>
                  {key.replace(/_/g, ' ')}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: '-0.02em' }}>
                  {val.score}<span style={{ fontSize: 14, color: 'var(--ink-faint)' }}>/{val.max}</span>
                </div>
                <div style={{ height: 8, background: 'var(--paper-warm)', border: '1px solid var(--ink)', marginTop: 8 }}>
                  <div style={{ height: '100%', background: val.score / val.max > 0.7 ? 'var(--lime)' : val.score / val.max > 0.4 ? 'var(--yellow)' : 'var(--pink)', width: `${(val.score / val.max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            <div className="panel">
              <div className="text-label" style={{ marginBottom: 12 }}>▸ MATCHED KEYWORDS ({localScore.matched_keywords.length})</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {localScore.matched_keywords.map(kw => (
                  <span key={kw} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, background: 'var(--lime)', border: '1.5px solid var(--ink)', padding: '2px 7px' }}>{kw}</span>
                ))}
              </div>
            </div>
            <div className="panel">
              <div className="text-label" style={{ marginBottom: 12 }}>▸ MISSING KEYWORDS ({localScore.missing_keywords.length})</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {localScore.missing_keywords.map(kw => (
                  <span key={kw} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, background: 'var(--pink)', color: 'var(--paper)', border: '1.5px solid var(--ink)', padding: '2px 7px' }}>{kw}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {aiResult && (
        <div className="panel panel-dark">
          <div className="text-label" style={{ marginBottom: 16, color: 'var(--paper)' }}>
            ▸ AI ANALYSIS {providerUsed && `(via ${providerUsed})`}
          </div>
          <div
            style={{ background: 'var(--paper)', color: 'var(--ink)', padding: 24, border: 'var(--border)', fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.65, maxHeight: 800, overflowY: 'auto' }}
            dangerouslySetInnerHTML={{ __html: mdToHtml(aiResult) }}
          />
        </div>
      )}

      <style>{`@media (max-width: 880px) { .ats-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}
