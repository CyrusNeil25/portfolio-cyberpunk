// ─────────────────────────────────────────────
//  Personal portfolio config — edit here only.
// ─────────────────────────────────────────────

// Avatar: drop your image/gif into the public/ folder and set the filename here.
// Examples: '/avatar.jpg'  '/avatar.png'  '/avatar.gif'  '/me.webp'
// Set to null to keep the animated placeholder.
export const AVATAR_SRC = `${import.meta.env.BASE_URL}Apex.gif`;
console.log(AVATAR_SRC)

// Your display name shown in the About sections
export const YOUR_NAME = 'Cyrus Neil';

// Your email for the contact section
export const YOUR_EMAIL = 'TenkaixCyrus007@email.com';

// ── UNIT-7 chatbot backend ──
// Vercel deployment URL + /api/chat. Leave '' to run in offline mode
// (the bot falls back to its built-in keyword responses).
// Example: 'https://my-portfolio-bot.vercel.app/api/chat'
export const CHAT_API_URL = 'http://localhost:2512/portfolio-cyberpunk/api/chat';

// Calendly / Cal.com booking page — shown when the bot offers to schedule a call.
export const CALENDLY_URL = 'https://calendly.com/your-handle/intro-call';

// Resume file — drop Resume.pdf into public/ for the bot's download button.
export const RESUME_PATH = `${import.meta.env.BASE_URL}Resume.pdf`;
