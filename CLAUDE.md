# CLAUDE.md — Sairaj Bandre's Portfolio Website

You are building a personal portfolio website for **Sairaj Bandre**. **The UI is the main goal.** The site should feel crafted, memorable and fast, not like a template. Work in small, verifiable steps, run the dev server often, and look at the result (screenshots at mobile, tablet and desktop widths) before calling anything done.

Use British English in all copy (optimised, organisation, programme).

---

## 1. Before you write any code

1. **Read the resume.** It lives at `content/resume.pdf` (Sairaj will drop it there; if it is missing, stop and ask for it). Extract: work experience, education, skills, the two research papers (titles, venues, years, links), achievements, and the contact line. Save the structured result to `content/profile.json` and use that as the single source of truth for all copy. Never invent employers, dates, metrics or paper titles. If something is not in the resume, leave a clearly marked `TODO` and list it for Sairaj at the end.
2. **Study the reference sites for inspiration only. Do not copy layouts, copy text, code, or assets.** Open each one (browser tool or fetch), note what makes it feel good (hero treatment, typography, motion, project cards, navigation, footer), and write a short `docs/design-notes.md` with your observations and the original direction you will take. References:
   - kushbothra.com, manixh.vercel.app, ozgurguler.tech, mukundkapoor.com, sahilcodex.vercel.app
   - rahulgg.in, nurlab.xyz, ashishgogula.in, devchauhan.in, anjil.ink
   - priyanshu.me, nikhilwho.in, srbh.site, royalbeck.design
3. Propose the design direction (see section 4) in a few lines, then build.

---

## 2. About the person (use as the narrative spine)

- **Name:** Sairaj Bandre. **Location:** Dublin, Ireland (city only, nothing more specific).
- **Now:** MSc Computer Science (Negotiated Learning) at University College Dublin, 2026 – 2027.
- **Before:** Executive, Supply Chain Management and Automation Operations at Ergode Ecommerce, India. Built Python-based RPA and automation tooling that ran real warehouse operations.
- **Goal:** Become an **AI Engineer** (also Applied AI Engineer / ML Engineer / Data Scientist). He is actively learning AI and **building projects with Claude Code**. This must be obvious within the first screen of the site.
- **Credentials:** two published research papers (get details from the resume).
- **Skills:** Python, RPA, n8n, business process automation, data management, plus the ML/AI stack from his projects.
- **Personality:** practical builder who automates things that annoy him (apartment alerts, job alerts), has a creative, design-minded side, and enjoys plane-spotting (Flightradar). Let this show in the tone and in small details. Warm, direct, slightly playful, never corporate.
- **Links:** GitHub `github.com/SairajBandre16` · LinkedIn `linkedin.com/in/sairajbandre` · email from the resume (via a `mailto:` link). Do not render the phone number publicly.

### Positioning line (iterate on wording, keep the idea)
"From automating warehouses to building AI systems." A logistics-automation engineer turning into an AI engineer, shipping a project at a time with Claude Code.

---

## 3. Content and sections

Single-page site with smooth anchor navigation, plus a dedicated `/projects/[slug]` route for case studies. Sections in order:

1. **Hero.** Name, rotating or typed role line ("aspiring AI Engineer", "building with Claude Code", "ex-automation engineer"), one-sentence pitch, primary CTAs (View projects, Resume download, Contact). A live "Currently building / Currently learning" chip is strongly encouraged.
2. **About.** Short, personable story: supply-chain automation → MSc in Dublin → AI engineering. Include the plane-spotting detail lightly. A "How I learn" strip: learn a concept → build a project → ship it on GitHub, with Claude Code as pair-programmer.
3. **Currently learning / roadmap.** A visual learning path (LLMs, agents, RAG, evaluation, text-to-SQL, ML fundamentals, NLP from the UCD Text Analytics module). Make it a tasteful animated timeline, not a skills bar chart.
4. **Featured projects.** Hand-curated cards with case-study pages:
   - **QueryForge**: natural-language-to-SQL agent evaluated on the Spider benchmark. Current flagship AI project, built with Claude Code.
   - **ChainWatch**: AI supply-chain disruption early-warning system. Links his domain background to AI. Present it honestly (in progress / paused if that is what the repo shows).
   - **SQUAWK**: 3D Three.js plane-tracking / plane-spotting project (`SairajBandre16/SQUAWK`). The visually fun one; consider a live demo or looping video.
   - **Ergode automation work**: invoice/pallet-tracking pipeline (Gmail → Sheets → Excel with AI-generated insights and an HTML email report) and a returns-processing RPA (Selenium, barcode scanning, OCR with PaddleOCR, Sheets lookups). Describe outcomes from the resume; do not publish confidential company data, internal names or screenshots.
   - **Personal automations**: Daft.ie apartment-alert pipeline and a daily job-alert scraper that emails fresh listings. Frame as "I automate my own life".
5. **Latest on GitHub** (see section 5). Auto-updating, visually distinct from the curated cards.
6. **Experience.** Timeline from the resume (Ergode Ecommerce, then education). Impact-led bullets with numbers where the resume has them.
7. **Research.** The two papers, with title, venue, year and a link or DOI.
8. **Skills.** Grouped (AI/ML, Automation, Data, Tools). An animated tech marquee or grid with icons is fine. Keep it honest; don't list what he can't back up.
9. **Contact.** Big, confident footer CTA, email, LinkedIn, GitHub, resume download. A simple form is optional (server action plus Resend, or just `mailto:`).

---

## 4. Design direction (this is the priority)

Aim for a **premium, dark-first, editorial-meets-technical** feel with one distinctive idea running through it. Suggested concept: **"flight deck / radar"**, a subtle nod to his plane-spotting hobby: thin grid lines, mono-spaced HUD-style labels (e.g. `LAT 53.34 / LON -6.26` for Dublin), a soft radar-sweep or flight-path motif, section labels styled like callsigns. Keep it tasteful and restrained, not gimmicky. If you find a stronger original concept while studying the references, propose it first.

Principles:
- **Typography does the heavy lifting.** One characterful display face plus a clean sans and a mono. Good options: Geist / Geist Mono, Inter Tight, Instrument Serif or Fraunces for accents, JetBrains Mono. Use a fluid type scale with `clamp()`. Avoid default-looking system stacks.
- **Colour:** near-black background (not pure `#000`), one sharp accent (e.g. electric lime, signal amber or cyan), neutral greys for hierarchy. Include a light theme via `next-themes`, with the toggle in the nav. Define everything as CSS variables / Tailwind tokens.
- **Motion with purpose.** Smooth scrolling, staggered reveals, magnetic buttons, hover-lift cards, a scroll-progress bar, section transitions. Every animation must respect `prefers-reduced-motion`. Target 60 fps; animate `transform` and `opacity` only.
- **Layout:** generous whitespace, strong grid, bento-style project layout, sticky floating nav pill with active-section highlighting, custom cursor on desktop only (hidden on touch).
- **Details that make it feel expensive:** subtle noise/grain overlay, gradient borders and spotlight hover effects on cards, view transitions between project pages, skeleton states, a tasteful 404 page, proper favicon and OG image.
- **Avoid:** purple-to-blue gradient clichés, glassmorphism everywhere, stock illustrations, emoji as icons, lorem ipsum, centred-everything layouts, walls of identical cards.

### Skills and libraries to use
Before building UI, load and follow any available design skills (e.g. `frontend-design`, `design-taste-frontend`, and `redesign-existing-projects` for the polish pass). Prefer these libraries:

| Purpose | Use |
|---|---|
| Framework | **Next.js (App Router) + TypeScript** |
| Styling | **Tailwind CSS v4** with design tokens |
| Components | **shadcn/ui** as the base, restyled to match the theme |
| Animated components | **Magic UI**, **Aceternity UI**, **React Bits** (cherry-pick, restyle, never leave default looks) |
| Animation | **Motion** (`motion/react`); **GSAP + ScrollTrigger** for scroll storytelling if needed |
| Smooth scroll | **Lenis** |
| 3D (hero accent or SQUAWK section only) | **React Three Fiber + drei**; lazy-load and fall back to a static image on low-power devices |
| Icons | **Lucide** and **Simple Icons / devicons** for tech logos |
| Fonts | `next/font` (Geist, plus one display face) |
| Theming | **next-themes** |
| Content | Typed data files / MDX for case studies (`content/projects/*.mdx`) |
| GitHub data | **Octokit** (REST) |
| Deploy | **Vercel** |

Keep the dependency list lean. Add a library only when it earns its place, and check bundle size.

---

## 5. "Latest on GitHub" feature (must work)

- Fetch from the GitHub API for user **`SairajBandre16`**: public repos, non-forks, sorted by `pushed_at` descending, show the **6 most recently active**.
- Each card: repo name, description, primary language (with colour dot), stars, last-pushed relative time ("2 days ago"), topics, and links to the repo and live demo (`homepage`) if set.
- Fetch on the server with **ISR** (`revalidate: 3600`). Use an optional `GITHUB_TOKEN` env var for rate limits, read only server-side. **Never commit tokens.** Provide `.env.example`.
- Graceful fallback to a committed `content/github-fallback.json` if the API fails or rate-limits. Never show a broken or empty section.
- Optionally add a contribution-activity heatmap styled to the theme and a "currently building" indicator derived from the most recently pushed repo.
- Badge the Claude Code-built repos (via a `built-with-claude-code` topic or a manual list in config).

---

## 6. Engineering standards

- TypeScript strict mode. ESLint + Prettier. No `any` without a comment.
- Mobile-first and fully responsive. Test at 375, 768, 1280 and 1920 px.
- **Accessibility:** semantic HTML, visible focus states, proper heading order, alt text, AA contrast, full keyboard navigation, skip-to-content link.
- **Performance:** Lighthouse 95+ on Performance, Accessibility, Best Practices and SEO. Use `next/image`, lazy-load heavy components (3D, marquee), no layout shift, preload the display font.
- **SEO:** metadata API, Open Graph and Twitter cards (dynamic OG image), `sitemap.xml`, `robots.txt`, JSON-LD `Person` schema.
- Resume download served from `/public/Sairaj-Bandre-Resume.pdf`.
- Optional privacy-friendly analytics (Vercel Analytics); nothing that needs a cookie banner.
- Keep components small and organised by feature. Keep all copy in `content/`, not buried in JSX.
- Commit in small logical commits with clear messages.

Suggested structure:
```
app/            layout.tsx, page.tsx, projects/[slug]/page.tsx, not-found.tsx, opengraph-image.tsx
components/     hero/ about/ projects/ github/ experience/ ui/
content/        profile.json, projects/*.mdx, github-fallback.json, resume.pdf
lib/            github.ts, utils.ts
docs/           design-notes.md
public/
```

---

## 7. Workflow

1. Read the resume, study the references, write `docs/design-notes.md`, state the design direction (short checkpoint with Sairaj).
2. Scaffold: Next.js + Tailwind + shadcn + fonts + theme tokens + Lenis.
3. Build in this order: layout shell and nav → hero → curated projects → GitHub section → experience/research → about/learning path → contact/footer.
4. Polish pass: motion, hover states, empty/loading/error states, dark/light, reduced motion.
5. QA pass: responsive screenshots, keyboard-only run, Lighthouse, broken links, spelling (British English), no placeholder text left.
6. Deploy to Vercel and share the preview URL.

## 8. Rules

- Do not copy any reference site's layout, wording, code or assets.
- Do not fabricate facts about Sairaj. Anything unknown becomes a `TODO` surfaced in the final summary.
- Do not expose confidential Ergode data, secrets, phone number or a home address.
- Ask before adding paid services or large dependencies.
- When finished, give a short summary: what was built, what is still `TODO`, and how to run it (`npm install && npm run dev`).