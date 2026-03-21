import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getContent } from './contentStore'
import Header from './Header'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;900&family=Barlow+Condensed:wght@400;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root { --dark: #0a0d1a; --darker: #060810; --gold: #c9a84c; --white: #ffffff; --muted: #8a9ab5; }
  body { background: var(--dark); color: var(--white); font-family: 'Barlow', sans-serif; overflow-x: hidden; }

  /* ── Page Header ── */
  .page-header {
    padding: 140px 80px 80px;
    background: var(--darker);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  .page-header h1 {
    font-family: 'Bebas Neue', cursive;
    font-size: clamp(44px, 7vw, 96px);
    line-height: 0.92;
    letter-spacing: 2px;
    color: var(--white);
    margin-bottom: 16px;
  }
  .page-header h1 span { color: var(--gold); }
  .page-header p {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 15px;
    letter-spacing: 2px;
    color: var(--muted);
  }

  /* ── Section ── */
  .section { padding: 80px 80px; }
  .section-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    letter-spacing: 5px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 14px;
  }
  .section-title {
    font-family: 'Bebas Neue', cursive;
    font-size: clamp(34px, 5vw, 64px);
    line-height: 1;
    color: var(--white);
    margin-bottom: 40px;
  }

  /* ── Text rows — no images ── */
  .zz-row {
    display: flex;
    align-items: stretch;
    margin-bottom: 2px;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.05);
    background: rgba(255,255,255,0.02);
    transition: background 0.2s, border-color 0.2s;
  }
  .zz-row:hover {
    background: rgba(201,168,76,0.04);
    border-color: rgba(201,168,76,0.14);
  }
  .zz-row:last-child { margin-bottom: 0; }

  /* Alternating accent rows */
  .zz-row.alt {
    background: rgba(201,168,76,0.03);
    border-color: rgba(201,168,76,0.08);
  }
  .zz-row.alt:hover {
    background: rgba(201,168,76,0.07);
  }

  /* Row number badge */
  .zz-num {
    flex: 0 0 76px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Bebas Neue', cursive;
    font-size: 44px;
    letter-spacing: 1px;
    color: rgba(201,168,76,0.13);
    background: rgba(201,168,76,0.04);
    border-right: 1px solid rgba(201,168,76,0.1);
    flex-shrink: 0;
  }
  .zz-row.alt .zz-num {
    color: rgba(201,168,76,0.22);
    background: rgba(201,168,76,0.07);
    border-right-color: rgba(201,168,76,0.18);
  }

  /* Icon column */
  .zz-icon-col {
    flex: 0 0 68px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 34px;
    font-size: 26px;
    flex-shrink: 0;
  }

  /* Text body */
  .zz-body {
    flex: 1;
    padding: 30px 40px 30px 4px;
    min-width: 0;
  }

  .zz-title {
    font-family: 'Bebas Neue', cursive;
    font-size: clamp(20px, 2.2vw, 30px);
    letter-spacing: 1.5px;
    color: var(--white);
    margin-bottom: 10px;
  }

  .zz-accent {
    display: block;
    width: 32px;
    height: 2px;
    background: var(--gold);
    margin-bottom: 14px;
    border-radius: 1px;
  }

  .zz-desc {
    font-size: 15px;
    line-height: 1.85;
    color: var(--muted);
    max-width: 680px;
  }

  /* ── CTA ── */
  .cta-section {
    padding: 80px 80px;
    background: var(--gold);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
  }
  .cta-text .section-label { color: rgba(0,0,0,0.5); }
  .cta-text .section-title { color: var(--darker); margin-bottom: 0; }
  .btn-dark {
    background: var(--darker);
    color: var(--white);
    border: none;
    padding: 18px 48px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px;
    letter-spacing: 4px;
    font-weight: 700;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.25s;
    flex-shrink: 0;
  }
  .btn-dark:hover { background: #000; }

  /* ── Footer ── */
  .footer {
    background: var(--darker);
    padding: 36px 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid rgba(255,255,255,0.07);
    flex-wrap: wrap;
    gap: 16px;
  }
  .footer-copy {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px;
    letter-spacing: 2px;
    color: var(--muted);
    text-transform: uppercase;
  }
  .footer-links { display: flex; gap: 24px; list-style: none; flex-wrap: wrap; }
  .footer-links a {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    letter-spacing: 3px;
    color: var(--muted);
    text-decoration: none;
    text-transform: uppercase;
    transition: color 0.2s;
    cursor: pointer;
  }
  .footer-links a:hover { color: var(--gold); }

  /* ── Responsive ── */
  @media (max-width: 860px) {
    .page-header { padding: 96px 20px 40px; }
    .section { padding: 52px 20px; }
    .zz-num { flex: 0 0 50px; font-size: 30px; }
    .zz-icon-col { flex: 0 0 44px; font-size: 20px; padding-top: 26px; }
    .zz-body { padding: 22px 16px 22px 0; }
    .zz-desc { font-size: 14px; }
    .cta-section { flex-direction: column; align-items: flex-start; padding: 52px 20px; gap: 24px; }
    .cta-section .btn-dark { width: 100%; text-align: center; }
    .footer { padding: 28px 20px; flex-direction: column; align-items: flex-start; }
    .footer-links { gap: 14px; }
    .section-title { margin-bottom: 28px; }
  }

  @media (max-width: 480px) {
    .zz-num { display: none; }
    .zz-icon-col { flex: 0 0 36px; padding-top: 20px; }
    .zz-body { padding: 18px 12px 18px 0; }
  }
`

const whyUs = [
  { icon: '👥', title: 'Expert Trainers',    desc: '40+ certified professionals with years of real-world coaching experience, ready to guide every step of your fitness journey — from your first session to your biggest milestone.' },
  { icon: '🏋️', title: 'Modern Equipment',   desc: 'The latest fitness technology from top global brands, maintained daily so you never have a reason to hold back. Every machine, every rack, every tool — purpose-built for performance.' },
  { icon: '⏰', title: 'Flexible Hours',     desc: 'Open 24 hours a day, 7 days a week. Your schedule is never an excuse — train at 6 AM before work, or midnight after a long shift. We are always here for you.' },
  { icon: '📊', title: 'Progress Tracking',  desc: 'Advanced analytics and body-composition tools help you see real numbers, not guesswork, at every milestone. Know exactly where you started and how far you have come.' },
  { icon: '🤝', title: 'Community',          desc: '5,000+ active members who motivate, challenge, and celebrate each other — because transformation is better together. Our community is the secret ingredient most gyms are missing.' },
  { icon: '📚', title: 'Education',          desc: 'Regular workshops on nutrition, recovery, and mindset give you the knowledge to stay fit for life, not just for a season. Understand your body and train smarter, not just harder.' },
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

  const foundation = [
    { icon: '🎯', title: 'Our Mission', desc: about.mission || '' },
    { icon: '👁️', title: 'Our Vision',  desc: about.vision  || '' },
    { icon: '💪', title: 'Our Values',  desc: about.values  || '' },
  ]

  // Single reusable row — number badge + icon + title + gold line + paragraph
  const Row = ({ icon, title, desc, index }) => (
    <div className={`zz-row${index % 2 === 1 ? ' alt' : ''}`}>
      <div className="zz-num">{String(index + 1).padStart(2, '0')}</div>
      <div className="zz-icon-col">{icon}</div>
      <div className="zz-body">
        <h3 className="zz-title">{title}</h3>
        <span className="zz-accent" />
        <p className="zz-desc">{desc}</p>
      </div>
    </div>
  )

  return (
    <>
      <style>{styles}</style>
      <Header activePage="ABOUT" />

      {/* ── Page Header ── */}
      <div className="page-header">
        <h1>
          {titleWords[0]}
          {titleWords.slice(1).join(' ')
            ? <> <span>{titleWords.slice(1).join(' ')}</span></>
            : null}
        </h1>
        <p>{about.subtitle || ''}</p>
      </div>

      {/* ── Foundation ── */}
      <section className="section" style={{ background: 'var(--darker)' }}>
        <p className="section-label">Our Foundation</p>
        <h2 className="section-title">What Drives Us</h2>
        {foundation.map((item, i) => (
          <Row key={i} icon={item.icon} title={item.title} desc={item.desc} index={i} />
        ))}
      </section>

      {/* ── Why Us ── */}
      <section className="section" style={{ background: 'var(--dark)' }}>
        <p className="section-label">Why Choose Us</p>
        <h2 className="section-title">What Makes Us Different</h2>
        {whyUs.map((item, i) => (
          <Row key={i} icon={item.icon} title={item.title} desc={item.desc} index={i} />
        ))}
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-text">
          <p className="section-label">Join Us Today</p>
          <h2 className="section-title">Become Part<br />of the Family</h2>
        </div>
        <button className="btn-dark" onClick={() => navigate('/register')}>Get Started</button>
      </section>

      {/* ── Footer ── */}
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