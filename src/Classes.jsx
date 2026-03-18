import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getContent } from './contentStore'
import Header from './Header'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;900&family=Barlow+Condensed:wght@400;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root { --dark: #0a0d1a; --darker: #060810; --gold: #c9a84c; --white: #ffffff; --muted: #8a9ab5; }
  body { background: var(--dark); color: var(--white); font-family: 'Barlow', sans-serif; overflow-x: hidden; }

  .page-header { padding: 140px 80px 80px; background: var(--darker); display: flex; flex-direction: column; justify-content: flex-end; position: relative; overflow: hidden; }
  .page-header-bg { position: absolute; inset: 0; z-index: 0; background-size: cover; background-position: center; }
  .page-header-overlay { position: absolute; inset: 0; z-index: 1; background: linear-gradient(to right, rgba(6,8,16,0.93) 50%, rgba(6,8,16,0.6) 100%); }
  .page-header-content { position: relative; z-index: 2; }
  .page-header h1 { font-family: 'Bebas Neue', cursive; font-size: clamp(44px, 7vw, 96px); line-height: 0.92; letter-spacing: 2px; color: var(--white); margin-bottom: 16px; }
  .page-header h1 span { color: var(--gold); }
  .page-header p { font-family: 'Barlow Condensed', sans-serif; font-size: 15px; letter-spacing: 2px; color: var(--muted); }

  .section { padding: 80px 80px; }
  .section-label { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 5px; font-weight: 700; text-transform: uppercase; color: var(--gold); margin-bottom: 14px; }
  .section-title { font-family: 'Bebas Neue', cursive; font-size: clamp(34px, 5vw, 64px); line-height: 1; color: var(--white); margin-bottom: 40px; }

  .classes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2px; }
  .class-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); transition: all 0.3s; display: flex; flex-direction: column; overflow: hidden; }
  .class-card:hover { background: rgba(201,168,76,0.06); border-color: rgba(201,168,76,0.25); transform: translateY(-4px); }
  .class-card-img-wrap { width: 100%; height: 200px; overflow: hidden; position: relative; }
  .class-card-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s ease; }
  .class-card:hover .class-card-img { transform: scale(1.05); }
  .class-card-img-placeholder { width: 100%; height: 100%; background: linear-gradient(135deg, #1a2535, #0d1525); display: flex; align-items: center; justify-content: center; font-size: 48px; opacity: 0.25; }
  .class-card-body { padding: 24px; display: flex; flex-direction: column; flex: 1; }
  .class-card-title { font-family: 'Bebas Neue', cursive; font-size: 26px; letter-spacing: 1px; color: var(--white); margin-bottom: 14px; line-height: 1; }
  .class-meta { display: flex; flex-direction: column; gap: 7px; margin-bottom: 16px; flex: 1; }
  .class-meta-row { font-family: 'Barlow Condensed', sans-serif; font-size: 13px; letter-spacing: 1px; color: var(--muted); display: flex; align-items: center; gap: 8px; }
  .class-spots { font-family: 'Barlow Condensed', sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 1px; color: var(--gold); margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .spots-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); flex-shrink: 0; }
  .btn-book { background: var(--white); color: var(--darker); border: none; padding: 13px; font-family: 'Barlow Condensed', sans-serif; font-size: 12px; letter-spacing: 4px; font-weight: 700; text-transform: uppercase; cursor: pointer; transition: all 0.25s; width: 100%; margin-top: auto; }
  .btn-book:hover { background: var(--gold); }

  .level-badge { display: inline-block; padding: 3px 10px; font-family: 'Barlow Condensed', sans-serif; font-size: 10px; letter-spacing: 2px; font-weight: 700; text-transform: uppercase; border-radius: 2px; }
  .level-beginner     { background: rgba(46,204,113,0.15);  color: #2ecc71; border: 1px solid rgba(46,204,113,0.3); }
  .level-alllevels    { background: rgba(52,152,219,0.15);  color: #3498db; border: 1px solid rgba(52,152,219,0.3); }
  .level-intermediate { background: rgba(241,196,15,0.15);  color: #f1c40f; border: 1px solid rgba(241,196,15,0.3); }
  .level-advanced     { background: rgba(231,76,60,0.15);   color: #e74c3c; border: 1px solid rgba(231,76,60,0.3); }

  /* Modal */
  .modal-backdrop { position: fixed; inset: 0; z-index: 999; background: rgba(6,8,16,0.88); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s ease; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal { background: #0d1020; border: 1px solid rgba(201,168,76,0.2); width: 100%; max-width: 460px; animation: slideUp 0.25s ease; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .modal-header { padding: 24px 28px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
  .modal-class-tag { font-family: 'Barlow Condensed', sans-serif; font-size: 9px; letter-spacing: 3px; font-weight: 700; text-transform: uppercase; color: var(--gold); margin-bottom: 6px; }
  .modal-class-name { font-family: 'Bebas Neue', cursive; font-size: 26px; letter-spacing: 1px; color: var(--white); line-height: 1; margin-bottom: 4px; }
  .modal-class-meta { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; line-height: 1.6; }
  .modal-close { background: none; border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.5); width: 30px; height: 30px; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s; }
  .modal-close:hover { border-color: rgba(231,76,60,0.5); color: #e74c3c; }
  .modal-body { padding: 20px 28px 28px; }
  .modal-field { margin-bottom: 16px; }
  .modal-field label { display: block; margin-bottom: 7px; font-family: 'Barlow Condensed', sans-serif; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); font-weight: 700; }
  .modal-field input { width: 100%; padding: 12px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: var(--white); font-size: 15px; font-family: 'Barlow', sans-serif; outline: none; transition: border-color 0.2s; }
  .modal-field input:focus { border-color: var(--gold); }
  .modal-field input::placeholder { color: rgba(255,255,255,0.2); }
  .modal-submit { width: 100%; padding: 15px; background: var(--gold); color: var(--darker); border: none; font-family: 'Barlow Condensed', sans-serif; font-size: 13px; letter-spacing: 4px; font-weight: 700; text-transform: uppercase; cursor: pointer; transition: all 0.25s; margin-top: 6px; }
  .modal-submit:hover { background: #e0bc60; }
  .modal-submit:disabled { opacity: 0.5; cursor: not-allowed; }
  .modal-error { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 2px; color: #e74c3c; text-transform: uppercase; margin-top: 8px; text-align: center; }
  .modal-success { padding: 36px 28px; text-align: center; }
  .modal-success-icon { font-size: 44px; margin-bottom: 14px; }
  .modal-success-title { font-family: 'Bebas Neue', cursive; font-size: 30px; color: var(--white); letter-spacing: 2px; margin-bottom: 8px; }
  .modal-success-title span { color: var(--gold); }
  .modal-success-sub { font-family: 'Barlow Condensed', sans-serif; font-size: 12px; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; margin-bottom: 24px; line-height: 1.6; }
  .modal-success-close { background: transparent; border: 1px solid rgba(255,255,255,0.15); color: var(--muted); padding: 11px 28px; font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 3px; font-weight: 700; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
  .modal-success-close:hover { border-color: var(--gold); color: var(--gold); }

  .cta-section { padding: 80px 80px; background: var(--gold); display: flex; align-items: center; justify-content: space-between; gap: 40px; }
  .cta-text .section-label { color: rgba(0,0,0,0.5); }
  .cta-text .section-title { color: var(--darker); margin-bottom: 0; }
  .btn-dark { background: var(--darker); color: var(--white); border: none; padding: 18px 48px; font-family: 'Barlow Condensed', sans-serif; font-size: 13px; letter-spacing: 4px; font-weight: 700; text-transform: uppercase; cursor: pointer; transition: all 0.25s; flex-shrink: 0; }
  .btn-dark:hover { background: #000; }
  .footer { background: var(--darker); padding: 36px 80px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.07); flex-wrap: wrap; gap: 16px; }
  .footer-copy { font-family: 'Barlow Condensed', sans-serif; font-size: 12px; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; }
  .footer-links { display: flex; gap: 24px; list-style: none; flex-wrap: wrap; }
  .footer-links a { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 3px; color: var(--muted); text-decoration: none; text-transform: uppercase; transition: color 0.2s; cursor: pointer; }
  .footer-links a:hover { color: var(--gold); }

  @media (max-width: 860px) {
    .page-header { padding: 96px 20px 40px; }
    .section { padding: 52px 20px; }
    .classes-grid { grid-template-columns: 1fr; }
    .cta-section { flex-direction: column; align-items: flex-start; padding: 52px 20px; gap: 24px; }
    .cta-section .btn-dark { width: 100%; text-align: center; }
    .footer { padding: 28px 20px; flex-direction: column; align-items: flex-start; }
    .modal { max-width: 100%; }
    .modal-header, .modal-body { padding-left: 20px; padding-right: 20px; }
  }
`

function getLevelClass(level = '') {
  const l = level.toLowerCase().replace(/\s/g, '')
  if (l === 'beginner') return 'level-badge level-beginner'
  if (l === 'advanced') return 'level-badge level-advanced'
  if (l === 'intermediate') return 'level-badge level-intermediate'
  return 'level-badge level-alllevels'
}

function BookingModal({ cls, onClose }) {
  const [form, setForm] = useState({ name: '', phone: '' })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) { setError('Please fill in both fields'); return }
    setSubmitting(true); setError('')
    try {
      const res = await fetch(`${API_BASE}/class-bookings`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name.trim(), phone: form.phone.trim(), className: cls.name, trainer: cls.trainer, time: cls.time, level: cls.level }),
      })
      if (!res.ok) throw new Error()
      setDone(true)
    } catch { setError('Something went wrong. Please try again.') }
    setSubmitting(false)
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        {done ? (
          <div className="modal-success">
            <div className="modal-success-icon">✅</div>
            <div className="modal-success-title">Spot <span>Booked!</span></div>
            <div className="modal-success-sub">Thanks {form.name}!<br />Your spot in <strong style={{color:'var(--white)'}}>{cls.name}</strong> is confirmed.</div>
            <button className="modal-success-close" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <div>
                <div className="modal-class-tag">Book a Spot</div>
                <div className="modal-class-name">{cls.name}</div>
                <div className="modal-class-meta">{cls.trainer && `👤 ${cls.trainer}`}{cls.time && ` · ⏰ ${cls.time}`}</div>
              </div>
              <button className="modal-close" onClick={onClose}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="modal-field"><label>Full Name *</label><input type="text" autoFocus required value={form.name} onChange={set('name')} placeholder="e.g. Aryan Sharma" /></div>
                <div className="modal-field"><label>Phone Number *</label><input type="tel" required value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" /></div>
                {error && <div className="modal-error">{error}</div>}
                <button type="submit" className="modal-submit" disabled={submitting}>{submitting ? 'Booking…' : 'Confirm Booking'}</button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function Classes() {
  const navigate  = useNavigate()
  const [content, setContent] = useState(getContent())
  const [modalClass, setModalClass] = useState(null)

  useEffect(() => {
    const h = () => setContent(getContent())
    window.addEventListener('contentUpdated', h)
    return () => window.removeEventListener('contentUpdated', h)
  }, [])

  useEffect(() => {
    document.body.style.overflow = modalClass ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [modalClass])

  const classList    = content.classesPage?.classList || []
  const headerBg     = classList.find(c => c.image)?.image || null
  const pageTitle    = content.classesPage?.title || 'Our Classes'
  const titleWords   = pageTitle.split(' ')

  return (
    <>
      <style>{styles}</style>
      <Header activePage="CLASSES" />
      {modalClass && <BookingModal cls={modalClass} onClose={() => setModalClass(null)} />}

      <div className="page-header">
        {headerBg && <div className="page-header-bg" style={{ backgroundImage: `url(${headerBg})` }} />}
        {headerBg && <div className="page-header-overlay" />}
        <div className="page-header-content">
          <h1>{titleWords[0]}{titleWords.slice(1).join(' ') ? <> <span>{titleWords.slice(1).join(' ')}</span></> : null}</h1>
          <p>{content.classesPage?.subtitle || ''}</p>
        </div>
      </div>

      <section className="section" style={{ background: 'var(--darker)' }}>
        <div className="classes-grid">
          {classList.map((cls, i) => (
            <div key={i} className="class-card">
              <div className="class-card-img-wrap">
                {cls.image ? <img src={cls.image} alt={cls.name} className="class-card-img" /> : <div className="class-card-img-placeholder">🏋️</div>}
              </div>
              <div className="class-card-body">
                <h3 className="class-card-title">{cls.name}</h3>
                <div className="class-meta">
                  <div className="class-meta-row">⏰ {cls.time}</div>
                  <div className="class-meta-row">👤 {cls.trainer}</div>
                  <div className="class-meta-row"><span className={getLevelClass(cls.level)}>{cls.level}</span></div>
                </div>
                <div className="class-spots"><span className="spots-dot" />{cls.spots} spots available</div>
                <button className="btn-book" onClick={() => setModalClass(cls)}>Book Now</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-text">
          <p className="section-label">Ready to Start?</p>
          <h2 className="section-title">Find Your<br />Perfect Class</h2>
        </div>
        <button className="btn-dark" onClick={() => navigate('/register')}>Register Now</button>
      </section>

      <footer className="footer">
        <p className="footer-copy">{content.footer?.copyright}</p>
        <ul className="footer-links">
          {(content.footer?.links || []).map((link, i) => <li key={i}><a>{link}</a></li>)}
          <li><a onClick={() => navigate('/manager')}>⚙ Manager</a></li>
        </ul>
      </footer>
    </>
  )
}