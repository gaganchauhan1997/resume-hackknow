export default function Cookies() {
  return (
    <div className="panel" style={{ maxWidth: 800 }}>
      <div className="text-h1" style={{ marginBottom: 24 }}>Cookie Policy</div>
      <div style={{ fontSize: 14, lineHeight: 1.7 }}>
        <p style={{ marginBottom: 16 }}><strong>Last updated: June 2026</strong></p>

        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8, marginTop: 24 }}>WHAT ARE COOKIES?</h3>
        <p style={{ marginBottom: 12 }}>Cookies are small text files stored on your device by websites you visit. They are widely used to make websites work efficiently and provide information to site owners.</p>

        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8, marginTop: 24 }}>HOW WE USE COOKIES</h3>
        <p style={{ marginBottom: 12 }}>Resume Hackknow uses only essential cookies necessary for the operation of the Service:</p>
        <ul style={{ marginLeft: 20, marginBottom: 12 }}>
          <li><strong>Authentication cookies</strong> — to keep you logged in</li>
          <li><strong>Session cookies</strong> — to maintain your session state</li>
          <li><strong>Preference cookies</strong> — to remember your settings (dark mode, sidebar state)</li>
        </ul>

        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8, marginTop: 24 }}>THIRD-PARTY COOKIES</h3>
        <p style={{ marginBottom: 12 }}>We do not use third-party tracking cookies. We use Supabase for authentication, which may set cookies required for session management.</p>

        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8, marginTop: 24 }}>MANAGING COOKIES</h3>
        <p style={{ marginBottom: 12 }}>You can control and delete cookies through your browser settings. Note that disabling essential cookies may affect the functionality of the Service.</p>

        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8, marginTop: 24 }}>CONTACT</h3>
        <p style={{ marginBottom: 12 }}>If you have questions about our Cookie Policy, contact us at privacy@hackknow.com.</p>
      </div>
    </div>
  )
}
