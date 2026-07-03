import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import {
  SiJavascript, SiTypescript, SiPython, SiHtml5, SiSass,
  SiReact, SiNodedotjs, SiNextdotjs, SiTailwindcss, SiExpress,
  SiGit, SiDocker, SiVite, SiFigma, SiLinux,
  SiMongodb, SiPostgresql, SiRedis, SiFirebase,
} from 'react-icons/si';
import { skillCategories } from '../data/skills';

const ICON_MAP = {
  SiJavascript, SiTypescript, SiPython, SiHtml5, SiSass,
  SiReact, SiNodedotjs, SiNextdotjs, SiTailwindcss, SiExpress,
  SiGit, SiDocker, SiVite, SiFigma, SiLinux,
  SiMongodb, SiPostgresql, SiRedis, SiFirebase,
};

// Proficiency levels for each skill (0-100)
const PROFICIENCY = {
  JavaScript: 92, TypeScript: 85, Python: 80, HTML5: 95, Sass: 75,
  React: 90, 'Node.js': 85, 'Next.js': 78, Tailwind: 88, Express: 82,
  Git: 90, Docker: 72, Vite: 85, Figma: 65, Linux: 70,
  MongoDB: 75, PostgreSQL: 78, Redis: 68, Firebase: 72,
};

const LEVEL_LABEL = (n) => n >= 90 ? 'Expert' : n >= 75 ? 'Advanced' : n >= 60 ? 'Proficient' : 'Learning';
const LEVEL_COLOR = (n) => n >= 90 ? 'var(--cyan)' : n >= 75 ? 'var(--magenta)' : n >= 60 ? 'var(--yellow)' : 'var(--muted)';

function SkillRow({ skill }) {
  const Icon = ICON_MAP[skill.icon];
  const pct = PROFICIENCY[skill.name] ?? 70;

  return (
    <motion.div
      whileHover={{ scale: 1.02, x: 6 }}
      transition={{ type: 'spring', stiffness: 300 }}
      style={{
        display: 'grid',
        gridTemplateColumns: '2rem 1fr auto',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.85rem 1.25rem',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        cursor: 'default',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = skill.color;
        e.currentTarget.style.boxShadow = `0 0 10px ${skill.color}30`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Icon */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {Icon && <Icon size={22} style={{ color: skill.color, filter: `drop-shadow(0 0 3px ${skill.color}60)` }} />}
      </div>

      {/* Name + bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text)' }}>{skill.name}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: LEVEL_COLOR(pct) }}>{pct}%</span>
        </div>
        <div style={{ height: '3px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ height: '100%', background: `linear-gradient(90deg, ${skill.color}, ${skill.color}80)`, borderRadius: '2px' }}
          />
        </div>
      </div>

      {/* Level badge */}
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
        letterSpacing: '0.12em', color: LEVEL_COLOR(pct),
        border: `1px solid ${LEVEL_COLOR(pct)}`,
        padding: '2px 8px', whiteSpace: 'nowrap',
      }}>
        {LEVEL_LABEL(pct)}
      </span>
    </motion.div>
  );
}

export default function SkillsPage() {
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
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--cyan)', letterSpacing: '0.1em' }}>SKILLS</span>
      </div>

      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem 6rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: '4rem' }}>
          <p className="section-label" style={{ marginBottom: '0.5rem' }}>// 02. SKILLS</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900, color: 'var(--text)' }}>
            TECH <span style={{ color: 'var(--cyan)' }}>STACK</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.75rem', maxWidth: '500px', lineHeight: 1.7 }}>
            Tools and technologies I work with, grouped by domain with proficiency levels.
          </p>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', flexWrap: 'wrap' }}
        >
          {[['Expert', 'var(--cyan)', '90+'], ['Advanced', 'var(--magenta)', '75–89'], ['Proficient', 'var(--yellow)', '60–74']].map(([label, color, range]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.1em' }}>{label} ({range})</span>
            </div>
          ))}
        </motion.div>

        {/* Categories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {skillCategories.map((cat, ci) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + ci * 0.1 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.65rem', color: 'var(--magenta)', letterSpacing: '0.2em' }}>
                  {cat.label.toUpperCase()}
                </span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {cat.skills.map((skill) => (
                  <SkillRow key={skill.name} skill={skill} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
