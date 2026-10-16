# Progress

## 2026-10-16: footer balance
- Footer reads "Thanks for stopping by." with "Made by Sairaj Bandre." under it.
- Skyline split exactly in half at the sun/moon: Mumbai on the left, Dublin on the right. Dublin gained a Georgian terrace with painted doors, Liberty Hall, Docklands offices and a taller Beckett Bridge and Poolbeg chimneys; Christ Church and the Four Courts moved forward. The Convention Centre and Aviva were dropped to keep it uncluttered.

## 2026-10-16: SQUAWK film, Mumbai + Dublin skyline, new logo
- SQUAWK intro film and poster (from the SQUAWK repo's `assets/promo`) are in `public/projects/`. The poster is SQUAWK's screen everywhere; the film plays on hover in the gallery (nothing downloads until then) and with controls on the case study.
- Footer now just says "Made by Sairaj Bandre." over a combined Mumbai and Dublin waterfront drawn as layered silhouettes, with day and night versions.
- New "S." logo for the favicon, SVG icon and Apple touch icon.

## 2026-10-16: shorter intro, richer footer
- Intro trimmed: no QueryForge sentence, no papers clause, "MSc student at UCD". Punctuation and hyphenated words no longer wrap on their own.
- Sign-off "Thanks for stopping by." now set large in two-tone Bricolage Grotesque; Instrument Serif dropped.
- Skyline rebuilt as an engraving with depth, reflection, day/night and gentle motion (see design notes). Reduced motion freezes clouds, boat, water, gulls and lights, and parks the plane.

## 2026-10-16: v3 "Quiet" redesign
- Rebuilt the home page around a single paragraph intro with inline project icons, hover previews and social tiles, beside a drifting column of project screens (swipeable row on phones). See `docs/design-notes.md`.
- Removed the learning path section and its roadmap data, the particle field, nav, command menu, scroll progress and plane-spotter. Dropped three, lenis, motion and simple-icons.
- New: departures-board clock (Dublin, Mumbai), sliding theme switch, quiet index (work, experience, papers, GitHub, writing, toolbox) with hover dimming and cursor-following screenshots, Dublin skyline footer with a plane on approach.
- Case studies and the 404 page restyled to match. Screenshots of QueryForge, OwnIt and Ctrl+Automate captured from the live sites into `public/projects/`.
- Checked at 375, 768, 1280, 1536 and 1920 px in dark and light, with reduced motion and keyboard only. No horizontal scroll, no console errors.

## 2026-10-09: type scale + hero story
- **Hero 3D tells one story now: an invoice chore, automated.** Hand-filled invoices drift in from the left, tilted and scribbled on; the neural core reads each one; it leaves as a clean row in a spreadsheet. When six rows are in, a check lands, the sheet clears and the next batch starts (12 s loop). Invoices and rows share one cycle clock in the shader (new `feed` and `write` flow modes), so they stay in step. HUD captions: Manual · AI · Automated. Reduced motion shows one frozen mid-batch frame.
- **Hero copy**: "Hi, I'm" in regular weight with only **Sairaj.** in extra-bold (Syne now loads as a variable font); the line under it is regular weight. Looser line height, so nothing collides when the headline wraps.
- **About**: shorter statement with no Mumbai/Dublin, set smaller.
- **Smaller type everywhere**: display, lead, h3 and mega tokens scaled down; project titles, stats (no longer touching), contact heading and email, GitHub and case-study headings all reduced.
- **Background**: years no longer run into the organisation label; role titles and paper years smaller.
- **Nav**: collapses to the menu button below 1024 px, so the Résumé button no longer clips on tablets. The hero scene now fits by its reach on narrow screens.

## 2026-10-09: audit fixes + hero pipeline
- **Hero 3D is now an automation pipeline**: messy input drifts in from the left, a spinning neural lattice (with signal pulses running along its edges) does the thinking, and tidy packets leave along four lanes into small action terminals. Every particle carries its own path, so the motion runs entirely in the shader. HUD captions (Ingest · Reason · Act) are pinned to points the engine projects to the screen; desktop only. On phones the pipeline sits above the headline.
- **Command menu** (Ctrl/⌘ K, or the ⌘K button in the nav): jump to any section or case study, copy the email, download the résumé, switch theme, or call in a plane to spot.
- **Stability**: SceneDirector uses an IntersectionObserver band instead of a body-wide MutationObserver plus layout reads on every mutation. Lenis now rides Motion's frame loop (one fewer rAF). The particle engine uses `THREE.Timer` (no deprecation warning) and a slightly lower particle count.
- **Anchors**: the Learning path height comes from CSS (`.path-runway`), so `/#work` and reloads land in the right place instead of inside the pinned section.
- **Layout**: solid nav pills plus a top scrim; mobile menu sized to fit "Background"; no horizontal scroll on phones (the Contact heading and long project titles were the culprits; titles now wrap after "+"); email wraps only at the @; footer name no longer clips; the Spotted counter moved into the nav.
- **Readability**: stats and years use the display face (the dot-matrix font made "70.8%" read as "70,8%"); particles are stronger in the light theme and quieter behind text on phones.
- **Content**: SQUAWK casing, "News Summariser", roadmap now says the QueryForge MCP server is shipped and ChainWatch is in progress; GitHub feed hides MunchMap and fills empty repo descriptions from the site's own copy; case studies get previous/next links; `/favicon.ico` added; JSON-LD escapes `<`.
- Checked in headless Chrome at 1536, 1440, 390 and 375 px, dark and light: fast random scrolling, case-study round trips and back/forward produce no console errors.

## 2026-10-09: declutter pass
- Hero now opens with "Hi, I'm Sairaj." and the UCD / AI / Claude Code line, plus a Mumbai → Dublin location line. The big split name moved to the footer as a sign-off.
- Removed the Playground section, the scene HUD, the role ticker, the "Building QueryForge" chip and every "built with Claude Code" badge and footer line.
- Projects reordered: QueryForge, OwnIt, SQUAWK, Ctrl+Automate (blog, with the three latest posts from its RSS feed), Life automated, RainWise, ChainWatch.
- New particle shapes: a 3D airliner (SQUAWK), meshing gears (automations), rain cloud (RainWise), document with check (OwnIt) and Ctrl + A keycaps (Ctrl+Automate).
- Background timeline groups both Ergode roles under one entry with exact month ranges. Toolbox marquee has an icon for every skill (Simple Icons for brands, Lucide for concepts).
- GitHub feed hides Fake-Instagram-Account-Detection and Creditcard-fraud. Nav and contact link to the blog.

## 2026-10-09: v2 redesign ("Signal")
- Replaced the flight-deck design with a scroll-morphing three.js particle field, per-section colour scenes and new type (Syne, Bricolage Grotesque, Martian Mono, Doto). See `docs/design-notes.md`.
- New sections: hero with scramble name, scroll-lit About, horizontal learning path, full-screen project blocks, Playground (agent terminal, bot builder, secrets tracker), GitHub bento, Background (timeline, papers, skills marquee), Contact.
- Plane-spotting easter egg and scene HUD on every page; case studies share the particle field.
- Removed the Ergode project and warehouse copy; Ergode appears only in the timeline.
- Lint, type-check and `next build` pass. Checked visually at 1536, 1100, 768 and 375 px, dark and light.

## Next
1. Lighthouse run on a production build; keyboard-only pass.
2. Deploy to Vercel (needs a GitHub repo; ask first).

## TODO for Sairaj
- Make the QueryForge repo public (the flagship is missing from the live GitHub feed), and add one-line descriptions on GitHub for SQUAWK, ownit, RainWise and Scan-to-Measure (the site shows fallbacks until then).
- Blog post title "Organize Files with Python…" uses American spelling; it comes from the blog's RSS feed, so fix it on the blog.
- Testimonials or recommendations: only if you have real ones (e.g. from Ergode or UCD) you're happy to publish.
- Paper links or DOIs for RainWise (ICCCNT 2025) and Scan To Measure (IJRTI 2023); none were found online.
- QueryForge repo is private: make it public, or keep linking only the live demo.
- Personal automations (Daft.ie alerts, job scraper): stack, whether they were built with Claude Code, and repo links if public.
- Confirm the résumé PDF (phone removed) is the version you want public.
- Custom domain, if any (set `NEXT_PUBLIC_SITE_URL`).
