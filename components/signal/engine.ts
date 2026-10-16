// The particle field behind the whole site. One Points object, two position buffers
// (from → to) and a mix uniform: changing scene copies wherever the particles are right
// now into `from`, writes the new shape into `to`, and lets the shader stagger the trip.

import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  NormalBlending,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Timer,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { buildFlow, buildShape, FEED_SPAN } from "./shapes";
import { DEFAULT_SCENE, scenes, type SceneConfig, type ShapeName } from "./scenes";

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uMix;
uniform float uSpread;
uniform float uSize;
uniform float uPixelRatio;
uniform vec3 uMouse;
uniform float uMouseStrength;
uniform vec2 uPulseOrigin;
uniform float uPulseTime;
uniform float uDrift;
uniform float uFlow;
uniform float uFlowTime;

attribute vec3 aFrom;
attribute vec3 aTo;
attribute float aRand;
attribute vec3 aFlowA;
attribute vec3 aFlowB;
attribute vec3 aFlowM; // speed, mode (0 still, 1 spin, 2 feed, 3 write), phase

varying float vRand;
varying float vGlow;
varying float vDepth;
varying float vFade;

const float FEED_SPAN = ${FEED_SPAN.toFixed(3)};

vec3 rotY(vec3 p, float a) {
  float c = cos(a);
  float s = sin(a);
  return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
}

void main() {
  float t = clamp(uMix * (1.0 + uSpread) - aRand * uSpread, 0.0, 1.0);
  t = t * t * (3.0 - 2.0 * t);
  vec3 p = mix(aFrom, aTo, t);

  // Particles bow outwards mid-flight, so a morph reads as a burst, not a cross-fade.
  float arc = sin(t * 3.14159265);
  p += normalize(p + vec3(0.0001, 0.0002, 0.0003)) * arc * (0.25 + aRand * 0.9);

  // Shapes with a flow move every particle along its own path. uFlow fades that in and
  // out around scene changes, so flowing and still shapes morph into each other.
  float flowK = uFlow * uFlow * (3.0 - 2.0 * uFlow);
  float mode = aFlowM.y;
  vec3 fp;
  float vis;
  float spark;
  if (mode < 1.5) {
    // Still or spinning: loop along the path at the particle's own speed.
    float moving = step(0.0001, aFlowM.x);
    float f = fract(uFlowTime * aFlowM.x + aFlowM.z);
    fp = mix(aFlowA, aFlowB, f);
    if (mode > 0.5) fp = rotY(fp, uFlowTime * 0.22);
    vis = mix(1.0, sin(f * 3.14159265), moving);
    spark = moving;
  } else {
    // Feed and write share one clock, g, so every invoice and row stays in step.
    // The phase is the moment in the cycle the particle's event happens.
    float g = fract(uFlowTime * aFlowM.x);
    if (mode < 2.5) {
      // Feed: glide from A into B over FEED_SPAN of the cycle, arriving at the phase.
      float k = fract(g - aFlowM.z + FEED_SPAN);
      float f = clamp(k / FEED_SPAN, 0.0, 1.0);
      fp = mix(aFlowA, aFlowB, f * f * (3.0 - 2.0 * f));
      vis = step(k, FEED_SPAN) * smoothstep(0.0, 0.1, f) * (1.0 - smoothstep(0.78, 1.0, f));
      spark = 0.0;
    } else {
      // Write: leave A at the phase, settle on B, hold, then clear with the rest.
      float k = smoothstep(aFlowM.z, aFlowM.z + 0.05, g);
      fp = mix(aFlowA, aFlowB, k);
      vis = smoothstep(aFlowM.z, aFlowM.z + 0.008, g) * (1.0 - smoothstep(0.9, 0.96, g));
      spark = 1.0 - k;
    }
  }
  p = mix(p, fp, flowK);
  vFade = mix(1.0, vis, flowK);
  spark *= flowK;

  float ph = aRand * 6.2831853;
  p += vec3(
    sin(uTime * 0.7 + ph + p.y * 1.3),
    cos(uTime * 0.6 + ph * 1.3 + p.x * 1.1),
    sin(uTime * 0.5 + ph * 0.7 + p.z)
  ) * 0.022 * uDrift;

  vec4 world = modelMatrix * vec4(p, 1.0);

  vec2 d = world.xy - uMouse.xy;
  float push = uMouseStrength * smoothstep(1.15, 0.0, length(d));
  world.xy += normalize(d + 1e-4) * push * 0.55;
  world.z += push * 0.4;

  float age = uTime - uPulseTime;
  float pd = length(world.xy - uPulseOrigin);
  float ring = exp(-pow((pd - age * 3.2) * 2.6, 2.0)) * exp(-age * 1.3) * step(0.0, age);
  world.xy += normalize(world.xy - uPulseOrigin + 1e-4) * ring * 0.45;
  world.z += ring * 0.8;

  vec4 mv = viewMatrix * world;
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.55 + aRand * 0.9) * (1.0 + ring * 1.6 + push * 0.8 + spark * 0.5) * uPixelRatio * (10.0 / -mv.z);

  vRand = aRand;
  vGlow = ring + push + spark * 0.6;
  vDepth = clamp((-mv.z - 7.5) / 5.0, 0.0, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;
uniform float uLight;

varying float vRand;
varying float vGlow;
varying float vDepth;
varying float vFade;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = mix(smoothstep(0.5, 0.0, d), smoothstep(0.5, 0.2, d), uLight);
  vec3 col = mix(uColorA, uColorB, smoothstep(0.3, 0.9, vRand));
  col += vGlow * 0.45 * (1.0 - uLight);
  float alpha = a * uOpacity * (0.5 + 0.5 * (1.0 - vDepth)) * (0.6 + vRand * 0.4) * vFade;
  // Normal blending on a pale page needs more ink than additive light on a dark one.
  alpha = min(1.0, alpha * mix(1.0, 1.7, uLight));
  gl_FragColor = vec4(col, alpha);
}
`;

const TAU = Math.PI * 2;
const MORPH_SECONDS = 1.9;
const FLOW_FADE_SECONDS = 1.3;

function lerp(a: number, b: number, k: number) {
  return a + (b - a) * k;
}

function particleCount() {
  if (window.innerWidth < 768) return 4200;
  return (navigator.hardwareConcurrency ?? 4) >= 8 ? 9000 : 6000;
}

/** Points on a scene's shape, in shape units, that the page can pin HTML labels to. */
const ANCHORS: Partial<Record<string, [number, number][]>> = {
  core: [
    [-2.05, 1.14],
    [0, 1.06],
    [1.88, 1.14],
  ],
};

export class SignalEngine {
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera = new PerspectiveCamera(35, 1, 0.1, 50);
  private group = new Group();
  private geometry = new BufferGeometry();
  private material: ShaderMaterial;
  private timer = new Timer();
  private elapsed = 0;
  private count: number;
  private from: Float32Array;
  private to: Float32Array;
  private rand: Float32Array;
  private flowA: Float32Array;
  private flowB: Float32Array;
  private flowM: Float32Array;
  private flowTarget = 0;
  private shape: ShapeName | null = null;
  private sceneId = DEFAULT_SCENE;
  private config: SceneConfig = scenes[DEFAULT_SCENE];
  private mix = 1;
  private targetA = new Color();
  private targetB = new Color();
  private pointer = { x: 0, y: 0, lastMove: -10 };
  private frame = 0;
  private narrow = false;
  private light = false;
  private disposed = false;

  constructor(
    private canvas: HTMLCanvasElement,
    private reduced: boolean,
  ) {
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setClearColor(0x000000, 0);
    this.camera.position.set(0, 0, 10);
    // Label anchors are projected before the first render, so the view matrix must be current.
    this.camera.updateMatrixWorld();
    this.timer.connect(document);

    this.count = particleCount();
    this.from = new Float32Array(this.count * 3);
    this.to = new Float32Array(this.count * 3);
    this.rand = new Float32Array(this.count);
    this.flowA = new Float32Array(this.count * 3);
    this.flowB = new Float32Array(this.count * 3);
    this.flowM = new Float32Array(this.count * 3);
    for (let i = 0; i < this.count; i++) this.rand[i] = Math.random();

    this.geometry.setAttribute("position", new BufferAttribute(this.to, 3));
    this.geometry.setAttribute("aFrom", new BufferAttribute(this.from, 3));
    this.geometry.setAttribute("aTo", new BufferAttribute(this.to, 3));
    this.geometry.setAttribute("aRand", new BufferAttribute(this.rand, 1));
    this.geometry.setAttribute("aFlowA", new BufferAttribute(this.flowA, 3));
    this.geometry.setAttribute("aFlowB", new BufferAttribute(this.flowB, 3));
    this.geometry.setAttribute("aFlowM", new BufferAttribute(this.flowM, 3));

    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uMix: { value: 1 },
        uSpread: { value: 0.6 },
        uSize: { value: 2.3 },
        uPixelRatio: { value: 1 },
        uMouse: { value: new Vector3(99, 99, 0) },
        uMouseStrength: { value: 0 },
        uPulseOrigin: { value: new Vector2() },
        uPulseTime: { value: -100 },
        uDrift: { value: reduced ? 0 : 1 },
        uFlow: { value: 0 },
        // Reduced motion renders one frame: mid-batch, with rows written and an invoice in flight.
        uFlowTime: { value: reduced ? 6 : 0 },
        uColorA: { value: new Color("#c8f53a") },
        uColorB: { value: new Color("#45e3f2") },
        uOpacity: { value: 0 },
        uLight: { value: 0 },
      },
    });

    const points = new Points(this.geometry, this.material);
    points.frustumCulled = false;
    this.group.add(points);
    this.scene.add(this.group);
    this.resize();
  }

  get halfHeight() {
    return Math.tan((this.camera.fov * Math.PI) / 360) * this.camera.position.z;
  }

  resize() {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.material.uniforms.uPixelRatio.value = dpr;
    this.narrow = w < 900;
    this.publishAnchors();
    if (this.reduced) this.render();
  }

  setTheme(light: boolean) {
    this.light = light;
    this.material.blending = light ? NormalBlending : AdditiveBlending;
    this.material.uniforms.uLight.value = light ? 1 : 0;
    this.material.needsUpdate = true;
    this.readColours(true);
  }

  /** Pull the scene colours from CSS so the palette has one source of truth. */
  readColours(snap = false) {
    const css = getComputedStyle(document.documentElement);
    const a = css.getPropertyValue("--scene-a").trim();
    const b = css.getPropertyValue("--scene-b").trim();
    if (a) this.targetA.set(a);
    if (b) this.targetB.set(b);
    if (snap || this.reduced) {
      this.material.uniforms.uColorA.value.copy(this.targetA);
      this.material.uniforms.uColorB.value.copy(this.targetB);
      if (this.reduced) this.render();
    }
  }

  setScene(id: string) {
    this.sceneId = scenes[id] ? id : DEFAULT_SCENE;
    this.config = scenes[this.sceneId];
    this.readColours();
    if (this.config.shape !== this.shape) this.morphTo(this.config.shape);
    this.publishAnchors();
    if (this.reduced) {
      this.applyTransform(1, 0);
      this.render();
    }
  }

  private morphTo(shape: ShapeName) {
    const next = buildShape(shape, this.count);
    const first = this.shape === null;
    if (first || this.reduced) {
      this.from.set(next);
      this.to.set(next);
      this.mix = 1;
    } else {
      // Freeze the particles where they are now, including the mid-flight bow.
      const spread = this.material.uniforms.uSpread.value as number;
      for (let i = 0; i < this.count; i++) {
        let t = Math.min(1, Math.max(0, this.mix * (1 + spread) - this.rand[i] * spread));
        t = t * t * (3 - 2 * t);
        const i3 = i * 3;
        const x = lerp(this.from[i3], this.to[i3], t);
        const y = lerp(this.from[i3 + 1], this.to[i3 + 1], t);
        const z = lerp(this.from[i3 + 2], this.to[i3 + 2], t);
        const len = Math.hypot(x, y, z) || 1;
        const bow = Math.sin(t * Math.PI) * (0.25 + this.rand[i] * 0.9);
        this.from[i3] = x + (x / len) * bow;
        this.from[i3 + 1] = y + (y / len) * bow;
        this.from[i3 + 2] = z + (z / len) * bow;
      }
      this.to.set(next);
      this.mix = 0;
    }

    // Flow paths are only ever swapped in: a still shape just fades the old flow out.
    const flow = buildFlow(shape, this.count);
    if (flow) {
      this.flowA.set(flow.a);
      this.flowB.set(flow.b);
      this.flowM.set(flow.m);
      for (const name of ["aFlowA", "aFlowB", "aFlowM"]) {
        (this.geometry.getAttribute(name) as BufferAttribute).needsUpdate = true;
      }
    }
    this.flowTarget = flow ? 1 : 0;
    if (first || this.reduced) this.material.uniforms.uFlow.value = this.flowTarget;

    this.shape = shape;
    (this.geometry.getAttribute("aFrom") as BufferAttribute).needsUpdate = true;
    (this.geometry.getAttribute("aTo") as BufferAttribute).needsUpdate = true;
  }

  private toWorld(nx: number, ny: number) {
    const v = new Vector3(nx, ny, 0.5).unproject(this.camera).sub(this.camera.position).normalize();
    const dist = -this.camera.position.z / v.z;
    return this.camera.position.clone().add(v.multiplyScalar(dist));
  }

  setPointer(nx: number, ny: number) {
    const p = this.toWorld(nx, ny);
    this.pointer.x = p.x;
    this.pointer.y = p.y;
    this.pointer.lastMove = this.elapsed;
  }

  pulse(nx: number, ny: number) {
    if (this.reduced) return;
    const p = this.toWorld(nx, ny);
    (this.material.uniforms.uPulseOrigin.value as Vector2).set(p.x, p.y);
    this.material.uniforms.uPulseTime.value = this.elapsed;
  }

  /** Where the scene's shape settles once the lerp is done. */
  private target() {
    const c = this.config;
    const halfH = this.halfHeight;
    const halfW = halfH * this.camera.aspect;
    // Wide shapes (those with a reach) fit by their reach on narrow screens too.
    const fit = Math.min(1, halfW / Math.max(2.7, c.reach ?? 0));
    let scale = c.scale * (this.narrow ? fit * 1.05 : 1);
    if (!this.narrow && c.reach) scale = Math.min(scale, (halfW * (0.97 - c.x)) / c.reach);
    return {
      x: this.narrow ? 0 : c.x * halfW,
      y: this.narrow ? (c.narrow?.y ?? c.y * 0.5) * halfH : c.y * halfH,
      scale,
      dim: this.narrow ? (c.narrow?.dim ?? c.dim * 0.45) : c.dim,
    };
  }

  /**
   * Projects the scene's label anchors to screen pixels and hands them to CSS as
   * --anchor-N-x / --anchor-N-y on <html>; html[data-anchors] names the scene they belong to.
   */
  private publishAnchors() {
    const root = document.documentElement;
    const anchors = ANCHORS[this.sceneId];
    if (!anchors || this.narrow) {
      delete root.dataset.anchors;
      return;
    }
    const t = this.target();
    const tilt = this.config.tilt;
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    anchors.forEach(([lx, ly], i) => {
      const v = new Vector3(
        t.x + lx * t.scale,
        t.y + ly * t.scale * Math.cos(tilt),
        ly * t.scale * Math.sin(tilt),
      );
      v.project(this.camera);
      root.style.setProperty(`--anchor-${i + 1}-x`, `${(((v.x + 1) / 2) * w).toFixed(1)}px`);
      root.style.setProperty(`--anchor-${i + 1}-y`, `${(((1 - v.y) / 2) * h).toFixed(1)}px`);
    });
    root.dataset.anchors = this.sceneId;
  }

  private applyTransform(k: number, dt: number) {
    const c = this.config;
    const t = this.target();
    const g = this.group;

    g.position.x = lerp(g.position.x, t.x, k);
    g.position.y = lerp(g.position.y, t.y, k);
    g.scale.setScalar(lerp(g.scale.x, t.scale, k));
    g.rotation.x = lerp(g.rotation.x, c.tilt, k);

    if (c.spin > 0) {
      g.rotation.y += c.spin * dt;
    } else {
      // Face the camera again via the nearest full turn, then sway a little.
      const home = Math.round(g.rotation.y / TAU) * TAU;
      const sway = this.reduced ? 0 : Math.sin(this.elapsed * 0.45) * (c.reach ? 0.08 : 0.14);
      g.rotation.y = lerp(g.rotation.y, home + sway, k);
    }

    const u = this.material.uniforms;
    u.uOpacity.value = lerp(u.uOpacity.value, t.dim * (this.light ? 0.9 : 1), k * 0.6);
    u.uSize.value = this.light ? 2.7 : 2.3;
  }

  private render() {
    this.material.uniforms.uMix.value = this.mix;
    this.renderer.render(this.scene, this.camera);
  }

  private tick = (timestamp: number) => {
    if (this.disposed) return;
    this.frame = requestAnimationFrame(this.tick);
    this.timer.update(timestamp);
    const dt = Math.min(this.timer.getDelta(), 0.05);
    const t = this.timer.getElapsed();
    this.elapsed = t;
    const u = this.material.uniforms;
    u.uTime.value = t;
    u.uFlowTime.value = t;

    if (this.mix < 1) this.mix = Math.min(1, this.mix + dt / MORPH_SECONDS);
    const flow = u.uFlow.value as number;
    if (flow !== this.flowTarget) {
      const step = dt / FLOW_FADE_SECONDS;
      u.uFlow.value =
        flow < this.flowTarget
          ? Math.min(this.flowTarget, flow + step)
          : Math.max(this.flowTarget, flow - step);
    }
    this.applyTransform(1 - Math.pow(0.002, dt), dt);

    u.uColorA.value.lerp(this.targetA, 1 - Math.pow(0.02, dt));
    u.uColorB.value.lerp(this.targetB, 1 - Math.pow(0.02, dt));

    const active = t - this.pointer.lastMove < 1.6 ? 1 : 0;
    u.uMouseStrength.value = lerp(u.uMouseStrength.value, active, 1 - Math.pow(0.05, dt));
    const m = u.uMouse.value as Vector3;
    m.x = lerp(m.x, this.pointer.x, 1 - Math.pow(0.001, dt));
    m.y = lerp(m.y, this.pointer.y, 1 - Math.pow(0.001, dt));

    this.render();
  };

  start() {
    if (this.reduced) {
      this.material.uniforms.uOpacity.value = this.target().dim;
      this.applyTransform(1, 0);
      this.render();
      return;
    }
    this.timer.reset();
    this.frame = requestAnimationFrame(this.tick);
  }

  pause() {
    cancelAnimationFrame(this.frame);
    this.frame = 0;
  }

  resume() {
    if (this.reduced || this.frame || this.disposed) return;
    this.timer.reset();
    this.frame = requestAnimationFrame(this.tick);
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.frame);
    this.timer.dispose();
    delete document.documentElement.dataset.anchors;
    this.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();
  }
}
