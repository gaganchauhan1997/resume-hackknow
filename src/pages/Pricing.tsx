import { Check, X, Zap } from 'lucide-react'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    period: 'forever',
    color: '',
    features: [
      { text: 'ATS Score Checker', included: true },
      { text: 'Basic JD Matcher', included: true },
      { text: 'Bullet Point Upgrader', included: true },
      { text: 'Basic Recruiter Hook', included: true },
      { text: '1 PDF template', included: true },
      { text: '5-10 runs/day', included: true },
      { text: 'Resume Fixer', included: false },
      { text: 'Cover Letter', included: false },
      { text: 'Company Tailor', included: false },
      { text: 'Application Pack', included: false },
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '₹99',
    period: '/month',
    color: 'yellow',
    popular: false,
    features: [
      { text: 'Everything in Free', included: true },
      { text: 'Resume Fixer', included: true },
      { text: 'Cover Letter Personalizer', included: true },
      { text: 'Application Optimizer (basic)', included: true },
      { text: '5 resume drafts', included: true },
      { text: '30-50 runs/month', included: true },
      { text: 'Role Fit Finder', included: false },
      { text: '6-Second Scan', included: false },
      { text: 'Company Tailor', included: false },
      { text: 'Truth-Lock Tailor', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹299',
    period: '/month',
    color: 'lime',
    popular: true,
    features: [
      { text: 'Everything in Starter', included: true },
      { text: 'Full JD Matcher', included: true },
      { text: 'Role Fit Finder', included: true },
      { text: '6-Second Recruiter Scan', included: true },
      { text: 'Truth-Lock Tailor', included: true },
      { text: 'Application Pack Generator', included: true },
      { text: 'Company-Specific Tailor', included: true },
      { text: '20-50 saved resumes', included: true },
      { text: '150-300 runs/month', included: true },
      { text: 'Priority support', included: true },
    ],
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: '₹999',
    period: 'one-time',
    color: 'pink',
    popular: false,
    features: [
      { text: 'All Pro features', included: true },
      { text: 'BYOK forever', included: true },
      { text: 'Generous monthly limits', included: true },
      { text: 'Priority access to new tools', included: true },
      { text: 'Early bird pricing', included: true },
      { text: 'Lifetime updates', included: true },
      { text: 'Community access', included: true },
      { text: 'No recurring fees', included: true },
      { text: 'Full export suite', included: true },
      { text: 'Best value', included: true },
    ],
  },
]

export default function Pricing() {
  return (
    <div>
      <div style={{ padding: '32px 0', borderBottom: 'var(--border)', marginBottom: 40, textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'var(--ink)', color: 'var(--paper)', padding: '6px 12px', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 20 }}>
          <Zap size={14} /> PRICING
        </div>
        <h1 className="text-hero" style={{ marginBottom: 12 }}>
          Simple <span style={{ color: 'var(--pink)', background: 'var(--yellow)', padding: '0 8px', display: 'inline-block', border: 'var(--border-thick)', boxShadow: '6px 6px 0 var(--ink)' }}>Pricing</span>
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-faint)', maxWidth: 520, margin: '0 auto' }}>
          BYOK means we don't pay for your AI usage. Pass those savings to you.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
        {PLANS.map(plan => (
          <div
            key={plan.id}
            className={`panel panel-${plan.color}`}
            style={{
              position: 'relative',
              ...(plan.popular ? { border: '4px solid var(--ink)', boxShadow: 'var(--shadow-lg)' } : {}),
            }}
          >
            {plan.popular && (
              <div style={{ position: 'absolute', top: -12, right: 12, background: 'var(--ink)', color: 'var(--yellow)', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 10px', border: 'var(--border)' }}>
                MOST POPULAR
              </div>
            )}
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, textTransform: 'uppercase', marginBottom: 8 }}>{plan.name}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 20 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 42, letterSpacing: '-0.03em' }}>{plan.price}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.6 }}>{plan.period}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {plan.features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, opacity: f.included ? 1 : 0.4 }}>
                  {f.included ? <Check size={14} style={{ color: 'var(--lime)', flexShrink: 0 }} /> : <X size={14} style={{ color: 'var(--ink-faint)', flexShrink: 0 }} />}
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
            <button
              className={`btn-brutal ${plan.id === 'free' ? 'btn-ghost' : plan.color === 'pink' ? 'btn-pink' : plan.color === 'lime' ? 'btn-lime' : 'btn-primary'}`}
              style={{ width: '100%', marginTop: 20, justifyContent: 'center' }}
            >
              {plan.id === 'free' ? 'CURRENT PLAN' : plan.id === 'lifetime' ? 'GRAB LIFETIME' : `GET ${plan.name.toUpperCase()}`}
            </button>
          </div>
        ))}
      </div>

      <div className="panel" style={{ marginTop: 40, textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--ink-faint)', marginBottom: 12 }}>
          ▸ WHY SO AFFORDABLE?
        </div>
        <p style={{ fontSize: 16, lineHeight: 1.6, maxWidth: 640, margin: '0 auto' }}>
          Because you bring your own API keys. We don't pay for AI inference — you do, directly to the providers (often for free). 
          We charge for the orchestration, the prompts, the templates, and the features. That's why we can be 
          <strong style={{ background: 'var(--yellow)', padding: '0 4px' }}> 10x cheaper </strong> 
          than typical resume tools.
        </p>
      </div>
    </div>
  )
}
