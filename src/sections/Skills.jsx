import { motion } from 'framer-motion';
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

function SkillCard({ skill, index }) {
  const Icon = ICON_MAP[skill.icon];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '1rem 0.75rem',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        cursor: 'default',
        transition: 'all 0.2s',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--cyan)';
        e.currentTarget.style.boxShadow = '0 0 12px rgba(0,245,255,0.15)';
        e.currentTarget.style.background = 'var(--surface2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.background = 'var(--surface)';
      }}
    >
      {Icon && (
        <Icon
          className="skill-icon"
          size={32}
          style={{ color: skill.color, filter: `drop-shadow(0 0 4px ${skill.color}40)` }}
        />
      )}
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
        color: 'var(--muted)',
        letterSpacing: '0.08em',
        textAlign: 'center',
      }}>
        {skill.name}
      </span>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section
      id="skills"
      style={{
        padding: '6rem 2rem',
        background: 'var(--surface)',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div className="cyber-divider" style={{ marginBottom: '4rem' }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="section-label" style={{ marginBottom: '0.5rem' }}>// 02. SKILLS</p>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            fontWeight: 700,
            color: 'var(--text)',
            marginBottom: '3rem',
          }}>
            TECH <span style={{ color: 'var(--cyan)' }}>STACK</span>
          </h2>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {skillCategories.map((cat) => (
            <div key={cat.label}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1rem',
              }}>
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.65rem',
                  color: 'var(--magenta)',
                  letterSpacing: '0.2em',
                }}>
                  {cat.label.toUpperCase()}
                </span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
                gap: '0.75rem',
              }}>
                {cat.skills.map((skill, i) => (
                  <SkillCard key={skill.name} skill={skill} index={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
