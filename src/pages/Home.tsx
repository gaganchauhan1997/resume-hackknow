import { Link } from 'react-router'
import { FileText, Target, Users, Pen, Mail, MessageSquare, BarChart3, Zap, Eye, Lock, Package, Building2 } from 'lucide-react'

const FEATURES = [
  { id: 'resume-fixer', label: 'Resume Fixer', desc: 'Rewrite your resume to maximize interview callbacks with strong action verbs and quantified results.', icon: FileText, color: 'yellow' },
  { id: 'jd-matcher', label: 'JD Matcher', desc: 'Identify missing keywords and rewrite your resume to match any job description.', icon: Target, color: '' },
  { id: 'role-finder', label: 'Role Fit Finder', desc: 'Discover 10 roles you are qualified for but might be overlooking, ranked by demand.', icon: Users, color: 'pink' },
  { id: 'bullet-upgrader', label: 'Bullet Upgrader', desc: 'Make your resume bullets clearer, more results-focused, and recruiter-impressive.', icon: Pen, color: 'lime' },
  { id: 'cover-letter', label: 'Cover Letter', desc: 'Write tailored, human-sounding cover letters that feel confident and specific.', icon: Mail, color: '' },
  { id: 'recruiter-hook', label: 'Recruiter Hook', desc: 'Craft LinkedIn/email messages that spark recruiter interest and get replies.', icon: MessageSquare, color: 'dark' },
  { id: 'app-optimizer', label: 'App Optimizer', desc: 'Get a smarter application strategy: weekly targets, customization tips, follow-ups.', icon: BarChart3, color: 'yellow' },
  { id: 'ats-checker', label: 'ATS Score Checker', desc: 'Score your resume against any JD out of 100 with detailed breakdown.', icon: Zap, color: 'pink' },
  { id: 'recruiter-scan', label: '6-Second Scan', desc: 'Simulate what a recruiter sees in the first 6 seconds of reading your resume.', icon: Eye, color: '' },
  { id: 'truth-lock', label: 'Truth-Lock Tailor', desc: 'JD matching WITHOUT fabrication. Only rewrite lines with real evidence.', icon: Lock, color: 'lime' },
  { id: 'app-pack', label: 'Application Pack', desc: 'Generate tailored resume, cover letter, recruiter message, and follow-ups.', icon: Package, color: 'dark' },
  { id: 'company-tailor', label: 'Company Tailor', desc: 'Build a company-specific resume, cover letter, and prep checklist per role.', icon: Building2, color: 'yellow' },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div style={{ padding: '48px 0 32px', borderBottom: 'var(--border)', marginBottom: 48 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'var(--ink)', color: 'var(--paper)', padding: '6px 12px', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 24, boxShadow: '3px 3px 0 var(--yellow)' }}>
          <span style={{ width: 8, height: 8, background: 'var(--lime)', animation: 'blink 1.2s ease-in-out infinite', display: 'inline-block' }}></span>
          AI CAREER OS · LIVE · BY HACKKNOW
        </div>
        <h1 className="text-hero" style={{ marginBottom: 16 }}>
          RESUME<br /><span style={{ color: 'var(--pink)', background: 'var(--yellow)', padding: '0 8px', display: 'inline-block', transform: 'rotate(-1.5deg)', border: 'var(--border-thick)', boxShadow: '6px 6px 0 var(--ink)' }}>HACKKNOW</span>
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(18px, 2.2vw, 24px)', lineHeight: 1.35, fontWeight: 500, maxWidth: 720, marginBottom: 32, color: 'var(--ink-soft)' }}>
          Not a resume builder. The <strong style={{ background: 'var(--yellow)', padding: '0 4px' }}>AI hiring assistant</strong> that runs on your own keys — turning raw experience into <strong style={{ background: 'var(--yellow)', padding: '0 4px' }}>interview callbacks</strong>, ATS hits, and recruiter attention.
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ background: 'var(--card)', border: 'var(--border)', padding: '12px 16px', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink)' }}>12</strong>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-faint)', fontWeight: 700 }}>AI TOOLS</span>
          </div>
          <div style={{ background: 'var(--card)', border: 'var(--border)', padding: '12px 16px', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink)' }}>6</strong>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-faint)', fontWeight: 700 }}>FREE PROVIDERS</span>
          </div>
          <div style={{ background: 'var(--card)', border: 'var(--border)', padding: '12px 16px', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink)' }}>BYOK</strong>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-faint)', fontWeight: 700 }}>BRING YOUR KEY</span>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, paddingBottom: 16, borderBottom: '3px solid var(--ink)', flexWrap: 'wrap', gap: 16 }}>
        <div className="text-h1" style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, background: 'var(--pink)', color: 'var(--paper)', padding: '4px 8px' }}>TOOLS</span>
          The Toolkit
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--ink-faint)', fontWeight: 700 }}>
          Click any card · powered by your keys
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 48 }}>
        {FEATURES.map((f, i) => {
          const Icon = f.icon
          const target = f.id === 'ats-checker' ? '/ats-checker' : f.id === 'company-tailor' ? '/company-tailor' : `/tool/${f.id}`
          return (
            <Link
              key={f.id}
              to={target}
              className={`feature-card feature-card-${f.color}`}
              style={{ textDecoration: 'none', borderBottom: 'none', color: 'inherit' }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 12, opacity: 0.7 }}>
                {String(i + 1).padStart(2, '0')} / {f.label.toUpperCase()}
              </div>
              <div className="text-h2" style={{ marginBottom: 10 }}>
                <Icon size={20} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
                {f.label}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 14 }}>{f.desc}</div>
              <div style={{ display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '6px 10px', background: f.color === 'dark' ? 'var(--yellow)' : 'var(--ink)', color: f.color === 'dark' ? 'var(--ink)' : 'var(--paper)', border: '2px solid var(--ink)' }}>
                START ▸
              </div>
            </Link>
          )
        })}
      </div>

      {/* Manifesto */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, paddingBottom: 16, borderBottom: '3px solid var(--ink)', flexWrap: 'wrap', gap: 16 }}>
        <div className="text-h1" style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, background: 'var(--pink)', color: 'var(--paper)', padding: '4px 8px' }}>VISION</span>
          The Thesis
        </div>
      </div>
      <div className="panel panel-dark" style={{ padding: 32 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--yellow)', marginBottom: 16 }}>▸ MANIFESTO</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', textTransform: 'uppercase', lineHeight: 0.95, letterSpacing: '-0.025em', marginBottom: 18 }}>
          Job hunting<br />is broken.<br />
          <span style={{ background: 'var(--yellow)', color: 'var(--ink)', padding: '0 8px' }}>We fixed it.</span>
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.55, opacity: 0.85, marginBottom: 14, maxWidth: 780 }}>
          Every resume tool charges you. Every ATS scanner is a paywall. Every coach wants $99 to roast your CV. Meanwhile <strong style={{ background: 'var(--pink)', padding: '0 4px' }}>free AI is everywhere</strong> — Groq, Gemini, OpenRouter, Together, Mistral, Cohere — and nobody is composing it into a real career operating system.
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.55, opacity: 0.85, marginBottom: 14, maxWidth: 780 }}>
          Resume Hackknow is the answer. You bring the keys (60 seconds to grab a free Groq + Gemini key). We bring the orchestration, the prompts, the recruiter brain we trained inside the system. <strong style={{ background: 'var(--yellow)', color: 'var(--ink)', padding: '0 4px' }}>Zero rupees. Zero subscription.</strong> One brutalist interface that takes your career seriously.
        </p>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--yellow)', marginTop: 24, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
          ▸ "Free intelligence, infinite capability."
        </div>
      </div>
    </div>
  )
}
