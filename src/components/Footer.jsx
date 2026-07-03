export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: '1.5rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}
    >
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>
        <span style={{ color: 'var(--cyan)' }}>&gt;_</span> BUILT WITH REACT + VITE
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>
        © {new Date().getFullYear()} // ALL RIGHTS RESERVED
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>
        SYS:ONLINE <span style={{ color: 'var(--green)', animation: 'blink 1s step-start infinite' }}>●</span>
      </span>
    </footer>
  );
}
