import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaGithub, FaLinkedin, FaInstagram, FaReddit, FaDiscord, FaSteam, FaSpotify } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiPlaystation, SiMyanimelist } from 'react-icons/si';
import { MdEmail, MdSend } from 'react-icons/md';
import { socials } from '../data/socials';

const ICON_MAP = {
  FaGithub, FaLinkedin, FaXTwitter, FaInstagram, FaReddit,
  FaDiscord, FaSteam, FaSpotify, SiPlaystation, SiMyanimelist, MdEmail,
};

const HOVER_COLORS = {
  FaGithub: '#ffffff', FaLinkedin: '#0077b5', FaXTwitter: '#ffffff',
  FaInstagram: '#e1306c', FaReddit: '#ff4500', FaDiscord: '#5865f2',
  FaSteam: '#c6d4df',FaSpotify: '#1ED760', SiPlaystation: '#0072ce', SiMyanimelist: '#2e51a2', MdEmail: '#00f5ff',
};

function Field({ label, as: As = 'input', ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.15em', marginBottom: '0.4rem' }}>
        {label}
      </label>
      <As
        {...props}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        style={{
          width: '100%', background: 'var(--surface)',
          border: `1px solid ${focused ? 'var(--cyan)' : 'var(--border)'}`,
          boxShadow: focused ? '0 0 10px rgba(0,245,255,0.12)' : 'none',
          color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
          padding: '0.75rem 1rem', outline: 'none', resize: As === 'textarea' ? 'vertical' : undefined,
          minHeight: As === 'textarea' ? '130px' : undefined,
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Wire up to your backend / EmailJS / Formspree here
    setSent(true);
  };

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
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--cyan)', letterSpacing: '0.1em' }}>CONTACT</span>
      </div>

      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem 6rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: '4rem' }}>
          <p className="section-label" style={{ marginBottom: '0.5rem' }}>// 04. CONTACT</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900, color: 'var(--text)' }}>
            LET'S <span style={{ color: 'var(--cyan)' }}>CONNECT</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.75rem', maxWidth: '500px', lineHeight: 1.7 }}>
            Have a project in mind, want to collaborate, or just want to talk tech? Send a message or find me on any of the platforms below.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }} className="contact-grid">
          {/* Contact form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <p className="section-label" style={{ marginBottom: '1.5rem' }}>// SEND A MESSAGE</p>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="corner-bracket"
                style={{ padding: '2.5rem', border: '1px solid var(--cyan)', background: 'var(--surface)', textAlign: 'center' }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✓</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', color: 'var(--cyan)', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>MESSAGE SENT</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--muted)' }}>I'll get back to you soon.</div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row">
                  <Field label="// NAME" type="text" placeholder="Your Name" required value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <Field label="// EMAIL" type="email" placeholder="your@email.com" required value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <Field label="// SUBJECT" type="text" placeholder="What's it about?" value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                <Field label="// MESSAGE" as="textarea" placeholder="Tell me more..." required value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })} />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="btn-neon"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', alignSelf: 'flex-start', cursor: 'pointer' }}
                >
                  <MdSend size={14} /> SEND MESSAGE
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Social + info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <p className="section-label" style={{ marginBottom: '1.5rem' }}>// FIND ME ON</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '3rem' }}>
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
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + i * 0.04 }}
                    whileHover={{ scale: 1.08 }}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                      padding: '1rem 0.75rem', background: 'var(--surface2)',
                      border: '1px solid var(--border)', textDecoration: 'none',
                      transition: 'all 0.2s ease', color: 'var(--muted)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = hoverColor;
                      e.currentTarget.style.borderColor = hoverColor;
                      e.currentTarget.style.boxShadow = `0 0 14px ${hoverColor}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--muted)';
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {Icon && <Icon size={22} />}
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '0.1em' }}>
                      {social.name.split('/')[0].toUpperCase()}
                    </span>
                  </motion.a>
                );
              })}
            </div>

            {/* Quick info */}
            <div className="corner-bracket" style={{ padding: '1.5rem', border: '1px solid var(--border)', background: 'var(--surface)' }}>
              <p className="section-label" style={{ marginBottom: '1rem' }}>// QUICK INFO</p>
              {[
                ['Location', 'Earth, Solar System'],
                ['Availability', 'Open to opportunities'],
                ['Response time', 'Usually within 24h'],
                ['Email', 'your@email.com'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>{k}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text)' }}>{v}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  );
}
