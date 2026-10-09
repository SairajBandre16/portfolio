# Design notes

## What the references do well

Studied for inspiration only. Nothing below is copied: no layouts, copy, code or assets.

| Site | What works |
|---|---|
| kushbothra.com | A live local clock and an "available for…" line make the page feel inhabited. Projects are numbered ("project 01") with a date and category tags. |
| mukundkapoor.com | Geist, light/dark settings, clear section rhythm (work, experience, writing, personal). Small personal touches like sketches. |
| sahilcodex.vercel.app | Status badge ("open for work"), projects with a Building/Live status tag plus live and GitHub buttons, a GitHub activity section, and a closing CTA that appears on scroll. |
| rahulgg.in, anjil.ink, devchauhan.in | Restraint: list-style work entries (title, year, one line), external-link arrows, and a live clock for the author's city. |
| ashishgogula.in | Machine-readable extras (llms.txt, markdown pages), and a footer that doubles as a site index. |
| nurlab.xyz, royalbeck.design | One memorable personal motif (a watercolour pond, a draggable pixel twin) does more than a dozen effects. |
| priyanshu.me, nikhilwho.in | One featured project with a large image, then a quieter list. Contribution graph. |
| manixh, ozgurguler, srbh | Client-rendered, so little could be read. No notes. |

Common threads: one personal motif, a live "now" signal (clock, status, currently building), honest status tags on projects, and typography doing most of the work.

## Direction: "Flight deck"

The site is a climb. Sairaj starts on the ground (warehouse automation) and climbs towards cruise (AI engineer). The plane-spotting hobby gives the visual language.

- **Altitude as navigation.** Each section has a flight level (`GND`, `FL010`, `FL020` … `FL090`). A small altimeter readout on desktop shows the current level as you scroll. The metaphor carries the narrative without explaining it.
- **Radar scope in the hero.** An SVG radar with a slow sweep. The blips are his projects, labelled with callsigns (`QFG-01`, `SQK-03`). They light up as the sweep passes. Pure SVG and CSS transforms: no WebGL in the hero.
- **HUD labels.** Geist Mono for coordinates (`53.35°N 6.26°W`), a live Dublin clock, status chips and section labels.
- **Flight plan for learning.** The roadmap is a route with waypoints marked logged, en route or planned. The line draws itself as you scroll.
- **Departures board for GitHub.** The live GitHub feed is a board of rows (repo, language, stars, last push), visually distinct from the curated bento cards above it.

### Type
- Geist for UI and body, Geist Mono for HUD labels and numbers.
- Instrument Serif italic as the single editorial accent, used sparingly in headlines.
- Fluid scale with `clamp()`.

### Colour
- Dark-first. Background `#0d0e10` (near-black, slightly cool), raised surfaces a step lighter, hairlines at ~8% white.
- One accent: **signal amber**, like cockpit annunciators and his GitHub profile's orange. Desaturated for dark mode and darkened for AA on the light theme.
- Light theme is warm paper (`#f3f1ec`) with near-black ink.

### Motion
- Lenis smooth scroll, staggered reveals, magnetic CTAs, spotlight borders on cards, a scroll-progress bar and a radar sweep. Transform and opacity only.
- A small HUD reticle follows the cursor on fine-pointer devices. The native cursor stays visible.
- `prefers-reduced-motion` turns off Lenis, the sweep, the reticle, marquees and reveals.

### Avoided on purpose
Purple gradients, glassmorphism everywhere, emoji, skill bars, three identical cards in a row, centred-everything layouts, and replacing the native cursor.

### Deviations from CLAUDE.md (and why)
- **No Octokit:** a typed `fetch` with Next's `'use cache'` and `cacheLife('hours')` does the same job with no dependency.
- **No shadcn/ui install yet:** the site needs only a handful of primitives, so they're hand-built with the same token approach. It can be added later if forms grow.
- **No React Three Fiber:** SQUAWK already is the 3D piece, so the portfolio shows its real screenshots and links to the live app instead of shipping a second 3D bundle.
- **Typed data in `content/projects.ts` instead of MDX:** same "copy lives in content/" rule, with no MDX toolchain.
