import { useState, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import Manager from './Manager'
import About from './About'
import Classes from './Classes'
import Trainers from './Trainers'
import Equipment from './Equipment'
import Events from './Events'
import Register from './Register'
import { getContent, fetchContent } from './contentStore'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;900&family=Barlow+Condensed:wght@400;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --dark: #0a0d1a;
    --darker: #060810;
    --gold: #c9a84c;
    --white: #ffffff;
    --muted: #8a9ab5;
  }

  body { background: var(--dark); color: var(--white); font-family: 'Barlow', sans-serif; overflow-x: hidden; }

  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 48px;
    background: linear-gradient(to bottom, rgba(6,8,16,0.95) 0%, transparent 100%);
  }
  .nav-logo { display: flex; align-items: center; gap: 12px; }
  .logo-emblem { width: 64px; height: 64px; border-radius: 50%; border: 2px solid var(--gold); display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(10,13,26,0.9); position: relative; }
  .logo-emblem::before { content: '✦ GYM ✦'; font-size: 7px; letter-spacing: 2px; color: var(--gold); font-family: 'Barlow Condensed', sans-serif; font-weight: 600; display: block; margin-bottom: 2px; }
  .logo-emblem-icon { font-size: 20px; line-height: 1; }
  .logo-emblem::after { content: '— SLOGAN HERE —'; font-size: 5.5px; letter-spacing: 1.5px; color: var(--gold); font-family: 'Barlow Condensed', sans-serif; display: block; margin-top: 2px; }
  .nav-links { display: flex; align-items: center; gap: 32px; list-style: none; }
  .nav-links a { color: var(--white); text-decoration: none; font-family: 'Barlow Condensed', sans-serif; font-size: 13px; letter-spacing: 3px; font-weight: 600; text-transform: uppercase; transition: color 0.2s; position: relative; cursor: pointer; }
  .nav-links a.active::after { content: ''; position: absolute; bottom: -4px; left: 0; right: 0; height: 2px; background: var(--white); }
  .nav-links a:hover { color: var(--gold); }
  .nav-right { display: flex; align-items: center; gap: 20px; }
  .heart-btn { background: none; border: none; cursor: pointer; color: var(--white); font-size: 22px; transition: color 0.2s; display: flex; align-items: center; }
  .heart-btn:hover { color: #e63946; }

  .hero { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; position: relative; overflow: hidden; }
  .hero-image-side { position: relative; overflow: hidden; }
  .hero-image-side::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to right, transparent 60%, var(--dark) 100%); z-index: 3; pointer-events: none; }

  /* CAROUSEL */
  .hero-carousel { position: absolute; inset: 0; width: 100%; height: 100%; overflow: hidden; }
  .hero-carousel-track { display: flex; height: 100%; transition: transform 0.85s cubic-bezier(0.77, 0, 0.175, 1); will-change: transform; }
  .hero-carousel-slide { flex: 0 0 100%; width: 100%; height: 100%; position: relative; overflow: hidden; }
  .hero-carousel-img { width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; }
  .hero-carousel-slide.active .hero-carousel-img { animation: kenBurns 3.5s ease-out forwards; }
  @keyframes kenBurns { from { transform: scale(1.1); } to { transform: scale(1.0); } }
  .hero-img-overlay { position: absolute; inset: 0; z-index: 1; background: linear-gradient(160deg, rgba(6,8,16,0.15) 0%, transparent 50%, rgba(6,8,16,0.3) 100%); }

  .carousel-dots { position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; z-index: 10; }
  .carousel-dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,0.3); border: 1px solid rgba(255,255,255,0.2); cursor: pointer; padding: 0; transition: all 0.35s ease; }
  .carousel-dot.active { background: var(--gold); border-color: var(--gold); width: 28px; border-radius: 4px; }
  .carousel-progress { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; z-index: 10; background: rgba(255,255,255,0.07); }
  .carousel-progress-fill { height: 100%; background: var(--gold); width: 0%; }
  .carousel-progress-fill.running { animation: fillBar 3s linear forwards; }
  @keyframes fillBar { from { width: 0%; } to { width: 100%; } }
  .carousel-arrow { position: absolute; top: 50%; transform: translateY(-50%); z-index: 10; background: rgba(10,13,26,0.6); border: 1px solid rgba(201,168,76,0.25); color: var(--white); cursor: pointer; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; font-size: 18px; backdrop-filter: blur(6px); opacity: 0; transition: opacity 0.3s, background 0.2s; }
  .hero-image-side:hover .carousel-arrow { opacity: 1; }
  .carousel-arrow:hover { background: var(--gold); color: var(--darker); border-color: var(--gold); }
  .carousel-arrow-prev { left: 16px; }
  .carousel-arrow-next { right: 16px; }
  .carousel-counter { position: absolute; top: 24px; right: 24px; z-index: 10; font-family: 'Barlow Condensed', sans-serif; font-size: 12px; letter-spacing: 3px; font-weight: 700; color: rgba(255,255,255,0.4); background: rgba(6,8,16,0.45); padding: 5px 10px; backdrop-filter: blur(4px); }
  .carousel-counter span { color: var(--gold); }

  .hero-img-placeholder { width: 100%; height: 100%; background: linear-gradient(135deg, #1a1f35 0%, #0d1020 50%, #060810 100%); display: flex; align-items: center; justify-content: center; position: relative; }
  .stripe-decor { position: absolute; top: 120px; left: 30px; display: flex; gap: 8px; transform: rotate(-8deg); z-index: 10; }
  .stripe { width: 32px; height: 80px; background: var(--white); clip-path: polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%); opacity: 0.85; }
  .stripe-right { position: absolute; right: -30px; bottom: 60px; display: flex; flex-direction: column; gap: 4px; z-index: 10; }
  .chevron { width: 60px; height: 36px; clip-path: polygon(0% 0%, 60% 0%, 100% 50%, 60% 100%, 0% 100%, 40% 50%); background: var(--white); opacity: 0.7; }
  .zigzag-decor { position: absolute; top: 140px; right: 80px; z-index: 10; }
  .zigzag-decor svg { opacity: 0.4; }

  .hero-content-side { display: flex; flex-direction: column; justify-content: center; padding: 120px 64px 80px 40px; position: relative; z-index: 5; }
  .hero-eyebrow { font-family: 'Barlow Condensed', sans-serif; font-size: 12px; letter-spacing: 4px; font-weight: 600; color: var(--gold); text-transform: uppercase; margin-bottom: 20px; display: flex; align-items: center; gap: 12px; }
  .hero-eyebrow::before { content: ''; display: block; width: 32px; height: 2px; background: var(--gold); }
  .hero-title { font-family: 'Bebas Neue', cursive; font-size: clamp(72px, 8vw, 110px); line-height: 0.92; letter-spacing: 2px; color: var(--white); margin-bottom: 24px; animation: slideUp 0.8s ease forwards; }
  .hero-subtitle { font-family: 'Barlow Condensed', sans-serif; font-size: 14px; letter-spacing: 5px; font-weight: 600; text-transform: uppercase; color: var(--muted); margin-bottom: 44px; }
  .hero-cta { display: flex; align-items: center; gap: 20px; }

  .btn-primary { background: var(--white); color: var(--darker); border: none; padding: 16px 40px; font-family: 'Barlow Condensed', sans-serif; font-size: 13px; letter-spacing: 4px; font-weight: 700; text-transform: uppercase; cursor: pointer; transition: all 0.25s; }
  .btn-primary:hover { background: var(--gold); }
  .btn-outline { background: transparent; color: var(--white); border: 1px solid rgba(255,255,255,0.3); padding: 16px 32px; font-family: 'Barlow Condensed', sans-serif; font-size: 13px; letter-spacing: 4px; font-weight: 600; text-transform: uppercase; cursor: pointer; transition: all 0.25s; }
  .btn-outline:hover { border-color: var(--gold); color: var(--gold); }

  .stats-bar { background: var(--gold); padding: 24px 80px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; }
  .stat-item { display: flex; flex-direction: column; align-items: center; padding: 0 20px; border-right: 1px solid rgba(0,0,0,0.2); }
  .stat-item:last-child { border-right: none; }
  .stat-num { font-family: 'Bebas Neue', cursive; font-size: 40px; line-height: 1; color: var(--darker); }
  .stat-label { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 3px; font-weight: 700; text-transform: uppercase; color: rgba(0,0,0,0.6); margin-top: 4px; }

  .features { padding: 100px 80px; background: var(--darker); position: relative; }
  .section-label { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 5px; font-weight: 700; text-transform: uppercase; color: var(--gold); margin-bottom: 16px; }
  .section-title { font-family: 'Bebas Neue', cursive; font-size: clamp(48px, 5vw, 72px); line-height: 1; color: var(--white); margin-bottom: 60px; }
  .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
  .feature-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 40px 32px; position: relative; overflow: hidden; transition: background 0.3s, border-color 0.3s; cursor: default; }
  .feature-card:hover { background: rgba(201,168,76,0.06); border-color: rgba(201,168,76,0.25); }
  .feature-card:hover .feature-icon { color: var(--gold); }
  .feature-icon { font-size: 36px; margin-bottom: 20px; display: block; transition: color 0.3s; color: var(--white); }
  .feature-title { font-family: 'Bebas Neue', cursive; font-size: 28px; letter-spacing: 1px; color: var(--white); margin-bottom: 12px; }
  .feature-desc { font-size: 14px; line-height: 1.7; color: var(--muted); }

  .classes { padding: 100px 80px; background: var(--dark); }
  .classes-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 48px; }
  .classes-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .class-card { position: relative; overflow: hidden; aspect-ratio: 3/4; background: #1a1f35; cursor: pointer; }
  .class-card:first-child { grid-row: span 2; aspect-ratio: auto; }
  .class-card-bg { position: absolute; inset: 0; background-size: cover; background-position: center; transition: transform 0.5s ease; }
  .class-card:hover .class-card-bg { transform: scale(1.05); }
  .class-card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(6,8,16,0.9) 0%, transparent 60%); }
  .class-card-content { position: absolute; bottom: 0; left: 0; right: 0; padding: 28px; }
  .class-tag { font-family: 'Barlow Condensed', sans-serif; font-size: 10px; letter-spacing: 3px; font-weight: 700; text-transform: uppercase; color: var(--gold); margin-bottom: 8px; display: block; }
  .class-name { font-family: 'Bebas Neue', cursive; font-size: 32px; color: var(--white); line-height: 1; }

  .cta-section { padding: 100px 80px; background: var(--gold); display: flex; align-items: center; justify-content: space-between; gap: 40px; }
  .cta-text .section-label { color: rgba(0,0,0,0.5); }
  .cta-text .section-title { color: var(--darker); margin-bottom: 0; }
  .btn-dark { background: var(--darker); color: var(--white); border: none; padding: 20px 52px; white-space: nowrap; font-family: 'Barlow Condensed', sans-serif; font-size: 13px; letter-spacing: 4px; font-weight: 700; text-transform: uppercase; cursor: pointer; transition: all 0.25s; flex-shrink: 0; }
  .btn-dark:hover { background: #000; }

  .footer { background: var(--darker); padding: 40px 80px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.07); }
  .footer-copy { font-family: 'Barlow Condensed', sans-serif; font-size: 12px; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; }
  .footer-links { display: flex; gap: 28px; list-style: none; }
  .footer-links a { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 3px; color: var(--muted); text-decoration: none; text-transform: uppercase; transition: color 0.2s; cursor: pointer; }
  .footer-links a:hover { color: var(--gold); }
  .footer-links a.manager-link { color: var(--gold); border-bottom: 1px solid rgba(201,168,76,0.4); padding-bottom: 2px; }
  .footer-links a.manager-link:hover { color: #fff; border-color: #fff; }

  @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  .gym-silhouette { position: absolute; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; opacity: 0.06; }

  /* Loading skeleton */
  .page-loading { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: var(--darker); }
  .loading-spinner { width: 48px; height: 48px; border: 3px solid rgba(201,168,76,0.2); border-top-color: var(--gold); border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 900px) {
    .hero { grid-template-columns: 1fr; }
    .hero-image-side { height: 50vh; }
    .features-grid, .classes-grid { grid-template-columns: 1fr; }
    .stats-bar { grid-template-columns: repeat(2,1fr); }
    .nav { padding: 16px 24px; }
    .features, .classes, .cta-section { padding: 60px 24px; }
    .footer { flex-direction: column; gap: 20px; }
    .carousel-arrow { opacity: 1; }
  }
`

// ── Hero Carousel ──
function HeroCarousel({ images }) {
  const [current, setCurrent] = useState(0)
  const [progKey, setProgKey] = useState(0)
  const timerRef = useRef(null)
  const total = images.length

  const startTimer = () => {
    clearInterval(timerRef.current)
    if (total <= 1) return
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % total)
      setProgKey(k => k + 1)
    }, 3000)
  }

  useEffect(() => { startTimer(); return () => clearInterval(timerRef.current) }, [total])

  const goTo = (index) => {
    setCurrent(((index % total) + total) % total)
    setProgKey(k => k + 1)
    startTimer()
  }

  return (
    <div className="hero-carousel">
      <div className="hero-carousel-track" style={{ transform: `translateX(-${current * 100}%)` }}>
        {images.map((src, i) => (
          <div key={i} className={`hero-carousel-slide${i === current ? ' active' : ''}`}>
            <img src={src} alt={`Slide ${i+1}`} className="hero-carousel-img" />
            <div className="hero-img-overlay" />
          </div>
        ))}
      </div>

      <div className="stripe-decor" style={{zIndex:10}}>
        <div className="stripe"/><div className="stripe"/><div className="stripe"/><div className="stripe"/>
      </div>
      <div className="zigzag-decor" style={{zIndex:10}}>
        <svg width="120" height="16" viewBox="0 0 120 16">
          <polyline points="0,8 10,0 20,8 30,0 40,8 50,0 60,8 70,0 80,8 90,0 100,8 110,0 120,8" fill="none" stroke="white" strokeWidth="2"/>
        </svg>
      </div>
      <div className="stripe-right" style={{zIndex:10}}>
        <div className="chevron"/><div className="chevron" style={{opacity:0.5}}/>
      </div>

      {total > 1 && (
        <>
          <div className="carousel-counter"><span>{String(current+1).padStart(2,'0')}</span> / {String(total).padStart(2,'0')}</div>
          <button className="carousel-arrow carousel-arrow-prev" onClick={() => goTo(current-1)}>&#8592;</button>
          <button className="carousel-arrow carousel-arrow-next" onClick={() => goTo(current+1)}>&#8594;</button>
          <div className="carousel-dots">
            {images.map((_, i) => <button key={i} className={`carousel-dot${i===current?' active':''}`} onClick={() => goTo(i)} />)}
          </div>
          <div className="carousel-progress">
            <div key={progKey} className="carousel-progress-fill running" />
          </div>
        </>
      )}
    </div>
  )
}

// ── Home Page ──
function HomePage() {
  const [liked, setLiked] = useState(false)
  const [active, setActive] = useState('HOME')
  const [content, setContent] = useState(getContent())
  const [pageLoading, setPageLoading] = useState(true)
  const navigate = useNavigate()

  // Fetch fresh data from MongoDB on mount
  useEffect(() => {
    fetchContent().then(data => {
      setContent(data)
      setPageLoading(false)
    }).catch(() => {
      setContent(getContent())
      setPageLoading(false)
    })
  }, [])

  useEffect(() => {
    const handler = () => setContent(getContent())
    window.addEventListener('contentUpdated', handler)
    return () => window.removeEventListener('contentUpdated', handler)
  }, [])

  const heroImages = (() => {
    const arr = content.hero?.backgroundImages
    if (Array.isArray(arr) && arr.length > 0) return arr
    if (content.hero?.backgroundImage) return [content.hero.backgroundImage]
    return []
  })()

  if (pageLoading) {
    return (
      <>
        <style>{styles}</style>
        <div className="page-loading"><div className="loading-spinner" /></div>
      </>
    )
  }

  return (
    <>
      <style>{styles}</style>

      <nav className="nav">
        <div className="nav-logo">
          <div className="logo-emblem"><span className="logo-emblem-icon">{content.logo?.emblemIcon}</span></div>
        </div>
        <ul className="nav-links">
          {[
            { name: 'HOME', path: '/' }, { name: 'ABOUT', path: '/about' },
            { name: 'CLASSES', path: '/classes' }, { name: 'TRAINERS', path: '/trainers' },
            { name: 'EQUIPMENT', path: '/equipment' }, { name: 'EVENTS', path: '/events' },
            { name: 'REGISTER', path: '/register' }
          ].map(link => (
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

      <section className="hero">
        <div className="hero-image-side">
          {heroImages.length > 0 ? (
            <HeroCarousel images={heroImages} />
          ) : (
            <div className="hero-img-placeholder">
              <div className="stripe-decor"><div className="stripe"/><div className="stripe"/><div className="stripe"/><div className="stripe"/></div>
              <div className="zigzag-decor">
                <svg width="120" height="16" viewBox="0 0 120 16"><polyline points="0,8 10,0 20,8 30,0 40,8 50,0 60,8 70,0 80,8 90,0 100,8 110,0 120,8" fill="none" stroke="white" strokeWidth="2"/></svg>
              </div>
              <div className="gym-silhouette">
                <svg viewBox="0 0 400 400" fill="white" width="380">
                  <ellipse cx="200" cy="180" rx="40" ry="50"/>
                  <rect x="170" y="225" width="20" height="80"/><rect x="210" y="225" width="20" height="80"/>
                  <rect x="60" y="175" width="280" height="28" rx="14"/><rect x="60" y="175" width="60" height="28" rx="14"/>
                  <rect x="280" y="175" width="60" height="28" rx="14"/><rect x="40" y="165" width="50" height="50" rx="25"/><rect x="310" y="165" width="50" height="50" rx="25"/>
                </svg>
              </div>
              <div style={{position:'absolute',bottom:40,left:'50%',transform:'translateX(-50%)',textAlign:'center',zIndex:5}}>
                <div style={{fontSize:40,opacity:0.12,marginBottom:8}}>🖼️</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,letterSpacing:4,fontWeight:600,textTransform:'uppercase',color:'rgba(255,255,255,0.15)'}}>Upload images in Manager → Hero</div>
              </div>
              <div className="stripe-right"><div className="chevron"/><div className="chevron" style={{opacity:0.5}}/></div>
            </div>
          )}
        </div>

        <div className="hero-content-side">
          <p className="hero-eyebrow">{content.hero?.eyebrow}</p>
          <h1 className="hero-title">
            {(content.hero?.title || '').split('\n').map((line, i, arr) => (
              <span key={i}>
                {line === content.hero?.titleHighlight ? <span style={{color:'var(--gold)'}}>{line}</span> : line}
                {i < arr.length - 1 && <br/>}
              </span>
            ))}
          </h1>
          <p className="hero-subtitle">{content.hero?.subtitle}</p>
          <div className="hero-cta">
            <button className="btn-primary">{content.hero?.primaryBtn}</button>
            <button className="btn-outline">{content.hero?.secondaryBtn}</button>
          </div>
        </div>
      </section>

      <div className="stats-bar">
        {(content.stats || []).map((s, i) => (
          <div className="stat-item" key={i}>
            <span className="stat-num">{s.num}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <section className="features">
        <p className="section-label">{content.featuresSection?.label}</p>
        <h2 className="section-title">{(content.featuresSection?.title || '').split('\n').map((l,i,a)=><span key={i}>{l}{i<a.length-1&&<br/>}</span>)}</h2>
        <div className="features-grid">
          {(content.features || []).map((f, i) => (
            <div className="feature-card" key={i}>
              <span className="feature-icon">{f.icon}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="classes">
        <div className="classes-header">
          <div>
            <p className="section-label">{content.classesSection?.label}</p>
            <h2 className="section-title" style={{marginBottom:0}}>{content.classesSection?.title}</h2>
          </div>
          <button className="btn-outline">{content.classesSection?.buttonText}</button>
        </div>
        <div className="classes-grid">
          {(content.classes || []).map((c, i) => (
            <div className="class-card" key={i} style={i===0?{gridRow:'span 2'}:{}}>
              <div className="class-card-bg" style={{background:c.image?`url(${c.image})`:c.bg,backgroundSize:'cover',backgroundPosition:'center'}}/>
              <div className="class-card-overlay"/>
              <div className="class-card-content">
                <span className="class-tag">{c.tag}</span>
                <h3 className="class-name">{c.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-text">
          <p className="section-label">{content.cta?.label}</p>
          <h2 className="section-title">{(content.cta?.title||'').split('\n').map((l,i,a)=><span key={i}>{l}{i<a.length-1&&<br/>}</span>)}</h2>
        </div>
        <button className="btn-dark">{content.cta?.buttonText}</button>
      </section>

      <footer className="footer">
        <p className="footer-copy">{content.footer?.copyright}</p>
        <ul className="footer-links">
          {(content.footer?.links || []).map((link, i) => <li key={i}><a>{link}</a></li>)}
          <li><a className="manager-link" onClick={() => navigate('/manager')}>⚙ Manager</a></li>
        </ul>
      </footer>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/trainers" element={<Trainers />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/events" element={<Events />} />
        <Route path="/register" element={<Register />} />
        <Route path="/manager" element={<Manager />} />
      </Routes>
    </BrowserRouter>
  )
}