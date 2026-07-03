import { useState } from 'react';
import { AVATAR_SRC } from '../config';

// Drop your image/gif into public/ and set AVATAR_SRC in src/config.js.
// This component uses that value automatically — no other changes needed.
export default function Avatar({ width = 260, height = 300 }) {
  const [imgError, setImgError] = useState(false);
  const showImage = AVATAR_SRC && !imgError;

  return (
    <div
      className="corner-bracket"
      style={{
        width, height,
        background: 'var(--surface)',
        border: showImage ? '1px solid var(--cyan)' : '1px solid var(--border)',
        boxShadow: showImage ? '0 0 20px rgba(0,245,255,0.15)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '0.75rem',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
    >
      {showImage ? (
        // ── Real image / gif ──
        <img
          src={AVATAR_SRC}
          alt="Profile"
          onError={() => setImgError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
          }}
        />
      ) : (
        // ── Animated placeholder ──
        <>
          <div style={{
            position: 'absolute',
            width: '180px', height: '180px', borderRadius: '50%',
            border: '1px solid rgba(0,245,255,0.15)',
          }} />
          <div style={{
            position: 'absolute',
            width: '130px', height: '130px', borderRadius: '50%',
            border: '1px solid rgba(255,0,170,0.1)',
          }} />
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(255,0,170,0.1))',
            border: '2px solid var(--cyan)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem',
            boxShadow: '0 0 20px rgba(0,245,255,0.3)',
            zIndex: 1,
          }}>
            👤
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            color: 'var(--muted)', letterSpacing: '0.2em', zIndex: 1,
          }}>
            // PROFILE.EXE
          </span>
        </>
      )}

      {/* Scanline overlay — visible on both image and placeholder */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,245,255,0.025) 3px, rgba(0,245,255,0.025) 4px)',
        pointerEvents: 'none',
        zIndex: 2,
      }} />

      {/* Bottom label strip — only shown over an image */}
      {showImage && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '0.4rem 0.75rem',
          background: 'rgba(3,7,18,0.75)',
          borderTop: '1px solid rgba(0,245,255,0.2)',
          zIndex: 3,
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
            color: 'var(--cyan)', letterSpacing: '0.2em',
          }}>
            // PROFILE.EXE
          </span>
        </div>
      )}
    </div>
  );
}
