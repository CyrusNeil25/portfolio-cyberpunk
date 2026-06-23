import { motion } from 'framer-motion';
import {
  FaGithub, FaLinkedin, FaInstagram, FaReddit, FaDiscord, FaSteam, FaSpotify
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiPlaystation, SiMyanimelist } from 'react-icons/si';
import { MdEmail } from 'react-icons/md';
import { socials } from '../data/socials';

const ICON_MAP = {
  FaGithub, FaLinkedin, FaXTwitter, FaInstagram, FaReddit,
  FaDiscord, FaSteam, FaSpotify, SiPlaystation, SiMyanimelist, MdEmail,
};

const HOVER_COLORS = {
  FaGithub:    '#ffffff',
  FaLinkedin:  '#0077b5',
  FaXTwitter:  '#ffffff',
  FaInstagram: '#e1306c',
  FaReddit:    '#ff4500',
  FaDiscord:   '#5865f2',
  FaSteam:     '#c6d4df',
  FaSpotify:   '#1ED760',
  SiPlaystation: '#003087',
  SiMyanimelist: '#2e51a2',
  MdEmail:     '#00f5ff',
};

export default function Contact() {
  return (
    <section
      id="contact"
      style={{
        padding: '6rem 2rem',
        background: 'var(--surface)',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div className="cyber-divider" style={{ marginBottom: '4rem' }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="section-label" style={{ marginBottom: '0.5rem' }}>// 04. CONTACT</p>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            fontWeight: 700,
            color: 'var(--text)',
            marginBottom: '1rem',
          }}>
            LET'S <span style={{ color: 'var(--cyan)' }}>CONNECT</span>
          </h2>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: 'var(--muted)',
            lineHeight: 1.8,
            maxWidth: '500px',
            margin: '0 auto 3rem',
          }}>
            Whether you have a project in mind, want to collaborate, or just want to talk tech — my inbox is always open.
          </p>
        </motion.div>

        {/* Email CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: '3.5rem' }}
        >
          <a
            href="mailto:your@email.com"
            className="btn-neon"
            style={{ fontSize: '0.8rem', padding: '0.8rem 2.5rem' }}
          >
            SEND MESSAGE
          </a>
        </motion.div>

        {/* Social icons grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--muted)',
            letterSpacing: '0.25em',
            marginBottom: '1.5rem',
          }}>
            // FIND ME ON
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem',
          }}>
            {socials.map((social, i) => {
              const Icon = ICON_MAP[social.icon];
              const hoverColor = HOVER_COLORS[social.icon] || 'var(--cyan)';
              return (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target={social.href !== '#' && !social.href.startsWith('mailto') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  title={social.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '1rem',
                    background: 'var(--surface2)',
                    border: '1px solid var(--border)',
                    textDecoration: 'none',
                    transition: 'all 0.25s ease',
                    color: 'var(--muted)',
                    minWidth: '72px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = hoverColor;
                    e.currentTarget.style.borderColor = hoverColor;
                    e.currentTarget.style.boxShadow = `0 0 12px ${hoverColor}40`;
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--muted)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {Icon && <Icon size={24} />}
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.55rem',
                    letterSpacing: '0.1em',
                  }}>
                    {social.name.split('/')[0].toUpperCase()}
                  </span>
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
