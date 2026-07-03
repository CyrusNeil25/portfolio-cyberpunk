import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';
import { YOUR_NAME } from '../config';

// ─────────────────────────────────────────────────────────────
//  Mock response engine — replace this function with a real
//  backend call later (fetch to your API / LLM endpoint).
//  Keep the signature: async (userText) => string
// ─────────────────────────────────────────────────────────────
async function getBotReply(userText) {
  const t = userText.toLowerCase();

  // simulate network / thinking latency
  await new Promise((r) => setTimeout(r, 700 + Math.random() * 600));

  if (/\b(resume|cv)\b/.test(t)) {
    return `I can send over ${YOUR_NAME}'s resume. [RESUME.PDF] download coming soon — backend module not yet online.`;
  }
  if (/\b(schedule|call|meeting|interview)\b/.test(t)) {
    return 'Scheduling module detected in request. Calendar integration is coming soon — for now, drop a message via the Contact page and a human will respond within 24h.';
  }
  if (/\b(skill|stack|tech|language)\b/.test(t)) {
    return `${YOUR_NAME} runs on React, Node.js, TypeScript, Python and a healthy dose of caffeine. Full breakdown available in the SKILLS section.`;
  }
  if (/\b(project|work|built|portfolio)\b/.test(t)) {
    return 'Projects archive contains 6 records. Navigate to the PROJECTS section and click any card for a full terminal readout.';
  }
  if (/\b(contact|email|reach|hire)\b/.test(t)) {
    return 'You can reach the human via the CONTACT page — email, GitHub, LinkedIn and more are wired up there.';
  }
  if (/\b(hi|hello|hey|yo)\b/.test(t)) {
    return `Greetings, visitor. I'm UNIT-7, ${YOUR_NAME}'s pet assistant bot. Ask me about skills, projects, resume, or scheduling a call.`;
  }
  return 'Processing... query not recognized by my current firmware. Try asking about skills, projects, resume, or contact. Full AI core coming soon.';
}

const QUICK_ACTIONS = [
  { label: 'SKILLS?', text: 'What are your skills?' },
  { label: 'RESUME', text: 'Can I get your resume?' },
  { label: 'SCHEDULE CALL', text: 'I want to schedule a call' },
];

// ── Little robot face (SVG) used on the button and in the panel header ──
function RobotFace({ size = 34, blinking }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* antenna */}
      <line x1="20" y1="3" x2="20" y2="8" stroke="var(--cyan)" strokeWidth="1.5" />
      <circle cx="20" cy="3" r="2" fill="var(--magenta)">
        <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* head */}
      <rect x="7" y="8" width="26" height="22" rx="4" stroke="var(--cyan)" strokeWidth="1.5" fill="var(--surface)" />
      {/* eyes */}
      <rect x="13" y="15" width="5" height={blinking ? 1 : 6} rx="1" fill="var(--cyan)">
        <animate attributeName="height" values="6;6;1;6;6" keyTimes="0;0.45;0.5;0.55;1" dur="4s" repeatCount="indefinite" />
      </rect>
      <rect x="22" y="15" width="5" height={blinking ? 1 : 6} rx="1" fill="var(--cyan)">
        <animate attributeName="height" values="6;6;1;6;6" keyTimes="0;0.45;0.5;0.55;1" dur="4s" repeatCount="indefinite" />
      </rect>
      {/* mouth */}
      <path d="M14 25 h3 v1.5 h3 v-1.5 h3 v1.5 h3" stroke="var(--magenta)" strokeWidth="1.2" fill="none" />
      {/* ears */}
      <rect x="4" y="15" width="3" height="8" rx="1" fill="var(--border)" />
      <rect x="33" y="15" width="3" height="8" rx="1" fill="var(--border)" />
    </svg>
  );
}

function TypingDots() {
  return (
    <span style={{ display: 'inline-flex', gap: '4px', padding: '2px 0' }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          width: 5, height: 5, borderRadius: '50%', background: 'var(--cyan)',
          animation: `cb-dot 1s ease-in-out ${i * 0.18}s infinite`,
        }} />
      ))}
    </span>
  );
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: `UNIT-7 online. I'm ${YOUR_NAME}'s assistant. Ask me about skills, projects, or grab a resume.` },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [teaserVisible, setTeaserVisible] = useState(false);
  const [teaserDismissed, setTeaserDismissed] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to newest message
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing, open]);

  // Pop up an attention-grabbing teaser bubble a few seconds after load,
  // unless the user already opened the chat or dismissed it.
  useEffect(() => {
    if (open || teaserDismissed) return;
    const timer = setTimeout(() => setTeaserVisible(true), 2800);
    return () => clearTimeout(timer);
  }, [open, teaserDismissed]);

  // Hide the teaser as soon as the chat panel opens
  useEffect(() => {
    if (open) setTeaserVisible(false);
  }, [open]);

  const dismissTeaser = (e) => {
    e?.stopPropagation();
    setTeaserVisible(false);
    setTeaserDismissed(true);
  };

  const send = async (text) => {
    const clean = text.trim();
    if (!clean || typing) return;
    setInput('');
    setMessages((m) => [...m, { from: 'user', text: clean }]);
    setTyping(true);
    const reply = await getBotReply(clean);
    setTyping(false);
    setMessages((m) => [...m, { from: 'bot', text: reply }]);
  };

  return (
    <>
      {/* ── Attention-grabbing teaser bubble ── */}
      <AnimatePresence>
        {teaserVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10, x: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10, x: 10 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            className="cb-teaser"
            style={{
              position: 'fixed', bottom: '6.2rem', right: '1.5rem', zIndex: 1499,
              maxWidth: '220px',
              background: 'var(--surface)',
              border: '1px solid var(--cyan)',
              boxShadow: '0 0 16px rgba(0,245,255,0.2), 0 8px 24px rgba(0,0,0,0.4)',
              padding: '0.7rem 0.85rem',
              clipPath: 'polygon(10px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 10px)',
            }}
          >
            <button
              onClick={dismissTeaser}
              aria-label="Dismiss"
              style={{
                position: 'absolute', top: '3px', right: '3px',
                background: 'none', border: 'none', color: 'var(--muted)',
                cursor: 'pointer', padding: '4px', display: 'flex',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--magenta)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted)'}
            >
              <FaTimes size={9} />
            </button>
            <div
              onClick={() => setOpen(true)}
              style={{ cursor: 'pointer', paddingRight: '0.75rem' }}
            >
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                color: 'var(--cyan)', letterSpacing: '0.15em', marginBottom: '4px',
              }}>
                UNIT-7
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                color: 'var(--text)', lineHeight: 1.5,
              }}>
                👋 Got a question? I can talk projects, skills, or grab my resume.
              </div>
            </div>
            {/* speech-bubble tail pointing down to the robot button */}
            <div style={{
              position: 'absolute', bottom: '-7px', right: '22px',
              width: '12px', height: '12px',
              background: 'var(--surface)',
              borderRight: '1px solid var(--cyan)',
              borderBottom: '1px solid var(--cyan)',
              transform: 'rotate(45deg)',
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating toggle button ── */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close assistant' : 'Open assistant'}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 260 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="cb-float"
        style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 1500,
          width: '58px', height: '58px',
          background: 'var(--surface)',
          border: '1px solid var(--cyan)',
          boxShadow: '0 0 16px rgba(0,245,255,0.25)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          clipPath: 'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)',
        }}
      >
        {open ? <FaTimes size={18} style={{ color: 'var(--magenta)' }} /> : <RobotFace />}
      </motion.button>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="cb-panel"
            style={{
              position: 'fixed', bottom: '5.75rem', right: '1.5rem', zIndex: 1500,
              width: '340px', maxWidth: 'calc(100vw - 2rem)',
              height: '460px', maxHeight: 'calc(100vh - 8rem)',
              background: '#050a14',
              border: '1px solid var(--cyan)',
              boxShadow: '0 0 30px rgba(0,245,255,0.15), 0 16px 50px rgba(0,0,0,0.55)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              padding: '0.65rem 0.9rem',
              background: 'var(--surface)',
              borderBottom: '1px solid var(--border)',
              flexShrink: 0,
            }}>
              <RobotFace size={26} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.7rem', color: 'var(--text)', letterSpacing: '0.12em' }}>
                  UNIT-7
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 5px var(--green)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.1em' }}>
                    PET ASSISTANT // ONLINE
                  </span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="cb-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {messages.map((m, i) => (
                <div key={i} style={{
                  alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '0.55rem 0.75rem',
                  fontFamily: 'var(--font-mono)', fontSize: '0.74rem', lineHeight: 1.6,
                  background: m.from === 'user' ? 'rgba(0,245,255,0.08)' : 'var(--surface)',
                  border: `1px solid ${m.from === 'user' ? 'rgba(0,245,255,0.35)' : 'var(--border)'}`,
                  color: 'var(--text)',
                  clipPath: m.from === 'user'
                    ? 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)'
                    : 'polygon(0 0, 100% 0, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                }}>
                  {m.from === 'bot' && (
                    <span style={{ color: 'var(--cyan)', marginRight: '6px' }}>&gt;</span>
                  )}
                  {m.text}
                </div>
              ))}
              {typing && (
                <div style={{
                  alignSelf: 'flex-start', padding: '0.55rem 0.75rem',
                  background: 'var(--surface)', border: '1px solid var(--border)',
                }}>
                  <TypingDots />
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div style={{ display: 'flex', gap: '0.4rem', padding: '0 0.9rem 0.6rem', flexWrap: 'wrap', flexShrink: 0 }}>
              {QUICK_ACTIONS.map((qa) => (
                <button
                  key={qa.label}
                  onClick={() => send(qa.text)}
                  disabled={typing}
                  style={{
                    background: 'none', border: '1px solid var(--border)',
                    color: 'var(--muted)', fontFamily: 'var(--font-mono)',
                    fontSize: '0.55rem', letterSpacing: '0.12em',
                    padding: '3px 8px', cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--cyan)'; e.currentTarget.style.color = 'var(--cyan)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}
                >
                  {qa.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              style={{
                display: 'flex', gap: '0.5rem', padding: '0.65rem 0.9rem',
                borderTop: '1px solid var(--border)', background: 'var(--surface)', flexShrink: 0,
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="> type a query..."
                style={{
                  flex: 1, minWidth: 0, background: 'var(--bg)',
                  border: '1px solid var(--border)', outline: 'none',
                  color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: '0.74rem',
                  padding: '0.5rem 0.7rem',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--cyan)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
              />
              <button
                type="submit"
                aria-label="Send"
                disabled={typing}
                style={{
                  background: 'none', border: '1px solid var(--cyan)', color: 'var(--cyan)',
                  width: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: typing ? 'wait' : 'pointer', transition: 'all 0.2s', flexShrink: 0,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--cyan)'; e.currentTarget.style.color = 'var(--bg)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--cyan)'; }}
              >
                <FaPaperPlane size={12} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes cb-dot {
          0%, 100% { opacity: 0.25; transform: translateY(0); }
          50%       { opacity: 1;    transform: translateY(-3px); }
        }
        .cb-scroll::-webkit-scrollbar { width: 3px; }
        .cb-scroll::-webkit-scrollbar-track { background: transparent; }
        .cb-scroll::-webkit-scrollbar-thumb { background: var(--cyan); }
        @media (max-width: 480px) {
          .cb-panel { right: 1rem !important; bottom: 5.25rem !important; height: 70vh !important; }
          .cb-float { right: 1rem !important; bottom: 1rem !important; }
        }
      `}</style>
    </>
  );
}
