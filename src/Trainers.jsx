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

  .page-header { padding: 180px 80px 100px; background: var(--darker); min-height: 50vh; display: flex; flex-direction: column; justify-content: center; position: relative; overflow: hidden; }
  .page-header-bg { position: absolute; inset: 0; z-index: 0; background-size: cover; background-position: center top; }
  .page-header-overlay { position: absolute; inset: 0; z-index: 1; background: linear-gradient(to right, rgba(6,8,16,0.93) 50%, rgba(6,8,16,0.6) 100%); }
  .page-header-content { position: relative; z-index: 2; }
  .page-header h1 { font-family: 'Bebas Neue', cursive; font-size: clamp(56px, 8vw, 96px); line-height: 0.92; letter-spacing: 2px; color: var(--white); margin-bottom: 20px; }
  .page-header h1 span { color: var(--gold); }
  .page-header p { font-family: 'Barlow Condensed', sans-serif; font-size: 16px; letter-spacing: 2px; color: var(--muted); }

  .section { padding: 100px 80px; }

  .trainers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2px; }

  /* Trainer card */
  .trainer-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); transition: all 0.3s; display: flex; flex-direction: column; overflow: hidden; }
  .trainer-card:hover { background: rgba(201,168,76,0.06); border-color: rgba(201,168,76,0.25); transform: translateY(-4px); }

  /* Photo area */
  .trainer-photo-wrap { width: 100%; height: 260px; overflow: hidden; position: relative; }
  .trainer-photo { width: 100%; height: 100%; object-fit: cover; object-position: center top; display: block; transition: transform 0.5s ease; }
  .trainer-card:hover .trainer-photo { transform: scale(1.04); }
  .trainer-photo-placeholder { width: 100%; height: 100%; background: linear-gradient(135deg, #1a1f35, #0d1020); display: flex; align-items: center; justify-content: center; }
  .trainer-avatar { width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, #c9a84c55, #3a3020); border: 2px solid rgba(201,168,76,0.3); display: flex; align-items: center; justify-content: center; font-size: 40px; }

  /* Gold accent line */
  .trainer-accent { height: 3px; background: linear-gradient(to right, var(--gold), transparent); flex-shrink: 0; }

  .trainer-body { padding: 28px 28px 24px; text-align: center; flex: 1; display: flex; flex-direction: column; align-items: center; }
  .trainer-name { font-family: 'Bebas Neue', cursive; font-size: 28px; letter-spacing: 1px; color: var(--white); margin-bottom: 6px; line-height: 1; }
  .trainer-specialty { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; color: var(--gold); margin-bottom: 10px; letter-spacing: 3px; text-transform: uppercase; font-weight: 700; }
  .trainer-exp { font-family: 'Barlow Condensed', sans-serif; font-size: 13px; color: var(--muted); letter-spacing: 1px; }

  .empty-state { padding: 48px; text-align: center; border: 2px dashed rgba(255,255,255,0.06); font-family: 'Barlow Condensed', sans-serif; font-size: 13px; letter-spacing: 3px; color: var(--muted); text-transform: uppercase; }

  .cta-section { padding: 100px 80px; background: var(--gold); display: flex; align-items: center; justify-content: space-between; gap: 40px; }
  .cta-label { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 5px; font-weight: 700; text-transform: uppercase; color: rgba(0,0,0,0.5); margin-bottom: 16px; }
  .cta-title { font-family: 'Bebas Neue', cursive; font-size: clamp(40px, 5vw, 64px); line-height: 1; color: var(--darker); }
  .btn-dark { background: var(--darker); color: var(--white); border: none; padding: 20px 52px; white-space: nowrap; font-family: 'Barlow Condensed', sans-serif; font-size: 13px; letter-spacing: 4px; font-weight: 700; text-transform: uppercase; cursor: pointer; transition: all 0.25s; flex-shrink: 0; }
  .btn-dark:hover { background: #000; }

  .footer { background: var(--darker); padding: 40px 80px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.07); }
  .footer-copy { font-family: 'Barlow Condensed', sans-serif; font-size: 12px; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; }
  .footer-links { display: flex; gap: 28px; list-style: none; }
  .footer-links a { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 3px; color: var(--muted); text-decoration: none; text-transform: uppercase; transition: color 0.2s; cursor: pointer; }
  .footer-links a:hover { color: var(--gold); }

  @media (max-width: 900px) {
    .nav { padding: 16px 24px; }
    .page-header, .section { padding: 60px 24px; }
    .trainers-grid { grid-template-columns: 1fr; }
    .cta-section { flex-direction: column; padding: 60px 24px; }
    .footer { flex-direction: column; gap: 20px; padding: 32px 24px; }
  }
`

const NAV_LINKS = [
  { name: 'HOME', path: '/' }, { name: 'ABOUT', path: '/about' },
  { name: 'CLASSES', path: '/classes' }, { name: 'TRAINERS', path: '/trainers' },
  { name: 'EQUIPMENT', path: '/equipment' }, { name: 'EVENTS', path: '/events' },
  { name: 'REGISTER', path: '/register' },
]

export default function Trainers() {
  const navigate = useNavigate()
  const [liked, setLiked] = useState(false)
  const [active, setActive] = useState('TRAINERS')
  const [content, setContent] = useState(getContent())

  useEffect(() => {
    const handleUpdate = () => setContent(getContent())
    window.addEventListener('contentUpdated', handleUpdate)
    return () => window.removeEventListener('contentUpdated', handleUpdate)
  }, [])

  const headerBg = content.trainersPage.trainers.find(t => t.photo)?.photo || null

  return (
    <>
      <style>{styles}</style>

      <nav className="nav">
        <div className="nav-logo">
          <div className="logo-emblem"><span className="logo-emblem-icon">{content.logo.emblemIcon}</span></div>
        </div>
        <ul className="nav-links">
          {NAV_LINKS.map(link => (
            <li key={link.name}>
              <a className={active === link.name ? 'active' : ''}
                onClick={e => { e.preventDefault(); setActive(link.name); navigate(link.path) }}>
                {link.name}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-right">
          <button className="heart-btn" onClick={() => setLiked(l => !l)}>{liked ? '❤️' : '🤍'}</button>
        </div>
      </nav>

      <div className="page-header">
        {headerBg && <div className="page-header-bg" style={{backgroundImage:`url(${headerBg})`}} />}
        {headerBg && <div className="page-header-overlay" />}
        <div className="page-header-content">
          <h1>
            {content.trainersPage.title.split(' ')[0]}{' '}
            <span>{content.trainersPage.title.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p>{content.trainersPage.subtitle}</p>
        </div>
      </div>

      <section className="section" style={{ background: 'var(--darker)' }}>
        {content.trainersPage.trainers.length === 0
          ? <div className="empty-state">No trainers added yet — manage via the Content Manager</div>
          : (
            <div className="trainers-grid">
              {content.trainersPage.trainers.map((t, i) => (
                <div key={i} className="trainer-card">
                  <div className="trainer-photo-wrap">
                    {t.photo
                      ? <img src={t.photo} alt={t.name} className="trainer-photo" />
                      : (
                        <div className="trainer-photo-placeholder">
                          <div className="trainer-avatar">💪</div>
                        </div>
                      )
                    }
                  </div>
                  <div className="trainer-accent" />
                  <div className="trainer-body">
                    <h3 className="trainer-name">{t.name}</h3>
                    <div className="trainer-specialty">{t.specialty}</div>
                    <div className="trainer-exp">📅 {t.exp} experience</div>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </section>

      <section className="cta-section">
        <div>
          <p className="cta-label">Train With The Best</p>
          <h2 className="cta-title">Book Your<br />Personal Session</h2>
        </div>
        <button className="btn-dark" onClick={() => navigate('/register')}>Get Started</button>
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