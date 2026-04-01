import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getContent } from './contentStore'
import Header from './Header'

const API_BASE = import.meta.env.VITE_API_URL || 'https://kirolafitness.onrender.com/api'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;900&family=Barlow+Condensed:wght@400;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root { --dark: #0a0d1a; --darker: #060810; --gold: #c9a84c; --white: #ffffff; --muted: #8a9ab5; }
  body { background: var(--dark); color: var(--white); font-family: 'Barlow', sans-serif; overflow-x: hidden; }
  .page-header { padding: 140px 80px 80px; background: var(--darker); display: flex; flex-direction: column; justify-content: flex-end; }
  .page-header h1 { font-family: 'Bebas Neue', cursive; font-size: clamp(44px, 7vw, 96px); line-height: 0.92; letter-spacing: 2px; color: var(--white); margin-bottom: 16px; }
  .page-header h1 span { color: var(--gold); }
  .page-header p { font-family: 'Barlow Condensed', sans-serif; font-size: 15px; letter-spacing: 2px; color: var(--muted); }
  .section { padding: 80px 80px; }
  .form-wrap { max-width: 600px; margin: 0 auto; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 48px; }
  .form-title { font-family: 'Bebas Neue', cursive; font-size: 36px; color: var(--white); margin-bottom: 6px; }
  .form-subtitle { font-family: 'Barlow Condensed', sans-serif; font-size: 12px; letter-spacing: 3px; color: var(--muted); text-transform: uppercase; margin-bottom: 32px; }
  .field { margin-bottom: 22px; }
  .field label { display: block; margin-bottom: 8px; font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); font-weight: 700; }
  .field input { width: 100%; padding: 14px 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: #fff; font-size: 15px; font-family: 'Barlow', sans-serif; outline: none; transition: border-color 0.2s; }
  .field input:focus { border-color: var(--gold); }
  .field input::placeholder { color: rgba(255,255,255,0.2); }
  .form-error { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 2px; color: #e74c3c; text-transform: uppercase; margin-bottom: 14px; text-align: center; }
  .btn-submit { width: 100%; padding: 17px; background: var(--white); color: var(--darker); border: none; font-family: 'Barlow Condensed', sans-serif; font-size: 13px; letter-spacing: 4px; font-weight: 700; text-transform: uppercase; cursor: pointer; transition: all 0.25s; margin-top: 6px; }
  .btn-submit:hover { background: var(--gold); }
  .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
  .success-wrap { max-width: 600px; margin: 0 auto; text-align: center; padding: 60px 40px; background: rgba(46,204,113,0.04); border: 1px solid rgba(46,204,113,0.15); }
  .success-icon { font-size: 52px; margin-bottom: 18px; }
  .success-title { font-family: 'Bebas Neue', cursive; font-size: 44px; color: var(--white); margin-bottom: 12px; letter-spacing: 2px; }
  .success-title span { color: var(--gold); }
  .success-sub { font-family: 'Barlow Condensed', sans-serif; font-size: 13px; letter-spacing: 3px; color: var(--muted); text-transform: uppercase; margin-bottom: 32px; line-height: 1.7; }
  .btn-home { background: var(--gold); color: var(--darker); border: none; padding: 16px 40px; font-family: 'Barlow Condensed', sans-serif; font-size: 12px; letter-spacing: 4px; font-weight: 700; text-transform: uppercase; cursor: pointer; transition: all 0.25s; }
  .btn-home:hover { background: #e0bc60; }
  .footer { background: var(--darker); padding: 36px 80px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.07); flex-wrap: wrap; gap: 16px; }
  .footer-copy { font-family: 'Barlow Condensed', sans-serif; font-size: 12px; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; }
  .footer-links { display: flex; gap: 24px; list-style: none; flex-wrap: wrap; }
  .footer-links a { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 3px; color: var(--muted); text-decoration: none; text-transform: uppercase; transition: color 0.2s; cursor: pointer; }
  .footer-links a:hover { color: var(--gold); }
  @media (max-width: 860px) {
    .page-header { padding: 96px 20px 40px; }
    .section { padding: 52px 20px; }
    .form-wrap, .success-wrap { padding: 32px 20px; }
    .footer { padding: 28px 20px; flex-direction: column; align-items: flex-start; }
  }
`

export default function Register() {
  const navigate  = useNavigate()
  const [content, setContent]     = useState(getContent())
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]         = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '' })

  useEffect(() => {
    const h = () => setContent(getContent())
    window.addEventListener('contentUpdated', h)
    return () => window.removeEventListener('contentUpdated', h)
  }, [])

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) { setError('Please fill in all fields'); return }
    setSubmitting(true); setError('')
    try {
      const res = await fetch(`${API_BASE}/members`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() }),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch { setError('Something went wrong. Please try again.') }
    setSubmitting(false)
  }

  return (
    <>
      <style>{styles}</style>
      <Header activePage="REGISTER" />

      <div className="page-header">
        <h1>Join <span>Our Gym</span></h1>
        <p>{content.registerPage?.subtitle || 'Start your fitness journey today'}</p>
      </div>

      <section className="section" style={{ background: 'var(--darker)' }}>
        {submitted ? (
          <div className="success-wrap">
            <div className="success-icon">🏆</div>
            <h2 className="success-title">Welcome to the <span>Family!</span></h2>
            <p className="success-sub">Thanks {form.name}!<br />Your registration is confirmed.<br />We'll contact you on {form.phone} shortly.</p>
            <button className="btn-home" onClick={() => navigate('/')}>Back to Home</button>
          </div>
        ) : (
          <div className="form-wrap">
            <h2 className="form-title">Join Now</h2>
            <p className="form-subtitle">Fill in your details — we'll get back to you shortly</p>
            <form onSubmit={handleSubmit}>
              <div className="field"><label>Full Name *</label><input type="text" required autoComplete="name" value={form.name} onChange={set('name')} placeholder="e.g. Rahul Sharma" /></div>
              <div className="field"><label>Email Address *</label><input type="email" required autoComplete="email" value={form.email} onChange={set('email')} placeholder="you@example.com" /></div>
              <div className="field"><label>Phone Number *</label><input type="tel" required autoComplete="tel" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" /></div>
              {error && <div className="form-error">{error}</div>}
              <button type="submit" className="btn-submit" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit Registration'}</button>
            </form>
          </div>
        )}
      </section>

      <footer className="footer">
        <p className="footer-copy">{content.footer?.copyright}</p>
        <ul className="footer-links">
          {(content.footer?.links || []).map((link, i) => {
            const key = link.toLowerCase().trim()
            const handleClick = () => {
              if (key === 'privacy') navigate('/privacy')
              else if (key === 'terms') navigate('/terms')
              else if (key === 'contact') navigate('/contact')
              else if (key === 'instagram') window.open('https://www.instagram.com/kirola_fitness?igsh=cWdocG5oaHFlcDU0', '_blank')
              else if (key === 'about') navigate('/about')
            }
            return (
              <li key={i}>
                <a onClick={handleClick} style={key === 'instagram' ? { color: 'var(--gold)' } : {}}>
                  {key === 'instagram' ? '📸 ' : ''}{link}
                </a>
              </li>
            )
          })}
          <li><a className="manager-link" onClick={() => navigate('/manager')}>⚙ Manager</a></li>
        </ul>
      </footer>
    </>
  )
}