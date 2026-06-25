import { useState } from 'react'
import { X, ChevronRight, ChevronLeft, Key, FileText, Target, LayoutTemplate, Download } from 'lucide-react'

const STEPS = [
  { id: 'keys', title: 'Connect API Key', description: 'Add your free AI provider key (Groq, Gemini, etc.) to power the tools. Keys stay in your browser only.', icon: Key },
  { id: 'resume', title: 'Paste Your Resume', description: 'Go to Resume Fixer and paste your current resume. The AI will rewrite it for maximum impact.', icon: FileText },
  { id: 'jd', title: 'Paste a Job Description', description: 'Use the JD Matcher or Company Tailor to align your resume with specific roles.', icon: Target },
  { id: 'template', title: 'Choose a Template', description: 'Pick from 10+ resume templates and customize colors to match your style.', icon: LayoutTemplate },
  { id: 'export', title: 'Export & Apply', description: 'Export as PDF, copy to clipboard, or save your tailored application packs.', icon: Download },
]

interface TourGuideProps {
  onClose: () => void
}

export default function TourGuide({ onClose }: TourGuideProps) {
  const [step, setStep] = useState(0)
  const [skipped, setSkipped] = useState(false)

  if (skipped) {
    return (
      <div style={{ position: 'fixed', bottom: 24, right: 24, background: 'var(--ink)', color: 'var(--paper)', padding: '12px 16px', border: 'var(--border)', boxShadow: 'var(--shadow-lg)', zIndex: 300, maxWidth: 300 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--yellow)' }}>Quick Start</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--paper)', cursor: 'pointer' }}><X size={14} /></button>
        </div>
        <ol style={{ fontSize: 12, lineHeight: 1.8, paddingLeft: 16 }}>
          <li>Add API key in KEYS</li>
          <li>Paste resume</li>
          <li>Paste JD</li>
          <li>Run tool + Export</li>
        </ol>
        <button onClick={() => setSkipped(false)} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', background: 'var(--yellow)', color: 'var(--ink)', border: 'none', padding: '4px 8px', cursor: 'pointer', marginTop: 8, fontWeight: 700 }}>
          Resume Tour
        </button>
      </div>
    )
  }

  const current = STEPS[step]
  const Icon = current.icon

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.75)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'var(--paper)', border: 'var(--border-thick)', boxShadow: 'var(--shadow-lg)', maxWidth: 480, width: '100%', padding: 32, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, background: 'var(--pink)', color: 'var(--paper)', border: 'var(--border)', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 900 }}>
          <X size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--ink-faint)' }}>
            STEP {step + 1} OF {STEPS.length}
          </span>
        </div>

        <div style={{ width: 64, height: 64, background: 'var(--yellow)', border: 'var(--border-thick)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, boxShadow: '4px 4px 0 var(--ink)' }}>
          <Icon size={32} />
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 12, lineHeight: 1 }}>
          {current.title}
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-soft)', marginBottom: 24 }}>
          {current.description}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setSkipped(true)}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', background: 'transparent', border: 'none', color: 'var(--ink-faint)', cursor: 'pointer', fontWeight: 700 }}
          >
            Skip Tour
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', padding: '10px 16px', border: 'var(--border)', background: 'var(--card)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <ChevronLeft size={14} /> Back
              </button>
            )}
            <button
              onClick={() => step < STEPS.length - 1 ? setStep(step + 1) : onClose()}
              style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', padding: '10px 16px', border: 'var(--border)', background: 'var(--ink)', color: 'var(--paper)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: 'var(--shadow-sm)' }}
            >
              {step < STEPS.length - 1 ? <>Next <ChevronRight size={14} /></> : 'Get Started'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, marginTop: 20, justifyContent: 'center' }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{ width: 8, height: 8, background: i === step ? 'var(--ink)' : i < step ? 'var(--lime)' : 'var(--ink-faint)', border: '1.5px solid var(--ink)' }} />
          ))}
        </div>
      </div>
    </div>
  )
}
