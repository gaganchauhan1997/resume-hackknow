import { Outlet, Link, useLocation } from 'react-router'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useBYOK } from '@/hooks/useBYOK'
import TourGuide from './TourGuide'
import { Menu, X, Key, Zap, FileText, Target, Users, Pen, Mail, MessageSquare, BarChart3, Eye, Lock, Package, Building2, LayoutTemplate, CreditCard } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'resume-fixer', label: 'Resume Fixer', icon: FileText, desc: 'Rewrite for callbacks' },
  { id: 'jd-matcher', label: 'JD Matcher', icon: Target, desc: 'Keyword gap + rewrite' },
  { id: 'role-finder', label: 'Role Finder', icon: Users, desc: '10 overlooked roles' },
  { id: 'bullet-upgrader', label: 'Bullet Upgrader', icon: Pen, desc: 'Results-focused bullets' },
  { id: 'cover-letter', label: 'Cover Letter', icon: Mail, desc: 'Tailored cover letters' },
  { id: 'recruiter-hook', label: 'Recruiter Hook', icon: MessageSquare, desc: 'LinkedIn outreach' },
  { id: 'app-optimizer', label: 'App Optimizer', icon: BarChart3, desc: 'Application strategy' },
  { id: 'ats-checker', label: 'ATS Checker', icon: Zap, desc: 'JD vs resume score', path: '/ats-checker' },
  { id: 'recruiter-scan', label: '6-Second Scan', icon: Eye, desc: 'Recruiter first impression' },
  { id: 'truth-lock', label: 'Truth-Lock', icon: Lock, desc: 'No-fabrication tailor' },
  { id: 'app-pack', label: 'App Pack', icon: Package, desc: 'Full application kit' },
  { id: 'company-tailor', label: 'Company Tailor', icon: Building2, desc: 'Per-company tailoring', path: '/company-tailor' },
]

export default function Layout() {
  const location = useLocation()
  const { user, logout, isLoading } = useAuth()
  const { activeKeyCount } = useBYOK()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tourActive, setTourActive] = useState(false)

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const isActive = (id: string, path?: string) => {
    if (path) return location.pathname === path
    return location.pathname === `/tool/${id}`
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      {/* Nav Bar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--paper)', borderBottom: 'var(--border)', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden"
          style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--yellow)', border: 'var(--border)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer', fontSize: 18, fontWeight: 900 }}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--font-display)', fontSize: 18, textTransform: 'uppercase', letterSpacing: '0.02em', borderBottom: 'none' }}>
          <div style={{ width: 36, height: 36, background: 'var(--yellow)', border: 'var(--border-thick)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, boxShadow: '3px 3px 0 var(--ink)' }}>R</div>
          <span>RESUME</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, background: 'var(--ink)', color: 'var(--paper)', padding: '2px 6px', letterSpacing: '0.1em' }}>HACKKNOW</span>
        </Link>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link to="/templates" style={{ borderBottom: 'none', display: 'flex', alignItems: 'center', gap: 6 }} className="hidden sm:flex">
            <LayoutTemplate size={16} />
            <span className="text-label" style={{ fontSize: 10 }}>Templates</span>
          </Link>
          <Link to="/pricing" style={{ borderBottom: 'none', display: 'flex', alignItems: 'center', gap: 6 }} className="hidden sm:flex">
            <CreditCard size={16} />
            <span className="text-label" style={{ fontSize: 10 }}>Pricing</span>
          </Link>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', padding: '6px 10px', border: 'var(--border-thin)', background: 'var(--card)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, background: activeKeyCount > 0 ? 'var(--lime)' : 'var(--ink-faint)', display: 'inline-block', boxShadow: activeKeyCount > 0 ? '0 0 0 2px var(--ink)' : 'none' }}></span>
            {activeKeyCount > 0 ? `${activeKeyCount} KEY${activeKeyCount > 1 ? 'S' : ''}` : 'NO KEYS'}
          </div>

          <Link to="/keys" style={{ background: 'var(--pink)', color: 'var(--paper)', border: 'var(--border)', padding: '8px 14px', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', boxShadow: 'var(--shadow-sm)', transition: 'all 0.1s', borderBottom: 'none' }} className="hidden sm:inline-flex">
            <Key size={14} style={{ marginRight: 6 }} /> KEYS
          </Link>

          {!isLoading && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700 }}>{user.name?.split(' ')[0] || 'User'}</span>
              <button onClick={logout} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: '4px 8px', border: 'var(--border-thin)', background: 'transparent', cursor: 'pointer' }}>Logout</button>
            </div>
          ) : (
            <Link to="/login" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '8px 12px', border: 'var(--border-thin)', background: 'var(--ink)', color: 'var(--paper)', borderBottom: 'none' }}>
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile sidebar overlay */}
      <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.6)', zIndex: 240, display: sidebarOpen ? 'block' : 'none' }} />

      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {/* Sidebar */}
        <aside style={{
          flex: '0 0 260px',
          width: 260,
          position: 'sticky',
          top: 0,
          alignSelf: 'flex-start',
          height: 'calc(100vh - 0px)',
          overflowY: 'auto',
          background: 'var(--paper)',
          borderRight: 'var(--border)',
          zIndex: 90,
          transition: 'transform 0.25s ease',
        }} className={`fixed lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:block`}
        >
          <div style={{ padding: '20px 14px 40px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-faint)', padding: '0 6px 12px', marginBottom: 8, borderBottom: '2px solid var(--ink)' }}>
              AI TOOLS
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
              {NAV_ITEMS.map(item => {
                const Icon = item.icon
                const active = isActive(item.id, item.path)
                const target = item.path || `/tool/${item.id}`
                return (
                  <Link
                    key={item.id}
                    to={target}
                    onClick={() => setSidebarOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      width: '100%',
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      padding: '12px 12px',
                      border: '2px solid transparent',
                      background: active ? 'var(--ink)' : 'transparent',
                      color: active ? 'var(--paper)' : 'var(--ink)',
                      cursor: 'pointer',
                      transition: 'transform 0.1s, box-shadow 0.1s, background 0.1s',
                      textDecoration: 'none',
                      borderBottom: 'none',
                      boxShadow: active ? '4px 4px 0 var(--pink)' : 'none',
                    }}
                    onMouseEnter={e => {
                      if (!active) {
                        e.currentTarget.style.background = 'var(--yellow)'
                        e.currentTarget.style.borderColor = 'var(--ink)'
                        e.currentTarget.style.transform = 'translate(-2px, -2px)'
                        e.currentTarget.style.boxShadow = '3px 3px 0 var(--ink)'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.borderColor = 'transparent'
                        e.currentTarget.style.transform = 'none'
                        e.currentTarget.style.boxShadow = 'none'
                      }
                    }}
                  >
                    <span style={{ color: active ? 'var(--yellow)' : 'var(--pink)', fontWeight: 900 }}>▸</span>
                    <Icon size={16} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span>{item.label}</span>
                      <span style={{ fontSize: 9, opacity: 0.6, fontWeight: 500, letterSpacing: '0.04em' }}>{item.desc}</span>
                    </div>
                  </Link>
                )
              })}
            </nav>
            <div style={{ margin: '20px 6px 0', paddingTop: 14, borderTop: '2px dashed var(--ink)', fontFamily: 'var(--font-mono)', fontSize: 10, lineHeight: 1.6, letterSpacing: '0.04em', color: 'var(--ink-faint)' }}>
              "Free intelligence,<br />infinite capability."<br />— Hackknow
            </div>

            {/* Tour trigger */}
            <button
              onClick={() => setTourActive(true)}
              style={{ margin: '16px 6px 0', width: 'calc(100% - 12px)', padding: '10px', background: 'var(--yellow)', border: 'var(--border)', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
            >
              Start Tour
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: '1 1 auto', minWidth: 0, maxWidth: 1180, margin: '0 auto', padding: '24px 32px', animation: 'pageIn 0.25s ease' }}>
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer style={{ marginTop: 80, padding: '32px', borderTop: 'var(--border-thick)', background: 'var(--ink)', color: 'var(--paper)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, textTransform: 'uppercase' }}>
            RESUME <span style={{ color: 'var(--yellow)' }}>HACKKNOW</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7 }}>
            BYOK AI Career OS · Part of the Hackknow ecosystem
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <Link to="/terms" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--paper)', borderBottom: '1px solid var(--paper)' }}>Terms</Link>
            <Link to="/privacy" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--paper)', borderBottom: '1px solid var(--paper)' }}>Privacy</Link>
            <Link to="/byok-security" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--paper)', borderBottom: '1px solid var(--paper)' }}>BYOK Security</Link>
            <Link to="/cookies" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--paper)', borderBottom: '1px solid var(--paper)' }}>Cookies</Link>
          </div>
        </div>
      </footer>

      {/* Tour */}
      {tourActive && <TourGuide onClose={() => setTourActive(false)} />}
    </div>
  )
}
