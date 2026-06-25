export default function BYOKSecurity() {
  return (
    <div className="panel" style={{ maxWidth: 800 }}>
      <div className="text-h1" style={{ marginBottom: 24 }}>BYOK Security</div>
      <div style={{ fontSize: 14, lineHeight: 1.7 }}>
        <p style={{ marginBottom: 16 }}>
          Resume Hackknow uses a <strong>Bring Your Own Key (BYOK)</strong> security model. This page explains how your API keys are handled and protected.
        </p>

        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8, marginTop: 24 }}>WHERE ARE KEYS STORED?</h3>
        <p style={{ marginBottom: 12 }}>
          Your API keys are stored <strong style={{ background: 'var(--yellow)', padding: '0 3px' }}>only in your browser's localStorage</strong> on your device. 
          They are never transmitted to Resume Hackknow servers, never logged, and never shared with any third party except the AI provider you configured them for.
        </p>

        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8, marginTop: 24 }}>WHO CAN ACCESS MY KEYS?</h3>
        <p style={{ marginBottom: 12 }}>
          Only you. Since keys are stored in your browser's localStorage, they are scoped to your device and browser profile. 
          Hackknow employees, administrators, or infrastructure cannot access them because they never reach our servers.
        </p>

        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8, marginTop: 24 }}>HOW ARE KEYS USED?</h3>
        <p style={{ marginBottom: 12 }}>
          When you run a tool, your browser makes API calls <strong>directly</strong> to the AI provider (e.g., Groq, Gemini) using your key. 
          The request goes from your browser → AI provider → response back to your browser. Resume Hacknow servers are not involved in the AI call.
        </p>

        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8, marginTop: 24 }}>KEY DELETION POLICY</h3>
        <p style={{ marginBottom: 12 }}>
          You can delete your keys at any time from the API Keys page. Deleting a key removes it from your browser's localStorage immediately. 
          Clearing your browser data will also remove all stored keys.
        </p>

        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8, marginTop: 24 }}>SECURITY BEST PRACTICES</h3>
        <ul style={{ marginLeft: 20, marginBottom: 12 }}>
          <li>Use free-tier keys dedicated to Resume Hacknow</li>
          <li>Never share your API keys with anyone</li>
          <li>Rotate your keys periodically</li>
          <li>Use multiple providers for fallback protection</li>
          <li>Report any suspected key compromise immediately</li>
        </ul>

        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8, marginTop: 24 }}>CONSENT</h3>
        <p style={{ marginBottom: 12 }}>
          By using Resume Hacknow, you consent to the BYOK security model described above. You understand that you are responsible 
          for the security of your own API keys and the AI provider accounts they belong to.
        </p>
      </div>
    </div>
  )
}
