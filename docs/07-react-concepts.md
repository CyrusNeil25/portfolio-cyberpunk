# Chapter 7 — React Concepts Used Here

A field guide to every React idea in this codebase — each explained with the *actual place it's used*, so you can open the file and see it live. Read this first if React is new to you; use it as a lookup table otherwise.

---

## 1. Components — functions that return UI

A component is a JavaScript function returning JSX (HTML-looking syntax). The whole app is a tree of them.

```jsx
// simplest real example: src/components/Footer.jsx
export default function Footer() {
  return <footer>...</footer>;
}
```

**See it:** every file in `components/`, `sections/`, `pages/`.
**Key habit:** if UI repeats (project cards, skill chips, message bubbles), extract a component or `.map()` over data.

## 2. JSX — JavaScript in disguise

JSX compiles to function calls; that's why:
- `className` not `class` (JS keyword collision)
- `style={{ color: 'red' }}` — outer braces = "JS expression here", inner braces = an object
- `{condition && <Thing/>}` renders `<Thing/>` only when true — used everywhere (e.g. `{glitching && <img .../>}` in the Hero)
- `{items.map(item => <Card key={item.id} .../>)}` turns data arrays into UI lists — `key` lets React track which item is which when the list changes

## 3. Props — arguments for components

Data flows **down** the tree, parent → child:

```jsx
// App.jsx (parent, owns the data)
<Navbar theme={theme} onThemeToggle={toggle} />

// Navbar.jsx (child, receives it)
export default function Navbar({ theme, onThemeToggle }) { ... }
```

Events flow **up** by passing functions as props: Navbar can't change `theme` itself — it calls `onThemeToggle()`, which runs in App. This "data down, callbacks up" is the core wiring pattern of React.

**See it:** `ProjectModal({ project, onClose })`, `Avatar({ width, height })`, `ProjectCard({ project, index, featured, onOpen })`.

## 4. `useState` — memory that triggers re-rendering

```jsx
const [open, setOpen] = useState(false);
//     ↑ current value  ↑ change it (and re-render)  ↑ initial value
```

A regular variable would reset on every render and changing it wouldn't update the screen. State persists across renders, and calling the setter is what tells React "repaint".

Two variants used here:

```jsx
// Lazy init — runs only once (reads localStorage on first render only)
useState(() => localStorage.getItem('portfolio-theme') || 'cyber')

// Functional update — safe when new value depends on old
setMessages((m) => [...m, newMessage])   // ChatBot appends to the transcript
setTheme((t) => (t === 'cyber' ? 'nebula' : 'cyber'))
```

**Important:** state is **immutable** — never `messages.push(x)`; always create a new array (`[...m, x]`). React detects changes by comparing references.

**See it:** `ChatBot.jsx` (7 state variables), `useTheme.js`, `ProjectsPage.jsx` (`selected`), `Navbar.jsx` (`scrolled`, `menuOpen`).

## 5. `useEffect` — side effects & the outside world

Rendering must be pure (same props/state → same JSX). Everything else — timers, event listeners, `document.*`, `localStorage`, fetch-on-mount — goes in an effect:

```jsx
useEffect(() => {
  const onScroll = () => setScrolled(window.scrollY > 40);
  window.addEventListener('scroll', onScroll);        // ① the effect
  return () => window.removeEventListener('scroll', onScroll);  // ② the CLEANUP
}, []);                                               // ③ dependency array
```

The dependency array controls *when* it runs:

| Array | Runs | Example in this repo |
|---|---|---|
| `[]` | once on mount | scroll listener (Navbar), glitch-burst timer (Hero) |
| `[theme]` | on mount + whenever `theme` changes | writing `data-theme` to `<html>` (useTheme) |
| `[messages, typing]` | whenever either changes | auto-scroll chat to newest message |

The **cleanup function** (the `return`) runs before the effect re-runs and on unmount. Skip it and you leak listeners/timers — the ProjectModal's Escape-key listener and body-scroll lock both clean up after themselves; that's why opening/closing the modal 50 times doesn't register 50 keyboard listeners.

## 6. `useRef` — a box that doesn't re-render

```jsx
const scrollRef = useRef(null);
<div ref={scrollRef} ...>            // React puts the real DOM node in scrollRef.current
scrollRef.current?.scrollTo(...)     // imperative DOM access when you need it
```

Unlike state, changing `.current` does **not** re-render. Used in `ChatBot.jsx` to scroll the message list — a rare "escape hatch" into the raw DOM.

## 7. Custom hooks — packaged, reusable logic

Any function named `use*` that calls other hooks. `src/hooks/useTheme.js` bundles state + localStorage + DOM attribute into a one-liner for consumers:

```jsx
const { theme, toggle } = useTheme();
```

If another component ever needs theme info, it calls the same hook — no duplication.

## 8. Lifting state up

When two components need the same state, move it to their closest common parent. The project modal is the textbook case: the *card grid* sets `selected`, the *modal* reads it — so the state lives in the shared parent (`ProjectsPage`). See Chapter 4.

## 9. Conditional & fallback rendering

```jsx
{open ? <FaTimes/> : <RobotFace/>}          // either/or (ChatBot button)
{teaserVisible && <motion.div .../>}         // render-if (teaser bubble)
{project.image ? <img .../> : <Placeholder/>}  // data-driven fallback (modal)
```

Combined with error states (`imgError` in Avatar, try/catch → mock reply in ChatBot), this is how the site *degrades gracefully* instead of crashing.

## 10. Controlled inputs

```jsx
<input value={input} onChange={(e) => setInput(e.target.value)} />
```

The input's value *is* React state — the DOM never owns it. That's why `send()` can clear the box with `setInput('')` and quick-action chips can submit text the user never typed. See `ChatBot.jsx` and `ContactPage.jsx` (a whole form object in one state).

## 11. Async + state — the typing-dots pattern

```jsx
const send = async (text) => {
  setMessages(h => [...h, userMsg]);   // 1. optimistic UI: show user's msg now
  setTyping(true);                     // 2. loading state
  const { reply, actions } = await getBotReply(history);   // 3. await the slow thing
  setTyping(false);                    // 4. clear loading
  setMessages(m => [...m, botMsg]);    // 5. show result
};
```

This five-beat rhythm (optimistic update → loading flag → await → clear flag → result) is *the* standard pattern for any UI that talks to a network. Once you can write this from memory, you can build most interactive features.

## 12. Ecosystem pieces (not React itself, but everywhere here)

| Library | Concept | Where |
|---|---|---|
| react-router | `<Link>`, `<Routes>`, `useLocation()` — URL ↔ component mapping | Chapter 2 |
| Framer Motion | `motion.div`, `initial/animate/exit`, `whileHover`, `AnimatePresence` | Chapter 4 |
| react-icons | icon components, tree-shaking, the `ICON_MAP` string→component pattern | Chapter 4 |
| Vite | `import.meta.env.BASE_URL`, dev server vs `build` | Chapters 2 & 6 |

---

## Suggested exercises (in build-together mode)

Now that you've read this — small, real features you could write yourself in this codebase, roughly in difficulty order:

1. **Add a new quick-action chip** to UNIT-7 (`QUICK_ACTIONS` array) — data-only change
2. **Add a 7th project** to `data/projects.js` and watch it appear in three places
3. **"Copy email" button** on the Contact page — `useState` for "Copied!" feedback + `navigator.clipboard.writeText` in a click handler
4. **Close the mobile nav menu when a link is clicked** — trace how `menuOpen` works, add the setter call
5. **A third theme** — new `[data-theme="..."]` block in `index.css` + turn the toggle into a cycle
6. **"Clear chat" button** in UNIT-7's header — reset `messages` to the greeting (careful: what should happen to `typing`?)

Each exercises exactly one or two concepts from this chapter. When you attempt one, share the diff and I'll review it.
