"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { cancelFrame, frame, type FrameData } from "motion/react";

let lenis: Lenis | null = null;

/** Scrolls to an element or offset, smoothly when Lenis is running. */
export function scrollToTarget(target: HTMLElement | number) {
  if (lenis) {
    lenis.scrollTo(target, { offset: typeof target === "number" ? 0 : -16 });
  } else if (typeof target === "number") {
    window.scrollTo({ top: target });
  } else {
    target.scrollIntoView();
  }
}

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const instance = new Lenis({ autoRaf: false, lerp: 0.11, anchors: { offset: -16 } });
    lenis = instance;
    // Ride Motion's frame loop so smooth scroll and animations share one rAF.
    const update = (data: FrameData) => instance.raf(data.timestamp);
    frame.update(update, true);
    return () => {
      cancelFrame(update);
      instance.destroy();
      if (lenis === instance) lenis = null;
    };
  }, []);
  return null;
}
