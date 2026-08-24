# Krish Jeswal — Portfolio

A two-route personal site built from scratch — **no UI library, no CSS framework, no animation library**. React 19 + TypeScript render six sticky panels on the home page and a long-form case study for each project, prerendered to static HTML at build time and hydrated on the client.

**Live → [krish-jeswal.web.app](https://krish-jeswal.web.app)**

```
React 19 · TypeScript (strict) · Vite 6 · React Router 7 · hand-authored CSS · Firebase Hosting
```

---

## Table of contents

- [Overview](#overview)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Design system](#design-system)
- [Implementation notes](#implementation-notes)
- [Accessibility](#accessibility)
- [Getting started](#getting-started)
- [Editing content](#editing-content)
- [Deployment](#deployment)

---

## Overview

Two routes, five prerendered pages.

**`/` — the home page.** Six full-height panels, each `position: sticky` at `top: 0`, so scrolling slides every panel up over the one before it like stacked sheets. A fixed header carries a wordmark and a nav "roll" whose numeral rolls into an aperture as the active section changes.

| # | Section | What it is |
|---|---|---|
| 01 | Hero | The name, dealt in two words, under a knockout cursor blob |
| 02 | About | A 16:9 plate holding a horizontal tape of three discipline panels |
| 03 | Work | A draggable card deck — fling or tap to advance |
| 04 | Skills | Drawers that slide out one at a time |
| 05 | Experience | A ledger whose year, range and detail swap on hover or focus |
| 06 | Contact | Filing tabs over a card, with copy-to-clipboard email |

**`/work/:slug` — the case studies.** One long-form read per project, in five written sections (Capture, Interference, Topology, The hard part, Residual) plus an overview and a closing card pair. A side rail tracks reading position and becomes a bottom sheet below 1200px.

Everything is static. There is no backend, no analytics, and no runtime network dependency beyond the two webfont hosts.

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| **UI runtime** | React 19 | Component model and lifecycle. State is deliberately small — `active`, `index`, `open`, `loaded`, `sheetOpen`. |
| **Language** | TypeScript 5.8, `strict` | Plus `noUnusedLocals` and `noUnusedParameters`, so dead bindings fail the build. |
| **Build** | Vite 6 | Client bundle, plus a second SSR build that feeds the prerenderer. |
| **Routing** | React Router 7 | Two routes and a catch-all redirect. `StaticRouter` on the server side of the prerender. |
| **Styling** | Hand-authored CSS with custom properties | Five files, ~2,000 lines, no preprocessor and no utility framework. |
| **Motion** | CSS transitions and `requestAnimationFrame` | No animation library. The blob, the deck and the panel depth are raw rAF loops. |
| **Hosting** | Firebase Hosting | Static files with a cache policy split by what can change in place. |

Runtime dependencies are `react`, `react-dom` and `react-router-dom`. That is the whole list.

## Architecture

### Prerendering

`npm run build` runs four steps:

1. `tsc --noEmit` — typecheck, no emit.
2. `vite build` — the client bundle into `dist/`.
3. `vite build --ssr src/entry-server.tsx` — a server bundle into `.ssr-build/`.
4. `node scripts/prerender.mjs` — render every route to real HTML.

The prerenderer imports `render`, `metaForPath` and `ROUTES` from the SSR bundle, renders each route with `renderToString`, and writes the markup into the built `index.html` shell along with that route's title, description, canonical, Open Graph tags and JSON-LD.

Output shape matters for Firebase Hosting: static files are matched **before** rewrites, so writing `dist/work/<slug>/index.html` means that URL is served directly instead of falling through the SPA rewrite to the shell. The result is that a crawler which never executes JavaScript still gets the full case-study prose.

`src/main.tsx` branches on this — `hydrateRoot` when `#root` already holds markup, `createRoot().render()` when it does not (the dev server serves an empty shell).

`sitemap.xml` and `robots.txt` are generated in the same pass from the same `ROUTES` array, so they cannot drift from what actually exists.

### Metadata

`src/lib/seo.ts` is the single source for every page's metadata. It is used twice: once at build time by the prerenderer, and once at runtime by `useDocumentMeta`, which keeps the title and canonical in step during client-side navigation.

Case-study descriptions are not written by hand — `describeProject` takes the lead and body paragraphs of a project's Capture section, strips the inline markup, and truncates to 300 characters. The description therefore cannot drift from the article.

### Scroll

Both pages track scroll position with a `requestAnimationFrame`-coalesced listener rather than an `IntersectionObserver`, because in both cases "which section is active" is a decision about a single line, not about overlap.

- **Home** (`useActiveSection`) accumulates `offsetHeight` from the top of `<main>` rather than reading each panel's `offsetTop`. On a sticky element `offsetTop` reports where it is *currently pinned*, so while stuck every panel returns the same value and they become indistinguishable.
- **Case study** (`useScrollSpy`) reads `offsetTop` directly, which is correct there because those sections are static and their entrance animation is a keyframe that layout ignores.

## Project structure

```
src/
├── main.tsx                 hydrate-or-render branch, scrollRestoration, the `js` gate
├── entry-server.tsx         renderToString for the build-time prerender
├── App.tsx                  two routes + catch-all redirect
├── data/
│   ├── home.ts              profile, roles, sections, reel, drawers, ledger, contact
│   └── projects.ts          four projects x five case-study sections, as typed data
├── lib/
│   ├── seo.ts               per-route metadata + JSON-LD, shared by build and runtime
│   ├── env.ts               media-query hooks (reduced motion, fine pointer, breakpoints)
│   ├── scroll.ts            document-offset scrolling (never scrollIntoView)
│   ├── useHomeScroll.ts     active panel, panel depth, the nav roll tape
│   ├── useCaseScroll.ts     scroll spy + one-way entrance tracking
│   └── useDocumentMeta.ts   keeps the head in step on client navigation
├── pages/
│   ├── Home.tsx             six panels + the blob's mirror list
│   └── CaseStudy.tsx        rail, sheet, sections, next-card
├── components/
│   ├── RichText.tsx         inline markers for prose stored as data
│   ├── home/                Loader, Hero, About, Work, Skills, Experience, Contact,
│   │                        SiteHeader, SectionEyebrow, CursorBlob
│   └── case/                CaseHeader, CaseRail, CaseTop, CaseSectionView,
│                            Blocks, Diagram, CaseNext
└── styles/
    ├── tokens.css           colour, type, elevation and z-index scales
    ├── home.css             the six panels and everything on them
    ├── case-study.css       the long-form read and its rail
    ├── responsive.css       three breakpoints, all deliberate
    └── global.css           imports the above in order

scripts/prerender.mjs        renders every route, writes sitemap.xml and robots.txt
```

## Design system

All tokens live in `src/styles/tokens.css`.

**Colour** — a near-black surface (`--bg` `#0e0e0f`), three raised and recessed greys (`--plate`, `--groove`, `--sheet`), three ink levels (`--ink`, `--ink2`, `--ink3`), two hairlines (`--line`, `--edge`), and one accent (`--accent` `#c6462f`).

**Type** — Clash Display for headings, Satoshi for body, IBM Plex Mono for chrome (eyebrows, labels, numerals).

**Motion** — one curve carries every positional move on the site (`--ease`), with a single documented exception for flinging a card away (`--ease-out-fast`).

**Layering** — every z-index is a token, from `--z-rail: 60` up to `--z-skip: 500`. The only raw z-indexes left are the six panels, which climb 1 to 6 so each sticky sheet covers the one before it.

**Breakpoints** — three, each with a reason:

| Width | What changes |
|---|---|
| 1200px | The case-study rail becomes a bottom sheet |
| 860px | The home panels stop being sticky and grow with their content |
| 720px | The experience rows stack, all four together |

## Implementation notes

### The cursor knockout blob

Over the hero, and only at the top of the page, the native cursor is replaced by an accent-filled amoeba with a copy of the hero text and the header drawn inside it in the page's background colour — a knockout, not an overlay.

The blob's border-radius is eight percentages (four horizontal, four vertical), each summing two sine waves on incommensurate periods plus a speed term that stretches it while the pointer moves fast. The copies inside are not DOM clones: `Home.tsx` passes the *same components* again as `mirrors`, so the knockout tracks the live nav numeral and the hero's deal animation with no bookkeeping of its own. Each frame the copy is parked over its source using the source's `getBoundingClientRect()`.

The whole subsystem is off on touch devices and under `prefers-reduced-motion`.

> **Debugging note.** Because the blob renders a second copy of the header, there are two `.roll-label` elements on the home page and the blob's copy comes **first** in DOM order. A bare `document.querySelector('.roll-label')` in the console reads the mirror, not the header — scope to `header.site-header .roll-label`. Both copies are driven by the same `active` value, so they can never actually disagree.

### The card deck

Pointer-driven, with the live gesture held in a ref rather than state — it changes on every pointer event and only the resulting offset needs to render. The gesture commits to an axis after 5px; a vertical commit hands the gesture back to the page so scrolling still works. Releasing past 80px of travel throws the card off toward the drag direction, but the deck always advances *forward* — swiping either way goes to the next project. A tap advances too.

### Architecture diagrams

The diagrams in the case studies are native markup, not images — nodes, links, rows and groups rendered from typed data. They stay legible at any width, reflow on phones, and are readable by a screen reader.

### Content as data

No copy is hard-coded in JSX. `src/data/home.ts` and `src/data/projects.ts` hold everything, and case-study prose supports two inline markers rendered by `RichText`: backticks for code and asterisks for emphasis. Section numerals appear in exactly one place — the `sections` array — and both the nav roll and the section eyebrows read from it.

## Accessibility

- Skip links on both pages.
- `prefers-reduced-motion` is honoured in every animated subsystem: the loader skips straight to done, the cursor blob never mounts, the panel-depth effect is off, entrance animations resolve immediately, and the nav roll snaps instead of rolling.
- Every interactive element is a real `button` or `a`; the deck's case-study links drop out of the tab order when their card is not the front one.
- `:focus-visible` outlines in the accent colour, with the contact tabs deliberately using `:focus-visible` rather than `:focus` so a mouse click on a `target="_blank"` link does not leave a stuck outline.
- The copy-to-clipboard button announces its result through an `aria-live` region.
- Diagrams are text; images carry alt text; decorative layers are `aria-hidden`.

## Getting started

```bash
npm install
npm run dev          # vite dev server on :5173
```

The dev server serves an empty shell and client-renders — prerendered markup only exists in a production build.

### Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Typecheck, client build, SSR build, then prerender all routes |
| `npm run preview` | Serve `dist/` locally, including the prerendered HTML |

To see what a crawler sees, run `npm run build` then `npm run preview` and view source.

## Editing content

| To change | Edit |
|---|---|
| Name, email, links, résumé | `profile` in `src/data/home.ts` |
| Section names and numerals | `sections` in `src/data/home.ts` |
| About panels, skills, experience | `reelPanels`, `drawers`, `ledger` in `src/data/home.ts` |
| A case study | the matching const in `src/data/projects.ts` |
| Adding a project | add to `PROJECT_SLUGS` and the `projects` array — routes, sitemap, deck and next-card all follow |
| Colour, type, spacing | `src/styles/tokens.css` |

## Deployment

Firebase Hosting, project `krish-jeswal`.

```bash
firebase deploy
```

`firebase.json` declares a `predeploy` hook that runs `npm run build`, so a deploy can never ship a stale `dist/`.

Cache policy is split by what can change in place:

| Path | Policy |
|---|---|
| `/`, `/work/**`, `**/*.html` | `max-age=0, must-revalidate` |
| `**/*.js`, `**/*.css` | `max-age=31536000, immutable` (content-hashed) |
| Images and PDFs | `max-age=86400` plus a 30-day `stale-while-revalidate` |
| `robots.txt`, `sitemap.xml` | `max-age=3600` |

Security headers (`nosniff`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`) are applied to every response.
