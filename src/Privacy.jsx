import { useNavigate } from 'react-router-dom'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600&family=Barlow+Condensed:wght@400;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root { --dark: #0a0d1a; --darker: #060810; --gold: #c9a84c; --white: #ffffff; --muted: #8a9ab5; }
  body { background: var(--dark); color: var(--white); font-family: 'Barlow', sans-serif; overflow-x: hidden; }

  .lp-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 18px 80px; display: flex; align-items: center; justify-content: space-between; background: rgba(6,8,16,0.95); border-bottom: 1px solid rgba(255,255,255,0.06); backdrop-filter: blur(12px); }
  .lp-nav-logo { font-family: 'Bebas Neue', cursive; font-size: 22px; letter-spacing: 3px; color: var(--gold); cursor: pointer; }
  .lp-nav-back { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 3px; font-weight: 700; text-transform: uppercase; color: var(--muted); cursor: pointer; transition: color 0.2s; background: none; border: none; padding: 0; }
  .lp-nav-back:hover { color: var(--gold); }

  .lp-hero { padding: 140px 80px 64px; background: var(--darker); border-bottom: 1px solid rgba(255,255,255,0.06); }
  .lp-eyebrow { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 5px; font-weight: 700; text-transform: uppercase; color: var(--gold); margin-bottom: 16px; }
  .lp-title { font-family: 'Bebas Neue', cursive; font-size: clamp(48px, 7vw, 88px); line-height: 0.95; letter-spacing: 2px; color: var(--white); margin-bottom: 20px; }
  .lp-subtitle { font-family: 'Barlow Condensed', sans-serif; font-size: 14px; letter-spacing: 2px; color: var(--muted); }

  .lp-body { max-width: 800px; margin: 0 auto; padding: 72px 80px 100px; }
  .lp-section { margin-bottom: 48px; }
  .lp-section-title { font-family: 'Bebas Neue', cursive; font-size: 28px; letter-spacing: 1px; color: var(--gold); margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid rgba(201,168,76,0.15); }
  .lp-text { font-size: 14px; line-height: 1.85; color: rgba(255,255,255,0.65); margin-bottom: 14px; }
  .lp-list { padding-left: 0; list-style: none; margin-bottom: 14px; }
  .lp-list li { font-size: 14px; line-height: 1.85; color: rgba(255,255,255,0.65); padding: 6px 0 6px 20px; position: relative; }
  .lp-list li::before { content: '—'; position: absolute; left: 0; color: var(--gold); font-size: 12px; }
  .lp-updated { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.2); margin-bottom: 56px; }

  .footer { background: var(--darker); padding: 36px 80px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.07); flex-wrap: wrap; gap: 16px; }
  .footer-copy { font-family: 'Barlow Condensed', sans-serif; font-size: 12px; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; }
  .footer-links { display: flex; gap: 24px; list-style: none; flex-wrap: wrap; }
  .footer-links a { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 3px; color: var(--muted); text-decoration: none; text-transform: uppercase; transition: color 0.2s; cursor: pointer; }
  .footer-links a:hover { color: var(--gold); }

  @media (max-width: 768px) {
    .lp-nav { padding: 16px 20px; }
    .lp-hero { padding: 110px 20px 48px; }
    .lp-body { padding: 48px 20px 72px; }
    .footer { padding: 28px 20px; flex-direction: column; align-items: flex-start; }
  }
`

export default function Privacy() {
  const navigate = useNavigate()
  return (
    <>
      <style>{styles}</style>

      <nav className="lp-nav">
        <span className="lp-nav-logo" onClick={() => navigate('/')}>KIROLA FITNESS</span>
        <button className="lp-nav-back" onClick={() => navigate(-1)}>← Back</button>
      </nav>

      <div className="lp-hero">
        <p className="lp-eyebrow">Legal</p>
        <h1 className="lp-title">Privacy<br /><span style={{color:'var(--gold)'}}>Policy</span></h1>
        <p className="lp-subtitle">How we collect, use, and protect your information</p>
      </div>

      <div className="lp-body">
        <p className="lp-updated">Last updated: January 1, 2025</p>

        <div className="lp-section">
          <h2 className="lp-section-title">Information We Collect</h2>
          <p className="lp-text">When you register as a member, book a class, or contact us, we may collect the following personal information:</p>
          <ul className="lp-list">
            <li>Full name and contact details (email address, phone number)</li>
            <li>Health and fitness information relevant to your training program</li>
            <li>Payment and billing information processed securely through our payment provider</li>
            <li>Usage data when you interact with our website or booking systems</li>
          </ul>
        </div>

        <div className="lp-section">
          <h2 className="lp-section-title">How We Use Your Information</h2>
          <p className="lp-text">We use your personal information solely to provide and improve our services:</p>
          <ul className="lp-list">
            <li>To process your membership registration and class bookings</li>
            <li>To send you important updates about your membership, classes, or events</li>
            <li>To tailor training programs and recommendations to your fitness goals</li>
            <li>To comply with legal obligations and resolve disputes</li>
          </ul>
          <p className="lp-text">We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>
        </div>

        <div className="lp-section">
          <h2 className="lp-section-title">Data Security</h2>
          <p className="lp-text">We take reasonable technical and organizational measures to protect your personal information against unauthorized access, loss, or misuse. All data is stored securely and access is restricted to authorized personnel only.</p>
          <p className="lp-text">However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
        </div>

        <div className="lp-section">
          <h2 className="lp-section-title">Cookies</h2>
          <p className="lp-text">Our website may use cookies and similar technologies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can control cookie settings through your browser at any time.</p>
        </div>

        <div className="lp-section">
          <h2 className="lp-section-title">Your Rights</h2>
          <p className="lp-text">You have the right to access, correct, or request deletion of your personal data at any time. To exercise these rights, please contact us at the details below.</p>
        </div>

        <div className="lp-section">
          <h2 className="lp-section-title">Contact Us</h2>
          <p className="lp-text">For any privacy-related queries or concerns, reach out to us at:</p>
          <ul className="lp-list">
            <li>Kirola Fitness, Jahajgarh, Sector 58, Gurugram, Haryana</li>
            <li>Email: info@kirolafitness.com</li>
            <li>Phone: +91 98765 43210</li>
          </ul>
        </div>
      </div>

      <footer className="footer">
        <p className="footer-copy">© 2025 Kirola Fitness — All Rights Reserved</p>
        <ul className="footer-links">
          <li><a onClick={() => navigate('/privacy')}>Privacy</a></li>
          <li><a onClick={() => navigate('/terms')}>Terms</a></li>
          <li><a onClick={() => navigate('/contact')}>Contact</a></li>
        </ul>
      </footer>
    </>
  )
} 