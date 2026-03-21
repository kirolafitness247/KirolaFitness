import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getContent, fetchContent, updateContent, updateArrayItem,
  uploadImages, deleteHeroImage
} from './contentStore'
import './manager.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const TF_CATEGORIES = ['Weight Loss', 'Muscle Gain', 'Body Recomp', 'Strength', 'Endurance']

async function rawUpload(endpoint, file, extraFields = {}) {
  const formData = new FormData()
  formData.append('image', file)
  for (const [k, v] of Object.entries(extraFields)) formData.append(k, v)
  const res = await fetch(`${API_BASE}${endpoint}`, { method: 'POST', body: formData })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export default function Manager() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('hero')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [content, setContent] = useState(getContent())
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState({})
  const [registrations, setRegistrations] = useState([])
  const [regLoading, setRegLoading] = useState(false)
  const [classBookings, setClassBookings] = useState([])
  const [classBookingsLoading, setClassBookingsLoading] = useState(false)
  const [members, setMembers] = useState([])
  const [membersLoading, setMembersLoading] = useState(false)

  const fetchRegistrations = async () => {
    setRegLoading(true)
    try { const res = await fetch(`${API_BASE}/registrations`); if (res.ok) { const j = await res.json(); setRegistrations(j.data || []) } }
    catch (err) { console.error(err) }
    setRegLoading(false)
  }
  const deleteRegistration = async (id) => {
    if (!window.confirm('Remove this registration?')) return
    try { await fetch(`${API_BASE}/registrations/${id}`, { method: 'DELETE' }); setRegistrations(p => p.filter(r => r._id !== id)); showToast('✓ Registration removed') }
    catch { showToast('✗ Failed to remove', '#e74c3c') }
  }
  const deleteAllRegistrations = async () => {
    if (!window.confirm(`Delete ALL ${registrations.length} registrations? This cannot be undone.`)) return
    try {
      await fetch(`${API_BASE}/registrations`, { method: 'DELETE' })
      setRegistrations([])
      showToast('✓ All registrations removed')
    } catch { showToast('✗ Failed to remove all', '#e74c3c') }
  }

  const fetchClassBookings = async () => {
    setClassBookingsLoading(true)
    try { const res = await fetch(`${API_BASE}/class-bookings`); if (res.ok) { const j = await res.json(); setClassBookings(j.data || []) } }
    catch (err) { console.error(err) }
    setClassBookingsLoading(false)
  }
  const deleteClassBooking = async (id) => {
    if (!window.confirm('Remove this booking?')) return
    try { await fetch(`${API_BASE}/class-bookings/${id}`, { method: 'DELETE' }); setClassBookings(p => p.filter(b => b._id !== id)); showToast('✓ Booking removed') }
    catch { showToast('✗ Failed to remove', '#e74c3c') }
  }
  const deleteAllClassBookings = async () => {
    if (!window.confirm(`Delete ALL ${classBookings.length} bookings? This cannot be undone.`)) return
    try {
      await fetch(`${API_BASE}/class-bookings`, { method: 'DELETE' })
      setClassBookings([])
      showToast('✓ All bookings removed')
    } catch { showToast('✗ Failed to remove all', '#e74c3c') }
  }

  const fetchMembers = async () => {
    setMembersLoading(true)
    try { const res = await fetch(`${API_BASE}/members`); if (res.ok) { const j = await res.json(); setMembers(j.data || []) } }
    catch (err) { console.error(err) }
    setMembersLoading(false)
  }
  const deleteMember = async (id) => {
    if (!window.confirm('Remove this member registration?')) return
    try { await fetch(`${API_BASE}/members/${id}`, { method: 'DELETE' }); setMembers(p => p.filter(m => m._id !== id)); showToast('✓ Member removed') }
    catch { showToast('✗ Failed to remove', '#e74c3c') }
  }
  const deleteAllMembers = async () => {
    if (!window.confirm(`Delete ALL ${members.length} members? This cannot be undone.`)) return
    try {
      await fetch(`${API_BASE}/members`, { method: 'DELETE' })
      setMembers([])
      showToast('✓ All members removed')
    } catch { showToast('✗ Failed to remove all', '#e74c3c') }
  }

  useEffect(() => { fetchContent().then(data => setContent(data)) }, [])
  useEffect(() => {
    if (activeSection === 'registrations') fetchRegistrations()
    if (activeSection === 'classBookings') fetchClassBookings()
    if (activeSection === 'members') fetchMembers()
  }, [activeSection])
  useEffect(() => {
    const handler = () => setContent(getContent())
    window.addEventListener('contentUpdated', handler)
    return () => window.removeEventListener('contentUpdated', handler)
  }, [])

  const showToast = (msg, color = '#2ecc71') => { setToast({ msg, color }); setTimeout(() => setToast(null), 3500) }
  const setLK = (key, val) => setLoading(l => ({ ...l, [key]: val }))
  const refresh = async () => { const d = await fetchContent(); setContent(d); window.dispatchEvent(new Event('contentUpdated')) }

  const handleUpdate = async (path, value) => { await updateContent(path, value); setContent(getContent()); window.dispatchEvent(new Event('contentUpdated')) }
  const handleArrayUpdate = async (path, index, field, value) => { await updateArrayItem(path, index, field, value); setContent(getContent()); window.dispatchEvent(new Event('contentUpdated')) }
  const addArrayItem = async (path, newItem) => {
    const keys = path.split('.'); const fresh = await fetchContent(); let obj = fresh
    for (const k of keys) obj = obj[k]
    await updateContent(path, [...obj, newItem]); setContent(getContent()); window.dispatchEvent(new Event('contentUpdated'))
  }
  const removeArrayItem = async (path, index) => {
    const keys = path.split('.'); const fresh = await fetchContent(); let obj = fresh
    for (const k of keys) obj = obj[k]
    await updateContent(path, obj.filter((_, i) => i !== index)); setContent(getContent()); window.dispatchEvent(new Event('contentUpdated')); showToast('✓ Item Removed')
  }

  const handleHeroImagesUpload = async (e) => {
    const files = Array.from(e.target.files || []); if (!files.length) return; e.target.value = ''
    let i = 0
    const next = () => {
      if (i >= files.length) return
      const file = files[i]; setLK('hero', true)
      ;(async () => {
        try { await uploadImages('hero', [file]); showToast(`✓ Image ${i+1}/${files.length} uploaded`) }
        catch { showToast('✗ Upload failed', '#e74c3c') }
        finally { setLK('hero', false) }
        i++; next()
      })()
    }
    next()
  }
  const handleHeroImageDelete = async (index) => {
    setLK(`hero-del-${index}`, true)
    try { await deleteHeroImage(index); showToast('✓ Image removed') }
    catch { showToast('✗ Remove failed', '#e74c3c') }
    finally { setLK(`hero-del-${index}`, false) }
  }
  const moveHeroImage = async (index, dir) => {
    const arr = [...(content.hero.backgroundImages || [])]; const t = index + dir
    if (t < 0 || t >= arr.length) return
    ;[arr[index], arr[t]] = [arr[t], arr[index]]
    await updateContent('hero.backgroundImages', arr); setContent(getContent()); window.dispatchEvent(new Event('contentUpdated'))
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0]; e.target.value = ''; if (!file) return
    setLK('logo', true)
    try { await rawUpload('/upload/logo', file); await refresh(); showToast('✓ Logo uploaded') }
    catch (err) { showToast('✗ Upload failed: ' + err.message, '#e74c3c') }
    finally { setLK('logo', false) }
  }
  const handleClassImg = async (e, index) => {
    const file = e.target.files[0]; e.target.value = ''; if (!file) return
    const key = `class-${index}`; setLK(key, true)
    try { await rawUpload(`/upload/class/${index}`, file); await refresh(); showToast('✓ Class image uploaded') }
    catch (err) { showToast('✗ Upload failed: ' + err.message, '#e74c3c') }
    finally { setLK(key, false) }
  }
  const handleHomeClassImg = async (e, index) => {
    const file = e.target.files[0]; e.target.value = ''; if (!file) return
    const key = `hclass-${index}`; setLK(key, true)
    try { await rawUpload(`/upload/home-class/${index}`, file); await refresh(); showToast('✓ Moment image uploaded') }
    catch (err) { showToast('✗ Upload failed: ' + err.message, '#e74c3c') }
    finally { setLK(key, false) }
  }
  const handleEventImg = async (e, index) => {
    const file = e.target.files[0]; e.target.value = ''; if (!file) return
    const key = `event-${index}`; setLK(key, true)
    try { await rawUpload(`/upload/event/${index}`, file); await refresh(); showToast('✓ Event image uploaded') }
    catch (err) { showToast('✗ Upload failed: ' + err.message, '#e74c3c') }
    finally { setLK(key, false) }
  }
  const handleTrainerImg = async (e, index) => {
    const file = e.target.files[0]; e.target.value = ''; if (!file) return
    const key = `trainer-${index}`; setLK(key, true)
    try { await rawUpload(`/upload/trainer/${index}`, file); await refresh(); showToast('✓ Trainer photo uploaded') }
    catch (err) { showToast('✗ Upload failed: ' + err.message, '#e74c3c') }
    finally { setLK(key, false) }
  }
  const handleTransformationImg = async (e, tfIndex, imageType) => {
    const file = e.target.files[0]; e.target.value = ''; if (!file) return
    const key = `tf-${tfIndex}-${imageType}`; setLK(key, true)
    try { await rawUpload('/upload/transformation', file, { index: tfIndex, imageType }); await refresh(); showToast(`✓ ${imageType === 'before' ? 'Before' : 'After'} image uploaded`) }
    catch (err) { showToast('✗ Upload failed: ' + err.message, '#e74c3c') }
    finally { setLK(key, false) }
  }

  const addTransformation = async () => {
    const fresh = await fetchContent(); const existing = fresh.transformationsPage?.transformations || []
    const newItem = { name: '', category: 'Weight Loss', duration: '', quote: '', story: '', beforeImage: null, afterImage: null }
    await updateContent('transformationsPage', { ...(fresh.transformationsPage || {}), transformations: [...existing, newItem] })
    const latest = await fetchContent(); setContent(latest); window.dispatchEvent(new Event('contentUpdated')); showToast('✓ New transformation added')
  }
  const removeTransformation = async (index) => {
    if (!window.confirm('Delete this transformation entry?')) return
    const fresh = await fetchContent()
    const arr = (fresh.transformationsPage?.transformations || []).filter((_, i) => i !== index)
    await updateContent('transformationsPage', { ...(fresh.transformationsPage || {}), transformations: arr })
    const latest = await fetchContent(); setContent(latest); window.dispatchEvent(new Event('contentUpdated')); showToast('✓ Transformation removed')
  }
  const updateTfField = async (index, field, value) => {
    const fresh = await fetchContent(); const arr = [...(fresh.transformationsPage?.transformations || [])]
    arr[index] = { ...arr[index], [field]: value }
    await updateContent('transformationsPage', { ...(fresh.transformationsPage || {}), transformations: arr })
    setContent(getContent()); window.dispatchEvent(new Event('contentUpdated'))
  }
  const updateTfMeta = async (field, value) => {
    const fresh = await fetchContent()
    await updateContent('transformationsPage', { ...(fresh.transformationsPage || {}), [field]: value })
    setContent(getContent()); window.dispatchEvent(new Event('contentUpdated'))
  }
  const updateTfStat = async (statIndex, field, value) => {
    const fresh = await fetchContent(); const stats = [...(fresh.transformationsPage?.stats || [])]
    stats[statIndex] = { ...stats[statIndex], [field]: value }
    await updateContent('transformationsPage', { ...(fresh.transformationsPage || {}), stats })
    setContent(getContent()); window.dispatchEvent(new Event('contentUpdated'))
  }

  const saveChanges = () => showToast('✓ All Changes Saved to MongoDB')
  const copyAsCSV = (rows, columns) => {
    const header = columns.join(',')
    const body = rows.map(row => columns.map(col => { const val = row[col] ?? ''; const str = String(val).replace(/"/g, '""'); return str.includes(',') || str.includes('\n') || str.includes('"') ? `"${str}"` : str }).join(',')).join('\n')
    navigator.clipboard.writeText(header + '\n' + body).then(() => showToast('✓ Copied as CSV')).catch(() => showToast('✗ Copy failed', '#e74c3c'))
  }

  const sections = [
    { id: 'hero',            label: '🎯 Hero Section' },
    { id: 'logo',            label: '⚔️ Logo & Branding' },
    { id: 'stats',           label: '📊 Stats Bar' },
    { id: 'features',        label: '✨ Features' },
    { id: 'classes',         label: '📸 Moments (Home)' },
    { id: 'cta',             label: '📢 CTA Banner' },
    { id: 'footer',          label: '📄 Footer' },
    { id: 'about',           label: '📖 About Page' },
    { id: 'classesPage',     label: '🎓 Classes Page' },
    { id: 'trainersPage',    label: '👥 Trainers Page' },
    { id: 'transformations', label: '🏆 Transformations' },
    { id: 'eventsPage',      label: '📅 Events Page' },
    { id: 'registrations',   label: '📋 Event Registrations' },
    { id: 'classBookings',   label: '🎓 Class Bookings' },
    { id: 'members',         label: '👤 Member Registrations' },
  ]

  const heroImages = content.hero?.backgroundImages || []
  const tfPage = content.transformationsPage || {}
  const transformations = tfPage.transformations || []

  const Spinner = () => <span style={{display:'inline-block',width:14,height:14,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.7s linear infinite',marginRight:6}} />

  const UploadThumb = ({ src, onUpload, onRemove, loadKey, label = 'Upload Photo' }) => (
    <div style={{marginBottom:8}}>
      {src ? (
        <div style={{position:'relative',display:'inline-block',width:'100%'}}>
          <img src={src} alt="preview" style={{width:'100%',maxHeight:160,objectFit:'cover',borderRadius:6,display:'block',border:'1px solid rgba(201,168,76,0.3)'}} />
          <button onClick={onRemove} style={{position:'absolute',top:6,right:6,background:'rgba(231,76,60,0.85)',border:'none',color:'#fff',borderRadius:3,padding:'2px 8px',cursor:'pointer',fontSize:12,fontWeight:700}}>✕</button>
          <div style={{position:'absolute',bottom:6,right:6,background:'rgba(6,8,16,0.7)',borderRadius:3,padding:'2px 7px',fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,letterSpacing:2,color:'rgba(46,204,113,0.9)',textTransform:'uppercase'}}>☁ Original Quality</div>
        </div>
      ) : (
        <label style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6,border:'2px dashed rgba(201,168,76,0.3)',borderRadius:6,padding:'16px 12px',cursor:loading[loadKey]?'wait':'pointer',background:'rgba(201,168,76,0.03)',position:'relative',opacity:loading[loadKey]?0.7:1}}>
          <input type="file" accept="image/*" onChange={onUpload} disabled={loading[loadKey]} style={{position:'absolute',inset:0,opacity:0,cursor:'pointer'}} />
          {loading[loadKey] ? <Spinner /> : <span style={{fontSize:24,opacity:0.4}}>📸</span>}
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,letterSpacing:2,fontWeight:700,textTransform:'uppercase',color:'rgba(201,168,76,0.7)'}}>{loading[loadKey] ? 'Uploading...' : label}</span>
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
  const RemoveAllBtn = ({ onClick, count, label }) => (
    <button onClick={onClick} disabled={count===0} style={{background:count===0?'rgba(231,76,60,0.04)':'rgba(231,76,60,0.12)',border:'1px solid rgba(231,76,60,0.35)',color:count===0?'rgba(231,76,60,0.3)':'#e74c3c',cursor:count===0?'not-allowed':'pointer',padding:'8px 18px',borderRadius:3,fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,letterSpacing:2,fontWeight:700,textTransform:'uppercase',display:'flex',alignItems:'center',gap:6,transition:'all 0.2s'}}>
      🗑 {label}
    </button>
  )
  const StorageBadge = ({ type }) => (
    <span style={{marginLeft:8,fontSize:9,letterSpacing:2,padding:'2px 7px',borderRadius:3,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,textTransform:'uppercase',background:type==='cloudinary'?'rgba(52,152,219,0.15)':'rgba(46,204,113,0.15)',color:type==='cloudinary'?'#3498db':'#2ecc71',border:`1px solid ${type==='cloudinary'?'rgba(52,152,219,0.3)':'rgba(46,204,113,0.3)'}`}}>
      {type === 'cloudinary' ? '☁ Cloudinary' : '🍃 MongoDB'}
    </span>
  )

  const TfImageUpload = ({ src, loadKey, onUpload, onRemove, label }) => (
    <div style={{flex:1}}>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,letterSpacing:3,fontWeight:700,textTransform:'uppercase',color: label==='BEFORE'?'rgba(138,154,181,0.9)':'rgba(201,168,76,0.9)',marginBottom:6,display:'flex',alignItems:'center',gap:6}}>
        <span style={{width:8,height:8,borderRadius:'50%',background:label==='BEFORE'?'rgba(138,154,181,0.5)':'var(--gold)',display:'inline-block'}}/>{label}
      </div>
      {src ? (
        <div style={{position:'relative',width:'100%'}}>
          <img src={src} alt={label} style={{width:'100%',height:140,objectFit:'cover',borderRadius:6,display:'block',border:label==='BEFORE'?'1px solid rgba(138,154,181,0.3)':'1px solid rgba(201,168,76,0.4)'}} />
          <button onClick={onRemove} style={{position:'absolute',top:6,right:6,background:'rgba(231,76,60,0.85)',border:'none',color:'#fff',borderRadius:3,padding:'2px 8px',cursor:'pointer',fontSize:12,fontWeight:700}}>✕</button>
          <label style={{position:'absolute',bottom:6,left:6,right:6,background:'rgba(6,8,16,0.75)',borderRadius:3,padding:'3px 10px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:4}}>
            <input type="file" accept="image/*" onChange={onUpload} disabled={loading[loadKey]} style={{position:'absolute',inset:0,opacity:0,cursor:'pointer'}} />
            {loading[loadKey] ? <Spinner /> : null}
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,letterSpacing:2,color:'rgba(255,255,255,0.6)',textTransform:'uppercase'}}>{loading[loadKey]?'Uploading…':'Replace'}</span>
          </label>
        </div>
      ) : (
        <label style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6,border:`2px dashed ${label==='BEFORE'?'rgba(138,154,181,0.2)':'rgba(201,168,76,0.3)'}`,borderRadius:6,padding:'20px 12px',cursor:loading[loadKey]?'wait':'pointer',background:label==='BEFORE'?'rgba(138,154,181,0.03)':'rgba(201,168,76,0.03)',position:'relative',opacity:loading[loadKey]?0.7:1,minHeight:100}}>
          <input type="file" accept="image/*" onChange={onUpload} disabled={loading[loadKey]} style={{position:'absolute',inset:0,opacity:0,cursor:'pointer'}} />
          {loading[loadKey] ? <Spinner /> : <span style={{fontSize:20,opacity:0.3}}>📸</span>}
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,letterSpacing:2,fontWeight:700,textTransform:'uppercase',color:label==='BEFORE'?'rgba(138,154,181,0.5)':'rgba(201,168,76,0.6)',textAlign:'center'}}>{loading[loadKey] ? 'Uploading...' : `Upload ${label}`}</span>
        </label>
      )}
    </div>
  )

  const QualityBanner = () => (
    <div style={{padding:'10px 14px',background:'rgba(46,204,113,0.06)',border:'1px solid rgba(46,204,113,0.2)',borderRadius:4,marginBottom:20,fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,letterSpacing:1,color:'rgba(46,204,113,0.8)',lineHeight:1.6}}>
      <strong style={{letterSpacing:3,textTransform:'uppercase',display:'block',marginBottom:2}}>✓ Original Quality Mode</strong>
      All images are uploaded raw — no crop, no re-encoding, no compression.
    </div>
  )

  const parseCerts = (t) => Array.isArray(t.certifications)
    ? t.certifications
    : typeof t.certifications === 'string' && t.certifications.trim()
      ? t.certifications.split(',').map(c => c.trim()).filter(Boolean)
      : []

  return (
    <div className="mgr-root">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div className={`sidebar-overlay${sidebarOpen?' open':''}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`sidebar${sidebarOpen?' open':''}`}>
        <div className="sidebar-header">
          <div className="sidebar-title">Content Manager</div>
          <div className="sidebar-subtitle" style={{fontSize:10,letterSpacing:1,color:'rgba(201,168,76,0.6)',marginTop:4}}>☁ Cloudinary · 🍃 MongoDB Atlas</div>
        </div>
        <nav className="sidebar-nav">
          {sections.map(item => (
            <div key={item.id} className={`nav-item ${activeSection===item.id?'active':''}`} onClick={() => { setActiveSection(item.id); setSidebarOpen(false) }}>{item.label}</div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="btn btn-primary full-width" onClick={() => navigate('/')}>← Back to Website</button>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <button className={`mgr-hamburger${sidebarOpen?' open':''}`} onClick={() => setSidebarOpen(o => !o)} aria-label="Toggle menu"><span /><span /><span /></button>
          <div className="page-title">Content Manager</div>
          <span className="active-section-label">{sections.find(s => s.id===activeSection)?.label||''}</span>
          <div className="topbar-actions">
            <button className="btn" onClick={() => navigate('/')}>Preview Site</button>
            <button className="btn btn-primary" onClick={saveChanges}>💾 Save All</button>
          </div>
        </div>

        <div className="content">

          {/* ── HERO ── */}
          {activeSection==='hero' && (
            <div className="section-card">
              <div className="section-header"><div className="section-title">Hero Section</div><div className="section-desc">Images → Cloudinary · Text → MongoDB Atlas</div></div>
              <QualityBanner />
              <div className="form-group">
                <label className="form-label">Hero Slideshow Images <StorageBadge type="cloudinary" />
                  {heroImages.length>0 && <span style={{marginLeft:8,fontSize:10,letterSpacing:2,color:'rgba(201,168,76,0.7)',fontWeight:700,background:'rgba(201,168,76,0.1)',padding:'2px 8px',borderRadius:3}}>{heroImages.length} image{heroImages.length!==1?'s':''}</span>}
                </label>
                {heroImages.length>0 && (
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:12,marginBottom:16}}>
                    {heroImages.map((src,i) => (
                      <div key={i} style={{position:'relative',borderRadius:6,overflow:'hidden',border:'1px solid rgba(201,168,76,0.2)',background:'#0d1020'}}>
                        <img src={src} alt={`Slide ${i+1}`} style={{width:'100%',height:100,objectFit:'cover',display:'block'}} />
                        <div style={{position:'absolute',top:6,left:6,background:'rgba(201,168,76,0.9)',color:'#060810',fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,letterSpacing:1,padding:'2px 7px',borderRadius:3}}>{i+1}</div>
                        <div style={{position:'absolute',bottom:0,left:0,right:0,display:'flex',justifyContent:'space-between',padding:6,background:'rgba(6,8,16,0.8)',gap:4}}>
                          <div style={{display:'flex',gap:3}}>
                            <button onClick={() => moveHeroImage(i,-1)} disabled={i===0} style={{background:i===0?'rgba(255,255,255,0.05)':'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.1)',color:i===0?'rgba(255,255,255,0.2)':'#fff',cursor:i===0?'not-allowed':'pointer',padding:'2px 6px',borderRadius:3,fontSize:11}}>←</button>
                            <button onClick={() => moveHeroImage(i,1)} disabled={i===heroImages.length-1} style={{background:i===heroImages.length-1?'rgba(255,255,255,0.05)':'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.1)',color:i===heroImages.length-1?'rgba(255,255,255,0.2)':'#fff',cursor:i===heroImages.length-1?'not-allowed':'pointer',padding:'2px 6px',borderRadius:3,fontSize:11}}>→</button>
                          </div>
                          <button onClick={() => handleHeroImageDelete(i)} disabled={loading[`hero-del-${i}`]} style={{background:'rgba(231,76,60,0.2)',border:'1px solid rgba(231,76,60,0.3)',color:'#e74c3c',cursor:'pointer',padding:'2px 7px',borderRadius:3,fontSize:11}}>{loading[`hero-del-${i}`]?'...':'✕'}</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <label style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8,border:'2px dashed rgba(201,168,76,0.45)',borderRadius:8,padding:'28px 20px',background:'rgba(201,168,76,0.03)',cursor:loading.hero?'wait':'pointer',position:'relative',opacity:loading.hero?0.7:1}}>
                  <input type="file" accept="image/*" multiple onChange={handleHeroImagesUpload} disabled={loading.hero} style={{position:'absolute',inset:0,opacity:0,cursor:'pointer'}} />
                  {loading.hero?<Spinner />:<div style={{fontSize:28,opacity:0.5}}>📸</div>}
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,letterSpacing:3,textTransform:'uppercase',color:'rgba(201,168,76,0.8)'}}>{loading.hero?'Uploading...':'Upload Hero Images'}</div>
                </label>
              </div>
              <div className="form-group"><label className="form-label">Eyebrow Text</label><input className="form-input" defaultValue={content.hero?.eyebrow||''} onBlur={e => handleUpdate('hero.eyebrow',e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Main Title</label><textarea className="form-textarea" defaultValue={content.hero?.title||''} onBlur={e => handleUpdate('hero.title',e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Highlighted Word</label><input className="form-input" defaultValue={content.hero?.titleHighlight||''} onBlur={e => handleUpdate('hero.titleHighlight',e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Subtitle</label><input className="form-input" defaultValue={content.hero?.subtitle||''} onBlur={e => handleUpdate('hero.subtitle',e.target.value)} /></div>
              <div className="form-grid">
                <div className="form-group"><label className="form-label">Primary Button</label><input className="form-input" defaultValue={content.hero?.primaryBtn||''} onBlur={e => handleUpdate('hero.primaryBtn',e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Secondary Button</label><input className="form-input" defaultValue={content.hero?.secondaryBtn||''} onBlur={e => handleUpdate('hero.secondaryBtn',e.target.value)} /></div>
              </div>
            </div>
          )}

          {/* ── LOGO ── */}
          {activeSection==='logo' && (
            <div className="section-card">
              <div className="section-header"><div className="section-title">Logo & Branding</div></div>
              <QualityBanner />
              <div className="form-group">
                <label className="form-label">Logo Image <StorageBadge type="cloudinary" /></label>
                <div style={{display:'flex',alignItems:'center',gap:24,marginBottom:16}}>
                  <div style={{width:96,height:96,borderRadius:'50%',border:'2px solid rgba(201,168,76,0.5)',background:'rgba(10,13,26,0.9)',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',flexShrink:0}}>
                    {content.logo?.image?<img src={content.logo.image} alt="Logo" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}} />:<span style={{fontSize:28,opacity:0.3}}>🖼️</span>}
                  </div>
                  <div style={{flex:1}}>
                    {content.logo?.image && <button onClick={async()=>{await handleUpdate('logo.image',null);showToast('✓ Logo removed')}} style={{background:'rgba(231,76,60,0.1)',border:'1px solid rgba(231,76,60,0.3)',color:'#e74c3c',cursor:'pointer',padding:'5px 14px',borderRadius:3,fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,letterSpacing:2,textTransform:'uppercase',fontWeight:600}}>✕ Remove</button>}
                  </div>
                </div>
                <label style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8,border:'2px dashed rgba(201,168,76,0.45)',borderRadius:8,padding:'28px 20px',background:'rgba(201,168,76,0.03)',cursor:loading.logo?'wait':'pointer',position:'relative',opacity:loading.logo?0.7:1}}>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={loading.logo} style={{position:'absolute',inset:0,opacity:0,cursor:'pointer'}} />
                  {loading.logo?<Spinner />:<div style={{fontSize:28,opacity:0.5}}>📸</div>}
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,letterSpacing:3,textTransform:'uppercase',color:'rgba(201,168,76,0.8)'}}>{loading.logo?'Uploading...':(content.logo?.image?'Replace Logo':'Upload Logo')}</div>
                </label>
              </div>
            </div>
          )}

          {/* ── STATS ── */}
          {activeSection==='stats' && (
            <div className="section-card">
              <div className="section-header"><div className="section-title">Stats Bar <StorageBadge type="mongo" /></div></div>
              {(content.stats||[]).map((stat,i) => (
                <div key={i} className="array-item"><div className="array-item-title">Stat {i+1}</div>
                  <div className="form-grid">
                    <div className="form-group"><label className="form-label">Number</label><input className="form-input" defaultValue={stat.num} onBlur={e => handleArrayUpdate('stats',i,'num',e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Label</label><input className="form-input" defaultValue={stat.label} onBlur={e => handleArrayUpdate('stats',i,'label',e.target.value)} /></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── FEATURES ── */}
          {activeSection==='features' && (
            <div className="section-card">
              <div className="section-header"><div className="section-title">Features Section <StorageBadge type="mongo" /></div></div>
              <div className="form-group"><label className="form-label">Section Label</label><input className="form-input" defaultValue={content.featuresSection?.label||''} onBlur={e => handleUpdate('featuresSection.label',e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Section Title</label><textarea className="form-textarea" defaultValue={content.featuresSection?.title||''} onBlur={e => handleUpdate('featuresSection.title',e.target.value)} /></div>
              {(content.features||[]).map((f,i) => (
                <div key={i} className="array-item"><div className="array-item-title">Feature {i+1}</div>
                  <div className="form-group"><label className="form-label">Icon</label><input className="form-input" defaultValue={f.icon} onBlur={e => handleArrayUpdate('features',i,'icon',e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Title</label><input className="form-input" defaultValue={f.title} onBlur={e => handleArrayUpdate('features',i,'title',e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" defaultValue={f.desc} onBlur={e => handleArrayUpdate('features',i,'desc',e.target.value)} /></div>
                </div>
              ))}
            </div>
          )}

          {/* ── MOMENTS ── */}
          {activeSection==='classes' && (
            <div className="section-card">
              <div className="section-header"><div className="section-title">Moments (Home Page)</div></div>
              <QualityBanner />
              <div className="form-group"><label className="form-label">Section Label</label><input className="form-input" defaultValue={content.classesSection?.label||''} onBlur={e => handleUpdate('classesSection.label',e.target.value)} /></div>
              <div className="form-grid">
                <div className="form-group"><label className="form-label">Title</label><input className="form-input" defaultValue={content.classesSection?.title||''} onBlur={e => handleUpdate('classesSection.title',e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Button</label><input className="form-input" defaultValue={content.classesSection?.buttonText||''} onBlur={e => handleUpdate('classesSection.buttonText',e.target.value)} /></div>
              </div>
              {(content.classes||[]).map((c,i) => (
                <div key={i} className="array-item">
                  <div className="array-item-title" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>Moment {i+1} <RemoveBtn onClick={() => removeArrayItem('classes',i)} /></div>
                  <div className="form-group"><label className="form-label">Image <StorageBadge type="cloudinary" /></label><UploadThumb src={c.image} loadKey={`hclass-${i}`} label="Upload Moment Image" onUpload={e => handleHomeClassImg(e,i)} onRemove={() => handleArrayUpdate('classes',i,'image',null)} /></div>
                  <div className="form-grid">
                    <div className="form-group"><label className="form-label">Tag</label><input className="form-input" defaultValue={c.tag} onBlur={e => handleArrayUpdate('classes',i,'tag',e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Name</label><input className="form-input" defaultValue={c.name} onBlur={e => handleArrayUpdate('classes',i,'name',e.target.value)} /></div>
                  </div>
                </div>
              ))}
              <AddBtn label="Add New Moment" onClick={() => addArrayItem('classes',{tag:'New',name:'New Moment',bg:'linear-gradient(135deg,#1a2535,#0d1525)',image:null})} />
            </div>
          )}

          {/* ── CTA ── */}
          {activeSection==='cta' && (
            <div className="section-card">
              <div className="section-header"><div className="section-title">CTA Banner <StorageBadge type="mongo" /></div></div>
              <div className="form-group"><label className="form-label">Label</label><input className="form-input" defaultValue={content.cta?.label||''} onBlur={e => handleUpdate('cta.label',e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Title</label><textarea className="form-textarea" defaultValue={content.cta?.title||''} onBlur={e => handleUpdate('cta.title',e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Button Text</label><input className="form-input" defaultValue={content.cta?.buttonText||''} onBlur={e => handleUpdate('cta.buttonText',e.target.value)} /></div>
            </div>
          )}

          {/* ── FOOTER ── */}
          {activeSection==='footer' && (
            <div className="section-card">
              <div className="section-header"><div className="section-title">Footer <StorageBadge type="mongo" /></div></div>
              <div className="form-group"><label className="form-label">Copyright</label><input className="form-input" defaultValue={content.footer?.copyright||''} onBlur={e => handleUpdate('footer.copyright',e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Links (comma separated)</label><input className="form-input" defaultValue={(content.footer?.links||[]).join(', ')} onBlur={e => handleUpdate('footer.links',e.target.value.split(',').map(s=>s.trim()))} /></div>
            </div>
          )}

          {/* ── ABOUT ── */}
          {activeSection==='about' && (
            <div className="section-card">
              <div className="section-header"><div className="section-title">About Page <StorageBadge type="mongo" /></div></div>
              <div className="form-group"><label className="form-label">Title</label><input className="form-input" defaultValue={content.about?.title||''} onBlur={e => handleUpdate('about.title',e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Subtitle</label><input className="form-input" defaultValue={content.about?.subtitle||''} onBlur={e => handleUpdate('about.subtitle',e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Mission</label><textarea className="form-textarea" defaultValue={content.about?.mission||''} onBlur={e => handleUpdate('about.mission',e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Vision</label><textarea className="form-textarea" defaultValue={content.about?.vision||''} onBlur={e => handleUpdate('about.vision',e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Values</label><textarea className="form-textarea" defaultValue={content.about?.values||''} onBlur={e => handleUpdate('about.values',e.target.value)} /></div>
            </div>
          )}

          {/* ── CLASSES PAGE ── */}
          {activeSection==='classesPage' && (
            <div className="section-card">
              <div className="section-header"><div className="section-title">Classes Page</div></div>
              <QualityBanner />
              <div className="form-group"><label className="form-label">Page Title</label><input className="form-input" defaultValue={content.classesPage?.title||''} onBlur={e => handleUpdate('classesPage.title',e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Subtitle</label><input className="form-input" defaultValue={content.classesPage?.subtitle||''} onBlur={e => handleUpdate('classesPage.subtitle',e.target.value)} /></div>
              {(content.classesPage?.classList||[]).map((cls,i) => (
                <div key={i} className="array-item">
                  <div className="array-item-title" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><span>{cls.name||`Class ${i+1}`}</span><RemoveBtn onClick={() => removeArrayItem('classesPage.classList',i)} /></div>
                  <div className="form-group"><label className="form-label">Class Photo <StorageBadge type="cloudinary" /></label><UploadThumb src={cls.image} loadKey={`class-${i}`} label="Upload Class Photo" onUpload={e => handleClassImg(e,i)} onRemove={() => handleArrayUpdate('classesPage.classList',i,'image',null)} /></div>
                  <div className="form-group"><label className="form-label">Name</label><input className="form-input" defaultValue={cls.name} onBlur={e => handleArrayUpdate('classesPage.classList',i,'name',e.target.value)} /></div>
                  <div className="form-grid">
                    <div className="form-group"><label className="form-label">Time</label><input className="form-input" defaultValue={cls.time} onBlur={e => handleArrayUpdate('classesPage.classList',i,'time',e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Trainer</label><input className="form-input" defaultValue={cls.trainer} onBlur={e => handleArrayUpdate('classesPage.classList',i,'trainer',e.target.value)} /></div>
                  </div>
                  <div className="form-grid">
                    <div className="form-group"><label className="form-label">Level</label><input className="form-input" defaultValue={cls.level} onBlur={e => handleArrayUpdate('classesPage.classList',i,'level',e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Spots</label><input className="form-input" type="number" defaultValue={cls.spots} onBlur={e => handleArrayUpdate('classesPage.classList',i,'spots',parseInt(e.target.value))} /></div>
                  </div>
                </div>
              ))}
              <AddBtn label="Add New Class" onClick={() => addArrayItem('classesPage.classList',{name:'New Class',time:'Mon, Wed — 7:00 AM',trainer:'Coach Name',level:'All Levels',spots:20,image:null})} />
            </div>
          )}

          {/* ── TRAINERS PAGE ── */}
          {activeSection==='trainersPage' && (
            <div className="section-card">
              <div className="section-header"><div className="section-title">Trainers Page</div><div className="section-desc">Photos → Cloudinary · Trainer info → MongoDB</div></div>
              <QualityBanner />
              <div className="form-group"><label className="form-label">Page Title</label><input className="form-input" defaultValue={content.trainersPage?.title||''} onBlur={e => handleUpdate('trainersPage.title',e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Subtitle</label><input className="form-input" defaultValue={content.trainersPage?.subtitle||''} onBlur={e => handleUpdate('trainersPage.subtitle',e.target.value)} /></div>
              {(content.trainersPage?.trainers||[]).map((t,i) => (
                <div key={i} className="array-item">
                  <div className="array-item-title" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span>{t.name||`Trainer ${i+1}`}</span>
                    <RemoveBtn onClick={() => removeArrayItem('trainersPage.trainers',i)} />
                  </div>
                  <div className="form-group"><label className="form-label">Trainer Photo <StorageBadge type="cloudinary" /></label><UploadThumb src={t.photo} loadKey={`trainer-${i}`} label="Upload Trainer Photo" onUpload={e => handleTrainerImg(e,i)} onRemove={() => handleArrayUpdate('trainersPage.trainers',i,'photo',null)} /></div>
                  <div className="form-group"><label className="form-label">Name</label><input className="form-input" defaultValue={t.name} onBlur={e => handleArrayUpdate('trainersPage.trainers',i,'name',e.target.value)} /></div>
                  <div className="form-grid">
                    <div className="form-group"><label className="form-label">Specialty</label><input className="form-input" defaultValue={t.specialty} onBlur={e => handleArrayUpdate('trainersPage.trainers',i,'specialty',e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Experience</label><input className="form-input" defaultValue={t.exp} onBlur={e => handleArrayUpdate('trainersPage.trainers',i,'exp',e.target.value)} /></div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{display:'flex',alignItems:'center',gap:8}}>
                      Certifications
                      <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,letterSpacing:2,padding:'2px 8px',borderRadius:3,background:'rgba(201,168,76,0.1)',color:'rgba(201,168,76,0.6)',fontWeight:700,textTransform:'uppercase'}}>comma separated</span>
                    </label>
                    <input className="form-input" defaultValue={parseCerts(t).join(', ')} onBlur={e => handleArrayUpdate('trainersPage.trainers', i, 'certifications', e.target.value.split(',').map(c => c.trim()).filter(Boolean))} placeholder="e.g. ACE CPT, CrossFit L2, Nutrition Coach" />
                    {parseCerts(t).length > 0 && (
                      <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:10}}>
                        {parseCerts(t).map((cert, ci) => (
                          <span key={ci} style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,letterSpacing:2,fontWeight:700,textTransform:'uppercase',padding:'4px 10px',borderRadius:2,background:'rgba(201,168,76,0.08)',border:'1px solid rgba(201,168,76,0.25)',color:'rgba(201,168,76,0.9)',display:'inline-flex',alignItems:'center',gap:5}}>🏅 {cert}</span>
                        ))}
                      </div>
                    )}
                    <div style={{marginTop:6,fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,letterSpacing:1,color:'rgba(255,255,255,0.2)'}}>These badges will appear on the trainer's card on the public Trainers page.</div>
                  </div>
                </div>
              ))}
              <AddBtn label="Add New Trainer" onClick={() => addArrayItem('trainersPage.trainers',{name:'New Trainer',specialty:'Fitness & Conditioning',exp:'1 year',photo:null,certifications:[]})} />
            </div>
          )}

          {/* ── TRANSFORMATIONS ── */}
          {activeSection==='transformations' && (
            <div className="section-card">
              <div className="section-header"><div className="section-title">🏆 Transformations Page</div></div>
              <QualityBanner />
              <div style={{background:'rgba(201,168,76,0.04)',border:'1px solid rgba(201,168,76,0.12)',borderRadius:6,padding:'20px 20px 4px',marginBottom:24}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,letterSpacing:4,fontWeight:700,textTransform:'uppercase',color:'rgba(201,168,76,0.7)',marginBottom:16}}>Page Settings</div>
                <div className="form-grid">
                  <div className="form-group"><label className="form-label">Eyebrow Label</label><input className="form-input" defaultValue={tfPage.label||'Real Results'} onBlur={e => updateTfMeta('label',e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Title Highlight Word</label><input className="form-input" defaultValue={tfPage.titleHighlight||'Real'} onBlur={e => updateTfMeta('titleHighlight',e.target.value)} /></div>
                </div>
                <div className="form-group"><label className="form-label">Page Title</label><input className="form-input" defaultValue={tfPage.title||'Real\nTransformations'} onBlur={e => updateTfMeta('title',e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Subtitle</label><textarea className="form-textarea" defaultValue={tfPage.subtitle||''} onBlur={e => updateTfMeta('subtitle',e.target.value)} /></div>
              </div>
              <div style={{background:'rgba(201,168,76,0.04)',border:'1px solid rgba(201,168,76,0.12)',borderRadius:6,padding:'20px 20px 4px',marginBottom:24}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,letterSpacing:4,fontWeight:700,textTransform:'uppercase',color:'rgba(201,168,76,0.7)',marginBottom:16}}>Stats Banner</div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:12}}>
                  {(tfPage.stats||[{num:'500+',label:'Transformations'},{num:'92%',label:'Success Rate'},{num:'8 Wks',label:'Avg. Timeframe'},{num:'40+',label:'Expert Coaches'}]).map((s,i) => (
                    <div key={i} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:4,padding:12}}>
                      <div className="form-group" style={{marginBottom:8}}><label className="form-label">Number</label><input className="form-input" defaultValue={s.num} onBlur={e => updateTfStat(i,'num',e.target.value)} /></div>
                      <div className="form-group"><label className="form-label">Label</label><input className="form-input" defaultValue={s.label} onBlur={e => updateTfStat(i,'label',e.target.value)} /></div>
                    </div>
                  ))}
                </div>
              </div>
              {transformations.map((item,idx) => (
                <div key={idx} className="array-item" style={{position:'relative',marginBottom:24}}>
                  <div className="array-item-title" style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <span style={{fontFamily:"'Bebas Neue',cursive",fontSize:32,color:'rgba(201,168,76,0.15)',lineHeight:1}}>{String(idx+1).padStart(2,'0')}</span>
                      <div>
                        <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:18,color:'var(--white)',letterSpacing:1}}>{item.name||'Unnamed Member'}</div>
                        {item.category && <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,letterSpacing:2,color:'var(--gold)',textTransform:'uppercase'}}>{item.category}</div>}
                      </div>
                    </div>
                    <RemoveBtn onClick={() => removeTransformation(idx)} />
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
                    <TfImageUpload src={item.beforeImage} loadKey={`tf-${idx}-before`} label="BEFORE" onUpload={e => handleTransformationImg(e,idx,'before')} onRemove={async()=>{await updateTfField(idx,'beforeImage',null);showToast('✓ Before image removed')}} />
                    <TfImageUpload src={item.afterImage} loadKey={`tf-${idx}-after`} label="AFTER" onUpload={e => handleTransformationImg(e,idx,'after')} onRemove={async()=>{await updateTfField(idx,'afterImage',null);showToast('✓ After image removed')}} />
                  </div>
                  <div className="form-grid">
                    <div className="form-group"><label className="form-label">Member Name</label><input className="form-input" defaultValue={item.name} onBlur={e => updateTfField(idx,'name',e.target.value)} placeholder="e.g. Rahul S." /></div>
                    <div className="form-group"><label className="form-label">Category</label><select className="form-input" value={item.category||'Weight Loss'} onChange={e => updateTfField(idx,'category',e.target.value)} style={{cursor:'pointer'}}>{TF_CATEGORIES.map(c => <option key={c} value={c} style={{background:'#1a1f35'}}>{c}</option>)}</select></div>
                  </div>
                  <div className="form-group"><label className="form-label">Duration</label><input className="form-input" defaultValue={item.duration} onBlur={e => updateTfField(idx,'duration',e.target.value)} placeholder="e.g. 12 weeks" /></div>
                  <div className="form-group"><label className="form-label">Member Quote</label><textarea className="form-textarea" defaultValue={item.quote} onBlur={e => updateTfField(idx,'quote',e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Full Story</label><textarea className="form-textarea" rows={5} defaultValue={item.story} onBlur={e => updateTfField(idx,'story',e.target.value)} style={{minHeight:110}} /></div>
                </div>
              ))}
              <AddBtn label="Add New Transformation" onClick={addTransformation} />
            </div>
          )}

          {/* ── EVENTS PAGE ── */}
          {activeSection==='eventsPage' && (
            <div className="section-card">
              <div className="section-header"><div className="section-title">Events Page</div></div>
              <QualityBanner />
              <div className="form-group"><label className="form-label">Title</label><input className="form-input" defaultValue={content.eventsPage?.title||''} onBlur={e => handleUpdate('eventsPage.title',e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Subtitle</label><input className="form-input" defaultValue={content.eventsPage?.subtitle||''} onBlur={e => handleUpdate('eventsPage.subtitle',e.target.value)} /></div>
              {(content.eventsPage?.events||[]).map((ev,i) => (
                <div key={i} className="array-item">
                  <div className="array-item-title" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>Event {i+1} <RemoveBtn onClick={() => removeArrayItem('eventsPage.events',i)} /></div>
                  <div className="form-group"><label className="form-label">Event Image <StorageBadge type="cloudinary" /></label><UploadThumb src={ev.image} loadKey={`event-${i}`} label="Upload Event Image" onUpload={e => handleEventImg(e,i)} onRemove={() => handleArrayUpdate('eventsPage.events',i,'image',null)} /></div>
                  <div className="form-group"><label className="form-label">Title</label><input className="form-input" defaultValue={ev.title} onBlur={e => handleArrayUpdate('eventsPage.events',i,'title',e.target.value)} /></div>
                  <div className="form-grid">
                    <div className="form-group"><label className="form-label">Date</label><input className="form-input" defaultValue={ev.date} onBlur={e => handleArrayUpdate('eventsPage.events',i,'date',e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Category</label><input className="form-input" defaultValue={ev.cat} onBlur={e => handleArrayUpdate('eventsPage.events',i,'cat',e.target.value)} /></div>
                  </div>
                  <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" defaultValue={ev.desc} onBlur={e => handleArrayUpdate('eventsPage.events',i,'desc',e.target.value)} /></div>
                </div>
              ))}
              <AddBtn label="Add New Event" onClick={() => addArrayItem('eventsPage.events',{title:'New Event',date:'TBD',cat:'General',desc:'Event description.',image:null})} />
            </div>
          )}

          {/* ── EVENT REGISTRATIONS ── */}
          {activeSection==='registrations' && (
            <div className="section-card">
              <div className="section-header"><div className="section-title">📋 Event Registrations</div><div className="section-desc">All event sign-ups · stored in MongoDB</div></div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24,flexWrap:'wrap',gap:10}}>
                <span style={{background:'rgba(201,168,76,0.15)',color:'#c9a84c',padding:'6px 16px',borderRadius:3,fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,letterSpacing:2,textTransform:'uppercase'}}>{registrations.length} Registration{registrations.length!==1?'s':''}</span>
                <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                  <button onClick={fetchRegistrations} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.6)',padding:'8px 18px',borderRadius:3,cursor:'pointer',fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,letterSpacing:2,textTransform:'uppercase'}}>{regLoading?'⟳ Refreshing...':'⟳ Refresh'}</button>
                  <RemoveAllBtn onClick={deleteAllRegistrations} count={registrations.length} label="Remove All" />
                </div>
              </div>
              {regLoading ? <div style={{textAlign:'center',padding:'48px 0',color:'rgba(255,255,255,0.2)',fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,letterSpacing:3}}>Loading…</div>
              : registrations.length===0 ? <div style={{textAlign:'center',padding:'60px 0',border:'1px dashed rgba(255,255,255,0.07)',borderRadius:6}}><div style={{fontSize:40,opacity:0.1,marginBottom:12}}>📋</div><div style={{fontFamily:"'Bebas Neue',cursive",fontSize:24,color:'rgba(255,255,255,0.1)',letterSpacing:2}}>No Registrations Yet</div></div>
              : (
                <>
                  {(()=>{ const grouped={}; registrations.forEach(r=>{const key=r.eventTitle||'Unknown Event';if(!grouped[key])grouped[key]=[];grouped[key].push(r)}); return Object.entries(grouped).map(([eventName,regs])=>(
                    <div key={eventName} style={{marginBottom:32}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,letterSpacing:4,fontWeight:700,textTransform:'uppercase',color:'rgba(201,168,76,0.7)',marginBottom:12,display:'flex',alignItems:'center',gap:10}}>📅 {eventName}<span style={{background:'rgba(201,168,76,0.1)',color:'#c9a84c',padding:'2px 8px',borderRadius:3,fontSize:10}}>{regs.length}</span></div>
                      <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:4,overflow:'hidden'}}>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr auto',background:'rgba(255,255,255,0.04)',padding:'10px 20px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>{['Name','Phone','Registered At',''].map((h,i)=><div key={i} style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,letterSpacing:3,fontWeight:700,textTransform:'uppercase',color:'rgba(255,255,255,0.3)'}}>{h}</div>)}</div>
                        {regs.map((r,i)=>(
                          <div key={r._id||i} style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr auto',padding:'12px 20px',borderBottom:'1px solid rgba(255,255,255,0.04)',alignItems:'center'}}>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,color:'var(--white)',fontWeight:600}}>{r.name}</div>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,color:'var(--gold)'}}>{r.phone}</div>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:'rgba(255,255,255,0.3)'}}>{r.createdAt?new Date(r.createdAt).toLocaleString('en-IN',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}):'—'}</div>
                            <button onClick={()=>deleteRegistration(r._id)} style={{background:'rgba(231,76,60,0.1)',border:'1px solid rgba(231,76,60,0.25)',color:'#e74c3c',cursor:'pointer',padding:'4px 10px',borderRadius:3,fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,textTransform:'uppercase'}}>✕</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))})()}
                  <button onClick={()=>copyAsCSV(registrations,['name','phone','eventTitle','eventDate','eventCat','createdAt'])} style={{background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.3)',color:'var(--gold)',cursor:'pointer',padding:'9px 20px',borderRadius:3,fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,letterSpacing:2,fontWeight:700,textTransform:'uppercase'}}>📋 Copy as CSV ({registrations.length})</button>
                </>
              )}
            </div>
          )}

          {/* ── CLASS BOOKINGS ── */}
          {activeSection==='classBookings' && (
            <div className="section-card">
              <div className="section-header"><div className="section-title">🎓 Class Bookings</div><div className="section-desc">All class sign-ups · stored in MongoDB</div></div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24,flexWrap:'wrap',gap:10}}>
                <span style={{background:'rgba(201,168,76,0.15)',color:'#c9a84c',padding:'6px 16px',borderRadius:3,fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,letterSpacing:2,textTransform:'uppercase'}}>{classBookings.length} Booking{classBookings.length!==1?'s':''}</span>
                <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                  <button onClick={fetchClassBookings} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.6)',padding:'8px 18px',borderRadius:3,cursor:'pointer',fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,letterSpacing:2,textTransform:'uppercase'}}>{classBookingsLoading?'⟳ Refreshing...':'⟳ Refresh'}</button>
                  <RemoveAllBtn onClick={deleteAllClassBookings} count={classBookings.length} label="Remove All" />
                </div>
              </div>
              {classBookingsLoading ? <div style={{textAlign:'center',padding:'48px 0',color:'rgba(255,255,255,0.2)'}}>Loading…</div>
              : classBookings.length===0 ? <div style={{textAlign:'center',padding:'60px 0',border:'1px dashed rgba(255,255,255,0.07)',borderRadius:6}}><div style={{fontFamily:"'Bebas Neue',cursive",fontSize:24,color:'rgba(255,255,255,0.1)',letterSpacing:2}}>No Bookings Yet</div></div>
              : (
                <>
                  {(()=>{ const grouped={}; classBookings.forEach(b=>{const key=b.className||'Unknown Class';if(!grouped[key])grouped[key]=[];grouped[key].push(b)}); return Object.entries(grouped).map(([className,bookings])=>(
                    <div key={className} style={{marginBottom:32}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,letterSpacing:4,fontWeight:700,textTransform:'uppercase',color:'rgba(201,168,76,0.7)',marginBottom:8,display:'flex',alignItems:'center',gap:10}}>🎓 {className}<span style={{background:'rgba(201,168,76,0.1)',color:'#c9a84c',padding:'2px 8px',borderRadius:3,fontSize:10}}>{bookings.length}</span></div>
                      <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:4,overflow:'hidden'}}>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr auto',background:'rgba(255,255,255,0.04)',padding:'10px 20px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>{['Name','Phone','Booked At',''].map((h,i)=><div key={i} style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,letterSpacing:3,fontWeight:700,textTransform:'uppercase',color:'rgba(255,255,255,0.3)'}}>{h}</div>)}</div>
                        {bookings.map((b,i)=>(
                          <div key={b._id||i} style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr auto',padding:'12px 20px',borderBottom:'1px solid rgba(255,255,255,0.04)',alignItems:'center'}}>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,color:'var(--white)',fontWeight:600}}>{b.name}</div>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,color:'var(--gold)'}}>{b.phone}</div>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:'rgba(255,255,255,0.3)'}}>{b.createdAt?new Date(b.createdAt).toLocaleString('en-IN',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}):'—'}</div>
                            <button onClick={()=>deleteClassBooking(b._id)} style={{background:'rgba(231,76,60,0.1)',border:'1px solid rgba(231,76,60,0.25)',color:'#e74c3c',cursor:'pointer',padding:'4px 10px',borderRadius:3,fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,textTransform:'uppercase'}}>✕</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))})()}
                  <button onClick={()=>copyAsCSV(classBookings,['name','phone','className','trainer','time','level','createdAt'])} style={{background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.3)',color:'var(--gold)',cursor:'pointer',padding:'9px 20px',borderRadius:3,fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,letterSpacing:2,fontWeight:700,textTransform:'uppercase'}}>📋 Copy as CSV ({classBookings.length})</button>
                </>
              )}
            </div>
          )}

          {/* ── MEMBER REGISTRATIONS ── */}
          {activeSection==='members' && (
            <div className="section-card">
              <div className="section-header"><div className="section-title">👤 Member Registrations</div><div className="section-desc">All gym join requests · stored in MongoDB</div></div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24,flexWrap:'wrap',gap:10}}>
                <span style={{background:'rgba(201,168,76,0.15)',color:'#c9a84c',padding:'6px 16px',borderRadius:3,fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,letterSpacing:2,textTransform:'uppercase'}}>{members.length} Member{members.length!==1?'s':''}</span>
                <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                  <button onClick={fetchMembers} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.6)',padding:'8px 18px',borderRadius:3,cursor:'pointer',fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,letterSpacing:2,textTransform:'uppercase'}}>{membersLoading?'⟳ Refreshing...':'⟳ Refresh'}</button>
                  <RemoveAllBtn onClick={deleteAllMembers} count={members.length} label="Remove All" />
                </div>
              </div>
              {membersLoading ? <div style={{textAlign:'center',padding:'48px 0',color:'rgba(255,255,255,0.2)'}}>Loading…</div>
              : members.length===0 ? <div style={{textAlign:'center',padding:'60px 0',border:'1px dashed rgba(255,255,255,0.07)',borderRadius:6}}><div style={{fontFamily:"'Bebas Neue',cursive",fontSize:24,color:'rgba(255,255,255,0.1)',letterSpacing:2}}>No Members Yet</div></div>
              : (
                <>
                  <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:4,overflow:'hidden',marginBottom:16}}>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1.2fr 1fr 1fr auto',background:'rgba(255,255,255,0.04)',padding:'10px 20px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>{['Name','Email','Phone','Joined At',''].map((h,i)=><div key={i} style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,letterSpacing:3,fontWeight:700,textTransform:'uppercase',color:'rgba(255,255,255,0.3)'}}>{h}</div>)}</div>
                    {members.map((m,i)=>(
                      <div key={m._id||i} style={{display:'grid',gridTemplateColumns:'1fr 1.2fr 1fr 1fr auto',padding:'13px 20px',borderBottom:'1px solid rgba(255,255,255,0.04)',alignItems:'center'}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,color:'var(--white)',fontWeight:600}}>{m.name}</div>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,color:'rgba(255,255,255,0.5)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',paddingRight:8}}>{m.email}</div>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,color:'var(--gold)'}}>{m.phone}</div>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:'rgba(255,255,255,0.3)'}}>{m.createdAt?new Date(m.createdAt).toLocaleString('en-IN',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}):'—'}</div>
                        <button onClick={()=>deleteMember(m._id)} style={{background:'rgba(231,76,60,0.1)',border:'1px solid rgba(231,76,60,0.25)',color:'#e74c3c',cursor:'pointer',padding:'4px 10px',borderRadius:3,fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,textTransform:'uppercase'}}>✕</button>
                      </div>
                    ))}
                  </div>
                  <button onClick={()=>copyAsCSV(members,['name','email','phone','createdAt'])} style={{background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.3)',color:'var(--gold)',cursor:'pointer',padding:'9px 20px',borderRadius:3,fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,letterSpacing:2,fontWeight:700,textTransform:'uppercase'}}>📋 Copy as CSV ({members.length})</button>
                </>
              )}
            </div>
          )}

        </div>
      </main>

      {toast && <div className="toast" style={{background:toast.color}}>{toast.msg}</div>}
    </div>
  )
}