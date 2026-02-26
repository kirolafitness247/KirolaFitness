import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// ── Cloudinary Config ──
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// ── MongoDB Connection ──
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Atlas connected'))
  .catch(err => console.error('❌ MongoDB error:', err))

// ── Mongoose Schema ──
const ContentSchema = new mongoose.Schema({
  key:   { type: String, default: 'main', unique: true },
  data:  { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true })

const Content = mongoose.model('Content', ContentSchema)

// ── Multer (memory storage — files go straight to Cloudinary) ──
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
})

// Helper: upload buffer to Cloudinary
function uploadToCloudinary(buffer, folder = 'gym-website') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', quality: 'auto', fetch_format: 'auto' },
      (err, result) => err ? reject(err) : resolve(result)
    )
    stream.end(buffer)
  })
}

// ─────────────────────────────────────────────
//  CONTENT ROUTES
// ─────────────────────────────────────────────

// GET  /api/content  — fetch all site content
app.get('/api/content', async (req, res) => {
  try {
    let doc = await Content.findOne({ key: 'main' })
    if (!doc) {
      // Seed with defaults on first run
      doc = await Content.create({ key: 'main', data: defaultContent })
    }
    res.json({ success: true, data: doc.data })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PUT  /api/content  — replace all site content
app.put('/api/content', async (req, res) => {
  try {
    const doc = await Content.findOneAndUpdate(
      { key: 'main' },
      { data: req.body },
      { new: true, upsert: true }
    )
    res.json({ success: true, data: doc.data })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PATCH /api/content  — update a specific dot-path (e.g. { path: 'hero.eyebrow', value: 'Hi' })
app.patch('/api/content', async (req, res) => {
  try {
    const { path, value } = req.body
    const doc = await Content.findOne({ key: 'main' })
    if (!doc) return res.status(404).json({ success: false, error: 'Content not found' })

    // Deep set using dot-path
    const data = doc.data
    const keys = path.split('.')
    let obj = data
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) obj[keys[i]] = {}
      obj = obj[keys[i]]
    }
    obj[keys[keys.length - 1]] = value

    doc.markModified('data')
    await doc.save()
    res.json({ success: true, data: doc.data })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ─────────────────────────────────────────────
//  IMAGE UPLOAD ROUTES  (Cloudinary)
// ─────────────────────────────────────────────

// POST /api/upload/hero  — upload one or more hero slideshow images
app.post('/api/upload/hero', upload.array('images', 20), async (req, res) => {
  try {
    const files = req.files
    if (!files || files.length === 0)
      return res.status(400).json({ success: false, error: 'No files provided' })

    const urls = await Promise.all(
      files.map(f => uploadToCloudinary(f.buffer, 'gym-website/hero').then(r => r.secure_url))
    )

    // Append to existing hero images in DB
    const doc = await Content.findOne({ key: 'main' })
    if (doc) {
      const existing = doc.data?.hero?.backgroundImages || []
      const updated = [...existing, ...urls]
      const data = doc.data
      data.hero = { ...(data.hero || {}), backgroundImages: updated }
      doc.markModified('data')
      await doc.save()
    }

    res.json({ success: true, urls })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/upload/class/:index  — upload image for a class (classesPage.classList[index])
app.post('/api/upload/class/:index', upload.single('image'), async (req, res) => {
  try {
    const index = parseInt(req.params.index)
    if (!req.file) return res.status(400).json({ success: false, error: 'No file provided' })

    const result = await uploadToCloudinary(req.file.buffer, 'gym-website/classes')
    const url = result.secure_url

    const doc = await Content.findOne({ key: 'main' })
    if (doc && doc.data?.classesPage?.classList?.[index] !== undefined) {
      doc.data.classesPage.classList[index].image = url
      doc.markModified('data')
      await doc.save()
    }

    res.json({ success: true, url })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/upload/trainer/:index  — upload photo for a trainer
app.post('/api/upload/trainer/:index', upload.single('image'), async (req, res) => {
  try {
    const index = parseInt(req.params.index)
    if (!req.file) return res.status(400).json({ success: false, error: 'No file provided' })

    const result = await uploadToCloudinary(req.file.buffer, 'gym-website/trainers')
    const url = result.secure_url

    const doc = await Content.findOne({ key: 'main' })
    if (doc && doc.data?.trainersPage?.trainers?.[index] !== undefined) {
      doc.data.trainersPage.trainers[index].photo = url
      doc.markModified('data')
      await doc.save()
    }

    res.json({ success: true, url })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/upload/home-class/:index  — upload image for home page classes section
app.post('/api/upload/home-class/:index', upload.single('image'), async (req, res) => {
  try {
    const index = parseInt(req.params.index)
    if (!req.file) return res.status(400).json({ success: false, error: 'No file provided' })

    const result = await uploadToCloudinary(req.file.buffer, 'gym-website/home-classes')
    const url = result.secure_url

    const doc = await Content.findOne({ key: 'main' })
    if (doc && doc.data?.classes?.[index] !== undefined) {
      doc.data.classes[index].image = url
      doc.markModified('data')
      await doc.save()
    }

    res.json({ success: true, url })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// DELETE /api/upload/hero/:index  — remove a specific hero image
app.delete('/api/upload/hero/:index', async (req, res) => {
  try {
    const index = parseInt(req.params.index)
    const doc = await Content.findOne({ key: 'main' })
    if (doc) {
      const imgs = doc.data?.hero?.backgroundImages || []
      doc.data.hero.backgroundImages = imgs.filter((_, i) => i !== index)
      doc.markModified('data')
      await doc.save()
    }
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ─────────────────────────────────────────────
//  DEFAULT CONTENT SEED
// ─────────────────────────────────────────────
const defaultContent = {
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
      { name: 'Power Lifting', time: 'Mon, Wed, Fri - 6:00 AM', trainer: 'Coach Marcus', level: 'Advanced', spots: 12, image: null },
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
}

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))