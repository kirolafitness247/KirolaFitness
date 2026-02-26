# Content Manager Guide

## Overview
Your website now has a comprehensive Content Management System that allows you to edit every text and image directly from the Manager section.

## How to Access
1. Visit your website at `http://localhost:5174`
2. Scroll to the footer and click "⚙ Manager" link
3. Or navigate directly to `http://localhost:5174/manager`

## Features

### 🎯 Hero Section
- Edit eyebrow text (small text above title)
- Customize main title with line breaks
- Set highlighted word (appears in gold)
- Change subtitle
- Edit button texts
- Upload hero background image

### ⚔️ Logo & Branding
- Change logo emblem icon (emoji or text)
- Edit top text inside emblem
- Customize bottom slogan text
- Live preview of logo changes

### 📊 Stats Bar
- Edit all 4 statistics
- Change numbers (e.g., "5K+", "120+")
- Update labels for each stat

### ✨ Features Section
- Edit section label and title
- Manage 6 feature cards:
  - Change icons (emojis)
  - Edit titles
  - Update descriptions

### 🏋️ Classes Section
- Edit section label, title, and button text
- Manage 3 class cards:
  - Change category tags
  - Edit class names
  - Upload class images (replaces gradient backgrounds)

### 📢 CTA Banner
- Edit label text
- Customize main title with line breaks
- Change button text
- Live preview of CTA section

### 📄 Footer
- Edit copyright text
- Manage footer links (comma-separated)
- Live preview of footer

## How It Works

### Real-Time Updates
- All changes are stored in a central content store
- Changes are immediately reflected on the main website
- No page refresh needed - updates happen live

### Image Uploads
- Click on any upload zone to select an image
- Supported formats: JPG, PNG, WEBP, GIF, SVG
- Images are instantly previewed
- Upload placeholders show where images can be added

### Saving Changes
- Click "💾 Save All Changes" button in the top bar
- Success toast notification confirms save
- Changes persist across page navigation

## Tips

### Line Breaks
- Use `\n` in text fields to create line breaks
- Example: `Achieve\nYour\nFitness\nGoals` creates 4 lines

### Highlighted Text
- Set the "Highlighted Word" field to match a word in your title
- That word will appear in gold color

### Footer Links
- Enter links separated by commas
- Example: `Privacy, Terms, Contact, Instagram`

### Image Placeholders
- All image upload zones show placeholders
- Click to upload and replace with actual images
- Preview appears immediately after upload

## Navigation
- Use the sidebar to switch between sections
- "Back to Website" button returns to main site
- "Preview Site" button opens website in same tab

## Future Enhancements
You can extend this system to add:
- More pages (About, Trainers, etc.)
- Additional sections
- More customization options
- Backend integration for persistent storage
