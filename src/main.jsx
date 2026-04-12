import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Wake up Render backend immediately on site load
fetch('https://kirolafitness.onrender.com/api').catch(() => {});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Hide splash once React has painted
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    const splash = document.getElementById('splash')
    if (splash) {
      splash.classList.add('hidden')
      setTimeout(() => splash.remove(), 500)
    }
  })
})