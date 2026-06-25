export default function Terms() {
  return (
    <div className="panel" style={{ maxWidth: 800 }}>
      <div className="text-h1" style={{ marginBottom: 24 }}>Terms of Service</div>
      <div style={{ fontSize: 14, lineHeight: 1.7 }}>
        <p style={{ marginBottom: 16 }}><strong>Last updated: June 2026</strong></p>

        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8, marginTop: 24 }}>1. ACCEPTANCE OF TERMS</h3>
        <p style={{ marginBottom: 12 }}>By accessing and using Resume Hackknow ("the Service"), you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.</p>

        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8, marginTop: 24 }}>2. BYOK MODEL</h3>
        <p style={{ marginBottom: 12 }}>Resume Hacknow operates on a Bring Your Own Key (BYOK) model. You are responsible for obtaining and maintaining your own API keys from third-party AI providers (Groq, Gemini, OpenRouter, Together, Mistral, Cohere). We do not provide AI inference services directly.</p>

        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8, marginTop: 24 }}>3. ACCEPTABLE USE</h3>
        <p style={{ marginBottom: 12 }}>You agree not to use the Service for any unlawful purpose or in any way that could damage, disable, and impair the Service. You are solely responsible for the content you submit (resumes, job descriptions) and the outputs you generate.</p>

        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8, marginTop: 24 }}>4. NO WARRANTY</h3>
        <p style={{ marginBottom: 12 }}>The Service is provided "as is" without warranties of any kind. AI-generated content may contain errors or inaccuracies. Always review and verify outputs before using them in job applications.</p>

        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8, marginTop: 24 }}>5. LIMITATION OF LIABILITY</h3>
        <p style={{ marginBottom: 12 }}>To the maximum extent permitted by law, Hackknow shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.</p>

        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8, marginTop: 24 }}>6. CHANGES TO TERMS</h3>
        <p style={{ marginBottom: 12 }}>We may update these terms at any time. Continued use of the Service after changes constitutes acceptance of the updated terms.</p>
      </div>
    </div>
  )
}
