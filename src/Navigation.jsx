import { useNavigate, useLocation } from 'react-router-dom'

export default function Navigation() {
  const navigate = useNavigate()
  const location = useLocation()

  const links = [
    { name: 'HOME',      path: '/' },
    { name: 'ABOUT',     path: '/about' },
    { name: 'CLASSES',   path: '/classes' },
    { name: 'TRAINERS',  path: '/trainers' },
    { name: 'EQUIPMENT', path: '/equipment' },
    { name: 'EVENTS',    path: '/events' },
    { name: 'REGISTER',  path: '/register' },
  ]

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 48px',
      background: 'linear-gradient(to bottom, rgba(6,8,16,0.95) 0%, transparent 100%)',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          border: '2px solid #c9a84c',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(10,13,26,0.9)', position: 'relative', flexShrink: 0,
        }}>
          <span style={{ fontSize: 7, letterSpacing: 2, color: '#c9a84c', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, marginBottom: 2 }}>✦ GYM ✦</span>
          <span style={{ fontSize: 20, lineHeight: 1 }}>⚔️</span>
          <span style={{ fontSize: 5.5, letterSpacing: 1.5, color: '#c9a84c', fontFamily: "'Barlow Condensed', sans-serif", marginTop: 2 }}>— SLOGAN HERE —</span>
        </div>
      </div>

      {/* Links */}
      <ul style={{ display: 'flex', alignItems: 'center', gap: 32, listStyle: 'none', margin: 0, padding: 0 }}>
        {links.map(link => (
          <li key={link.name}>
            <a
              onClick={() => navigate(link.path)}
              style={{
                color: '#ffffff', textDecoration: 'none',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 13, letterSpacing: 3, fontWeight: 600,
                textTransform: 'uppercase', transition: 'color 0.2s',
                cursor: 'pointer', position: 'relative',
                borderBottom: location.pathname === link.path ? '2px solid #ffffff' : 'none',
                paddingBottom: location.pathname === link.path ? 4 : 0,
              }}
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>

      {/* Right spacer to balance logo width */}
      <div style={{ width: 64 }} />
    </nav>
  )
}