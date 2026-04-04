import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getContent, fetchContent } from './contentStore'

const API_BASE = import.meta.env.VITE_API_URL || 'https://kirolafitness.onrender.com'

function sharpUrl(url) {
  if (!url || typeof url !== 'string') return url
  if (!url.includes('res.cloudinary.com')) return url
  if (url.includes('/upload/q_') || url.includes('/upload/f_')) return url
  return url.replace('/upload/', '/upload/q_auto,f_auto/')
}

const NAV_LINKS = [
  { name: 'HOME',            path: '/' },
  { name: 'ABOUT',           path: '/about' },
  { name: 'CLASSES',         path: '/classes' },
  { name: 'TRAINERS',        path: '/trainers' },
  { name: 'TRANSFORMATIONS', path: '/transformations' },
  { name: 'EQUIPMENT',       path: '/equipment' },
  { name: 'EVENTS',          path: '/events' },
  { name: 'REGISTER',        path: '/register' },
  { name: 'OWNER',           path: '/owner' },
]

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@400;600;700&display=swap');
  *{margin:0;padding:0;box-sizing:border-box;}
  :root{--dark:#0a0d1a;--darker:#060810;--gold:#c9a84c;--white:#ffffff;--muted:#8a9ab5;}
  body{background:var(--dark);color:var(--white);font-family:'Barlow',sans-serif;overflow-x:hidden;}

  /* ── NAV ── */
  .nav{position:fixed;top:0;left:0;right:0;z-index:200;display:flex;align-items:center;justify-content:space-between;padding:16px 48px;background:rgba(6,8,16,0.97);backdrop-filter:blur(10px);border-bottom:1px solid rgba(201,168,76,0.08);}
  .nav-logo{display:flex;align-items:center;gap:12px;flex-shrink:0;}
  .logo-emblem{width:52px;height:52px;border-radius:50%;border:2px solid var(--gold);display:flex;align-items:center;justify-content:center;background:rgba(10,13,26,0.9);cursor:pointer;overflow:hidden;flex-shrink:0;}
  .logo-emblem-img{width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;}
  .nav-links{display:flex;align-items:center;gap:24px;list-style:none;}
  .nav-links a{color:var(--white);text-decoration:none;font-family:'Barlow Condensed',sans-serif;font-size:11px;letter-spacing:2.5px;font-weight:600;text-transform:uppercase;transition:color 0.2s;cursor:pointer;white-space:nowrap;}
  .nav-links a.active::after{content:'';position:absolute;bottom:-4px;left:0;right:0;height:2px;background:var(--gold);}
  .nav-links a:hover{color:var(--gold);}
  .nav-links a{position:relative;}
  .hamburger{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:4px;z-index:201;}
  .hamburger span{display:block;width:24px;height:2px;background:var(--white);transition:all 0.3s ease;border-radius:2px;}
  .hamburger.open span:nth-child(1){transform:rotate(45deg) translate(5px,5px);}
  .hamburger.open span:nth-child(2){opacity:0;transform:translateX(-8px);}
  .hamburger.open span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px);}
  .mobile-menu{display:none;position:fixed;top:0;left:0;right:0;bottom:0;z-index:199;background:rgba(6,8,16,0.98);backdrop-filter:blur(20px);flex-direction:column;align-items:center;justify-content:center;animation:menuFadeIn 0.25s ease;}
  .mobile-menu.open{display:flex;}
  @keyframes menuFadeIn{from{opacity:0;transform:translateY(-12px);}to{opacity:1;transform:translateY(0);}}
  .mobile-menu a{color:var(--white);text-decoration:none;font-family:'Bebas Neue',cursive;font-size:32px;letter-spacing:3px;padding:12px 0;cursor:pointer;transition:color 0.2s;border-bottom:1px solid rgba(255,255,255,0.05);width:80%;text-align:center;}
  .mobile-menu a:hover,.mobile-menu a.active{color:var(--gold);}
  .mobile-menu-footer{margin-top:28px;font-family:'Barlow Condensed',sans-serif;font-size:11px;letter-spacing:3px;color:rgba(255,255,255,0.2);text-transform:uppercase;}

  /* ── HERO BANNER ── */
  .owner-hero{padding:120px 80px 60px;background:var(--darker);position:relative;overflow:hidden;}
  .owner-hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 80% at 80% 50%,rgba(201,168,76,0.07) 0%,transparent 70%);pointer-events:none;}
  .owner-hero-eyebrow{font-family:'Barlow Condensed',sans-serif;font-size:12px;letter-spacing:5px;font-weight:700;color:var(--gold);text-transform:uppercase;margin-bottom:16px;display:flex;align-items:center;gap:12px;}
  .owner-hero-eyebrow::before{content:'';display:block;width:32px;height:2px;background:var(--gold);}
  .owner-hero-title{font-family:'Bebas Neue',cursive;font-size:clamp(52px,7vw,96px);line-height:0.92;letter-spacing:2px;color:var(--white);}

  /* ── MAIN PROFILE SECTION ── */
  .owner-section{padding:72px 80px;background:var(--dark);}
  .owner-profile-wrap{display:grid;grid-template-columns:1fr 1.4fr;gap:72px;align-items:start;}

  /* Photo Column */
  .owner-photo-col{display:flex;flex-direction:column;gap:28px;}
  .owner-photo-frame{position:relative;aspect-ratio:3/4;overflow:hidden;background:#0d1020;border:1px solid rgba(201,168,76,0.15);}
  .owner-photo-frame::after{content:'';position:absolute;inset:0;border:1px solid rgba(201,168,76,0.08);pointer-events:none;}
  .owner-photo-img{width:100%;height:100%;object-fit:cover;object-position:center top;display:block;transition:transform 0.5s ease;}
  .owner-photo-frame:hover .owner-photo-img{transform:scale(1.03);}
  .owner-photo-placeholder{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;min-height:420px;}
  .owner-photo-placeholder-icon{font-size:56px;opacity:0.07;}
  .owner-photo-placeholder-text{font-family:'Barlow Condensed',sans-serif;font-size:11px;letter-spacing:3px;font-weight:700;text-transform:uppercase;color:rgba(201,168,76,0.25);text-align:center;}

  /* Accent card below photo */
  .owner-accent-card{background:var(--gold);padding:24px 28px;}
  .owner-accent-label{font-family:'Barlow Condensed',sans-serif;font-size:10px;letter-spacing:4px;font-weight:700;text-transform:uppercase;color:rgba(0,0,0,0.5);margin-bottom:6px;}
  .owner-accent-value{font-family:'Bebas Neue',cursive;font-size:32px;letter-spacing:1px;color:var(--darker);line-height:1.1;}

  /* Info Column */
  .owner-info-col{display:flex;flex-direction:column;gap:36px;}
  .owner-name-block{}
  .owner-role-tag{font-family:'Barlow Condensed',sans-serif;font-size:11px;letter-spacing:4px;font-weight:700;text-transform:uppercase;color:var(--gold);margin-bottom:12px;display:block;}
  .owner-name{font-family:'Bebas Neue',cursive;font-size:clamp(44px,5vw,72px);line-height:0.95;letter-spacing:2px;color:var(--white);margin-bottom:16px;}
  .owner-tagline{font-family:'Barlow Condensed',sans-serif;font-size:16px;letter-spacing:2px;color:var(--muted);text-transform:uppercase;font-weight:600;}

  .owner-divider{height:1px;background:linear-gradient(to right,rgba(201,168,76,0.4),transparent);margin:4px 0;}

  .owner-bio{display:flex;flex-direction:column;gap:18px;}
  .owner-bio-label{font-family:'Barlow Condensed',sans-serif;font-size:10px;letter-spacing:4px;font-weight:700;text-transform:uppercase;color:var(--gold);}
  .owner-bio-text{font-size:15px;line-height:1.85;color:rgba(255,255,255,0.75);font-weight:300;}

  /* Stats row */
  .owner-stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,0.06);}
  .owner-stat{background:var(--dark);padding:20px 16px;text-align:center;}
  .owner-stat-num{font-family:'Bebas Neue',cursive;font-size:36px;color:var(--gold);line-height:1;letter-spacing:1px;}
  .owner-stat-label{font-family:'Barlow Condensed',sans-serif;font-size:10px;letter-spacing:2.5px;font-weight:700;text-transform:uppercase;color:var(--muted);margin-top:4px;}

  /* Philosophy / Vision block */
  .owner-vision{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);border-left:3px solid var(--gold);padding:28px 28px 28px 32px;}
  .owner-vision-label{font-family:'Barlow Condensed',sans-serif;font-size:10px;letter-spacing:4px;font-weight:700;text-transform:uppercase;color:var(--gold);margin-bottom:12px;}
  .owner-vision-quote{font-family:'Barlow',sans-serif;font-size:16px;line-height:1.75;color:rgba(255,255,255,0.8);font-style:italic;font-weight:300;}
  .owner-vision-attr{font-family:'Barlow Condensed',sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-top:14px;}

  /* Social / Contact strip */
  .owner-contact-strip{display:flex;gap:12px;flex-wrap:wrap;}
  .owner-contact-btn{display:inline-flex;align-items:center;gap:8px;padding:12px 20px;border:1px solid rgba(201,168,76,0.25);background:transparent;color:var(--gold);font-family:'Barlow Condensed',sans-serif;font-size:11px;letter-spacing:3px;font-weight:700;text-transform:uppercase;cursor:pointer;transition:all 0.2s;text-decoration:none;}
  .owner-contact-btn:hover{background:var(--gold);color:var(--darker);border-color:var(--gold);}

  /* ── JOURNEY SECTION ── */
  .owner-journey{padding:72px 80px;background:var(--darker);position:relative;overflow:hidden;}
  .owner-journey::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 40% 60% at 10% 50%,rgba(201,168,76,0.05) 0%,transparent 70%);pointer-events:none;}
  .section-label{font-family:'Barlow Condensed',sans-serif;font-size:11px;letter-spacing:5px;font-weight:700;text-transform:uppercase;color:var(--gold);margin-bottom:14px;}
  .section-title{font-family:'Bebas Neue',cursive;font-size:clamp(36px,5vw,64px);line-height:1;color:var(--white);margin-bottom:48px;}
  .journey-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:rgba(255,255,255,0.05);}
  .journey-card{background:var(--darker);padding:32px 24px;position:relative;overflow:hidden;transition:background 0.3s;}
  .journey-card:hover{background:rgba(201,168,76,0.04);}
  .journey-card::before{content:attr(data-year);position:absolute;top:16px;right:20px;font-family:'Bebas Neue',cursive;font-size:48px;color:rgba(201,168,76,0.06);letter-spacing:2px;line-height:1;pointer-events:none;}
  .journey-icon{width:40px;height:40px;background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.2);display:flex;align-items:center;justify-content:center;font-size:18px;margin-bottom:16px;}
  .journey-year{font-family:'Barlow Condensed',sans-serif;font-size:10px;letter-spacing:3px;font-weight:700;text-transform:uppercase;color:var(--gold);margin-bottom:8px;}
  .journey-title{font-family:'Bebas Neue',cursive;font-size:22px;letter-spacing:1px;color:var(--white);margin-bottom:10px;}
  .journey-desc{font-size:13px;line-height:1.7;color:var(--muted);}

  /* ── CTA ── */
  .owner-cta{padding:72px 80px;background:var(--gold);display:flex;align-items:center;justify-content:space-between;gap:40px;}
  .owner-cta-text .section-label{color:rgba(0,0,0,0.5);}
  .owner-cta-text .section-title{color:var(--darker);margin-bottom:0;}
  .btn-dark{background:var(--darker);color:var(--white);border:none;padding:18px 48px;font-family:'Barlow Condensed',sans-serif;font-size:13px;letter-spacing:4px;font-weight:700;text-transform:uppercase;cursor:pointer;transition:all 0.25s;flex-shrink:0;}
  .btn-dark:hover{background:#000;}

  /* ── FOOTER ── */
  .footer{background:var(--darker);padding:36px 80px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(255,255,255,0.07);}
  .footer-copy{font-family:'Barlow Condensed',sans-serif;font-size:12px;letter-spacing:2px;color:var(--muted);text-transform:uppercase;}
  .footer-links{display:flex;gap:24px;list-style:none;flex-wrap:wrap;}
  .footer-links a{font-family:'Barlow Condensed',sans-serif;font-size:11px;letter-spacing:3px;color:var(--muted);text-decoration:none;text-transform:uppercase;transition:color 0.2s;cursor:pointer;}
  .footer-links a:hover{color:var(--gold);}
  .manager-link{color:var(--gold)!important;border-bottom:1px solid rgba(201,168,76,0.4);padding-bottom:2px;}

  /* ── LOADING ── */
  .page-loading{display:flex;align-items:center;justify-content:center;min-height:100vh;background:var(--darker);}
  .loading-spinner{width:48px;height:48px;border:3px solid rgba(201,168,76,0.2);border-top-color:var(--gold);border-radius:50%;animation:spin 0.8s linear infinite;}
  @keyframes spin{to{transform:rotate(360deg);}}

  /* ── RESPONSIVE ── */
  @media(max-width:1100px){
    .nav{padding:12px 32px;}
    .nav-links{gap:16px;}
    .nav-links a{font-size:10px;letter-spacing:2px;}
    .owner-hero,.owner-section,.owner-journey,.owner-cta{padding-left:48px;padding-right:48px;}
    .owner-profile-wrap{gap:48px;}
    .journey-grid{grid-template-columns:repeat(2,1fr);}
    .footer{padding-left:48px;padding-right:48px;}
  }
  @media(max-width:768px){
    .nav{padding:12px 20px;}
    .nav-links{display:none;}
    .hamburger{display:flex;}
    .owner-hero{padding:100px 20px 48px;}
    .owner-section{padding:52px 20px;}
    .owner-journey{padding:52px 20px;}
    .owner-cta{padding:52px 20px;flex-direction:column;align-items:flex-start;gap:24px;}
    .owner-cta .btn-dark{width:100%;text-align:center;}
    .owner-profile-wrap{grid-template-columns:1fr;gap:36px;}
    .owner-photo-frame{aspect-ratio:4/5;max-height:460px;}
    .journey-grid{grid-template-columns:1fr;gap:2px;}
    .owner-stats-row{grid-template-columns:repeat(3,1fr);}
    .footer{padding:28px 20px;flex-direction:column;align-items:flex-start;gap:18px;}
  }
`

// Default journey milestones — can be overridden by content manager later
const DEFAULT_JOURNEY = [
]

export default function Owner() {
  const [content, setContent] = useState(getContent())
  const [pageLoading, setPageLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('OWNER')
  const navigate = useNavigate()

  useEffect(() => {
    fetchContent().then(d => { setContent(d); setPageLoading(false) })
      .catch(() => { setContent(getContent()); setPageLoading(false) })
  }, [])

  useEffect(() => {
    const handler = () => setContent(getContent())
    window.addEventListener('contentUpdated', handler)
    return () => window.removeEventListener('contentUpdated', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleNav = (path, name) => { setActive(name); setMenuOpen(false); navigate(path) }

  const owner = content.owner || {}
  const journey = (owner.journey && owner.journey.length > 0) ? owner.journey : DEFAULT_JOURNEY

  // Stats from owner content or defaults
  const stats = owner.stats || [
    { num: owner.experienceYears || '10+', label: 'Years Experience' },
    { num: owner.membersCoached || '500+', label: 'Members Coached' },
    { num: owner.certifications || '8', label: 'Certifications' },
  ]

  if (pageLoading) return (
    <>
      <style>{styles}</style>
      <div className="page-loading"><div className="loading-spinner" /></div>
    </>
  )

  return (
    <>
      <style>{styles}</style>

      {/* Mobile Menu */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        {NAV_LINKS.map(link => (
          <a key={link.name} className={active === link.name ? 'active' : ''}
            onClick={() => handleNav(link.path, link.name)}>{link.name}</a>
        ))}
        <div className="mobile-menu-footer">{content.logo?.topText || 'Kirola Fitness'}</div>
      </div>

      {/* Nav */}
      <nav className="nav">
        <div className="nav-logo">
          <div className="logo-emblem" onClick={() => handleNav('/', 'HOME')}>
            {content.logo?.image
              ? <img src={sharpUrl(content.logo.image)} alt="Logo" className="logo-emblem-img" />
              : <span style={{ fontSize: 18 }}>{content.logo?.emblemIcon || '🏋️'}</span>}
          </div>
        </div>
        <ul className="nav-links">
          {NAV_LINKS.map(link => (
            <li key={link.name}>
              <a className={active === link.name ? 'active' : ''}
                onClick={e => { e.preventDefault(); handleNav(link.path, link.name) }}>
                {link.name}
              </a>
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <button className={`hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="owner-hero">
        <div className="owner-hero-eyebrow">Meet the Founder</div>
        <h1 className="owner-hero-title">
          The Person<br />
          <span style={{ color: 'var(--gold)' }}>Behind Kirola</span>
        </h1>
      </section>

      {/* Main Profile */}
      <section className="owner-section">
        <div className="owner-profile-wrap">

          {/* Photo Column */}
          <div className="owner-photo-col">
            <div className="owner-photo-frame">
              {owner.image ? (
                <img
                  src={sharpUrl(owner.image)}
                  alt={owner.name || 'Owner'}
                  className="owner-photo-img"
                />
              ) : (
                <div className="owner-photo-placeholder">
                  <div className="owner-photo-placeholder-icon">👤</div>
                  <div className="owner-photo-placeholder-text">
                    Add owner photo<br />in Manager → Owner
                  </div>
                </div>
              )}
            </div>

            {/* Accent card */}
            {owner.accentLabel && owner.accentValue ? (
              <div className="owner-accent-card">
                <div className="owner-accent-label">{owner.accentLabel}</div>
                <div className="owner-accent-value">{owner.accentValue}</div>
              </div>
            ) : (
              <div className="owner-accent-card">
                <div className="owner-accent-label">Gym Founded</div>
                <div className="owner-accent-value">Kirola Fitness<br /></div>
              </div>
            )}
          </div>

          {/* Info Column */}
          <div className="owner-info-col">

            {/* Name & Title */}
            <div className="owner-name-block">
              <span className="owner-role-tag">
                {owner.role || 'Founder & Head Trainer'}
              </span>
              <h2 className="owner-name">
                {owner.name || (
                  <span style={{ color: 'rgba(255,255,255,0.2)' }}>Owner Name</span>
                )}
              </h2>
              {owner.tagline && (
                <p className="owner-tagline">{owner.tagline}</p>
              )}
            </div>

            <div className="owner-divider" />

            {/* Stats Row */}
            <div className="owner-stats-row">
              {stats.map((s, i) => (
                <div className="owner-stat" key={i}>
                  <div className="owner-stat-num">{s.num}</div>
                  <div className="owner-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Bio */}
            <div className="owner-bio">
              <span className="owner-bio-label">About</span>
              {owner.description ? (
                owner.description.split('\n\n').map((para, i) => (
                  <p className="owner-bio-text" key={i}>{para}</p>
                ))
              ) : (
                <p className="owner-bio-text" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  Add a description in Manager → Owner to tell your story here.
                </p>
              )}
            </div>

            {/* Vision / Philosophy Quote */}
            {owner.philosophy && (
              <div className="owner-vision">
                <div className="owner-vision-label">Philosophy</div>
                <p className="owner-vision-quote">"{owner.philosophy}"</p>
                <p className="owner-vision-attr">— {owner.name || 'Founder, Kirola Fitness'}</p>
              </div>
            )}

            {/* Contact / Social Buttons */}
            <div className="owner-contact-strip">
              <a href="https://www.instagram.com/fitfunda_official?igsh=MXQ2c3lmdTdra3Ryag=="
                target="_blank" rel="noopener noreferrer"
                className="owner-contact-btn">
                📸 Instagram
              </a>
              <button className="owner-contact-btn" onClick={() => navigate('/register')}>
                Join Us
              </button>
              {owner.email && (
                <a href={`mailto:${owner.email}`} className="owner-contact-btn">
                  ✉ Contact
                </a>
              )}
            </div>
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="owner-cta">
        <div className="owner-cta-text">
          <p className="section-label">Start Today</p>
          <h2 className="section-title">Train With<br />The Best</h2>
        </div>
        <button className="btn-dark" onClick={() => navigate('/register')}>
          Join Kirola Now
        </button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p className="footer-copy">{content.footer?.copyright || '© 2024 Kirola Fitness'}</p>
        <ul className="footer-links">
          {(content.footer?.links || ['Privacy', 'Terms', 'Contact', 'Instagram']).map((link, i) => {
            const key = link.toLowerCase().trim()
            const handleClick = () => {
              if (key === 'privacy') navigate('/privacy')
              else if (key === 'terms') navigate('/terms')
              else if (key === 'contact') navigate('/contact')
              else if (key === 'instagram') window.open('https://www.instagram.com/kirola_fitness?igsh=cWdocG5oaHFlcDU0', '_blank')
              else if (key === 'about') navigate('/about')
            }
            return (
              <li key={i}>
                <a onClick={handleClick}>
                  {key === 'instagram' ? '📸 ' : ''}{link}
                </a>
              </li>
            )
          })}
          <li><a className="manager-link" onClick={() => navigate('/manager')}>⚙ Manager</a></li>
        </ul>
      </footer>
    </>
  )
}