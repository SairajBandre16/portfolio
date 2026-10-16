// Mumbai and Dublin as one waterfront, the two cities Sairaj calls home.
// Half and half, meeting under the sun (or moon) in the middle. Mumbai, left: the
// Bandra-Worli Sea Link, Haji Ali Dargah, the Imperial Towers, the Rajabai Clock Tower,
// Chhatrapati Shivaji Maharaj Terminus, the Taj Mahal Palace and the Gateway of India.
// Dublin, right: the Ha'penny Bridge, Christ Church, the Four Courts, a Georgian terrace,
// the Spire, Liberty Hall, the Custom House, the Docklands, the Samuel Beckett Bridge and
// the Poolbeg chimneys.
// Drawn as layered silhouettes (far, mid, near) and mirrored in the water. In the dark
// theme it is night: windows and the Sea Link light up, the moon and stars come out.
// Colours and motion live in globals.css under "Footer skyline".

type P = [number, number];

const W = 1440;
const H = 470;
/** Waterline: everything stands on it. */
const G = 300;

const r = (n: number) => Math.round(n * 10) / 10;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const pt = ([x, y]: P) => `${r(x)} ${r(y)}`;
/** Rectangle as a path, from its corners. */
const R = (x0: number, y0: number, x1: number, y1: number) => `M${x0} ${y0}H${x1}V${y1}H${x0}Z`;

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

/** A pointed (Gothic or Indo-Saracenic) arch opening, standing on y = bottom. */
const arch = (x0: number, x1: number, spring: number, bottom: number) => {
  const mid = (x0 + x1) / 2;
  const rise = (x1 - x0) * 0.75;
  return `M${x0} ${bottom}V${spring}Q${x0} ${spring - rise * 0.6} ${mid} ${spring - rise}Q${x1} ${spring - rise * 0.6} ${x1} ${spring}V${bottom}Z`;
};

/** An onion or pointed dome sitting on y = base. */
const dome = (cx: number, half: number, base: number, top: number) =>
  `M${cx - half} ${base}C${cx - half} ${lerp(base, top, 0.55)} ${cx - half * 0.35} ${lerp(base, top, 0.75)} ${cx} ${top}C${cx + half * 0.35} ${lerp(base, top, 0.75)} ${cx + half} ${lerp(base, top, 0.55)} ${cx + half} ${base}Z`;

/** Window panes; some of them light up at night. */
function Panes({
  rects,
  seed,
  share = 0.45,
  shape = "rect",
}: {
  rects: [number, number, number, number][];
  seed: number;
  share?: number;
  shape?: "rect" | "arch";
}) {
  const rand = seeded(seed);
  const lit: string[] = [];
  const dark: string[] = [];
  for (const [x, y, w, h] of rects) {
    const d = shape === "arch" ? arch(x, x + w, y + w * 0.6, y + h) : `M${r(x)} ${r(y)}h${w}v${h}h${-w}Z`;
    (rand() < share ? lit : dark).push(d);
  }
  return (
    <>
      <path d={dark.join("")} className="pane" />
      <path d={lit.join("")} className="pane lit" />
    </>
  );
}

function grid(x0: number, x1: number, y0: number, y1: number, dx: number, dy: number, w: number, h: number) {
  const out: [number, number, number, number][] = [];
  for (let x = x0; x + w <= x1; x += dx) for (let y = y0; y + h <= y1; y += dy) out.push([x, y, w, h]);
  return out;
}

/* ---------- Sky ---------- */

function Sky() {
  const rand = seeded(11);
  const stars = Array.from({ length: 60 }, (_, i) => ({
    x: r(rand() * W),
    y: r(8 + rand() * 180),
    s: r(0.5 + rand() * 0.9),
    twinkle: i % 4 === 0,
    d: r(-rand() * 4),
  }));
  const [cx, cy] = [720, 74];
  return (
    <>
      <g className="night">
        {stars.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.s}
            className={s.twinkle ? "star twinkle" : "star"}
            style={s.twinkle ? ({ "--d": `${s.d}s` } as React.CSSProperties) : undefined}
          />
        ))}
        {/* A crescent: the disc with an offset disc masked out of it. */}
        <mask id="sk-moon" maskUnits="userSpaceOnUse" x={cx - 30} y={cy - 30} width={60} height={60}>
          <rect x={cx - 30} y={cy - 30} width={60} height={60} fill="#fff" />
          <circle cx={cx + 9} cy={cy - 6} r={19} fill="#000" />
        </mask>
        <circle cx={cx} cy={cy} r={22} className="moon" mask="url(#sk-moon)" />
      </g>
      <g className="day">
        <circle cx={cx} cy={cy} r={34} className="sun-glow" />
        <circle cx={cx} cy={cy} r={22} className="sun" />
      </g>
    </>
  );
}

const CLOUD =
  "M0 0C-5 -10 8 -17 17 -11C21 -24 44 -25 49 -11C57 -18 72 -12 70 -2C77 -1 78 8 70 8H4C-5 8 -7 1 0 0Z";

function Clouds() {
  const clouds = [
    { y: 96, s: 1.2, t: 240, d: -40 },
    { y: 54, s: 0.85, t: 270, d: -160 },
    { y: 140, s: 0.7, t: 220, d: -100 },
    { y: 36, s: 1, t: 300, d: -235 },
  ];
  return (
    <g>
      {clouds.map((c, i) => (
        <g
          key={i}
          className="cloud"
          style={{ "--t": `${c.t}s`, "--d": `${c.d}s` } as React.CSSProperties}
        >
          <path d={CLOUD} className="cloud-shape" transform={`translate(1520 ${c.y}) scale(${c.s})`} />
        </g>
      ))}
    </g>
  );
}

/* ---------- Far layer ---------- */

function MumbaiTowers() {
  // [left, right, top, rounded crown]; the round-topped pair are the Imperial Towers.
  const towers: [number, number, number, boolean?][] = [
    [186, 210, 192],
    [212, 236, 164],
    [238, 256, 208],
    [282, 306, 78, true],
    [312, 336, 86, true],
    [470, 490, 150],
    [530, 548, 170],
    [586, 604, 160],
  ];
  const panes: [number, number, number, number][] = [];
  for (const [x0, x1, top] of towers) panes.push(...grid(x0 + 4, x1 - 3, top + 12, G - 6, 6, 8, 3, 4));
  return (
    <g>
      <path
        className="far"
        d={towers
          .map(([x0, x1, top, round]) => {
            const half = (x1 - x0) / 2;
            return round
              ? `M${x0} ${G}V${top + half}A${half} ${half * 0.8} 0 0 1 ${x1} ${top + half}V${G}Z`
              : R(x0, top, x1, G);
          })
          .join("")}
      />
      <Panes rects={panes} seed={2} share={0.22} />
    </g>
  );
}

function DublinBehind() {
  // Christ Church, the Four Courts dome and the glass offices of the Docklands.
  const crenels: string[] = [];
  for (let x = 727; x < 750; x += 6) crenels.push(R(x, 176, x + 3, 182));
  const docks: [number, number, number][] = [
    [1212, 1238, 204],
    [1240, 1262, 184],
    [1264, 1290, 212],
    [1330, 1354, 196],
    [1356, 1380, 220],
  ];
  return (
    <g>
      <path className="far" d={docks.map(([x0, x1, top]) => R(x0, top, x1, G)).join("")} />
      <path
        className="mid"
        d={`${R(726, 182, 750, G)}${crenels.join("")}M750 ${G}V214L772 198L794 214V${G}Z${R(800, 224, 844, G)}${R(806, 208, 838, 224)}${dome(822, 17, 208, 172)}${R(820, 162, 824, 172)}`}
      />
      <path className="cut" d={`${arch(733, 743, 196, 214)}${arch(760, 768, 224, 250)}${arch(776, 784, 224, 250)}`} />
      <Panes rects={grid(806, 840, 234, 262, 8, 16, 4, 9)} seed={47} share={0.45} shape="arch" />
      <Panes
        rects={docks.flatMap(([x0, x1, top]) => grid(x0 + 4, x1 - 3, top + 8, G - 6, 6, 8, 3, 4))}
        seed={37}
        share={0.35}
      />
    </g>
  );
}

/* ---------- Mumbai ---------- */

function SeaLink() {
  // Cable-stayed, with inverted-Y pylons and fans of cables.
  const deckTop = 262;
  const pylons = [52, 170];
  const cables: string[] = [];
  const lights: P[] = [];
  for (const cx of pylons) {
    for (let k = 0; k < 10; k++) {
      const y = lerp(102, 178, k / 9);
      const reach = lerp(100, 18, k / 9);
      cables.push(`M${cx} ${r(y)}L${r(cx - reach)} ${deckTop}M${cx} ${r(y)}L${r(cx + reach)} ${deckTop}`);
    }
  }
  for (let x = -16; x < 262; x += 11) lights.push([x, deckTop - 2.5]);
  const pylon = (cx: number) =>
    `M${cx - 17} ${G}L${cx - 4} 192L${cx - 2.4} 92H${cx + 2.4}L${cx + 4} 192L${cx + 17} ${G}H${cx + 11}L${cx + 1} 210H${cx - 1}L${cx - 11} ${G}Z`;
  const piers: string[] = [];
  for (let x = -6; x < 262; x += 32) if (pylons.every((p) => Math.abs(p - x) > 22)) piers.push(R(x, 268, x + 4, G));
  return (
    <g>
      <path d={cables.join("")} className="cable" />
      <path className="mid" d={`${R(-20, deckTop, 264, deckTop + 6)}${piers.join("")}${pylons.map(pylon).join("")}`} />
      <g className="night">
        {lights.map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r={1.2} className="glow" />
        ))}
      </g>
    </g>
  );
}

function HajiAli() {
  // The dargah on its islet, with a slender minaret.
  return (
    <g>
      <path
        className="near"
        d={`M300 ${G}Q306 ${G - 7} 316 ${G - 8}H364Q376 ${G - 7} 380 ${G}Z${R(310, 262, 356, G - 7)}${R(320, 252, 346, 262)}${dome(333, 14, 252, 222)}M332.4 222V212H333.6V222Z${R(362, 206, 368, G - 7)}${R(360, 240, 370, 244)}${R(360, 220, 370, 224)}${dome(365, 4, 206, 194)}`}
      />
      <path className="cut" d={[316, 327, 338, 349].map((x) => arch(x, x + 6, 278, G - 8)).join("")} />
    </g>
  );
}

function Rajabai() {
  // Gothic clock tower, stepping in as it rises to a spire.
  const pinnacles = [
    [443, 150],
    [467, 150],
    [446, 118],
    [464, 118],
  ]
    .map(([x, y]) => `M${x - 2} ${y}L${x} ${y - 10}L${x + 2} ${y}Z`)
    .join("");
  const slits = [448, 453.5, 459].flatMap((x) => [arch(x, x + 3, 164, 206), arch(x, x + 3, 228, 276)]);
  return (
    <g>
      <path
        className="mid"
        d={`${R(442, 150, 468, G)}${R(445.5, 118, 464.5, 150)}${R(448.5, 98, 461.5, 118)}${R(450.5, 86, 459.5, 98)}M450 86L455 48L460 86Z${pinnacles}`}
      />
      <circle cx={455} cy={108} r={4} className="pane lit" />
      <path className="cut" d={slits.join("")} />
    </g>
  );
}

function CSMT() {
  // Victoria Terminus: Gothic front, corner towers and the great ribbed dome.
  const caps = [
    [481, 190, 9, 166],
    [591, 190, 9, 166],
    [504, 206, 5, 192],
    [568, 206, 5, 192],
  ]
    .map(([cx, base, half, top]) => `M${cx - half} ${base}L${cx} ${top}L${cx + half} ${base}Z`)
    .join("");
  return (
    <g>
      <path
        className="mid"
        d={`${R(472, 214, 600, G)}${R(472, 190, 490, G)}${R(582, 190, 600, G)}${R(500, 206, 508, 214)}${R(564, 206, 572, 214)}${caps}${R(517, 182, 555, 214)}${dome(536, 22, 182, 128)}${R(535, 112, 537, 128)}M532 116L536 106L540 116Z`}
      />
      <Panes rects={[...grid(494, 580, 228, 252, 12, 30, 6, 18), ...grid(494, 580, 262, 296, 12, 30, 6, 20)]} seed={13} share={0.5} shape="arch" />
      <circle cx={536} cy={198} r={7} className="pane lit" />
      <path className="cut" d={`M523 160C528 150 544 150 549 160`} />
    </g>
  );
}

function Taj() {
  // The Taj Mahal Palace: corner towers and the red central dome.
  return (
    <g>
      <path className="near" d={`${R(604, 200, 722, G)}${R(604, 176, 622, G)}${R(704, 176, 722, G)}${R(645, 186, 681, 200)}`} />
      <path className="paint" d={`${dome(663, 22, 186, 126)}${dome(613, 10, 176, 150)}${dome(713, 10, 176, 150)}`} />
      <path className="near" d={`${R(662, 112, 664, 126)}${R(612, 140, 614, 150)}${R(712, 140, 714, 150)}`} />
      <Panes rects={[...grid(628, 700, 212, 296, 9, 14, 4, 8), ...grid(607, 620, 188, 296, 7, 14, 3, 8), ...grid(707, 720, 188, 296, 7, 14, 3, 8)]} seed={17} share={0.55} shape="arch" />
      <path className="cut-line" d="M622 234H704M622 262H704" />
    </g>
  );
}

function Gateway() {
  // The Gateway of India: a great arch under four domed turrets.
  return (
    <g>
      <path
        className="near"
        d={`${R(728, 196, 806, G)}${R(724, 190, 810, 197)}${R(726, 168, 742, 190)}${R(792, 168, 808, 190)}${R(748, 178, 758, 190)}${R(776, 178, 786, 190)}${dome(734, 9, 168, 148)}${dome(800, 9, 168, 148)}${dome(753, 6, 178, 164)}${dome(781, 6, 178, 164)}`}
      />
      <path className="hole" d={`${arch(751, 783, 238, G)}${arch(733, 743, 270, G)}${arch(791, 801, 270, G)}`} />
      <path className="cut-line" d="M728 206H806" />
      <Panes rects={grid(732, 744, 214, 250, 6, 16, 3, 8)} seed={19} share={0.4} shape="arch" />
      <Panes rects={grid(790, 802, 214, 250, 6, 16, 3, 8)} seed={23} share={0.4} shape="arch" />
    </g>
  );
}

/* ---------- Dublin ---------- */

function HapennyBridge() {
  const a: P = [730, G - 4];
  const c: P = [796, G - 40];
  const b: P = [862, G - 4];
  const posts: string[] = [];
  for (let i = 1; i < 26; i++) {
    const [x, y] = quad(a, c, b, i / 26);
    posts.push(`M${r(x)} ${r(y)}V${r(y - 8)}`);
  }
  return (
    <g>
      <path className="near" d={`M730 ${G}Q796 ${G - 32} 862 ${G}L${pt(b)}Q${pt(c)} ${pt(a)}Z`} />
      <path
        className="rail"
        d={`${posts.join("")}M${a[0]} ${a[1] - 8}Q${c[0]} ${c[1] - 8} ${b[0]} ${b[1] - 8}`}
      />
    </g>
  );
}

function Terrace() {
  // Georgian houses with chimney stacks and painted front doors under fanlights.
  const houses: [number, number, number][] = [
    [864, 886, 226],
    [886, 908, 234],
    [908, 930, 222],
    [930, 950, 230],
  ];
  const doors = houses.map(([x0, x1]) => {
    const m = (x0 + x1) / 2;
    return `M${m - 3.5} ${G}V${G - 10}A3.5 3.5 0 0 1 ${m + 3.5} ${G - 10}V${G}Z`;
  });
  const panes = houses.flatMap(([x0, x1, top]) => grid(x0 + 4, x1 - 3, top + 9, G - 16, 8, 13, 4, 8));
  return (
    <g>
      <path
        className="near"
        d={houses.map(([x0, x1, top]) => `${R(x0, top, x1, G)}${R(x0 + 3, top - 9, x0 + 9, top)}`).join("")}
      />
      <path className="cut-line" d={houses.map(([x0, x1, top]) => `M${x0} ${top + 4}H${x1}`).join("")} />
      <Panes rects={panes} seed={41} share={0.55} />
      <path className="paint" d={doors.join("")} />
    </g>
  );
}

function Spire() {
  return (
    <g>
      <path className="mid" d={`M953.2 ${G}L956 18L958.8 ${G}Z`} />
      <circle cx={956} cy={24} r={1.4} className="night beacon" />
    </g>
  );
}

function LibertyHall() {
  return (
    <g>
      <path className="mid" d={`${R(964, 136, 998, G)}M958 136Q969.5 124 981 136Q992.5 124 1004 136Z`} />
      <Panes rects={grid(968, 995, 144, G - 6, 9, 9, 5, 5)} seed={43} share={0.45} />
    </g>
  );
}

function CustomHouse() {
  const panes = [
    ...grid(998, 1058, 250, 264, 11, 22, 5, 10),
    ...grid(1124, 1184, 250, 264, 11, 22, 5, 10),
    ...grid(998, 1058, 274, 290, 11, 22, 5, 12),
    ...grid(1124, 1184, 274, 290, 11, 22, 5, 12),
  ];
  return (
    <g>
      <path
        className="near"
        d={`${R(990, 242, 1188, G)}${R(986, 236, 1192, 242)}${R(1062, 226, 1116, G)}M1056 226L1089 208L1122 226Z${R(1075, 190, 1103, 208)}${dome(1089, 19, 190, 154)}${R(1085, 144, 1093, 156)}M1087 144L1089 132L1091 144Z`}
      />
      <path className="cut" d={[1070, 1080, 1094, 1104].map((x) => R(x, 232, x + 3, G - 3)).join("")} />
      <Panes rects={panes} seed={29} share={0.5} />
      <path className="cut-line" d="M1066 214L1089 203L1112 214" />
    </g>
  );
}

function BeckettBridge() {
  // The harp: a curved spar leaning over the river, strung with cables.
  const s0: P = [1262, G - 8];
  const s1: P = [1272, 228];
  const s2: P = [1290, 160];
  const s3: P = [1326, 94];
  const b1: P = [1302, 162];
  const b2: P = [1286, 230];
  const back: P = [1276, G - 8];
  const deck = (x: number): P =>
    quad([1208, G - 8], [1300, G - 18], [1392, G - 8], (x - 1208) / 184);
  const strings: string[] = [];
  for (let i = 0; i < 18; i++) {
    const a = cubic(s0, s1, s2, s3, lerp(0.24, 0.98, i / 17));
    strings.push(`M${pt(a)}L${pt(deck(lerp(1334, 1390, i / 17)))}`);
  }
  for (let i = 0; i < 7; i++) {
    const a = cubic(s0, s1, s2, s3, lerp(0.58, 0.98, i / 6));
    strings.push(`M${pt(a)}L${pt(deck(lerp(1212, 1250, i / 6)))}`);
  }
  return (
    <g>
      <path d={strings.join("")} className="cable cable-strong" />
      <path
        className="near"
        d={`M1208 ${G - 8}Q1300 ${G - 18} 1392 ${G - 8}L1392 ${G - 3}Q1300 ${G - 13} 1208 ${G - 3}Z${R(1260, G - 6, 1278, G)}M${pt(s0)}C${pt(s1)} ${pt(s2)} ${pt(s3)}C${pt(b1)} ${pt(b2)} ${pt(back)}Z`}
      />
    </g>
  );
}

function Poolbeg() {
  const chimney = (cx: number, top: number) => {
    const base = 11;
    const tip = 7;
    const h = G - 24 - top;
    const half = (y: number) => lerp(tip, base, (y - top) / h);
    const bands: string[] = [];
    const step = (h * 0.85) / 7;
    for (let i = 0; i < 7; i += 2) {
      const y0 = top + i * step;
      const y1 = y0 + step;
      bands.push(
        `M${pt([cx - half(y0), y0])}L${pt([cx + half(y0), y0])}L${pt([cx + half(y1), y1])}L${pt([cx - half(y1), y1])}Z`,
      );
    }
    return {
      body: `M${cx - base} ${G - 24}L${cx - tip} ${top}H${cx + tip}L${cx + base} ${G - 24}Z`,
      bands: bands.join(""),
    };
  };
  const a = chimney(1406, 46);
  const b = chimney(1431, 62);
  return (
    <g>
      <path className="near" d={`${a.body}${b.body}${R(1392, G - 26, 1446, G)}`} />
      <path className="paint" d={`${a.bands}${b.bands}`} />
      <Panes rects={grid(1396, 1440, G - 18, G - 6, 8, 10, 4, 5)} seed={31} share={0.4} />
      <circle cx={1406} cy={49} r={1.3} className="night beacon" />
      <circle cx={1431} cy={65} r={1.3} className="night beacon" />
    </g>
  );
}

/**
 * Both cities, back to front, mirrored again in the water. Some landmarks are drawn where
 * they were first designed and moved into place, so each keeps its own proportions.
 */
function City() {
  const at = (dx: number, node: React.ReactNode) => (
    <g transform={`translate(${dx} 0)`}>{node}</g>
  );
  return (
    <g id="sk-city">
      <MumbaiTowers />
      <DublinBehind />
      <SeaLink />
      {at(-98, <Rajabai />)}
      {at(-96, <CSMT />)}
      <Spire />
      <LibertyHall />
      {at(-54, <HajiAli />)}
      {at(-96, <Taj />)}
      {at(-92, <Gateway />)}
      <HapennyBridge />
      <Terrace />
      {at(16, <CustomHouse />)}
      <BeckettBridge />
      <Poolbeg />
    </g>
  );
}

/* ---------- Water ---------- */

function Shimmer() {
  const rand = seeded(7);
  const rows: string[] = [];
  [306, 314, 324, 336, 350, 366, 386, 410, 438].forEach((y, row) => {
    let x = rand() * 40;
    while (x < W) {
      const len = 10 + rand() * Math.max(16, 70 - row * 6);
      rows.push(`M${r(x)} ${y}h${r(len)}`);
      x += len + 14 + rand() * 48;
    }
  });
  const d = rows.join("");
  // Two copies side by side, so the drift can loop without a seam.
  return (
    <g className="flow">
      <path d={d} className="shimmer" />
      <path d={d} className="shimmer" transform={`translate(${W} 0)`} />
    </g>
  );
}

function Ferry() {
  const windows = Array.from({ length: 6 }, (_, i) => R(14 + i * 7, -9, 18 + i * 7, -5)).join("");
  return (
    <g transform={`translate(-180 ${G + 32})`}>
      <g className="boat">
        <path className="near" d={`M0 0H66L59 9H7Z${R(10, -12, 56, 0)}${R(15, -19, 51, -12)}M51 -19V-27L58 -24L51 -21Z`} />
        <path className="pane lit" d={windows} />
      </g>
    </g>
  );
}

export function Skyline({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
      role="img"
      aria-label="Mumbai and Dublin side by side on one waterfront. Mumbai: the Sea Link, Haji Ali, the Rajabai Clock Tower, CSMT, the Taj and the Gateway of India. Dublin: the Ha'penny Bridge, a Georgian terrace, the Spire, Liberty Hall, the Custom House, the Samuel Beckett Bridge and the Poolbeg chimneys."
      className={`skyline block h-[clamp(15rem,32.6vw,40rem)] w-full ${className ?? ""}`}
    >
      <defs>
        {/* Bands of open water break the reflection up into ripples. */}
        <pattern id="sk-ripple" width="12" height="4.4" patternUnits="userSpaceOnUse">
          <rect y={2.3} width={12} height={2.1} fill="var(--bg)" />
        </pattern>
        <linearGradient id="sk-fade" x1="0" y1={G} x2="0" y2={H} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity={0.6} />
          <stop offset="0.8" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <mask id="sk-water" maskUnits="userSpaceOnUse" x={0} y={G} width={W} height={H - G}>
          <rect x={0} y={G} width={W} height={H - G} fill="url(#sk-fade)" />
        </mask>
      </defs>

      <Sky />
      <Clouds />
      <City />

      <g mask="url(#sk-water)" className="reflection">
        <use href="#sk-city" transform={`translate(0 ${2 * G}) scale(1 -1)`} />
      </g>
      <rect x={0} y={G + 3} width={W} height={H - G} fill="url(#sk-ripple)" />
      <Shimmer />
      <path d={`M0 ${G}H${W}`} className="shore" />
      <Ferry />

      <text x={24} y={H - 18} className="sk-label">
        MUMBAI · 18.92° N
      </text>
      <text x={W - 24} y={H - 18} textAnchor="end" className="sk-label">
        DUBLIN · 53.35° N
      </text>
    </svg>
  );
}
