// A line drawing of Dublin along the Liffey, east to west: the Poolbeg chimneys, the
// Convention Centre, the Samuel Beckett Bridge, the Custom House, Liberty Hall, the Spire,
// the Ha'penny Bridge and a Georgian terrace. A plane crosses on its way in to land.
// Everything is generated here, so the strokes stay crisp at any width.

type P = [number, number];

const W = 1440;
const H = 380;
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

/** Small deterministic random, so the server and every reload draw the same river. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const solid = { fill: "var(--bg)" } as const;

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
  return (
    <g>
      <path d={`${outline}Z`} {...solid} stroke="none" />
      <path d={polys.join(" ")} className="skyline-bands" stroke="none" />
      <path d={outline} />
      <path d={`M${pt([cx - tip - 2.5, top])} H${r(cx + tip + 2.5)}`} />
      <path
        d={`M${pt([cx - half(top + h * 0.3) - 3, top + h * 0.3])} H${r(cx + half(top + h * 0.3) + 3)}`}
      />
    </g>
  );
}

function Tree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const k = (n: number) => r(n * s);
  return (
    <g>
      <path d={`M${x} ${G} V${r(y + 8 * s)}`} />
      <path
        d={`M${r(x - 15 * s)} ${r(y + 10 * s)} c${k(-6)} ${k(-10)} ${k(4)} ${k(-20)} ${k(12)} ${k(-17)} c${k(1)} ${k(-11)} ${k(16)} ${k(-12)} ${k(18)} ${k(-2)} c${k(10)} ${k(-2)} ${k(13)} ${k(12)} ${k(5)} ${k(17)} c${k(3)} ${k(8)} ${k(-8)} ${k(14)} ${k(-15)} ${k(9)} c${k(-6)} ${k(5)} ${k(-17)} ${k(3)} ${k(-20)} ${k(-7)}Z`}
        {...solid}
      />
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
  for (let i = 0; i < 11; i++) {
    const t = lerp(0.3, 0.97, i / 10);
    const a = cubic(s0, s1, s2, s3, t);
    const deckX = lerp(540, 648, i / 10);
    const deck = quad([395, G - 6], [520, G - 14], [655, G - 6], (deckX - 395) / 260);
    strings.push(`M${pt(a)} L${pt(deck)}`);
  }
  for (let i = 0; i < 5; i++) {
    const a = cubic(s0, s1, s2, s3, lerp(0.62, 0.97, i / 4));
    strings.push(`M${pt(a)} L${pt([lerp(404, 446, i / 4), G - 7])}`);
  }
  return (
    <g>
      <path d={strings.join(" ")} strokeOpacity={0.7} />
      <path d={`M395 ${G - 6} Q520 ${G - 14} 655 ${G - 6}`} />
      <path d={`M395 ${G - 1} Q520 ${G - 9} 655 ${G - 1}`} />
      <path d={`${spar} C${pt(b2)} ${pt(b1)} ${pt(back)} Z`} {...solid} stroke="none" />
      <path d={spar} />
      <path d={sparBack} />
    </g>
  );
}

function ConventionCentre() {
  const mullions: string[] = [];
  for (let x = 258; x < 372; x += 9) mullions.push(`M${x} 230 V${G}`);
  return (
    <g>
      <path d={`M250 ${G} V214 H376 V${G}`} {...solid} />
      <path d={`M250 224 H376`} />
      <path d={mullions.join(" ")} strokeOpacity={0.55} />
      {/* The tilted glass drum of the atrium. */}
      <g transform="rotate(-24 344 214)">
        <ellipse cx={344} cy={214} rx={25} ry={42} {...solid} />
        <ellipse cx={344} cy={214} rx={17} ry={32} strokeOpacity={0.6} />
        <path d="M319 214 H369 M344 172 V256" strokeOpacity={0.4} />
      </g>
    </g>
  );
}

function CustomHouse() {
  const windows: string[] = [];
  for (const [from, to] of [
    [710, 776],
    [866, 932],
  ]) {
    for (let x = from; x <= to; x += 15) {
      windows.push(`M${x} 250 h5 v9 h-5Z`, `M${x} 270 h5 v10 h-5Z`);
    }
  }
  const columns: string[] = [];
  for (const x of [790, 803, 837, 850]) columns.push(`M${x} 238 V${G - 4}`, `M${x + 4} 238 V${G - 4}`);
  const balustrade: string[] = [];
  for (let x = 704; x <= 936; x += 6) balustrade.push(`M${x} 234 V238`);
  return (
    <g>
      {/* Dome and drum sit behind the portico. */}
      <path d="M800 206 V184 H840 V206" {...solid} />
      <path d="M806 186 V204 M813 186 V204 M820 186 V204 M827 186 V204 M834 186 V204" strokeOpacity={0.5} />
      <path d="M797 184 C799 156 841 156 843 184 Z" {...solid} />
      <path d="M808 166 C812 160 828 160 832 166" strokeOpacity={0.5} />
      <path d="M815 159 V150 H825 V159 M820 150 V136" />
      <circle cx={820} cy={133.5} r={2.5} {...solid} />
      {/* Long front with the portico in the middle. */}
      <path d={`M700 ${G} V238 H940 V${G}`} {...solid} />
      <path d="M700 238 H940 M700 244 H940" />
      <path d={balustrade.join(" ")} strokeOpacity={0.6} />
      <path d={windows.join(" ")} strokeOpacity={0.6} />
      <path d={`M782 ${G} V238 H858 V${G}`} {...solid} />
      <path d="M776 226 L820 206 L864 226 Z" {...solid} />
      <path d="M776 226 H864 V238 H776 Z" {...solid} />
      <path d={columns.join(" ")} strokeOpacity={0.75} />
      <path d={`M778 ${G - 4} H862`} />
    </g>
  );
}

function LibertyHall() {
  const floors: string[] = [];
  for (let y = 150; y < G; y += 9) floors.push(`M972 ${y} H1008`);
  return (
    <g>
      <path d={`M972 ${G} V138 H1008 V${G}`} {...solid} />
      <path d={floors.join(" ")} strokeOpacity={0.5} />
      <path d="M981 140 V288 M990 140 V288 M999 140 V288" strokeOpacity={0.25} />
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
      {blocks.map(([x0, x1, top]) => {
        const win: string[] = [];
        for (let x = x0 + 5; x < x1 - 6; x += 8) {
          for (let y = top + 8; y < G - 10; y += 11) win.push(`M${x} ${y} h3 v6 h-3Z`);
        }
        return (
          <g key={x0}>
            <path d={`M${x0} ${G} V${top} H${x1} V${G}`} {...solid} />
            <path d={win.join(" ")} strokeOpacity={0.5} />
          </g>
        );
      })}
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
  for (let i = 1; i < 24; i++) {
    const [x, y] = quad(deckA, deckC, deckB, i / 24);
    posts.push(`M${pt([x, y])} V${r(y - railLift)}`);
  }
  const lamps = [0.3, 0.5, 0.7].map((t) => quad(deckA, deckC, deckB, t));
  return (
    <g>
      <path
        d={`M${pt(a)} Q${pt(c)} ${pt(b)} L${pt(deckB)} Q${pt(deckC)} ${pt(deckA)} Z`}
        {...solid}
      />
      <path d={`M${pt(deckA)} Q${pt(deckC)} ${pt(deckB)}`} />
      <path
        d={`M${pt([deckA[0], deckA[1] - railLift])} Q${pt([deckC[0], deckC[1] - railLift])} ${pt([deckB[0], deckB[1] - railLift])}`}
      />
      <path d={posts.join(" ")} strokeOpacity={0.55} />
      {lamps.map(([x, y]) => (
        <g key={x}>
          <path d={`M${r(x)} ${r(y - railLift)} V${r(y - 30)}`} />
          <path d={`M${r(x - 7)} ${r(y - 22)} Q${r(x)} ${r(y - 30)} ${r(x + 7)} ${r(y - 22)}`} />
          <circle cx={r(x)} cy={r(y - 32)} r={2.4} {...solid} />
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
        const win: string[] = [];
        for (const wx of [x0 + 6, x1 - 11]) {
          for (let y = top + 12; y < G - 30; y += 17) win.push(`M${wx} ${y} h5 v10 h-5Z`);
        }
        return (
          <g key={i}>
            <path d={`M${x0 + 3} ${top} V${top - 9} H${x0 + 9} V${top}`} {...solid} />
            <path d={`M${x0} ${G} V${top} H${x1} V${G}`} {...solid} />
            <path d={`M${x0} ${top + 4} H${x1}`} strokeOpacity={0.5} />
            <path d={win.join(" ")} strokeOpacity={0.6} />
            {/* A Georgian door with its fanlight, painted as Dublin doors are. */}
            <path
              d={`M${mid - 5} ${G} V${G - 14} A5 5 0 0 1 ${mid + 5} ${G - 14} V${G} Z`}
              className="skyline-bands"
            />
            <path d={`M${mid - 5} ${G} V${G - 14} A5 5 0 0 1 ${mid + 5} ${G - 14} V${G}`} />
          </g>
        );
      })}
    </g>
  );
}

function River() {
  const rand = seeded(7);
  const rows: string[] = [];
  const rowsY = [302, 312, 324, 338, 354, 372];
  rowsY.forEach((y, row) => {
    let x = rand() * 40;
    while (x < W) {
      const len = 14 + rand() * (70 - row * 6);
      rows.push(`M${r(x)} ${y} h${r(len)}`);
      x += len + 14 + rand() * 46;
    }
  });
  // Broken reflections under the tallest landmarks.
  const reflections: string[] = [];
  for (const [x, len] of [
    [80, 70],
    [128, 60],
    [990, 60],
    [1072, 84],
    [820, 40],
  ] as const) {
    for (let y = G + 10; y < G + len; y += 9) reflections.push(`M${x - 3} ${y} h${6 + rand() * 6}`);
  }
  return (
    <g strokeOpacity={0.45}>
      <path d={rows.join(" ")} />
      <path d={reflections.join(" ")} />
    </g>
  );
}

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

export function DublinSkyline({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
      role="img"
      aria-label="Line drawing of Dublin along the River Liffey, with a plane coming in to land"
      className={`skyline block h-[clamp(11rem,26vw,26rem)] w-full ${className ?? ""}`}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={1.15}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Flight path and the plane on it. */}
        <path d={FLIGHT} strokeDasharray="2 9" strokeOpacity={0.4} />
        <g className="plane-flying">
          <path d={PLANE} fill="var(--accent)" stroke="none" />
          <animateMotion dur="34s" repeatCount="indefinite" rotate="auto" path={FLIGHT} />
        </g>
        <path
          className="plane-static"
          d={PLANE}
          fill="var(--accent)"
          stroke="none"
          transform={parked(0.42)}
        />
        {/* Gulls over the river. */}
        <path
          d="M604 86 q5 -5 9 0 q4 -5 9 0 M630 100 q4 -4 7 0 q3 -4 7 0 M1236 118 q4 -4 7 0 q3 -4 7 0"
          strokeOpacity={0.7}
        />

        <OConnellStreet />
        <Chimney cx={80} top={58} base={14} tip={9} />
        <Chimney cx={128} top={72} base={14} tip={9} />
        <path d={`M38 ${G} V252 H172 V${G}`} {...solid} />
        <path d="M38 262 H172 M60 252 V290 M84 252 V290 M108 252 V290 M132 252 V290 M156 252 V290" strokeOpacity={0.45} />
        <path d={`M172 ${G} V268 H206 V${G}`} {...solid} />
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

        {/* Quay walls and the Liffey. */}
        <path d={`M0 ${G} H${W} M0 ${G + 5} H${W}`} />
        <River />
      </g>
    </svg>
  );
}
