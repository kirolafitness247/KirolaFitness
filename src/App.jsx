import { useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import Manager from './Manager'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;900&family=Barlow+Condensed:wght@400;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --dark: #0a0d1a;
    --darker: #060810;
    --accent: #e8e0d0;
    --gold: #c9a84c;
    --white: #ffffff;
    --muted: #8a9ab5;
  }

  body { background: var(--dark); color: var(--white); font-family: 'Barlow', sans-serif; overflow-x: hidden; }

  /* NAV */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 48px;
    background: linear-gradient(to bottom, rgba(6,8,16,0.95) 0%, transparent 100%);
  }

  .nav-logo {
    display: flex; align-items: center; gap: 12px;
  }

  .logo-emblem {
    width: 64px; height: 64px; border-radius: 50%;
    border: 2px solid var(--gold);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    background: rgba(10,13,26,0.9);
    position: relative;
  }

  .logo-emblem::before {
    content: '✦ GYM ✦';
    font-size: 7px; letter-spacing: 2px; color: var(--gold);
    font-family: 'Barlow Condensed', sans-serif; font-weight: 600;
    display: block; margin-bottom: 2px;
  }

  .logo-emblem-icon {
    font-size: 20px; line-height: 1;
  }

  .logo-emblem::after {
    content: '— SLOGAN HERE —';
    font-size: 5.5px; letter-spacing: 1.5px; color: var(--gold);
    font-family: 'Barlow Condensed', sans-serif;
    display: block; margin-top: 2px;
  }

  .nav-links {
    display: flex; align-items: center; gap: 32px; list-style: none;
  }

  .nav-links a {
    color: var(--white); text-decoration: none;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px; letter-spacing: 3px; font-weight: 600;
    text-transform: uppercase; transition: color 0.2s;
    position: relative; cursor: pointer;
  }

  .nav-links a.active::after {
    content: ''; position: absolute; bottom: -4px; left: 0; right: 0;
    height: 2px; background: var(--white);
  }

  .nav-links a:hover { color: var(--gold); }

  .nav-right {
    display: flex; align-items: center; gap: 20px;
  }

  .heart-btn {
    background: none; border: none; cursor: pointer;
    color: var(--white); font-size: 22px; transition: color 0.2s;
    display: flex; align-items: center;
  }
  .heart-btn:hover { color: #e63946; }

  /* HERO */
  .hero {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    position: relative;
    overflow: hidden;
  }

  .hero-image-side {
    position: relative; overflow: hidden;
  }

  .hero-image-side::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(to right, transparent 60%, var(--dark) 100%);
    z-index: 2;
  }

  .hero-img-placeholder {
    width: 100%; height: 100%;
    background: linear-gradient(135deg, #1a1f35 0%, #0d1020 50%, #060810 100%);
    display: flex; align-items: center; justify-content: center;
    position: relative;
  }

  .stripe-decor {
    position: absolute; top: 120px; left: 30px;
    display: flex; gap: 8px; transform: rotate(-8deg);
    z-index: 10;
  }

  .stripe {
    width: 32px; height: 80px;
    background: var(--white);
    clip-path: polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%);
    opacity: 0.85;
  }

  .stripe-right {
    position: absolute; right: -30px; bottom: 60px;
    display: flex; flex-direction: column; gap: 4px; z-index: 10;
  }

  .chevron {
    width: 60px; height: 36px;
    clip-path: polygon(0% 0%, 60% 0%, 100% 50%, 60% 100%, 0% 100%, 40% 50%);
    background: var(--white); opacity: 0.7;
  }

  .zigzag-decor {
    position: absolute; top: 140px; right: 80px;
    z-index: 10;
  }

  .zigzag-decor svg { opacity: 0.4; }

  .hero-content-side {
    display: flex; flex-direction: column;
    justify-content: center; padding: 120px 64px 80px 40px;
    position: relative; z-index: 5;
  }

  .hero-eyebrow {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px; letter-spacing: 4px; font-weight: 600;
    color: var(--gold); text-transform: uppercase;
    margin-bottom: 20px;
    display: flex; align-items: center; gap: 12px;
  }

  .hero-eyebrow::before {
    content: ''; display: block; width: 32px; height: 2px; background: var(--gold);
  }

  .hero-title {
    font-family: 'Bebas Neue', cursive;
    font-size: clamp(72px, 8vw, 110px);
    line-height: 0.92;
    letter-spacing: 2px;
    color: var(--white);
    margin-bottom: 24px;
    animation: slideUp 0.8s ease forwards;
  }

  .hero-title span { color: var(--gold); }

  .hero-subtitle {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 14px; letter-spacing: 5px; font-weight: 600;
    text-transform: uppercase; color: var(--muted);
    margin-bottom: 44px;
  }

  .hero-cta {
    display: flex; align-items: center; gap: 20px;
  }

  .btn-primary {
    background: var(--white); color: var(--darker);
    border: none; padding: 16px 40px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px; letter-spacing: 4px; font-weight: 700;
    text-transform: uppercase; cursor: pointer;
    transition: all 0.25s;
    position: relative; overflow: hidden;
  }

  .btn-primary:hover { background: var(--gold); }

  .btn-outline {
    background: transparent; color: var(--white);
    border: 1px solid rgba(255,255,255,0.3); padding: 16px 32px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px; letter-spacing: 4px; font-weight: 600;
    text-transform: uppercase; cursor: pointer; transition: all 0.25s;
  }

  .btn-outline:hover { border-color: var(--gold); color: var(--gold); }

  /* STATS BAR */
  .stats-bar {
    background: var(--gold);
    padding: 24px 80px;
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 0;
  }

  .stat-item {
    display: flex; flex-direction: column; align-items: center;
    padding: 0 20px; border-right: 1px solid rgba(0,0,0,0.2);
  }
  .stat-item:last-child { border-right: none; }

  .stat-num {
    font-family: 'Bebas Neue', cursive;
    font-size: 40px; line-height: 1; color: var(--darker);
  }

  .stat-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px; letter-spacing: 3px; font-weight: 700;
    text-transform: uppercase; color: rgba(0,0,0,0.6);
    margin-top: 4px;
  }

  /* FEATURES SECTION */
  .features {
    padding: 100px 80px;
    background: var(--darker);
    position: relative;
  }

  .section-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px; letter-spacing: 5px; font-weight: 700;
    text-transform: uppercase; color: var(--gold);
    margin-bottom: 16px;
  }

  .section-title {
    font-family: 'Bebas Neue', cursive;
    font-size: clamp(48px, 5vw, 72px);
    line-height: 1; color: var(--white);
    margin-bottom: 60px;
  }

  .features-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 2px;
  }

  .feature-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    padding: 40px 32px;
    position: relative; overflow: hidden;
    transition: background 0.3s, border-color 0.3s;
    cursor: default;
  }

  .feature-card:hover {
    background: rgba(201,168,76,0.06);
    border-color: rgba(201,168,76,0.25);
  }

  .feature-card:hover .feature-icon { color: var(--gold); }

  .feature-icon {
    font-size: 36px; margin-bottom: 20px;
    display: block; transition: color 0.3s; color: var(--white);
  }

  .feature-title {
    font-family: 'Bebas Neue', cursive;
    font-size: 28px; letter-spacing: 1px;
    color: var(--white); margin-bottom: 12px;
  }

  .feature-desc {
    font-size: 14px; line-height: 1.7; color: var(--muted);
  }

  /* CLASSES SECTION */
  .classes {
    padding: 100px 80px;
    background: var(--dark);
  }

  .classes-header {
    display: flex; justify-content: space-between; align-items: flex-end;
    margin-bottom: 48px;
  }

  .classes-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
  }

  .class-card {
    position: relative; overflow: hidden; aspect-ratio: 3/4;
    background: #1a1f35;
    cursor: pointer;
  }

  .class-card:first-child {
    grid-row: span 2; aspect-ratio: auto;
  }

  .class-card-bg {
    position: absolute; inset: 0;
    background-size: cover; background-position: center;
    transition: transform 0.5s ease;
  }

  .class-card:hover .class-card-bg { transform: scale(1.05); }

  .class-card-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(6,8,16,0.9) 0%, transparent 60%);
  }

  .class-card-content {
    position: absolute; bottom: 0; left: 0; right: 0; padding: 28px;
  }

  .class-tag {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px; letter-spacing: 3px; font-weight: 700;
    text-transform: uppercase; color: var(--gold);
    margin-bottom: 8px; display: block;
  }

  .class-name {
    font-family: 'Bebas Neue', cursive;
    font-size: 32px; color: var(--white); line-height: 1;
  }

  /* CTA SECTION */
  .cta-section {
    padding: 100px 80px;
    background: var(--gold);
    display: flex; align-items: center; justify-content: space-between;
    gap: 40px;
  }

  .cta-text .section-label { color: rgba(0,0,0,0.5); }
  .cta-text .section-title { color: var(--darker); margin-bottom: 0; }

  .btn-dark {
    background: var(--darker); color: var(--white);
    border: none; padding: 20px 52px; white-space: nowrap;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px; letter-spacing: 4px; font-weight: 700;
    text-transform: uppercase; cursor: pointer; transition: all 0.25s;
    flex-shrink: 0;
  }

  .btn-dark:hover { background: #000; }

  /* FOOTER */
  .footer {
    background: var(--darker); padding: 40px 80px;
    display: flex; align-items: center; justify-content: space-between;
    border-top: 1px solid rgba(255,255,255,0.07);
  }

  .footer-copy {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px; letter-spacing: 2px; color: var(--muted);
    text-transform: uppercase;
  }

  .footer-links {
    display: flex; gap: 28px; list-style: none;
  }

  .footer-links a {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px; letter-spacing: 3px; color: var(--muted);
    text-decoration: none; text-transform: uppercase; transition: color 0.2s;
    cursor: pointer;
  }

  .footer-links a:hover { color: var(--gold); }

  .footer-links a.manager-link {
    color: var(--gold);
    border-bottom: 1px solid rgba(201,168,76,0.4);
    padding-bottom: 2px;
  }

  .footer-links a.manager-link:hover { color: #fff; border-color: #fff; }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .gym-silhouette {
    position: absolute; width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    opacity: 0.06;
  }

  @media (max-width: 900px) {
    .hero { grid-template-columns: 1fr; }
    .hero-image-side { height: 50vh; }
    .features-grid, .classes-grid { grid-template-columns: 1fr; }
    .stats-bar { grid-template-columns: repeat(2,1fr); }
    .nav { padding: 16px 24px; }
    .features, .classes, .cta-section { padding: 60px 24px; }
    .footer { flex-direction: column; gap: 20px; }
  }
`

const features = [
  { icon: '🏋️', title: 'Elite Equipment', desc: 'Train with top-of-the-line machines, free weights, and functional training gear for every discipline.' },
  { icon: '🔥', title: 'Expert Coaches', desc: 'Our certified trainers push you beyond limits with personalized programming and relentless support.' },
  { icon: '⚡', title: 'Group Classes', desc: 'From HIIT to yoga — 50+ weekly classes designed to challenge, transform, and energize every body.' },
  { icon: '🥊', title: 'Combat Training', desc: 'Boxing, MMA, and kickboxing programs for all skill levels. Build discipline inside and out.' },
  { icon: '🧘', title: 'Recovery Zone', desc: 'Infrared saunas, cold plunge pools, and stretching areas to keep your body performing at its best.' },
  { icon: '📊', title: 'Progress Tracking', desc: 'Smart tools and fitness assessments to measure your growth and keep motivation razor-sharp.' },
]

const classes = [
  { tag: 'Strength', name: 'Power Lifting', bg: 'linear-gradient(135deg,#1a2535,#0d1525)' },
  { tag: 'Cardio', name: 'HIIT Blast', bg: 'linear-gradient(135deg,#1f1a30,#120d20)' },
  { tag: 'Flexibility', name: 'Yoga Flow', bg: 'linear-gradient(135deg,#1a2520,#0d1a10)' },
]

// ── Inner home page component (needs useNavigate inside BrowserRouter) ──
function HomePage() {
  const [liked, setLiked] = useState(false)
  const [active, setActive] = useState('HOME')
  const navigate = useNavigate()

  return (
    <>
      <style>{styles}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo">
          <div className="logo-emblem">
            <span className="logo-emblem-icon">⚔️</span>
          </div>
        </div>
        <ul className="nav-links">
          {['HOME', 'ABOUT', 'CLASSES', 'TRAINERS', 'REGISTER'].map(link => (
            <li key={link}>
              <a
                className={active === link ? 'active' : ''}
                onClick={e => { e.preventDefault(); setActive(link) }}
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-right">
          <button className="heart-btn" onClick={() => setLiked(l => !l)} aria-label="Favorite">
            {liked ? '❤️' : '🤍'}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-image-side">
          <div className="stripe-decor">
            <div className="stripe"></div>
            <div className="stripe"></div>
            <div className="stripe"></div>
            <div className="stripe"></div>
          </div>

          <div className="zigzag-decor">
            <svg width="120" height="16" viewBox="0 0 120 16">
              <polyline points="0,8 10,0 20,8 30,0 40,8 50,0 60,8 70,0 80,8 90,0 100,8 110,0 120,8"
                fill="none" stroke="white" strokeWidth="2"/>
            </svg>
          </div>

          <div className="hero-img-placeholder">
            <div className="gym-silhouette">
              <svg viewBox="0 0 400 400" fill="white" width="380">
                <ellipse cx="200" cy="180" rx="40" ry="50" />
                <rect x="170" y="225" width="20" height="80" />
                <rect x="210" y="225" width="20" height="80" />
                <rect x="60" y="175" width="280" height="28" rx="14" />
                <rect x="60" y="175" width="60" height="28" rx="14" />
                <rect x="280" y="175" width="60" height="28" rx="14" />
                <rect x="40" y="165" width="50" height="50" rx="25" />
                <rect x="310" y="165" width="50" height="50" rx="25" />
              </svg>
            </div>
            <div className="stripe-right">
              <div className="chevron"></div>
              <div className="chevron" style={{opacity:0.5}}></div>
            </div>
          </div>
        </div>

        <div className="hero-content-side">
          <p className="hero-eyebrow">Elite Fitness Center</p>
          <h1 className="hero-title">
            Achieve<br />Your<br />
            <span>Fitness</span><br />Goals
          </h1>
          <p className="hero-subtitle">Become a Member Today</p>
          <div className="hero-cta">
            <button className="btn-primary">Register Now</button>
            <button className="btn-outline">Learn More</button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-bar">
        {[
          { num: '5K+', label: 'Active Members' },
          { num: '120+', label: 'Weekly Classes' },
          { num: '40+', label: 'Expert Trainers' },
          { num: '15', label: 'Years of Excellence' },
        ].map(s => (
          <div className="stat-item" key={s.label}>
            <span className="stat-num">{s.num}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <section className="features">
        <p className="section-label">Why Choose Us</p>
        <h2 className="section-title">World-Class<br />Facilities</h2>
        <div className="features-grid">
          {features.map(f => (
            <div className="feature-card" key={f.title}>
              <span className="feature-icon">{f.icon}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CLASSES */}
      <section className="classes">
        <div className="classes-header">
          <div>
            <p className="section-label">What We Offer</p>
            <h2 className="section-title" style={{marginBottom:0}}>Our Classes</h2>
          </div>
          <button className="btn-outline">View All Classes</button>
        </div>
        <div className="classes-grid">
          {classes.map((c, i) => (
            <div className="class-card" key={c.name} style={i === 0 ? {gridRow:'span 2'} : {}}>
              <div className="class-card-bg" style={{background: c.bg}}></div>
              <div className="class-card-overlay"></div>
              <div className="class-card-content">
                <span className="class-tag">{c.tag}</span>
                <h3 className="class-name">{c.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-text">
          <p className="section-label">Limited Spots Available</p>
          <h2 className="section-title">Start Your<br />Journey Today</h2>
        </div>
        <button className="btn-dark">Register Now</button>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p className="footer-copy">© 2025 GYM — All Rights Reserved</p>
        <ul className="footer-links">
          <li><a>Privacy</a></li>
          <li><a>Terms</a></li>
          <li><a>Contact</a></li>
          <li><a>Instagram</a></li>
          <li>
            <a className="manager-link" onClick={() => navigate('/manager')}>
              ⚙ Manager
            </a>
          </li>
        </ul>
      </footer>
    </>
  )
}

// ── Root export with Router + Routes ──
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/manager" element={<Manager />} />
      </Routes>
    </BrowserRouter>
  )
}