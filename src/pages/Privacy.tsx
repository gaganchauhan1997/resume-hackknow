export default function Privacy() {
  return (
    <div className="panel" style={{ maxWidth: 800 }}>
      <div className="text-h1" style={{ marginBottom: 24 }}>Privacy Policy</div>
      <div style={{ fontSize: 14, lineHeight: 1.7 }}>
        <p style={{ marginBottom: 16 }}><strong>Last updated: June 2026</strong></p>

        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8, marginTop: 24 }}>1. INFORMATION WE COLLECT</h3>
        <p style={{ marginBottom: 12 }}>We collect minimal data: your account information (name, email) for authentication, and usage analytics to improve the Service. We do NOT store your API keys — they remain in your browser's localStorage only.</p>

        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8, marginTop: 24 }}>2. HOW WE USE INFORMATION</h3>
        <p style={{ marginBottom: 12 }}>Account data is used for authentication and service provision. Resume content you choose to save is stored in our database. You can delete your data at any time from your account settings.</p>

        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8, marginTop: 24 }}>3. DATA SECURITY</h3>
        <p style={{ marginBottom: 12 }}>API keys are NEVER sent to our servers. They are stored locally in your browser. We use industry-standard encryption for data in transit and at rest. See our BYOK Security page for detailed security information.</p>

        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8, marginTop: 24 }}>4. THIRD-PARTY SERVICES</h3>
        <p style={{ marginBottom: 12 }}>We use Supabase for authentication and database services. AI processing is done directly between your browser and the AI providers you configure (Groq, Gemini, etc.).</p>

        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8, marginTop: 24 }}>5. YOUR RIGHTS</h3>
        <p style={{ marginBottom: 12 }}>You have the right to access, correct, and delete your personal data. Contact us at privacy@hackknow.com for data-related requests.</p>

        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8, marginTop: 24 }}>6. COOKIES</h3>
        <p style={{ marginBottom: 12 }}>We use essential cookies for authentication and session management. See our Cookie Policy for details.</p>
      </div>
    </div>
  )
}
