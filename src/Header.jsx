import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getContent } from './contentStore'

const NAV_LINKS = [
  { name: 'HOME',            path: '/' },
  { name: 'ABOUT',           path: '/about' },
  { name: 'CLASSES',         path: '/classes' },
  { name: 'TRAINERS',        path: '/trainers' },
  { name: 'TRANSFORMATIONS', path: '/transformations' },
  { name: 'EQUIPMENT',       path: '/equipment' },
  { name: 'EVENTS',          path: '/events' },
  { name: 'REGISTER',        path: '/register' },
]

const headerStyles = `
  /* ── HEADER BASE ── */
  .site-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 500;
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 48px;
    background: rgba(6,8,16,0.97);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(201,168,76,0.08);
    min-height: 72px;
  }

  /* Logo */
  .site-logo { display: flex; align-items: center; gap: 10px; flex-shrink: 0; cursor: pointer; }
  .site-logo-emblem {
    width: 48px; height: 48px; border-radius: 50%;
    border: 2px solid var(--gold, #c9a84c);
    display: flex; align-items: center; justify-content: center;
    background: rgba(10,13,26,0.9); overflow: hidden; flex-shrink: 0;
    transition: border-color 0.2s;
  }
  .site-logo-emblem:hover { border-color: rgba(201,168,76,0.8); }
  .site-logo-emblem-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block; }
  .site-logo-emblem-icon { font-size: 18px; line-height: 1; }

  /* Desktop nav links */
  .site-nav-links {
    display: flex; align-items: center; gap: 26px;
    list-style: none; margin: 0; padding: 0;
  }
  .site-nav-links a {
    color: rgba(255,255,255,0.85); text-decoration: none;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11.5px; letter-spacing: 2.5px; font-weight: 600;
    text-transform: uppercase; transition: color 0.2s;
    position: relative; cursor: pointer; white-space: nowrap;
  }
  .site-nav-links a::after {
    content: ''; position: absolute; bottom: -4px;
    left: 0; right: 0; height: 2px;
    background: var(--gold, #c9a84c);
    transform: scaleX(0); transition: transform 0.2s ease;
    transform-origin: left;
  }
  .site-nav-links a:hover { color: #ffffff; }
  .site-nav-links a.active { color: #ffffff; }
  .site-nav-links a.active::after { transform: scaleX(1); }

  /* Right side */
  .site-nav-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }

  /* Hamburger button */
  .site-hamburger {
    display: none;
    flex-direction: column; justify-content: center;
    gap: 5px; background: none; border: none;
    cursor: pointer; padding: 6px; z-index: 501;
    width: 36px; height: 36px;
  }
  .site-hamburger span {
    display: block; width: 22px; height: 2px;
    background: #ffffff; border-radius: 2px;
    transition: all 0.3s ease; transform-origin: center;
  }
  .site-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .site-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .site-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  /* ── MOBILE DRAWER ── */
  .site-mobile-menu {
    display: none;
    position: fixed; inset: 0; z-index: 499;
    background: rgba(6,8,16,0.99);
    backdrop-filter: blur(20px);
    flex-direction: column;
    align-items: center; justify-content: center;
    padding-top: 72px;
  }
  .site-mobile-menu.open { display: flex; animation: mobileMenuIn 0.25s ease forwards; }
  @keyframes mobileMenuIn {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .site-mobile-nav {
    display: flex; flex-direction: column;
    align-items: center; width: 100%;
    max-width: 360px; gap: 0;
  }
  .site-mobile-nav a {
    display: block; width: 100%; text-align: center;
    padding: 18px 24px;
    color: rgba(255,255,255,0.7); text-decoration: none;
    font-family: 'Bebas Neue', cursive;
    font-size: 32px; letter-spacing: 3px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    cursor: pointer; transition: color 0.15s, background 0.15s;
  }
  .site-mobile-nav a:last-child { border-bottom: none; }
  .site-mobile-nav a:hover { color: var(--gold, #c9a84c); background: rgba(201,168,76,0.04); }
  .site-mobile-nav a.active { color: var(--gold, #c9a84c); }

  .site-mobile-footer {
    margin-top: 40px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px; letter-spacing: 4px;
    color: rgba(255,255,255,0.15);
    text-transform: uppercase;
  }

  /* ── BREAKPOINTS ── */
  @media (max-width: 1100px) {
    .site-nav-links { gap: 18px; }
    .site-nav-links a { font-size: 10.5px; letter-spacing: 2px; }
    .site-nav { padding: 14px 32px; }
  }

  @media (max-width: 860px) {
    .site-nav { padding: 12px 20px; min-height: 64px; }
    .site-nav-links { display: none; }
    .site-hamburger { display: flex; }
  }

  @media (max-width: 480px) {
    .site-mobile-nav a { font-size: 26px; padding: 15px 20px; }
    .site-logo-emblem { width: 42px; height: 42px; }
    .site-logo-emblem-icon { font-size: 16px; }
  }
`

export default function Header({ activePage }) {
  const navigate  = useNavigate()
  const location  = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [content, setContent]  = useState(getContent())

  // Determine active from location if not passed as prop
  const currentPath = location.pathname
  const activeLink  = activePage || NAV_LINKS.find(l => l.path === currentPath)?.name || 'HOME'

  useEffect(() => {
    const handler = () => setContent(getContent())
    window.addEventListener('contentUpdated', handler)
    return () => window.removeEventListener('contentUpdated', handler)
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const handleNav = (path) => {
    setMenuOpen(false)
    navigate(path)
  }

  return (
    <>
      <style>{headerStyles}</style>

      {/* ── MOBILE FULL-SCREEN MENU ── */}
      <div className={`site-mobile-menu${menuOpen ? ' open' : ''}`}>
        <nav className="site-mobile-nav">
          {NAV_LINKS.map(link => (
            <a
              key={link.name}
              className={activeLink === link.name ? 'active' : ''}
              onClick={() => handleNav(link.path)}
            >
              {link.name}
            </a>
          ))}
        </nav>
        <div className="site-mobile-footer">
          {content.logo?.topText || 'Kirola Fitness'} — Est. 2010
        </div>
      </div>

      {/* ── MAIN NAV BAR ── */}
      <nav className="site-nav">
        {/* Logo */}
        <div className="site-logo" onClick={() => handleNav('/')}>
          <div className="site-logo-emblem">
            {content.logo?.image
              ? <img src={content.logo.image} alt="Logo" className="site-logo-emblem-img" />
              : <span className="site-logo-emblem-icon">{content.logo?.emblemIcon || '🏋️'}</span>
            }
          </div>
        </div>

        {/* Desktop Links */}
        <ul className="site-nav-links">
          {NAV_LINKS.map(link => (
            <li key={link.name}>
              <a
                className={activeLink === link.name ? 'active' : ''}
                onClick={e => { e.preventDefault(); handleNav(link.path) }}
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Right: hamburger */}
        <div className="site-nav-right">
          <button
            className={`site-hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>
    </>
  )
}