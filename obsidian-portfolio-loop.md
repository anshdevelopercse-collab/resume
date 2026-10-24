# OBSIDIAN PORTFOLIO — CLAUDE CODE LOOP PROMPT

> Paste everything below the line into Claude Code. It is written to be self-pacing:
> either run it as `/loop <paste>` (dynamic interval) or paste it once and let it
> iterate until the completion promise is printed. All state lives in files, so a
> fresh context window can always resume.

---

## 0. ROLE

You are a principal creative developer and art director building a cinematic,
dark-luxury portfolio website for **Ansh Sharma** (Software Developer, Full-Stack
& AI Applications). The theme is **OBSIDIAN**: volcanic black glass, molten gold,
restraint, weight, silence, and then a single dramatic flourish. The site must be
graphically stunning and must NOT look like a typical AI-generated ("vibe-coded")
portfolio.

You work in a loop. Each iteration you do ONE task from the plan, verify it with
evidence, commit it, update the progress file, and either continue or stop.

## 1. NON-NEGOTIABLE RULES

1. **Do not assume. Ask.** If anything is ambiguous, missing, or contradicts this
   brief, write it to `BLOCKERS.md`, then ask the user (use AskUserQuestion if
   available, otherwise stop and print the question). Do not guess and move on.
2. **Content is truth.** All facts come from `Ansh_Sharma_Resume.pdf` in the repo.
   Never invent metrics, testimonials, employers, awards, project screenshots,
   or a photo. If the PDF and section 4 below disagree, the PDF wins and you
   record the discrepancy in `BLOCKERS.md`.
3. **Stay in theme.** Every choice must serve Obsidian: dark, glossy, precise,
   gold-lit, expensive. Anything that feels like a template gets redone.
4. **Evidence over claims.** A task is done only when its verification gate
   passes (section 7). "It should work" is not done.
5. **No secrets, no deploys, no force-pushes.** Commit locally to the feature
   branch each iteration. Do NOT push, open PRs, or deploy without asking the
   user first. Never commit API keys; use `.env.example`.
6. **Windows path-length warning.** The default workspace path may be too long for
   git and Node on Windows. If `git clone` or `npm install` fails with a
   "path too long" error, work from a short path such as `C:\dev\resume` and
   tell the user where the project lives.

## 2. SETUP (iteration 1 only, skip if `PROGRESS.md` exists)

1. Clone `https://github.com/anshdevelopercse-collab/resume.git` into a short
   path. Keep `Ansh_Sharma_Resume.pdf` at the repo root, untouched.
2. Create branch `feat/obsidian-portfolio`.
3. Extract the PDF text AND its embedded hyperlinks (pdftotext / pypdf / pdfplumber,
   whichever is available). Save the raw extraction to `docs/resume-extract.txt`.
   Look at the rendered PDF as an image too, since column alignment (for example the
   education years) cannot be trusted from plain text.
4. Scaffold the site INSIDE this repo (the PDF stays beside it):
   Next.js (App Router) + TypeScript + Tailwind CSS, `src/` layout.
   Add: `gsap` (with ScrollTrigger and SplitText, both free), `lenis`, `three`,
   `@react-three/fiber`, `@react-three/drei`, `zod`, `resend`,
   and `@playwright/test` for verification. Pin versions. Use `next/font`.
5. Create `PLAN.md`, `PROGRESS.md`, `BLOCKERS.md`, `docs/DESIGN.md` (see section 8).

## 3. DESIGN SYSTEM (write this into `docs/DESIGN.md` and obey it)

**Palette: black glass + antique gold.** Define as CSS variables and Tailwind tokens.
Suggested starting values, adjust by eye against the real render:

| Token | Value | Use |
|---|---|---|
| `--obsidian-950` | `#050506` | page background |
| `--obsidian-900` | `#0B0B0D` | raised surfaces |
| `--obsidian-800` | `#141416` | cards, borders-fill |
| `--obsidian-line` | `rgba(237,230,214,0.08)` | hairlines |
| `--bone` | `#EDE6D6` | primary text |
| `--ash` | `#8C877C` | secondary text |
| `--gold-500` | `#C8A24A` | accent |
| `--gold-300` | `#E7D3A1` | highlights, champagne |
| `--gold-700` | `#7A5F22` | shadowed gold |

Rules: gold is used sparingly (roughly 5 percent of pixels) so it reads as precious.
Gold gradients are allowed ONLY as realistic metal (multi-stop with a bright
specular band), never as a flat two-colour fade.

**Typography.** One high-contrast display serif (default: Cormorant Garamond),
one restrained grotesk for body (default: Hanken Grotesk), one mono for labels,
indices and metadata (default: IBM Plex Mono). Huge scale contrast: display
type enormous, labels tiny and tracked out. Numbered section indices like
`01 / EXPERIENCE`. If you swap a font, justify it in `DESIGN.md`.

**Texture and depth.** Animated film grain overlay (canvas or SVG noise, low
opacity), soft vignette, hairline borders, subtle inner highlights on surfaces,
faint caustic/refraction light on obsidian. Depth comes from light, not from drop
shadows.

### Anti-"vibe-coded" blacklist (any hit = redo the work)
- Purple, indigo, blue-to-pink or neon gradients; glowing cyan/green accents.
- Gradient-filled text on headings; blurred colour blobs behind the hero.
- Generic "Hi, I'm Ansh 👋" hero; emoji used as icons; stock Lucide icon rows.
- Three identical rounded cards with an icon, title and blurb.
- Inter / Poppins / Space Grotesk as the identity font; symmetric centered-everything layouts.
- Default glassmorphism (white 10 percent blur cards) as the main surface language.
- Generic fade-up-on-scroll applied identically to every element.
- Lorem ipsum, placeholder avatars, fake stats, "Available for work" pulsing green dot.

Layout must show editorial confidence: asymmetric grids, oversized type that
bleeds off the edge, deliberate negative space, strong alignment to a visible
12-column grid, and one unexpected composition per section.

## 4. CONTENT CONTRACT (verify every line against the PDF)

**Identity:** Ansh Sharma. Software Developer | Full-Stack & AI Applications.
**Contact (use exactly as in the resume):** +91 9343044641 · ansh.sharmax17@gmail.com ·
linkedin.com/in/ansh-sharmax17 · github.com/anshsharmax17.
Note: the repo owner is `anshdevelopercse-collab` but the resume says
`anshsharmax17`; use the resume's handle on the site. The resume also lists an
existing portfolio at portfolio-website-ansh-sharma.vercel.app; do not link it as
if it were this site.

**Summary:** B.Tech CSE student (graduating 2027) with two software development
internships building full-stack web apps in React, Node.js and Express (REST APIs,
database design, authentication, debugging). Personal projects go further into AI:
LLM integration, RAG and computer vision in TypeScript and Python.

**Experience (render dates exactly as printed; they overlap, do not "fix" them):**
- Junior Software Engineer Intern, TechJain IT, Bhopal (Jun 2026 - Sep 2026)
- Full Stack Development Intern, Dadamani Enterprises, Tamnar (Jun 2026 - Jul 2026)
- SEO Intern, Digital Veda, Raipur (May 2026 - Jun 2026)
Use the bullets from the PDF verbatim or tightly edited for rhythm. No added claims.

**Projects (3):** AI Resume Analyser · NexoraRAG · Computer Vision Project (hand
gesture controller). Stack lines and bullets come from the PDF.
**Project links:** all three point to `https://github.com/anshsharmax17` for now.
Keep every link in ONE file, `src/content/links.ts`, each marked
`// TODO: replace with exact repo URL`, so they are trivial to swap.

**Skills:** grouped exactly as the PDF (Languages, Frontend, Backend & APIs,
Databases, AI & ML, Tools, Core Concepts).
**Education:** O.P. Jindal University, Raigarh, B.Tech CSE, 2023-2027, CGPA 6.4.
12th (Indian School, Raigarh, PCM) and 10th (Carmer School, Raigarh): read the
rendered PDF to pair the years correctly. Show CGPA as printed unless the user
tells you otherwise (put "confirm CGPA display?" in `BLOCKERS.md` as a low-priority question).
**Certifications and achievements:** HackerRank Software Engineer; Coursera Android
Mobile App Dev; Tata Forage GenAI Data Analytics; Simplilearn SQL. SIH 2024 and
2025; Co-Convenor of Sponsorship, Technorollix; IEEE Student Member; Adobe
Hackathon Participant; UI/UX Competition Participant at IIIT Raipur.

## 5. EXPERIENCE DIRECTION (what must feel extraordinary)

### 5.1 Liquid-gold preloader and page reveal (the signature moment)
This is the ONLY liquid effect on the site; keeping it exclusive makes it special.
Do not add liquid cursors, liquid cards or liquid section transitions.

Sequence (about 3 to 4 seconds on a fast connection, never a fake delay):
1. Pure black. A thin gold hairline draws across the viewport; a mono counter
   `000 → 100` ticks bottom-left, driven by REAL loading progress (fonts, hero 3D
   scene, critical images), eased so it never jumps backward.
2. The name `ANSH SHARMA` in huge serif is a mask. Molten gold rises inside the
   letterforms like liquid filling a mould: animated wave surface, meniscus
   highlight, subtle bubbles/ripples. Build with an SVG `feTurbulence` +
   `feDisplacementMap` / gooey filter, or a small WebGL fragment shader on a canvas.
   Choose whichever actually looks premium at 60fps and record why in `DESIGN.md`.
3. At 100 the gold overflows the mask and floods the screen; the flood then drains
   downward in a liquid curtain (animated SVG path morph or shader) revealing the
   hero already mid-animation underneath, so the reveal is one continuous gesture.
4. Skippable (any key/click after 1 second). Plays once per session
   (`sessionStorage`). `prefers-reduced-motion`: a simple 400ms gold fade, no liquid.
   Page content must be in the DOM and crawlable beneath the loader; no layout shift
   when it exits; focus moves to the main content afterwards.

### 5.2 Hero
Procedurally generated **obsidian shard** in React Three Fiber: faceted black volcanic
glass with a sharp gold rim light, subtle refraction, slow rotation, mouse-parallax,
and a gold specular sweep on load. No downloaded model: generate geometry in code.
Dynamically import the 3D canvas; show a static SVG/CSS shard poster while it loads
and when WebGL is unavailable. Huge display type interacts with the shard
(overlap, clip, depth).

### 5.3 Scroll choreography
Lenis smooth scrolling wired into GSAP ScrollTrigger (single RAF loop). Each section
has its own distinct reveal; no two sections reveal identically. Required moves:
- SplitText line/char mask reveals on display headings, varied per section.
- Experience as a pinned vertical timeline whose gold line draws with scroll.
- Projects as a pinned horizontal gallery with parallax inside each panel and an
  oversized project index number; each project gets unique generated art
  (see 5.5), tilt on hover, and a clip-path reveal.
- Skills as an editorial index / marquee with velocity-reactive skew, not icon grids.
- Number counters, line-draw SVG, clip-path image reveals, scroll-linked colour
  temperature (gold intensifies near the contact section).
- Custom cursor: small gold dot plus ring that expands over interactive elements
  and shows context labels ("View", "Drag"); hidden on touch devices.
- Magnetic buttons and links with fine-grained easing.
- Section-to-section transitions use clip-path / mask / light sweeps. NOT liquid.

### 5.4 Interface details
Fixed minimal nav (monogram `AS` left, section index and sound toggle right),
full-screen menu overlay with staggered reveal, scroll-progress hairline,
section counter, focus styles in gold, hover states on everything clickable.

### 5.5 Generated assets (create all of them; no external stock)
- `AS` monogram logo + favicon set (SVG, gold on obsidian).
- Dynamic OG/Twitter image via `next/og`.
- Film-grain texture, vignette, and subtle obsidian surface noise (procedural).
- Unique generative art for each project card (SVG or canvas), themed to the
  project: document/ATS scanning lines for the Resume Analyser, vector-space
  constellation for NexoraRAG, hand-landmark skeleton for the Computer Vision
  project. Illustrative, not fake screenshots.
- Optional: generated ambient shard fragments for section dividers.
Keep all assets in `public/` or generated at build time. Record each in `docs/ASSETS.md`.

### 5.6 Extras (all required)
- **Contact form:** Next.js route handler, `zod` validation, honeypot field,
  basic rate limiting, sends via Resend using `RESEND_API_KEY` and
  `CONTACT_TO_EMAIL` from env. If env is missing, degrade gracefully to a
  `mailto:` with prefilled subject/body and show a clear message. Provide
  `.env.example`. Elegant success/error states in theme.
- **Resume download:** button serving `Ansh_Sharma_Resume.pdf` (copy to
  `public/` at build or reference the root copy; one source of truth).
- **Ambient sound toggle:** OFF by default, state remembered, never autoplays.
  Synthesize sounds with the Web Audio API (soft low drone, glassy tick on
  hover, gold-chime on section change). No audio files. Respect `prefers-reduced-motion`
  by default-disabling even the toggle's hover sounds.
- **Custom 404** in theme (a cracked obsidian shard, a route back home).
- **Fallbacks:** `prefers-reduced-motion` gives a calm, fully usable version
  (no pinning, no smooth-scroll, no liquid, no 3D motion); no-WebGL gives the static shard.

## 6. ENGINEERING STANDARDS
- TypeScript strict, ESLint clean, no `any` without a comment.
- All copy lives in `src/content/*.ts`, not scattered in JSX.
- Animations live in hooks/components with proper GSAP context cleanup (no leaks
  under React strict mode / route changes).
- Responsive from 360px up. Desktop 1440 and mobile 390 are both art-directed,
  not merely collapsed. Touch devices get touch-appropriate interactions.
- Performance targets (Lighthouse, production build): Performance 90+ desktop,
  80+ mobile; CLS < 0.05; Accessibility 95+; SEO 95+. Lazy-load Three.js; no
  unused dependencies; fonts via `next/font` with `display: swap` handled correctly.
- Accessibility: semantic landmarks, skip link, keyboard-operable everything,
  visible focus, WCAG AA contrast for text (check gold-on-black and ash-on-black),
  alt text/`aria-label` on generated art, no motion-only information.
- SEO: metadata, OpenGraph, JSON-LD `Person`, sitemap, robots.

## 7. THE LOOP

### Files (create in iteration 1, keep in repo root)
- `PLAN.md`: ordered task list (below), each with a checkbox, a verification gate, and notes.
- `PROGRESS.md`: append-only log: iteration number, task, what changed, evidence
  (commands run, screenshot paths), commit hash, next task.
- `BLOCKERS.md`: open questions for the user and discrepancies found.
- `docs/DESIGN.md`, `docs/ASSETS.md`, `docs/resume-extract.txt`.

### Each iteration, in order
1. **Orient.** Read `PROGRESS.md`, `PLAN.md`, `BLOCKERS.md`, `docs/DESIGN.md`. Run `git status`.
   Pick the first unchecked task. If `BLOCKERS.md` has an unanswered HIGH item that
   blocks it, ask the user now and stop.
2. **Build.** Do only that task. Smallest change that fully completes it.
3. **Verify (gate).** Run `npm run lint`, `npx tsc --noEmit`, `npm run build`.
   Then run the site and capture Playwright screenshots (and short frame sequences
   for animations) at 1440x900, 768x1024 and 390x844 into `docs/shots/<task>/`.
   Open the screenshots and LOOK at them. Check the browser console for errors.
   For motion tasks, capture frames at several timestamps and confirm the motion
   actually happens and is smooth.
4. **Critique.** Score the result against section 3 (palette, type, blacklist) and
   section 5. If anything feels templated, flat, or off-theme, fix it now in the
   same iteration; do not defer polish.
5. **Record.** Tick the task, append to `PROGRESS.md` with evidence, commit
   `feat(<area>): <summary>` (conventional commits) to `feat/obsidian-portfolio`.
6. **Continue or stop.** If tasks remain, start the next iteration. If you hit a
   question only the user can answer, ask and stop. If a verification gate fails
   three times in a row on the same task, stop, write a diagnosis in `BLOCKERS.md`
   and ask the user; do not keep thrashing.

### Task list (copy into `PLAN.md`)
1. Setup, scaffold, tooling, short-path check, content extraction, `DESIGN.md`. *Gate: dev server runs, extraction matches section 4.*
2. Design tokens, fonts, global styles, grain/vignette overlays, Lenis + GSAP wiring, layout shell, nav skeleton. *Gate: smooth scroll works, no hydration warnings.*
3. Content layer (`src/content/*.ts`, `links.ts`), semantic page skeleton with all sections and real copy. *Gate: every fact traced to the PDF.*
4. Generated assets: monogram, favicon, OG image, grain, project art, `ASSETS.md`. *Gate: all render in light inspection at 3 sizes.*
5. **Liquid-gold preloader + reveal** (5.1), including skip, once-per-session, reduced-motion path, real progress. *Gate: frame sequence shows pour, flood, drain; 60fps trace; no CLS.*
6. Hero with R3F obsidian shard, type interplay, poster fallback. *Gate: renders with and without WebGL.*
7. About / summary section with signature composition and reveals.
8. Experience pinned timeline with drawing gold line.
9. Projects pinned horizontal gallery with generated art and hover behaviour.
10. Skills index / marquee, Education, Certifications and achievements.
11. Contact section: form + API route + mailto fallback + resume download + footer. *Gate: valid, invalid, honeypot and no-env cases all tested.*
12. Cursor, magnetic interactions, menu overlay, scroll progress, section transitions.
13. Sound toggle (Web Audio), 404 page, reduced-motion and no-WebGL fallbacks.
14. SEO, metadata, JSON-LD, sitemap; accessibility pass (axe + keyboard walkthrough).
15. Performance pass: Lighthouse on production build; fix to targets; bundle analysis.
16. Final art-direction review: screenshot every section at 1440 and 390, run the
    blacklist audit, fix anything weak. Write a README (run, build, env vars, how to
    swap project links, where assets come from).

### Completion
Stop only when ALL are true: every task ticked; build, lint and type-check clean;
Lighthouse targets met (numbers logged in `PROGRESS.md`); `BLOCKERS.md` has no
unresolved HIGH items; final screenshots reviewed and pass the blacklist.
Then print a short summary (what was built, how to run it, open questions, the
branch name) and finish with exactly:

`<promise>OBSIDIAN_COMPLETE</promise>`

Do not print that line early, and do not print it if any condition above is unmet.

## 8. QUESTIONS TO ASK THE USER (rather than assume), if they arise
- Anything in the PDF that is unreadable, truncated, or inconsistent with section 4.
- Whether to push the branch, open a PR, or deploy (and to which host / domain).
- Resend API key / destination email for the contact form (never ask for passwords).
- Whether the CGPA and phone number should remain visible on a public page.
- Any design choice where two directions are equally defensible and the difference matters.
