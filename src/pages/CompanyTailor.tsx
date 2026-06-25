import { useState } from 'react'
import { useBYOK } from '@/hooks/useBYOK'
import { aiCall, mdToHtml } from '@/providers/byok'

export default function CompanyTailor() {
  const { keys, prefs } = useBYOK()
  const [jobTitle, setJobTitle] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [jdText, setJdText] = useState('')
  const [resume, setResume] = useState('')
  const [output, setOutput] = useState('')
  const [activeTab, setActiveTab] = useState<'resume' | 'cover' | 'message' | 'checklist'>('resume')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [parsed, setParsed] = useState<{
    tailoredResume?: string;
    coverLetter?: string;
    recruiterMessage?: string;
    prepChecklist?: string;
  }>({})

  const handleRun = async () => {
    if (!jobTitle.trim() || !companyName.trim() || !jdText.trim() || !resume.trim()) {
      setError('Job title, company name, JD, and resume are all required')
      return
    }
    setLoading(true)
    setError('')
    setParsed({})

    try {
      const { result } = await aiCall(
        keys,
        prefs,
        [
          {
            role: 'system',
            content: `You are Resume Hackknow's Company-Specific Tailoring Engine — the most advanced feature in the system. PRO users only.

Your task: For the given company and role, produce a complete application package.

Output EXACTLY in this format with these section headers:

## TAILORED RESUME FOR [COMPANY]
[Full rewritten resume tailored to THIS company and THIS role. Use company name and JD language explicitly. No fabrication.]

---

## COVER LETTER FOR [COMPANY]
[Short, company-specific cover letter. Reference the company's mission, products, or culture specifically.]

---

## RECRUITER MESSAGE FOR [COMPANY] / [ROLE]
[LinkedIn/email message referencing the company and role specifically.]

---

## PREP CHECKLIST FOR [COMPANY] / [ROLE]
[Questions to prepare, stories to highlight, company research angles]`
          },
          {
            role: 'user',
            content: `Job title: ${jobTitle}
Company: ${companyName}
Source: ${sourceUrl || 'N/A'}

JOB DESCRIPTION:
${jdText}

MY RESUME:
${resume}

Generate the full company-specific pack now.`
          }
        ],
        { temperature: 0.6, max_tokens: 3500 }
      )

      setOutput(result)

      // Parse sections
      const p: typeof parsed = {}
      const sections = result.split(/## /)
      for (const s of sections) {
        if (s.startsWith('TAILORED RESUME')) p.tailoredResume = s.replace(/^TAILORED RESUME[^\n]*\n/, '').trim()
        if (s.startsWith('COVER LETTER')) p.coverLetter = s.replace(/^COVER LETTER[^\n]*\n/, '').trim()
        if (s.startsWith('RECRUITER MESSAGE')) p.recruiterMessage = s.replace(/^RECRUITER MESSAGE[^\n]*\n/, '').trim()
        if (s.startsWith('PREP CHECKLIST')) p.prepChecklist = s.replace(/^PREP CHECKLIST[^\n]*\n/, '').trim()
      }
      setParsed(p)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const tabContent = () => {
    switch (activeTab) {
      case 'resume': return parsed.tailoredResume || output
      case 'cover': return parsed.coverLetter || 'No cover letter generated yet'
      case 'message': return parsed.recruiterMessage || 'No recruiter message generated yet'
      case 'checklist': return parsed.prepChecklist || 'No checklist generated yet'
    }
  }

  const tabs: { id: typeof activeTab; label: string }[] = [
    { id: 'resume', label: 'Tailored Resume' },
    { id: 'cover', label: 'Cover Letter' },
    { id: 'message', label: 'Recruiter Message' },
    { id: 'checklist', label: 'Prep Checklist' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, paddingBottom: 16, borderBottom: '3px solid var(--ink)', flexWrap: 'wrap', gap: 16 }}>
        <div className="text-h1" style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, background: 'var(--yellow)', color: 'var(--ink)', padding: '4px 8px' }}>PRO</span>
          <span>Company-Specific Tailor</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--ink-faint)', fontWeight: 700 }}>
          Per-company resume + cover letter + prep
        </div>
      </div>

      {/* Input Form */}
      <div className="panel" style={{ marginBottom: 24 }}>
        <div className="text-label" style={{ marginBottom: 16 }}>▸ JOB POST DETAILS</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }} className="company-grid">
          <div>
            <label className="text-label" style={{ display: 'block', marginBottom: 6 }}>Job Title *</label>
            <input type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g. Senior Frontend Engineer" className="input-brutal" />
          </div>
          <div>
            <label className="text-label" style={{ display: 'block', marginBottom: 6 }}>Company Name *</label>
            <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g. Stripe" className="input-brutal" />
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label className="text-label" style={{ display: 'block', marginBottom: 6 }}>Source Link (optional)</label>
          <input type="url" value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} placeholder="https://..." className="input-brutal" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }} className="company-grid">
          <div>
            <label className="text-label" style={{ display: 'block', marginBottom: 6 }}>Job Description *</label>
            <textarea value={jdText} onChange={e => setJdText(e.target.value)} placeholder="Paste the full job description..." rows={12} className="input-brutal textarea-brutal" />
          </div>
          <div>
            <label className="text-label" style={{ display: 'block', marginBottom: 6 }}>Your Resume *</label>
            <textarea value={resume} onChange={e => setResume(e.target.value)} placeholder="Paste your resume..." rows={12} className="input-brutal textarea-brutal" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={handleRun} disabled={loading} className="btn-brutal btn-primary">
            {loading ? (
              <span style={{ display: 'inline-flex', gap: 4 }}>
                {[0, 0.2, 0.4].map(d => (
                  <span key={d} style={{ width: 8, height: 8, background: 'var(--ink)', animation: 'loadDot 1.4s ease-in-out infinite', animationDelay: `${d}s`, display: 'inline-block' }} />
                ))}
              </span>
            ) : (
              '▸ GENERATE COMPANY PACK'
            )}
          </button>
          {output && <button onClick={() => navigator.clipboard.writeText(tabContent())} className="btn-brutal btn-ghost">⧉ COPY</button>}
        </div>
        {error && <div style={{ color: 'var(--pink)', fontFamily: 'var(--font-mono)', fontSize: 12, marginTop: 12 }}>{error}</div>}
      </div>

      {/* Output Tabs */}
      {output && (
        <div>
          <div style={{ display: 'flex', gap: 0, marginBottom: 0, borderBottom: '3px solid var(--ink)' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: '10px 16px',
                  border: '2px solid transparent',
                  borderBottom: 'none',
                  background: activeTab === tab.id ? 'var(--ink)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--paper)' : 'var(--ink)',
                  cursor: 'pointer',
                  marginBottom: -3,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="panel" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
            <div
              style={{ minHeight: 400, maxHeight: 800, overflowY: 'auto', fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.65, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: mdToHtml(tabContent()) }}
            />
          </div>
        </div>
      )}

      <style>{`@media (max-width: 880px) { .company-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}
