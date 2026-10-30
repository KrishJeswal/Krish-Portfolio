# Krish Jeswal — Portfolio

A two-route personal site laid out like a library catalogue. React 19 + TypeScript render a home page of catalogue cards and a long-form case study per project, prerendered to static HTML at build time and hydrated on the client. GSAP and Lenis drive the motion.

**Live → [krish-jeswal.web.app](https://krish-jeswal.web.app)**

```text
React 19 · TypeScript (strict) · Vite 6 · React Router 7 · GSAP + ScrollTrigger · Lenis · hand-authored CSS · Firebase Hosting
```

## Overview

**`/` — the catalogue.**

| Section | What it is |
| --- | --- |
| Loader | A counter from 000 to 100 on the dark page; wipes up into the cover once fonts are ready (first load only) |
| Cover | An author card on ruled paper that drops in and types its lines out |
| Preface | Intro on a stone sheet; the heading fills in word by word on scroll |
| Fields | Three guide cards (ML, SW, EMB) with line-art illustrations; each tips back into the drawer on scroll |
| Projects | A card drawer: each project card rises, gets read, and lands on a pile (a stacked deck on phones) |
| Index | Six skill groups in two columns, filterable by the project they were used in |
| Shelf | Experience as book spines dropping onto a shelf |
| Contact | A typed request slip with copy-to-clipboard email |

**`/work/:slug` — the case studies.** The project's catalogue card hangs from the top of the screen; five chapters (Capture, Interference, Topology, The hard part, Residual) follow on one dark page. Light paper cards hold the structured content — figures, formulas, tables, lists, code — and architecture diagrams are dark ink panels. The next project's card rises from the bottom.

Everything is static: no backend, no analytics, no runtime network dependency. Fonts are self-hosted.

## Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| UI runtime | React 19 | Component model; `renderToString` + `hydrateRoot` for the prerender |
| Language | TypeScript 5.8, `strict` | Content is typed data, so block shapes are compile-checked |
| Build | Vite 6 | Client bundle plus an SSR bundle that feeds the prerenderer |
| Routing | React Router 7 | `/`, `/work/:slug`, catch-all redirect |
| Motion | GSAP (ScrollTrigger) + Lenis | Pinned scroll scenes, scrubbed timelines, smooth scroll that keeps native scroll position |
| Styling | Hand-authored CSS with custom properties | `theme`, `header`, `catalogue`, `case`, `loader` |
| Fonts | Fontsource: Gloock, Hanken Grotesk, Martian Mono, Courier Prime | Bundled with hashed names, no font CDN |
| Tests | Vitest | Content invariants and the inline-markup renderer |
| Hosting | Firebase Hosting | Static files matched before the SPA rewrite |

## Architecture

- `npm run build` = typecheck → client build → SSR build → `scripts/prerender.mjs`, which writes `dist/**/index.html` per route plus `sitemap.xml` and `robots.txt`.
- All motion is created in effects (`useHomeMotion`, `useCaseMotion`) inside a `gsap.context`, so nothing runs under the prerender and everything reverts on unmount. Desktop and phone get different scenes via `gsap.matchMedia`.
- `prefers-reduced-motion` skips the loader, Lenis and every timeline; illustrations render fully drawn.
- The site is dark-only and declares `color-scheme: dark`, so browsers' forced dark modes leave the paper cards alone.
- `useLineGrid` re-spaces the ruled lines on cards from the measured text line height, because some phones lay text out off the declared grid.

## Project structure

```text
src/
  main.tsx, App.tsx, entry-server.tsx
  data/          home.ts (profile, sections, fields, skills, shelf, contact) · projects.ts (cards + case studies)
  lib/           motion, loader, useCurrentSection, useHomeMotion, useCaseMotion, useLineGrid, seo, useDocumentMeta
  pages/         Home, CaseStudy
  components/
    shared/      Header (name chip + now-reading dropdown)
    ink/         line-art illustrations as typed SVG shapes
    home/        Loader, CoverCard, Preface, Fields, Drawer, SkillIndex, Shelf, RequestSlip
    case/        CatalogueCard, TitleCard, Rail, Blocks, Diagram, NextCard
  styles/        theme, header, catalogue, case, loader
```

## Getting started

```bash
npm install
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server (empty shell, client-rendered) |
| `npm run build` | Typecheck, client build, SSR build, prerender |
| `npm run preview` | Serve `dist/` (use trailing slashes for case studies, e.g. `/work/ciphertrace/`, to get the prerendered file) |
| `npm test` | Vitest |
| `npm run images` | Encode `art/*.png` to the JPEG og images in `public/assets/` |

## Editing content

| To change | Edit |
| --- | --- |
| Name, email, links | `profile` in `src/data/home.ts` |
| Cover lines, preface, fields, skills, shelf, contact | the matching export in `src/data/home.ts` |
| A project's drawer card | its `card` in `src/data/projects.ts` |
| A case study | its `sections` in `src/data/projects.ts` |
| Adding a project | add to `PROJECT_SLUGS` and `projects`; give it a `card` with a unique shelf code |
| Colours, type, spacing | `src/styles/theme.css` |

## Accessibility

- Skip links on both pages; real `a`/`button` elements throughout.
- Dropdown nav closes on Escape and outside click, and returns focus to its button.
- The copy button announces its result through an `aria-live` region.
- Illustrations and decorative layers are `aria-hidden`; diagrams are text.

## Deployment

```bash
firebase deploy
```

`predeploy` runs `npm run build`. HTML revalidates on every request; hashed JS, CSS and fonts are cached as immutable; images and PDFs get a day plus stale-while-revalidate.
