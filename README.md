# portfolio-cyberpunk

> Enter the neon grid chooms. A cyberpunk-themed portfolio featuring my tech stack, projects, career experience, social links, and contact hub in an immersive digital universe.

## ✨ Features

- 🖥️ **Scrolling home page** — Hero (glitch artwork), About, Skills, Projects, Contact
- 📄 **Dedicated detail pages** — expanded About/Skills/Projects/Contact via hash routing
- 🎨 **Two switchable themes** — Cyber (cyan/magenta) & Nebula (purple/teal), persisted in localStorage
- 🗂️ **Terminal-style project modal** — click any project card for a boot-sequence readout
- 🤖 **UNIT-7 chatbot** — floating robot assistant with a Claude-powered brain (Vercel serverless backend), resume download & call-scheduling actions, and a graceful offline fallback
- 📱 Fully responsive, with scanlines, neon glows, and chromatic-aberration effects throughout

## 🛠️ Stack

React 19 · Vite · react-router (HashRouter) · Framer Motion · react-icons · Vercel Functions · Anthropic Claude API · GitHub Pages + Actions

## 🚀 Quick start

```bash
npm install
npm run dev        # → http://localhost:5173/portfolio-cyberpunk/
npm run build      # production build into dist/
```

Personal settings (name, email, avatar, chatbot URL, Calendly link) live in [`src/config.js`](src/config.js).
Portfolio content (projects, skills, socials) lives in [`src/data/`](src/data/).

## 📚 Documentation

Full, learning-oriented documentation with architecture diagrams lives in [`docs/`](docs/README.md):

1. [The Big Picture](docs/01-overview.md) — architecture, stack, repo map
2. [How the App Boots & Routes](docs/02-boot-and-routing.md) — HashRouter & the GitHub Pages problem
3. [Styling & Theming](docs/03-styling-and-theming.md) — CSS variables, themes, glitch/scanline effects
4. [Components, Sections & Data](docs/04-components-and-data.md) — the data-driven UI layer
5. [UNIT-7: The Chatbot](docs/05-chatbot.md) — full client → serverless → Claude pipeline
6. [Deployment](docs/06-deployment.md) — CI/CD, gotchas, go-live checklist
7. [React Concepts Used Here](docs/07-react-concepts.md) — every React idea, explained from this codebase

## 📦 Deployment

- **Site** → GitHub Pages, auto-deployed by [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) on every push
- **Chatbot backend** → Vercel (`api/chat.js`), API key kept server-side — see [docs/06-deployment.md](docs/06-deployment.md) for the go-live checklist
