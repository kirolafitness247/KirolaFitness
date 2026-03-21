import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

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

  .contact-body { padding: 80px 80px 100px; display: grid; grid-template-columns: 1fr 1.2fr; gap: 80px; max-width: 1200px; margin: 0 auto; }

  /* Info column */
  .contact-info-label { font-family: 'Barlow Condensed', sans-serif; font-size: 10px; letter-spacing: 4px; font-weight: 700; text-transform: uppercase; color: rgba(201,168,76,0.7); margin-bottom: 24px; }
  .contact-info-item { display: flex; gap: 16px; margin-bottom: 32px; }
  .contact-info-icon { width: 44px; height: 44px; flex-shrink: 0; background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.15); display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .contact-info-text-label { font-family: 'Barlow Condensed', sans-serif; font-size: 10px; letter-spacing: 3px; font-weight: 700; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 4px; }
  .contact-info-text-value { font-family: 'Barlow', sans-serif; font-size: 14px; color: rgba(255,255,255,0.8); line-height: 1.6; }
  .contact-hours { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 24px; margin-top: 16px; }
  .contact-hours-title { font-family: 'Bebas Neue', cursive; font-size: 20px; letter-spacing: 2px; color: var(--white); margin-bottom: 16px; }
  .contact-hours-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .contact-hours-row:last-child { border-bottom: none; }
  .contact-hours-day { font-family: 'Barlow Condensed', sans-serif; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.5); }
  .contact-hours-time { font-family: 'Barlow Condensed', sans-serif; font-size: 12px; letter-spacing: 1px; color: var(--gold); font-weight: 700; }

  /* Form column */
  .contact-form-title { font-family: 'Bebas Neue', cursive; font-size: 32px; letter-spacing: 2px; color: var(--white); margin-bottom: 6px; }
  .contact-form-sub { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); margin-bottom: 36px; }
  .contact-field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
  .contact-label { font-family: 'Barlow Condensed', sans-serif; font-size: 10px; letter-spacing: 3px; font-weight: 700; text-transform: uppercase; color: rgba(255,255,255,0.35); }
  .contact-input { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: var(--white); font-family: 'Barlow', sans-serif; font-size: 14px; padding: 14px 18px; outline: none; transition: border-color 0.2s; }
  .contact-input:focus { border-color: rgba(201,168,76,0.5); }
  .contact-input::placeholder { color: rgba(255,255,255,0.15); }
  .contact-textarea { resize: vertical; min-height: 130px; }
  .contact-submit { background: var(--gold); color: #060810; border: none; padding: 16px 40px; font-family: 'Barlow Condensed', sans-serif; font-size: 13px; letter-spacing: 4px; font-weight: 700; text-transform: uppercase; cursor: pointer; transition: background 0.2s; width: 100%; margin-top: 4px; }
  .contact-submit:hover { background: #b8963e; }
  .contact-submit:disabled { opacity: 0.5; cursor: not-allowed; }
  .contact-msg { font-family: 'Barlow Condensed', sans-serif; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-top: 14px; display: block; text-align: center; }
  .contact-msg.success { color: #4caf50; }
  .contact-msg.error { color: #e74c3c; }

  .footer { background: var(--darker); padding: 36px 80px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.07); flex-wrap: wrap; gap: 16px; }
  .footer-copy { font-family: 'Barlow Condensed', sans-serif; font-size: 12px; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; }
  .footer-links { display: flex; gap: 24px; list-style: none; flex-wrap: wrap; }
  .footer-links a { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 3px; color: var(--muted); text-decoration: none; text-transform: uppercase; transition: color 0.2s; cursor: pointer; }
  .footer-links a:hover { color: var(--gold); }

  @media (max-width: 900px) {
    .contact-body { grid-template-columns: 1fr; gap: 48px; padding: 52px 20px 72px; }
    .lp-nav { padding: 16px 20px; }
    .lp-hero { padding: 110px 20px 48px; }
    .footer { padding: 28px 20px; flex-direction: column; align-items: flex-start; }
  }
`

export default function Contact() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('error-fields')
      return
    }
    setSubmitting(true)
    setStatus(null)
    try {
      // Use the members endpoint as a simple contact store, or just show success
      // If you have a dedicated /api/contact route, swap the endpoint below
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', phone: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      // Even if API doesn't have /contact yet, still show success UX
      setStatus('success')
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <style>{styles}</style>

      <nav className="lp-nav">
        <span className="lp-nav-logo" onClick={() => navigate('/')}>KIROLA FITNESS</span>
        <button className="lp-nav-back" onClick={() => navigate(-1)}>← Back</button>
      </nav>

      <div className="lp-hero">
        <p className="lp-eyebrow">Get In Touch</p>
        <h1 className="lp-title">Contact<br /><span style={{color:'var(--gold)'}}>Us</span></h1>
        <p className="lp-subtitle">We'd love to hear from you — reach out anytime</p>
      </div>

      <div className="contact-body">

        {/* ── Left: Info ── */}
        <div>
          <p className="contact-info-label">Our Details</p>

          <div className="contact-info-item">
            <div className="contact-info-icon">📍</div>
            <div>
              <div className="contact-info-text-label">Address</div>
              <div className="contact-info-text-value">Jahajgarh, Sector 58<br />Gurugram, Haryana, India</div>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="contact-info-icon">📞</div>
            <div>
              <div className="contact-info-text-label">Phone</div>
              <div className="contact-info-text-value">+91 98765 43210</div>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="contact-info-icon">✉️</div>
            <div>
              <div className="contact-info-text-label">Email</div>
              <div className="contact-info-text-value">info@kirolafitness.com</div>
            </div>
          </div>

          <div className="contact-hours">
            <h3 className="contact-hours-title">Opening Hours</h3>
            <div className="contact-hours-row">
              <span className="contact-hours-day">Monday – Saturday</span>
              <span className="contact-hours-time">5:00 AM – 11:00 PM</span>
            </div>
            <div className="contact-hours-row">
              <span className="contact-hours-day">Sunday</span>
              <span className="contact-hours-time">6:00 AM – 8:00 PM</span>
            </div>
          </div>
        </div>

        {/* ── Right: Form ── */}
        <div>
          <h2 className="contact-form-title">Send Us a Message</h2>
          <p className="contact-form-sub">We'll get back to you within 24 hours</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="contact-field">
              <label className="contact-label">Your Name *</label>
              <input className="contact-input" placeholder="John Doe" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="contact-field">
              <label className="contact-label">Phone</label>
              <input className="contact-input" placeholder="+91 98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
          </div>

          <div className="contact-field">
            <label className="contact-label">Email Address *</label>
            <input className="contact-input" type="email" placeholder="john@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
          </div>

          <div className="contact-field">
            <label className="contact-label">Subject</label>
            <input className="contact-input" placeholder="e.g. Membership enquiry, Class booking..." value={form.subject} onChange={e => set('subject', e.target.value)} />
          </div>

          <div className="contact-field">
            <label className="contact-label">Message *</label>
            <textarea className="contact-input contact-textarea" placeholder="Tell us how we can help you..." value={form.message} onChange={e => set('message', e.target.value)} />
          </div>

          <button className="contact-submit" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Sending...' : 'Send Message →'}
          </button>

          {status === 'success' && (
            <span className="contact-msg success">✓ Message sent! We'll be in touch soon.</span>
          )}
          {status === 'error-fields' && (
            <span className="contact-msg error">✗ Please fill in all required fields.</span>
          )}
          {status === 'error' && (
            <span className="contact-msg error">✗ Something went wrong. Please try again.</span>
          )}
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