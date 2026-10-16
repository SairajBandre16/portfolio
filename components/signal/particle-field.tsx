"use client";

import { useEffect, useRef } from "react";
import type { SignalEngine } from "./engine";

const INTERACTIVE = "a, button, input, textarea, select, label, summary, [role='button']";

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Fixed WebGL canvas behind every page. three.js is loaded after first paint, so it
 * never competes with the content for the LCP.
 */
export function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !hasWebGL()) return;

    let engine: SignalEngine | null = null;
    let cancelled = false;
    const cleanups: (() => void)[] = [];
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    const boot = async () => {
      await document.fonts.ready;
      const { SignalEngine } = await import("./engine");
      if (cancelled) return;
      const e = new SignalEngine(canvas, reduced);
      engine = e;
      e.setTheme(root.dataset.theme === "light");
      e.setScene(root.dataset.scene ?? "core");
      e.start();
      canvas.dataset.ready = "";

      const onScene = () => e.setScene(root.dataset.scene ?? "core");
      window.addEventListener("scenechange", onScene);
      cleanups.push(() => window.removeEventListener("scenechange", onScene));

      const themeObserver = new MutationObserver(() => e.setTheme(root.dataset.theme === "light"));
      themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
      cleanups.push(() => themeObserver.disconnect());

      const onResize = () => e.resize();
      window.addEventListener("resize", onResize);
      cleanups.push(() => window.removeEventListener("resize", onResize));

      const ndc = (ev: PointerEvent | MouseEvent) =>
        [
          (ev.clientX / window.innerWidth) * 2 - 1,
          -(ev.clientY / window.innerHeight) * 2 + 1,
        ] as const;

      if (finePointer) {
        const onMove = (ev: PointerEvent) => e.setPointer(...ndc(ev));
        window.addEventListener("pointermove", onMove, { passive: true });
        cleanups.push(() => window.removeEventListener("pointermove", onMove));
      }

      // Clicking empty space sends a shockwave through the field.
      const onClick = (ev: MouseEvent) => {
        if ((ev.target as Element | null)?.closest(INTERACTIVE)) return;
        e.pulse(...ndc(ev));
      };
      window.addEventListener("click", onClick);
      cleanups.push(() => window.removeEventListener("click", onClick));

      const onVisibility = () => (document.hidden ? e.pause() : e.resume());
      document.addEventListener("visibilitychange", onVisibility);
      cleanups.push(() => document.removeEventListener("visibilitychange", onVisibility));
    };

    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 120));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = idle(() => void boot(), { timeout: 1200 });

    return () => {
      cancelled = true;
      cancelIdle(handle);
      cleanups.forEach((fn) => fn());
      engine?.dispose();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-[100lvh] w-full opacity-0 transition-opacity duration-[1400ms] data-[ready]:opacity-100"
    />
  );
}
