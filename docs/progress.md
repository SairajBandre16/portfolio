# Progress

_Paused on 2026-10-09 at Sairaj's request._

## Done
- Resume read (`content/Sairaj_Bandre_Resume_AI.docx`) and structured into `content/profile.json`.
- Reference sites studied; direction written up in `docs/design-notes.md` ("Flight deck": sections as flight levels, radar hero, departures-board GitHub feed).
- Next.js 16.4 + Tailwind v4 scaffold, design tokens (dark-first, signal amber, light theme), Geist / Geist Mono / Instrument Serif, Lenis, Motion, next-themes.
- Built: nav pill with active section, scroll-progress bar, altimeter readout, HUD reticle, grain overlay, hero (radar + live Dublin clock + typed roles), About + "How I learn", flight-plan roadmap, projects bento + archive list, GitHub departures board (`'use cache'` hourly, fallback JSON), Experience + Education, Research, Skills, Contact/footer.
- Case-study route `/projects/[slug]`, 404 page, OG image, favicon, sitemap, robots, JSON-LD.
- `public/Sairaj-Bandre-Resume.pdf` exported from the .docx with the phone number removed.
- Type-check passes; all routes return 200 in dev. Visually checked at desktop width: hero, About, flight plan, projects, archive.

## Next
1. Finish the visual review: GitHub board, Experience, Research, Skills, Contact, a case-study page, light theme.
2. Polish: hero headline slightly smaller at short viewports; the archive list's columns at desktop width need tightening.
3. QA: screenshots at 375 / 768 / 1280 / 1920, keyboard-only pass, reduced motion, `npm run build`, Lighthouse, lint.
4. Deploy to Vercel (needs a GitHub repo; ask first).

## TODO for Sairaj
- Paper links or DOIs for RainWise (ICCCNT 2025) and Scan To Measure (IJRTI 2023); none were found online.
- QueryForge repo is private: make it public, or keep linking only the live demo.
- Personal automations (Daft.ie alerts, job scraper): stack, whether they were built with Claude Code, and repo links if public.
- Confirm the résumé PDF (phone removed) is the version you want public.
- Custom domain, if any (set `NEXT_PUBLIC_SITE_URL`).
