// ─────────────────────────────────────────────────────────────
//  UNIT-7 chat backend — Vercel serverless function.
//  POST /api/chat  { messages: [{role:'user'|'assistant', text}] }
//  → { reply: string, actions: [{type:'resume'|'schedule'}] }
//
//  Env vars (set in Vercel project settings):
//    ANTHROPIC_API_KEY  (required)
//    CHAT_MODEL         (optional, default claude-haiku-4-5)
// ─────────────────────────────────────────────────────────────
import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from './_lib/persona.js';

// Origins allowed to call this API. Frontend now lives on Vercel too (same
// origin as this function), but browsers still send an Origin header on
// same-origin POST requests, so the production domain(s) must be listed here.
const ALLOWED_ORIGINS = [
  'https://portfolio-cyrus.vercel.app',
  'https://portfolio-cyrus-tenkai-dojo.vercel.app',
  'https://cyrusneil25.github.io',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:2512',
  'http://localhost:3000',
  'http://localhost:3001',
];

// Request caps
const MAX_HISTORY = 8;        // turns sent to the model
const MAX_MSG_CHARS = 500;    // per message
const RATE_PER_MIN = 10;      // per IP
const RATE_PER_DAY = 60;      // per IP (per warm instance — best effort)

// In-memory rate limiter. Resets when the lambda instance recycles —
// good enough at portfolio traffic; swap for Upstash Redis if it ever matters.
const hits = new Map(); // ip -> { minute: [ts...], day: [ts...] }

function rateLimited(ip) {
  const now = Date.now();
  const rec = hits.get(ip) || { stamps: [] };
  rec.stamps = rec.stamps.filter((t) => now - t < 24 * 60 * 60 * 1000);
  const lastMinute = rec.stamps.filter((t) => now - t < 60 * 1000);
  if (lastMinute.length >= RATE_PER_MIN || rec.stamps.length >= RATE_PER_DAY) {
    return true;
  }
  rec.stamps.push(now);
  hits.set(ip, rec);
  return false;
}

function setCors(res, origin) {
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');
}

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const allowed = ALLOWED_ORIGINS.includes(origin);

  if (req.method === 'OPTIONS') {
    if (!allowed) return res.status(403).end();
    setCors(res, origin);
    return res.status(204).end();
  }

  if (!allowed) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }
  setCors(res, origin);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limit by IP
  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown';
  if (rateLimited(ip)) {
    return res.status(429).json({
      reply: '// RATE LIMIT: my circuits need a breather. Try again in a minute.',
      actions: [],
    });
  }

  // Validate body
  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array required' });
  }
  const history = messages.slice(-MAX_HISTORY);
  for (const m of history) {
    if (
      !m ||
      (m.role !== 'user' && m.role !== 'assistant') ||
      typeof m.text !== 'string' ||
      m.text.length === 0 ||
      m.text.length > MAX_MSG_CHARS
    ) {
      return res.status(400).json({ error: 'invalid message format' });
    }
  }
  if (history[history.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'last message must be from user' });
  }

  // Map to Anthropic format. First message must be 'user' — drop any
  // leading assistant greeting the frontend may have included.
  const firstUser = history.findIndex((m) => m.role === 'user');
  const apiMessages = history
    .slice(firstUser)
    .map((m) => ({ role: m.role, content: m.text }));

  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: process.env.CHAT_MODEL || 'claude-haiku-4-5',
      max_tokens: 512,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: apiMessages,
    });

    let reply = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim();

    // Extract action markers into structured actions
    const actions = [];
    if (reply.includes('[[RESUME]]')) actions.push({ type: 'resume' });
    if (reply.includes('[[SCHEDULE]]')) actions.push({ type: 'schedule' });
    reply = reply.replace(/\[\[(RESUME|SCHEDULE)\]\]/g, '').trim();

    if (!reply) {
      reply = '// SIGNAL LOST: response buffer came back empty. Try rephrasing?';
    }

    return res.status(200).json({ reply, actions });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return res.status(429).json({
        reply: '// SYSTEMS OVERLOADED: too much traffic on the uplink. Try again shortly.',
        actions: [],
      });
    }
    if (err instanceof Anthropic.APIError) {
      console.error('Anthropic API error:', err.status, err.message);
    } else {
      console.error('Chat handler error:', err);
    }
    return res.status(502).json({
      reply: '// CORE MALFUNCTION: my AI brain is offline. The Contact page still works!',
      actions: [],
    });
  }
}
