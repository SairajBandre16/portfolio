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

## Direction v2: "Signal" (2026-10-09)

Sairaj found v1 (flight deck) too safe: familiar layout, default-looking fonts, too much warehouse detail. v2 was shaped by the perfolios.shwn.design gallery, where the memorable sites are built around one interactive world you can play with (Chloe Yan's garden is the clearest example).

- **One living particle field.** A single fixed three.js canvas sits behind every page. About 10k particles morph into a new shape per section: neural core (hero), "SB" initials (about), neural net (learning path), database / globe / plane / torus-knot loop (one per project), wave field (playground), helix (GitHub), galaxy (background), "hi!" (contact). Sections declare `data-scene`; `SceneDirector` publishes the active one on `<html data-scene>`.
- **Colour per scene.** Six signal colours (lime, coral, cyan, sky, pink, yellow). Each scene owns a pair, and `--accent` / `--accent-2` are registered with `@property`, so the whole UI re-tints smoothly as you scroll. The engine reads the same CSS variables, so the palette has one source of truth.
- **Play.** Particles flee the cursor and ripple when you click empty space; the hero letters scramble on hover; an "ask my agent" terminal (a keyword router that admits it is not an LLM); a wire-a-bot builder; a plane-spotting easter egg; and a "secrets found 0/5" tracker tying them together.
- **Type.** Syne (display, 800), Bricolage Grotesque (body), Martian Mono (labels), Doto (dot-matrix numbers). No Geist, Inter or Instrument Serif.
- **Layout.** Giant split name (outlined second line), scroll-lit manifesto, a horizontal-scroll learning path, full-height project blocks where the particles are the diagram, a GitHub bento, and a huge contact headline.
- **Content.** About Sairaj, not warehouses. The Ergode project card is gone; Ergode appears only as two one-line timeline entries.

### Performance and accessibility
- three.js is dynamically imported after first paint (separate ~136 KB gzip chunk). Particle count scales with screen size and CPU cores. The canvas pauses when the tab is hidden.
- `prefers-reduced-motion`: no Lenis, no drift, instant morphs (a static frame per scene), no plane flights, static text.
- No WebGL: the canvas is simply skipped; the page is complete without it.
