import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaGithub, FaExternalLinkAlt, FaStar } from 'react-icons/fa';
import { projects } from '../data/projects';
import ProjectModal from '../components/ProjectModal';

const EXTRA_DETAIL = {
  1: { role: 'Solo Developer', duration: '3 months', highlight: '1M+ users monitored', lines: '~12,000 LOC' },
  2: { role: 'Lead Dev', duration: '2 months', highlight: 'Zero-knowledge encryption', lines: '~8,500 LOC' },
  3: { role: 'Backend Architect', duration: '6 weeks', highlight: '99.9% uptime SLA', lines: '~5,200 LOC' },
  4: { role: 'Full Stack', duration: '1 month', highlight: 'P2P WebRTC mesh', lines: '~6,800 LOC' },
  5: { role: 'Solo Developer', duration: '3 weeks', highlight: 'Infinite procedural maps', lines: '~3,400 LOC' },
  6: { role: 'Tool Author', duration: '2 weeks', highlight: 'Processes 100k rows/sec', lines: '~2,100 LOC' },
};

function ProjectCard({ project, index, featured, onOpen }) {
  const extra = EXTRA_DETAIL[project.id];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ scale: 1.02, y: -4 }}
      onClick={() => onOpen(project)}
      style={{ transition: 'box-shadow 0.2s, border-color 0.2s', cursor: 'pointer' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = featured
          ? '0 0 24px rgba(0,245,255,0.18)'
          : '0 0 14px rgba(0,245,255,0.1)';
        e.currentTarget.style.borderColor = 'var(--cyan)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      <div
        className="corner-bracket"
        style={{
          background: 'var(--surface)',
          border: `1px solid ${featured ? 'rgba(0,245,255,0.3)' : 'var(--border)'}`,
          padding: featured ? '2rem' : '1.5rem',
          height: '100%',
          display: 'flex', flexDirection: 'column', gap: '1rem',
          position: 'relative',
        }}
      >
        {/* Featured badge */}
        {featured && (
          <div style={{
            position: 'absolute', top: '1rem', right: '1rem',
            display: 'flex', alignItems: 'center', gap: '4px',
            fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
            color: 'var(--yellow)', letterSpacing: '0.15em',
          }}>
            <FaStar size={9} /> FEATURED
          </div>
        )}

        {/* Card number */}
        {!featured && (
          <span style={{ position: 'absolute', top: '1rem', right: '1rem', fontFamily: 'var(--font-heading)', fontSize: '0.6rem', color: 'var(--muted)' }}>
            {String(index + 1).padStart(2, '0')}
          </span>
        )}

        {/* Title */}
        <h3 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: featured ? '1.1rem' : '0.95rem',
          fontWeight: 700, color: 'var(--text)',
          letterSpacing: '0.05em', paddingRight: '4rem',
        }}>
          {project.title}
        </h3>

        {/* Description */}
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.75, flex: 1 }}>
          {project.description}
        </p>

        {/* Extra detail row */}
        {extra && (
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {[['Role', extra.role], ['Time', extra.duration], ['Scale', extra.highlight]].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.15em', marginBottom: '2px' }}>{k}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text)' }}>{v}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {project.tags.map((tag) => (
            <span key={tag} className="tag-pill">{tag}</span>
          ))}
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--cyan)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted)'}>
              <FaGithub size={14} /> View Source
            </a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--magenta)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted)'}>
              <FaExternalLinkAlt size={12} /> Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsPage() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  const [selected, setSelected] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ minHeight: '100vh', paddingTop: '5rem' }}
    >
      {/* Breadcrumb */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 2rem 0', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', textDecoration: 'none', letterSpacing: '0.1em', transition: 'color 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--cyan)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted)'}>
          <FaArrowLeft size={10} /> HOME
        </Link>
        <span style={{ color: 'var(--border)' }}>/</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--cyan)', letterSpacing: '0.1em' }}>PROJECTS</span>
      </div>

      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem 6rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: '4rem' }}>
          <p className="section-label" style={{ marginBottom: '0.5rem' }}>// 03. PROJECTS</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900, color: 'var(--text)' }}>
            THINGS I'VE <span style={{ color: 'var(--cyan)' }}>BUILT</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.75rem', maxWidth: '520px', lineHeight: 1.7 }}>
            A selection of personal projects, experiments, and things I'm proud of shipping.
          </p>
        </motion.div>

        {/* Featured */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.65rem', color: 'var(--yellow)', letterSpacing: '0.2em' }}>★ FEATURED PROJECTS</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {featured.map((p, i) => <ProjectCard key={p.id} project={p} index={i} featured onOpen={setSelected} />)}
          </div>
        </div>

        {/* Other projects */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.2em' }}>OTHER PROJECTS</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {rest.map((p, i) => <ProjectCard key={p.id} project={p} index={i} onOpen={setSelected} />)}
          </div>
        </div>
      </section>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </motion.div>
  );
}
