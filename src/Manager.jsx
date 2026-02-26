import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getContent, updateContent, updateArrayItem, addArrayItem, removeArrayItem } from './contentStore'
import './manager.css'

const btnRemove = { background:'rgba(231,76,60,0.12)', border:'1px solid rgba(231,76,60,0.3)', color:'#e74c3c', cursor:'pointer', padding:'6px 14px', borderRadius:'4px', fontFamily:"'Barlow Condensed',sans-serif", fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', fontWeight:600 }
const btnAdd    = { width:'100%', marginTop:'8px', background:'rgba(201,168,76,0.08)', border:'2px dashed rgba(201,168,76,0.35)', color:'#c9a84c', cursor:'pointer', padding:'14px', borderRadius:'6px', fontFamily:"'Barlow Condensed',sans-serif", fontSize:'13px', letterSpacing:'3px', textTransform:'uppercase', fontWeight:700, transition:'all 0.2s' }
const btnAddSub = { ...btnAdd, padding:'10px', fontSize:'11px', marginTop:'6px' }

export default function Manager() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('hero')
  const [content, setContent] = useState(getContent())
  const [toast, setToast] = useState(null)

  const showToast = (msg, color = '#2ecc71') => { setToast({ msg, color }); setTimeout(() => setToast(null), 3000) }
  const sync = () => setContent(getContent())
  const dispatch = () => window.dispatchEvent(new Event('contentUpdated'))

  const handleUpdate = (path, value) => { updateContent(path, value); sync(); dispatch() }
  const handleArrayUpdate = (path, index, field, value) => { updateArrayItem(path, index, field, value); sync(); dispatch() }
  const handleAdd = (path, item) => { addArrayItem(path, item); sync(); dispatch() }
  const handleRemove = (path, index) => { removeArrayItem(path, index); sync(); dispatch() }

  // Equipment helpers
  const handleEquipItemUpdate = (catIndex, itemIndex, field, value) => {
    const cats = [...content.equipmentPage.categories]
    cats[catIndex].items[itemIndex][field] = value
    handleUpdate('equipmentPage.categories', cats)
  }
  const handleCatNameUpdate = (catIndex, value) => {
    const cats = [...content.equipmentPage.categories]
    cats[catIndex].cat = value
    handleUpdate('equipmentPage.categories', cats)
  }
  const handleAddEquipItem = (catIndex) => {
    const cats = [...content.equipmentPage.categories]
    cats[catIndex].items.push({ name: 'New Item', count: '1', brand: 'Brand' })
    handleUpdate('equipmentPage.categories', cats)
    showToast('✓ Item Added')
  }
  const handleRemoveEquipItem = (catIndex, itemIndex) => {
    const cats = [...content.equipmentPage.categories]
    cats[catIndex].items.splice(itemIndex, 1)
    handleUpdate('equipmentPage.categories', cats)
    showToast('✓ Item Removed', '#e74c3c')
  }
  const handleAddCategory = () => {
    const cats = [...content.equipmentPage.categories]
    cats.push({ cat: 'New Category', items: [] })
    handleUpdate('equipmentPage.categories', cats)
    showToast('✓ Category Added')
  }
  const handleRemoveCategory = (catIndex) => {
    const cats = [...content.equipmentPage.categories]
    cats.splice(catIndex, 1)
    handleUpdate('equipmentPage.categories', cats)
    showToast('✓ Category Removed', '#e74c3c')
  }

  const saveChanges = () => showToast('✓ All Changes Saved Successfully')

  const handleHeroImagesUpload = (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    const urls = files.map(f => URL.createObjectURL(f))
    const existing = content.hero.backgroundImages || []
    handleUpdate('hero.backgroundImages', [...existing, ...urls])
    showToast(`✓ ${files.length} image${files.length > 1 ? 's' : ''} added`)
    e.target.value = ''
  }
  const removeHeroImage = (index) => { handleUpdate('hero.backgroundImages', (content.hero.backgroundImages||[]).filter((_,i)=>i!==index)); showToast('✓ Image Removed') }
  const moveImage = (index, direction) => {
    const arr = [...(content.hero.backgroundImages||[])]
    const t = index+direction
    if (t<0||t>=arr.length) return
    ;[arr[index],arr[t]]=[arr[t],arr[index]]
    handleUpdate('hero.backgroundImages', arr)
  }

  const sections = [
    { id:'hero',          label:'🎯 Hero Section' },
    { id:'logo',          label:'⚔️ Logo & Branding' },
    { id:'stats',         label:'📊 Stats Bar' },
    { id:'features',      label:'✨ Features' },
    { id:'classes',       label:'🏋️ Classes' },
    { id:'cta',           label:'📢 CTA Banner' },
    { id:'footer',        label:'📄 Footer' },
    { id:'about',         label:'📖 About Page' },
    { id:'classesPage',   label:'🎓 Classes Page' },
    { id:'equipmentPage', label:'🏗️ Equipment Page' },
    { id:'trainersPage',  label:'👥 Trainers Page' },
    { id:'eventsPage',    label:'📅 Events Page' },
  ]

  const heroImages = content.hero.backgroundImages || []
  const blankClass   = { name:'New Class', time:'Mon - 9:00 AM', trainer:'Coach Name', level:'All Levels', spots:10 }
  const blankTrainer = { name:'New Trainer', specialty:'Specialty', exp:'1 year' }
  const blankEvent   = { title:'New Event', date:'TBD', desc:'Event description', cat:'General' }

  const hovOn  = e => e.currentTarget.style.background='rgba(201,168,76,0.14)'
  const hovOff = e => e.currentTarget.style.background='rgba(201,168,76,0.08)'

  return (
    <div className="mgr-root">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">Content Manager</div>
          <div className="sidebar-subtitle">Edit Website Content</div>
        </div>
        <nav className="sidebar-nav">
          {sections.map(item => (
            <div key={item.id} className={`nav-item ${activeSection===item.id?'active':''}`} onClick={()=>setActiveSection(item.id)}>{item.label}</div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="btn btn-primary full-width" onClick={()=>navigate('/')}>← Back to Website</button>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div className="page-title">Content Manager</div>
          <div className="topbar-actions">
            <button className="btn" onClick={()=>navigate('/')}>Preview Site</button>
            <button className="btn btn-primary" onClick={saveChanges}>💾 Save All Changes</button>
          </div>
        </div>

        <div className="content">

          {/* ── HERO ── */}
          {activeSection==='hero' && (
            <div className="section-card">
              <div className="section-header"><div className="section-title">Hero Section</div><div className="section-desc">Main landing section — upload multiple images for a slideshow</div></div>
              <div className="form-group">
                <label className="form-label">Hero Slideshow Images{heroImages.length>0&&<span style={{marginLeft:'10px',fontSize:'10px',letterSpacing:'2px',color:'rgba(201,168,76,0.7)',fontWeight:700,background:'rgba(201,168,76,0.1)',padding:'2px 8px',borderRadius:'3px'}}>{heroImages.length} image{heroImages.length!==1?'s':''} · slides every 3s</span>}</label>
                {heroImages.length>0&&<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:'12px',marginBottom:'16px'}}>{heroImages.map((src,i)=>(
                  <div key={i} style={{position:'relative',borderRadius:'6px',overflow:'hidden',border:'1px solid rgba(201,168,76,0.2)',background:'#0d1020'}}>
                    <img src={src} alt="" style={{width:'100%',height:'100px',objectFit:'cover',display:'block'}}/>
                    <div style={{position:'absolute',top:'6px',left:'6px',background:'rgba(201,168,76,0.9)',color:'#060810',fontFamily:"'Barlow Condensed',sans-serif",fontSize:'10px',fontWeight:700,letterSpacing:'1px',padding:'2px 7px',borderRadius:'3px'}}>{i+1}</div>
                    <div style={{position:'absolute',bottom:0,left:0,right:0,display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px',background:'rgba(6,8,16,0.8)',gap:'4px'}}>
                      <div style={{display:'flex',gap:'3px'}}>
                        <button onClick={()=>moveImage(i,-1)} disabled={i===0} style={{background:i===0?'rgba(255,255,255,0.05)':'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.1)',color:i===0?'rgba(255,255,255,0.2)':'#fff',cursor:i===0?'not-allowed':'pointer',padding:'2px 6px',borderRadius:'3px',fontSize:'11px'}}>←</button>
                        <button onClick={()=>moveImage(i,1)} disabled={i===heroImages.length-1} style={{background:i===heroImages.length-1?'rgba(255,255,255,0.05)':'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.1)',color:i===heroImages.length-1?'rgba(255,255,255,0.2)':'#fff',cursor:i===heroImages.length-1?'not-allowed':'pointer',padding:'2px 6px',borderRadius:'3px',fontSize:'11px'}}>→</button>
                      </div>
                      <button onClick={()=>removeHeroImage(i)} style={{background:'rgba(231,76,60,0.2)',border:'1px solid rgba(231,76,60,0.3)',color:'#e74c3c',cursor:'pointer',padding:'2px 7px',borderRadius:'3px',fontSize:'11px'}}>✕</button>
                    </div>
                  </div>
                ))}</div>}
                <label style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'8px',border:`2px dashed ${heroImages.length>0?'rgba(201,168,76,0.25)':'rgba(201,168,76,0.45)'}`,borderRadius:'8px',padding:'28px 20px',background:'rgba(201,168,76,0.03)',cursor:'pointer',position:'relative'}}>
                  <input type="file" accept="image/*" multiple onChange={handleHeroImagesUpload} style={{position:'absolute',inset:0,opacity:0,cursor:'pointer'}}/>
                  <div style={{fontSize:'28px',opacity:0.5}}>📸</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:'12px',fontWeight:700,letterSpacing:'3px',textTransform:'uppercase',color:'rgba(201,168,76,0.8)'}}>{heroImages.length>0?'+ Add More Images':'Upload Hero Images'}</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:'11px',letterSpacing:'1px',color:'rgba(255,255,255,0.25)'}}>Select multiple at once · JPG, PNG, WebP</div>
                </label>
              </div>
              {heroImages.length>0&&<div className="form-group" style={{textAlign:'right'}}><button onClick={()=>{handleUpdate('hero.backgroundImages',[]);showToast('✓ All Images Cleared')}} style={{background:'rgba(231,76,60,0.1)',border:'1px solid rgba(231,76,60,0.3)',color:'#e74c3c',cursor:'pointer',padding:'8px 18px',borderRadius:'4px',fontFamily:"'Barlow Condensed',sans-serif",fontSize:'11px',letterSpacing:'2px',textTransform:'uppercase',fontWeight:600}}>✕ Clear All Images</button></div>}
              <div className="form-group"><label className="form-label">Eyebrow Text</label><input className="form-input" value={content.hero.eyebrow} onChange={e=>handleUpdate('hero.eyebrow',e.target.value)}/></div>
              <div className="form-group"><label className="form-label">Main Title (Use \n for line breaks)</label><textarea className="form-textarea" value={content.hero.title} onChange={e=>handleUpdate('hero.title',e.target.value)}/></div>
              <div className="form-group"><label className="form-label">Highlighted Word</label><input className="form-input" value={content.hero.titleHighlight} onChange={e=>handleUpdate('hero.titleHighlight',e.target.value)}/></div>
              <div className="form-group"><label className="form-label">Subtitle</label><input className="form-input" value={content.hero.subtitle} onChange={e=>handleUpdate('hero.subtitle',e.target.value)}/></div>
              <div className="form-grid">
                <div className="form-group"><label className="form-label">Primary Button</label><input className="form-input" value={content.hero.primaryBtn} onChange={e=>handleUpdate('hero.primaryBtn',e.target.value)}/></div>
                <div className="form-group"><label className="form-label">Secondary Button</label><input className="form-input" value={content.hero.secondaryBtn} onChange={e=>handleUpdate('hero.secondaryBtn',e.target.value)}/></div>
              </div>
            </div>
          )}

          {/* ── LOGO ── */}
          {activeSection==='logo'&&<div className="section-card"><div className="section-header"><div className="section-title">Logo & Branding</div></div><div className="form-group"><label className="form-label">Logo Icon</label><input className="form-input" value={content.logo.emblemIcon} onChange={e=>handleUpdate('logo.emblemIcon',e.target.value)}/></div><div className="form-group"><label className="form-label">Top Text</label><input className="form-input" value={content.logo.topText} onChange={e=>handleUpdate('logo.topText',e.target.value)}/></div><div className="form-group"><label className="form-label">Bottom Text</label><input className="form-input" value={content.logo.bottomText} onChange={e=>handleUpdate('logo.bottomText',e.target.value)}/></div></div>}

          {/* ── STATS ── */}
          {activeSection==='stats'&&<div className="section-card"><div className="section-header"><div className="section-title">Stats Bar</div></div>{content.stats.map((stat,index)=>(<div key={index} className="array-item"><div className="array-item-title">Stat {index+1}</div><div className="form-grid"><div className="form-group"><label className="form-label">Number</label><input className="form-input" value={stat.num} onChange={e=>handleArrayUpdate('stats',index,'num',e.target.value)}/></div><div className="form-group"><label className="form-label">Label</label><input className="form-input" value={stat.label} onChange={e=>handleArrayUpdate('stats',index,'label',e.target.value)}/></div></div></div>))}</div>}

          {/* ── FEATURES ── */}
          {activeSection==='features'&&<div className="section-card"><div className="section-header"><div className="section-title">Features Section</div></div><div className="form-group"><label className="form-label">Section Label</label><input className="form-input" value={content.featuresSection.label} onChange={e=>handleUpdate('featuresSection.label',e.target.value)}/></div><div className="form-group"><label className="form-label">Section Title</label><textarea className="form-textarea" value={content.featuresSection.title} onChange={e=>handleUpdate('featuresSection.title',e.target.value)}/></div>{content.features.map((feature,index)=>(<div key={index} className="array-item"><div className="array-item-title">Feature {index+1}</div><div className="form-group"><label className="form-label">Icon</label><input className="form-input" value={feature.icon} onChange={e=>handleArrayUpdate('features',index,'icon',e.target.value)}/></div><div className="form-group"><label className="form-label">Title</label><input className="form-input" value={feature.title} onChange={e=>handleArrayUpdate('features',index,'title',e.target.value)}/></div><div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={feature.desc} onChange={e=>handleArrayUpdate('features',index,'desc',e.target.value)}/></div></div>))}</div>}

          {/* ── CLASSES (homepage) ── */}
          {activeSection==='classes'&&<div className="section-card"><div className="section-header"><div className="section-title">Classes Section</div></div><div className="form-group"><label className="form-label">Section Label</label><input className="form-input" value={content.classesSection.label} onChange={e=>handleUpdate('classesSection.label',e.target.value)}/></div><div className="form-grid"><div className="form-group"><label className="form-label">Section Title</label><input className="form-input" value={content.classesSection.title} onChange={e=>handleUpdate('classesSection.title',e.target.value)}/></div><div className="form-group"><label className="form-label">Button Text</label><input className="form-input" value={content.classesSection.buttonText} onChange={e=>handleUpdate('classesSection.buttonText',e.target.value)}/></div></div>{content.classes.map((classItem,index)=>(<div key={index} className="array-item"><div className="array-item-title">Class {index+1}</div><div className="form-grid"><div className="form-group"><label className="form-label">Tag</label><input className="form-input" value={classItem.tag} onChange={e=>handleArrayUpdate('classes',index,'tag',e.target.value)}/></div><div className="form-group"><label className="form-label">Name</label><input className="form-input" value={classItem.name} onChange={e=>handleArrayUpdate('classes',index,'name',e.target.value)}/></div></div><div className="form-group"><label className="form-label">Class Image</label><div className="upload-zone"><input type="file" accept="image/*" onChange={e=>{const file=e.target.files[0];if(file){handleArrayUpdate('classes',index,'image',URL.createObjectURL(file));showToast('✓ Image Updated')}}}/><div className="upload-icon">📸</div><div className="upload-label">Upload image</div>{classItem.image&&<img src={classItem.image} className="upload-preview" alt=""/>}</div></div></div>))}</div>}

          {/* ── CTA ── */}
          {activeSection==='cta'&&<div className="section-card"><div className="section-header"><div className="section-title">CTA Banner</div></div><div className="form-group"><label className="form-label">Label Text</label><input className="form-input" value={content.cta.label} onChange={e=>handleUpdate('cta.label',e.target.value)}/></div><div className="form-group"><label className="form-label">Main Title</label><textarea className="form-textarea" value={content.cta.title} onChange={e=>handleUpdate('cta.title',e.target.value)}/></div><div className="form-group"><label className="form-label">Button Text</label><input className="form-input" value={content.cta.buttonText} onChange={e=>handleUpdate('cta.buttonText',e.target.value)}/></div></div>}

          {/* ── FOOTER ── */}
          {activeSection==='footer'&&<div className="section-card"><div className="section-header"><div className="section-title">Footer</div></div><div className="form-group"><label className="form-label">Copyright Text</label><input className="form-input" value={content.footer.copyright} onChange={e=>handleUpdate('footer.copyright',e.target.value)}/></div><div className="form-group"><label className="form-label">Footer Links (Comma separated)</label><input className="form-input" value={content.footer.links.join(', ')} onChange={e=>handleUpdate('footer.links',e.target.value.split(',').map(s=>s.trim()))}/></div></div>}

          {/* ── ABOUT ── */}
          {activeSection==='about'&&<div className="section-card"><div className="section-header"><div className="section-title">About Page</div></div><div className="form-group"><label className="form-label">Page Title</label><input className="form-input" value={content.about.title} onChange={e=>handleUpdate('about.title',e.target.value)}/></div><div className="form-group"><label className="form-label">Subtitle</label><input className="form-input" value={content.about.subtitle} onChange={e=>handleUpdate('about.subtitle',e.target.value)}/></div><div className="form-group"><label className="form-label">Mission Statement</label><textarea className="form-textarea" value={content.about.mission} onChange={e=>handleUpdate('about.mission',e.target.value)}/></div><div className="form-group"><label className="form-label">Vision Statement</label><textarea className="form-textarea" value={content.about.vision} onChange={e=>handleUpdate('about.vision',e.target.value)}/></div><div className="form-group"><label className="form-label">Values Statement</label><textarea className="form-textarea" value={content.about.values} onChange={e=>handleUpdate('about.values',e.target.value)}/></div></div>}

          {/* ── CLASSES PAGE ── */}
          {activeSection==='classesPage'&&(
            <div className="section-card">
              <div className="section-header"><div className="section-title">Classes Page</div><div className="section-desc">Add, edit, or remove classes</div></div>
              <div className="form-group"><label className="form-label">Page Title</label><input className="form-input" value={content.classesPage.title} onChange={e=>handleUpdate('classesPage.title',e.target.value)}/></div>
              <div className="form-group"><label className="form-label">Subtitle</label><input className="form-input" value={content.classesPage.subtitle} onChange={e=>handleUpdate('classesPage.subtitle',e.target.value)}/></div>
              {content.classesPage.classList.map((cls,index)=>(
                <div key={index} className="array-item">
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
                    <div className="array-item-title" style={{margin:0}}>Class {index+1}</div>
                    <button style={btnRemove} onClick={()=>{handleRemove('classesPage.classList',index);showToast('✓ Class Removed','#e74c3c')}}>✕ Remove</button>
                  </div>
                  <div className="form-group"><label className="form-label">Class Name</label><input className="form-input" value={cls.name} onChange={e=>handleArrayUpdate('classesPage.classList',index,'name',e.target.value)}/></div>
                  <div className="form-grid">
                    <div className="form-group"><label className="form-label">Time</label><input className="form-input" value={cls.time} onChange={e=>handleArrayUpdate('classesPage.classList',index,'time',e.target.value)}/></div>
                    <div className="form-group"><label className="form-label">Trainer</label><input className="form-input" value={cls.trainer} onChange={e=>handleArrayUpdate('classesPage.classList',index,'trainer',e.target.value)}/></div>
                  </div>
                  <div className="form-grid">
                    <div className="form-group"><label className="form-label">Level</label><input className="form-input" value={cls.level} onChange={e=>handleArrayUpdate('classesPage.classList',index,'level',e.target.value)}/></div>
                    <div className="form-group"><label className="form-label">Spots</label><input className="form-input" type="number" value={cls.spots} onChange={e=>handleArrayUpdate('classesPage.classList',index,'spots',parseInt(e.target.value))}/></div>
                  </div>
                </div>
              ))}
              <button style={btnAdd} onMouseOver={hovOn} onMouseOut={hovOff} onClick={()=>{handleAdd('classesPage.classList',{...blankClass});showToast('✓ Class Added')}}>+ Add New Class</button>
            </div>
          )}

          {/* ── EQUIPMENT PAGE ── */}
          {activeSection==='equipmentPage'&&(
            <div className="section-card">
              <div className="section-header"><div className="section-title">Equipment Page</div><div className="section-desc">Manage categories and items freely</div></div>
              <div className="form-group"><label className="form-label">Page Subtitle</label><input className="form-input" value={content.equipmentPage.subtitle} onChange={e=>handleUpdate('equipmentPage.subtitle',e.target.value)}/></div>
              {content.equipmentPage.categories.map((cat,catIndex)=>(
                <div key={catIndex} className="array-item">
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
                    <div className="array-item-title" style={{margin:0}}>Category {catIndex+1}</div>
                    <button style={btnRemove} onClick={()=>handleRemoveCategory(catIndex)}>✕ Remove Category</button>
                  </div>
                  <div className="form-group"><label className="form-label">Category Name</label><input className="form-input" value={cat.cat} onChange={e=>handleCatNameUpdate(catIndex,e.target.value)}/></div>
                  {cat.items.map((item,itemIndex)=>(
                    <div key={itemIndex} style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.04)',borderRadius:'6px',padding:'16px',marginBottom:'8px'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
                        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:'11px',letterSpacing:'2px',color:'rgba(255,255,255,0.4)',textTransform:'uppercase'}}>Item {itemIndex+1}</span>
                        <button style={{...btnRemove,padding:'3px 10px',fontSize:'10px'}} onClick={()=>handleRemoveEquipItem(catIndex,itemIndex)}>✕</button>
                      </div>
                      <div className="form-grid">
                        <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={item.name} onChange={e=>handleEquipItemUpdate(catIndex,itemIndex,'name',e.target.value)}/></div>
                        <div className="form-group"><label className="form-label">Count / Qty</label><input className="form-input" value={item.count} onChange={e=>handleEquipItemUpdate(catIndex,itemIndex,'count',e.target.value)}/></div>
                      </div>
                      <div className="form-group"><label className="form-label">Brand</label><input className="form-input" value={item.brand} onChange={e=>handleEquipItemUpdate(catIndex,itemIndex,'brand',e.target.value)}/></div>
                    </div>
                  ))}
                  <button style={btnAddSub} onMouseOver={hovOn} onMouseOut={hovOff} onClick={()=>handleAddEquipItem(catIndex)}>+ Add Item to {cat.cat}</button>
                </div>
              ))}
              <button style={btnAdd} onMouseOver={hovOn} onMouseOut={hovOff} onClick={handleAddCategory}>+ Add New Category</button>
            </div>
          )}

          {/* ── TRAINERS PAGE ── */}
          {activeSection==='trainersPage'&&(
            <div className="section-card">
              <div className="section-header"><div className="section-title">Trainers Page</div><div className="section-desc">Add, edit, or remove trainers</div></div>
              <div className="form-group"><label className="form-label">Page Title</label><input className="form-input" value={content.trainersPage.title} onChange={e=>handleUpdate('trainersPage.title',e.target.value)}/></div>
              <div className="form-group"><label className="form-label">Subtitle</label><input className="form-input" value={content.trainersPage.subtitle} onChange={e=>handleUpdate('trainersPage.subtitle',e.target.value)}/></div>
              {content.trainersPage.trainers.map((trainer,index)=>(
                <div key={index} className="array-item">
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
                    <div className="array-item-title" style={{margin:0}}>Trainer {index+1}</div>
                    <button style={btnRemove} onClick={()=>{handleRemove('trainersPage.trainers',index);showToast('✓ Trainer Removed','#e74c3c')}}>✕ Remove</button>
                  </div>
                  <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={trainer.name} onChange={e=>handleArrayUpdate('trainersPage.trainers',index,'name',e.target.value)}/></div>
                  <div className="form-grid">
                    <div className="form-group"><label className="form-label">Specialty</label><input className="form-input" value={trainer.specialty} onChange={e=>handleArrayUpdate('trainersPage.trainers',index,'specialty',e.target.value)}/></div>
                    <div className="form-group"><label className="form-label">Experience</label><input className="form-input" value={trainer.exp} onChange={e=>handleArrayUpdate('trainersPage.trainers',index,'exp',e.target.value)}/></div>
                  </div>
                </div>
              ))}
              <button style={btnAdd} onMouseOver={hovOn} onMouseOut={hovOff} onClick={()=>{handleAdd('trainersPage.trainers',{...blankTrainer});showToast('✓ Trainer Added')}}>+ Add New Trainer</button>
            </div>
          )}

          {/* ── EVENTS PAGE ── */}
          {activeSection==='eventsPage'&&(
            <div className="section-card">
              <div className="section-header"><div className="section-title">Events Page</div><div className="section-desc">Add, edit, or remove events</div></div>
              <div className="form-group"><label className="form-label">Page Title</label><input className="form-input" value={content.eventsPage.title} onChange={e=>handleUpdate('eventsPage.title',e.target.value)}/></div>
              <div className="form-group"><label className="form-label">Subtitle</label><input className="form-input" value={content.eventsPage.subtitle} onChange={e=>handleUpdate('eventsPage.subtitle',e.target.value)}/></div>
              {content.eventsPage.events.map((event,index)=>(
                <div key={index} className="array-item">
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
                    <div className="array-item-title" style={{margin:0}}>Event {index+1}</div>
                    <button style={btnRemove} onClick={()=>{handleRemove('eventsPage.events',index);showToast('✓ Event Removed','#e74c3c')}}>✕ Remove</button>
                  </div>
                  <div className="form-group"><label className="form-label">Event Title</label><input className="form-input" value={event.title} onChange={e=>handleArrayUpdate('eventsPage.events',index,'title',e.target.value)}/></div>
                  <div className="form-grid">
                    <div className="form-group"><label className="form-label">Date</label><input className="form-input" value={event.date} onChange={e=>handleArrayUpdate('eventsPage.events',index,'date',e.target.value)}/></div>
                    <div className="form-group"><label className="form-label">Category</label><input className="form-input" value={event.cat} onChange={e=>handleArrayUpdate('eventsPage.events',index,'cat',e.target.value)}/></div>
                  </div>
                  <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={event.desc} onChange={e=>handleArrayUpdate('eventsPage.events',index,'desc',e.target.value)}/></div>
                </div>
              ))}
              <button style={btnAdd} onMouseOver={hovOn} onMouseOut={hovOff} onClick={()=>{handleAdd('eventsPage.events',{...blankEvent});showToast('✓ Event Added')}}>+ Add New Event</button>
            </div>
          )}

        </div>
      </main>

      {toast&&<div className="toast" style={{background:toast.color}}>{toast.msg}</div>}
    </div>
  )
}