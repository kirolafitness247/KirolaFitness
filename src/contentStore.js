// ─────────────────────────────────────────────────────────────────────────────
//  contentStore.js  —  All data lives in MongoDB Atlas via the backend API.
//                       Images are uploaded to Cloudinary via the backend.
//                       A local in-memory cache avoids repeated fetches.
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL || 'https://kirolafitness.onrender.com/api'

// ── In-memory cache ──
let _cache = null

// ── Default content (used as fallback while loading) ──
export const defaultContent = {
  hero: {
    eyebrow: 'Elite Fitness Center',
    title: 'Achieve\nYour\nFitness\nGoals',
    titleHighlight: 'Fitness',
    subtitle: 'Become a Member Today',
    primaryBtn: 'Register Now',
    secondaryBtn: 'Learn More',
    backgroundImages: [],
  },
  logo: { emblemIcon: '⚔️', topText: 'GYM', bottomText: 'SLOGAN HERE' },
  stats: [
    { num: '5K+', label: 'Active Members' },
    { num: '120+', label: 'Weekly Classes' },
    { num: '40+', label: 'Expert Trainers' },
    { num: '15', label: 'Years of Excellence' },
  ],
  featuresSection: { label: 'Why Choose Us', title: 'World-Class\nFacilities' },
  features: [
    { icon: '🏋️', title: 'Elite Equipment', desc: 'Train with top-of-the-line machines and functional training gear.' },
    { icon: '🔥', title: 'Expert Coaches', desc: 'Certified trainers with personalized programming and support.' },
    { icon: '⚡', title: 'Group Classes', desc: '50+ weekly classes designed to challenge and energize.' },
    { icon: '🥊', title: 'Combat Training', desc: 'Boxing, MMA, and kickboxing for all skill levels.' },
    { icon: '🧘', title: 'Recovery Zone', desc: 'Infrared saunas, cold plunge pools, and stretching areas.' },
    { icon: '📊', title: 'Progress Tracking', desc: 'Smart tools and fitness assessments to measure growth.' },
  ],
  classesSection: { label: 'What We Offer', title: 'Our Classes', buttonText: 'View All Classes' },
  classes: [
    { tag: 'Strength', name: 'Power Lifting', bg: 'linear-gradient(135deg,#1a2535,#0d1525)', image: null },
    { tag: 'Cardio',   name: 'HIIT Blast',   bg: 'linear-gradient(135deg,#1f1a30,#120d20)', image: null },
    { tag: 'Flexibility', name: 'Yoga Flow', bg: 'linear-gradient(135deg,#1a2520,#0d1a10)', image: null },
  ],
  cta: { label: 'Limited Spots Available', title: 'Start Your\nJourney Today', buttonText: 'Register Now' },
  footer: { copyright: '© 2025 GYM — All Rights Reserved', links: ['Privacy', 'Terms', 'Contact', 'Instagram'] },
  about: {
    title: 'About Our Gym', subtitle: 'Founded in 2010, transforming lives through fitness',
    mission: 'To empower individuals to reach their full potential through comprehensive fitness programs.',
    vision: 'To be the leading fitness destination where everyone feels welcome and motivated.',
    values: 'Excellence, community, integrity, and dedication to every member.',
  },
  classesPage: {
    title: 'Our Classes',
    subtitle: 'Choose from over 120 weekly classes designed for all fitness levels',
    classList: [
      { name: 'Power Lifting', time: 'Mon, Wed, Fri - 6:00 AM', trainer: 'Coach Marcus', level: 'Advanced',   spots: 12, image: null },
      { name: 'HIIT Blast',    time: 'Tue, Thu - 7:00 AM',      trainer: 'Coach Sarah',  level: 'All Levels', spots: 20, image: null },
      { name: 'Yoga Flow',     time: 'Daily - 8:00 AM',         trainer: 'Coach Emma',   level: 'Beginner',   spots: 15, image: null },
    ],
  },
  trainersPage: {
    title: 'Expert Trainers',
    subtitle: 'Meet our team of 40+ certified professionals',
    trainers: [
      { name: 'Marcus Johnson', specialty: 'Strength & Conditioning', exp: '12 years', photo: null },
      { name: 'Sarah Williams', specialty: 'HIIT & Cardio',           exp: '8 years',  photo: null },
      { name: 'Emma Davis',     specialty: 'Yoga & Flexibility',      exp: '10 years', photo: null },
    ],
  },
  equipmentPage: { title: 'Gym Equipment', subtitle: 'State-of-the-art equipment from leading brands' },
  eventsPage: {
    title: 'Upcoming Events',
    subtitle: 'Join our community events, challenges, and workshops',
    events: [
      { title: 'Summer Transformation Challenge', date: 'June 1 - August 31, 2025', desc: '12-week body transformation competition', cat: 'Competition' },
      { title: 'Yoga & Meditation Retreat',       date: 'July 15-17, 2025',          desc: 'Weekend wellness retreat',              cat: 'Wellness' },
    ],
  },
  registerPage: { title: 'Join Our Gym', subtitle: 'Start your fitness journey today' },
// ── ADD THIS ──
owner: {
  name: '',
  role: 'Founder & Head Trainer',
  tagline: '',
  image: '',
  description: '',
  philosophy: '',
  email: '',
  accentLabel: 'Gym Founded',
  accentValue: 'Kirola Fitness · Gurugram, 2022',
  experienceYears: '10+',
  membersCoached: '500+',
  certifications: '8',
  stats: [
    { num: '10+', label: 'Years Experience' },
    { num: '500+', label: 'Members Coached' },
    { num: '8',   label: 'Certifications' },
  ],
  journey: [
    { year: '2015', icon: '🏋️', title: 'The Spark',
      desc: 'Began training with a single-minded obsession — discovering what the human body is truly capable of.' },
    { year: '2019', icon: '📋', title: 'Certification & Study',
      desc: 'Earned professional fitness certifications and spent years studying nutrition, biomechanics, and sports psychology.' },
    { year: '2022', icon: '🏟️', title: 'Kirola Was Born',
      desc: 'Founded Kirola Fitness with a vision to bring elite-level training to every member regardless of experience.' },
  ],
},
}

// ─────────────────────────────────────────────────────────────────────────────
//  FETCH — load all content from MongoDB (with cache)
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchContent() {
  try {
    const res = await fetch(`${API_BASE}/content`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    _cache = json.data
    return _cache
  } catch (err) {
    console.warn('Could not fetch content from API, using cache/defaults:', err.message)
    return _cache || { ...defaultContent }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  GET — synchronous read from cache (used by components after initial load)
// ─────────────────────────────────────────────────────────────────────────────
export function getContent() {
  return _cache ? JSON.parse(JSON.stringify(_cache)) : { ...defaultContent }
}

// ─────────────────────────────────────────────────────────────────────────────
//  UPDATE — patch a single dot-path value in MongoDB
//  e.g. updateContent('hero.eyebrow', 'New Text')
// ─────────────────────────────────────────────────────────────────────────────
export async function updateContent(path, value) {
  // Optimistic local update
  if (_cache) {
    const keys = path.split('.')
    let obj = _cache
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) obj[keys[i]] = {}
      obj = obj[keys[i]]
    }
    obj[keys[keys.length - 1]] = value
  }

  try {
    const res = await fetch(`${API_BASE}/content`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, value }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    _cache = json.data
  } catch (err) {
    console.error('updateContent failed:', err.message)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  UPDATE ARRAY ITEM — update a field in array[index] at a dot-path
//  e.g. updateArrayItem('trainersPage.trainers', 0, 'name', 'John')
// ─────────────────────────────────────────────────────────────────────────────
export async function updateArrayItem(path, index, field, value) {
  const fullPath = `${path}.${index}.${field}`
  await updateContent(fullPath, value)
}

// ─────────────────────────────────────────────────────────────────────────────
//  IMAGE UPLOAD — sends file to backend → Cloudinary
//  type: 'hero' | 'class' | 'trainer' | 'home-class'
//  index: array index (for class/trainer/home-class)
//  files: FileList or File[]
// ─────────────────────────────────────────────────────────────────────────────
export async function uploadImages(type, files, index = 0) {
  const formData = new FormData()

  let endpoint = ''
  if (type === 'hero') {
    endpoint = `${API_BASE}/upload/hero`
    Array.from(files).forEach(f => formData.append('images', f))
  } else if (type === 'class') {
    endpoint = `${API_BASE}/upload/class/${index}`
    formData.append('image', files[0])
  } else if (type === 'trainer') {
    endpoint = `${API_BASE}/upload/trainer/${index}`
    formData.append('image', files[0])
  } else if (type === 'home-class') {
    endpoint = `${API_BASE}/upload/home-class/${index}`
    formData.append('image', files[0])
  }

  try {
    const res = await fetch(endpoint, { method: 'POST', body: formData })
    if (!res.ok) throw new Error(`Upload HTTP ${res.status}`)
    const json = await res.json()

    // Refresh cache from server after upload
    await fetchContent()
    window.dispatchEvent(new Event('contentUpdated'))

    return json
  } catch (err) {
    console.error('uploadImages failed:', err.message)
    throw err
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  DELETE HERO IMAGE — remove by index
// ─────────────────────────────────────────────────────────────────────────────
export async function deleteHeroImage(index) {
  try {
    await fetch(`${API_BASE}/upload/hero/${index}`, { method: 'DELETE' })
    await fetchContent()
    window.dispatchEvent(new Event('contentUpdated'))
  } catch (err) {
    console.error('deleteHeroImage failed:', err.message)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  RESET — restore defaults in MongoDB
// ─────────────────────────────────────────────────────────────────────────────
export async function resetContent() {
  try {
    const res = await fetch(`${API_BASE}/content`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(defaultContent),
    })
    const json = await res.json()
    _cache = json.data
    window.dispatchEvent(new Event('contentUpdated'))
  } catch (err) {
    console.error('resetContent failed:', err.message)
  }
}