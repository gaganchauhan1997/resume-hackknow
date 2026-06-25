import { useParams } from 'react-router'
import { useState } from 'react'
import { useBYOK } from '@/hooks/useBYOK'
import { aiCall, mdToHtml } from '@/providers/byok'
import { FileText, Target, Users, Pen, Mail, MessageSquare, BarChart3, Eye, Lock, Package } from 'lucide-react'

const TOOL_CONFIG: Record<string, {
  title: string;
  subtitle: string;
  num: string;
  icon: React.ComponentType<{ size?: number }>;
  inputs: { id: string; label: string; placeholder: string; rows?: number; required?: boolean }[];
  systemPrompt: string;
  userPromptTemplate: (inputs: Record<string, string>) => string;
  temperature: number;
  maxTokens: number;
}> = {
  'resume-fixer': {
    title: 'Resume Conversion Fixer',
    subtitle: 'Rewrite to maximize interview callbacks',
    num: '01',
    icon: FileText,
    inputs: [
      { id: 'resume', label: 'Your Resume', placeholder: 'Paste your full resume here. Plain text works best.', rows: 16, required: true },
      { id: 'role', label: 'Target Role (optional)', placeholder: 'e.g. AI Full Stack Developer at Series-B startup', rows: 1, required: false },
    ],
    systemPrompt: `You are Resume Hackknow — an elite resume engineer. Rewrite the user's resume to maximize interview callbacks.

Rules:
- Use strong action verbs (Architected, Engineered, Shipped, Reduced, Scaled, Automated, Designed, Led)
- Quantify results wherever possible (%, $, time saved, scale numbers)
- Use ATS-friendly formatting
- NEVER exaggerate or invent experience not present in the original
- Each bullet: one line, 18-26 words
- Bold the most important metrics using **text**

Output the full rewritten resume with clear section headers.`,
    userPromptTemplate: (inputs) => `TARGET ROLE: ${inputs.role || 'Not specified'}

RESUME TO REWRITE:
${inputs.resume}

Rewrite this resume now. Output the complete rewritten version.`,
    temperature: 0.7,
    maxTokens: 2500,
  },
  'jd-matcher': {
    title: 'Job Description Matcher',
    subtitle: 'Identify missing keywords and rewrite for match',
    num: '02',
    icon: Target,
    inputs: [
      { id: 'resume', label: 'Your Resume', placeholder: 'Paste your resume...', rows: 10, required: true },
      { id: 'jd', label: 'Job Description', placeholder: 'Paste the job description...', rows: 10, required: true },
    ],
    systemPrompt: `You are an expert ATS optimization engine. Compare the resume against the job description.

Output format:
## KEYWORD GAPS
List missing keywords and how to naturally inject them.

## REWRITTEN RESUME SECTIONS
Provide rewritten experience bullets that incorporate JD keywords naturally.

## MATCH SCORE
Estimate: BEFORE [%] → AFTER [%]

Be specific. No fluff. Use bold for key metrics.`,
    userPromptTemplate: (inputs) => `RESUME:\n${inputs.resume}\n\n---\n\nJOB DESCRIPTION:\n${inputs.jd}\n\nAnalyze and rewrite now.`,
    temperature: 0.5,
    maxTokens: 2500,
  },
  'role-finder': {
    title: 'Role Fit Finder',
    subtitle: '10 roles you might be overlooking',
    num: '03',
    icon: Users,
    inputs: [
      { id: 'experience', label: 'Your Experience & Skills', placeholder: 'Paste your resume or describe your experience, skills, and background...', rows: 14, required: true },
    ],
    systemPrompt: `You are a career strategist who knows the hidden job market. Based on the candidate's background, list 10 roles they are qualified for but might be overlooking.

For each role:
- Role title
- Why they qualify (2 sentences)
- Hiring demand: High / Medium / Low
- Response likelihood: High / Medium / Low
- 1 tip to position for this role

Rank by hiring demand × response likelihood. Be honest about gaps.`,
    userPromptTemplate: (inputs) => `MY BACKGROUND:\n${inputs.experience}\n\nList 10 roles I'm overlooking now.`,
    temperature: 0.7,
    maxTokens: 2000,
  },
  'bullet-upgrader': {
    title: 'Bullet Point Upgrader',
    subtitle: 'Make bullets clearer and more results-focused',
    num: '04',
    icon: Pen,
    inputs: [
      { id: 'bullets', label: 'Your Bullet Points', placeholder: 'Paste your resume bullet points, one per line:\n\n• Responsible for managing the team\n• Worked on customer analytics\n• Helped with product launches', rows: 12, required: true },
    ],
    systemPrompt: `You are a resume bullet optimization engine. Rewrite each bullet to be:
- Clearer and more results-focused
- Start with a strong action verb
- Include quantified impact where realistic
- Under 2 lines each
- Recruiter-impressive

Format: Original → Rewritten (with explanation of what changed)`,
    userPromptTemplate: (inputs) => `BULLETS TO UPGRADE:\n${inputs.bullets}\n\nUpgrade each bullet now.`,
    temperature: 0.8,
    maxTokens: 1500,
  },
  'cover-letter': {
    title: 'Cover Letter Personalizer',
    subtitle: 'Human, confident, specific — not generic',
    num: '05',
    icon: Mail,
    inputs: [
      { id: 'jd', label: 'Job Description', placeholder: 'Paste the job description...', rows: 10, required: true },
      { id: 'resume', label: 'Your Resume (optional)', placeholder: 'Paste your resume for personalization...', rows: 8, required: false },
    ],
    systemPrompt: `Write a short, tailored cover letter for the role. Make it sound human, confident, and specific — NOT generic or obviously AI-written.

Guidelines:
- Open with something specific about the company/role
- Show genuine enthusiasm, not corporate fluff
- Reference 1-2 specific experiences that match
- Keep it under 300 words
- End with a confident CTA`,
    userPromptTemplate: (inputs) => `JOB DESCRIPTION:\n${inputs.jd}\n\n${inputs.resume ? `MY BACKGROUND:\n${inputs.resume}\n\n` : ''}Write the cover letter now.`,
    temperature: 0.8,
    maxTokens: 800,
  },
  'recruiter-hook': {
    title: 'Recruiter Hook Message',
    subtitle: 'Spark interest and get a reply',
    num: '06',
    icon: MessageSquare,
    inputs: [
      { id: 'jd', label: 'Job Post / Role', placeholder: 'Paste the job post or describe the role you want to reach out about...', rows: 8, required: true },
      { id: 'background', label: 'Your 1-line Pitch', placeholder: 'e.g. "AI Full Stack dev with 5 years building ML-powered products"', rows: 1, required: false },
    ],
    systemPrompt: `Write a concise LinkedIn or email message to a recruiter for this role. The goal: spark interest and get a reply — NOT ask for a favor.

Rules:
- Under 150 words
- Lead with value, not a request
- Show you have read the JD
- Include a specific hook they can respond to
- Confident but not arrogant`,
    userPromptTemplate: (inputs) => `ROLE:\n${inputs.jd}\n\nMY BACKGROUND: ${inputs.background || 'See below'}\n\nWrite the recruiter message now.`,
    temperature: 0.8,
    maxTokens: 500,
  },
  'app-optimizer': {
    title: 'Application Optimizer',
    subtitle: 'Smarter application strategy',
    num: '07',
    icon: BarChart3,
    inputs: [
      { id: 'background', label: 'Your Background & Target Roles', placeholder: 'Describe your background and the types of roles you are targeting...', rows: 8, required: true },
      { id: 'goals', label: 'Your Goals (optional)', placeholder: 'e.g. "Want to switch to AI/ML roles within 3 months"', rows: 2, required: false },
    ],
    systemPrompt: `You are a job search strategist. Create a smarter application strategy based on the candidate's background and target roles.

Include:
## WEEKLY TARGETS
How many roles to apply for weekly

## CUSTOMIZATION STRATEGY
How to customize efficiently for each application

## FOLLOW-UP PLAN
When and how to follow up

## CHANNEL MIX
LinkedIn, referrals, direct apps, recruiter relationships

## TIMELINE
Week-by-week plan for first month`,
    userPromptTemplate: (inputs) => `BACKGROUND:\n${inputs.background}\n\n${inputs.goals ? `GOALS:\n${inputs.goals}\n\n` : ''}Create the strategy now.`,
    temperature: 0.7,
    maxTokens: 1500,
  },
  'recruiter-scan': {
    title: '6-Second Recruiter Scan',
    subtitle: 'What a recruiter sees in 6 seconds',
    num: '09',
    icon: Eye,
    inputs: [
      { id: 'resume', label: 'Your Resume', placeholder: 'Paste your resume...', rows: 16, required: true },
    ],
    systemPrompt: `You are a senior recruiter who scans 200+ resumes daily. Simulate what you see in the FIRST 6 SECONDS of looking at this resume.

Format:
## FIRST IMPRESSION
What hits immediately (good or bad)

## WHAT STANDS OUT
The 2-3 things that catch attention

## WHAT LOOKS RISKY
Red flags or concerns

## WHAT FEELS WEAK
Areas that need immediate improvement

## VERDICT
Pass / Maybe / Interview — with one-line reasoning

Be brutally honest.`,
    userPromptTemplate: (inputs) => `RESUME:\n${inputs.resume}\n\nGive me your 6-second scan.`,
    temperature: 0.6,
    maxTokens: 1000,
  },
  'truth-lock': {
    title: 'Truth-Lock Tailor',
    subtitle: 'JD matching WITHOUT fabrication',
    num: '10',
    icon: Lock,
    inputs: [
      { id: 'resume', label: 'Your Resume', placeholder: 'Paste your resume...', rows: 10, required: true },
      { id: 'jd', label: 'Job Description', placeholder: 'Paste the job description...', rows: 10, required: true },
    ],
    systemPrompt: `You are a truth-locked resume tailoring engine. You NEVER fabricate experience.

For each line in the resume:
- If it has real evidence that matches the JD → rewrite to emphasize the match
- If evidence is missing → TAG it with [NEEDS EVIDENCE: description of what's missing]
- NEVER invent companies, projects, skills, or metrics

Output:
## TAILORED RESUME (truth-locked)
## TAGGED GAPS (what needs real evidence)
## SUGGESTIONS (how to actually acquire the missing evidence)`,
    userPromptTemplate: (inputs) => `RESUME:\n${inputs.resume}\n\n---\n\nJOB DESCRIPTION:\n${inputs.jd}\n\nTailor with truth-lock. No fabrication.`,
    temperature: 0.4,
    maxTokens: 2500,
  },
  'app-pack': {
    title: 'Application Pack Generator',
    subtitle: 'Full kit: resume, cover letter, messages',
    num: '11',
    icon: Package,
    inputs: [
      { id: 'resume', label: 'Your Resume', placeholder: 'Paste your resume...', rows: 10, required: true },
      { id: 'jd', label: 'Job Description', placeholder: 'Paste the job description...', rows: 10, required: true },
    ],
    systemPrompt: `Generate a complete application pack for one target role.

Output:
## TAILORED RESUME
Company-specific rewritten resume

## COVER LETTER
Tailored, human, confident

## RECRUITER OUTREACH MESSAGE
LinkedIn/email message

## FOLLOW-UP MESSAGES
2-3 follow-up templates

## WHY YOU / WHY THIS COMPANY
Short script for interviews

Make each piece specific to the role and company.`,
    userPromptTemplate: (inputs) => `RESUME:\n${inputs.resume}\n\n---\n\nJOB DESCRIPTION:\n${inputs.jd}\n\nGenerate the full application pack now.`,
    temperature: 0.7,
    maxTokens: 3000,
  },
}

export default function ToolPage() {
  const { toolId } = useParams<{ toolId: string }>()
  const { keys, prefs } = useBYOK()
  const [inputs, setInputs] = useState<Record<string, string>>({})
  const [output, setOutput] = useState('')
  const [providerUsed, setProviderUsed] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const config = TOOL_CONFIG[toolId || '']
  if (!config) return <div>Tool not found</div>

  const handleRun = async () => {
    setLoading(true)
    setError('')
    setOutput('')

    const missing = config.inputs.filter(i => i.required && !inputs[i.id]?.trim())
    if (missing.length > 0) {
      setError(`Missing required fields: ${missing.map(i => i.label).join(', ')}`)
      setLoading(false)
      return
    }

    try {
      const { result, provider } = await aiCall(
        keys,
        prefs,
        [
          { role: 'system', content: config.systemPrompt },
          { role: 'user', content: config.userPromptTemplate(inputs) }
        ],
        { temperature: config.temperature, max_tokens: config.maxTokens }
      )
      setOutput(result)
      setProviderUsed(provider)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(output)
    } catch {}
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, paddingBottom: 16, borderBottom: '3px solid var(--ink)', flexWrap: 'wrap', gap: 16 }}>
        <div className="text-h1" style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, background: 'var(--pink)', color: 'var(--paper)', padding: '4px 8px' }}>{config.num}</span>
          <span>{config.title}</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--ink-faint)', fontWeight: 700 }}>
          {config.subtitle}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }} className="tool-grid">
        {/* Input Panel */}
        <div className="panel">
          <div className="text-label" style={{ marginBottom: 16, paddingBottom: 8, borderBottom: '2px solid currentColor', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>▸ INPUT</span>
            <span style={{ fontFamily: 'var(--font-mono)', background: 'var(--ink)', color: 'var(--paper)', padding: '2px 6px', fontSize: 10 }}>RAW</span>
          </div>

          {config.inputs.map(input => (
            <div key={input.id} style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6, color: 'var(--ink)' }}>
                {input.label}
                {input.required && <span style={{ color: 'var(--pink)', marginLeft: 4 }}>*</span>}
              </label>
              {input.rows && input.rows > 1 ? (
                <textarea
                  value={inputs[input.id] || ''}
                  onChange={e => setInputs(prev => ({ ...prev, [input.id]: e.target.value }))}
                  placeholder={input.placeholder}
                  rows={input.rows}
                  className="input-brutal textarea-brutal"
                />
              ) : (
                <input
                  type="text"
                  value={inputs[input.id] || ''}
                  onChange={e => setInputs(prev => ({ ...prev, [input.id]: e.target.value }))}
                  placeholder={input.placeholder}
                  className="input-brutal"
                />
              )}
            </div>
          ))}

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
            <button onClick={handleRun} disabled={loading} className="btn-brutal btn-primary">
              {loading ? (
                <span style={{ display: 'inline-flex', gap: 4 }}>
                  <span style={{ width: 8, height: 8, background: 'var(--ink)', animation: 'loadDot 1.4s ease-in-out infinite', display: 'inline-block' }} />
                  <span style={{ width: 8, height: 8, background: 'var(--ink)', animation: 'loadDot 1.4s ease-in-out infinite 0.2s', display: 'inline-block' }} />
                  <span style={{ width: 8, height: 8, background: 'var(--ink)', animation: 'loadDot 1.4s ease-in-out infinite 0.4s', display: 'inline-block' }} />
                </span>
              ) : (
                <>▸ RUN {config.title.toUpperCase()}</>
              )}
            </button>
            {output && (
              <>
                <button onClick={copyOutput} className="btn-brutal btn-ghost">⧉ COPY</button>
                <button onClick={() => window.print()} className="btn-brutal btn-ghost">↓ PDF</button>
              </>
            )}
          </div>
        </div>

        {/* Output Panel */}
        <div className="panel panel-dark">
          <div className="text-label" style={{ marginBottom: 16, paddingBottom: 8, borderBottom: '2px solid currentColor', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--paper)' }}>
            <span>▸ OUTPUT</span>
            <span style={{ fontFamily: 'var(--font-mono)', background: 'var(--yellow)', color: 'var(--ink)', padding: '2px 6px', fontSize: 10 }}>AI</span>
          </div>

          {error ? (
            <div style={{ border: '3px solid var(--pink)', background: 'rgba(255,46,99,0.08)', padding: 18 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--pink)', marginBottom: 10 }}>
                ERROR
              </div>
              <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.6, color: 'var(--paper)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{error}</pre>
            </div>
          ) : output ? (
            <div>
              {providerUsed && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--ink-faint)', marginBottom: 14, paddingBottom: 10, borderBottom: '1px dotted var(--paper)' }}>
                  ▸ Generated via {providerUsed}
                </div>
              )}
              <div
                style={{ minHeight: 240, background: 'var(--paper-warm)', border: '2px solid var(--ink)', padding: 18, fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.65, whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 720, overflowY: 'auto', color: 'var(--ink)' }}
                dangerouslySetInnerHTML={{ __html: mdToHtml(output) }}
              />
            </div>
          ) : (
            <div style={{ color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)', fontSize: 12, textAlign: 'center', padding: '40px 16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              ▸ Output will appear here
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .tool-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
