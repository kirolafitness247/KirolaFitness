import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getContent , fetchContent } from './contentStore'
import Header from './Header'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;900&family=Barlow+Condensed:wght@400;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root { --dark: #0a0d1a; --darker: #060810; --gold: #c9a84c; --white: #ffffff; --muted: #8a9ab5; }
  body { background: var(--dark); color: var(--white); font-family: 'Barlow', sans-serif; overflow-x: hidden; }
  .page-header { padding: 140px 80px 80px; background: var(--darker); display: flex; flex-direction: column; justify-content: flex-end; position: relative; overflow: hidden; }
  .page-header-bg { position: absolute; inset: 0; z-index: 0; background-size: cover; background-position: center top; }
  .page-header-overlay { position: absolute; inset: 0; z-index: 1; background: linear-gradient(to right, rgba(6,8,16,0.93) 50%, rgba(6,8,16,0.6) 100%); }
  .page-header-content { position: relative; z-index: 2; }
  .page-header h1 { font-family: 'Bebas Neue', cursive; font-size: clamp(44px, 7vw, 96px); line-height: 0.92; letter-spacing: 2px; color: var(--white); margin-bottom: 16px; }
  .page-header h1 span { color: var(--gold); }
  .page-header p { font-family: 'Barlow Condensed', sans-serif; font-size: 15px; letter-spacing: 2px; color: var(--muted); }
  .section { padding: 80px 80px; }
  .trainers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2px; }
  .trainer-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); transition: all 0.3s; display: flex; flex-direction: column; overflow: hidden; }
  .trainer-card:hover { background: rgba(201,168,76,0.06); border-color: rgba(201,168,76,0.25); transform: translateY(-4px); }

  /* ── FIXED: Full image display ── */
  .trainer-photo-wrap {
    width: 100%;
    aspect-ratio: 3 / 4;        /* portrait ratio fits full-body shots */
    overflow: hidden;
    position: relative;
    background: #0d1020;
  }
  .trainer-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;           /* fills the area */
    object-position: center top; /* prioritises face/head */
    display: block;
    transition: transform 0.5s ease;
  }
  .trainer-card:hover .trainer-photo { transform: scale(1.04); }

  .trainer-photo-placeholder { width: 100%; height: 100%; background: linear-gradient(135deg, #1a1f35, #0d1020); display: flex; align-items: center; justify-content: center; }
  .trainer-avatar { width: 90px; height: 90px; border-radius: 50%; background: linear-gradient(135deg, #c9a84c44, #3a3020); border: 2px solid rgba(201,168,76,0.3); display: flex; align-items: center; justify-content: center; font-size: 36px; }
  .trainer-accent { height: 3px; background: linear-gradient(to right, var(--gold), transparent); flex-shrink: 0; }
  .trainer-body { padding: 24px; text-align: center; flex: 1; display: flex; flex-direction: column; align-items: center; }
  .trainer-name { font-family: 'Bebas Neue', cursive; font-size: 26px; letter-spacing: 1px; color: var(--white); margin-bottom: 5px; line-height: 1; }
  .trainer-specialty { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; color: var(--gold); margin-bottom: 8px; letter-spacing: 3px; text-transform: uppercase; font-weight: 700; }
  .trainer-exp { font-family: 'Barlow Condensed', sans-serif; font-size: 12px; color: var(--muted); letter-spacing: 1px; margin-bottom: 14px; }
  .trainer-certs { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-top: 4px; }
  .trainer-cert-badge { font-family: 'Barlow Condensed', sans-serif; font-size: 9px; letter-spacing: 2px; font-weight: 700; text-transform: uppercase; padding: 3px 10px; border-radius: 2px; background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.2); color: rgba(201,168,76,0.85); white-space: nowrap; }

  /* ── Bio dropdown ── */
  .trainer-bio-toggle { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 16px; width: 100%; background: none; border: 1px solid rgba(201,168,76,0.2); padding: 8px 14px; border-radius: 2px; cursor: pointer; font-family: 'Barlow Condensed', sans-serif; font-size: 10px; letter-spacing: 3px; font-weight: 700; text-transform: uppercase; color: rgba(201,168,76,0.7); transition: all 0.25s; }
  .trainer-bio-toggle:hover { background: rgba(201,168,76,0.07); border-color: rgba(201,168,76,0.45); color: var(--gold); }
  .trainer-bio-toggle .arrow { display: inline-block; transition: transform 0.3s; font-size: 9px; }
  .trainer-bio-toggle.open .arrow { transform: rotate(180deg); }
  .trainer-bio-panel { width: 100%; overflow: hidden; max-height: 0; transition: max-height 0.35s ease, opacity 0.3s ease; opacity: 0; }
  .trainer-bio-panel.open { max-height: 400px; opacity: 1; }
  .trainer-bio-inner { padding: 14px 0 4px; border-top: 1px solid rgba(255,255,255,0.06); margin-top: 14px; text-align: left; }
  .trainer-bio-label { font-family: 'Barlow Condensed', sans-serif; font-size: 9px; letter-spacing: 3px; font-weight: 700; text-transform: uppercase; color: rgba(201,168,76,0.6); margin-bottom: 8px; }
  .trainer-bio-text { font-family: 'Barlow', sans-serif; font-size: 13px; line-height: 1.7; color: rgba(255,255,255,0.55); }

  .empty-state { padding: 48px; text-align: center; border: 2px dashed rgba(255,255,255,0.06); font-family: 'Barlow Condensed', sans-serif; font-size: 13px; letter-spacing: 3px; color: var(--muted); text-transform: uppercase; }
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
    .trainers-grid { grid-template-columns: repeat(2, 1fr); }
    .cta-section { flex-direction: column; align-items: flex-start; padding: 52px 20px; gap: 24px; }
    .cta-section .btn-dark { width: 100%; text-align: center; }
    .footer { padding: 28px 20px; flex-direction: column; align-items: flex-start; }
  }
  @media (max-width: 480px) {
    .trainers-grid { grid-template-columns: 1fr; }
  }
`

function TrainerCard({ t }) {
  const [bioOpen, setBioOpen] = useState(false)

  const certs = Array.isArray(t.certifications)
    ? t.certifications
    : typeof t.certifications === 'string' && t.certifications.trim()
      ? t.certifications.split(',').map(c => c.trim()).filter(Boolean)
      : []

  const hasBio = t.bio && t.bio.trim().length > 0

  return (
    <div className="trainer-card">
      <div className="trainer-photo-wrap">
        {t.photo
          ? <img src={t.photo} alt={t.name} className="trainer-photo" />
          : <div className="trainer-photo-placeholder"><div className="trainer-avatar">💪</div></div>
        }
      </div>
      <div className="trainer-accent" />
      <div className="trainer-body">
        <h3 className="trainer-name">{t.name}</h3>
        <div className="trainer-specialty">{t.specialty}</div>
        <div className="trainer-exp">📅 {t.exp} experience</div>
        {certs.length > 0 && (
          <div className="trainer-certs">
            {certs.map((cert, ci) => (
              <span key={ci} className="trainer-cert-badge">🏅 {cert}</span>
            ))}
          </div>
        )}

        {hasBio && (
          <>
            <button
              className={`trainer-bio-toggle${bioOpen ? ' open' : ''}`}
              onClick={() => setBioOpen(o => !o)}
              aria-expanded={bioOpen}
            >
              {bioOpen ? 'Hide Bio' : 'About Trainer'}
              <span className="arrow">▼</span>
            </button>
            <div className={`trainer-bio-panel${bioOpen ? ' open' : ''}`} aria-hidden={!bioOpen}>
              <div className="trainer-bio-inner">
                <div className="trainer-bio-label">Bio</div>
                <p className="trainer-bio-text">{t.bio}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function Trainers() {
  const navigate  = useNavigate()
  const [content, setContent] = useState(getContent())

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchContent()
      setContent(data)
    }

    loadData()

    const h = () => setContent(getContent())
    window.addEventListener('contentUpdated', h)

    return () => window.removeEventListener('contentUpdated', h)
  }, [])

  const trainersPage = content.trainersPage || {}
  const trainers     = trainersPage.trainers || []
  const headerBg     = trainers.find(t => t.photo)?.photo || null
  const titleWords   = (trainersPage.title || 'Expert Trainers').split(' ')

  return (
    <>
      <style>{styles}</style>
      <Header activePage="TRAINERS" />

      <div className="page-header">
        {headerBg && <div className="page-header-bg" style={{ backgroundImage: `url(${headerBg})` }} />}
        {headerBg && <div className="page-header-overlay" />}
        <div className="page-header-content">
          <h1>{titleWords[0]}{titleWords.slice(1).join(' ') ? <> <span>{titleWords.slice(1).join(' ')}</span></> : null}</h1>
          <p>{trainersPage.subtitle || ''}</p>
        </div>
      </div>

      <section className="section" style={{ background: 'var(--darker)' }}>
        {trainers.length === 0
          ? <div className="empty-state">No trainers added yet — manage via the Content Manager</div>
          : (
            <div className="trainers-grid">
              {trainers.map((t, i) => <TrainerCard key={i} t={t} />)}
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
        <p className="footer-copy">{content.footer?.copyright}</p>
        <ul className="footer-links">
          {(content.footer?.links || []).map((link, i) => <li key={i}><a>{link}</a></li>)}
          <li><a onClick={() => navigate('/manager')}>⚙ Manager</a></li>
        </ul>
      </footer>
    </>
  )
}