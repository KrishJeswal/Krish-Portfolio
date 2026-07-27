# Krish Portfolio

A single-page, scroll-driven personal site built from scratch — **no UI library, no CSS framework, no design system off the shelf**. React 19 + TypeScript coordinate a WebGL particle field, a GSAP scroll engine, and a hand-authored monochrome CSS system.

**Live → [krish-jeswal.web.app](https://krish-jeswal.web.app)**

```
React 19 · TypeScript (strict) · Vite 6 · Three.js + raw GLSL · GSAP 3 · CSS custom properties · Firebase Hosting
```

---

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Design system](#design-system)
- [Implementation highlights](#implementation-highlights)
- [Accessibility](#accessibility)
- [Performance](#performance)
- [Getting started](#getting-started)
- [Deployment](#deployment)
- [Roadmap](#roadmap)

---

## Overview

The site presents its content as an instrument readout. The concept — *"recovering the signal"* — runs through the vocabulary and the visuals: sections are **channels**, projects are **captures**, the cursor is a **scope crosshair**, and the preloader **acquires signal** before the page resolves.

Five sections, each with a channel name and a tagline:

| `id` | Channel | Tagline | Component |
|---|---|---|---|
| `#thesis` | Thesis | Signal from noise | `About.tsx` |
| `#captures` | Captures | Recovered work | `Projects.tsx` |
| `#stack` | Stack | The instrument | `TechStack.tsx` |
| `#log` | Log | Chronology | `Timeline.tsx` |
| `#contact` | Contact | Open a channel | `Contact.tsx` |

It's a fully static client-rendered SPA. The only network dependency at runtime is Formspree for the contact form.

## Features

- **WebGL hero** — a 6,500-point Fibonacci sphere displaced by a custom two-octave simplex-noise vertex shader, reactive to cursor position and scroll depth, inside a slowly counter-rotating wireframe cage.
- **Inertial scroll** — GSAP ScrollSmoother with `data-speed` parallax, giving the page a weighted, lerped scroll feel.
- **Scroll-scrubbed reveals** — the thesis statement writes itself word-by-word as you scroll; the timeline spine fills; entries slide in and light their nodes.
- **Scramble-text decoding** — the preloader and the stack pills resolve out of a custom noise alphabet (`01░▒▓<>/\|-_=+#$%&*▮▯╌╍AESKJ`).
- **Custom scope cursor** — eased crosshair hairlines plus four corner lock brackets that snap over interactive targets.
- **Bento project grid** — a 20-column asymmetric grid (11/9/9/11 spans) where each card carries a hand-drawn inline-SVG instrument figure that animates on hover.
- **Clip-path preloader** — an oscilloscope waveform stroke-draws, a counter runs `000 → 100`, then the overlay wipes and unmounts itself from the DOM.
- **Live IST clock** in the footer, plus a giant text-stroke click-to-top control.
- **Reduced-motion parity** — every animated subsystem has a static, fully readable fallback.

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| **UI runtime** | React 19 | Component model and lifecycle coordination. React owns the DOM *structure*; GSAP and Three.js own the animation and pixels. After first paint there is almost no re-rendering — state is limited to `loaded`, `open`, `active`, `status`, `time`. |
| **Language** | TypeScript 5.8, `strict` | `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`. Content is modeled with explicit types (`Layer`, `Project`, `TimelineEntry`) so data and rendering can't drift. |
| **Build** | Vite 6 + `@vitejs/plugin-react` | Instant HMR matters when tuning shader uniforms and animation timings. Production build is Rollup. Config is deliberately minimal — React plugin plus a `PORT`-overridable dev port. |
| **3D / GPU** | Three.js 0.178 + raw GLSL | Three.js handles the scene graph, camera, and render loop; a `ShaderMaterial` drops straight down to hand-written GLSL for the actual effect. |
| **Animation** | GSAP 3.13 + `@gsap/react` | Timeline choreography, scroll-scrubbing, and text plugins that CSS animations and WAAPI can't express cleanly. |
| **Styling** | Plain CSS + custom properties | ~1,400 lines of `global.css`. Zero runtime cost, one source of truth, total control over a bespoke aesthetic. |
| **Hosting** | Firebase Hosting | Static CDN with an SPA rewrite (`** → /index.html`). No server-side logic anywhere. |
| **Forms** | Formspree | Browser-to-email relay, so the site stays fully static. |

**GSAP plugins in use** (registered once in `src/lib/gsap.ts`):

- `ScrollTrigger` — binds animation to scroll position; underlies every reveal and every `scrub`.
- `ScrollSmoother` — replaces native scroll with inertial lerped scroll; provides `data-speed` parallax.
- `SplitText` — splits text into chars/words/lines so each can animate independently.
- `ScrambleTextPlugin` — the decode effect in the preloader and on stack pills.
- `useGSAP` — runs GSAP inside a managed, ref-scoped context that auto-reverts on unmount.

## Architecture

### Component tree

```
index.html
└─ #root
   └─ <App>                        creates ScrollSmoother · owns `loaded`
      ├─ <Cursor/>                 fixed scope crosshair          z 500
      ├─ <Preloader/>              fixed overlay, self-unmounting  z 400
      ├─ <Navbar/>                 fixed bar + mobile menu     z 100/120
      └─ #smooth-wrapper           ScrollSmoother viewport
         └─ #smooth-content        the transformed content
            ├─ <main>
            │  ├─ <Hero/>          <HeroScene/> WebGL + name cascade
            │  ├─ <About/>         scrubbed statement + layers + metrics
            │  ├─ <Projects/>      bento grid of captures + SVG figures
            │  ├─ <TechStack/>     category matrix, scramble pills
            │  ├─ <Timeline/>      scrubbed spine + entry slide-ins
            │  └─ <Contact/>       Formspree form
            └─ <Footer/>           live IST clock + back-to-top
```

### The structural rule

ScrollSmoother **requires** a two-element nesting: a fixed-height `#smooth-wrapper` acting as the viewport, and a `#smooth-content` inside it that gets translated to simulate scrolling.

Everything that scrolls lives inside `#smooth-content`. Everything that must stay pinned to the real viewport — **cursor, preloader, navbar** — lives *outside* it as a sibling, positioned `fixed`. Getting this wrong is the classic ScrollSmoother bug where "fixed" elements scroll away.

### Z-index scale

Named tokens in `:root`, not magic numbers:

```
--z-cursor   500   scope crosshair, above everything
--z-preload  400   preloader (unmounts when done)
--z-menu     120   mobile menu
--z-nav      100   navbar
--z-content    1   scrolled content
--z-field      0   WebGL canvas, behind the hero text
```

### Data / presentation separation

All copy and structured data live in **one typed file**: `src/data/content.ts` — profile, layers, projects, stack, timeline, nav links, and the Formspree endpoint. Components import and render; **nothing is hard-coded in JSX**. Updating the site means editing one file, not hunting through components.

### The animation contract

Every animated component follows the same three steps:

1. Import `prefersReducedMotion` from `src/lib/gsap.ts`.
2. First line inside `useGSAP`: `if (prefersReducedMotion()) return;`
3. Author the static JSX so that, with zero animation applied, it is already in its final readable state.

A CSS backstop in the `@media (prefers-reduced-motion: reduce)` block zeroes out every remaining transition and animation duration.

## Project structure

```
Krish-Portfolio/
├── index.html               HTML shell — meta, Google Fonts, inline SVG favicon, #root
├── vite.config.ts           Vite + React plugin, PORT-overridable dev server
├── tsconfig.json            strict TS, ES2022, bundler resolution, noEmit
├── firebase.json            Hosting: serve dist/, SPA rewrite
├── .firebaserc              project alias → krish-jeswal
│
├── public/
│   └── Krish_Resume.pdf     copied verbatim into the build
│
└── src/
    ├── main.tsx             createRoot + StrictMode + global.css
    ├── App.tsx              root layout, ScrollSmoother setup, `loaded` state
    │
    ├── lib/gsap.ts          plugin registration · prefersReducedMotion() · NOISE_CHARS
    ├── data/content.ts    ★ single source of truth for all content + its types
    ├── styles/global.css  ★ the entire visual system (~1,400 lines)
    │
    └── components/
        ├── HeroScene.tsx  ★ Three.js particle sphere, GLSL shaders, context resilience
        ├── Hero.tsx         char-cascade name entrance (split, then revert) + parallax
        ├── Preloader.tsx    waveform draw · scramble · counter · clip-path wipe
        ├── Cursor.tsx       scope crosshair + corner lock brackets
        ├── Navbar.tsx       fixed bar + focus-trapped clip-path mobile menu
        ├── About.tsx        scrubbed word-by-word statement + layers + metrics
        ├── Projects.tsx     bento grid of Capture cards + inline-SVG Figures
        ├── TechStack.tsx    category matrix with hover-to-scramble pills
        ├── Timeline.tsx     scrubbed spine fill + entry slide-ins
        ├── Contact.tsx      Formspree form with idle/sending/ok/err state machine
        └── Footer.tsx       live IST clock + click-to-top name
```

★ = read these first.

## Design system

Everything is variables-first in `:root`. **Strictly monochrome — there is no hue anywhere.** Emphasis is carried entirely by brightness, type weight, and spacing.

```css
--void:      #060709;  /* ground */
--void-2:    #0a0b0e;
--panel:     #101216;
--panel-2:   #15181d;

--ink:       #ecedea;  /* primary text   — ~17:1 on void */
--ink-mid:   #9a9da3;  /* secondary      — ~8:1  on void */
--ink-dim:   #5c6066;  /* large / decorative only */
--ink-faint: #34373c;

--signal:    #ffffff;  /* the recovered signal — the only luminous value */
```

- **Type** — **Archivo** (variable; the expanded display look comes from its width axis) for display and body; **Martian Mono** for data, channel labels, indices, capture codes, and status messages. The mono face carries the "instrument" voice.
- **Motion** — two shared easings, `--ease-out` (quint-ish `cubic-bezier(.16,1,.3,1)`) and `--ease-io`.
- **Spacing** — fluid `--gutter` and `--frame` tokens built on `clamp()`.

> The signal white exists in two places that must stay in sync: the `--signal` CSS variable and the `uColorA` shader uniform in `HeroScene.tsx`.

## Implementation highlights

### GPU-side particle displacement

The sphere's 6,500 points are uploaded to the GPU **once** as a static Fibonacci distribution (golden-angle spiral, which avoids the pole-clustering of naive lat/long sampling). Per frame, only the `uTime` uniform changes — the vertex shader recomputes every position in parallel:

```glsl
vec3  dir = normalize(position);
float n   = snoise(dir * 1.6 + uTime * 0.12);   // slow swell
float n2  = snoise(dir * 4.0 - uTime * 0.07);   // fine shimmer
vec3  pos = position + dir * (n * uAmp + n2 * uAmp * 0.35);

gl_PointSize = uSize * (0.6 + vNoise + aRand * 0.6) * (1.0 / -mv.z);
```

Doing this on the CPU would mean 6,500 JS-side vector updates per frame. On the GPU it's free. The fragment shader rounds each square point with a `smoothstep`, mixes between white and a cool grey by noise, and sparkles the ~7% of particles with the highest `aRand`. Additive blending with `depthWrite: false` produces the glow.

Scroll drives two uniforms directly — the sphere recedes and churns harder as you descend:

```ts
const p = Math.min(window.scrollY / window.innerHeight, 1);
group.position.z         = p * 1.8;
mat.uniforms.uAmp.value  = 0.45 + p * 0.9;
```

### WebGL context resilience

A substantial part of `HeroScene.tsx` exists purely to survive the GPU context lifecycle — the cause of the entire "blank sphere on reload" class of bugs:

- Renderer creation falls back from `high-performance` to the default adapter (dual-GPU laptops sometimes refuse the high-perf adapter right after a reload).
- A fresh renderer is checked for `isContextLost()` and rejected if it was born dead.
- Init **retries up to 8 times at 300 ms intervals** — a same-tab reload can transiently starve WebGL while the previous page's context is still tearing down.
- `webglcontextlost` is `preventDefault()`-ed so the browser will restore it; `webglcontextrestored` re-kicks the loop.
- `pagehide` calls `forceContextLoss()`, because React cleanup does not run on a hard reload and the next page must not compete for the context.
- `teardown()` disposes every geometry, material, and renderer **and** forces context loss — `dispose()` alone never frees the GPU context, and leaked contexts get the live one evicted.

### Layout measurement and webfonts

Webfonts change element heights when they swap in, and ScrollTrigger caches element positions at creation time. Both `App.tsx` and `About.tsx` therefore gate on `document.fonts.ready` before measuring or splitting. `App` refreshes a second time once `loaded` flips and the preloader has unmounted, since section reveals were created before the layout was final.

### StrictMode as a real constraint

`StrictMode` double-invokes effects in development, so clean teardown isn't optional. `App` kills the smoother (two competing scroll engines otherwise), `HeroScene` runs a full teardown with forced context loss, and `About` guards against splitting an already-split node.

### Small details worth keeping

- **Hero name** — `SplitText` wraps each letter in an `inline-block` span, which combined with negative letter-spacing makes selected/copied text ragged. The timeline's `onComplete` **reverts the split**, so the cascade plays but the clipboard gets a clean `Krish Jeswal`.
- **Stack pills** — `el.style.minWidth = offsetWidth` locks the pill's width before scrambling, so the layout doesn't jitter while variable-width random glyphs cycle.
- **Cursor** — `gsap.quickTo` creates a reusable tween setter instead of allocating a new tween on every `pointermove`.
- **Nav** — scrolls via `ScrollSmoother.get().scrollTo(href, true, "top 72px")`, with a native `scrollIntoView` fallback when the smoother doesn't exist (reduced motion).
- **Zero binary image assets.** Every graphic — the project figures, the preloader waveform, the favicon — is inline SVG or a data URI. The only binary shipped is the résumé PDF.

## Accessibility

- `prefers-reduced-motion` is respected in **every** animated subsystem: the preloader skips to done, the smoother is never created, the cursor never mounts, sections render statically, and the WebGL scene paints a single frame instead of looping.
- Visually-hidden skip link precedes the nav.
- Text contrast: primary ~17:1, secondary ~8:1 against the void ground.
- Mobile menu is focus-trapped, Escape-closable, and scroll-locked, and restores focus to the burger on close.
- Global `:focus-visible` rings; `color-scheme: dark` keeps native controls and scrollbars correct.
- Back-to-top is a real `<button>`; the custom cursor bails entirely on `(hover: none)` devices so phones keep the native one.

**The honest test:** enable "reduce motion" in your OS. The site should still read perfectly.

## Performance

The render loop is the only continuously-running animation, and it's gated three ways:

- **IntersectionObserver** — `requestAnimationFrame` only runs while the hero is on-screen.
- **`prefers-reduced-motion`** — one static frame, no loop.
- **Context lifecycle** — pause and teardown on context loss and `pagehide`.

Current production build:

| Asset | Raw | Gzipped |
|---|---|---|
| JS (React + Three.js + GSAP + app) | 868 kB | 247 kB |
| CSS | 23 kB | 5 kB |

The JS is a single chunk and trips Rollup's 500 kB warning — code-splitting the hero scene is on the roadmap.

## Getting started

**Requirements:** Node 18+ and npm.

```bash
git clone https://github.com/KrishJeswal/Krish-Portfolio.git
cd Krish-Portfolio
npm install
npm run dev          # → http://localhost:5173
```

### Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server with HMR. Override the port with `PORT=3000 npm run dev`. |
| `npm run build` | `tsc --noEmit` (type errors fail the build) **then** `vite build` → `dist/`. |
| `npm run preview` | Serve the production build locally. |

### Editing content

Almost every change you'd want to make lives in `src/data/content.ts`:

| Export | Drives |
|---|---|
| `profile` | Hero, thesis summary, contact details, social links |
| `layers` | The three ranked roles in the Thesis section |
| `projects` | The Captures bento grid — including which SVG `figure` each card renders |
| `stack` | The six-row Stack matrix |
| `timeline` | The Log entries |
| `navLinks` | Navbar and mobile menu |
| `FORMSPREE_ID` | Contact form endpoint |

`Project.figure` is a union of four values — `leak`, `retrieve`, `map`, `pipeline` — each mapping to a hand-drawn SVG motif in `Projects.tsx`. Adding a fifth project means adding a fifth figure.

If you rename a section, keep the mapping consistent: the channel name, the nav label, and the anchor `id` all match.

## Deployment

```bash
npm run build        # → dist/
firebase deploy      # Firebase Hosting, project "krish-jeswal"
```

`firebase.json` serves `dist/` with a catch-all rewrite to `index.html`. Deploys are currently manual — there's no CI workflow in the repo yet.

## Roadmap

- [ ] GitHub Actions pipeline: type-check → build → deploy on push to `main`.
- [ ] Code-split / dynamic-import `HeroScene` so Three.js stops blocking first paint.
- [ ] Self-host or preload fonts to take a third-party CDN off the critical path.
- [ ] Open Graph + Twitter card meta, a generated OG image, `robots.txt`, `sitemap.xml`.
- [ ] Device-aware quality scaling — lower particle `COUNT` and pixel ratio on weak GPUs.
- [ ] Spam protection on the contact form (honeypot, or proxy the submit through a Cloud Function).
- [ ] A Playwright/Vitest smoke test — page mounts, sections present, reduced-motion path renders.

---

**Krish Jeswal** · [krish-jeswal.web.app](https://krish-jeswal.web.app) · [GitHub](https://github.com/KrishJeswal) · [LinkedIn](https://www.linkedin.com/in/krishjeswal/) · [connectwithkjeswal@gmail.com](mailto:connectwithkjeswal@gmail.com)
