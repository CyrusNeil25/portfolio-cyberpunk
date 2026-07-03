import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaTimes } from 'react-icons/fa';

const STATUS_COLOR = {
  Live: 'var(--green)',
  Internal: 'var(--yellow)',
  Archived: 'var(--muted)',
};

// Terminal "boot sequence" lines typed out when the modal opens
function useBootLines(project) {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    if (!project) { setLines([]); return; }
    const sequence = [
      `$ ssh root@portfolio.dev`,
      `Connecting to project archive...`,
      `Authenticated. Loading record ${String(project.id).padStart(3, '0')}...`,
      `$ cat ./projects/${project.title.toLowerCase().replace(/\s+/g, '-')}.json`,
    ];
    setLines([]);
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setLines(sequence.slice(0, i));
      if (i >= sequence.length) clearInterval(timer);
    }, 90);
    return () => clearInterval(timer);
  }, [project]);

  return lines;
}

export default function ProjectModal({ project, onClose }) {
  const bootLines = useBootLines(project);

  // Esc to close + lock body scroll while open
  useEffect(() => {
    if (!project) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="pm-backdrop"
          style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'rgba(3,7,18,0.8)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '880px', maxHeight: '88vh',
              background: '#050a14',
              border: '1px solid var(--cyan)',
              boxShadow: '0 0 40px rgba(0,245,255,0.15), 0 20px 60px rgba(0,0,0,0.6)',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* ── Terminal title bar ── */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.6rem 1rem',
              background: 'var(--surface)',
              borderBottom: '1px solid var(--border)',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0, overflow: 'hidden' }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--magenta)', opacity: 0.8, flexShrink: 0 }} />
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--yellow)', opacity: 0.8, flexShrink: 0 }} />
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--green)', opacity: 0.8, flexShrink: 0 }} />
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)',
                  marginLeft: '0.75rem', letterSpacing: '0.05em',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0,
                }}>
                  root@portfolio:~/projects/{project.title.toLowerCase().replace(/\s+/g, '-')}
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                style={{
                  background: 'none', border: '1px solid var(--border)', color: 'var(--muted)',
                  width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s',
                  flexShrink: 0, marginLeft: '0.75rem',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--magenta)'; e.currentTarget.style.borderColor = 'var(--magenta)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <FaTimes size={11} />
              </button>
            </div>

            {/* ── Boot sequence ── */}
            <div style={{
              padding: '0.75rem 1.25rem',
              borderBottom: '1px solid var(--border)',
              fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
              color: 'var(--green)', flexShrink: 0,
              minHeight: '1.2rem',
            }}>
              {bootLines.map((line, i) => (
                <div key={i} style={{ opacity: i === bootLines.length - 1 ? 1 : 0.5 }}>
                  {line}
                </div>
              ))}
            </div>

            {/* ── Scrollable body ── */}
            <div className="pm-scroll" style={{ overflowY: 'auto', padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: '2rem' }} className="pm-grid">

                {/* Image / screenshot panel */}
                <div>
                  <div
                    className="corner-bracket"
                    style={{
                      position: 'relative', width: '100%', aspectRatio: '4 / 3',
                      background: 'var(--surface)', border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    {project.image ? (
                      <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ textAlign: 'center', padding: '1rem' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.5 }}>▦</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.15em' }}>
                          NO_PREVIEW.PNG
                        </div>
                      </div>
                    )}
                    {/* scanlines over the image slot */}
                    <div style={{
                      position: 'absolute', inset: 0, pointerEvents: 'none',
                      background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,245,255,0.025) 3px, rgba(0,245,255,0.025) 4px)',
                    }} />
                  </div>

                  {/* Status + year */}
                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.15em', marginBottom: '2px' }}>STATUS</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_COLOR[project.status] || 'var(--muted)' }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text)' }}>{project.status}</span>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.15em', marginBottom: '2px' }}>YEAR</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text)' }}>{project.year}</div>
                    </div>
                  </div>

                  {/* Links */}
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-neon"
                        style={{ fontSize: '0.65rem', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <FaGithub size={12} /> SOURCE
                      </a>
                    )}
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noopener noreferrer" className="btn-neon btn-neon-mag"
                        style={{ fontSize: '0.65rem', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <FaExternalLinkAlt size={11} /> LIVE
                      </a>
                    )}
                  </div>
                </div>

                {/* Info panel */}
                <div>
                  <h2 style={{
                    fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800,
                    color: 'var(--text)', marginBottom: '0.75rem', letterSpacing: '0.02em',
                  }}>
                    {project.title}
                  </h2>

                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                    {project.longDescription || project.description}
                  </p>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                    {project.tags.map((tag) => <span key={tag} className="tag-pill">{tag}</span>)}
                  </div>

                  {/* Features */}
                  {project.features && (
                    <div>
                      <div style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--cyan)',
                        letterSpacing: '0.2em', marginBottom: '0.75rem',
                      }}>
                        // KEY FEATURES
                      </div>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {project.features.map((f, i) => (
                          <li key={i} style={{
                            display: 'flex', gap: '0.6rem',
                            fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                            color: 'var(--text)', lineHeight: 1.6,
                          }}>
                            <span style={{ color: 'var(--magenta)', flexShrink: 0 }}>▸</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <style>{`
            .pm-scroll::-webkit-scrollbar { width: 4px; }
            .pm-scroll::-webkit-scrollbar-track { background: transparent; }
            .pm-scroll::-webkit-scrollbar-thumb { background: var(--cyan); border-radius: 2px; }
            @media (max-width: 640px) {
              .pm-grid { grid-template-columns: 1fr !important; }
              .pm-backdrop { padding: 0.75rem !important; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
