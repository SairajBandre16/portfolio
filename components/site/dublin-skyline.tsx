// An engraving of Dublin along the Liffey, east (left) to west (right): the Poolbeg
// chimneys, the Convention Centre, the Samuel Beckett Bridge, the Jeanie Johnston tall
// ship, the Custom House, Liberty Hall, the Spire, the Ha'penny Bridge and a Georgian
// terrace, with the Dublin Mountains and Christ Church behind. The city is mirrored in the
// river. A plane comes in to land, clouds drift and a river boat crosses. In the dark theme
// the windows light up, the moon and stars come out and the sun goes down (see globals.css).
// Everything is generated here from a few numbers, so strokes stay crisp at any width.

type P = [number, number];

const W = 1440;
const H = 470;
/** Quay line: buildings stand on it, the river starts below it. */
const G = 290;

const r = (n: number) => Math.round(n * 10) / 10;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const pt = ([x, y]: P) => `${r(x)} ${r(y)}`;

function cubic(p0: P, p1: P, p2: P, p3: P, t: number): P {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
}

function quad(p0: P, p1: P, p2: P, t: number): P {
  const u = 1 - t;
  return [
    u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
    u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
  ];
}

/** Small deterministic random, so the server and every reload draw the same city. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const solid = { fill: "var(--bg)" } as const;
const HATCH = "url(#sk-hatch)";
const HATCH_FINE = "url(#sk-hatch-fine)";
const BRICK = "url(#sk-brick)";

/** Window panes, split into ones that light up at night and ones that stay dark. */
function Windows({
  rects,
  seed,
  share = 0.45,
}: {
  rects: [number, number, number, number][];
  seed: number;
  share?: number;
}) {
  const rand = seeded(seed);
  const lit: string[] = [];
  const dark: string[] = [];
  for (const [x, y, w, h] of rects) {
    (rand() < share ? lit : dark).push(`M${r(x)} ${r(y)} h${w} v${h} h${-w}Z`);
  }
  return (
    <>
      <path d={dark.join(" ")} {...solid} strokeOpacity={0.6} />
      <path d={lit.join(" ")} className="lit" strokeOpacity={0.6} />
    </>
  );
}

function grid(x0: number, x1: number, y0: number, y1: number, dx: number, dy: number, w: number, h: number) {
  const out: [number, number, number, number][] = [];
  for (let x = x0; x + w <= x1; x += dx) for (let y = y0; y + h <= y1; y += dy) out.push([x, y, w, h]);
  return out;
}

/* ---------- Sky ---------- */

function Stars() {
  const rand = seeded(11);
  const stars = Array.from({ length: 56 }, (_, i) => ({
    x: r(rand() * W),
    y: r(8 + rand() * 170),
    s: r(0.6 + rand() * 0.9),
    twinkle: i % 4 === 0,
    d: r(-rand() * 4),
  }));
  return (
    <g className="night" fill="currentColor" stroke="none">
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.s}
          className={s.twinkle ? "twinkle" : undefined}
          style={s.twinkle ? ({ "--d": `${s.d}s` } as React.CSSProperties) : undefined}
        />
      ))}
    </g>
  );
}

function SunAndMoon() {
  const [cx, cy] = [292, 64];
  const rays: string[] = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    rays.push(
      `M${pt([cx + Math.cos(a) * 25, cy + Math.sin(a) * 25])} L${pt([cx + Math.cos(a) * (i % 2 ? 31 : 35), cy + Math.sin(a) * (i % 2 ? 31 : 35)])}`,
    );
  }
  return (
    <>
      <g className="day">
        <circle cx={cx} cy={cy} r={19} {...solid} />
        <circle cx={cx} cy={cy} r={19} fill={HATCH_FINE} stroke="none" />
        <path d={rays.join(" ")} strokeOpacity={0.7} />
      </g>
      <g className="night">
        {/* A crescent: the disc with an offset disc masked out of it. */}
        <mask id="sk-moon" maskUnits="userSpaceOnUse" x={cx - 24} y={cy - 24} width={48} height={48}>
          <rect x={cx - 24} y={cy - 24} width={48} height={48} fill="#fff" />
          <circle cx={cx + 8} cy={cy - 5} r={16} fill="#000" />
        </mask>
        <circle cx={cx} cy={cy} r={19} fill="var(--window)" fillOpacity={0.85} stroke="none" mask="url(#sk-moon)" />
      </g>
    </>
  );
}

const CLOUD =
  "M0 0 C-4 -9 7 -15 15 -10 C18 -21 38 -22 43 -10 C50 -16 63 -11 61 -2 C67 -1 68 6 61 7 L4 7 C-4 7 -6 1 0 0 Z";

function Clouds() {
  const clouds = [
    { x: 1520, y: 92, s: 1.25, t: 230, d: -40 },
    { x: 1520, y: 58, s: 0.9, t: 260, d: -150 },
    { x: 1520, y: 132, s: 0.75, t: 210, d: -95 },
    { x: 1520, y: 40, s: 1.05, t: 280, d: -230 },
  ];
  return (
    <g>
      {clouds.map((c, i) => (
        <g
          key={i}
          className="cloud"
          style={{ "--t": `${c.t}s`, "--d": `${c.d}s` } as React.CSSProperties}
        >
          <g transform={`translate(${c.x} ${c.y}) scale(${c.s})`}>
            <path d={CLOUD} {...solid} strokeOpacity={0.75} />
            <path d="M12 3 H40 M46 1 H56" strokeOpacity={0.35} />
          </g>
        </g>
      ))}
    </g>
  );
}

/* ---------- Far layer ---------- */

function Mountains() {
  const ridge =
    "M-10 268 C40 258 90 246 150 249 C210 252 240 236 300 238 C360 240 400 254 470 250 C540 246 580 232 650 236 C720 240 760 252 840 250 C920 248 960 236 1030 240 C1100 244 1150 256 1230 252 C1310 248 1360 238 1450 246";
  return (
    <g strokeOpacity={0.55}>
      <path d={`${ridge} L1450 ${G} L-10 ${G} Z`} {...solid} stroke="none" />
      <path d={`${ridge} L1450 ${G} L-10 ${G} Z`} fill={HATCH_FINE} stroke="none" opacity={0.6} />
      <path d={ridge} />
    </g>
  );
}

function Crane({ x, top, from, to }: { x: number; top: number; from: number; to: number }) {
  const lattice: string[] = [];
  for (let y = top + 6; y < G - 4; y += 8) lattice.push(`M${x - 3} ${y} L${x + 3} ${y + 8}`);
  return (
    <g strokeOpacity={0.6}>
      <path d={`M${x - 3} ${G} V${top} M${x + 3} ${G} V${top}`} />
      <path d={lattice.join(" ")} strokeOpacity={0.45} />
      <path d={`M${from} ${top + 4} H${to} M${from} ${top} H${to}`} />
      <path d={`M${x} ${top} L${x} ${top - 10} L${from + 6} ${top} M${x} ${top - 10} L${to - 4} ${top}`} />
      <path d={`M${lerp(x, to, 0.6)} ${top + 4} V${top + 40}`} strokeOpacity={0.5} />
      <rect x={from} y={top + 4} width={10} height={6} {...solid} />
    </g>
  );
}

function ChristChurch() {
  // Square tower with battlements, nave roof running east.
  const crenels: string[] = [];
  for (let x = 1396; x < 1428; x += 6) crenels.push(`M${x} 160 v-5 h3 v5`);
  return (
    <g strokeOpacity={0.6}>
      <path d={`M1340 ${G} V196 L1368 178 L1396 196 V${G}`} {...solid} />
      <path d={`M1396 ${G} V160 H1428 V${G}`} {...solid} />
      <path d={crenels.join(" ")} />
      <path d="M1405 172 v12 a3 3 0 0 0 6 0 v-12 M1416 172 v12 a3 3 0 0 0 6 0 v-12" strokeOpacity={0.5} />
      <path d={`M1420 160 H1428 V${G} H1420 Z`} fill={HATCH} stroke="none" />
    </g>
  );
}

/* ---------- City ---------- */

function Chimney({ cx, top, base, tip }: { cx: number; top: number; base: number; tip: number }) {
  const h = G - top;
  const half = (y: number) => lerp(tip, base, (y - top) / h);
  const bands = 7;
  const step = (h * 0.82) / bands;
  const polys: string[] = [];
  for (let i = 0; i < bands; i += 2) {
    const y0 = top + i * step;
    const y1 = y0 + step;
    polys.push(
      `M${pt([cx - half(y0), y0])} L${pt([cx + half(y0), y0])} L${pt([cx + half(y1), y1])} L${pt([cx - half(y1), y1])}Z`,
    );
  }
  const outline = `M${pt([cx - base, G])} L${pt([cx - tip, top])} L${pt([cx + tip, top])} L${pt([cx + base, G])}`;
  const ring = top + h * 0.3;
  return (
    <g>
      <path d={`${outline}Z`} {...solid} stroke="none" />
      <path d={polys.join(" ")} className="paint" stroke="none" />
      {/* Shade the west-facing half. */}
      <path
        d={`M${cx} ${top} L${pt([cx + tip, top])} L${pt([cx + base, G])} L${cx} ${G} Z`}
        fill={HATCH}
        stroke="none"
      />
      <path d={outline} />
      <path d={`M${pt([cx - tip - 2.5, top])} H${r(cx + tip + 2.5)} M${pt([cx - half(ring) - 3, ring])} H${r(cx + half(ring) + 3)}`} />
      <circle cx={cx + tip - 1} cy={top + 3} r={1.4} className="night" fill="#ff5a3c" stroke="none" />
    </g>
  );
}

function PowerStation() {
  return (
    <g>
      <path d={`M38 ${G} V252 H172 V${G}`} {...solid} />
      <path d={`M148 252 H172 V${G} H148 Z`} fill={HATCH} stroke="none" />
      <path d="M38 262 H172" strokeOpacity={0.5} />
      <Windows rects={grid(46, 140, 268, 284, 14, 10, 6, 6)} seed={3} share={0.3} />
      <path d={`M172 ${G} V268 H206 V${G}`} {...solid} />
      <path d={`M190 268 H206 V${G} H190 Z`} fill={HATCH} stroke="none" />
    </g>
  );
}

function Tree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const k = (n: number) => r(n * s);
  const canopy = `M${r(x - 15 * s)} ${r(y + 10 * s)} c${k(-6)} ${k(-10)} ${k(4)} ${k(-20)} ${k(12)} ${k(-17)} c${k(1)} ${k(-11)} ${k(16)} ${k(-12)} ${k(18)} ${k(-2)} c${k(10)} ${k(-2)} ${k(13)} ${k(12)} ${k(5)} ${k(17)} c${k(3)} ${k(8)} ${k(-8)} ${k(14)} ${k(-15)} ${k(9)} c${k(-6)} ${k(5)} ${k(-17)} ${k(3)} ${k(-20)} ${k(-7)}Z`;
  return (
    <g>
      <path d={`M${x} ${G} V${r(y + 8 * s)}`} />
      <path d={canopy} {...solid} />
      <path
        d={`M${r(x - 9 * s)} ${r(y + 12 * s)} q${k(9)} ${k(6)} ${k(19)} ${k(-2)} M${r(x - 4 * s)} ${r(y + 6 * s)} q${k(6)} ${k(3)} ${k(12)} ${k(-1)}`}
        strokeOpacity={0.5}
      />
    </g>
  );
}

function ConventionCentre() {
  const mullions: string[] = [];
  for (let x = 258; x < 372; x += 9) mullions.push(`M${x} 230 V${G}`);
  return (
    <g>
      <path d={`M250 ${G} V214 H376 V${G}`} {...solid} />
      <path d={`M352 214 H376 V${G} H352 Z`} fill={HATCH} stroke="none" />
      <path d="M250 224 H376" />
      <path d={mullions.join(" ")} strokeOpacity={0.45} />
      <Windows rects={grid(259, 350, 236, 286, 18, 12, 7, 7)} seed={5} share={0.35} />
      {/* The tilted glass drum of the atrium. */}
      <g transform="rotate(-24 344 214)">
        <ellipse cx={344} cy={214} rx={25} ry={42} {...solid} />
        <ellipse cx={344} cy={214} rx={25} ry={42} fill={HATCH_FINE} stroke="none" />
        <ellipse cx={344} cy={214} rx={17} ry={32} {...solid} strokeOpacity={0.7} />
        <path d="M327 214 H361 M344 182 V246" strokeOpacity={0.4} />
      </g>
    </g>
  );
}

function BeckettBridge() {
  // The spar leans up and over the river like the harp on a euro coin.
  const s0: P = [468, G - 6];
  const s1: P = [478, 232];
  const s2: P = [494, 168];
  const s3: P = [524, 112];
  const back: P = [478, G - 6];
  const b1: P = [488, 234];
  const b2: P = [502, 170];
  const spar = `M${pt(s0)} C${pt(s1)} ${pt(s2)} ${pt(s3)}`;
  const sparBack = `M${pt(back)} C${pt(b1)} ${pt(b2)} ${pt(s3)}`;
  const strings: string[] = [];
  for (let i = 0; i < 15; i++) {
    const t = lerp(0.28, 0.97, i / 14);
    const a = cubic(s0, s1, s2, s3, t);
    const deckX = lerp(536, 650, i / 14);
    const deck = quad([395, G - 6], [520, G - 14], [655, G - 6], (deckX - 395) / 260);
    strings.push(`M${pt(a)} L${pt(deck)}`);
  }
  for (let i = 0; i < 6; i++) {
    const a = cubic(s0, s1, s2, s3, lerp(0.6, 0.97, i / 5));
    strings.push(`M${pt(a)} L${pt([lerp(402, 448, i / 5), G - 7])}`);
  }
  return (
    <g>
      <path d={strings.join(" ")} strokeOpacity={0.6} />
      <path d={`M395 ${G - 6} Q520 ${G - 14} 655 ${G - 6} L655 ${G - 1} Q520 ${G - 9} 395 ${G - 1} Z`} {...solid} />
      <path d={`M395 ${G - 6} Q520 ${G - 14} 655 ${G - 6} L655 ${G - 1} Q520 ${G - 9} 395 ${G - 1} Z`} fill={HATCH_FINE} stroke="none" />
      <path d={`${spar} C${pt(b2)} ${pt(b1)} ${pt(back)} Z`} {...solid} stroke="none" />
      <path d={`${spar} C${pt(b2)} ${pt(b1)} ${pt(back)} Z`} fill={HATCH} stroke="none" />
      <path d={spar} />
      <path d={sparBack} />
    </g>
  );
}

function JeanieJohnston() {
  // The famine ship, moored at Custom House Quay. Drawn on her own waterline (y 308).
  const hull =
    "M626 288 Q633 301 642 308 L730 308 Q739 300 745 287 Q737 293 720 293 L662 293 Q642 293 626 288 Z";
  const masts: [number, number][] = [
    [656, 206],
    [686, 196],
    [714, 222],
  ];
  const yards: [number, number, number][] = [];
  for (const [x, top] of masts.slice(0, 2)) {
    [0.16, 0.38, 0.6].forEach((f, i) => yards.push([x - 13 - i * 3, r(lerp(top, 293, f)), x + 13 + i * 3]));
  }
  const rigging = [
    "M656 206 L604 278",
    "M686 196 L656 206",
    "M714 222 L686 196",
    "M714 222 L744 287",
    "M656 230 L646 293 M656 230 L666 293",
    "M686 222 L676 293 M686 222 L696 293",
  ].join(" ");
  const ports: string[] = [];
  for (let x = 652; x < 726; x += 9) ports.push(`M${x} 297 h4 v3 h-4Z`);
  return (
    <g id="sk-ship">
      <path d={rigging} strokeOpacity={0.45} />
      {masts.map(([x, top]) => (
        <path key={x} d={`M${x} 293 V${top}`} />
      ))}
      <path d={yards.map(([x0, y, x1]) => `M${x0} ${y} H${x1}`).join(" ")} />
      {/* Furled sails hang under the yards. */}
      <path
        d={yards.map(([x0, y, x1]) => `M${x0} ${y} Q${(x0 + x1) / 2} ${y + 4} ${x1} ${y}`).join(" ")}
        strokeOpacity={0.55}
      />
      <path d="M714 250 L738 241 M714 272 L742 272" />
      <path d="M626 288 L602 277" />
      <path d="M686 196 V189 L697 192 L686 195" className="paint" />
      <path d={hull} {...solid} />
      <path d={hull} fill={HATCH_FINE} stroke="none" opacity={0.8} />
      <path d="M634 297 H738" />
      <path d={ports.join(" ")} {...solid} />
      <circle cx={744} cy={285} r={1.6} className="lit" />
    </g>
  );
}

function CustomHouse() {
  const wingWindows = [
    ...grid(708, 778, 250, 262, 15, 20, 5, 9),
    ...grid(866, 936, 250, 262, 15, 20, 5, 9),
    ...grid(708, 778, 270, 282, 15, 20, 5, 10),
    ...grid(866, 936, 270, 282, 15, 20, 5, 10),
  ];
  const columns: string[] = [];
  for (const x of [790, 803, 837, 850]) columns.push(`M${x} 238 V${G - 4} M${x + 4} 238 V${G - 4}`);
  const balustrade: string[] = [];
  for (let x = 704; x <= 936; x += 6) balustrade.push(`M${x} 234 V238`);
  return (
    <g>
      {/* Drum and dome sit behind the portico. */}
      <path d="M800 206 V184 H840 V206" {...solid} />
      <path d="M828 184 H840 V206 H828 Z" fill={HATCH} stroke="none" />
      <path d="M806 186 V204 M813 186 V204 M820 186 V204 M827 186 V204 M834 186 V204" strokeOpacity={0.5} />
      <path d="M797 184 C799 156 841 156 843 184 Z" {...solid} />
      <path d="M820 159 C834 160 842 170 843 184 L822 184 C823 172 822 165 820 159 Z" fill={HATCH} stroke="none" />
      <path d="M808 166 C812 160 828 160 832 166" strokeOpacity={0.5} />
      <path d="M815 159 V150 H825 V159 M820 150 V136" />
      <circle cx={820} cy={133.5} r={2.5} {...solid} />
      {/* Long front with the portico in the middle. */}
      <path d={`M700 ${G} V238 H940 V${G}`} {...solid} />
      <path d={`M924 238 H940 V${G} H924 Z`} fill={HATCH} stroke="none" />
      <path d="M700 238 H940 M700 244 H940" />
      <path d={balustrade.join(" ")} strokeOpacity={0.55} />
      <Windows rects={wingWindows} seed={9} share={0.5} />
      <path d={`M782 ${G} V238 H858 V${G}`} {...solid} />
      <path d={`M784 240 H856 V${G - 4} H784 Z`} fill={HATCH} stroke="none" />
      <path d="M776 226 L820 206 L864 226 Z" {...solid} />
      <path d="M788 223 L820 210 L852 223 Z" fill={HATCH_FINE} stroke="none" />
      <path d="M776 226 H864 V238 H776 Z" {...solid} />
      <path d={columns.join(" ")} strokeOpacity={0.8} />
      <path d={`M778 ${G - 4} H862`} />
    </g>
  );
}

function LibertyHall() {
  const panes: [number, number, number, number][] = [];
  for (let y = 144; y < G - 6; y += 9) for (const x of [975, 984, 993]) panes.push([x, y, 6, 5]);
  return (
    <g>
      <path d={`M972 ${G} V138 H1008 V${G}`} {...solid} />
      <path d={`M1000 138 H1008 V${G} H1000 Z`} fill={HATCH} stroke="none" />
      <Windows rects={panes} seed={21} share={0.4} />
      <path d="M964 138 Q977 126 990 138 Q1003 126 1016 138 Z" {...solid} />
    </g>
  );
}

function OConnellStreet() {
  const blocks: [number, number, number][] = [
    [1030, 1062, 258],
    [1062, 1090, 264],
    [1090, 1118, 254],
  ];
  return (
    <g>
      {/* The Spire, thin as a needle, rises behind the street. */}
      <path d={`M1069.5 ${G} L1072.6 24 L1075.5 ${G}`} {...solid} />
      <circle cx={1072.6} cy={30} r={1.2} className="night" fill="#ff5a3c" stroke="none" />
      {blocks.map(([x0, x1, top], i) => (
        <g key={x0}>
          <path d={`M${x0} ${G} V${top} H${x1} V${G}`} {...solid} />
          <path d={`M${x1 - 6} ${top} H${x1} V${G} H${x1 - 6} Z`} fill={HATCH} stroke="none" />
          <Windows rects={grid(x0 + 4, x1 - 7, top + 7, G - 8, 7, 10, 3, 6)} seed={30 + i} />
        </g>
      ))}
    </g>
  );
}

function HapennyBridge() {
  const a: P = [1128, G + 2];
  const c: P = [1200, G - 40];
  const b: P = [1272, G + 2];
  const deckA: P = [1128, G - 4];
  const deckC: P = [1200, G - 34];
  const deckB: P = [1272, G - 4];
  const railLift = 9;
  const posts: string[] = [];
  for (let i = 1; i < 30; i++) {
    const [x, y] = quad(deckA, deckC, deckB, i / 30);
    posts.push(`M${pt([x, y])} V${r(y - railLift)}`);
  }
  const lamps = [0.3, 0.5, 0.7].map((t) => quad(deckA, deckC, deckB, t));
  const span = `M${pt(a)} Q${pt(c)} ${pt(b)} L${pt(deckB)} Q${pt(deckC)} ${pt(deckA)} Z`;
  return (
    <g>
      <path d={span} {...solid} />
      <path d={span} fill={HATCH_FINE} stroke="none" />
      <path d={`M${pt(deckA)} Q${pt(deckC)} ${pt(deckB)}`} />
      <path
        d={`M${pt([deckA[0], deckA[1] - railLift])} Q${pt([deckC[0], deckC[1] - railLift])} ${pt([deckB[0], deckB[1] - railLift])}`}
      />
      <path d={posts.join(" ")} strokeOpacity={0.55} />
      {lamps.map(([x, y]) => (
        <g key={x}>
          <path d={`M${r(x)} ${r(y - railLift)} V${r(y - 30)}`} />
          <path d={`M${r(x - 7)} ${r(y - 22)} Q${r(x)} ${r(y - 30)} ${r(x + 7)} ${r(y - 22)}`} />
          <circle cx={r(x)} cy={r(y - 32)} r={2.6} className="lit" />
        </g>
      ))}
    </g>
  );
}

function Terrace() {
  const tops = [214, 222, 210, 219, 213];
  return (
    <g>
      {tops.map((top, i) => {
        const x0 = 1292 + i * 31;
        const x1 = x0 + 31;
        const mid = (x0 + x1) / 2;
        const panes: [number, number, number, number][] = [];
        for (const wx of [x0 + 6, x1 - 11]) {
          for (let y = top + 12; y < G - 30; y += 17) panes.push([wx, y, 5, 10]);
        }
        const door = `M${mid - 5} ${G} V${G - 14} A5 5 0 0 1 ${mid + 5} ${G - 14} V${G} Z`;
        return (
          <g key={i}>
            <path d={`M${x0 + 3} ${top} V${top - 9} H${x0 + 9} V${top}`} {...solid} />
            <path d={`M${x0} ${G} V${top} H${x1} V${G}`} {...solid} />
            <path d={`M${x0} ${top + 4} H${x1} V${G} H${x0} Z`} fill={BRICK} stroke="none" />
            <path d={`M${x0} ${top + 4} H${x1}`} strokeOpacity={0.5} />
            <Windows rects={panes} seed={40 + i} share={0.5} />
            {/* A Georgian door with its fanlight, painted as Dublin doors are. */}
            <path d={door} className="paint" stroke="none" />
            <path d={door} />
            <path d={`M${mid - 3.5} ${G - 15} A3.5 3.5 0 0 1 ${mid + 3.5} ${G - 15} Z`} className="lit" strokeOpacity={0.6} />
          </g>
        );
      })}
    </g>
  );
}

function QuayLamps() {
  return (
    <g>
      {[228, 384, 664, 958, 1120, 1282].map((x) => (
        <g key={x}>
          <path d={`M${x} ${G} V${G - 22} M${x - 4} ${G - 22} H${x + 4}`} />
          <circle cx={x} cy={G - 25} r={2.4} className="lit" />
        </g>
      ))}
    </g>
  );
}

/** Everything that stands on the quay. Mirrored again in the river. */
function City() {
  return (
    <g id="sk-city">
      <OConnellStreet />
      <Chimney cx={80} top={58} base={14} tip={9} />
      <Chimney cx={128} top={72} base={14} tip={9} />
      <PowerStation />
      <Tree x={206} y={244} />
      <Tree x={228} y={252} s={0.8} />
      <ConventionCentre />
      <BeckettBridge />
      <Tree x={672} y={250} s={0.9} />
      <CustomHouse />
      <Tree x={950} y={256} s={0.7} />
      <LibertyHall />
      <HapennyBridge />
      <Terrace />
      <QuayLamps />
    </g>
  );
}

/* ---------- River ---------- */

function RiverLines() {
  const rand = seeded(7);
  const rows: string[] = [];
  const rowsY = [300, 309, 319, 331, 345, 361, 380, 402, 428, 456];
  rowsY.forEach((y, row) => {
    let x = rand() * 40;
    while (x < W) {
      const len = 12 + rand() * Math.max(18, 80 - row * 6);
      rows.push(`M${r(x)} ${y} h${r(len)}`);
      x += len + 12 + rand() * 44;
    }
  });
  const d = rows.join(" ");
  // Two copies side by side, so the flow can loop without a seam.
  return (
    <g strokeOpacity={0.45}>
      <g className="flow">
        <path d={d} />
        <path d={d} transform={`translate(${W} 0)`} />
      </g>
    </g>
  );
}

function RiverBoat() {
  const windows: string[] = [];
  for (let x = 12; x < 42; x += 7) windows.push(`M${x} -6 h4 v3 h-4Z`);
  return (
    <g transform={`translate(-160 ${G + 36})`}>
      <g className="boat">
        <path d="M14 -10 V-13 H42 V-10" />
        <path d="M8 -10 H48 V0 H8 Z" {...solid} />
        <path d={windows.join(" ")} className="lit" strokeOpacity={0.7} />
        <path d="M0 0 H58 L52 8 H6 Z" {...solid} />
        <path d="M0 0 H58 L52 8 H6 Z" fill={HATCH_FINE} stroke="none" />
        <path d="M44 -13 V-22 L51 -19 L44 -16" className="paint" />
        <path d="M-6 11 h10 M14 12 h22 M44 11 h12" strokeOpacity={0.5} />
      </g>
    </g>
  );
}

function Gulls() {
  const gulls = [
    { x: 604, y: 86, s: 1, d: 0 },
    { x: 628, y: 100, s: 0.8, d: -1.2 },
    { x: 1236, y: 118, s: 0.8, d: -2 },
    { x: 1256, y: 108, s: 0.6, d: -0.6 },
    { x: 410, y: 190, s: 0.7, d: -1.6 },
  ];
  return (
    <g strokeOpacity={0.75}>
      {gulls.map((g, i) => (
        <g key={i} className="bob" style={{ "--d": `${g.d}s` } as React.CSSProperties}>
          <path
            d={`M${g.x} ${g.y} q${r(5 * g.s)} ${r(-5 * g.s)} ${r(9 * g.s)} 0 q${r(4 * g.s)} ${r(-5 * g.s)} ${r(9 * g.s)} 0`}
          />
        </g>
      ))}
    </g>
  );
}

/* ---------- Plane ---------- */

const PLANE =
  "M13 0 C13 -1.1 11.6 -1.7 9 -1.7 L2.4 -1.7 L-3.6 -10.6 L-6.2 -10.6 L-2.6 -1.7 L-8.4 -1.6 L-10.6 -4.6 L-12.4 -4.6 L-11.2 0 L-12.4 4.6 L-10.6 4.6 L-8.4 1.6 L-2.6 1.7 L-6.2 10.6 L-3.6 10.6 L2.4 1.7 L9 1.7 C11.6 1.7 13 1.1 13 0 Z";

const F: [P, P, P, P] = [
  [1520, 54],
  [1180, 24],
  [760, 150],
  [-80, 122],
];
const FLIGHT = `M${pt(F[0])} C${pt(F[1])} ${pt(F[2])} ${pt(F[3])}`;

/** Where the plane parks when motion is reduced, facing along the flight path. */
function parked(t: number) {
  const [x, y] = cubic(...F, t);
  const [x2, y2] = cubic(...F, t + 0.001);
  return `translate(${r(x)} ${r(y)}) rotate(${r((Math.atan2(y2 - y, x2 - x) * 180) / Math.PI)})`;
}

function Aircraft() {
  return (
    <>
      <path d={PLANE} fill="var(--accent)" stroke="none" />
      {/* Navigation lights and the tail strobe. */}
      <circle cx={-4.9} cy={-10.6} r={1.3} fill="#ff4d3d" stroke="none" className="blink" />
      <circle cx={-4.9} cy={10.6} r={1.3} fill="#3ddc84" stroke="none" className="blink" />
      <circle
        cx={-12}
        cy={0}
        r={1.2}
        fill="#fff"
        stroke="none"
        className="blink"
        style={{ "--d": "-0.8s" } as React.CSSProperties}
      />
    </>
  );
}

export function DublinSkyline({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
      role="img"
      aria-label="Engraving of Dublin along the River Liffey, mirrored in the water, with a plane coming in to land"
      className={`skyline block h-[clamp(15rem,32.6vw,40rem)] w-full ${className ?? ""}`}
    >
      <defs>
        <pattern id="sk-hatch" width="3.2" height="3.2" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0 V3.2" stroke="currentColor" strokeWidth={0.7} strokeOpacity={0.55} />
        </pattern>
        <pattern id="sk-hatch-fine" width="4.5" height="4.5" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
          <path d="M0 0 V4.5" stroke="currentColor" strokeWidth={0.6} strokeOpacity={0.3} />
        </pattern>
        <pattern id="sk-brick" width="6" height="4" patternUnits="userSpaceOnUse">
          <path d="M0 4 H6 M3 0 V2" stroke="currentColor" strokeWidth={0.5} strokeOpacity={0.28} />
        </pattern>
        {/* Thin bands of open water break the reflection up, like an engraver's ripples. */}
        <pattern id="sk-ripple" width="12" height="4.6" patternUnits="userSpaceOnUse">
          <rect y={2.4} width={12} height={2.2} fill="var(--bg)" />
        </pattern>
        <linearGradient id="sk-fade" x1="0" y1={G} x2="0" y2={H} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity={0.55} />
          <stop offset="0.75" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <mask id="sk-water" maskUnits="userSpaceOnUse" x={0} y={G} width={W} height={H - G}>
          <rect x={0} y={G} width={W} height={H - G} fill="url(#sk-fade)" />
        </mask>
      </defs>

      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={1.1}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Sky */}
        <Stars />
        <SunAndMoon />
        <Clouds />
        <path d={FLIGHT} strokeDasharray="2 9" strokeOpacity={0.4} />

        {/* Far away */}
        <Mountains />
        <Crane x={226} top={150} from={176} to={300} />
        <Crane x={1186} top={152} from={1136} to={1256} />
        <ChristChurch />

        <City />

        {/* The river, with the city upside down in it. */}
        <g mask="url(#sk-water)">
          <use href="#sk-city" transform={`translate(0 ${2 * G}) scale(1 -1)`} />
          <use href="#sk-ship" transform="translate(0 616) scale(1 -1)" />
        </g>
        <rect x={0} y={G + 6} width={W} height={H - G} fill="url(#sk-ripple)" stroke="none" />
        <RiverLines />
        <path d={`M0 ${G} H${W} M0 ${G + 5} H${W}`} />
        <JeanieJohnston />
        <RiverBoat />
        <Gulls />

        {/* The plane is drawn last so it flies in front of everything. */}
        <g className="plane-flying">
          <Aircraft />
          <animateMotion dur="36s" repeatCount="indefinite" rotate="auto" path={FLIGHT} />
        </g>
        <g className="plane-static" transform={parked(0.42)}>
          <Aircraft />
        </g>
      </g>
    </svg>
  );
}
