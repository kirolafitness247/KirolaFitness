import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getContent } from './contentStore'
import Header from './Header'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;900&family=Barlow+Condensed:wght@400;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root { --dark: #0a0d1a; --darker: #060810; --gold: #c9a84c; --white: #ffffff; --muted: #8a9ab5; }
  body { background: var(--dark); color: var(--white); font-family: 'Barlow', sans-serif; overflow-x: hidden; }

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

  /* ── Section wrapper ── */
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
    margin-bottom: 56px;
  }

  /* ── Zigzag row ── */
  .zz-row {
    display: flex;
    align-items: center;
    gap: 64px;
    margin-bottom: 72px;
  }
  .zz-row:last-child { margin-bottom: 0; }
  .zz-row.reverse { flex-direction: row-reverse; }

  .zz-img-wrap {
    flex: 0 0 42%;
    max-width: 42%;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }
  .zz-img-wrap img {
    width: 100%;
    height: 320px;
    object-fit: cover;
    display: block;
  }
  /* Placeholder when no real image */
  .zz-img-placeholder {
    width: 100%;
    height: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 4px;
  }
  .zz-img-placeholder .placeholder-icon { font-size: 52px; opacity: 0.18; }
  .zz-img-placeholder .placeholder-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.15);
  }

  .zz-text { flex: 1; }
  .zz-icon {
    font-size: 36px;
    margin-bottom: 14px;
    display: block;
    line-height: 1;
  }
  .zz-title {
    font-family: 'Bebas Neue', cursive;
    font-size: clamp(26px, 3vw, 40px);
    letter-spacing: 1px;
    color: var(--white);
    margin-bottom: 16px;
  }
  .zz-desc {
    font-size: 15px;
    line-height: 1.8;
    color: var(--muted);
    max-width: 480px;
  }
  .zz-accent {
    display: block;
    width: 40px;
    height: 2px;
    background: var(--gold);
    margin: 20px 0;
    border-radius: 1px;
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
    .zz-row,
    .zz-row.reverse { flex-direction: column; gap: 32px; }
    .zz-img-wrap { flex: none; max-width: 100%; width: 100%; }
    .zz-img-wrap img { height: 220px; }
    .zz-img-placeholder { height: 200px; }
    .zz-desc { max-width: 100%; }
    .cta-section { flex-direction: column; align-items: flex-start; padding: 52px 20px; gap: 24px; }
    .cta-section .btn-dark { width: 100%; text-align: center; }
    .footer { padding: 28px 20px; flex-direction: column; align-items: flex-start; }
    .footer-links { gap: 14px; }
    .section-title { margin-bottom: 36px; }
  }
`

// Foundation items — icon, title, desc pulled from CMS; images are placeholders
// (swap src strings for real image URLs if you have them)
const foundationImages = [null, null, null]

const whyUs = [
  { icon: '👥', title: 'Expert Trainers',    desc: '40+ certified professionals with years of real-world coaching experience, ready to guide every step of your fitness journey.' },
  { icon: '🏋️', title: 'Modern Equipment',   desc: 'The latest fitness technology from top global brands — maintained daily so you never have a reason to hold back.' },
  { icon: '⏰', title: 'Flexible Hours',     desc: 'Open 24 hours a day, 7 days a week. Your schedule is never an excuse — train whenever it fits your life.' },
  { icon: '📊', title: 'Progress Tracking',  desc: 'Advanced analytics and body-composition tools help you see real numbers, not guesswork, at every milestone.' },
  { icon: '🤝', title: 'Community',          desc: '5,000+ active members who motivate, challenge, and celebrate each other — because transformation is better together.' },
  { icon: '📚', title: 'Education',          desc: 'Regular workshops on nutrition, recovery, and mindset give you the knowledge to stay fit for life, not just for a season.' },
]

// Placeholder image visuals keyed by icon
const whyImages = [null, null, null, null, null, null]

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

  const ImgOrPlaceholder = ({ src, icon, label }) => (
    <div className="zz-img-wrap">
      {src
        ? <img src={src} alt={label} />
        : (
          <div className="zz-img-placeholder">
            <span className="placeholder-icon">{icon}</span>
            <span className="placeholder-label">{label}</span>
          </div>
        )
      }
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

      {/* ── Foundation zigzag ── */}
      <section className="section" style={{ background: 'var(--darker)' }}>
        <p className="section-label">Our Foundation</p>
        <h2 className="section-title">What Drives Us</h2>

        {foundation.map((item, i) => (
          <div key={i} className={`zz-row${i % 2 === 1 ? ' reverse' : ''}`}>
            <ImgOrPlaceholder
              src={foundationImages[i]}
              icon={item.icon}
              label={item.title}
            />
            <div className="zz-text">
              <span className="zz-icon">{item.icon}</span>
              <h3 className="zz-title">{item.title}</h3>
              <span className="zz-accent" />
              <p className="zz-desc">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── Why Us zigzag ── */}
      <section className="section" style={{ background: 'var(--dark)' }}>
        <p className="section-label">Why Choose Us</p>
        <h2 className="section-title">What Makes Us Different</h2>

        {whyUs.map((item, i) => (
          <div key={i} className={`zz-row${i % 2 === 1 ? ' reverse' : ''}`}>
            <ImgOrPlaceholder
              src={whyImages[i]}
              icon={item.icon}
              label={item.title}
            />
            <div className="zz-text">
              <span className="zz-icon">{item.icon}</span>
              <h3 className="zz-title">{item.title}</h3>
              <span className="zz-accent" />
              <p className="zz-desc">{item.desc}</p>
            </div>
          </div>
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