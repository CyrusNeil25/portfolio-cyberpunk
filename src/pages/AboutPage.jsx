import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaDownload } from 'react-icons/fa';
import Avatar from '../components/Avatar';

const STATS = [
  { value: '3+',  label: 'Years Coding' },
  { value: '20+', label: 'Projects Built' },
  { value: '10+', label: 'Technologies' },
  { value: '∞',   label: 'Coffee Consumed' },
];

const TIMELINE = [
  {
    year: '2024',
    role: 'Senior Developer',
    company: 'Tech Corp',
    desc: 'Led architecture of a distributed microservices platform serving 1M+ users. Reduced latency by 40% through caching strategy redesign.',
    color: 'var(--cyan)',
  },
  {
    year: '2023',
    role: 'Full Stack Developer',
    company: 'StartupXYZ',
    desc: 'Built and shipped 3 production products from scratch. Owned the entire stack — React frontend, Node.js API, PostgreSQL.',
    color: 'var(--magenta)',
  },
  {
    year: '2022',
    role: 'Frontend Engineer',
    company: 'Agency Co.',
    desc: 'Delivered pixel-perfect UIs for clients across fintech and e-commerce verticals. Introduced component library that cut delivery time by 30%.',
    color: 'var(--yellow)',
  },
  {
    year: '2021',
    role: 'CS Graduate',
    company: 'University',
    desc: 'Graduated with honours. Thesis on distributed consensus algorithms. Built a real-time collaborative editor as final year project.',
    color: 'var(--cyan)',
  },
];

const INTERESTS = [
  { icon: '🎮', label: 'Gaming', detail: 'Ranked competitor in FPS & strategy titles' },
  { icon: '🎵', label: 'Synthwave', detail: 'Debugging soundtrack since 2019' },
  { icon: '🤖', label: 'AI / ML', detail: 'Tinkering with LLMs & generative models' },
  { icon: '🌐', label: 'Open Source', detail: 'Contributor to 5+ public repos' },
  { icon: '📚', label: 'Reading', detail: 'Sci-fi, tech papers, system design books' },
  { icon: '☕', label: 'Coffee', detail: 'Fuel for late-night deploys' },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

export default function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ minHeight: '100vh', paddingTop: '5rem' }}
    >
      {/* Page header */}
      <div style={{
        maxWidth: '1100px', margin: '0 auto',
        padding: '2rem 2rem 0',
        display: 'flex', alignItems: 'center', gap: '1.5rem',
      }}>
        <Link
          to="/"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
            color: 'var(--muted)', textDecoration: 'none',
            letterSpacing: '0.1em', transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--cyan)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted)'}
        >
          <FaArrowLeft size={10} /> HOME
        </Link>
        <span style={{ color: 'var(--border)' }}>/</span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
          color: 'var(--cyan)', letterSpacing: '0.1em',
        }}>ABOUT</span>
      </div>

      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem 6rem' }}>

        {/* Heading */}
        <motion.div {...fadeUp(0.1)} style={{ marginBottom: '4rem' }}>
          <p className="section-label" style={{ marginBottom: '0.5rem' }}>// 01. ABOUT ME</p>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 900, color: 'var(--text)',
          }}>
            WHO AM I<span style={{ color: 'var(--cyan)' }}>?</span>
          </h1>
        </motion.div>

        {/* Bio + avatar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(220px, 300px) 1fr',
          gap: '4rem', alignItems: 'start', marginBottom: '5rem',
        }} className="about-grid">
          {/* Avatar */}
          <motion.div {...fadeUp(0.2)} style={{ display: 'flex', justifyContent: 'center' }}>
            <motion.div whileHover={{ scale: 1.04 }} transition={{ type: 'spring', stiffness: 260 }}>
              <Avatar width={260} height={300} />
            </motion.div>
          </motion.div>

          {/* Bio text */}
          <motion.div {...fadeUp(0.3)}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem', lineHeight: 1.9, color: 'var(--text)', marginBottom: '1.25rem' }}>
              Hey, I'm <span style={{ color: 'var(--cyan)' }}>Cyrus Neil</span> — a developer who lives at the intersection of code and creativity. I build things for the web, from sleek UIs to robust back-end systems and cloud infrastructure.
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem', lineHeight: 1.9, color: 'var(--muted)', marginBottom: '1.25rem' }}>
              My approach is simple: engineer with precision, design with intent. I believe the best software is invisible to the user — it just works, beautifully.
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem', lineHeight: 1.9, color: 'var(--muted)', marginBottom: '2rem' }}>
              When I'm not pushing commits, I'm exploring new AI tools, grinding ranked matches, or listening to synthwave at 2 AM while debugging something that "shouldn't" be broken.
            </p>
            <motion.a
              href="#"
              whileHover={{ scale: 1.04 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="btn-neon"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}
            >
              <FaDownload size={12} /> DOWNLOAD RESUME
            </motion.a>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div {...fadeUp(0.35)} style={{ marginBottom: '5rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
          }}>
            {STATS.map((s) => (
              <motion.div
                key={s.label}
                whileHover={{ scale: 1.06, borderColor: 'var(--cyan)', boxShadow: '0 0 16px rgba(0,245,255,0.2)' }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="corner-bracket"
                style={{
                  padding: '1.5rem 1rem', border: '1px solid var(--border)',
                  background: 'var(--surface)', textAlign: 'center', cursor: 'default',
                }}
              >
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: 'var(--cyan)', textShadow: '0 0 8px var(--cyan)' }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.1em', marginTop: '0.4rem' }}>
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div {...fadeUp(0.4)} style={{ marginBottom: '5rem' }}>
          <p className="section-label" style={{ marginBottom: '2rem' }}>// EXPERIENCE TIMELINE</p>
          <div style={{ position: 'relative', paddingLeft: '2rem' }}>
            {/* Vertical line */}
            <div style={{ position: 'absolute', left: '6px', top: 0, bottom: 0, width: '1px', background: 'var(--border)' }} />
            {TIMELINE.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                style={{ position: 'relative', marginBottom: '2.5rem' }}
              >
                {/* Dot */}
                <div style={{
                  position: 'absolute', left: '-2rem', top: '4px',
                  width: '12px', height: '12px', borderRadius: '50%',
                  background: item.color, boxShadow: `0 0 8px ${item.color}`,
                  border: '2px solid var(--bg)',
                }} />
                <motion.div
                  whileHover={{ scale: 1.02, x: 6 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="corner-bracket"
                  style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    padding: '1.25rem 1.5rem', cursor: 'default',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.65rem', color: item.color, letterSpacing: '0.2em' }}>{item.year}</span>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>{item.role}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>@ {item.company}</span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.75 }}>{item.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Interests */}
        <motion.div {...fadeUp(0.5)}>
          <p className="section-label" style={{ marginBottom: '2rem' }}>// WHEN I'M NOT CODING</p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '1rem',
          }}>
            {INTERESTS.map((item) => (
              <motion.div
                key={item.label}
                whileHover={{ scale: 1.06, borderColor: 'var(--cyan)', boxShadow: '0 0 12px rgba(0,245,255,0.15)' }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{
                  padding: '1.25rem 1rem',
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  cursor: 'default',
                }}
              >
                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', color: 'var(--text)', marginBottom: '0.25rem', letterSpacing: '0.08em' }}>{item.label}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.5 }}>{item.detail}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  );
}
