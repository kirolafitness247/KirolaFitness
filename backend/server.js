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
  .catch(err => {
    console.error('❌ MongoDB error:', err.message)
    console.error('👉 Check your IP whitelist at: https://cloud.mongodb.com → Network Access')
  })

// ── Mongoose Schema ──
const ContentSchema = new mongoose.Schema({
  key:  { type: String, default: 'main', unique: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true })

const Content = mongoose.model('Content', ContentSchema)

// ── Event Registration Schema ──
const RegistrationSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  phone:      { type: String, required: true, trim: true },
  eventTitle: { type: String, required: true },
  eventDate:  { type: String },
  eventCat:   { type: String },
}, { timestamps: true })

const Registration = mongoose.model('Registration', RegistrationSchema)

// ── Class Booking Schema ──
const ClassBookingSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  phone:     { type: String, required: true, trim: true },
  className: { type: String, required: true },
  trainer:   { type: String },
  time:      { type: String },
  level:     { type: String },
}, { timestamps: true })

const ClassBooking = mongoose.model('ClassBooking', ClassBookingSchema)

// ── Member Registration Schema ──
const MemberRegistrationSchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
}, { timestamps: true })

const MemberRegistration = mongoose.model('MemberRegistration', MemberRegistrationSchema)

// ── Review Schema ──
const ReviewSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  message: { type: String, required: true, trim: true },
  // optional: trainer name, membership type, avatar initial (derived server-side)
  approved: { type: Boolean, default: false }, // manager can approve before showing publicly
}, { timestamps: true })

const Review = mongoose.model('Review', ReviewSchema)

// ── Multer (memory storage — files go straight to Cloudinary) ──
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
})

// ── Helper: upload buffer to Cloudinary ──
function uploadToCloudinary(buffer, folder = 'gym-website', isHero = false) {
  return new Promise((resolve, reject) => {
    const options = {
      folder,
      resource_type: 'image',
      quality: 100,
      flags: 'preserve_transparency',
    }
    const stream = cloudinary.uploader.upload_stream(options,
      (err, result) => {
        if (err) return reject(err)
        if (result.secure_url) {
          result.secure_url = result.secure_url
            .replace('/upload/', '/upload/q_100/')
            .replace('/q_100/q_100/', '/q_100/')
        }
        resolve(result)
      }
    )
    stream.end(buffer)
  })
}

// ─────────────────────────────────────────────
//  CONTENT ROUTES
// ─────────────────────────────────────────────

app.get('/api/content', async (req, res) => {
  try {
    let doc = await Content.findOne({ key: 'main' })
    if (!doc) doc = await Content.create({ key: 'main', data: defaultContent })
    res.json({ success: true, data: doc.data })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

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

app.patch('/api/content', async (req, res) => {
  try {
    const { path, value } = req.body
    const doc = await Content.findOne({ key: 'main' })
    if (!doc) return res.status(404).json({ success: false, error: 'Content not found' })

    const data = doc.data
    const keys = path.split('.')
    let obj = data
    for (let i = 0; i < keys.length - 1; i++) {
      if (obj[keys[i]] === undefined || obj[keys[i]] === null) obj[keys[i]] = {}
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
//  EVENT REGISTRATION ROUTES
// ─────────────────────────────────────────────

app.post('/api/registrations', async (req, res) => {
  try {
    const { name, phone, eventTitle, eventDate, eventCat } = req.body
    if (!name || !phone || !eventTitle)
      return res.status(400).json({ success: false, error: 'name, phone and eventTitle are required' })
    const reg = await Registration.create({ name, phone, eventTitle, eventDate, eventCat })
    res.status(201).json({ success: true, data: reg })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.get('/api/registrations', async (req, res) => {
  try {
    const regs = await Registration.find().sort({ createdAt: -1 }).lean()
    res.json({ success: true, data: regs })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.delete('/api/registrations/:id', async (req, res) => {
  try {
    await Registration.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ─────────────────────────────────────────────
//  CLASS BOOKING ROUTES
// ─────────────────────────────────────────────

app.post('/api/class-bookings', async (req, res) => {
  try {
    const { name, phone, className, trainer, time, level } = req.body
    if (!name || !phone || !className)
      return res.status(400).json({ success: false, error: 'name, phone and className are required' })
    const booking = await ClassBooking.create({ name, phone, className, trainer, time, level })
    res.status(201).json({ success: true, data: booking })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.get('/api/class-bookings', async (req, res) => {
  try {
    const bookings = await ClassBooking.find().sort({ createdAt: -1 }).lean()
    res.json({ success: true, data: bookings })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.delete('/api/class-bookings/:id', async (req, res) => {
  try {
    await ClassBooking.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ─────────────────────────────────────────────
//  MEMBER REGISTRATION ROUTES
// ─────────────────────────────────────────────

app.post('/api/members', async (req, res) => {
  try {
    const { name, email, phone } = req.body
    if (!name || !email || !phone)
      return res.status(400).json({ success: false, error: 'name, email and phone are required' })
    const member = await MemberRegistration.create({ name, email, phone })
    res.status(201).json({ success: true, data: member })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.get('/api/members', async (req, res) => {
  try {
    const members = await MemberRegistration.find().sort({ createdAt: -1 }).lean()
    res.json({ success: true, data: members })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.delete('/api/members/:id', async (req, res) => {
  try {
    await MemberRegistration.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ─────────────────────────────────────────────
//  REVIEW ROUTES
// ─────────────────────────────────────────────

// POST /api/reviews — anyone can submit a review (saved as unapproved)
app.post('/api/reviews', async (req, res) => {
  try {
    const { name, rating, message } = req.body
    if (!name || !rating || !message)
      return res.status(400).json({ success: false, error: 'name, rating, and message are required' })
    if (rating < 1 || rating > 5)
      return res.status(400).json({ success: false, error: 'rating must be between 1 and 5' })
    const review = await Review.create({ name, rating: Number(rating), message, approved: true })
    res.status(201).json({ success: true, data: review })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/reviews — public: only approved reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 }).lean()
    res.json({ success: true, data: reviews })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/reviews/all — manager: all reviews (approved + pending)
app.get('/api/reviews/all', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).lean()
    res.json({ success: true, data: reviews })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PATCH /api/reviews/:id/approve — manager approves a review
app.patch('/api/reviews/:id/approve', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    )
    if (!review) return res.status(404).json({ success: false, error: 'Review not found' })
    res.json({ success: true, data: review })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PATCH /api/reviews/:id/unapprove — manager hides a review
app.patch('/api/reviews/:id/unapprove', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { approved: false },
      { new: true }
    )
    if (!review) return res.status(404).json({ success: false, error: 'Review not found' })
    res.json({ success: true, data: review })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// DELETE /api/reviews/:id — manager deletes a review
app.delete('/api/reviews/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ─────────────────────────────────────────────
//  IMAGE UPLOAD ROUTES  (Cloudinary)
// ─────────────────────────────────────────────

app.post('/api/upload/logo', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No file provided' })
    const result = await uploadToCloudinary(req.file.buffer, 'gym-website/logo')
    const url = result.secure_url
    const doc = await Content.findOne({ key: 'main' })
    if (doc) {
      if (!doc.data.logo) doc.data.logo = {}
      doc.data.logo.image = url
      doc.markModified('data')
      await doc.save()
    }
    res.json({ success: true, url })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.post('/api/upload/hero', upload.array('images', 20), async (req, res) => {
  try {
    const files = req.files
    if (!files || files.length === 0)
      return res.status(400).json({ success: false, error: 'No files provided' })
    const urls = await Promise.all(
      files.map(f => uploadToCloudinary(f.buffer, 'gym-website/hero').then(r => r.secure_url))
    )
    const doc = await Content.findOne({ key: 'main' })
    if (doc) {
      const existing = doc.data?.hero?.backgroundImages || []
      const data = doc.data
      data.hero = { ...(data.hero || {}), backgroundImages: [...existing, ...urls] }
      doc.markModified('data')
      await doc.save()
    }
    res.json({ success: true, urls })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

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

app.post('/api/upload/event/:index', upload.single('image'), async (req, res) => {
  try {
    const index = parseInt(req.params.index)
    if (!req.file) return res.status(400).json({ success: false, error: 'No file provided' })
    const result = await uploadToCloudinary(req.file.buffer, 'gym-website/events')
    const url = result.secure_url
    const doc = await Content.findOne({ key: 'main' })
    if (doc && doc.data?.eventsPage?.events?.[index] !== undefined) {
      doc.data.eventsPage.events[index].image = url
      doc.markModified('data')
      await doc.save()
    }
    res.json({ success: true, url })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

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
//  TRANSFORMATION IMAGE UPLOAD
// ─────────────────────────────────────────────

app.post('/api/upload/transformation', upload.single('image'), async (req, res) => {
  try {
    const index     = parseInt(req.body.index)
    const imageType = req.body.imageType
    if (!req.file)
      return res.status(400).json({ success: false, error: 'No file provided' })
    if (!['before', 'after'].includes(imageType))
      return res.status(400).json({ success: false, error: 'imageType must be "before" or "after"' })
    const result = await uploadToCloudinary(req.file.buffer, 'gym-website/transformations')
    const url = result.secure_url
    const doc = await Content.findOne({ key: 'main' })
    if (doc) {
      if (!doc.data.transformationsPage) doc.data.transformationsPage = {}
      if (!Array.isArray(doc.data.transformationsPage.transformations))
        doc.data.transformationsPage.transformations = []
      const transformations = doc.data.transformationsPage.transformations
      if (transformations[index] !== undefined) {
        const field = imageType === 'before' ? 'beforeImage' : 'afterImage'
        transformations[index][field] = url
        doc.markModified('data')
        await doc.save()
      } else {
        return res.status(404).json({ success: false, error: `Transformation at index ${index} not found` })
      }
    }
    res.json({ success: true, url })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.delete('/api/upload/transformation/:index/:imageType', async (req, res) => {
  try {
    const index     = parseInt(req.params.index)
    const imageType = req.params.imageType
    if (!['before', 'after'].includes(imageType))
      return res.status(400).json({ success: false, error: 'imageType must be "before" or "after"' })
    const doc = await Content.findOne({ key: 'main' })
    if (doc) {
      const transformations = doc.data?.transformationsPage?.transformations || []
      if (transformations[index] !== undefined) {
        const field = imageType === 'before' ? 'beforeImage' : 'afterImage'
        transformations[index][field] = null
        doc.markModified('data')
        await doc.save()
      }
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
  logo: {
    emblemIcon: '🏋️',
    image: null,
  },
  stats: [
    { num: '5K+',  label: 'Active Members' },
    { num: '120+', label: 'Weekly Classes' },
    { num: '40+',  label: 'Expert Trainers' },
    { num: '15',   label: 'Years of Excellence' },
  ],
  featuresSection: { label: 'Why Choose Us', title: 'World-Class\nFacilities' },
  features: [
    { icon: '🏋️', title: 'Elite Equipment',   desc: 'Train with top-of-the-line machines and functional training gear.' },
    { icon: '🔥', title: 'Expert Coaches',    desc: 'Certified trainers with personalized programming and support.' },
    { icon: '⚡', title: 'Group Classes',     desc: '50+ weekly classes designed to challenge and energize.' },
    { icon: '🥊', title: 'Combat Training',   desc: 'Boxing, MMA, and kickboxing for all skill levels.' },
    { icon: '🧘', title: 'Recovery Zone',     desc: 'Infrared saunas, cold plunge pools, and stretching areas.' },
    { icon: '📊', title: 'Progress Tracking', desc: 'Smart tools and fitness assessments to measure growth.' },
  ],
  classesSection: { label: 'What We Offer', title: 'Our Moments', buttonText: 'View All' },
  classes: [
    { tag: 'Strength',    name: 'Power Lifting', bg: 'linear-gradient(135deg,#1a2535,#0d1525)', image: null },
    { tag: 'Cardio',      name: 'HIIT Blast',    bg: 'linear-gradient(135deg,#1f1a30,#120d20)', image: null },
    { tag: 'Flexibility', name: 'Yoga Flow',     bg: 'linear-gradient(135deg,#1a2520,#0d1a10)', image: null },
  ],
  cta: { label: 'Limited Spots Available', title: 'Start Your\nJourney Today', buttonText: 'Register Now' },
  footer: {
    copyright: '© 2025 GYM — All Rights Reserved',
    links: ['Privacy', 'Terms', 'Contact', 'Instagram'],
  },
  about: {
    title: 'About Our Gym',
    subtitle: 'Founded in 2010, transforming lives through fitness',
    mission: 'To empower individuals to reach their full potential through comprehensive fitness programs.',
    vision:  'To be the leading fitness destination where everyone feels welcome and motivated.',
    values:  'Excellence, community, integrity, and dedication to every member.',
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
  equipmentPage: {
    title: 'Gym Equipment',
    subtitle: 'State-of-the-art equipment from leading brands',
  },
  eventsPage: {
    title: 'Upcoming Events',
    subtitle: 'Join our community events, challenges, and workshops',
    events: [
      { title: 'Summer Transformation Challenge', date: 'June 1 - August 31, 2025', desc: '12-week body transformation competition', cat: 'Competition', image: null },
      { title: 'Yoga & Meditation Retreat',       date: 'July 15-17, 2025',          desc: 'Weekend wellness retreat',              cat: 'Wellness',     image: null },
    ],
  },
  registerPage: { title: 'Join Our Gym', subtitle: 'Start your fitness journey today' },
  transformationsPage: {
    label: 'Real Results',
    title: 'Real\nTransformations',
    titleHighlight: 'Real',
    subtitle: 'See the incredible journeys of our members — drag the slider to reveal each transformation.',
    stats: [
      { num: '500+',  label: 'Transformations' },
      { num: '92%',   label: 'Success Rate' },
      { num: '8 Wks', label: 'Avg. Timeframe' },
      { num: '40+',   label: 'Expert Coaches' },
    ],
    transformations: [],
  },
}

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))