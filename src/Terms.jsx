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

export default function Terms() {
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
        <h1 className="lp-title">Terms &<br /><span style={{color:'var(--gold)'}}>Conditions</span></h1>
        <p className="lp-subtitle">Please read these terms carefully before using our services</p>
      </div>

      <div className="lp-body">
        <p className="lp-updated">Last updated: January 1, 2025</p>

        <div className="lp-section">
          <h2 className="lp-section-title">Acceptance of Terms</h2>
          <p className="lp-text">By registering as a member or using any service provided by Kirola Fitness, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.</p>
        </div>

        <div className="lp-section">
          <h2 className="lp-section-title">Membership</h2>
          <p className="lp-text">All memberships are personal and non-transferable. As a member, you agree to:</p>
          <ul className="lp-list">
            <li>Provide accurate and complete information during registration</li>
            <li>Keep your membership details confidential and not share access with others</li>
            <li>Notify us immediately of any changes to your contact information</li>
            <li>Pay membership fees on time as per your chosen plan</li>
          </ul>
        </div>

        <div className="lp-section">
          <h2 className="lp-section-title">Facility Rules & Conduct</h2>
          <p className="lp-text">All members and guests must adhere to the following rules while on Kirola Fitness premises:</p>
          <ul className="lp-list">
            <li>Treat all staff, trainers, and fellow members with respect at all times</li>
            <li>Use equipment responsibly and return weights and accessories after use</li>
            <li>Wear appropriate workout attire and closed-toe shoes at all times</li>
            <li>Do not use mobile phones or devices in a manner that disturbs others</li>
            <li>No smoking, alcohol, or illegal substances on the premises</li>
            <li>Follow all safety guidelines and instructions from staff and trainers</li>
          </ul>
          <p className="lp-text">Kirola Fitness reserves the right to suspend or terminate memberships for conduct that violates these rules without refund.</p>
        </div>

        <div className="lp-section">
          <h2 className="lp-section-title">Health & Safety</h2>
          <p className="lp-text">Members participate in all fitness activities at their own risk. You represent that you are in good physical health and have no medical conditions that would prevent you from safely engaging in exercise. We strongly recommend consulting a physician before starting any new fitness program.</p>
          <p className="lp-text">Kirola Fitness shall not be liable for any injury, illness, or loss arising from the use of our facilities, classes, or training services, except where caused by gross negligence.</p>
        </div>

        <div className="lp-section">
          <h2 className="lp-section-title">Class Bookings & Cancellations</h2>
          <ul className="lp-list">
            <li>Class bookings are subject to availability and must be made in advance</li>
            <li>Cancellations must be made at least 2 hours before a scheduled class</li>
            <li>Repeated no-shows may result in temporary suspension of booking privileges</li>
            <li>Kirola Fitness reserves the right to cancel or reschedule classes at any time</li>
          </ul>
        </div>

        <div className="lp-section">
          <h2 className="lp-section-title">Payments & Refunds</h2>
          <p className="lp-text">All membership fees are payable in advance. Fees are non-refundable except in the following cases:</p>
          <ul className="lp-list">
            <li>Serious medical condition preventing use, supported by a doctor's certificate</li>
            <li>Relocation more than 50 km from our facility</li>
            <li>Closure of the facility by Kirola Fitness</li>
          </ul>
          <p className="lp-text">Approved refunds will be processed within 7–10 business days.</p>
        </div>

        <div className="lp-section">
          <h2 className="lp-section-title">Intellectual Property</h2>
          <p className="lp-text">All content on this website — including logos, images, text, and training materials — is the property of Kirola Fitness and may not be reproduced, distributed, or used without prior written consent.</p>
        </div>

        <div className="lp-section">
          <h2 className="lp-section-title">Changes to Terms</h2>
          <p className="lp-text">Kirola Fitness reserves the right to update these Terms at any time. Continued use of our services following any changes constitutes your acceptance of the revised Terms.</p>
        </div>

        <div className="lp-section">
          <h2 className="lp-section-title">Contact</h2>
          <p className="lp-text">For questions about these Terms, please contact us:</p>
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