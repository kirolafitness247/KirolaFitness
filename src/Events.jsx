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
  .events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2px; }
  .event-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); transition: all 0.3s; display: flex; flex-direction: column; overflow: hidden; }
  .event-card:hover { background: rgba(201,168,76,0.06); border-color: rgba(201,168,76,0.25); transform: translateY(-4px); }
  .event-card-img { width: 100%; height: 180px; object-fit: cover; display: block; transition: transform 0.5s ease; }
  .event-card:hover .event-card-img { transform: scale(1.04); }
  .event-card-img-wrap { overflow: hidden; position: relative; flex-shrink: 0; }
  .event-card-img-placeholder { width: 100%; height: 120px; background: linear-gradient(135deg, #1a1f35, #0d1020); display: flex; align-items: center; justify-content: center; }
  .event-card-body { padding: 28px; display: flex; flex-direction: column; flex: 1; }
  .event-cat { display: inline-block; padding: 3px 10px; background: rgba(201,168,76,0.15); color: var(--gold); font-family: 'Barlow Condensed', sans-serif; font-size: 10px; letter-spacing: 2px; font-weight: 700; text-transform: uppercase; border: 1px solid rgba(201,168,76,0.3); margin-bottom: 14px; }
  .event-title { font-family: 'Bebas Neue', cursive; font-size: 26px; letter-spacing: 1px; color: var(--white); margin-bottom: 10px; line-height: 1.1; }
  .event-date { font-family: 'Barlow Condensed', sans-serif; font-size: 12px; color: var(--gold); margin-bottom: 14px; letter-spacing: 1px; }
  .event-desc { font-size: 14px; line-height: 1.7; color: var(--muted); margin-bottom: 20px; flex: 1; }
  .btn-primary { background: var(--white); color: var(--darker); border: none; padding: 13px; font-family: 'Barlow Condensed', sans-serif; font-size: 12px; letter-spacing: 4px; font-weight: 700; text-transform: uppercase; cursor: pointer; transition: all 0.25s; width: 100%; margin-top: auto; }
  .btn-primary:hover { background: var(--gold); }
  .empty-state { padding: 48px; text-align: center; border: 2px dashed rgba(255,255,255,0.06); font-family: 'Barlow Condensed', sans-serif; font-size: 13px; letter-spacing: 3px; color: var(--muted); text-transform: uppercase; }
  /* Modal */
  .modal-backdrop { position: fixed; inset: 0; z-index: 999; background: rgba(6,8,16,0.88); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s ease; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal { background: #0d1020; border: 1px solid rgba(201,168,76,0.2); width: 100%; max-width: 460px; animation: slideUp 0.25s ease; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .modal-header { padding: 24px 28px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
  .modal-event-cat { font-family: 'Barlow Condensed', sans-serif; font-size: 9px; letter-spacing: 3px; font-weight: 700; text-transform: uppercase; color: var(--gold); margin-bottom: 6px; }
  .modal-event-title { font-family: 'Bebas Neue', cursive; font-size: 26px; letter-spacing: 1px; color: var(--white); line-height: 1; }
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
  .cta-label { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 5px; font-weight: 700; text-transform: uppercase; color: rgba(0,0,0,0.5); margin-bottom: 14px; }
  .cta-title { font-family: 'Bebas Neue', cursive; font-size: clamp(32px, 5vw, 60px); line-height: 1; color: var(--darker); }
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
    .events-grid { grid-template-columns: 1fr; }
    .cta-section { flex-direction: column; align-items: flex-start; padding: 52px 20px; gap: 24px; }
    .cta-section .btn-dark { width: 100%; text-align: center; }
    .footer { padding: 28px 20px; flex-direction: column; align-items: flex-start; }
    .modal { max-width: 100%; }
    .modal-header, .modal-body { padding-left: 20px; padding-right: 20px; }
  }
`

function RegModal({ event, onClose }) {
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
      const res = await fetch(`${API_BASE}/registrations`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name.trim(), phone: form.phone.trim(), eventTitle: event.title, eventDate: event.date, eventCat: event.cat }),
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
            <div className="modal-success-icon">🏆</div>
            <div className="modal-success-title">You're <span>Registered!</span></div>
            <div className="modal-success-sub">Thanks {form.name}!<br />We'll see you at <strong style={{color:'var(--white)'}}>{event.title}</strong>.</div>
            <button className="modal-success-close" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <div>
                <div className="modal-event-cat">{event.cat} · {event.date}</div>
                <div className="modal-event-title">{event.title}</div>
              </div>
              <button className="modal-close" onClick={onClose}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="modal-field"><label>Full Name *</label><input type="text" autoFocus required value={form.name} onChange={set('name')} placeholder="e.g. Aryan Sharma" /></div>
                <div className="modal-field"><label>Phone Number *</label><input type="tel" required value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" /></div>
                {error && <div className="modal-error">{error}</div>}
                <button type="submit" className="modal-submit" disabled={submitting}>{submitting ? 'Registering…' : 'Confirm Registration'}</button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function Events() {
  const navigate  = useNavigate()
  const [content, setContent] = useState(getContent())
  const [modalEvent, setModalEvent] = useState(null)

  useEffect(() => {
    const h = () => setContent(getContent())
    window.addEventListener('contentUpdated', h)
    return () => window.removeEventListener('contentUpdated', h)
  }, [])

  useEffect(() => {
    document.body.style.overflow = modalEvent ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [modalEvent])

  const eventsPage = content.eventsPage || {}
  const events     = eventsPage.events  || []
  const titleWords = (eventsPage.title || 'Upcoming Events').split(' ')

  return (
    <>
      <style>{styles}</style>
      <Header activePage="EVENTS" />
      {modalEvent && <RegModal event={modalEvent} onClose={() => setModalEvent(null)} />}

      <div className="page-header">
        <h1>{titleWords[0]}{titleWords.slice(1).join(' ') ? <> <span>{titleWords.slice(1).join(' ')}</span></> : null}</h1>
        <p>{eventsPage.subtitle || ''}</p>
      </div>

      <section className="section" style={{ background: 'var(--darker)' }}>
        {events.length === 0
          ? <div className="empty-state">No events added yet — manage via the Content Manager</div>
          : (
            <div className="events-grid">
              {events.map((ev, i) => (
                <div key={i} className="event-card">
                  {ev.image ? (
                    <div className="event-card-img-wrap">
                      <img src={ev.image} alt={ev.title} className="event-card-img" />
                    </div>
                  ) : (
                    <div className="event-card-img-placeholder">
                      <span style={{fontSize:32,opacity:0.1}}>📅</span>
                    </div>
                  )}
                  <div className="event-card-body">
                    <span className="event-cat">{ev.cat}</span>
                    <h3 className="event-title">{ev.title}</h3>
                    <div className="event-date">📅 {ev.date}</div>
                    <p className="event-desc">{ev.desc}</p>
                    <button className="btn-primary" onClick={() => setModalEvent(ev)}>Register</button>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </section>

      <section className="cta-section">
        <div>
          <p className="cta-label">Don't Miss Out</p>
          <h2 className="cta-title">Join Our Next<br />Event</h2>
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