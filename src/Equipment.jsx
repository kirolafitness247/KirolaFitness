import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getContent, fetchContent } from './contentStore'
import Header from './Header'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;900&family=Barlow+Condensed:wght@400;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root { --dark: #0a0d1a; --darker: #060810; --gold: #c9a84c; --white: #ffffff; --muted: #8a9ab5; }
  body { background: var(--dark); color: var(--white); font-family: 'Barlow', sans-serif; overflow-x: hidden; }

  .page-header { padding: 140px 80px 40px; background: var(--darker); display: flex; flex-direction: column; justify-content: flex-end; }
  .page-header h1 { font-family: 'Bebas Neue', cursive; font-size: clamp(44px, 7vw, 96px); line-height: 0.92; letter-spacing: 2px; color: var(--white); margin-bottom: 16px; }
  .page-header h1 span { color: var(--gold); }
  .page-header p { font-family: 'Barlow Condensed', sans-serif; font-size: 15px; letter-spacing: 2px; color: var(--muted); }

  .eq-section { padding: 80px 80px; }
  .eq-section.darker { background: var(--darker); }
  .eq-section.dark   { background: var(--dark); }

  .cat-header {
    display: flex;
    align-items: center;
    gap: 32px;
    margin-bottom: 40px;
  }

  .cat-cover {
    width: 280px;
    aspect-ratio: 3 / 4;
    object-fit: cover;
    object-position: center top;
    border-radius: 4px;
    border: 1px solid rgba(201,168,76,0.2);
    flex-shrink: 0;
    display: block;
  }

  .cat-text { flex: 1; }
  .section-label { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 5px; font-weight: 700; text-transform: uppercase; color: var(--gold); margin-bottom: 6px; }
  .section-title { font-family: 'Bebas Neue', cursive; font-size: clamp(32px, 5vw, 64px); line-height: 1; color: var(--white); }

  .eq-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 2px; }

  .eq-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); transition: background 0.3s, border-color 0.3s; display: flex; flex-direction: column; overflow: hidden; }
  .eq-card:hover { background: rgba(201,168,76,0.06); border-color: rgba(201,168,76,0.25); }
  .eq-card-img { width: 100%; height: 160px; object-fit: contain; display: block; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .eq-card-img-placeholder { width: 100%; height: 160px; background: rgba(255,255,255,0.02); display: flex; align-items: center; justify-content: center; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .eq-card-img-placeholder span { font-size: 32px; opacity: 0.08; }
  .eq-card-body { padding: 24px 24px 20px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
  .eq-card-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
  .eq-card-name { font-family: 'Bebas Neue', cursive; font-size: 22px; letter-spacing: 1px; color: var(--white); line-height: 1; }
  .eq-badge { background: rgba(201,168,76,0.15); color: var(--gold); padding: 3px 10px; font-family: 'Barlow Condensed', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 1px; border: 1px solid rgba(201,168,76,0.3); white-space: nowrap; flex-shrink: 0; border-radius: 2px; }
  .eq-brand { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 3px; font-weight: 600; text-transform: uppercase; color: var(--gold); }

  .eq-empty { padding: 48px; text-align: center; border: 2px dashed rgba(255,255,255,0.06); font-family: 'Barlow Condensed', sans-serif; font-size: 13px; letter-spacing: 3px; color: var(--muted); text-transform: uppercase; }

  .cta-section { padding: 80px 80px; background: var(--gold); display: flex; align-items: center; justify-content: space-between; gap: 40px; }
  .cta-text .section-label { color: rgba(0,0,0,0.5); }
  .cta-text .section-title { color: var(--darker); margin-bottom: 0; }
  .btn-dark { background: var(--darker); color: var(--white); border: none; padding: 18px 48px; font-family: 'Barlow Condensed', sans-serif; font-size: 13px; letter-spacing: 4px; font-weight: 700; text-transform: uppercase; cursor: pointer; transition: all 0.25s; flex-shrink: 0; }
  .btn-dark:hover { background: #000; }

  .footer { background: var(--darker); padding: 36px 80px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.07); flex-wrap: wrap; gap: 16px; }
  .footer-copy { font-family: 'Barlow Condensed', sans-serif; font-size: 12px; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; }

  @media (max-width: 768px) {
    .page-header { padding: 100px 20px 48px; }
    .eq-section { padding: 48px 20px; }
    .cat-header { flex-direction: column; align-items: flex-start; gap: 16px; }
    .cat-cover { width: 100%; aspect-ratio: 3 / 4; object-position: center top; }
    .eq-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 2px; }
    .eq-card-img { height: 120px; }
    .eq-card-img-placeholder { height: 120px; }
    .eq-card-body { padding: 16px; }
    .eq-card-name { font-size: 18px; }
    .cta-section { padding: 48px 20px; flex-direction: column; align-items: flex-start; gap: 24px; }
    .btn-dark { width: 100%; text-align: center; }
    .footer { padding: 28px 20px; }
  }

  @media (max-width: 480px) {
    .eq-grid { grid-template-columns: 1fr 1fr; }
  }
`

export default function Equipment() {
  const navigate = useNavigate()
  const [content, setContent] = useState(getContent())

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchContent()
      setContent(data)
    }

    loadData()

    const h = () => setContent(getContent())
    window.addEventListener('contentUpdated', h)

    return () => window.removeEventListener('contentUpdated', h)
  }, [])

  const equipmentPage = content.equipmentPage || {}
  const categories = equipmentPage.categories || []

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
          <div className="cat-header">
            {cat.image && (
              <img src={cat.image} alt={cat.cat} className="cat-cover" />
            )}
            <div className="cat-text">
              <p className="section-label">Category</p>
              <h2 className="section-title">{cat.cat}</h2>
            </div>
          </div>

          {cat.items?.length > 0 && (
            <div className="eq-grid">
              {cat.items.map((item, j) => (
                <div key={j} className="eq-card">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="eq-card-img" />
                  ) : (
                    <div className="eq-card-img-placeholder">
                      <span>🏋️</span>
                    </div>
                  )}
                  <div className="eq-card-body">
                    <div className="eq-card-top">
                      <span className="eq-card-name">{item.name}</span>
                      <span className="eq-badge">{item.count}</span>
                    </div>
                    <span className="eq-brand">{item.brand}</span>
                  </div>
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
        <button className="btn-dark" onClick={() => navigate('/register')}>
          Schedule Tour
        </button>
      </section>

      <footer className="footer">
        <p className="footer-copy">{content.footer?.copyright}</p>
      </footer>
    </>
  )
}