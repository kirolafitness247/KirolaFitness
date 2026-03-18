import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getContent } from './contentStore'
import Header from './Header'

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
  .section-label { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 5px; font-weight: 700; text-transform: uppercase; color: var(--gold); margin-bottom: 14px; }
  .section-title { font-family: 'Bebas Neue', cursive; font-size: clamp(34px, 5vw, 64px); line-height: 1; color: var(--white); margin-bottom: 40px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
  .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 36px 28px; transition: all 0.3s; }
  .card:hover { background: rgba(201,168,76,0.06); border-color: rgba(201,168,76,0.25); transform: translateY(-4px); }
  .card-icon { font-size: 40px; margin-bottom: 16px; display: block; }
  .card-title { font-family: 'Bebas Neue', cursive; font-size: 26px; letter-spacing: 1px; color: var(--white); margin-bottom: 10px; }
  .card-desc { font-size: 14px; line-height: 1.7; color: var(--muted); }

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
    .grid-3 { grid-template-columns: 1fr; }
    .cta-section { flex-direction: column; align-items: flex-start; padding: 52px 20px; gap: 24px; }
    .cta-section .btn-dark { width: 100%; text-align: center; }
    .footer { padding: 28px 20px; flex-direction: column; align-items: flex-start; }
    .footer-links { gap: 14px; }
    .card { padding: 28px 20px; }
    .section-title { margin-bottom: 28px; }
  }
`

const whyUs = [
  { icon: '👥', title: 'Expert Trainers',   desc: '40+ certified professionals with years of experience' },
  { icon: '🏋️', title: 'Modern Equipment',  desc: 'Latest fitness technology from top brands' },
  { icon: '⏰', title: 'Flexible Hours',    desc: 'Open 24/7 for all members' },
  { icon: '📊', title: 'Progress Tracking', desc: 'Advanced tools to monitor your journey' },
  { icon: '🤝', title: 'Community',         desc: '5000+ active members supporting each other' },
  { icon: '📚', title: 'Education',         desc: 'Regular workshops and nutrition guidance' },
]

export default function About() {
  const navigate  = useNavigate()
  const [content, setContent] = useState(getContent())

  useEffect(() => {
    const h = () => setContent(getContent())
    window.addEventListener('contentUpdated', h)
    return () => window.removeEventListener('contentUpdated', h)
  }, [])

  const about      = content.about || {}
  const titleWords = (about.title || 'About Our Gym').split(' ')

  return (
    <>
      <style>{styles}</style>
      <Header activePage="ABOUT" />

      <div className="page-header">
        <h1>{titleWords[0]}{titleWords.slice(1).join(' ') ? <> <span>{titleWords.slice(1).join(' ')}</span></> : null}</h1>
        <p>{about.subtitle || ''}</p>
      </div>

      <section className="section" style={{ background: 'var(--darker)' }}>
        <p className="section-label">Our Foundation</p>
        <h2 className="section-title">What Drives Us</h2>
        <div className="grid-3">
          {[
            { icon: '🎯', title: 'Our Mission', desc: about.mission || '' },
            { icon: '👁️', title: 'Our Vision',  desc: about.vision  || '' },
            { icon: '💪', title: 'Our Values',  desc: about.values  || '' },
          ].map((item, i) => (
            <div key={i} className="card">
              <span className="card-icon">{item.icon}</span>
              <h3 className="card-title">{item.title}</h3>
              <p className="card-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{ background: 'var(--dark)' }}>
        <p className="section-label">Why Choose Us</p>
        <h2 className="section-title">What Makes Us Different</h2>
        <div className="grid-3">
          {whyUs.map((item, i) => (
            <div key={i} className="card">
              <span className="card-icon">{item.icon}</span>
              <h3 className="card-title">{item.title}</h3>
              <p className="card-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-text">
          <p className="section-label">Join Us Today</p>
          <h2 className="section-title">Become Part<br />of the Family</h2>
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