import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getContent } from './contentStore'

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

  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 48px;
    background: linear-gradient(to bottom, rgba(6,8,16,0.95) 0%, transparent 100%);
  }

  .nav-logo { display: flex; align-items: center; gap: 12px; }

  .logo-emblem {
    width: 64px; height: 64px; border-radius: 50%;
    border: 2px solid var(--gold);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    background: rgba(10,13,26,0.9); position: relative;
  }

  .logo-emblem::before {
    content: '✦ GYM ✦';
    font-size: 7px; letter-spacing: 2px; color: var(--gold);
    font-family: 'Barlow Condensed', sans-serif; font-weight: 600;
    display: block; margin-bottom: 2px;
  }

  .logo-emblem-icon { font-size: 20px; line-height: 1; }

  .logo-emblem::after {
    content: '— SLOGAN HERE —';
    font-size: 5.5px; letter-spacing: 1.5px; color: var(--gold);
    font-family: 'Barlow Condensed', sans-serif;
    display: block; margin-top: 2px;
  }

  .nav-links {
    display: flex; align-items: center; gap: 32px; list-style: none;
    margin: 0;
    padding: 0;
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

  .page-header {
    padding: 180px 80px 100px;
    background: var(--darker);
    min-height: 50vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .page-header h1 {
    font-family: 'Bebas Neue', cursive;
    font-size: clamp(56px, 8vw, 96px);
    line-height: 0.92; letter-spacing: 2px;
    color: var(--white); margin-bottom: 20px;
  }

  .page-header h1 span { color: var(--gold); }

  .page-header p {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 16px; letter-spacing: 2px;
    color: var(--muted);
  }

  .section {
    padding: 100px 80px;
    background: var(--dark);
  }

  .section-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px; letter-spacing: 5px; font-weight: 700;
    text-transform: uppercase; color: var(--gold);
    margin-bottom: 16px;
  }

  .section-title {
    font-family: 'Bebas Neue', cursive;
    font-size: clamp(40px, 5vw, 64px);
    line-height: 1; color: var(--white);
    margin-bottom: 48px;
  }

  .grid-3 {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 24px; max-width: 1400px; margin: 0 auto;
  }

  .card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    padding: 40px 32px;
    transition: all 0.3s;
  }

  .card:hover {
    background: rgba(201,168,76,0.06);
    border-color: rgba(201,168,76,0.25);
    transform: translateY(-4px);
  }

  .card-title {
    font-family: 'Bebas Neue', cursive;
    font-size: 28px; letter-spacing: 1px;
    color: var(--white); margin-bottom: 12px;
  }

  .btn-primary {
    background: var(--white); color: var(--darker);
    border: none; padding: 16px 40px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px; letter-spacing: 4px; font-weight: 700;
    text-transform: uppercase; cursor: pointer;
    transition: all 0.25s;
  }

  .btn-primary:hover { background: var(--gold); }

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

  @media (max-width: 900px) {
    .grid-3 { grid-template-columns: 1fr; }
    .nav { padding: 16px 24px; }
    .section, .page-header { padding: 60px 24px; }
    .footer { flex-direction: column; gap: 20px; }
  }
`

export default function Equipment() {
  const navigate = useNavigate()
  const [liked, setLiked] = useState(false)
  const [active, setActive] = useState('EQUIPMENT')
  const [content, setContent] = useState(getContent())

  useEffect(() => {
    const handleUpdate = () => setContent(getContent())
    window.addEventListener('contentUpdated', handleUpdate)
    return () => window.removeEventListener('contentUpdated', handleUpdate)
  }, [])

  const equipment = [
    {cat:'Cardio',items:[{name:'Treadmills',count:25,brand:'Life Fitness'},{name:'Ellipticals',count:15,brand:'Precor'},{name:'Rowing Machines',count:10,brand:'Concept2'},{name:'Spin Bikes',count:30,brand:'Peloton'},{name:'Stair Climbers',count:8,brand:'StairMaster'}]},
    {cat:'Strength',items:[{name:'Power Racks',count:12,brand:'Rogue'},{name:'Bench Press',count:10,brand:'Hammer Strength'},{name:'Cable Machines',count:8,brand:'Life Fitness'},{name:'Smith Machines',count:6,brand:'Body-Solid'},{name:'Leg Press',count:5,brand:'Cybex'}]},
    {cat:'Free Weights',items:[{name:'Dumbbells',count:'5-100 lbs',brand:'Rogue'},{name:'Barbells',count:20,brand:'Eleiko'},{name:'Weight Plates',count:'1000+',brand:'Rogue'},{name:'Kettlebells',count:'10-80 lbs',brand:'Rogue'},{name:'Medicine Balls',count:50,brand:'Dynamax'}]}
  ]
  
  return (
    <>
      <style>{styles}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo">
          <div className="logo-emblem">
            <span className="logo-emblem-icon">{content.logo.emblemIcon}</span>
          </div>
        </div>
        <ul className="nav-links">
          {[
            { name: 'HOME', path: '/' },
            { name: 'ABOUT', path: '/about' },
            { name: 'CLASSES', path: '/classes' },
            { name: 'TRAINERS', path: '/trainers' },
            { name: 'EQUIPMENT', path: '/equipment' },
            { name: 'EVENTS', path: '/events' },
            { name: 'REGISTER', path: '/register' }
          ].map(link => (
            <li key={link.name}>
              <a
                className={active === link.name ? 'active' : ''}
                onClick={e => { e.preventDefault(); setActive(link.name); navigate(link.path) }}
              >
                {link.name}
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

      <div className="page-header">
        <h1>Gym <span>Equipment</span></h1>
        <p>State-of-the-art equipment from leading brands</p>
      </div>

      {equipment.map((cat,i)=>(
        <section key={i} className="section" style={{background: i%2===0 ? 'var(--darker)' : 'var(--dark)'}}>
          <p className="section-label">{cat.cat} Equipment</p>
          <h2 className="section-title">{cat.cat}</h2>
          <div className="grid-3">
            {cat.items.map((item,j)=>(
              <div key={j} className="card">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'16px'}}>
                  <h3 className="card-title" style={{margin:0}}>{item.name}</h3>
                  <div style={{background:'rgba(201,168,76,0.2)',color:'var(--gold)',padding:'4px 12px',fontSize:'14px',fontWeight:'700',borderRadius:'4px'}}>{item.count}</div>
                </div>
                <div style={{fontSize:'13px',color:'var(--gold)',fontWeight:'600',letterSpacing:'1px'}}>🏷️ {item.brand}</div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="section" style={{background:'linear-gradient(135deg,#c9a84c 0%,#8a7a3c 100%)',textAlign:'center'}}>
        <h2 style={{fontFamily:'Bebas Neue',fontSize:'48px',color:'var(--darker)',marginBottom:'16px'}}>Equipment Tour Available</h2>
        <p style={{fontSize:'16px',color:'rgba(10,13,26,0.8)',marginBottom:'32px'}}>Schedule a free tour to see our facilities</p>
        <button onClick={()=>navigate('/register')} className="btn-primary" style={{background:'var(--darker)',color:'var(--gold)'}}>Schedule Tour</button>
      </section>

      <footer className="footer">
        <p className="footer-copy">{content.footer.copyright}</p>
        <ul className="footer-links">
          {content.footer.links.map((link, i) => (
            <li key={i}><a>{link}</a></li>
          ))}
          <li><a onClick={() => navigate('/manager')}>⚙ Manager</a></li>
        </ul>
      </footer>
    </>
  )
}
