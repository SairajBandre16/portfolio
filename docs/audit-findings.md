# Portfolio Audit Findings (2026-10-09)

> **Status (2026-10-09, later):** fixed in code, see `docs/progress.md`. Re-tested in headless Chrome with no console errors. Not reproduced: the self-navigation, theme flips and stray hydration errors. Six agents shared one browser profile, and next-themes syncs the theme across tabs, so those were most likely agents acting on each other's tabs. Still open, and needing Sairaj: make the QueryForge repo public, add GitHub repo descriptions, fix the blog post's spelling, and decide on testimonials.

Audited `http://localhost:3000` (Next.js dev server) via 6 parallel browser-automation agents, from a common-user/recruiter perspective: UI/visual, performance/animation, console/network errors, content/copy, mobile/accessibility, navigation/missing features.

Fix order recommended: scene-director MutationObserver loop first (root cause of the scroll crash) → `app/layout.tsx` JSON-LD script placement → nav-pill opacity + roadmap `overflow-hidden` → content fixes (public QueryForge repo, spelling, casing).

---

## CRITICAL — crashes / breaks site

- **Fast scroll crashes the tab.** React throws 11x `NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.` (from `commitDeletionEffectsOnFiber`/`commitMutationEffectsOnFiber`), reproduced independently 2-4 times. Root cause: [components/signal/scene-director.tsx](components/signal/scene-director.tsx) installs a `MutationObserver` on `document.body` with `{childList:true, subtree:true}` that fires on every DOM mutation anywhere on the page. Its callback does `document.querySelectorAll('[data-scene]')` + `getBoundingClientRect()` (forced sync layout) via `requestAnimationFrame`. Since Framer Motion/React constantly mutate the DOM during scroll-driven animation, the observer re-triggers itself in a feedback loop (mutation → rAF → layout read → sometimes a DOM write that re-triggers the observer). Compounds with the Three.js render loop and Lenis's own rAF all competing for main thread — likely direct trigger for the crash.
- **Clicking into/out of project case studies reliably crashes or breaks layout** (blank narrow column, dark dim overlay stuck at ~30% opacity, wrong theme shown). A fresh hard page load of the same URL renders fine — the bug is specific to the client-side route transition, not the page itself. This is the single most important user journey on the site (recruiter clicking a case study) and it broke almost every time.
- **Page auto-navigates itself with zero input.** Observed 5+ times across fresh reloads: homepage → random project case study (ChainWatch, SQUAWK, Ctrl+Automate, RainWise, QueryForge) after 1-2 seconds idle, no click/scroll from the user. URL and even the route changes on its own. Extremely disorienting for a real visitor — looks like the page is driving itself.
- **Hydration mismatch + React warning**: "Encountered a script tag while rendering React component. Scripts inside React components are never executed when rendering on the client," followed by "Hydration failed because the server rendered HTML didn't match the client." Root cause confirmed in source: [app/layout.tsx:79](app/layout.tsx#L79) renders a raw `<script type="application/ld+json" dangerouslySetInnerHTML={...} />` as a direct child of `<body>`, before `<Providers>`. Move to `next/script` or restructure so it isn't racing hydration. Reproduced once out of several reloads (timing/race-dependent), but risks every route since it's in the root layout.
- **Nav "Work" link inconsistent destination** — one load scrolls to "02 LEARNING PATH" (roadmap), another correctly goes to "03 SELECTED WORK" (project cards). Same link, different result depending on timing — same root instability as above.
- **Theme flips dark/light on its own** between reloads with no toggle click observed in between — flash-of-wrong-theme / hydration-timing issue, needs a deliberate re-test once the above is fixed.

## HIGH — visible UI bugs

- **Nav pill has no opaque background**, on both desktop and mobile. Page headings/body text scroll directly underneath and visually bleed through it on every section (e.g. "automation:", "Ergode", "supply-chain disruptions", "RainWise", email text all show through). Needs a solid or properly blurred backdrop, or reserved top padding on content.
- **Mobile hamburger menu**: "Background" nav label (longest item) overflows its flex container and is clipped by the viewport edge — renders as "Backgrou" with the end cut off. Flex child needs `min-width: 0` / text wrap, not truncation by overflow.
- **Whole page is horizontally scrollable on mobile** (375px width: `document.documentElement.scrollWidth` = 493px vs `innerWidth` 375px — 118px of extra horizontal scroll on the entire page). Root cause: the "Learn. Build. Ship." roadmap section's horizontal-scroll card track (`div.flex.w-max.gap-5.pr-[8vw]`, actual width 2847px) is not wrapped in an `overflow-hidden` ancestor, so the whole page becomes sideways-swipeable on touch, not just the intended pinned carousel.
- **Fixed bottom-left "SPOTTED" plane widget overlaps real content** — sits directly on top of the QueryForge "70.8%" stat number, and overlaps the footer status line in light theme. Needs its own safe zone or increased page bottom padding so it never collides with content.
- **Footer (light theme)**: large outlined "BANDRE" display text is clipped at the right edge of the viewport (horizontal overflow on a standard 1440px screen). The "sairajbandre16@gmail.com" heading at the top of the footer is cut off / overlapped by the nav, arrow icon partially hidden.
- **Decorative particle/radar sphere nearly invisible in light theme** — renders as faint pale-grey dots on the cream background (reads as a smudge), vs strong cyan/green presence in dark theme. Needs a light-theme-specific color/opacity treatment.
- **Hero sometimes loads mid-scroll** on first paint — page starts at the About section with the hero heading partially clipped behind the nav bar, instead of loading at the top.
- **Live "local time" HUD readout** (`MUMBAI, INDIA → DUBLIN, IRELAND · HH:MM LOCAL`) visibly resets to placeholder `--:-- LOCAL` mid-scroll then repopulates — component is unmounting/remounting its interval/effect instead of persisting across scroll.
- **Learning-path roadmap**: two adjacent cards show "IN PROGRESS" simultaneously (one cut off at the viewport edge mid-scroll) while two others say "UP NEXT" — easy to land on a truncated card given the auto-scroll bug above.
- **Email on mobile contact section line-wraps mid-word** (`sairajbandre16@gmail.c` / `om` across two lines) — ugly on small screens. Use a non-breaking construct or shorter display string (keep full address in the `mailto:` href).
- **Stats numeral font** (dot-matrix/pixel style used for "70.8%", "1,034", "3B", "SPOTTED 01") renders crude/jagged at the size used — reads as a broken/placeholder font rather than a deliberate HUD effect. Worth checking rendering or swapping to a cleaner mono face.
- One transient blank black area (~65% of viewport) observed in the Work section during an auto-scroll pass — may be a render glitch tied to the instability above; re-verify once that's fixed.

## PERFORMANCE

- **3+ independent `requestAnimationFrame` loops run concurrently at all times**: a custom GLSL particle shader in [components/signal/engine.ts](components/signal/engine.ts) (up to 10,000 particles on ≥8-core desktops, 6,500 otherwise, 4,200 on narrow viewports) that is never paused when the canvas scrolls out of view (despite `pause()`/`resume()` existing in the code — nothing calls them on scroll-out/visibility-hidden), plus Lenis's own `autoRaf` loop, plus Framer Motion animations. All compete for the main thread every frame — a known compounding cause of scroll jank and the likely driver behind the crash above, on top of the MutationObserver loop.
- `THREE.Clock` deprecation warning fires on every page load/reload ("Please use THREE.Timer instead") — non-fatal but noisy; worth updating.
- Initial load itself is NOT janky: `performance.getEntriesByType('longtask')` returned 0 long tasks, DOMContentLoaded/load were fast (364ms/838ms, 71.6KB transfer) on a clean load with no scrolling. All jank/crash issues are scroll-interaction-triggered.
- Dev server (Turbopack, unminified) ships 25+ separate unbundled JS chunks — expected for `next dev`, not representative of production. Should verify the production build code-splits Three.js/Framer Motion behind lazy boundaries so they're not in the initial bundle (not verified this session — only dev server was reachable).
- Resume download (`/Sairaj-Bandre-Resume.pdf`) confirmed working via direct HTTP request: 200 OK, `Content-Type: application/pdf`, 299,865 bytes, valid PDF v1.7. An earlier "broken" observation in this session was a browser-automation tab-state artifact, not a real site bug — no action needed here.

## CONTENT / COPY

- **QueryForge (stated flagship/current AI project) repo is private** → doesn't appear in the "Latest on GitHub" feed at all (the 6 cards shown are ChainWatch, SQUAWK, ownit, RainWise, MunchMap, Scan-to-Measure). A recruiter scanning the live feed won't find the headline project's code. Already flagged as a TODO in `docs/progress.md` but still live/unresolved. **Fix: make the QueryForge repo public.**
- Several GitHub feed cards have empty repo descriptions (SQUAWK, ownit, RainWise, Scan-to-Measure) — only the ChainWatch card shows explanatory text, the rest are just name/language/date/stars. Sparse vs the CLAUDE.md spec. **Fix: add one-line descriptions to those GitHub repos.**
- **MunchMap card is a totally orphaned, unexplained project** — 0 description, 0 stars, "No language," and never mentioned anywhere else on the site (not in `content/profile.json`, not in `content/projects.ts`). **Fix: add a repo description, or exclude it from the auto-feed if it's not meant to represent current work.**
- American spellings leaking into otherwise-British-English copy: blog post title "Organize Files with Python: Auto-Sort Your Downloads Folder" (should be "Organise"), and project "News Summarizer" (its own description uses British "summarises") — inconsistent with "humanise," "categorised," "favourite," "behaviour," "localisation" used everywhere else.
- **"SQUAWK" casing inconsistent** — all-caps in headings/nav/stack everywhere, but running prose on its own case-study page switches to title case ("Squawk shows every aircraft...", "Squawk started as that one feature..."). Pick one convention and use it consistently.
- **Roadmap vs case-study status contradiction**: the homepage roadmap lists "QueryForge MCP server" as "In progress," but the QueryForge case study states in present tense that the pipeline already works "as an MCP server for Claude Desktop and Cursor" — implies shipped, not in progress. Align the claim one way or the other.
- "Scan To Measure" (Research section, spaced title case) vs "Scan-to-Measure" (GitHub feed, hyphenated repo name) — same project, two visibly different displayed names with no link between them for a reader skimming both sections. Low priority.
- Blog ("Ctrl+Automate," 11 posts, most recent Oct 2-4) is a **fully separate external site/domain with its own different visual design** — pulls the visitor out of the portfolio's crafted feel instead of being an integrated `/blog` route.
- No fabricated/corporate-speak claims found. No literal "TODO"/"Lorem ipsum"/"placeholder"/"coming soon" visible anywhere on the live site (the one TODO in `content/projects.ts` line 238 is a code comment, not rendered). No broken narrative flow Hero → About → Learning path → Projects → GitHub → Background → Contact. Contact info (email, LinkedIn, GitHub, résumé, "Say hello") all render correctly.

## MISSING FEATURES

- No testimonials / recommendations / social proof anywhere on the site (confirmed absent from `components/` and `content/`).
- No search or filter/sort control for projects — 9 projects presented as a flat curated list only.
- No star-count/traction indicator on the curated project cards themselves (only visible in the separate "Latest on GitHub" feed).
- No breadcrumb/pagination between case studies beyond a single "All projects" back-link.
- Blog is not portfolio-native (separate domain/design, see above) — consider an integrated `/blog` or at least matching visual treatment.

## ACCESSIBILITY — confirmed GOOD, no action needed

- All `<img>` elements have alt text (0 missing, checked via `document.querySelectorAll('img:not([alt])').length`).
- All 57 checked interactive elements (nav links, theme toggle, hamburger, project links, social links, résumé link, etc.) have a visible focus outline (solid, ~1.6px) and a non-empty accessible name.
- Heading structure is clean: exactly one `<h1>`, h2s per major section, h3s nested correctly, no skipped levels across 36 headings.
- `prefers-reduced-motion` media query present in at least one stylesheet — reduced-motion handling exists (not exhaustively verified per-animation).
- Skip-to-content link present, first focusable element in DOM order, functional via real Tab keypress.
- Note: full manual tab-order verification across the *entire* page wasn't completed end-to-end — synthetic Tab keypresses in the test environment were inconsistent (testing-method limitation, not a confirmed bug). Recommend one manual human keyboard pass through nav → project cards → GitHub cards → contact links before shipping.

## MINOR / COSMETIC

- `/favicon.ico` 404s. `app/icon.svg` exists and is correctly linked in `<head>`, so modern browsers render the icon fine — this is cosmetic only.
- "BEFORE / Automation Executive, Ergode / Jan – Jul 2026, after an AI internship" — dates read as future/upcoming (2026) under a "BEFORE" label, momentarily confusing on a quick scan.

## TOOLING NOTES (not site bugs, for context)

- `resize_window` did not actually change the browser viewport in this test environment (stayed at desktop width regardless of requested size) — true native mobile-viewport testing was done via a scaled-iframe workaround instead. Recommend a real manual pass with Chrome DevTools device toolbar or an actual phone before shipping, to confirm the mobile findings above and catch anything the workaround couldn't.
- During mobile hamburger-menu testing, one stray click navigated the automated browser to the user's real logged-in LinkedIn profile page (no data entered, no actions taken — just a page view). Worth checking if that tab is still open in your actual Chrome.

---

## Suggested fix order

1. [components/signal/scene-director.tsx](components/signal/scene-director.tsx) — remove/scope the `MutationObserver` feedback loop (root cause of scroll crash).
2. [app/layout.tsx:79](app/layout.tsx#L79) — move JSON-LD `<script>` to `next/script` or restructure to stop the hydration-mismatch race.
3. Nav pill — give it an opaque/blurred background on all viewports.
4. Roadmap horizontal-scroll track — wrap in `overflow-hidden` ancestor to stop whole-page horizontal scroll on mobile.
5. Pause the Three.js particle engine ([components/signal/engine.ts](components/signal/engine.ts)) when its canvas is scrolled out of view (call the existing `pause()`/`resume()`).
6. Mobile hamburger "Background" label clipping; footer clipping in light theme; "SPOTTED" widget collision with content.
7. Content: make QueryForge repo public, fix American-spelling leaks, align SQUAWK casing, fix roadmap/case-study status contradiction, add missing GitHub repo descriptions.
8. Nice-to-haves: testimonials, project search/filter, integrated blog route.
