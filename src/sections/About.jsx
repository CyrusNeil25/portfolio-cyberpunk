import { motion } from 'framer-motion';
import Avatar from '../components/Avatar';

const STATS = [
  { value: '3+',  label: 'Years Coding' },
  { value: '20+', label: 'Projects Built' },
  { value: '10+', label: 'Technologies' },
  { value: '∞',   label: 'Coffee Consumed' },
];

export default function About() {
  return (
    <section
      id="about"
      style={{
        padding: '6rem 2rem',
        maxWidth: '1100px',
        margin: '0 auto',
        position: 'relative',
      }}
    >
      <div className="cyber-divider" style={{ marginBottom: '4rem' }} />

      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="section-label" style={{ marginBottom: '0.5rem' }}>// 01. ABOUT ME</p>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
          fontWeight: 700,
          color: 'var(--text)',
          marginBottom: '3rem',
        }}>
          WHO AM I<span style={{ color: 'var(--cyan)' }}>?</span>
        </h2>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(220px, 320px) 1fr',
        gap: '4rem',
        alignItems: 'center',
      }}>
        {/* Avatar placeholder */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Avatar width={260} height={300} />
        </motion.div>

        {/* Bio text */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            lineHeight: 1.85,
            color: 'var(--text)',
            marginBottom: '1rem',
          }}>
            Hey, I'm <span style={{ color: 'var(--cyan)' }}>Cyrus Neil</span> — a passionate developer who lives at the intersection of code and creativity. I build things for the web, from sleek UIs to robust back-end systems.
          </p>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            lineHeight: 1.85,
            color: 'var(--muted)',
            marginBottom: '1rem',
          }}>
            When I'm not pushing commits, I'm exploring new technologies, grinding ranked matches, or listening to synthwave at 2 AM while debugging something that "shouldn't" be broken.
          </p>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            lineHeight: 1.85,
            color: 'var(--muted)',
          }}>
            I believe great software is both functional and beautiful — engineered with precision, designed with intent.
          </p>

          {/* Stats row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
            marginTop: '2.5rem',
          }}>
            {STATS.map((s) => (
              <div
                key={s.label}
                className="corner-bracket"
                style={{
                  padding: '0.75rem 0.5rem',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  textAlign: 'center',
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: 'var(--cyan)',
                  textShadow: '0 0 8px var(--cyan)',
                }}>
                  {s.value}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  color: 'var(--muted)',
                  letterSpacing: '0.1em',
                  marginTop: '0.25rem',
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #about > div + div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
