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
  .eq-section { padding: 80px 80px; }
  .eq-section.darker { background: var(--darker); }
  .eq-section.dark   { background: var(--dark); }
  .section-label { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 5px; font-weight: 700; text-transform: uppercase; color: var(--gold); margin-bottom: 14px; }
  .section-title { font-family: 'Bebas Neue', cursive; font-size: clamp(32px, 5vw, 64px); line-height: 1; color: var(--white); margin-bottom: 40px; }
  .eq-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 2px; }
  .eq-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 32px 28px; transition: background 0.3s, border-color 0.3s; display: flex; flex-direction: column; gap: 10px; }
  .eq-card:hover { background: rgba(201,168,76,0.06); border-color: rgba(201,168,76,0.25); }
  .eq-card-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
  .eq-card-name { font-family: 'Bebas Neue', cursive; font-size: 24px; letter-spacing: 1px; color: var(--white); line-height: 1; }
  .eq-badge { background: rgba(201,168,76,0.15); color: var(--gold); padding: 3px 10px; font-family: 'Barlow Condensed', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 1px; border: 1px solid rgba(201,168,76,0.3); white-space: nowrap; flex-shrink: 0; }
  .eq-brand { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 3px; font-weight: 600; text-transform: uppercase; color: var(--gold); }
  .eq-empty { padding: 48px; text-align: center; border: 2px dashed rgba(255,255,255,0.06); font-family: 'Barlow Condensed', sans-serif; font-size: 13px; letter-spacing: 3px; color: var(--muted); text-transform: uppercase; }
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
    .eq-section { padding: 52px 20px; }
    .eq-grid { grid-template-columns: 1fr; }
    .cta-section { flex-direction: column; align-items: flex-start; padding: 52px 20px; gap: 24px; }
    .cta-section .btn-dark { width: 100%; text-align: center; }
    .footer { padding: 28px 20px; flex-direction: column; align-items: flex-start; }
  }
`

export default function Equipment() {
  const navigate  = useNavigate()
  const [content, setContent] = useState(getContent())

  useEffect(() => {
    const h = () => setContent(getContent())
    window.addEventListener('contentUpdated', h)
    return () => window.removeEventListener('contentUpdated', h)
  }, [])

  const equipmentPage = content.equipmentPage || {}
  const categories    = equipmentPage.categories || []

  return (
    <>
      <style>{styles}</style>
      <Header activePage="EQUIPMENT" />

      <div className="page-header">
        <h1>Gym <span>Equipment</span></h1>
        <p>{equipmentPage.subtitle || 'State-of-the-art equipment from leading brands'}</p>
      </div>

      {categories.length === 0 && (
        <section className="eq-section darker">
          <div className="eq-empty">No equipment added yet — manage via the Content Manager</div>
        </section>
      )}

      {categories.map((cat, i) => (
        <section key={i} className={`eq-section ${i % 2 === 0 ? 'darker' : 'dark'}`}>
          <p className="section-label">{cat.cat} Equipment</p>
          <h2 className="section-title">{cat.cat}</h2>
          {!cat.items?.length ? (
            <div className="eq-empty">No items in this category yet</div>
          ) : (
            <div className="eq-grid">
              {cat.items.map((item, j) => (
                <div key={j} className="eq-card">
                  <div className="eq-card-top">
                    <span className="eq-card-name">{item.name}</span>
                    <span className="eq-badge">{item.count}</span>
                  </div>
                  <span className="eq-brand">{item.brand}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}

      <section className="cta-section">
        <div className="cta-text">
          <p className="section-label">See It In Person</p>
          <h2 className="section-title">Equipment Tour<br />Available</h2>
        </div>
        <button className="btn-dark" onClick={() => navigate('/register')}>Schedule Tour</button>
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