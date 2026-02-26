import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getContent, updateContent, updateArrayItem } from './contentStore'
import './manager.css'

export default function Manager() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('hero')
  const [content, setContent] = useState(getContent())
  const [toast, setToast] = useState(null)

  const showToast = (msg, color = '#2ecc71') => {
    setToast({ msg, color })
    setTimeout(() => setToast(null), 3000)
  }

  const handleUpdate = (path, value) => {
    updateContent(path, value)
    setContent(getContent())
    window.dispatchEvent(new Event('contentUpdated'))
  }

  const handleArrayUpdate = (path, index, field, value) => {
    updateArrayItem(path, index, field, value)
    setContent(getContent())
    window.dispatchEvent(new Event('contentUpdated'))
  }

  const handleImageUpload = (e, path) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    handleUpdate(path, url)
    showToast('✓ Image Updated')
  }

  const saveChanges = () => {
    showToast('✓ All Changes Saved Successfully')
  }

  const sections = [
    { id: 'hero', label: '🎯 Hero Section' },
    { id: 'logo', label: '⚔️ Logo & Branding' },
    { id: 'stats', label: '📊 Stats Bar' },
    { id: 'features', label: '✨ Features' },
    { id: 'classes', label: '🏋️ Classes' },
    { id: 'cta', label: '📢 CTA Banner' },
    { id: 'footer', label: '📄 Footer' },
    { id: 'about', label: '📖 About Page' },
    { id: 'classesPage', label: '🎓 Classes Page' },
    { id: 'trainersPage', label: '👥 Trainers Page' },
    { id: 'eventsPage', label: '📅 Events Page' },
  ]

  return (
    <div className="mgr-root">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">Content Manager</div>
          <div className="sidebar-subtitle">Edit Website Content</div>
        </div>
        <nav className="sidebar-nav">
          {sections.map(item => (
            <div
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              {item.label}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="btn btn-primary full-width" onClick={() => navigate('/')}>
            ← Back to Website
          </button>
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

          {activeSection === 'hero' && (
            <div className="section-card">
              <div className="section-header">
                <div className="section-title">Hero Section</div>
                <div className="section-desc">Main landing section</div>
              </div>
              <div className="form-group">
                <label className="form-label">Eyebrow Text</label>
                <input className="form-input" value={content.hero.eyebrow}
                  onChange={(e) => handleUpdate('hero.eyebrow', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Main Title (Use \n for line breaks)</label>
                <textarea className="form-textarea" value={content.hero.title}
                  onChange={(e) => handleUpdate('hero.title', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Highlighted Word</label>
                <input className="form-input" value={content.hero.titleHighlight}
                  onChange={(e) => handleUpdate('hero.titleHighlight', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Subtitle</label>
                <input className="form-input" value={content.hero.subtitle}
                  onChange={(e) => handleUpdate('hero.subtitle', e.target.value)} />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Primary Button</label>
                  <input className="form-input" value={content.hero.primaryBtn}
                    onChange={(e) => handleUpdate('hero.primaryBtn', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Secondary Button</label>
                  <input className="form-input" value={content.hero.secondaryBtn}
                    onChange={(e) => handleUpdate('hero.secondaryBtn', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'logo' && (
            <div className="section-card">
              <div className="section-header">
                <div className="section-title">Logo & Branding</div>
              </div>
              <div className="form-group">
                <label className="form-label">Logo Icon</label>
                <input className="form-input" value={content.logo.emblemIcon}
                  onChange={(e) => handleUpdate('logo.emblemIcon', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Top Text</label>
                <input className="form-input" value={content.logo.topText}
                  onChange={(e) => handleUpdate('logo.topText', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Bottom Text</label>
                <input className="form-input" value={content.logo.bottomText}
                  onChange={(e) => handleUpdate('logo.bottomText', e.target.value)} />
              </div>
            </div>
          )}

          {activeSection === 'stats' && (
            <div className="section-card">
              <div className="section-header">
                <div className="section-title">Stats Bar</div>
              </div>
              {content.stats.map((stat, index) => (
                <div key={index} className="array-item">
                  <div className="array-item-title">Stat {index + 1}</div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Number</label>
                      <input className="form-input" value={stat.num}
                        onChange={(e) => handleArrayUpdate('stats', index, 'num', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Label</label>
                      <input className="form-input" value={stat.label}
                        onChange={(e) => handleArrayUpdate('stats', index, 'label', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'features' && (
            <div className="section-card">
              <div className="section-header">
                <div className="section-title">Features Section</div>
              </div>
              <div className="form-group">
                <label className="form-label">Section Label</label>
                <input className="form-input" value={content.featuresSection.label}
                  onChange={(e) => handleUpdate('featuresSection.label', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Section Title</label>
                <textarea className="form-textarea" value={content.featuresSection.title}
                  onChange={(e) => handleUpdate('featuresSection.title', e.target.value)} />
              </div>
              {content.features.map((feature, index) => (
                <div key={index} className="array-item">
                  <div className="array-item-title">Feature {index + 1}</div>
                  <div className="form-group">
                    <label className="form-label">Icon</label>
                    <input className="form-input" value={feature.icon}
                      onChange={(e) => handleArrayUpdate('features', index, 'icon', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <input className="form-input" value={feature.title}
                      onChange={(e) => handleArrayUpdate('features', index, 'title', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="form-textarea" value={feature.desc}
                      onChange={(e) => handleArrayUpdate('features', index, 'desc', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'classes' && (
            <div className="section-card">
              <div className="section-header">
                <div className="section-title">Classes Section</div>
              </div>
              <div className="form-group">
                <label className="form-label">Section Label</label>
                <input className="form-input" value={content.classesSection.label}
                  onChange={(e) => handleUpdate('classesSection.label', e.target.value)} />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Section Title</label>
                  <input className="form-input" value={content.classesSection.title}
                    onChange={(e) => handleUpdate('classesSection.title', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Button Text</label>
                  <input className="form-input" value={content.classesSection.buttonText}
                    onChange={(e) => handleUpdate('classesSection.buttonText', e.target.value)} />
                </div>
              </div>
              {content.classes.map((classItem, index) => (
                <div key={index} className="array-item">
                  <div className="array-item-title">Class {index + 1}</div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Tag</label>
                      <input className="form-input" value={classItem.tag}
                        onChange={(e) => handleArrayUpdate('classes', index, 'tag', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Name</label>
                      <input className="form-input" value={classItem.name}
                        onChange={(e) => handleArrayUpdate('classes', index, 'name', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Class Image</label>
                    <div className="upload-zone">
                      <input type="file" accept="image/*" onChange={(e) => {
                        const file = e.target.files[0]
                        if (file) {
                          const url = URL.createObjectURL(file)
                          handleArrayUpdate('classes', index, 'image', url)
                          showToast('✓ Image Updated')
                        }
                      }} />
                      <div className="upload-icon">📸</div>
                      <div className="upload-label">Upload image</div>
                      {classItem.image && <img src={classItem.image} className="upload-preview" alt="" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'cta' && (
            <div className="section-card">
              <div className="section-header">
                <div className="section-title">CTA Banner</div>
              </div>
              <div className="form-group">
                <label className="form-label">Label Text</label>
                <input className="form-input" value={content.cta.label}
                  onChange={(e) => handleUpdate('cta.label', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Main Title</label>
                <textarea className="form-textarea" value={content.cta.title}
                  onChange={(e) => handleUpdate('cta.title', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Button Text</label>
                <input className="form-input" value={content.cta.buttonText}
                  onChange={(e) => handleUpdate('cta.buttonText', e.target.value)} />
              </div>
            </div>
          )}

          {activeSection === 'footer' && (
            <div className="section-card">
              <div className="section-header">
                <div className="section-title">Footer</div>
              </div>
              <div className="form-group">
                <label className="form-label">Copyright Text</label>
                <input className="form-input" value={content.footer.copyright}
                  onChange={(e) => handleUpdate('footer.copyright', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Footer Links (Comma separated)</label>
                <input className="form-input" value={content.footer.links.join(', ')}
                  onChange={(e) => handleUpdate('footer.links', e.target.value.split(',').map(s => s.trim()))} />
              </div>
            </div>
          )}

          {activeSection === 'about' && (
            <div className="section-card">
              <div className="section-header">
                <div className="section-title">About Page</div>
              </div>
              <div className="form-group">
                <label className="form-label">Page Title</label>
                <input className="form-input" value={content.about.title}
                  onChange={(e) => handleUpdate('about.title', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Subtitle</label>
                <input className="form-input" value={content.about.subtitle}
                  onChange={(e) => handleUpdate('about.subtitle', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Mission Statement</label>
                <textarea className="form-textarea" value={content.about.mission}
                  onChange={(e) => handleUpdate('about.mission', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Vision Statement</label>
                <textarea className="form-textarea" value={content.about.vision}
                  onChange={(e) => handleUpdate('about.vision', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Values Statement</label>
                <textarea className="form-textarea" value={content.about.values}
                  onChange={(e) => handleUpdate('about.values', e.target.value)} />
              </div>
            </div>
          )}

          {activeSection === 'classesPage' && (
            <div className="section-card">
              <div className="section-header">
                <div className="section-title">Classes Page</div>
              </div>
              <div className="form-group">
                <label className="form-label">Page Title</label>
                <input className="form-input" value={content.classesPage.title}
                  onChange={(e) => handleUpdate('classesPage.title', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Subtitle</label>
                <input className="form-input" value={content.classesPage.subtitle}
                  onChange={(e) => handleUpdate('classesPage.subtitle', e.target.value)} />
              </div>
              {content.classesPage.classList.map((cls, index) => (
                <div key={index} className="array-item">
                  <div className="array-item-title">Class {index + 1}</div>
                  <div className="form-group">
                    <label className="form-label">Class Name</label>
                    <input className="form-input" value={cls.name}
                      onChange={(e) => handleArrayUpdate('classesPage.classList', index, 'name', e.target.value)} />
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Time</label>
                      <input className="form-input" value={cls.time}
                        onChange={(e) => handleArrayUpdate('classesPage.classList', index, 'time', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Trainer</label>
                      <input className="form-input" value={cls.trainer}
                        onChange={(e) => handleArrayUpdate('classesPage.classList', index, 'trainer', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Level</label>
                      <input className="form-input" value={cls.level}
                        onChange={(e) => handleArrayUpdate('classesPage.classList', index, 'level', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Available Spots</label>
                      <input className="form-input" type="number" value={cls.spots}
                        onChange={(e) => handleArrayUpdate('classesPage.classList', index, 'spots', parseInt(e.target.value))} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'trainersPage' && (
            <div className="section-card">
              <div className="section-header">
                <div className="section-title">Trainers Page</div>
              </div>
              <div className="form-group">
                <label className="form-label">Page Title</label>
                <input className="form-input" value={content.trainersPage.title}
                  onChange={(e) => handleUpdate('trainersPage.title', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Subtitle</label>
                <input className="form-input" value={content.trainersPage.subtitle}
                  onChange={(e) => handleUpdate('trainersPage.subtitle', e.target.value)} />
              </div>
              {content.trainersPage.trainers.map((trainer, index) => (
                <div key={index} className="array-item">
                  <div className="array-item-title">Trainer {index + 1}</div>
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input className="form-input" value={trainer.name}
                      onChange={(e) => handleArrayUpdate('trainersPage.trainers', index, 'name', e.target.value)} />
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Specialty</label>
                      <input className="form-input" value={trainer.specialty}
                        onChange={(e) => handleArrayUpdate('trainersPage.trainers', index, 'specialty', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Experience</label>
                      <input className="form-input" value={trainer.exp}
                        onChange={(e) => handleArrayUpdate('trainersPage.trainers', index, 'exp', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'eventsPage' && (
            <div className="section-card">
              <div className="section-header">
                <div className="section-title">Events Page</div>
              </div>
              <div className="form-group">
                <label className="form-label">Page Title</label>
                <input className="form-input" value={content.eventsPage.title}
                  onChange={(e) => handleUpdate('eventsPage.title', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Subtitle</label>
                <input className="form-input" value={content.eventsPage.subtitle}
                  onChange={(e) => handleUpdate('eventsPage.subtitle', e.target.value)} />
              </div>
              {content.eventsPage.events.map((event, index) => (
                <div key={index} className="array-item">
                  <div className="array-item-title">Event {index + 1}</div>
                  <div className="form-group">
                    <label className="form-label">Event Title</label>
                    <input className="form-input" value={event.title}
                      onChange={(e) => handleArrayUpdate('eventsPage.events', index, 'title', e.target.value)} />
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Date</label>
                      <input className="form-input" value={event.date}
                        onChange={(e) => handleArrayUpdate('eventsPage.events', index, 'date', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <input className="form-input" value={event.cat}
                        onChange={(e) => handleArrayUpdate('eventsPage.events', index, 'cat', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="form-textarea" value={event.desc}
                      onChange={(e) => handleArrayUpdate('eventsPage.events', index, 'desc', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {toast && (
        <div className="toast" style={{ background: toast.color }}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}
