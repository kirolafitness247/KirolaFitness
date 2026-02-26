// Content Store - Central place for all website content
export const defaultContent = {
  // Hero Section
  hero: {
    eyebrow: 'Elite Fitness Center',
    title: 'Achieve\nYour\nFitness\nGoals',
    titleHighlight: 'Fitness',
    subtitle: 'Become a Member Today',
    primaryBtn: 'Register Now',
    secondaryBtn: 'Learn More',
    backgroundImage: null,
  },

  // Logo
  logo: {
    emblemIcon: '⚔️',
    topText: 'GYM',
    bottomText: 'SLOGAN HERE',
  },

  // Stats Bar
  stats: [
    { num: '5K+', label: 'Active Members' },
    { num: '120+', label: 'Weekly Classes' },
    { num: '40+', label: 'Expert Trainers' },
    { num: '15', label: 'Years of Excellence' },
  ],

  // Features Section
  featuresSection: {
    label: 'Why Choose Us',
    title: 'World-Class\nFacilities',
  },

  features: [
    { icon: '🏋️', title: 'Elite Equipment', desc: 'Train with top-of-the-line machines, free weights, and functional training gear for every discipline.' },
    { icon: '🔥', title: 'Expert Coaches', desc: 'Our certified trainers push you beyond limits with personalized programming and relentless support.' },
    { icon: '⚡', title: 'Group Classes', desc: 'From HIIT to yoga — 50+ weekly classes designed to challenge, transform, and energize every body.' },
    { icon: '🥊', title: 'Combat Training', desc: 'Boxing, MMA, and kickboxing programs for all skill levels. Build discipline inside and out.' },
    { icon: '🧘', title: 'Recovery Zone', desc: 'Infrared saunas, cold plunge pools, and stretching areas to keep your body performing at its best.' },
    { icon: '📊', title: 'Progress Tracking', desc: 'Smart tools and fitness assessments to measure your growth and keep motivation razor-sharp.' },
  ],

  // Classes Section
  classesSection: {
    label: 'What We Offer',
    title: 'Our Classes',
    buttonText: 'View All Classes',
  },

  classes: [
    { tag: 'Strength', name: 'Power Lifting', bg: 'linear-gradient(135deg,#1a2535,#0d1525)', image: null },
    { tag: 'Cardio', name: 'HIIT Blast', bg: 'linear-gradient(135deg,#1f1a30,#120d20)', image: null },
    { tag: 'Flexibility', name: 'Yoga Flow', bg: 'linear-gradient(135deg,#1a2520,#0d1a10)', image: null },
  ],

  // CTA Section
  cta: {
    label: 'Limited Spots Available',
    title: 'Start Your\nJourney Today',
    buttonText: 'Register Now',
  },

  // Footer
  footer: {
    copyright: '© 2025 GYM — All Rights Reserved',
    links: ['Privacy', 'Terms', 'Contact', 'Instagram'],
  },

  // About Page
  about: {
    title: 'About Our Gym',
    subtitle: 'Founded in 2010, transforming lives through fitness for over 15 years',
    mission: 'To empower individuals to reach their full potential through comprehensive fitness programs, expert coaching, and a supportive community environment.',
    vision: 'To be the leading fitness destination where everyone feels welcome, motivated, and equipped to transform their lives through health and wellness.',
    values: 'Excellence, community, integrity, and dedication to helping every member achieve their personal best through consistent support and guidance.',
  },

  // Classes Page
  classesPage: {
    title: 'Our Classes',
    subtitle: 'Choose from over 120 weekly classes designed for all fitness levels',
    classList: [
      { name: 'Power Lifting', time: 'Mon, Wed, Fri - 6:00 AM', trainer: 'Coach Marcus', level: 'Advanced', spots: 12 },
      { name: 'HIIT Blast', time: 'Tue, Thu - 7:00 AM', trainer: 'Coach Sarah', level: 'All Levels', spots: 20 },
      { name: 'Yoga Flow', time: 'Daily - 8:00 AM', trainer: 'Coach Emma', level: 'Beginner', spots: 15 },
    ]
  },

  // Trainers Page
  trainersPage: {
    title: 'Expert Trainers',
    subtitle: 'Meet our team of 40+ certified professionals',
    trainers: [
      { name: 'Marcus Johnson', specialty: 'Strength & Conditioning', exp: '12 years' },
      { name: 'Sarah Williams', specialty: 'HIIT & Cardio', exp: '8 years' },
      { name: 'Emma Davis', specialty: 'Yoga & Flexibility', exp: '10 years' },
    ]
  },

  // Equipment Page
  equipmentPage: {
    title: 'Gym Equipment',
    subtitle: 'State-of-the-art equipment from leading brands',
  },

  // Events Page
  eventsPage: {
    title: 'Upcoming Events',
    subtitle: 'Join our community events, challenges, and workshops',
    events: [
      { title: 'Summer Transformation Challenge', date: 'June 1 - August 31, 2025', desc: '12-week body transformation competition with prizes', cat: 'Competition' },
      { title: 'Yoga & Meditation Retreat', date: 'July 15-17, 2025', desc: 'Weekend wellness retreat in the mountains', cat: 'Wellness' },
    ]
  },

  // Register Page
  registerPage: {
    title: 'Join Our Gym',
    subtitle: 'Start your fitness journey today',
  }
}

// Content management functions with localStorage persistence
const STORAGE_KEY = 'gym_website_content'

// Load content from localStorage or use default
const loadContent = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load content from localStorage:', e)
  }
  return JSON.parse(JSON.stringify(defaultContent))
}

// Save content to localStorage
const saveContent = (content) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content))
  } catch (e) {
    console.error('Failed to save content to localStorage:', e)
  }
}

let currentContent = loadContent()

export const getContent = () => JSON.parse(JSON.stringify(currentContent))

export const updateContent = (path, value) => {
  const keys = path.split('.')
  let obj = currentContent
  
  for (let i = 0; i < keys.length - 1; i++) {
    if (!obj[keys[i]]) obj[keys[i]] = {}
    obj = obj[keys[i]]
  }
  
  obj[keys[keys.length - 1]] = value
  saveContent(currentContent)
}

export const updateArrayItem = (path, index, field, value) => {
  const keys = path.split('.')
  let obj = currentContent
  
  for (let i = 0; i < keys.length; i++) {
    obj = obj[keys[i]]
  }
  
  if (Array.isArray(obj) && obj[index]) {
    obj[index][field] = value
  }
  saveContent(currentContent)
}

export const resetContent = () => {
  currentContent = JSON.parse(JSON.stringify(defaultContent))
  saveContent(currentContent)
}
