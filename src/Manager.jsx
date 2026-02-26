import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getContent, fetchContent, updateContent, updateArrayItem,
  uploadImages, deleteHeroImage
} from './contentStore'
import './manager.css'

export default function Manager() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('hero')
  const [content, setContent] = useState(getContent())
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState({}) // track per-field upload loading

  // Load latest content from MongoDB on mount
  useEffect(() => {
    fetchContent().then(data => {
      setContent(data)
    })
  }, [])

  // Listen for external updates
  useEffect(() => {
    const handler = () => setContent(getContent())
    window.addEventListener('contentUpdated', handler)
    return () => window.removeEventListener('contentUpdated', handler)
  }, [])

  const showToast = (msg, color = '#2ecc71') => {
    setToast({ msg, color })
    setTimeout(() => setToast(null), 3500)
  }

  const setLoadingKey = (key, val) => setLoading(l => ({ ...l, [key]: val }))

  // ── Text update → MongoDB via PATCH ──
  const handleUpdate = async (path, value) => {
    await updateContent(path, value)
    setContent(getContent())
    window.dispatchEvent(new Event('contentUpdated'))
  }

  const handleArrayUpdate = async (path, index, field, value) => {
    await updateArrayItem(path, index, field, value)
    setContent(getContent())
    window.dispatchEvent(new Event('contentUpdated'))
  }

  // ── Generic array CRUD ──
  const addArrayItem = async (path, newItem) => {
    const keys = path.split('.')
    const fresh = await fetchContent()
    let obj = fresh
    for (const k of keys) obj = obj[k]
    await updateContent(path, [...obj, newItem])
    setContent(getContent())
    window.dispatchEvent(new Event('contentUpdated'))
  }

  const removeArrayItem = async (path, index) => {
    const keys = path.split('.')
    const fresh = await fetchContent()
    let obj = fresh
    for (const k of keys) obj = obj[k]
    await updateContent(path, obj.filter((_, i) => i !== index))
    setContent(getContent())
    window.dispatchEvent(new Event('contentUpdated'))
    showToast('✓ Item Removed')
  }

  // ── Hero image upload → Cloudinary ──
  const handleHeroImagesUpload = async (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setLoadingKey('hero', true)
    try {
      await uploadImages('hero', files)
      showToast(`✓ ${files.length} image${files.length > 1 ? 's' : ''} uploaded to Cloudinary`)
    } catch {
      showToast('✗ Upload failed', '#e74c3c')
    } finally {
      setLoadingKey('hero', false)
      e.target.value = ''
    }
  }

  const handleHeroImageDelete = async (index) => {
    setLoadingKey(`hero-del-${index}`, true)
    try {
      await deleteHeroImage(index)
      showToast('✓ Image removed')
    } catch {
      showToast('✗ Remove failed', '#e74c3c')
    } finally {
      setLoadingKey(`hero-del-${index}`, false)
    }
  }

  const moveHeroImage = async (index, dir) => {
    const arr = [...(content.hero.backgroundImages || [])]
    const t = index + dir
    if (t < 0 || t >= arr.length) return
    ;[arr[index], arr[t]] = [arr[t], arr[index]]
    await updateContent('hero.backgroundImages', arr)
    setContent(getContent())
    window.dispatchEvent(new Event('contentUpdated'))
  }

  // ── Class / trainer image upload → Cloudinary ──
  const handleClassImg = async (e, index) => {
    const file = e.target.files[0]
    if (!file) return
    const key = `class-${index}`
    setLoadingKey(key, true)
    try {
      await uploadImages('class', [file], index)
      showToast('✓ Class image uploaded')
    } catch {
      showToast('✗ Upload failed', '#e74c3c')
    } finally {
      setLoadingKey(key, false)
      e.target.value = ''
    }
  }

  const handleHomeClassImg = async (e, index) => {
    const file = e.target.files[0]
    if (!file) return
    const key = `hclass-${index}`
    setLoadingKey(key, true)
    try {
      await uploadImages('home-class', [file], index)
      showToast('✓ Image uploaded')
    } catch {
      showToast('✗ Upload failed', '#e74c3c')
    } finally {
      setLoadingKey(key, false)
      e.target.value = ''
    }
  }

  const handleTrainerImg = async (e, index) => {
    const file = e.target.files[0]
    if (!file) return
    const key = `trainer-${index}`
    setLoadingKey(key, true)
    try {
      await uploadImages('trainer', [file], index)
      showToast('✓ Trainer photo uploaded')
    } catch {
      showToast('✗ Upload failed', '#e74c3c')
    } finally {
      setLoadingKey(key, false)
      e.target.value = ''
    }
  }

  const saveChanges = () => showToast('✓ All Changes Saved to MongoDB')

  const sections = [
    { id: 'hero',         label: '🎯 Hero Section' },
    { id: 'logo',         label: '⚔️ Logo & Branding' },
    { id: 'stats',        label: '📊 Stats Bar' },
    { id: 'features',     label: '✨ Features' },
    { id: 'classes',      label: '🏋️ Classes (Home)' },
    { id: 'cta',          label: '📢 CTA Banner' },
    { id: 'footer',       label: '📄 Footer' },
    { id: 'about',        label: '📖 About Page' },
    { id: 'classesPage',  label: '🎓 Classes Page' },
    { id: 'trainersPage', label: '👥 Trainers Page' },
    { id: 'eventsPage',   label: '📅 Events Page' },
  ]

  const heroImages = content.hero?.backgroundImages || []

  // ── Re-usable UI ──
  const Spinner = () => (
    <span style={{display:'inline-block',width:14,height:14,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.7s linear infinite',marginRight:6}} />
  )

  const UploadThumb = ({ src, onUpload, onRemove, loadKey, label = 'Upload Photo' }) => (
    <div style={{marginBottom:8}}>
      {src ? (
        <div style={{position:'relative',display:'inline-block',width:'100%'}}>
          <img src={src} alt="preview" style={{width:'100%',maxHeight:160,objectFit:'cover',borderRadius:6,display:'block',border:'1px solid rgba(201,168,76,0.3)'}} />
          <button onClick={onRemove} style={{position:'absolute',top:6,right:6,background:'rgba(231,76,60,0.85)',border:'none',color:'#fff',borderRadius:3,padding:'2px 8px',cursor:'pointer',fontSize:12,fontWeight:700}}>✕</button>
          <div style={{position:'absolute',bottom:6,right:6,background:'rgba(6,8,16,0.7)',borderRadius:3,padding:'2px 7px',fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,letterSpacing:2,color:'rgba(201,168,76,0.8)',textTransform:'uppercase'}}>Cloudinary ☁</div>
        </div>
      ) : (
        <label style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6,border:'2px dashed rgba(201,168,76,0.3)',borderRadius:6,padding:'16px 12px',cursor:loading[loadKey]?'wait':'pointer',background:'rgba(201,168,76,0.03)',position:'relative',opacity:loading[loadKey]?0.7:1}}>
          <input type="file" accept="image/*" onChange={onUpload} disabled={loading[loadKey]} style={{position:'absolute',inset:0,opacity:0,cursor:'pointer'}} />
          {loading[loadKey] ? <Spinner /> : <span style={{fontSize:24,opacity:0.4}}>📸</span>}
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,letterSpacing:2,fontWeight:700,textTransform:'uppercase',color:'rgba(201,168,76,0.7)'}}>
            {loading[loadKey] ? 'Uploading to Cloudinary...' : label}
          </span>
        </label>
      )}
    </div>
  )

  const AddBtn = ({ onClick, label }) => (
    <button onClick={onClick} style={{display:'flex',alignItems:'center',gap:8,background:'rgba(201,168,76,0.08)',border:'1px dashed rgba(201,168,76,0.4)',color:'#c9a84c',padding:'12px 20px',borderRadius:4,cursor:'pointer',fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,letterSpacing:3,fontWeight:700,textTransform:'uppercase',width:'100%',justifyContent:'center',marginTop:12}}>
      <span style={{fontSize:18,lineHeight:1}}>+</span> {label}
    </button>
  )

  const RemoveBtn = ({ onClick }) => (
    <button onClick={onClick} style={{background:'rgba(231,76,60,0.1)',border:'1px solid rgba(231,76,60,0.3)',color:'#e74c3c',cursor:'pointer',padding:'5px 12px',borderRadius:3,fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,letterSpacing:2,textTransform:'uppercase',fontWeight:600}}>✕ Remove</button>
  )

  const StorageBadge = ({ type }) => (
    <span style={{marginLeft:8,fontSize:9,letterSpacing:2,padding:'2px 7px',borderRadius:3,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,textTransform:'uppercase',background: type==='cloudinary'?'rgba(52,152,219,0.15)':'rgba(46,204,113,0.15)',color: type==='cloudinary'?'#3498db':'#2ecc71',border:`1px solid ${type==='cloudinary'?'rgba(52,152,219,0.3)':'rgba(46,204,113,0.3)'}`}}>
      {type === 'cloudinary' ? '☁ Cloudinary' : '🍃 MongoDB'}
    </span>
  )

  return (
    <div className="mgr-root">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">Content Manager</div>
          <div className="sidebar-subtitle" style={{fontSize:10,letterSpacing:1,color:'rgba(201,168,76,0.6)',marginTop:4}}>
            ☁ Cloudinary · 🍃 MongoDB Atlas
          </div>
        </div>
        <nav className="sidebar-nav">
          {sections.map(item => (
            <div key={item.id} className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}>
              {item.label}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="btn btn-primary full-width" onClick={() => navigate('/')}>← Back to Website</button>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div className="page-title">Content Manager</div>
          <div className="topbar-actions">
            <button className="btn" onClick={() => navigate('/')}>Preview Site</button>
            <button className="btn btn-primary" onClick={saveChanges}>💾 Save All Changes</button>
          </div>
        </div>

        <div className="content">

          {/* ── HERO ── */}
          {activeSection === 'hero' && (
            <div className="section-card">
              <div className="section-header">
                <div className="section-title">Hero Section</div>
                <div className="section-desc">Images → Cloudinary &nbsp;·&nbsp; Text → MongoDB Atlas</div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Hero Slideshow Images <StorageBadge type="cloudinary" />
                  {heroImages.length > 0 && (
                    <span style={{marginLeft:8,fontSize:10,letterSpacing:2,color:'rgba(201,168,76,0.7)',fontWeight:700,background:'rgba(201,168,76,0.1)',padding:'2px 8px',borderRadius:3}}>
                      {heroImages.length} image{heroImages.length !== 1 ? 's' : ''} · slides every 3s
                    </span>
                  )}
                </label>

                {heroImages.length > 0 && (
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:12,marginBottom:16}}>
                    {heroImages.map((src, i) => (
                      <div key={i} style={{position:'relative',borderRadius:6,overflow:'hidden',border:'1px solid rgba(201,168,76,0.2)',background:'#0d1020'}}>
                        <img src={src} alt={`Slide ${i+1}`} style={{width:'100%',height:100,objectFit:'cover',display:'block'}} />
                        <div style={{position:'absolute',top:6,left:6,background:'rgba(201,168,76,0.9)',color:'#060810',fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,letterSpacing:1,padding:'2px 7px',borderRadius:3}}>{i+1}</div>
                        <div style={{position:'absolute',bottom:0,left:0,right:0,display:'flex',justifyContent:'space-between',padding:6,background:'rgba(6,8,16,0.8)',gap:4}}>
                          <div style={{display:'flex',gap:3}}>
                            <button onClick={() => moveHeroImage(i,-1)} disabled={i===0} style={{background:i===0?'rgba(255,255,255,0.05)':'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.1)',color:i===0?'rgba(255,255,255,0.2)':'#fff',cursor:i===0?'not-allowed':'pointer',padding:'2px 6px',borderRadius:3,fontSize:11}}>←</button>
                            <button onClick={() => moveHeroImage(i,1)} disabled={i===heroImages.length-1} style={{background:i===heroImages.length-1?'rgba(255,255,255,0.05)':'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.1)',color:i===heroImages.length-1?'rgba(255,255,255,0.2)':'#fff',cursor:i===heroImages.length-1?'not-allowed':'pointer',padding:'2px 6px',borderRadius:3,fontSize:11}}>→</button>
                          </div>
                          <button onClick={() => handleHeroImageDelete(i)} disabled={loading[`hero-del-${i}`]} style={{background:'rgba(231,76,60,0.2)',border:'1px solid rgba(231,76,60,0.3)',color:'#e74c3c',cursor:'pointer',padding:'2px 7px',borderRadius:3,fontSize:11}}>
                            {loading[`hero-del-${i}`] ? '...' : '✕'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <label style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8,border:`2px dashed ${heroImages.length>0?'rgba(201,168,76,0.25)':'rgba(201,168,76,0.45)'}`,borderRadius:8,padding:'28px 20px',background:'rgba(201,168,76,0.03)',cursor:loading.hero?'wait':'pointer',position:'relative',opacity:loading.hero?0.7:1}}>
                  <input type="file" accept="image/*" multiple onChange={handleHeroImagesUpload} disabled={loading.hero} style={{position:'absolute',inset:0,opacity:0,cursor:'pointer'}} />
                  {loading.hero ? <Spinner /> : <div style={{fontSize:28,opacity:0.5}}>📸</div>}
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,letterSpacing:3,textTransform:'uppercase',color:'rgba(201,168,76,0.8)'}}>
                    {loading.hero ? 'Uploading to Cloudinary...' : (heroImages.length > 0 ? '+ Add More Images' : 'Upload Hero Images')}
                  </div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,letterSpacing:1,color:'rgba(255,255,255,0.25)'}}>Select multiple · JPG, PNG, WebP → saved to Cloudinary</div>
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">Eyebrow Text <StorageBadge type="mongo" /></label>
                <input className="form-input" value={content.hero?.eyebrow || ''} onChange={e => handleUpdate('hero.eyebrow', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Main Title (use \n for line breaks)</label>
                <textarea className="form-textarea" value={content.hero?.title || ''} onChange={e => handleUpdate('hero.title', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Highlighted Word</label>
                <input className="form-input" value={content.hero?.titleHighlight || ''} onChange={e => handleUpdate('hero.titleHighlight', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Subtitle</label>
                <input className="form-input" value={content.hero?.subtitle || ''} onChange={e => handleUpdate('hero.subtitle', e.target.value)} />
              </div>
              <div className="form-grid">
                <div className="form-group"><label className="form-label">Primary Button</label><input className="form-input" value={content.hero?.primaryBtn || ''} onChange={e => handleUpdate('hero.primaryBtn', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Secondary Button</label><input className="form-input" value={content.hero?.secondaryBtn || ''} onChange={e => handleUpdate('hero.secondaryBtn', e.target.value)} /></div>
              </div>
            </div>
          )}

          {/* ── LOGO ── */}
          {activeSection === 'logo' && (
            <div className="section-card">
              <div className="section-header"><div className="section-title">Logo & Branding <StorageBadge type="mongo" /></div></div>
              <div className="form-group"><label className="form-label">Logo Icon</label><input className="form-input" value={content.logo?.emblemIcon || ''} onChange={e => handleUpdate('logo.emblemIcon', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Top Text</label><input className="form-input" value={content.logo?.topText || ''} onChange={e => handleUpdate('logo.topText', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Bottom Text</label><input className="form-input" value={content.logo?.bottomText || ''} onChange={e => handleUpdate('logo.bottomText', e.target.value)} /></div>
            </div>
          )}

          {/* ── STATS ── */}
          {activeSection === 'stats' && (
            <div className="section-card">
              <div className="section-header"><div className="section-title">Stats Bar <StorageBadge type="mongo" /></div></div>
              {(content.stats || []).map((stat, i) => (
                <div key={i} className="array-item">
                  <div className="array-item-title">Stat {i+1}</div>
                  <div className="form-grid">
                    <div className="form-group"><label className="form-label">Number</label><input className="form-input" value={stat.num} onChange={e => handleArrayUpdate('stats', i, 'num', e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Label</label><input className="form-input" value={stat.label} onChange={e => handleArrayUpdate('stats', i, 'label', e.target.value)} /></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── FEATURES ── */}
          {activeSection === 'features' && (
            <div className="section-card">
              <div className="section-header"><div className="section-title">Features Section <StorageBadge type="mongo" /></div></div>
              <div className="form-group"><label className="form-label">Section Label</label><input className="form-input" value={content.featuresSection?.label || ''} onChange={e => handleUpdate('featuresSection.label', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Section Title</label><textarea className="form-textarea" value={content.featuresSection?.title || ''} onChange={e => handleUpdate('featuresSection.title', e.target.value)} /></div>
              {(content.features || []).map((f, i) => (
                <div key={i} className="array-item">
                  <div className="array-item-title">Feature {i+1}</div>
                  <div className="form-group"><label className="form-label">Icon</label><input className="form-input" value={f.icon} onChange={e => handleArrayUpdate('features', i, 'icon', e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Title</label><input className="form-input" value={f.title} onChange={e => handleArrayUpdate('features', i, 'title', e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={f.desc} onChange={e => handleArrayUpdate('features', i, 'desc', e.target.value)} /></div>
                </div>
              ))}
            </div>
          )}

          {/* ── HOME CLASSES ── */}
          {activeSection === 'classes' && (
            <div className="section-card">
              <div className="section-header"><div className="section-title">Classes (Home Page)</div></div>
              <div className="form-group"><label className="form-label">Section Label</label><input className="form-input" value={content.classesSection?.label || ''} onChange={e => handleUpdate('classesSection.label', e.target.value)} /></div>
              <div className="form-grid">
                <div className="form-group"><label className="form-label">Title</label><input className="form-input" value={content.classesSection?.title || ''} onChange={e => handleUpdate('classesSection.title', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Button</label><input className="form-input" value={content.classesSection?.buttonText || ''} onChange={e => handleUpdate('classesSection.buttonText', e.target.value)} /></div>
              </div>
              {(content.classes || []).map((c, i) => (
                <div key={i} className="array-item">
                  <div className="array-item-title" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    Class {i+1} <RemoveBtn onClick={() => removeArrayItem('classes', i)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Image <StorageBadge type="cloudinary" /></label>
                    <UploadThumb src={c.image} loadKey={`hclass-${i}`} onUpload={e => handleHomeClassImg(e, i)} onRemove={() => handleArrayUpdate('classes', i, 'image', null)} />
                  </div>
                  <div className="form-grid">
                    <div className="form-group"><label className="form-label">Tag</label><input className="form-input" value={c.tag} onChange={e => handleArrayUpdate('classes', i, 'tag', e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={c.name} onChange={e => handleArrayUpdate('classes', i, 'name', e.target.value)} /></div>
                  </div>
                </div>
              ))}
              <AddBtn label="Add New Class" onClick={() => addArrayItem('classes', { tag: 'New', name: 'New Class', bg: 'linear-gradient(135deg,#1a2535,#0d1525)', image: null })} />
            </div>
          )}

          {/* ── CTA ── */}
          {activeSection === 'cta' && (
            <div className="section-card">
              <div className="section-header"><div className="section-title">CTA Banner <StorageBadge type="mongo" /></div></div>
              <div className="form-group"><label className="form-label">Label</label><input className="form-input" value={content.cta?.label || ''} onChange={e => handleUpdate('cta.label', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Title</label><textarea className="form-textarea" value={content.cta?.title || ''} onChange={e => handleUpdate('cta.title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Button Text</label><input className="form-input" value={content.cta?.buttonText || ''} onChange={e => handleUpdate('cta.buttonText', e.target.value)} /></div>
            </div>
          )}

          {/* ── FOOTER ── */}
          {activeSection === 'footer' && (
            <div className="section-card">
              <div className="section-header"><div className="section-title">Footer <StorageBadge type="mongo" /></div></div>
              <div className="form-group"><label className="form-label">Copyright</label><input className="form-input" value={content.footer?.copyright || ''} onChange={e => handleUpdate('footer.copyright', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Links (comma separated)</label><input className="form-input" value={(content.footer?.links || []).join(', ')} onChange={e => handleUpdate('footer.links', e.target.value.split(',').map(s => s.trim()))} /></div>
            </div>
          )}

          {/* ── ABOUT ── */}
          {activeSection === 'about' && (
            <div className="section-card">
              <div className="section-header"><div className="section-title">About Page <StorageBadge type="mongo" /></div></div>
              <div className="form-group"><label className="form-label">Title</label><input className="form-input" value={content.about?.title || ''} onChange={e => handleUpdate('about.title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Subtitle</label><input className="form-input" value={content.about?.subtitle || ''} onChange={e => handleUpdate('about.subtitle', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Mission</label><textarea className="form-textarea" value={content.about?.mission || ''} onChange={e => handleUpdate('about.mission', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Vision</label><textarea className="form-textarea" value={content.about?.vision || ''} onChange={e => handleUpdate('about.vision', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Values</label><textarea className="form-textarea" value={content.about?.values || ''} onChange={e => handleUpdate('about.values', e.target.value)} /></div>
            </div>
          )}

          {/* ── CLASSES PAGE ── */}
          {activeSection === 'classesPage' && (
            <div className="section-card">
              <div className="section-header">
                <div className="section-title">Classes Page</div>
                <div className="section-desc">Photos → Cloudinary &nbsp;·&nbsp; Class info → MongoDB</div>
              </div>
              <div className="form-group"><label className="form-label">Page Title</label><input className="form-input" value={content.classesPage?.title || ''} onChange={e => handleUpdate('classesPage.title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Subtitle</label><input className="form-input" value={content.classesPage?.subtitle || ''} onChange={e => handleUpdate('classesPage.subtitle', e.target.value)} /></div>

              {(content.classesPage?.classList || []).map((cls, i) => (
                <div key={i} className="array-item">
                  <div className="array-item-title" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span>{cls.name || `Class ${i+1}`}</span>
                    <RemoveBtn onClick={() => removeArrayItem('classesPage.classList', i)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Class Photo <StorageBadge type="cloudinary" /></label>
                    <UploadThumb src={cls.image} loadKey={`class-${i}`} onUpload={e => handleClassImg(e, i)} onRemove={() => handleArrayUpdate('classesPage.classList', i, 'image', null)} />
                  </div>
                  <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={cls.name} onChange={e => handleArrayUpdate('classesPage.classList', i, 'name', e.target.value)} /></div>
                  <div className="form-grid">
                    <div className="form-group"><label className="form-label">Time</label><input className="form-input" value={cls.time} onChange={e => handleArrayUpdate('classesPage.classList', i, 'time', e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Trainer</label><input className="form-input" value={cls.trainer} onChange={e => handleArrayUpdate('classesPage.classList', i, 'trainer', e.target.value)} /></div>
                  </div>
                  <div className="form-grid">
                    <div className="form-group"><label className="form-label">Level</label><input className="form-input" value={cls.level} onChange={e => handleArrayUpdate('classesPage.classList', i, 'level', e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Spots</label><input className="form-input" type="number" value={cls.spots} onChange={e => handleArrayUpdate('classesPage.classList', i, 'spots', parseInt(e.target.value))} /></div>
                  </div>
                </div>
              ))}
              <AddBtn label="Add New Class" onClick={() => addArrayItem('classesPage.classList', { name: 'New Class', time: 'Mon, Wed — 7:00 AM', trainer: 'Coach Name', level: 'All Levels', spots: 20, image: null })} />
            </div>
          )}

          {/* ── TRAINERS PAGE ── */}
          {activeSection === 'trainersPage' && (
            <div className="section-card">
              <div className="section-header">
                <div className="section-title">Trainers Page</div>
                <div className="section-desc">Photos → Cloudinary &nbsp;·&nbsp; Trainer info → MongoDB</div>
              </div>
              <div className="form-group"><label className="form-label">Page Title</label><input className="form-input" value={content.trainersPage?.title || ''} onChange={e => handleUpdate('trainersPage.title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Subtitle</label><input className="form-input" value={content.trainersPage?.subtitle || ''} onChange={e => handleUpdate('trainersPage.subtitle', e.target.value)} /></div>

              {(content.trainersPage?.trainers || []).map((t, i) => (
                <div key={i} className="array-item">
                  <div className="array-item-title" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span>{t.name || `Trainer ${i+1}`}</span>
                    <RemoveBtn onClick={() => removeArrayItem('trainersPage.trainers', i)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Trainer Photo <StorageBadge type="cloudinary" /></label>
                    <UploadThumb src={t.photo} loadKey={`trainer-${i}`} label="Upload Photo" onUpload={e => handleTrainerImg(e, i)} onRemove={() => handleArrayUpdate('trainersPage.trainers', i, 'photo', null)} />
                  </div>
                  <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={t.name} onChange={e => handleArrayUpdate('trainersPage.trainers', i, 'name', e.target.value)} /></div>
                  <div className="form-grid">
                    <div className="form-group"><label className="form-label">Specialty</label><input className="form-input" value={t.specialty} onChange={e => handleArrayUpdate('trainersPage.trainers', i, 'specialty', e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Experience</label><input className="form-input" value={t.exp} onChange={e => handleArrayUpdate('trainersPage.trainers', i, 'exp', e.target.value)} /></div>
                  </div>
                </div>
              ))}
              <AddBtn label="Add New Trainer" onClick={() => addArrayItem('trainersPage.trainers', { name: 'New Trainer', specialty: 'Fitness & Conditioning', exp: '1 year', photo: null })} />
            </div>
          )}

          {/* ── EVENTS PAGE ── */}
          {activeSection === 'eventsPage' && (
            <div className="section-card">
              <div className="section-header"><div className="section-title">Events Page <StorageBadge type="mongo" /></div></div>
              <div className="form-group"><label className="form-label">Title</label><input className="form-input" value={content.eventsPage?.title || ''} onChange={e => handleUpdate('eventsPage.title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Subtitle</label><input className="form-input" value={content.eventsPage?.subtitle || ''} onChange={e => handleUpdate('eventsPage.subtitle', e.target.value)} /></div>
              {(content.eventsPage?.events || []).map((ev, i) => (
                <div key={i} className="array-item">
                  <div className="array-item-title" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    Event {i+1} <RemoveBtn onClick={() => removeArrayItem('eventsPage.events', i)} />
                  </div>
                  <div className="form-group"><label className="form-label">Title</label><input className="form-input" value={ev.title} onChange={e => handleArrayUpdate('eventsPage.events', i, 'title', e.target.value)} /></div>
                  <div className="form-grid">
                    <div className="form-group"><label className="form-label">Date</label><input className="form-input" value={ev.date} onChange={e => handleArrayUpdate('eventsPage.events', i, 'date', e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Category</label><input className="form-input" value={ev.cat} onChange={e => handleArrayUpdate('eventsPage.events', i, 'cat', e.target.value)} /></div>
                  </div>
                  <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={ev.desc} onChange={e => handleArrayUpdate('eventsPage.events', i, 'desc', e.target.value)} /></div>
                </div>
              ))}
              <AddBtn label="Add New Event" onClick={() => addArrayItem('eventsPage.events', { title: 'New Event', date: 'TBD', cat: 'General', desc: 'Event description.' })} />
            </div>
          )}

        </div>
      </main>

      {toast && <div className="toast" style={{background: toast.color}}>{toast.msg}</div>}
    </div>
  )
}