export const sharedStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;900&family=Barlow+Condensed:wght@400;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --dark: #0a0d1a;
    --darker: #060810;
    --accent: #e8e0d0;
    --gold: #c9a84c;
    --white: #ffffff;
    --muted: #8a9ab5;
  }

  body { background: var(--dark); color: var(--white); font-family: 'Barlow', sans-serif; overflow-x: hidden; margin: 0; padding: 0; }

  .page-container { 
    min-height: 100vh; 
    background: var(--dark); 
    width: 100%;
    overflow-x: hidden;
  }

  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: center;
    padding: 20px 48px;
    background: linear-gradient(to bottom, rgba(6,8,16,0.95) 0%, transparent 100%);
    gap: 48px;
  }

  .nav-logo { display: flex; align-items: center; gap: 12px; position: absolute; left: 48px; }

  .logo-emblem {
    width: 64px; height: 64px; border-radius: 50%;
    border: 2px solid var(--gold);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    background: rgba(10,13,26,0.9); position: relative;
  }

  .logo-emblem::before {
    content: '✦ GYM ✦';
    font-size: 7px; letter-spacing: 2px; color: var(--gold);
    font-family: 'Barlow Condensed', sans-serif; font-weight: 600;
    display: block; margin-bottom: 2px;
  }

  .logo-emblem-icon { font-size: 20px; line-height: 1; }

  .logo-emblem::after {
    content: '— SLOGAN HERE —';
    font-size: 5.5px; letter-spacing: 1.5px; color: var(--gold);
    font-family: 'Barlow Condensed', sans-serif;
    display: block; margin-top: 2px;
  }

  .nav-links {
    display: flex; align-items: center; gap: 32px; list-style: none;
    margin: 0;
    padding: 0;
  }

  .nav-links a {
    color: var(--white); text-decoration: none;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px; letter-spacing: 3px; font-weight: 600;
    text-transform: uppercase; transition: color 0.2s;
    position: relative; cursor: pointer;
  }

  .nav-links a.active::after {
    content: ''; position: absolute; bottom: -4px; left: 0; right: 0;
    height: 2px; background: var(--white);
  }

  .nav-links a:hover { color: var(--gold); }

  .page-header {
    padding: 180px 80px 100px;
    background: var(--darker);
    width: 100%;
  }

  .page-header h1 {
    font-family: 'Bebas Neue', cursive;
    font-size: clamp(56px, 8vw, 96px);
    line-height: 0.92; letter-spacing: 2px;
    color: var(--white); margin-bottom: 20px;
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
  }

  .page-header h1 span { color: var(--gold); }

  .page-header p {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 16px; letter-spacing: 2px;
    color: var(--muted); max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
  }

  .section {
    padding: 100px 80px;
    background: var(--dark);
    width: 100%;
  }

  .section-content {
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
  }

  .section-darker { 
    background: var(--darker); 
    width: 100%;
  }

  .section-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px; letter-spacing: 5px; font-weight: 700;
    text-transform: uppercase; color: var(--gold);
    margin-bottom: 16px;
  }

  .section-title {
    font-family: 'Bebas Neue', cursive;
    font-size: clamp(40px, 5vw, 64px);
    line-height: 1; color: var(--white);
    margin-bottom: 48px;
  }

  .grid-3 {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    padding: 40px 32px;
    transition: all 0.3s;
  }

  .card:hover {
    background: rgba(201,168,76,0.06);
    border-color: rgba(201,168,76,0.25);
    transform: translateY(-4px);
  }

  .card-title {
    font-family: 'Bebas Neue', cursive;
    font-size: 28px; letter-spacing: 1px;
    color: var(--white); margin-bottom: 12px;
  }

  .card-desc {
    font-size: 14px; line-height: 1.7; color: var(--muted);
  }

  .btn-primary {
    background: var(--white); color: var(--darker);
    border: none; padding: 16px 40px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px; letter-spacing: 4px; font-weight: 700;
    text-transform: uppercase; cursor: pointer;
    transition: all 0.25s;
  }

  .btn-primary:hover { background: var(--gold); }

  .btn-outline {
    background: transparent; color: var(--white);
    border: 1px solid rgba(255,255,255,0.3); padding: 16px 32px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px; letter-spacing: 4px; font-weight: 600;
    text-transform: uppercase; cursor: pointer; transition: all 0.25s;
  }

  .btn-outline:hover { border-color: var(--gold); color: var(--gold); }

  .footer {
    background: var(--darker); 
    padding: 40px 80px;
    border-top: 1px solid rgba(255,255,255,0.07);
    width: 100%;
  }

  .footer-content {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .footer-copy {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px; letter-spacing: 2px; color: var(--muted);
    text-transform: uppercase;
  }

  .footer-links {
    display: flex; gap: 28px; list-style: none;
  }

  .footer-links a {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px; letter-spacing: 3px; color: var(--muted);
    text-decoration: none; text-transform: uppercase; transition: color 0.2s;
    cursor: pointer;
  }

  .footer-links a:hover { color: var(--gold); }

  @media (max-width: 900px) {
    .grid-3 { grid-template-columns: 1fr; }
    .nav { padding: 16px 24px; }
    .section, .page-hero { padding: 60px 24px; }
    .footer { flex-direction: column; gap: 20px; }
  }
`
