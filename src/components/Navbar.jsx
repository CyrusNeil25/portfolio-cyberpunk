import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'HOME',     to: '/' },
  { label: 'ABOUT',    to: '/about' },
  { label: 'SKILLS',   to: '/skills' },
  { label: 'PROJECTS', to: '/projects' },
  { label: 'CONTACT',  to: '/contact' },
];

export default function Navbar({ theme = 'cyber', onThemeToggle }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Determine active route — exact match for home, startsWith for others
  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const linkStyle = (to) => ({
    fontFamily: 'var(--font-heading)',
    fontSize: '0.65rem',
    letterSpacing: '0.2em',
    textDecoration: 'none',
    color: isActive(to) ? 'var(--cyan)' : 'var(--muted)',
    textShadow: isActive(to) ? '0 0 8px var(--cyan)' : 'none',
    transition: 'all 0.2s',
    paddingBottom: '2px',
    borderBottom: isActive(to) ? '1px solid var(--cyan)' : '1px solid transparent',
  });

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(3,7,18,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,245,255,0.15)' : '1px solid transparent',
        padding: '1rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}
    >
      {/* Logo — always goes home */}
      <Link
        to="/"
        style={{
          fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700,
          color: 'var(--cyan)', textDecoration: 'none', letterSpacing: '0.1em',
          textShadow: '0 0 8px var(--cyan)',
        }}
      >
        &lt;DEV/&gt;
      </Link>

      {/* Desktop nav */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="desktop-nav">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={linkStyle(link.to)}
            onMouseEnter={(e) => { if (!isActive(link.to)) e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={(e) => { if (!isActive(link.to)) e.currentTarget.style.color = 'var(--muted)'; }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Theme toggle */}
      <button
        onClick={onThemeToggle}
        title={`Switch to ${theme === 'cyber' ? 'Nebula' : 'Cyber'} theme`}
        style={{
          background: 'none',
          border: '1px solid var(--cyan)',
          color: 'var(--cyan)',
          padding: '4px 10px',
          cursor: 'pointer',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          letterSpacing: '0.15em',
          transition: 'all 0.2s',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--cyan)';
          e.currentTarget.style.color = 'var(--bg)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'none';
          e.currentTarget.style.color = 'var(--cyan)';
        }}
      >
        {theme === 'cyber' ? '⬡ NEBULA' : '⬡ CYBER'}
      </button>

      {/* Hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: 'none', background: 'none', border: '1px solid var(--cyan)',
          color: 'var(--cyan)', padding: '4px 8px', cursor: 'pointer',
          fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
        }}
        className="hamburger"
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'rgba(3,7,18,0.97)', borderBottom: '1px solid var(--cyan)',
          padding: '1rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem',
        }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                fontFamily: 'var(--font-heading)', fontSize: '0.75rem',
                letterSpacing: '0.2em', textDecoration: 'none',
                color: isActive(link.to) ? 'var(--cyan)' : 'var(--text)',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
