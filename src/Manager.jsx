import { useState, useRef } from 'react'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@400;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --dark: #0a0d1a;
    --darker: #060810;
    --panel: #0f1220;
    --panel2: #131728;
    --border: rgba(255,255,255,0.07);
    --gold: #c9a84c;
    --gold-dim: rgba(201,168,76,0.15);
    --white: #ffffff;
    --muted: #6a7a95;
    --success: #2ecc71;
    --danger: #e74c3c;
    --info: #3498db;
  }

  body { background: var(--darker); color: var(--white); font-family: 'Barlow', sans-serif; }

  .mgr-root { display: flex; min-height: 100vh; }

  /* ── SIDEBAR ── */
  .sidebar {
    width: 240px; flex-shrink: 0;
    background: var(--panel);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    position: fixed; top: 0; left: 0; bottom: 0; z-index: 50;
  }

  .sidebar-logo {
    padding: 28px 24px 24px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 12px;
  }

  .sidebar-emblem {
    width: 40px; height: 40px; border-radius: 50%;
    border: 1.5px solid var(--gold);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; background: rgba(201,168,76,0.08);
  }

  .sidebar-brand {
    font-family: 'Bebas Neue', cursive;
    font-size: 22px; letter-spacing: 2px; color: var(--white);
    line-height: 1;
  }

  .sidebar-brand span {
    display: block; font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px; letter-spacing: 3px; color: var(--gold);
    font-weight: 600; margin-top: 2px;
  }

  .sidebar-nav { padding: 20px 0; flex: 1; overflow-y: auto; }

  .nav-section-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px; letter-spacing: 3px; font-weight: 700;
    text-transform: uppercase; color: var(--muted);
    padding: 12px 24px 6px;
  }

  .nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 24px; cursor: pointer;
    border-left: 3px solid transparent;
    transition: all 0.2s; position: relative;
  }

  .nav-item:hover { background: rgba(255,255,255,0.04); }

  .nav-item.active {
    background: var(--gold-dim);
    border-left-color: var(--gold);
  }

  .nav-item.active .nav-label { color: var(--gold); }

  .nav-icon { font-size: 16px; width: 20px; text-align: center; }

  .nav-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px; letter-spacing: 1.5px; font-weight: 600;
    text-transform: uppercase; color: #9aabb8;
  }

  .nav-badge {
    margin-left: auto; background: var(--gold);
    color: var(--darker); font-size: 10px; font-weight: 700;
    padding: 2px 7px; border-radius: 10px;
    font-family: 'Barlow Condensed', sans-serif;
  }

  .sidebar-footer {
    padding: 20px 24px;
    border-top: 1px solid var(--border);
  }

  .admin-card {
    display: flex; align-items: center; gap: 10px;
  }

  .admin-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: var(--gold-dim); border: 1.5px solid var(--gold);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
  }

  .admin-info { flex: 1; }

  .admin-name {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px; font-weight: 700; letter-spacing: 1px; color: var(--white);
  }

  .admin-role {
    font-size: 11px; color: var(--muted); letter-spacing: 0.5px;
  }

  /* ── MAIN ── */
  .main {
    margin-left: 240px; flex: 1;
    display: flex; flex-direction: column;
    min-height: 100vh;
  }

  .topbar {
    padding: 20px 36px;
    border-bottom: 1px solid var(--border);
    background: var(--panel);
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 40;
  }

  .page-title {
    font-family: 'Bebas Neue', cursive;
    font-size: 28px; letter-spacing: 2px; color: var(--white);
  }

  .page-subtitle {
    font-size: 12px; color: var(--muted); letter-spacing: 0.5px; margin-top: 1px;
  }

  .topbar-actions { display: flex; align-items: center; gap: 12px; }

  .topbar-btn {
    padding: 9px 20px; border: 1px solid var(--border);
    background: transparent; color: var(--muted); cursor: pointer;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px; letter-spacing: 2px; font-weight: 600;
    text-transform: uppercase; transition: all 0.2s;
  }

  .topbar-btn:hover { border-color: var(--gold); color: var(--gold); }

  .topbar-btn.primary {
    background: var(--gold); color: var(--darker); border-color: var(--gold);
  }

  .topbar-btn.primary:hover { background: #b8962e; }

  .content { padding: 32px 36px; flex: 1; }

  /* ── STATS ROW ── */
  .stats-row {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
    margin-bottom: 32px;
  }

  .stat-card {
    background: var(--panel); border: 1px solid var(--border);
    padding: 24px; position: relative; overflow: hidden;
  }

  .stat-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: var(--gold); transform: scaleX(0); transform-origin: left;
    transition: transform 0.3s;
  }

  .stat-card:hover::before { transform: scaleX(1); }

  .stat-card-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px; letter-spacing: 3px; font-weight: 700;
    text-transform: uppercase; color: var(--muted); margin-bottom: 10px;
  }

  .stat-card-num {
    font-family: 'Bebas Neue', cursive;
    font-size: 42px; line-height: 1; color: var(--white);
  }

  .stat-card-change {
    font-size: 12px; margin-top: 6px;
    font-family: 'Barlow Condensed', sans-serif; letter-spacing: 1px;
  }

  .stat-card-change.up { color: var(--success); }
  .stat-card-change.down { color: var(--danger); }

  .stat-card-icon {
    position: absolute; right: 20px; top: 20px; font-size: 28px; opacity: 0.15;
  }

  /* ── GRID LAYOUT ── */
  .dashboard-grid {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 20px;
  }

  /* ── CONTENT EDITOR PANEL ── */
  .panel {
    background: var(--panel); border: 1px solid var(--border);
  }

  .panel-header {
    padding: 18px 24px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }

  .panel-title {
    font-family: 'Bebas Neue', cursive;
    font-size: 20px; letter-spacing: 2px; color: var(--white);
  }

  .panel-body { padding: 24px; }

  /* Tabs */
  .tabs {
    display: flex; gap: 0; border-bottom: 1px solid var(--border); margin-bottom: 24px;
  }

  .tab {
    padding: 10px 20px; cursor: pointer;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px; letter-spacing: 2px; font-weight: 700;
    text-transform: uppercase; color: var(--muted);
    border-bottom: 2px solid transparent; margin-bottom: -1px;
    transition: all 0.2s;
  }

  .tab.active { color: var(--gold); border-bottom-color: var(--gold); }
  .tab:hover:not(.active) { color: var(--white); }

  /* Form */
  .form-row { margin-bottom: 18px; }

  .form-label {
    display: block; margin-bottom: 7px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px; letter-spacing: 3px; font-weight: 700;
    text-transform: uppercase; color: var(--muted);
  }

  .form-input, .form-textarea, .form-select {
    width: 100%; background: var(--panel2); border: 1px solid var(--border);
    color: var(--white); padding: 11px 14px;
    font-family: 'Barlow', sans-serif; font-size: 14px;
    outline: none; transition: border-color 0.2s;
    resize: vertical;
  }

  .form-input:focus, .form-textarea:focus, .form-select:focus {
    border-color: var(--gold);
  }

  .form-select option { background: var(--panel2); }

  .form-textarea { min-height: 100px; }

  /* Image upload */
  .upload-zone {
    border: 2px dashed var(--border); padding: 32px;
    text-align: center; cursor: pointer; transition: all 0.2s;
    background: var(--panel2); position: relative;
  }

  .upload-zone:hover { border-color: var(--gold); background: var(--gold-dim); }

  .upload-zone input[type=file] {
    position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;
  }

  .upload-icon { font-size: 36px; margin-bottom: 10px; opacity: 0.5; }

  .upload-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px; letter-spacing: 2px; color: var(--muted); text-transform: uppercase;
  }

  .upload-sub { font-size: 11px; color: var(--muted); margin-top: 4px; opacity: 0.7; }

  .upload-preview {
    width: 100%; max-height: 180px; object-fit: cover; margin-top: 14px;
    border: 1px solid var(--border);
  }

  /* Page target selector */
  .page-targets {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 8px;
  }

  .page-target {
    padding: 10px 6px; border: 1px solid var(--border);
    background: var(--panel2); cursor: pointer; text-align: center;
    transition: all 0.2s;
  }

  .page-target.selected { border-color: var(--gold); background: var(--gold-dim); }

  .page-target-icon { font-size: 18px; display: block; margin-bottom: 4px; }

  .page-target-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px; letter-spacing: 2px; font-weight: 700;
    text-transform: uppercase;
    color: var(--muted);
  }

  .page-target.selected .page-target-label { color: var(--gold); }

  /* Submit button */
  .submit-btn {
    width: 100%; padding: 14px;
    background: var(--gold); border: none; cursor: pointer;
    font-family: 'Bebas Neue', cursive; font-size: 20px;
    letter-spacing: 3px; color: var(--darker); transition: background 0.2s;
    margin-top: 8px;
  }

  .submit-btn:hover { background: #b8962e; }
  .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ── RIGHT SIDEBAR PANELS ── */
  .right-col { display: flex; flex-direction: column; gap: 20px; }

  /* Posts list */
  .post-item {
    padding: 14px 0; border-bottom: 1px solid var(--border);
    display: flex; gap: 12px; align-items: flex-start;
  }

  .post-item:last-child { border-bottom: none; padding-bottom: 0; }

  .post-thumb {
    width: 48px; height: 48px; object-fit: cover;
    background: var(--panel2); flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; border: 1px solid var(--border);
  }

  .post-info { flex: 1; min-width: 0; }

  .post-page {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px; letter-spacing: 2px; font-weight: 700;
    color: var(--gold); text-transform: uppercase; margin-bottom: 3px;
  }

  .post-title-text {
    font-size: 13px; font-weight: 600; color: var(--white);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .post-date { font-size: 11px; color: var(--muted); margin-top: 3px; }

  .post-actions { display: flex; gap: 6px; flex-shrink: 0; }

  .icon-btn {
    width: 28px; height: 28px; border: 1px solid var(--border);
    background: transparent; cursor: pointer; color: var(--muted);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; transition: all 0.2s;
  }

  .icon-btn:hover { border-color: var(--danger); color: var(--danger); }
  .icon-btn.edit:hover { border-color: var(--info); color: var(--info); }

  /* Status badge */
  .badge {
    display: inline-block; padding: 3px 10px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px; letter-spacing: 2px; font-weight: 700; text-transform: uppercase;
    border-radius: 0;
  }

  .badge-live { background: rgba(46,204,113,0.15); color: var(--success); border: 1px solid rgba(46,204,113,0.3); }
  .badge-draft { background: rgba(106,122,149,0.15); color: var(--muted); border: 1px solid rgba(106,122,149,0.3); }

  /* Quick actions */
  .quick-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

  .quick-btn {
    padding: 16px 12px; border: 1px solid var(--border);
    background: var(--panel2); cursor: pointer; text-align: center;
    transition: all 0.2s;
  }

  .quick-btn:hover { border-color: var(--gold); background: var(--gold-dim); }

  .quick-btn-icon { font-size: 22px; display: block; margin-bottom: 6px; }

  .quick-btn-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px; letter-spacing: 2px; font-weight: 700;
    text-transform: uppercase; color: var(--muted); display: block;
  }

  /* Toast */
  .toast {
    position: fixed; bottom: 28px; right: 28px;
    background: var(--success); color: #fff;
    padding: 14px 24px; z-index: 999;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 14px; letter-spacing: 2px; font-weight: 700; text-transform: uppercase;
    animation: slideInToast 0.3s ease;
    display: flex; align-items: center; gap: 10px;
  }

  @keyframes slideInToast {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  /* Media manager grid */
  .media-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 8px;
  }

  .media-thumb {
    aspect-ratio: 1; background: var(--panel2);
    border: 1px solid var(--border); overflow: hidden;
    position: relative; cursor: pointer; transition: border-color 0.2s;
    display: flex; align-items: center; justify-content: center; font-size: 24px;
  }

  .media-thumb:hover { border-color: var(--gold); }

  .media-thumb img { width: 100%; height: 100%; object-fit: cover; }

  /* Section toggle */
  .section-toggle {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 16px; background: var(--panel2); border: 1px solid var(--border);
    margin-bottom: 8px; cursor: pointer; transition: border-color 0.2s;
  }

  .section-toggle:hover { border-color: var(--gold); }

  .section-toggle-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px; letter-spacing: 2px; font-weight: 700;
    text-transform: uppercase; color: var(--white);
  }

  .toggle-switch {
    width: 40px; height: 22px; border-radius: 11px;
    background: var(--border); position: relative; transition: background 0.2s;
  }

  .toggle-switch.on { background: var(--gold); }

  .toggle-knob {
    width: 16px; height: 16px; border-radius: 50%; background: white;
    position: absolute; top: 3px; left: 3px; transition: left 0.2s;
  }

  .toggle-switch.on .toggle-knob { left: 21px; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--darker); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
`

const PAGES = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'classes', icon: '🏋️', label: 'Classes' },
  { id: 'trainers', icon: '👤', label: 'Trainers' },
  { id: 'about', icon: '📄', label: 'About' },
  { id: 'register', icon: '📝', label: 'Register' },
  { id: 'gallery', icon: '🖼️', label: 'Gallery' },
]

const SECTIONS = [
  { id: 'hero', label: 'Hero Section' },
  { id: 'stats', label: 'Stats Bar' },
  { id: 'features', label: 'Features Grid' },
  { id: 'classes', label: 'Classes Section' },
  { id: 'cta', label: 'CTA Banner' },
  { id: 'footer', label: 'Footer' },
]

const INITIAL_POSTS = [
  { id: 1, page: 'Home', title: 'Summer Transformation Challenge', date: 'Feb 20, 2025', status: 'live', icon: '🏆' },
  { id: 2, page: 'Classes', title: 'New HIIT Class — Monday 7AM', date: 'Feb 18, 2025', status: 'live', icon: '⚡' },
  { id: 3, page: 'Gallery', title: 'Gym Renovation Photos', date: 'Feb 15, 2025', status: 'draft', icon: '🖼️' },
  { id: 4, page: 'Trainers', title: 'Meet Coach Marcus', date: 'Feb 10, 2025', status: 'live', icon: '💪' },
]

export default function Manager() {
  const [activeNav, setActiveNav] = useState('content')
  const [activeTab, setActiveTab] = useState('post')
  const [selectedPages, setSelectedPages] = useState(['home'])
  const [posts, setPosts] = useState(INITIAL_POSTS)
  const [toast, setToast] = useState(null)
  const [sectionToggles, setSectionToggles] = useState({ hero: true, stats: true, features: true, classes: true, cta: true, footer: true })
  const [imagePreview, setImagePreview] = useState(null)
  const [uploadedImages, setUploadedImages] = useState(['🏋️', '💪', '🏆', '⚡', '🔥', '🧘', '🥊', '📊'])

  const [form, setForm] = useState({ title: '', body: '', section: 'hero', heroTitle: '', heroSubtitle: '', btnText: 'Register Now', status: 'live' })
  const fileRef = useRef()

  const showToast = (msg, color = '#2ecc71') => {
    setToast({ msg, color })
    setTimeout(() => setToast(null), 3000)
  }

  const togglePage = (id) => {
    setSelectedPages(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setImagePreview(url)
  }

  const handlePublish = () => {
    if (!form.title.trim()) { showToast('⚠ Please add a title', '#e74c3c'); return }
    if (selectedPages.length === 0) { showToast('⚠ Select at least one page', '#e74c3c'); return }
    const pageNames = selectedPages.map(id => PAGES.find(p => p.id === id)?.label).join(', ')
    const newPost = {
      id: Date.now(), page: pageNames, title: form.title,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: form.status, icon: imagePreview ? null : '📝',
      img: imagePreview
    }
    setPosts(prev => [newPost, ...prev])
    setForm({ title: '', body: '', section: 'hero', heroTitle: '', heroSubtitle: '', btnText: 'Register Now', status: 'live' })
    setImagePreview(null)
    setSelectedPages(['home'])
    showToast('✓ Published Successfully')
  }

  const deletePost = (id) => {
    setPosts(prev => prev.filter(p => p.id !== id))
    showToast('Post deleted', '#e74c3c')
  }

  const toggleSection = (id) => {
    setSectionToggles(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const navItems = [
    { id: 'content', icon: '✏️', label: 'Content', section: 'MANAGE' },
    { id: 'media', icon: '🖼️', label: 'Media', section: null },
    { id: 'pages', icon: '📄', label: 'Pages', section: null },
    { id: 'classes', icon: '🏋️', label: 'Classes', section: null },
    { id: 'trainers', icon: '👤', label: 'Trainers', section: null },
    { id: 'members', icon: '👥', label: 'Members', section: 'DATA', badge: '24' },
    { id: 'bookings', icon: '📅', label: 'Bookings', section: null, badge: '7' },
    { id: 'settings', icon: '⚙️', label: 'Settings', section: 'SYSTEM' },
    { id: 'preview', icon: '👁️', label: 'Preview Site', section: null },
  ]

  return (
    <>
      <style>{styles}</style>
      <div className="mgr-root">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-emblem">⚔️</div>
            <div>
              <div className="sidebar-brand">GYM <span>Manager Panel</span></div>
            </div>
          </div>
          <nav className="sidebar-nav">
            {navItems.map((item, i) => (
              <div key={item.id}>
                {item.section && <div className="nav-section-label">{item.section}</div>}
                <div
                  className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
                  onClick={() => setActiveNav(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </div>
              </div>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="admin-card">
              <div className="admin-avatar">👤</div>
              <div className="admin-info">
                <div className="admin-name">Gym Owner</div>
                <div className="admin-role">Administrator</div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          {/* TOPBAR */}
          <div className="topbar">
            <div>
              <div className="page-title">
                {activeNav === 'content' && 'Content Manager'}
                {activeNav === 'media' && 'Media Library'}
                {activeNav === 'pages' && 'Page Sections'}
                {activeNav === 'members' && 'Members'}
                {activeNav === 'bookings' && 'Bookings'}
                {activeNav === 'settings' && 'Settings'}
                {activeNav === 'classes' && 'Classes'}
                {activeNav === 'trainers' && 'Trainers'}
                {activeNav === 'preview' && 'Site Preview'}
              </div>
              <div className="page-subtitle">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
            <div className="topbar-actions">
              <button className="topbar-btn" onClick={() => showToast('💾 Draft Saved')}>Save Draft</button>
              <button className="topbar-btn primary" onClick={handlePublish}>🚀 Publish</button>
            </div>
          </div>

          <div className="content">

            {/* ── CONTENT TAB ── */}
            {activeNav === 'content' && (
              <>
                {/* Stats */}
                <div className="stats-row">
                  {[
                    { label: 'Live Posts', num: posts.filter(p => p.status === 'live').length, change: '+2 this week', dir: 'up', icon: '📢' },
                    { label: 'Total Members', num: '1,284', change: '+18 this month', dir: 'up', icon: '👥' },
                    { label: 'Class Bookings', num: '347', change: '+12% vs last', dir: 'up', icon: '📅' },
                    { label: 'Drafts', num: posts.filter(p => p.status === 'draft').length, change: 'Unpublished', dir: 'down', icon: '📝' },
                  ].map(s => (
                    <div className="stat-card" key={s.label}>
                      <div className="stat-card-icon">{s.icon}</div>
                      <div className="stat-card-label">{s.label}</div>
                      <div className="stat-card-num">{s.num}</div>
                      <div className={`stat-card-change ${s.dir}`}>{s.change}</div>
                    </div>
                  ))}
                </div>

                <div className="dashboard-grid">
                  {/* Left: Editor */}
                  <div>
                    <div className="panel">
                      <div className="panel-header">
                        <div className="panel-title">Create / Edit Content</div>
                      </div>
                      <div className="panel-body">
                        <div className="tabs">
                          {[
                            { id: 'post', label: '📢 New Post' },
                            { id: 'hero', label: '🎯 Hero Text' },
                            { id: 'upload', label: '🖼️ Upload Image' },
                          ].map(t => (
                            <div key={t.id} className={`tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
                              {t.label}
                            </div>
                          ))}
                        </div>

                        {/* POST TAB */}
                        {activeTab === 'post' && (
                          <>
                            <div className="form-row">
                              <label className="form-label">Post Title *</label>
                              <input className="form-input" placeholder="e.g. New Morning HIIT Class Added"
                                value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                            </div>
                            <div className="form-row">
                              <label className="form-label">Body Text</label>
                              <textarea className="form-textarea" placeholder="Write your announcement, description, or update..."
                                value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} />
                            </div>
                            <div className="form-row">
                              <label className="form-label">Attach Image (Optional)</label>
                              <div className="upload-zone">
                                <input type="file" accept="image/*" onChange={handleImage} />
                                <div className="upload-icon">📸</div>
                                <div className="upload-label">Click to upload</div>
                                <div className="upload-sub">PNG, JPG, WEBP — Max 5MB</div>
                                {imagePreview && <img src={imagePreview} className="upload-preview" alt="preview" />}
                              </div>
                            </div>
                            <div className="form-row">
                              <label className="form-label">Publish To Pages</label>
                              <div className="page-targets">
                                {PAGES.map(p => (
                                  <div key={p.id} className={`page-target ${selectedPages.includes(p.id) ? 'selected' : ''}`}
                                    onClick={() => togglePage(p.id)}>
                                    <span className="page-target-icon">{p.icon}</span>
                                    <span className="page-target-label">{p.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="form-row">
                              <label className="form-label">Status</label>
                              <select className="form-select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                                <option value="live">🟢 Live — Publish Immediately</option>
                                <option value="draft">⚪ Draft — Save for Later</option>
                              </select>
                            </div>
                            <button className="submit-btn" onClick={handlePublish}>
                              {form.status === 'live' ? '🚀 Publish Now' : '💾 Save Draft'}
                            </button>
                          </>
                        )}

                        {/* HERO TAB */}
                        {activeTab === 'hero' && (
                          <>
                            <div className="form-row">
                              <label className="form-label">Hero Main Headline</label>
                              <input className="form-input" placeholder="e.g. Achieve Your Fitness Goals"
                                value={form.heroTitle} onChange={e => setForm(f => ({ ...f, heroTitle: e.target.value }))} />
                            </div>
                            <div className="form-row">
                              <label className="form-label">Hero Subtitle</label>
                              <input className="form-input" placeholder="e.g. Become a Member Today"
                                value={form.heroSubtitle} onChange={e => setForm(f => ({ ...f, heroSubtitle: e.target.value }))} />
                            </div>
                            <div className="form-row">
                              <label className="form-label">CTA Button Text</label>
                              <input className="form-input" placeholder="e.g. Register Now"
                                value={form.btnText} onChange={e => setForm(f => ({ ...f, btnText: e.target.value }))} />
                            </div>
                            <div className="form-row">
                              <label className="form-label">Hero Background Image</label>
                              <div className="upload-zone">
                                <input type="file" accept="image/*" onChange={handleImage} />
                                <div className="upload-icon">🖼️</div>
                                <div className="upload-label">Upload hero background photo</div>
                                <div className="upload-sub">Recommended: 1920×1080px</div>
                                {imagePreview && <img src={imagePreview} className="upload-preview" alt="preview" />}
                              </div>
                            </div>
                            <button className="submit-btn" onClick={() => showToast('✓ Hero Updated')}>Update Hero Section</button>
                          </>
                        )}

                        {/* UPLOAD TAB */}
                        {activeTab === 'upload' && (
                          <>
                            <div className="form-row">
                              <label className="form-label">Upload to Page</label>
                              <select className="form-select">
                                {PAGES.map(p => <option key={p.id} value={p.id}>{p.icon} {p.label}</option>)}
                              </select>
                            </div>
                            <div className="form-row">
                              <label className="form-label">Target Section</label>
                              <select className="form-select" value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value }))}>
                                {SECTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                              </select>
                            </div>
                            <div className="form-row">
                              <label className="form-label">Image File</label>
                              <div className="upload-zone">
                                <input type="file" accept="image/*" onChange={handleImage} />
                                <div className="upload-icon">📤</div>
                                <div className="upload-label">Drag & drop or click</div>
                                <div className="upload-sub">Supports JPG, PNG, WEBP, GIF, SVG</div>
                                {imagePreview && <img src={imagePreview} className="upload-preview" alt="preview" />}
                              </div>
                            </div>
                            <div className="form-row">
                              <label className="form-label">Image Alt Text (SEO)</label>
                              <input className="form-input" placeholder="Describe the image..." />
                            </div>
                            <button className="submit-btn" onClick={() => {
                              if (imagePreview) {
                                setUploadedImages(p => [imagePreview, ...p.slice(0, 7)])
                                showToast('✓ Image Uploaded to Media Library')
                                setImagePreview(null)
                              } else { showToast('⚠ Please select an image', '#e74c3c') }
                            }}>Upload to Site</button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right col */}
                  <div className="right-col">
                    {/* Recent posts */}
                    <div className="panel">
                      <div className="panel-header">
                        <div className="panel-title">Recent Posts</div>
                        <span className="badge badge-live">{posts.filter(p=>p.status==='live').length} Live</span>
                      </div>
                      <div className="panel-body" style={{padding:'16px 20px'}}>
                        {posts.map(p => (
                          <div className="post-item" key={p.id}>
                            <div className="post-thumb">
                              {p.img ? <img src={p.img} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} /> : p.icon}
                            </div>
                            <div className="post-info">
                              <div className="post-page">{p.page}</div>
                              <div className="post-title-text">{p.title}</div>
                              <div className="post-date">{p.date} · <span className={`badge badge-${p.status}`}>{p.status}</span></div>
                            </div>
                            <div className="post-actions">
                              <button className="icon-btn edit" title="Edit">✏️</button>
                              <button className="icon-btn" title="Delete" onClick={() => deletePost(p.id)}>🗑️</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick actions */}
                    <div className="panel">
                      <div className="panel-header"><div className="panel-title">Quick Actions</div></div>
                      <div className="panel-body">
                        <div className="quick-actions">
                          {[
                            { icon: '📢', label: 'Announcement' },
                            { icon: '🏋️', label: 'Add Class' },
                            { icon: '👤', label: 'Add Trainer' },
                            { icon: '🎟️', label: 'Add Offer' },
                            { icon: '📸', label: 'Gallery Photo' },
                            { icon: '📊', label: 'View Stats' },
                          ].map(q => (
                            <div className="quick-btn" key={q.label}
                              onClick={() => { setActiveTab('post'); setForm(f => ({...f, title: q.label + ' — '})) }}>
                              <span className="quick-btn-icon">{q.icon}</span>
                              <span className="quick-btn-label">{q.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── PAGES SECTIONS TAB ── */}
            {activeNav === 'pages' && (
              <div style={{maxWidth: 640}}>
                <div className="panel">
                  <div className="panel-header">
                    <div className="panel-title">Homepage Sections</div>
                    <span style={{fontSize:12,color:'var(--muted)',fontFamily:'Barlow Condensed',letterSpacing:2}}>TOGGLE VISIBILITY</span>
                  </div>
                  <div className="panel-body">
                    {SECTIONS.map(s => (
                      <div className="section-toggle" key={s.id} onClick={() => toggleSection(s.id)}>
                        <span className="section-toggle-label">{s.label}</span>
                        <div className={`toggle-switch ${sectionToggles[s.id] ? 'on' : ''}`}>
                          <div className="toggle-knob"></div>
                        </div>
                      </div>
                    ))}
                    <button className="submit-btn" onClick={() => showToast('✓ Page Layout Saved')}>Save Layout</button>
                  </div>
                </div>
              </div>
            )}

            {/* ── MEDIA TAB ── */}
            {activeNav === 'media' && (
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title">Media Library</div>
                  <button className="topbar-btn primary" onClick={() => fileRef.current?.click()}>+ Upload</button>
                  <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={e => {
                    const file = e.target.files[0]
                    if (file) {
                      const url = URL.createObjectURL(file)
                      setUploadedImages(p => [url, ...p])
                      showToast('✓ Image added to library')
                    }
                  }} />
                </div>
                <div className="panel-body">
                  <div className="media-grid">
                    {uploadedImages.map((img, i) => (
                      <div className="media-thumb" key={i}>
                        {typeof img === 'string' && img.startsWith('blob:')
                          ? <img src={img} alt="" />
                          : <span>{img}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── OTHER TABS placeholder ── */}
            {['members', 'bookings', 'settings', 'classes', 'trainers', 'preview'].includes(activeNav) && (
              <div className="panel" style={{maxWidth:600}}>
                <div className="panel-header"><div className="panel-title">{activeNav.charAt(0).toUpperCase() + activeNav.slice(1)}</div></div>
                <div className="panel-body" style={{textAlign:'center', padding:'60px 40px'}}>
                  <div style={{fontSize:56, marginBottom:16}}>
                    {activeNav === 'members' ? '👥' : activeNav === 'bookings' ? '📅' : activeNav === 'settings' ? '⚙️' : activeNav === 'classes' ? '🏋️' : activeNav === 'trainers' ? '👤' : '👁️'}
                  </div>
                  <div style={{fontFamily:'Bebas Neue', fontSize:28, letterSpacing:2, marginBottom:8}}>
                    {activeNav.charAt(0).toUpperCase() + activeNav.slice(1)} Module
                  </div>
                  <div style={{color:'var(--muted)', fontSize:14, lineHeight:1.7}}>
                    This section is ready to be wired to your backend.<br/>
                    Connect your API or database to populate this module.
                  </div>
                  <button className="submit-btn" style={{marginTop:28, maxWidth:220}} onClick={() => showToast('🔧 Module coming soon')}>Configure Module</button>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* TOAST */}
      {toast && (
        <div className="toast" style={{background: toast.color}}>
          {toast.msg}
        </div>
      )}
    </>
  )
}