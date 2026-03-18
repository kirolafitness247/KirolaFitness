import { useState, useEffect, useRef, useCallback } from 'react'

const styles = `
  .crop-backdrop {
    position: fixed; inset: 0; z-index: 9000;
    background: rgba(4,6,14,0.92);
    backdrop-filter: blur(10px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    animation: cropFadeIn 0.2s ease;
  }
  @keyframes cropFadeIn { from { opacity: 0; } to { opacity: 1; } }

  .crop-modal {
    background: #0b0e1c;
    border: 1px solid rgba(201,168,76,0.2);
    border-radius: 6px;
    width: 100%; max-width: 480px;
    overflow: hidden;
    animation: cropSlideUp 0.25s ease;
    box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  }
  @keyframes cropSlideUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .crop-header {
    padding: 18px 22px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; justify-content: space-between;
  }
  .crop-header-title {
    font-family: 'Bebas Neue', cursive;
    font-size: 22px; letter-spacing: 2px; color: #fff;
  }
  .crop-header-sub {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px; letter-spacing: 3px; color: rgba(201,168,76,0.7);
    text-transform: uppercase; margin-top: 2px;
  }
  .crop-close-btn {
    background: none; border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.5); width: 30px; height: 30px;
    cursor: pointer; font-size: 14px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 3px; transition: all 0.2s; flex-shrink: 0;
  }
  .crop-close-btn:hover { border-color: rgba(231,76,60,0.5); color: #e74c3c; }

  /* Canvas area */
  .crop-canvas-wrap {
    position: relative;
    background: #060810;
    overflow: hidden;
    cursor: grab;
    user-select: none;
    touch-action: none;
  }
  .crop-canvas-wrap:active { cursor: grabbing; }
  .crop-canvas-wrap canvas { display: block; }

  /* Overlay mask */
  .crop-overlay {
    position: absolute; inset: 0;
    pointer-events: none; z-index: 2;
  }

  /* Controls */
  .crop-controls {
    padding: 16px 22px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  .crop-zoom-row {
    display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
  }
  .crop-zoom-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px; letter-spacing: 3px; font-weight: 700;
    text-transform: uppercase; color: rgba(255,255,255,0.4);
    flex-shrink: 0; width: 48px;
  }
  .crop-zoom-btn {
    width: 32px; height: 32px; flex-shrink: 0;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.8);
    border-radius: 4px; cursor: pointer;
    font-size: 18px; font-weight: 300; line-height: 1;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s; user-select: none;
  }
  .crop-zoom-btn:hover { background: rgba(201,168,76,0.15); border-color: rgba(201,168,76,0.4); color: #c9a84c; }
  .crop-zoom-btn:active { transform: scale(0.92); }
  .crop-zoom-slider {
    flex: 1; -webkit-appearance: none; appearance: none;
    height: 3px; background: rgba(255,255,255,0.1); border-radius: 2px; outline: none; cursor: pointer;
  }
  .crop-zoom-slider::-webkit-slider-thumb {
    -webkit-appearance: none; appearance: none;
    width: 16px; height: 16px; border-radius: 50%;
    background: #c9a84c; cursor: pointer; border: 2px solid #fff;
    box-shadow: 0 1px 6px rgba(0,0,0,0.4);
  }
  .crop-zoom-val {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px; letter-spacing: 2px; color: rgba(201,168,76,0.7);
    width: 36px; text-align: right; flex-shrink: 0;
  }
  .crop-hint {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px; letter-spacing: 2px; color: rgba(255,255,255,0.2);
    text-transform: uppercase; text-align: center; margin-bottom: 14px;
  }
  .crop-actions {
    display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
  }
  .crop-btn-cancel {
    padding: 12px; background: transparent;
    border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.5);
    cursor: pointer; font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px; letter-spacing: 3px; font-weight: 700; text-transform: uppercase;
    border-radius: 3px; transition: all 0.2s;
  }
  .crop-btn-cancel:hover { border-color: rgba(255,255,255,0.2); color: #fff; }
  .crop-btn-apply {
    padding: 12px; background: #c9a84c;
    border: none; color: #060810;
    cursor: pointer; font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px; letter-spacing: 3px; font-weight: 700; text-transform: uppercase;
    border-radius: 3px; transition: all 0.2s;
  }
  .crop-btn-apply:hover { background: #e0bc60; }
  .crop-btn-apply:disabled { opacity: 0.5; cursor: not-allowed; }

  @media (max-width: 520px) {
    .crop-modal { max-width: 100%; border-radius: 0; }
  }
`

// Canvas dimensions
const CANVAS_W = 440
const CANVAS_H = 330

/**
 * ImageCropModal
 *
 * Props:
 *   file       – File object from <input type="file">
 *   shape      – 'circle' | 'rect' (default: 'rect')
 *   aspect     – aspect ratio for rect crop: e.g. 1 (square), 16/9, 4/3 (default: 1)
 *   onDone     – (blob: Blob) => void  — called with the cropped image blob
 *   onCancel   – () => void
 */
export default function ImageCropModal({ file, shape = 'rect', aspect = 1, onDone, onCancel }) {
  const canvasRef  = useRef(null)
  const imgRef     = useRef(null)
  const dragRef    = useRef({ active: false, startX: 0, startY: 0, ox: 0, oy: 0 })

  const [zoom,   setZoom]   = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 })
  const [applying, setApplying] = useState(false)

  // Crop box dimensions (centred in canvas)
  const cropH = Math.min(CANVAS_H - 40, CANVAS_W / aspect - 40)
  const cropW = cropH * aspect
  const cropX = (CANVAS_W - cropW) / 2
  const cropY = (CANVAS_H - cropH) / 2

  // Load the image from the file
  useEffect(() => {
    if (!file) return
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      imgRef.current = img
      // FIT: show entire image inside canvas — owner decides what to crop
      const scaleW = CANVAS_W / img.width
      const scaleH = CANVAS_H / img.height
      const initialZoom = Math.min(scaleW, scaleH) * 0.92   // slight padding so edges are visible
      setZoom(initialZoom)
      setOffset({ x: 0, y: 0 })
      setImgSize({ w: img.width, h: img.height })
    }
    img.src = url
    return () => URL.revokeObjectURL(url)
  }, [file])

  // Draw canvas whenever zoom/offset changes
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const img    = imgRef.current
    if (!canvas || !img) return
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)

    // Draw image
    const dw = img.width  * zoom
    const dh = img.height * zoom
    const dx = (CANVAS_W - dw) / 2 + offset.x
    const dy = (CANVAS_H - dh) / 2 + offset.y
    ctx.drawImage(img, dx, dy, dw, dh)

    // Darken outside crop area
    ctx.fillStyle = 'rgba(4,6,14,0.65)'
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

    // Cut out crop region
    ctx.save()
    ctx.globalCompositeOperation = 'destination-out'
    if (shape === 'circle') {
      ctx.beginPath()
      ctx.arc(cropX + cropW / 2, cropY + cropH / 2, Math.min(cropW, cropH) / 2, 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.fillRect(cropX, cropY, cropW, cropH)
    }
    ctx.restore()

    // Redraw image inside crop (so it's undarked)
    ctx.save()
    if (shape === 'circle') {
      ctx.beginPath()
      ctx.arc(cropX + cropW / 2, cropY + cropH / 2, Math.min(cropW, cropH) / 2, 0, Math.PI * 2)
      ctx.clip()
    } else {
      ctx.rect(cropX, cropY, cropW, cropH)
      ctx.clip()
    }
    ctx.drawImage(img, dx, dy, dw, dh)
    ctx.restore()

    // Crop border
    ctx.strokeStyle = '#c9a84c'
    ctx.lineWidth = 2
    if (shape === 'circle') {
      ctx.beginPath()
      ctx.arc(cropX + cropW / 2, cropY + cropH / 2, Math.min(cropW, cropH) / 2, 0, Math.PI * 2)
      ctx.stroke()
    } else {
      ctx.strokeRect(cropX, cropY, cropW, cropH)
      // Rule-of-thirds guides
      ctx.strokeStyle = 'rgba(201,168,76,0.2)'
      ctx.lineWidth = 1
      for (let i = 1; i < 3; i++) {
        ctx.beginPath(); ctx.moveTo(cropX + (cropW / 3) * i, cropY); ctx.lineTo(cropX + (cropW / 3) * i, cropY + cropH); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(cropX, cropY + (cropH / 3) * i); ctx.lineTo(cropX + cropW, cropY + (cropH / 3) * i); ctx.stroke()
      }
    }
    // Corner handles
    ctx.strokeStyle = '#c9a84c'
    ctx.lineWidth = 3
    if (shape !== 'circle') {
      const cs = 14
      const corners = [[cropX, cropY],[cropX + cropW, cropY],[cropX, cropY + cropH],[cropX + cropW, cropY + cropH]]
      corners.forEach(([cx, cy]) => {
        ctx.beginPath()
        ctx.moveTo(cx + (cx < CANVAS_W/2 ? cs : -cs), cy)
        ctx.lineTo(cx, cy)
        ctx.lineTo(cx, cy + (cy < CANVAS_H/2 ? cs : -cs))
        ctx.stroke()
      })
    }
  }, [zoom, offset, shape, cropX, cropY, cropW, cropH])

  useEffect(() => { draw() }, [draw])

  // Drag to pan
  const onMouseDown = (e) => {
    dragRef.current = { active: true, startX: e.clientX, startY: e.clientY, ox: offset.x, oy: offset.y }
  }
  const onMouseMove = (e) => {
    if (!dragRef.current.active) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    setOffset({ x: dragRef.current.ox + dx, y: dragRef.current.oy + dy })
  }
  const onMouseUp = () => { dragRef.current.active = false }

  // Touch drag
  const onTouchStart = (e) => {
    const t = e.touches[0]
    dragRef.current = { active: true, startX: t.clientX, startY: t.clientY, ox: offset.x, oy: offset.y }
  }
  const onTouchMove = (e) => {
    if (!dragRef.current.active) return
    const t = e.touches[0]
    const dx = t.clientX - dragRef.current.startX
    const dy = t.clientY - dragRef.current.startY
    setOffset({ x: dragRef.current.ox + dx, y: dragRef.current.oy + dy })
  }

  // Export cropped image
  const applyCrop = () => {
    const img = imgRef.current
    if (!img) return
    setApplying(true)

    const out = document.createElement('canvas')
    const outSize = shape === 'circle' ? Math.min(cropW, cropH) : Math.max(cropW, cropH)
    out.width  = shape === 'circle' ? outSize : cropW
    out.height = shape === 'circle' ? outSize : cropH

    const ctx = out.getContext('2d')

    if (shape === 'circle') {
      ctx.beginPath()
      ctx.arc(outSize / 2, outSize / 2, outSize / 2, 0, Math.PI * 2)
      ctx.clip()
    }

    const dw = img.width  * zoom
    const dh = img.height * zoom
    const dx = (CANVAS_W - dw) / 2 + offset.x
    const dy = (CANVAS_H - dh) / 2 + offset.y

    // Source coords within the crop box
    ctx.drawImage(img,
      dx - cropX, dy - cropY, dw, dh
    )

    out.toBlob(blob => {
      setApplying(false)
      onDone(blob)
    }, 'image/jpeg', 0.92)
  }

  const minZoom = imgSize.w > 0
    ? Math.min(CANVAS_W / imgSize.w, CANVAS_H / imgSize.h) * 0.3
    : 0.05

  return (
    <>
      <style>{styles}</style>
      <div className="crop-backdrop" onClick={e => e.target === e.currentTarget && onCancel()}>
        <div className="crop-modal">

          {/* Header */}
          <div className="crop-header">
            <div>
              <div className="crop-header-title">Move & Scale</div>
              <div className="crop-header-sub">Drag to reposition · Scroll or slide to zoom</div>
            </div>
            <button className="crop-close-btn" onClick={onCancel}>✕</button>
          </div>

          {/* Canvas */}
          <div className="crop-canvas-wrap"
            style={{ width: CANVAS_W, maxWidth: '100%', height: CANVAS_H }}
            onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onMouseUp}
            onWheel={e => {
              e.preventDefault()
              const delta = -e.deltaY * 0.001
              setZoom(z => Math.max(minZoom, Math.min(z + delta * z, 5)))
            }}
          >
            <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} style={{ maxWidth: '100%' }} />
          </div>

          {/* Controls */}
          <div className="crop-controls">
            <div className="crop-zoom-row">
              <span className="crop-zoom-label">Zoom</span>
              <button
                className="crop-zoom-btn"
                onClick={() => setZoom(z => Math.max(minZoom || 0.1, +(z - 0.1 * z).toFixed(3)))}
                title="Zoom out"
              >−</button>
              <input
                type="range" className="crop-zoom-slider"
                min={minZoom || 0.1} max={5} step={0.01}
                value={zoom}
                onChange={e => setZoom(parseFloat(e.target.value))}
              />
              <button
                className="crop-zoom-btn"
                onClick={() => setZoom(z => Math.min(5, +(z + 0.1 * z).toFixed(3)))}
                title="Zoom in"
              >+</button>
              <span className="crop-zoom-val">{Math.round(zoom * 100)}%</span>
            </div>
            <p className="crop-hint">Zoom in and drag to position · The gold box shows what gets saved</p>
            <div className="crop-actions">
              <button className="crop-btn-cancel" onClick={onCancel}>Cancel</button>
              <button className="crop-btn-apply" onClick={applyCrop} disabled={applying}>
                {applying ? 'Applying…' : 'Choose ✓'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}