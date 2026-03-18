import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getContent, fetchContent } from './contentStore'
import Header from './Header'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;900&family=Barlow+Condensed:wght@400;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root { --dark: #0a0d1a; --darker: #060810; --gold: #c9a84c; --white: #ffffff; --muted: #8a9ab5; }
  body { background: var(--dark); color: var(--white); font-family: 'Barlow', sans-serif; overflow-x: hidden; }

  .page-hero { padding: 140px 80px 60px; background: var(--darker); position: relative; overflow: hidden; }
  .page-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 80% at 80% 50%, rgba(201,168,76,0.07) 0%, transparent 70%); pointer-events: none; }
  .page-hero-label { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 5px; font-weight: 700; text-transform: uppercase; color: var(--gold); margin-bottom: 14px; display: flex; align-items: center; gap: 12px; }
  .page-hero-label::before { content: ''; display: block; width: 28px; height: 2px; background: var(--gold); }
  .page-hero-title { font-family: 'Bebas Neue', cursive; font-size: clamp(44px, 6vw, 80px); line-height: 1; color: var(--white); margin-bottom: 16px; }
  .page-hero-title .gold { color: var(--gold); }
  .page-hero-sub { font-family: 'Barlow Condensed', sans-serif; font-size: 13px; letter-spacing: 3px; color: var(--muted); text-transform: uppercase; max-width: 600px; line-height: 1.7; }

  .tf-stats { background: var(--gold); padding: 24px 40px; display: grid; grid-template-columns: repeat(4, 1fr); overflow: hidden; }
  .tf-stat { display: flex; flex-direction: column; align-items: center; padding: 8px 12px; border-right: 1px solid rgba(0,0,0,0.2); }
  .tf-stat:last-child { border-right: none; }
  .tf-stat-num { font-family: 'Bebas Neue', cursive; font-size: 38px; line-height: 1; color: var(--darker); }
  .tf-stat-label { font-family: 'Barlow Condensed', sans-serif; font-size: 10px; letter-spacing: 2.5px; font-weight: 700; text-transform: uppercase; color: rgba(0,0,0,0.55); margin-top: 3px; text-align: center; }

  .filter-bar { background: var(--darker); padding: 24px 80px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid rgba(255,255,255,0.06); flex-wrap: wrap; }
  .filter-btn { background: transparent; border: 1px solid rgba(255,255,255,0.12); color: var(--muted); padding: 9px 20px; font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 3px; font-weight: 600; text-transform: uppercase; cursor: pointer; transition: all 0.2s; border-radius: 2px; }
  .filter-btn:hover { border-color: rgba(201,168,76,0.4); color: var(--white); }
  .filter-btn.active { background: var(--gold); border-color: var(--gold); color: var(--darker); }

  .transformations-section { padding: 60px 80px 80px; background: var(--dark); }
  .transformations-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }

  .tf-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); overflow: hidden; transition: border-color 0.3s, transform 0.3s; cursor: pointer; }
  .tf-card:hover { border-color: rgba(201,168,76,0.3); transform: translateY(-4px); }

  .tf-slider-wrap { position: relative; width: 100%; aspect-ratio: 1/1; overflow: hidden; background: #0d1020; user-select: none; }
  .tf-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
  .tf-img-after { clip-path: inset(0 50% 0 0); }
  .tf-divider { position: absolute; top: 0; bottom: 0; width: 2px; background: var(--gold); left: 50%; transform: translateX(-50%); z-index: 10; }
  .tf-divider-handle { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; border-radius: 50%; background: var(--gold); border: 3px solid var(--white); display: flex; align-items: center; justify-content: center; font-size: 14px; color: var(--darker); font-weight: 900; box-shadow: 0 2px 14px rgba(0,0,0,0.6); cursor: grab; }
  .tf-divider-handle:active { cursor: grabbing; }
  .tf-label-before, .tf-label-after { position: absolute; top: 14px; z-index: 11; font-family: 'Barlow Condensed', sans-serif; font-size: 9px; letter-spacing: 3px; font-weight: 700; text-transform: uppercase; padding: 4px 10px; backdrop-filter: blur(6px); }
  .tf-label-before { left: 14px; background: rgba(6,8,16,0.75); color: var(--muted); border: 1px solid rgba(255,255,255,0.12); }
  .tf-label-after  { right: 14px; background: rgba(201,168,76,0.9); color: var(--darker); }
  .tf-placeholder { width: 100%; aspect-ratio: 1/1; background: linear-gradient(135deg, #0d1020, #1a1f35); display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 10px; }

  .tf-card-info { padding: 20px 22px; }
  .tf-card-name { font-family: 'Bebas Neue', cursive; font-size: 24px; color: var(--white); letter-spacing: 1px; margin-bottom: 8px; }
  .tf-card-meta { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 10px; align-items: center; }
  .tf-card-tag { font-family: 'Barlow Condensed', sans-serif; font-size: 9px; letter-spacing: 2px; font-weight: 700; text-transform: uppercase; padding: 3px 10px; background: rgba(201,168,76,0.1); color: var(--gold); border: 1px solid rgba(201,168,76,0.2); }
  .tf-card-duration { font-family: 'Barlow Condensed', sans-serif; font-size: 10px; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; display: flex; align-items: center; gap: 5px; }
  .tf-card-quote { font-size: 13px; line-height: 1.7; color: var(--muted); font-style: italic; border-left: 2px solid var(--gold); padding-left: 12px; margin-bottom: 10px; }
  .tf-card-story { font-size: 13px; line-height: 1.75; color: rgba(138,154,181,0.75); }
  .tf-card-story-toggle { background: none; border: none; cursor: pointer; font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 3px; font-weight: 700; text-transform: uppercase; color: var(--gold); padding: 0; margin-top: 10px; display: flex; align-items: center; gap: 6px; transition: color 0.2s; }
  .tf-card-story-toggle:hover { color: #e0bc60; }
  .tf-card-story-wrap { overflow: hidden; transition: max-height 0.4s ease, opacity 0.35s ease; opacity: 0; max-height: 0; }
  .tf-card-story-wrap.open { opacity: 1; max-height: 600px; }
  .tf-card-divider { width: 100%; height: 1px; background: rgba(255,255,255,0.06); margin: 10px 0; }

  .tf-cta { padding: 80px; background: var(--darker); text-align: center; }
  .tf-cta-title { font-family: 'Bebas Neue', cursive; font-size: clamp(36px, 5vw, 60px); color: var(--white); margin-bottom: 20px; }
  .tf-cta-title span { color: var(--gold); }
  .tf-cta-sub { font-family: 'Barlow Condensed', sans-serif; font-size: 13px; letter-spacing: 4px; color: var(--muted); text-transform: uppercase; margin-bottom: 36px; }
  .btn-primary { background: var(--white); color: var(--darker); border: none; padding: 16px 44px; font-family: 'Barlow Condensed', sans-serif; font-size: 13px; letter-spacing: 4px; font-weight: 700; text-transform: uppercase; cursor: pointer; transition: all 0.25s; }
  .btn-primary:hover { background: var(--gold); }

  .tf-empty { padding: 80px 20px; text-align: center; }
  .tf-empty-icon { font-size: 52px; opacity: 0.1; margin-bottom: 16px; }
  .tf-empty-text { font-family: 'Bebas Neue', cursive; font-size: 32px; color: rgba(255,255,255,0.15); letter-spacing: 2px; margin-bottom: 10px; }
  .tf-empty-sub { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 3px; color: rgba(255,255,255,0.1); text-transform: uppercase; }

  .page-loading { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: var(--darker); }
  .loading-spinner { width: 48px; height: 48px; border: 3px solid rgba(201,168,76,0.2); border-top-color: var(--gold); border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .footer { background: var(--darker); padding: 36px 80px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.07); flex-wrap: wrap; gap: 16px; }
  .footer-copy { font-family: 'Barlow Condensed', sans-serif; font-size: 12px; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; }
  .footer-links { display: flex; gap: 24px; list-style: none; flex-wrap: wrap; }
  .footer-links a { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 3px; color: var(--muted); text-decoration: none; text-transform: uppercase; transition: color 0.2s; cursor: pointer; }
  .footer-links a:hover { color: var(--gold); }

  @media (max-width: 1100px) {
    .transformations-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
    .page-hero { padding: 130px 48px 52px; }
    .filter-bar { padding: 20px 48px; }
    .transformations-section { padding: 48px 48px 64px; }
    .tf-stats { padding: 20px 24px; }
  }

  @media (max-width: 768px) {
    .page-hero { padding: 96px 20px 40px; }
    .page-hero-title { font-size: clamp(40px, 11vw, 60px); }
    .page-hero-sub { font-size: 11px; letter-spacing: 2px; }
    .filter-bar { padding: 16px 20px 20px; gap: 8px; }
    .filter-btn { padding: 7px 12px; font-size: 10px; letter-spacing: 1.5px; }
    .transformations-section { padding: 32px 20px 52px; }
    .transformations-grid { grid-template-columns: 1fr; gap: 16px; }
    .tf-stats { grid-template-columns: repeat(2, 1fr); padding: 16px 20px; }
    .tf-stat { padding: 10px 8px; border-right: 1px solid rgba(0,0,0,0.15); border-bottom: 1px solid rgba(0,0,0,0.15); }
    .tf-stat:nth-child(2n) { border-right: none; }
    .tf-stat:nth-child(3), .tf-stat:nth-child(4) { border-bottom: none; }
    .tf-stat-num { font-size: 30px; }
    .tf-stat-label { font-size: 9px; letter-spacing: 1.5px; }
    .tf-cta { padding: 52px 20px; }
    .footer { padding: 28px 20px; flex-direction: column; align-items: flex-start; }
    .footer-links { gap: 14px; }
  }
`

function TransformationCard({ item }) {
  const sliderRef = useRef(null)
  const [pos, setPos] = useState(50)
  const [storyOpen, setStoryOpen] = useState(false)
  const dragging = useRef(false)

  const updatePos = (clientX) => {
    const rect = sliderRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    setPos((x / rect.width) * 100)
  }

  const onMouseDown = e => { dragging.current = true; e.preventDefault() }
  const onMouseMove = e => { if (dragging.current) updatePos(e.clientX) }
  const onMouseUp   = () => { dragging.current = false }
  const onTouchMove = e => updatePos(e.touches[0].clientX)

  return (
    <div className="tf-card">
      {item.beforeImage && item.afterImage ? (
        <div className="tf-slider-wrap" ref={sliderRef}
          onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
          onTouchMove={onTouchMove} onTouchEnd={onMouseUp}>
          <img src={item.beforeImage} alt="Before" className="tf-img" draggable={false} />
          <img src={item.afterImage} alt="After" className="tf-img tf-img-after"
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} draggable={false} />
          <div className="tf-divider" style={{ left: `${pos}%` }}>
            <div className="tf-divider-handle"
              onMouseDown={onMouseDown} onTouchStart={onMouseDown}
              style={{ pointerEvents: 'all' }}>◀▶</div>
          </div>
          <span className="tf-label-before">Before</span>
          <span className="tf-label-after">After</span>
        </div>
      ) : item.beforeImage ? (
        <div className="tf-slider-wrap">
          <img src={item.beforeImage} alt="Before" className="tf-img" />
          <span className="tf-label-before">Before</span>
        </div>
      ) : item.afterImage ? (
        <div className="tf-slider-wrap">
          <img src={item.afterImage} alt="After" className="tf-img" />
          <span className="tf-label-after">After</span>
        </div>
      ) : (
        <div className="tf-placeholder">
          <div style={{fontSize:36,opacity:0.1}}>🏋️</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,letterSpacing:3,color:'rgba(255,255,255,0.1)',textTransform:'uppercase'}}>Images coming soon</div>
        </div>
      )}

      <div className="tf-card-info">
        <div className="tf-card-name">{item.name || 'Member Transformation'}</div>
        <div className="tf-card-meta">
          {item.category && <span className="tf-card-tag">{item.category}</span>}
          {item.duration && <span className="tf-card-duration"><span style={{color:'var(--gold)'}}>⏱</span> {item.duration}</span>}
        </div>
        {item.quote && <p className="tf-card-quote">"{item.quote}"</p>}
        {item.story && (
          <>
            {item.quote && <div className="tf-card-divider" />}
            <button className="tf-card-story-toggle" onClick={() => setStoryOpen(o => !o)}>
              {storyOpen ? 'Hide Story' : 'Read Full Story'}
              <span style={{marginLeft:2,fontSize:10,transition:'transform 0.3s',display:'inline-block',transform:storyOpen?'rotate(180deg)':'rotate(0deg)'}}>▼</span>
            </button>
            <div className={`tf-card-story-wrap${storyOpen ? ' open' : ''}`}>
              <p className="tf-card-story" style={{paddingTop:10}}>{item.story}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const CATEGORIES = ['All', 'Weight Loss', 'Muscle Gain', 'Body Recomp', 'Strength', 'Endurance']

export default function Transformations() {
  const navigate  = useNavigate()
  const [filter, setFilter]   = useState('All')
  const [content, setContent] = useState(getContent())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent().then(data => { setContent(data); setLoading(false) })
      .catch(() => { setContent(getContent()); setLoading(false) })
  }, [])

  useEffect(() => {
    const handler = () => setContent(getContent())
    window.addEventListener('contentUpdated', handler)
    return () => window.removeEventListener('contentUpdated', handler)
  }, [])

  const tPage    = content.transformationsPage || {}
  const allTf    = tPage.transformations || []
  const filtered = filter === 'All' ? allTf : allTf.filter(t => t.category === filter)

  // Render title with gold highlight on the matching word/line
  const renderTitle = () => {
    const raw       = tPage.title || 'Real\nTransformations'
    const highlight = (tPage.titleHighlight || '').toLowerCase().trim()
    return raw.split('\n').map((line, i, arr) => {
      const isHighlight = highlight && line.toLowerCase().trim() === highlight
      return (
        <span key={i}>
          {isHighlight ? <span className="gold">{line}</span> : line}
          {i < arr.length - 1 && <br />}
        </span>
      )
    })
  }

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="page-loading"><div className="loading-spinner" /></div>
    </>
  )

  return (
    <>
      <style>{styles}</style>
      <Header activePage="TRANSFORMATIONS" />

      {/* ── PAGE HERO ── */}
      <div className="page-hero">
        <p className="page-hero-label">{tPage.label || 'Real Results'}</p>
        <h1 className="page-hero-title">{renderTitle()}</h1>
        <p className="page-hero-sub">{tPage.subtitle || 'Drag the slider on each card to reveal the transformation.'}</p>
      </div>

      {/* ── STATS ── */}
      <div className="tf-stats">
        {(tPage.stats || [
          { num: '500+',  label: 'Transformations' },
          { num: '92%',   label: 'Success Rate' },
          { num: '8 Wks', label: 'Avg. Timeframe' },
          { num: '40+',   label: 'Expert Coaches' },
        ]).map((s, i) => (
          <div className="tf-stat" key={i}>
            <span className="tf-stat-num">{s.num}</span>
            <span className="tf-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── FILTER BAR ── */}
      <div className="filter-bar">
        {CATEGORIES.map(cat => (
          <button key={cat}
            className={`filter-btn${filter === cat ? ' active' : ''}`}
            onClick={() => setFilter(cat)}>
            {cat}
          </button>
        ))}
      </div>

      {/* ── CARDS ── */}
      <div className="transformations-section">
        {filtered.length === 0 ? (
          <div className="tf-empty">
            <div className="tf-empty-icon">🏆</div>
            <div className="tf-empty-text">
              {filter === 'All' ? 'No Transformations Yet' : `No ${filter} entries`}
            </div>
            <div className="tf-empty-sub">
              {filter === 'All'
                ? 'Add member stories in Manager → Transformations'
                : 'Try a different filter or add entries in the Manager'}
            </div>
          </div>
        ) : (
          <div className="transformations-grid">
            {filtered.map((item, i) => <TransformationCard key={i} item={item} />)}
          </div>
        )}
      </div>

      {/* ── CTA ── */}
      <section className="tf-cta">
        <h2 className="tf-cta-title">Ready to Start Your<br /><span>Transformation?</span></h2>
        <p className="tf-cta-sub">Join hundreds of members who changed their lives</p>
        <button className="btn-primary" onClick={() => navigate('/register')}>
          {content.hero?.primaryBtn || 'Register Now'}
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <p className="footer-copy">{content.footer?.copyright}</p>
        <ul className="footer-links">
          {(content.footer?.links || []).map((link, i) => <li key={i}><a>{link}</a></li>)}
          <li><a style={{color:'var(--gold)',cursor:'pointer'}} onClick={() => navigate('/manager')}>⚙ Manager</a></li>
        </ul>
      </footer>
    </>
  )
}