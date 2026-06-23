import { useEffect, useState/*, lazy, Suspense*/ } from 'react';
import { motion } from 'framer-motion';

// ── SPLINE 3D SCENE (commented out — swap artwork.png back for this) ──────────
// To re-enable:
//   1. Uncomment the two lines below and the <Suspense>/<Spline> block in the JSX
//   2. Remove (or comment out) the <ArtworkVisual /> component
//   3. Restore the Spline-specific CSS at the bottom of this file
//
// import { lazy, Suspense } from 'react';   // add back to the main import above
// const Spline = lazy(() => import('@splinetool/react-spline'));
// const SPLINE_SCENE = 'https://prod.spline.design/kCclWSSvfMnXKzAp/scene.splinecode';
// ─────────────────────────────────────────────────────────────────────────────────

// ── Cyberpunk artwork display ─────────────────────────────────────────────────
function ArtworkVisual() {
  const [glitching, setGlitching] = useState(false);

  // Randomly trigger glitch bursts every few seconds
  useEffect(() => {
    const scheduleGlitch = () => {
      const delay = 2500 + Math.random() * 4000;
      return setTimeout(() => {
        setGlitching(true);
        setTimeout(() => setGlitching(false), 300 + Math.random() * 250);
        scheduleGlitch();
      }, delay);
    };
    const t = scheduleGlitch();
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="artwork-wrap">
      {/* Base image */}
      <img src="/Artwork.png" alt="Cyberpunk artwork" className="aw-img" />
      {/* Chromatic aberration colour split */}
      <img src="/Artwork.png" alt="" aria-hidden className="aw-img aw-ca-r" />
      <img src="/Artwork.png" alt="" aria-hidden className="aw-img aw-ca-b" />
      {/* Random glitch burst slices */}
      {glitching && (
        <>
          <img src="/Artwork.png" alt="" aria-hidden className="aw-img aw-glitch-1" />
          <img src="/Artwork.png" alt="" aria-hidden className="aw-img aw-glitch-2" />
          <img src="/Artwork.png" alt="" aria-hidden className="aw-img aw-glitch-3" />
        </>
      )}
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────────

// Aligns corner HUD decorations with the centered content container
const INSET = 'max(2rem, calc((100% - 1500px) / 2))';

const ROLES = [
  'Full Stack Developer',
  'UI/UX Engineer',
  'Problem Solver',
  'Cloud Engineer',
  'AI Powered Engineer'
];

const MEM_LINES = [
  '0x00011f25  b0 00   data+56  mov',
  '0x00011f26  e4 00   data+58  call',
  '0x00011f27  a0 01   data+60  add',
  '0x00011f28  a2 80   data+54  jump',
  '0x00011f29  c8 11   data+52  pop',
  '0x00011f30  f4 02   data+53  add',
  '0x00011f31  z1 00   data+51  call',
  '0x00011f32  s9 00   data+49  mov',
];

function TypeWriter({ words }) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[idx % words.length];
    const speed = deleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!deleting && text === current) {
        setTimeout(() => setDeleting(true), 1800);
      } else if (deleting && text === '') {
        setDeleting(false);
        setIdx((i) => (i + 1) % words.length);
      } else {
        setText(deleting ? text.slice(0, -1) : current.slice(0, text.length + 1));
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [text, deleting, idx, words]);

  return (
    <span>
      <span style={{ color: 'var(--magenta)' }}>{text}</span>
      <span className="cursor-blink" style={{ color: 'var(--cyan)' }}>_</span>
    </span>
  );
}

// Neon loading visual — also acts as the fallback if the scene is slow/unavailable
function SplineLoader() {
  return (
    <div className="spline-loader">
      <div className="s-ring s-ring1" />
      <div className="s-ring s-ring2" />
      <div className="s-ring s-ring3" />
      <div className="s-core" />
      <span className="s-text">LOADING 3D ENVIRONMENT…</span>
    </div>
  );
}

export default function Hero() {
  const [sceneLoaded, setSceneLoaded] = useState(false);

  return (
    <section
      id="hero"
      className="hex-grid"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '6rem 2rem 4rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Radial glow backgrounds */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '700px', height: '700px',
        background: 'radial-gradient(circle, rgba(0,245,255,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '55%', right: '5%',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(255,0,170,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ── Centered content container ── */}
      <div
        className="hero-grid"
        style={{
          width: '100%',
          maxWidth: '1500px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.05fr 0.95fr',
          alignItems: 'center',
          gap: '2rem',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* ── LEFT: text content ── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}
          >
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--green)', boxShadow: '0 0 8px var(--green)',
              display: 'inline-block', animation: 'blink 2s step-start infinite',
            }} />
            <span className="section-label">SYSTEM ONLINE // PORTFOLIO v2.0</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
              fontWeight: 900, lineHeight: 1.05,
              marginBottom: '0.25rem', letterSpacing: '-0.02em',
            }}>
              <span className="glitch-wrapper" data-text="The Host">
                <span style={{ color: 'var(--text)' }}>The Host</span>
              </span>
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
              fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.02em',
            }}>
              <span className="glitch-wrapper glow-cyan" data-text="Cyrus Neil" style={{ color: 'var(--cyan)' }}>
                Cyrus Neil
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)',
              marginTop: '1.25rem', color: 'var(--text)',
            }}
          >
            &gt;_ <TypeWriter words={ROLES} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
              color: 'var(--muted)', maxWidth: '480px',
              marginTop: '1.25rem', lineHeight: 1.7,
            }}
          >
            Building interfaces from the future.<br />
            Code is the new neon.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', flexWrap: 'wrap' }}
          >
            <a href="#projects" className="btn-neon">View Projects</a>
            <a href="#contact" className="btn-neon btn-neon-mag">Contact Me</a>
          </motion.div>
        </div>

        {/* ── RIGHT: 3D Spline model ── */}
        <div
          className="hero-visual"
          style={{
            position: 'relative',
            width: '100%',
            height: 'min(75vh, 620px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* ── Artwork image with cyberpunk effects ── */}
          <ArtworkVisual />

          {/*
          ── SPLINE 3D SCENE (commented out — see top of file to re-enable) ──────
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', opacity: sceneLoaded ? 0 : 1, transition:'opacity 0.6s ease', pointerEvents:'none', zIndex:1 }}>
            <SplineLoader />
          </div>
          <Suspense fallback={null}>
            <Spline
              scene={SPLINE_SCENE}
              onLoad={(spline) => {
                try { spline.setBackgroundColor('transparent'); } catch (e) {}
                setSceneLoaded(true);
              }}
              style={{ width:'100%', height:'100%' }}
            />
          </Suspense>
          <div className="spline-badge-mask" style={{ position:'absolute', bottom:0, right:0, width:'200px', height:'50px', background:'var(--bg)', zIndex:2, pointerEvents:'none' }} />
          ─────────────────────────────────────────────────────────────────────────
          */}
        </div>
      </div>

      {/* ── Corner HUD decorations (aligned to container edges) ── */}
      {/* Year badge — top right */}
      <div className="hero-year-badge" style={{
        position: 'absolute', top: '5.5rem', right: INSET, zIndex: 3,
        background: 'var(--surface)', border: '1px solid var(--cyan)',
        padding: '0.5rem 0.75rem', boxShadow: '0 0 12px rgba(0,245,255,0.2)',
      }}>
        <div style={{
          fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 900,
          color: 'var(--text)', lineHeight: 1.1,
        }}>
          20<br />
          <span style={{ color: 'var(--cyan)' }}>{new Date().getFullYear().toString().slice(2)}</span>
        </div>
      </div>

      {/* Memory dump — bottom left */}
      <div className="hero-memory" style={{
        position: 'absolute', bottom: '2rem', left: INSET, zIndex: 3,
        display: 'flex', flexDirection: 'column', gap: '2px',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)',
          marginBottom: '4px', borderBottom: '1px solid var(--border)', paddingBottom: '2px',
        }}>
          Memory
        </span>
        {MEM_LINES.map((line, i) => (
          <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', opacity: 0.6 }}>
            {line}
          </span>
        ))}
      </div>

      {/* Scroll indicator — bottom right */}
      <div style={{
        position: 'absolute', bottom: '2rem', right: INSET, zIndex: 3,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', writingMode: 'vertical-rl' }}>SCROLL</span>
        <div className="bounce-down" style={{ color: 'var(--cyan)', fontSize: '1.2rem' }}>›</div>
      </div>

      {/* SVG filters for chromatic aberration colour channels */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="cyber-red">
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          </filter>
          <filter id="cyber-blue">
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" />
          </filter>
        </defs>
      </svg>

      <style>{`
        /* Spline loader animation */
        .spline-loader {
          position: relative;
          width: 200px; height: 200px;
          display: flex; align-items: center; justify-content: center;
        }
        .s-ring {
          position: absolute; border-radius: 50%; border-style: solid;
        }
        .s-ring1 {
          width: 200px; height: 200px;
          border-width: 1px; border-color: rgba(0,245,255,0.4) transparent rgba(0,245,255,0.1) transparent;
          animation: s-spin 3s linear infinite;
        }
        .s-ring2 {
          width: 150px; height: 150px;
          border-width: 1px; border-color: transparent rgba(255,0,170,0.4) transparent rgba(255,0,170,0.1);
          animation: s-spin 2s linear infinite reverse;
        }
        .s-ring3 {
          width: 100px; height: 100px;
          border-width: 1px; border-color: rgba(245,230,66,0.3) transparent transparent rgba(245,230,66,0.2);
          animation: s-spin 1.5s linear infinite;
        }
        .s-core {
          width: 50px; height: 50px; border-radius: 50%;
          background: radial-gradient(circle, rgba(0,245,255,0.3), transparent 70%);
          box-shadow: 0 0 20px var(--cyan);
          animation: s-pulse 1.5s ease-in-out infinite;
        }
        .s-text {
          position: absolute; bottom: -2.5rem;
          font-family: var(--font-mono); font-size: 0.6rem;
          letter-spacing: 0.2em; color: var(--muted);
          white-space: nowrap;
        }
        @keyframes s-spin { to { transform: rotate(360deg); } }
        @keyframes s-pulse { 0%,100% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.15); opacity: 1; } }

        /* Collapse to single column on tablet/mobile — 3D stacks below text */
        @media (max-width: 968px) {
          .hero-grid { grid-template-columns: 1fr !important; text-align: center; }
          .hero-visual { height: 320px !important; }
          /* Center the status dot + label row */
          .hero-grid > div > div { justify-content: center; }
          /* Center the CTA buttons */
          .hero-grid > div > div[style*="flex"] { justify-content: center; }
          /* Constrain tagline text so it doesn't stretch too wide */
          .hero-grid p { margin-left: auto !important; margin-right: auto !important; }
        }
        @media (max-width: 480px) {
          .hero-visual { height: 260px !important; }
        }
        /*
        ── SPLINE canvas CSS (commented out — restore when re-enabling Spline) ──
        .hero-visual canvas { background: transparent !important; }
        .hero-visual canvas {
          -webkit-mask-image: radial-gradient(ellipse 88% 88% at 50% 48%, black 55%, transparent 100%);
          mask-image:         radial-gradient(ellipse 88% 88% at 50% 48%, black 55%, transparent 100%);
        }
        ──────────────────────────────────────────────────────────────────────────
        */

        /* ── Artwork effects ── */
        .artwork-wrap {
          position: relative; width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          overflow: visible; background: transparent;
        }
        .aw-img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: contain; object-position: center;
          display: block; background: transparent;
          -webkit-mask-image: radial-gradient(ellipse 70% 75% at 50% 50%, black 30%, transparent 80%);
          mask-image:         radial-gradient(ellipse 70% 75% at 50% 50%, black 30%, transparent 80%);
        }
        .aw-ca-r { mix-blend-mode: screen; opacity: 0.35; transform: translate(3px,-1px); filter: url(#cyber-red); }
        .aw-ca-b { mix-blend-mode: screen; opacity: 0.35; transform: translate(-3px,1px); filter: url(#cyber-blue); }
        .aw-glitch-1 { mix-blend-mode: screen; opacity: 0.9; transform: translate(-6px,0) skewX(-1deg); clip-path: inset(18% 0 64% 0); filter: url(#cyber-red); animation: glitch-flicker 0.12s steps(1) infinite; }
        .aw-glitch-2 { mix-blend-mode: screen; opacity: 0.85; transform: translate(8px,0) skewX(1.5deg); clip-path: inset(52% 0 22% 0); filter: url(#cyber-blue); animation: glitch-flicker 0.09s steps(1) infinite reverse; }
        .aw-glitch-3 { mix-blend-mode: screen; opacity: 0.7; transform: translate(-4px,2px); clip-path: inset(73% 0 8% 0); filter: hue-rotate(90deg) saturate(3); animation: glitch-flicker 0.15s steps(1) infinite; }
        @keyframes glitch-flicker {
          0%   { opacity:0.9; transform:translate(-6px,0) skewX(-1deg); }
          25%  { opacity:0.5; transform:translate(5px,0) skewX(2deg); }
          50%  { opacity:0.8; transform:translate(-3px,1px) skewX(0deg); }
          75%  { opacity:0.6; transform:translate(4px,-1px) skewX(-1.5deg); }
          100% { opacity:0.9; transform:translate(-6px,0) skewX(-1deg); }
        }

        /* Hide memory dump + year badge on small screens */
        @media (max-width: 640px) {
          .hero-memory { display: none !important; }
          .hero-year-badge { display: none !important; }
        }
      `}</style>
    </section>
  );
}
