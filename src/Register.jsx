import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getContent } from './contentStore'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;900&family=Barlow+Condensed:wght@400;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root { --dark: #0a0d1a; --darker: #060810; --gold: #c9a84c; --white: #ffffff; --muted: #8a9ab5; }
  body { background: var(--dark); color: var(--white); font-family: 'Barlow', sans-serif; overflow-x: hidden; }

  .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 20px 48px; background: linear-gradient(to bottom, rgba(6,8,16,0.95) 0%, transparent 100%); }
  .nav-logo { display: flex; align-items: center; gap: 12px; }
  .logo-emblem { width: 64px; height: 64px; border-radius: 50%; border: 2px solid var(--gold); display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(10,13,26,0.9); position: relative; }
  .logo-emblem::before { content: '✦ GYM ✦'; font-size: 7px; letter-spacing: 2px; color: var(--gold); font-family: 'Barlow Condensed', sans-serif; font-weight: 600; display: block; margin-bottom: 2px; }
  .logo-emblem-icon { font-size: 20px; line-height: 1; }
  .logo-emblem::after { content: '— SLOGAN HERE —'; font-size: 5.5px; letter-spacing: 1.5px; color: var(--gold); font-family: 'Barlow Condensed', sans-serif; display: block; margin-top: 2px; }
  .nav-links { display: flex; align-items: center; gap: 32px; list-style: none; margin: 0; padding: 0; }
  .nav-links a { color: var(--white); text-decoration: none; font-family: 'Barlow Condensed', sans-serif; font-size: 13px; letter-spacing: 3px; font-weight: 600; text-transform: uppercase; transition: color 0.2s; position: relative; cursor: pointer; }
  .nav-links a.active::after { content: ''; position: absolute; bottom: -4px; left: 0; right: 0; height: 2px; background: var(--white); }
  .nav-links a:hover { color: var(--gold); }
  .nav-right { display: flex; align-items: center; gap: 20px; }
  .heart-btn { background: none; border: none; cursor: pointer; color: var(--white); font-size: 22px; transition: color 0.2s; display: flex; align-items: center; }
  .heart-btn:hover { color: #e63946; }

  .page-header { padding: 180px 80px 100px; background: var(--darker); min-height: 50vh; display: flex; flex-direction: column; justify-content: center; }
  .page-header h1 { font-family: 'Bebas Neue', cursive; font-size: clamp(56px, 8vw, 96px); line-height: 0.92; letter-spacing: 2px; color: var(--white); margin-bottom: 20px; }
  .page-header h1 span { color: var(--gold); }
  .page-header p { font-family: 'Barlow Condensed', sans-serif; font-size: 16px; letter-spacing: 2px; color: var(--muted); }

  .section { padding: 100px 80px; }

  /* FORM */
  .form-wrap {
    max-width: 800px; margin: 0 auto;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    padding: 48px;
  }
  .form-title { font-family: 'Bebas Neue', cursive; font-size: 36px; color: var(--white); margin-bottom: 32px; }
  .field { margin-bottom: 24px; }
  .field label { display: block; margin-bottom: 8px; font-family: 'Barlow Condensed', sans-serif; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); }
  .field input, .field select, .field textarea { width: 100%; padding: 12px; background: var(--darker); border: 1px solid rgba(255,255,255,0.1); color: #fff; font-size: 16px; font-family: 'Barlow', sans-serif; outline: none; transition: border-color 0.2s; }
  .field input:focus, .field select:focus, .field textarea:focus { border-color: var(--gold); }
  .field textarea { resize: vertical; }
  .field select option { background: var(--darker); }
  .btn-submit { width: 100%; padding: 18px; background: var(--white); color: var(--darker); border: none; font-family: 'Barlow Condensed', sans-serif; font-size: 13px; letter-spacing: 4px; font-weight: 700; text-transform: uppercase; cursor: pointer; transition: all 0.25s; margin-top: 8px; }
  .btn-submit:hover { background: var(--gold); }

  .footer { background: var(--darker); padding: 40px 80px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.07); }
  .footer-copy { font-family: 'Barlow Condensed', sans-serif; font-size: 12px; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; }
  .footer-links { display: flex; gap: 28px; list-style: none; }
  .footer-links a { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 3px; color: var(--muted); text-decoration: none; text-transform: uppercase; transition: color 0.2s; cursor: pointer; }
  .footer-links a:hover { color: var(--gold); }

  @media (max-width: 900px) {
    .nav { padding: 16px 24px; }
    .page-header, .section { padding: 60px 24px; }
    .form-wrap { padding: 32px 24px; }
    .footer { flex-direction: column; gap: 20px; padding: 32px 24px; }
  }
`

const NAV_LINKS = [
  { name: 'HOME', path: '/' }, { name: 'ABOUT', path: '/about' },
  { name: 'CLASSES', path: '/classes' }, { name: 'TRAINERS', path: '/trainers' },
  { name: 'EQUIPMENT', path: '/equipment' }, { name: 'EVENTS', path: '/events' },
  { name: 'REGISTER', path: '/register' },
]

export default function Register() {
  const navigate = useNavigate()
  const [liked, setLiked] = useState(false)
  const [active, setActive] = useState('REGISTER')
  const [content, setContent] = useState(getContent())
  const [form, setForm] = useState({ name:'', email:'', phone:'', membership:'basic', goal:'' })

  useEffect(() => {
    const handleUpdate = () => setContent(getContent())
    window.addEventListener('contentUpdated', handleUpdate)
    return () => window.removeEventListener('contentUpdated', handleUpdate)
  }, [])

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  return (
    <>
      <style>{styles}</style>

      <nav className="nav">
        <div className="nav-logo"><div className="logo-emblem"><span className="logo-emblem-icon">{content.logo.emblemIcon}</span></div></div>
        <ul className="nav-links">
          {NAV_LINKS.map(link => (
            <li key={link.name}>
              <a className={active === link.name ? 'active' : ''} onClick={e => { e.preventDefault(); setActive(link.name); navigate(link.path) }}>{link.name}</a>
            </li>
          ))}
        </ul>
        <div className="nav-right">
          <button className="heart-btn" onClick={() => setLiked(l => !l)} aria-label="Favorite">{liked ? '❤️' : '🤍'}</button>
        </div>
      </nav>

      <div className="page-header">
        <h1>Join <span>Our Gym</span></h1>
        <p>Start your fitness journey today</p>
      </div>

      <section className="section" style={{ background: 'var(--darker)' }}>
        <div className="form-wrap">
          <h2 className="form-title">Registration Form</h2>
          <form onSubmit={e => { e.preventDefault(); alert('Registration submitted!') }}>
            <div className="field">
              <label>Full Name *</label>
              <input type="text" required value={form.name} onChange={set('name')} />
            </div>
            <div className="field">
              <label>Email *</label>
              <input type="email" required value={form.email} onChange={set('email')} />
            </div>
            <div className="field">
              <label>Phone *</label>
              <input type="tel" required value={form.phone} onChange={set('phone')} />
            </div>
            <div className="field">
              <label>Membership Plan *</label>
              <select value={form.membership} onChange={set('membership')}>
                <option value="basic">Basic - $29/mo</option>
                <option value="premium">Premium - $59/mo</option>
                <option value="elite">Elite - $99/mo</option>
              </select>
            </div>
            <div className="field">
              <label>Fitness Goals</label>
              <textarea rows="4" value={form.goal} onChange={set('goal')} placeholder="Tell us about your fitness goals..." />
            </div>
            <button type="submit" className="btn-submit">Submit Registration</button>
          </form>
        </div>
      </section>

      <footer className="footer">
        <p className="footer-copy">{content.footer.copyright}</p>
        <ul className="footer-links">
          {content.footer.links.map((link, i) => <li key={i}><a>{link}</a></li>)}
          <li><a onClick={() => navigate('/manager')}>⚙ Manager</a></li>
        </ul>
      </footer>
    </>
  )
}