// Procedural point clouds. Each generator fills `n` xyz positions, roughly within a
// radius of 2.5 world units around the origin. Seeded so shapes are stable between visits.

import type { ShapeName } from "./scenes";

type Rng = () => number;

function mulberry32(seed: number): Rng {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Roughly normal, mean 0, sd ~1. */
function gauss(r: Rng) {
  return (r() + r() + r() + r() - 2) * 1.7;
}

function onSphere(r: Rng, radius: number): [number, number, number] {
  const u = r() * 2 - 1;
  const t = r() * Math.PI * 2;
  const s = Math.sqrt(1 - u * u);
  return [radius * s * Math.cos(t), radius * u, radius * s * Math.sin(t)];
}

function core(n: number, r: Rng, out: Float32Array) {
  for (let i = 0; i < n; i++) {
    const k = r();
    let p: [number, number, number];
    if (k < 0.55) {
      p = onSphere(r, 1.55 + gauss(r) * 0.025);
    } else if (k < 0.8) {
      p = onSphere(r, 1.4 * Math.cbrt(r()));
    } else {
      const a = r() * Math.PI * 2;
      const rad = 2.15 + r() * 0.22;
      const x = Math.cos(a) * rad;
      const z = Math.sin(a) * rad;
      const y = gauss(r) * 0.02;
      // Tilt the ring so it reads as an orbit.
      const c = Math.cos(0.5);
      const s = Math.sin(0.5);
      p = [x, y * c - z * s, y * s + z * c];
    }
    out.set(p, i * 3);
  }
}

function network(n: number, r: Rng, out: Float32Array) {
  const layers = [4, 7, 7, 5, 2];
  const nodes: [number, number, number][][] = layers.map((count, li) => {
    const x = -2.6 + (5.2 * li) / (layers.length - 1);
    return Array.from({ length: count }, (_, i) => [
      x,
      (i - (count - 1) / 2) * 0.6,
      li % 2 ? 0.15 : -0.15,
    ]);
  });
  const edges: [number[], number[]][] = [];
  for (let l = 0; l < nodes.length - 1; l++) {
    for (const a of nodes[l]) for (const b of nodes[l + 1]) edges.push([a, b]);
  }
  const flat = nodes.flat();
  for (let i = 0; i < n; i++) {
    if (r() < 0.36) {
      const c = flat[Math.floor(r() * flat.length)];
      const [x, y, z] = onSphere(r, 0.11 * Math.cbrt(r()));
      out.set([c[0] + x, c[1] + y, c[2] + z], i * 3);
    } else {
      const [a, b] = edges[Math.floor(r() * edges.length)];
      const t = r();
      out.set(
        [
          a[0] + (b[0] - a[0]) * t,
          a[1] + (b[1] - a[1]) * t + gauss(r) * 0.006,
          a[2] + (b[2] - a[2]) * t,
        ],
        i * 3,
      );
    }
  }
}

function database(n: number, r: Rng, out: Float32Array) {
  const R = 1.15;
  const h = 0.5;
  const centres = [-0.68, 0, 0.68];
  for (let i = 0; i < n; i++) {
    const disc = Math.floor(r() * 3);
    const yc = centres[disc];
    const a = r() * Math.PI * 2;
    const k = r();
    let x: number, y: number, z: number;
    if (k < 0.5) {
      // Side wall
      x = Math.cos(a) * R;
      z = Math.sin(a) * R;
      y = yc + (r() - 0.5) * h;
    } else if (k < 0.78) {
      // Rims, top and bottom
      const top = r() < 0.5;
      const rad = R + gauss(r) * 0.01;
      x = Math.cos(a) * rad;
      z = Math.sin(a) * rad;
      y = yc + (top ? h / 2 : -h / 2);
    } else {
      // Lids: the top one is solid, the rest only show rows of "records".
      const rad = disc === 2 ? R * Math.sqrt(r()) : R * (0.25 + (0.75 * Math.round(r() * 4)) / 4);
      x = Math.cos(a) * rad;
      z = Math.sin(a) * rad;
      y = yc + h / 2;
    }
    out.set([x, y, z], i * 3);
  }
}

function latLon(lat: number, lon: number, rad: number): [number, number, number] {
  const la = (lat * Math.PI) / 180;
  const lo = (lon * Math.PI) / 180;
  return [rad * Math.cos(la) * Math.sin(lo), rad * Math.sin(la), rad * Math.cos(la) * Math.cos(lo)];
}

function globe(n: number, r: Rng, out: Float32Array) {
  const R = 1.55;
  // Mumbai area to Rotterdam: the lane ChainWatch watches.
  const from = latLon(19, 73 - 40, 1);
  const to = latLon(52, 4 - 40, 1);
  const dot = from[0] * to[0] + from[1] * to[1] + from[2] * to[2];
  const omega = Math.acos(dot);
  for (let i = 0; i < n; i++) {
    const k = r();
    let p: [number, number, number];
    if (k < 0.3) {
      const lat = -60 + Math.floor(r() * 7) * 20;
      p = latLon(lat, r() * 360, R);
    } else if (k < 0.58) {
      const lon = Math.floor(r() * 12) * 30;
      p = latLon(r() * 180 - 90, lon, R);
    } else if (k < 0.85) {
      p = onSphere(r, R);
    } else {
      const t = r();
      const s0 = Math.sin((1 - t) * omega) / Math.sin(omega);
      const s1 = Math.sin(t * omega) / Math.sin(omega);
      const lift = R + Math.sin(t * Math.PI) * 0.42 + gauss(r) * 0.008;
      p = [
        (from[0] * s0 + to[0] * s1) * lift,
        (from[1] * s0 + to[1] * s1) * lift,
        (from[2] * s0 + to[2] * s1) * lift,
      ];
    }
    out.set(p, i * 3);
  }
}

function helix(n: number, r: Rng, out: Float32Array) {
  const len = 6.4;
  const rad = 0.7;
  const turns = 3.5;
  const rungs = 30;
  for (let i = 0; i < n; i++) {
    const k = r();
    if (k < 0.8) {
      const t = r();
      const phase = (k < 0.4 ? 0 : Math.PI) + t * turns * Math.PI * 2;
      const j = gauss(r) * 0.018;
      out.set(
        [-len / 2 + t * len, Math.cos(phase) * (rad + j), Math.sin(phase) * (rad + j)],
        i * 3,
      );
    } else {
      const t = (Math.floor(r() * rungs) + 0.5) / rungs;
      const phase = t * turns * Math.PI * 2;
      const s = r() * 2 - 1;
      out.set([-len / 2 + t * len, Math.cos(phase) * rad * s, Math.sin(phase) * rad * s], i * 3);
    }
  }
}

function galaxy(n: number, r: Rng, out: Float32Array) {
  const arms = 3;
  const maxR = 2.45;
  for (let i = 0; i < n; i++) {
    if (r() < 0.1) {
      out.set(onSphere(r, 0.32 * Math.cbrt(r())), i * 3);
      continue;
    }
    const rad = Math.pow(r(), 0.75) * maxR;
    const fall = 1 - rad / maxR;
    const a =
      (Math.floor(r() * arms) * Math.PI * 2) / arms + rad * 2.1 + gauss(r) * (0.28 * fall + 0.07);
    out.set([Math.cos(a) * rad, gauss(r) * 0.06 * (fall + 0.25), Math.sin(a) * rad], i * 3);
  }
}

/** Rasterises something on a 2D canvas and returns the filled pixels as flat x, y pairs. */
function canvasPixels(
  w: number,
  h: number,
  draw: (ctx: CanvasRenderingContext2D) => void,
): number[] {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  ctx.fillStyle = "#fff";
  draw(ctx);
  const data = ctx.getImageData(0, 0, w, h).data;
  const filled: number[] = [];
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      if (data[(y * w + x) * 4 + 3] > 128) filled.push(x, y);
    }
  }
  return filled;
}

/** Scatters points over a canvas drawing, flat on the XY plane. */
function fromCanvas(
  n: number,
  r: Rng,
  out: Float32Array,
  w: number,
  h: number,
  worldWidth: number,
  depth: number,
  draw: (ctx: CanvasRenderingContext2D) => void,
) {
  const filled = canvasPixels(w, h, draw);
  if (filled.length === 0) return core(n, r, out);
  const count = filled.length / 2;
  const scale = worldWidth / w;
  for (let i = 0; i < n; i++) {
    const j = Math.floor(r() * count) * 2;
    out.set(
      [
        (filled[j] + r() * 2 - w / 2) * scale,
        -(filled[j + 1] + r() * 2 - h / 2) * scale,
        gauss(r) * depth,
      ],
      i * 3,
    );
  }
}

function displayFont() {
  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-syne").trim();
  return family || "sans-serif";
}

function text(label: string, n: number, r: Rng, out: Float32Array, worldWidth: number) {
  fromCanvas(n, r, out, 640, 320, worldWidth, 0.07, (ctx) => {
    ctx.font = `800 236px ${displayFont()}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, 320, 172);
  });
}

type V3 = [number, number, number];

const TAU = Math.PI * 2;

/** Yaw around Y, then pitch around X, then roll around Z. */
function orient([x, y, z]: V3, yaw: number, pitch: number, roll: number): V3 {
  let c = Math.cos(yaw);
  let s = Math.sin(yaw);
  [x, z] = [x * c + z * s, -x * s + z * c];
  c = Math.cos(pitch);
  s = Math.sin(pitch);
  [y, z] = [y * c - z * s, y * s + z * c];
  c = Math.cos(roll);
  s = Math.sin(roll);
  [x, y] = [x * c - y * s, x * s + y * c];
  return [x, y, z];
}

function side(r: Rng) {
  return r() < 0.5 ? -1 : 1;
}

/** Edge-weighted coordinate in [0, 1]: a share of samples lands exactly on 0 or 1. */
function edgy(r: Rng, share: number) {
  return r() < share ? Math.round(r()) : r();
}

// A twin-engined airliner in 3D: nose along +x, wings along z, fin up.
function airliner(r: Rng): V3 {
  const k = r();
  if (k < 0.3) {
    // Fuselage: a tube that tapers to a rounded nose and lifts into the tail.
    const t = r();
    let rad = 0.21;
    if (t > 0.86) rad *= Math.sqrt(Math.max(0, (1 - t) / 0.14));
    if (t < 0.2) rad *= 0.35 + 0.65 * (t / 0.2);
    const yc = t < 0.2 ? 0.13 * (1 - t / 0.2) : 0;
    const a = r() * TAU;
    return [-2 + 4 * t, yc + Math.cos(a) * rad, Math.sin(a) * rad];
  }
  if (k < 0.62) {
    // Swept wings with dihedral; denser along the edges so the outline reads.
    let s = r();
    while (r() > 1 - 0.68 * s) s = r();
    let c = r();
    const e = r();
    if (e < 0.2) c = 0;
    else if (e < 0.32) c = 1;
    else if (e < 0.38) s = 1;
    const chord = 0.95 - 0.68 * s;
    const le = 0.42 - 1.15 * s;
    return [le - c * chord, -0.07 + 0.2 * s + gauss(r) * 0.006, side(r) * (0.2 + s * 2.15)];
  }
  if (k < 0.72) {
    // Engines under the wings, with a bright intake ring.
    const a = r() * TAU;
    const x = r() < 0.3 ? 0.62 : -0.05 + r() * 0.67;
    return [x, -0.24 + Math.cos(a) * 0.11, side(r) * 0.82 + Math.sin(a) * 0.11];
  }
  if (k < 0.8) {
    // Tailplane.
    const s = r();
    const chord = 0.42 - 0.22 * s;
    return [-1.48 - 0.38 * s - edgy(r, 0.25) * chord, 0.13 + 0.05 * s, side(r) * (0.06 + s * 0.78)];
  }
  if (k < 0.88) {
    // Fin.
    const h = r();
    const chord = 0.6 - 0.32 * h;
    return [-1.42 - 0.55 * h - edgy(r, 0.25) * chord, 0.15 + h * 0.85, gauss(r) * 0.01];
  }
  // Contrails streaming back from the engines, spreading as they age.
  const age = Math.pow(r(), 1.5);
  const spread = 0.015 + age * 0.22;
  return [-0.12 - age * 3.1, -0.24 + gauss(r) * spread, side(r) * 0.82 + gauss(r) * spread];
}

function plane(n: number, r: Rng, out: Float32Array) {
  for (let i = 0; i < n; i++) {
    const [x, y, z] = airliner(r);
    // Centre plane plus trail, then bank it up and away in three-quarter view.
    out.set(orient([x + 0.55, y, z], -0.62, 0.42, 0.34), i * 3);
  }
}

type Gear = {
  teeth: number;
  root: number;
  tooth: number;
  cx: number;
  cy: number;
  phase: number;
  spokes: number;
};
type Outline = { pts: number[]; lengths: number[] };

/** Outline of a spur gear as a closed polyline, so points can be spread evenly along it. */
function gearOutline(g: Gear): Outline {
  const steps = g.teeth * 48;
  const pts: number[] = [];
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * TAU;
    const f = Math.min(1, Math.max(0, (Math.cos(g.teeth * (a + g.phase)) + 0.1) * 2.4));
    const rad = g.root + g.tooth * f;
    pts.push(g.cx + Math.cos(a) * rad, g.cy + Math.sin(a) * rad);
  }
  const lengths = [0];
  for (let i = 2; i < pts.length; i += 2) {
    lengths.push(
      lengths[lengths.length - 1] + Math.hypot(pts[i] - pts[i - 2], pts[i + 1] - pts[i - 1]),
    );
  }
  return { pts, lengths };
}

function gearPoint(g: Gear, outline: Outline, r: Rng): V3 {
  const depth = 0.26;
  const k = r();
  if (k < 0.6) {
    // Toothed rim, extruded.
    const { pts, lengths } = outline;
    const target = r() * lengths[lengths.length - 1];
    let lo = 1;
    let hi = lengths.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (lengths[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    const t = (target - lengths[lo - 1]) / (lengths[lo] - lengths[lo - 1] || 1);
    const x = pts[(lo - 1) * 2] + (pts[lo * 2] - pts[(lo - 1) * 2]) * t;
    const y = pts[(lo - 1) * 2 + 1] + (pts[lo * 2 + 1] - pts[(lo - 1) * 2 + 1]) * t;
    const z = r() < 0.6 ? (side(r) * depth) / 2 : (r() - 0.5) * depth;
    return [x, y, z];
  }
  const hole = g.root * 0.22;
  if (k < 0.7) {
    // Axle hole.
    const a = r() * TAU;
    return [g.cx + Math.cos(a) * hole, g.cy + Math.sin(a) * hole, (r() - 0.5) * depth];
  }
  // Front face, with windows cut between the spokes.
  for (;;) {
    const a = r() * TAU;
    const rad = hole + (g.root - hole) * Math.sqrt(r());
    const inWindow =
      rad > hole + 0.14 &&
      rad < g.root - 0.14 &&
      Math.abs((((a * g.spokes) / TAU) % 1) - 0.5) < 0.32;
    if (!inWindow) return [g.cx + Math.cos(a) * rad, g.cy + Math.sin(a) * rad, depth / 2];
  }
}

/** Places gear `b` against `a` at `angle`, phased so a tooth of `a` sits in a gap of `b`. */
function meshWith(a: Gear, angle: number, b: Omit<Gear, "cx" | "cy" | "phase">): Gear {
  const dist = a.root + a.tooth / 2 + b.root + b.tooth / 2 + 0.02;
  return {
    ...b,
    cx: a.cx + Math.cos(angle) * dist,
    cy: a.cy + Math.sin(angle) * dist,
    phase: Math.PI / b.teeth - angle - Math.PI,
  };
}

// Three meshing gears: things that run by themselves.
function gears(n: number, r: Rng, out: Float32Array) {
  const big: Gear = {
    teeth: 12,
    root: 0.98,
    tooth: 0.3,
    cx: -0.62,
    cy: 0.18,
    phase: 0.72,
    spokes: 5,
  };
  const list = [
    big,
    meshWith(big, -0.72, { teeth: 8, root: 0.6, tooth: 0.27, spokes: 4 }),
    meshWith(big, 0.6, { teeth: 6, root: 0.38, tooth: 0.22, spokes: 3 }),
  ];
  const share = [0.5, 0.8, 1];
  const outlines = list.map(gearOutline);
  for (let i = 0; i < n; i++) {
    const k = r();
    const g = share.findIndex((w) => k < w);
    const [x, y, z] = gearPoint(list[g], outlines[g], r);
    out.set(orient([x + 0.05, y, z], 0.38, -0.18, 0), i * 3);
  }
}

// A rain cloud over a puddle: RainWise.
function rain(n: number, r: Rng, out: Float32Array) {
  const puffs: [number, number, number, number][] = [
    [-1.05, 0.95, 0, 0.62],
    [-0.35, 1.3, 0.05, 0.85],
    [0.5, 1.15, -0.05, 0.75],
    [1.15, 0.85, 0, 0.55],
    [0.05, 0.85, 0.25, 0.7],
  ];
  const base = 0.62;
  const drops = Array.from({ length: 46 }, () => [
    (r() - 0.5) * 2.6,
    (r() - 0.5) * 1,
    base - 0.2 - r() * 1.75,
  ]);
  const area = puffs.map((p) => p[3] * p[3]);
  const total = area.reduce((a, b) => a + b, 0);
  for (let i = 0; i < n; i++) {
    const k = r();
    let p: V3;
    if (k < 0.62) {
      // Cloud: the outer skin of overlapping puffs with a flat underside.
      for (;;) {
        let pick = r() * total;
        let j = 0;
        while (j < area.length - 1 && pick > area[j]) pick -= area[j++];
        const [cx, cy, cz, rad] = puffs[j];
        const [x, y, z] = onSphere(r, rad);
        p = [cx + x, Math.max(base, cy + y), cz + z];
        const q = p;
        if (
          !puffs.some(
            (o, m) => m !== j && Math.hypot(q[0] - o[0], q[1] - o[1], q[2] - o[2]) < o[3] * 0.97,
          )
        )
          break;
      }
    } else if (k < 0.88) {
      // Slanted rain streaks.
      const [x, z, y] = drops[Math.floor(r() * drops.length)];
      const t = r() * 0.32;
      p = [x - t * 0.25, y - t, z];
    } else {
      // Ripples where the rain lands.
      const ring = r() < 0.6 ? 0.55 : 1.05;
      const a = r() * TAU;
      p = [Math.cos(a) * ring * 1.3, -1.7 + gauss(r) * 0.01, Math.sin(a) * ring * 0.6];
    }
    out.set(p, i * 3);
  }
}

// A page of writing with a check badge: OwnIt.
function page(n: number, r: Rng, out: Float32Array) {
  const w = 2.2;
  const h = 2.9;
  const fold = 0.5;
  const [left, right, top, bottom] = [-w / 2, w / 2, h / 2, -h / 2];
  const edges: [number, number, number, number][] = [
    [left, bottom, left, top],
    [left, top, right - fold, top],
    [right, top - fold, right, bottom],
    [right, bottom, left, bottom],
    [right - fold, top, right, top - fold],
    [right - fold, top, right - fold, top - fold],
    [right - fold, top - fold, right, top - fold],
  ];
  const lines = Array.from({ length: 8 }, (_, i) => ({
    y: top - 0.62 - i * 0.27,
    len: (i === 0 ? 0.55 : 0.6 + r() * 0.35) * (w - 0.5) - (i < 2 ? fold * 0.6 : 0),
    thick: i === 0 ? 0.1 : 0.05,
  }));
  for (let i = 0; i < n; i++) {
    const k = r();
    let p: V3;
    if (k < 0.3) {
      const [x0, y0, x1, y1] = edges[Math.floor(r() * edges.length)];
      const t = r();
      p = [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, gauss(r) * 0.01];
    } else if (k < 0.62) {
      const line = lines[Math.floor(r() * lines.length)];
      p = [left + 0.25 + r() * line.len, line.y + (r() - 0.5) * line.thick, 0];
    } else if (k < 0.72) {
      // A second sheet behind, slightly offset.
      const [x0, y0, x1, y1] = edges[Math.floor(r() * 4)];
      const t = r();
      p = [x0 + (x1 - x0) * t + 0.22, y0 + (y1 - y0) * t - 0.22, -0.35];
    } else {
      // Check badge breaking out of the corner.
      const cx = right - 0.1;
      const cy = bottom + 0.2;
      if (r() < 0.55) {
        const a = r() * TAU;
        const rad = 0.52 + gauss(r) * 0.012;
        p = [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, 0.3];
      } else {
        const [ax, ay, bx, by] =
          r() < 0.35 ? [-0.24, 0.02, -0.06, -0.17] : [-0.06, -0.17, 0.26, 0.2];
        const u = r();
        p = [cx + ax + (bx - ax) * u, cy + ay + (by - ay) * u + gauss(r) * 0.012, 0.3];
      }
    }
    out.set(orient(p, -0.38, 0.1, -0.08), i * 3);
  }
}

// Two keycaps, Ctrl and A: Ctrl+Automate.
function keys(n: number, r: Rng, out: Float32Array) {
  const caps = [
    { cx: -0.95, half: 1.0, label: "Ctrl", size: 124 },
    { cx: 1.3, half: 0.62, label: "A", size: 210 },
  ];
  const depth = 0.85;
  const height = 0.55;
  const inset = 0.16;
  const labels = caps.map((c) =>
    canvasPixels(400, 340, (ctx) => {
      ctx.font = `800 ${c.size}px ${displayFont()}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(c.label, 200, 180);
    }),
  );
  const plus = Math.floor(n * 0.03);
  for (let i = 0; i < n - plus; i++) {
    const ci = r() < 0.6 ? 0 : 1;
    const c = caps[ci];
    const [bx, bz, tx, tz] = [c.half, depth, c.half - inset, depth - inset];
    const k = r();
    let p: V3;
    if (k < 0.38) {
      // Edges of the cap: base ring, top ring and the four slanted corners.
      const e = Math.floor(r() * 3);
      const t = r() * 2 - 1;
      const sx = side(r);
      const sz = side(r);
      if (e === 2) {
        const u = r();
        p = [c.cx + sx * (bx + (tx - bx) * u), height * u, sz * (bz + (tz - bz) * u)];
      } else {
        const [hx, hz, y] = e ? [tx, tz, height] : [bx, bz, 0];
        p = r() < hx / (hx + hz) ? [c.cx + t * hx, y, sz * hz] : [c.cx + sx * hx, y, t * hz];
      }
    } else if (k < 0.5) {
      // Sparse side walls.
      const u = r();
      const t = r() * 2 - 1;
      const s = side(r);
      p =
        r() < 0.5
          ? [c.cx + t * (bx + (tx - bx) * u), height * u, s * (bz + (tz - bz) * u)]
          : [c.cx + s * (bx + (tx - bx) * u), height * u, t * (bz + (tz - bz) * u)];
    } else {
      // Label on the top face.
      const px = labels[ci];
      if (px.length === 0) {
        p = [c.cx + (r() * 2 - 1) * tx, height, (r() * 2 - 1) * tz];
      } else {
        const j = Math.floor(r() * (px.length / 2)) * 2;
        const scale = (tz * 2) / 340;
        p = [
          c.cx + (px[j] + r() * 2 - 200) * scale,
          height + 0.01,
          (px[j + 1] + r() * 2 - 170) * scale,
        ];
      }
    }
    out.set([p[0], p[1] - height / 2, p[2]], i * 3);
  }
  // A small plus between the keys, level with their tops.
  for (let i = n - plus; i < n; i++) {
    const t = r() * 0.3 - 0.15;
    out.set(r() < 0.5 ? [0.37 + t, height / 2, 0] : [0.37, height / 2, t], i * 3);
  }
}

// ---------- The hero: one chore, automated ----------
// Invoices that someone used to key in by hand drift in from the left, tilted and
// scribbled on. A neural core in the middle reads each one, and it leaves on the right as
// a clean row in a spreadsheet. Once the sheet is full a check lands, the sheet clears
// and the next batch comes in. Every particle carries a path (aFlowA -> aFlowB), a speed,
// a mode and a phase; the shader moves them, so the CPU never touches the buffers again.

export type Flow = { a: Float32Array; b: Float32Array; m: Float32Array };

/** Flow modes, read by the vertex shader. FEED and WRITE share one cycle clock. */
const STILL = 0;
const SPIN = 1;
const FEED = 2;
const WRITE = 3;

/** One batch takes this many seconds: six invoices in, six rows out, a check, a clear. */
const CYCLE = 12;
/** Share of a cycle an invoice spends travelling into the core. The shader reads it too. */
export const FEED_SPAN = 0.34;
const ROWS = 6;
/** When invoice `row` reaches the core, as a share of the cycle. */
const arrival = (row: number) => 0.12 + row * 0.1;
const CHECK_AT = 0.74;

const CORE_R = 0.82;
const DOC = { w: 0.94, h: 1.22, fold: 0.2, endX: -0.42, endScale: 0.12 };
const SHEET = { left: 1.12, top: 1.0, rowH: 2 / (ROWS + 1), cols: [0.3, 0.5, 0.4, 0.32] };
const SHEET_RIGHT = SHEET.left + SHEET.cols.reduce((a, b) => a + b, 0);
const SHEET_BOTTOM = SHEET.top - SHEET.rowH * (ROWS + 1);

type Seg = [number, number, number, number];

/** Picks a point on a set of line segments, weighted by length. */
function onSegments(segs: Seg[], r: Rng): [number, number] {
  const lengths = segs.map(([x0, y0, x1, y1]) => Math.hypot(x1 - x0, y1 - y0));
  let pick = r() * lengths.reduce((a, b) => a + b, 0);
  let i = 0;
  while (i < segs.length - 1 && pick > lengths[i]) pick -= lengths[i++];
  const [x0, y0, x1, y1] = segs[i];
  const t = r();
  return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t];
}

/** A point on a hand-filled invoice, in its own flat coordinates. */
function invoicePoint(r: Rng, seed: number): [number, number] {
  const { w, h, fold } = DOC;
  const [l, rt, t, b] = [-w / 2, w / 2, h / 2, -h / 2];
  const k = r();
  if (k < 0.38) {
    return onSegments(
      [
        [l, b, l, t],
        [l, t, rt - fold, t],
        [rt - fold, t, rt, t - fold],
        [rt, t - fold, rt, b],
        [rt, b, l, b],
        [rt - fold, t, rt - fold, t - fold],
        [rt - fold, t - fold, rt, t - fold],
      ],
      r,
    );
  }
  if (k < 0.48) {
    // Supplier name, written heavier.
    return [l + 0.12 + r() * 0.36, t - 0.2 + (r() - 0.5) * 0.04];
  }
  if (k < 0.85) {
    // Handwritten line items: wobbly, uneven lengths.
    const line = Math.floor(r() * 4);
    const len = (0.5 + (((seed * 7 + line * 3) % 5) / 5) * 0.35) * (w - 0.24);
    const x = l + 0.12 + r() * len;
    const y = t - 0.42 - line * 0.15 + Math.sin(x * 34 + seed * 5 + line * 2) * 0.016;
    return [x, y + gauss(r) * 0.004];
  }
  // A boxed total in the corner.
  const [x0, y0, x1, y1] = [rt - 0.42, b + 0.1, rt - 0.1, b + 0.29];
  if (r() < 0.3) return [x0 + 0.05 + r() * 0.16, (y0 + y1) / 2 + Math.sin(r() * 9) * 0.01];
  return onSegments(
    [
      [x0, y0, x1, y0],
      [x1, y0, x1, y1],
      [x1, y1, x0, y1],
      [x0, y1, x0, y0],
    ],
    r,
  );
}

/** The bar in sheet row `row` (0 is the header), column `col`, as [x0, x1, y]. */
function cellBar(row: number, col: number, fill: number): [number, number, number] {
  const x = SHEET.left + SHEET.cols.slice(0, col).reduce((a, b) => a + b, 0) + 0.06;
  const width = SHEET.cols[col] - 0.12;
  const y = SHEET.top - (row + 0.5) * SHEET.rowH;
  // Amounts sit right-aligned, like numbers in a real sheet.
  return col === 2 ? [x + width * (1 - fill), x + width, y] : [x, x + width * fill, y];
}

function dist3(a: V3, b: V3) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

function lerp3(a: V3, b: V3, t: number): V3 {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

function automation(n: number, r: Rng, out: Float32Array, flow: Flow) {
  // The core: an even shell of nodes plus a few hidden ones inside, each linked to its
  // nearest neighbours.
  const shell = 30;
  const nodes: V3[] = [];
  for (let i = 0; i < shell; i++) {
    const y = 1 - (2 * (i + 0.5)) / shell;
    const rad = Math.sqrt(1 - y * y);
    const th = i * Math.PI * (3 - Math.sqrt(5));
    nodes.push([Math.cos(th) * rad * CORE_R, y * CORE_R, Math.sin(th) * rad * CORE_R]);
  }
  for (let i = 0; i < 6; i++) nodes.push(onSphere(r, 0.36 + r() * 0.1));
  const edges: [V3, V3][] = [];
  const linked = new Set<string>();
  nodes.forEach((p, i) => {
    const nearest = nodes
      .map((q, j) => ({ j, d: dist3(p, q) }))
      .filter(({ j }) => j !== i && (i >= shell || j < shell))
      .sort((a, b) => a.d - b.d)
      .slice(0, 3);
    for (const { j } of nearest) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (linked.has(key)) continue;
      linked.add(key);
      edges.push([p, nodes[j]]);
    }
  });

  // Each invoice gets its own messy starting pose.
  const docs = Array.from({ length: ROWS }, (_, d) => ({
    seed: d,
    at: [
      -2.22 + (r() - 0.5) * 0.2,
      [0.3, -0.26, 0.1, -0.34, 0.36, -0.08][d],
      (r() - 0.5) * 0.6,
    ] as V3,
    roll: (d % 2 ? -1 : 1) * (0.16 + r() * 0.24),
    yaw: (r() - 0.5) * 0.6,
  }));

  // Every invoice becomes one row: date, supplier, amount (right-aligned) and a status dot.
  const fills = Array.from({ length: ROWS }, () => [0.72, 0.5 + r() * 0.4, 0.4 + r() * 0.35]);

  const speed = 1 / CYCLE;
  const share: [string, number][] = [
    ["doc", 0.34],
    ["grid", 0.09],
    ["header", 0.04],
    ["cell", 0.2],
    ["check", 0.035],
    ["node", 0.09],
    ["edge", 0.13],
    ["pulse", 0.05],
    ["kernel", 0.025],
  ];
  const bounds: [string, number][] = [];
  let acc = 0;
  for (const [kind, s] of share) {
    acc += s;
    bounds.push([kind, Math.floor(acc * n)]);
  }
  bounds[bounds.length - 1][1] = n;

  const put = (i: number, a: V3, b: V3, speed: number, mode: number, phase: number, rest?: V3) => {
    const i3 = i * 3;
    flow.a.set(a, i3);
    flow.b.set(b, i3);
    flow.m.set([speed, mode, phase], i3);
    out.set(rest ?? lerp3(a, b, phase), i3);
  };

  const { left, top, rowH, cols } = SHEET;
  const frame: Seg[] = [
    [left, top, SHEET_RIGHT, top],
    [SHEET_RIGHT, top, SHEET_RIGHT, SHEET_BOTTOM],
    [SHEET_RIGHT, SHEET_BOTTOM, left, SHEET_BOTTOM],
    [left, SHEET_BOTTOM, left, top],
    [left, top - rowH, SHEET_RIGHT, top - rowH],
  ];
  const rules: Seg[] = [
    ...Array.from({ length: ROWS - 1 }, (_, k): Seg => {
      const y = top - (k + 2) * rowH;
      return [left, y, SHEET_RIGHT, y];
    }),
    ...cols.slice(0, -1).map((_, c): Seg => {
      const x = left + cols.slice(0, c + 1).reduce((a, b) => a + b, 0);
      return [x, top, x, SHEET_BOTTOM];
    }),
  ];
  // A check stamped over the corner once the last row is in.
  const badge: V3 = [SHEET_RIGHT - 0.16, SHEET_BOTTOM + 0.06, 0.15];

  let i = 0;
  for (const [kind, end] of bounds) {
    for (; i < end; i++) {
      switch (kind) {
        case "doc": {
          const d = docs[Math.floor(r() * ROWS)];
          const [x, y] = invoicePoint(r, d.seed);
          const [ox, oy, oz] = orient([x, y, 0], d.yaw, 0, d.roll);
          const a: V3 = [d.at[0] + ox, d.at[1] + oy, d.at[2] + oz];
          const b: V3 = [DOC.endX + x * DOC.endScale, y * DOC.endScale, 0];
          put(i, a, b, speed, FEED, arrival(d.seed), lerp3(a, b, (d.seed / ROWS) * 0.85));
          break;
        }
        case "grid": {
          // The frame and header rule are solid; the rest are light rules.
          const [x, y] = onSegments(r() < 0.62 ? frame : rules, r);
          put(i, [x, y, 0], [x, y, 0], 0, STILL, 0);
          break;
        }
        case "header": {
          const [x0, x1, y] = cellBar(0, Math.floor(r() * cols.length), 0.62);
          const p: V3 = [x0 + r() * (x1 - x0), y + (r() - 0.5) * 0.06, 0];
          put(i, p, p, 0, STILL, 0);
          break;
        }
        case "cell": {
          const row = Math.floor(r() * ROWS);
          const col = Math.floor(r() * cols.length);
          let b: V3;
          if (col === 3) {
            const [x0, , y] = cellBar(row + 1, col, 0);
            const a = r() * TAU;
            const rad = 0.05 * Math.sqrt(r());
            b = [x0 + 0.07 + Math.cos(a) * rad, y + Math.sin(a) * rad, 0];
          } else {
            const [x0, x1, y] = cellBar(row + 1, col, fills[row][col]);
            b = [x0 + r() * (x1 - x0), y + (r() - 0.5) * 0.04, 0];
          }
          // Each row streams out of the core just after its invoice goes in.
          const a: V3 = [CORE_R * 0.5 + gauss(r) * 0.05, gauss(r) * 0.1, gauss(r) * 0.1];
          put(i, a, b, speed, WRITE, arrival(row) + 0.015, b);
          break;
        }
        case "check": {
          let p: V3;
          if (r() < 0.55) {
            const a = r() * TAU;
            const rad = 0.27 + gauss(r) * 0.008;
            p = [badge[0] + Math.cos(a) * rad, badge[1] + Math.sin(a) * rad, badge[2]];
          } else {
            const [x0, y0, x1, y1] =
              r() < 0.35 ? [-0.13, 0.0, -0.03, -0.1] : [-0.03, -0.1, 0.14, 0.11];
            const u = r();
            p = [badge[0] + x0 + (x1 - x0) * u, badge[1] + y0 + (y1 - y0) * u, badge[2]];
          }
          put(i, lerp3(badge, p, 0.3), p, speed, WRITE, CHECK_AT, p);
          break;
        }
        case "node": {
          const c = nodes[Math.floor(r() * nodes.length)];
          const [x, y, z] = onSphere(r, 0.05 * Math.cbrt(r()));
          const p: V3 = [c[0] + x, c[1] + y, c[2] + z];
          put(i, p, p, 0, SPIN, 0);
          break;
        }
        case "edge": {
          const [a, b] = edges[Math.floor(r() * edges.length)];
          const p = lerp3(a, b, r());
          put(i, p, p, 0, SPIN, 0);
          break;
        }
        case "pulse": {
          const [a, b] = edges[Math.floor(r() * edges.length)];
          const forward = r() < 0.5;
          put(i, forward ? a : b, forward ? b : a, 0.45 + r() * 0.5, SPIN, r());
          break;
        }
        default: {
          const p = onSphere(r, 0.26 * Math.cbrt(r()));
          put(i, p, p, 0, SPIN, 0);
        }
      }
    }
  }
}

const flowCache = new Map<string, Flow>();

function automationShape(n: number, r: Rng, out: Float32Array) {
  const flow: Flow = {
    a: new Float32Array(n * 3),
    b: new Float32Array(n * 3),
    m: new Float32Array(n * 3),
  };
  automation(n, r, out, flow);
  flowCache.set(`automation:${n}`, flow);
}

/** Per-particle paths for shapes that move on their own; null for still shapes. */
export function buildFlow(name: ShapeName, n: number): Flow | null {
  if (name !== "automation") return null;
  buildShape(name, n);
  return flowCache.get(`${name}:${n}`) ?? null;
}

const generators: Record<ShapeName, (n: number, r: Rng, out: Float32Array) => void> = {
  core,
  network,
  database,
  globe,
  helix,
  galaxy,
  plane,
  gears,
  rain,
  page,
  keys,
  initials: (n, r, out) => text("SB", n, r, out, 4.6),
  hello: (n, r, out) => text("hi!", n, r, out, 4.8),
  automation: automationShape,
};

const cache = new Map<string, Float32Array>();

export function buildShape(name: ShapeName, n: number): Float32Array {
  const key = `${name}:${n}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const out = new Float32Array(n * 3);
  generators[name](n, mulberry32(name.length * 7919 + n), out);
  cache.set(key, out);
  return out;
}
