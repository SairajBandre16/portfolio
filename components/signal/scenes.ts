// Each page section names a scene with `data-scene`. A scene picks a particle shape and
// where that shape sits on screen. Colours live in globals.css (html[data-scene=…]).

export type ShapeName =
  | "core"
  | "automation"
  | "initials"
  | "network"
  | "database"
  | "globe"
  | "plane"
  | "gears"
  | "rain"
  | "page"
  | "keys"
  | "helix"
  | "galaxy"
  | "hello";

export type SceneConfig = {
  shape: ShapeName;
  /** Horizontal offset as a fraction of half the visible width (desktop only). */
  x: number;
  /** Vertical offset as a fraction of half the visible height. */
  y: number;
  scale: number;
  /** Rotation around X, radians. */
  tilt: number;
  /** Idle spin speed around Y, radians per second. 0 keeps the shape facing the camera. */
  spin: number;
  /** Overall brightness, 0–1. Lower behind dense text. */
  dim: number;
  /** Rightmost extent of the shape in its own units. Set it and the shape shrinks on
      squarer desktop screens rather than running off the right edge. */
  reach?: number;
  /** Phone and tablet overrides. `y` is a fraction of half the visible height; by default
      narrow screens centre the shape at half its desktop offset and at 45% brightness. */
  narrow?: { y?: number; dim?: number };
};

export const scenes: Record<string, SceneConfig> = {
  core: {
    shape: "automation",
    x: 0.48,
    y: 0.02,
    scale: 0.9,
    tilt: 0.05,
    spin: 0,
    dim: 1,
    reach: 2.95,
    narrow: { y: 0.55, dim: 0.75 },
  },
  intro: { shape: "initials", x: 0.52, y: 0.02, scale: 1.15, tilt: 0, spin: 0, dim: 0.8 },
  path: { shape: "network", x: 0, y: 0.05, scale: 1.3, tilt: 0, spin: 0, dim: 0.42 },
  queryforge: { shape: "database", x: 0.5, y: 0, scale: 1, tilt: 0.42, spin: 0.3, dim: 1 },
  chainwatch: { shape: "globe", x: 0.5, y: 0, scale: 1.05, tilt: 0.38, spin: 0.16, dim: 1 },
  ownit: { shape: "page", x: 0.52, y: 0, scale: 0.95, tilt: 0, spin: 0, dim: 1 },
  squawk: { shape: "plane", x: 0.55, y: 0.02, scale: 0.92, tilt: 0, spin: 0, dim: 1 },
  "ctrl-automate": { shape: "keys", x: 0.5, y: 0, scale: 0.92, tilt: 0.95, spin: 0, dim: 1 },
  "personal-automations": {
    shape: "gears",
    x: 0.52,
    y: 0,
    scale: 1.02,
    tilt: 0.12,
    spin: 0,
    dim: 1,
  },
  rainwise: { shape: "rain", x: 0.52, y: 0, scale: 1, tilt: 0.18, spin: 0.14, dim: 1 },
  github: { shape: "helix", x: 0, y: 0, scale: 1.25, tilt: 0.15, spin: 0, dim: 0.35 },
  background: { shape: "galaxy", x: 0.52, y: 0, scale: 1.05, tilt: 1.05, spin: 0.06, dim: 0.7 },
  contact: {
    shape: "hello",
    x: 0.6,
    y: 0.3,
    scale: 0.75,
    tilt: 0,
    spin: 0,
    dim: 0.9,
    narrow: { y: 0.55, dim: 0.22 },
  },
  // The footer sign-off: the field fades back so the big name reads.
  signoff: { shape: "hello", x: 0.6, y: 0.3, scale: 0.75, tilt: 0, spin: 0, dim: 0.12 },
  lost: { shape: "galaxy", x: 0.45, y: 0, scale: 1, tilt: 0.9, spin: 0.08, dim: 0.8 },
};

export const DEFAULT_SCENE = "core";
