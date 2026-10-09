"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/** A HUD reticle that trails the native cursor. Fine pointers only; never replaces the cursor. */
export function Reticle() {
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const scale = useMotionValue(1);
  const sScale = useSpring(scale, { stiffness: 300, damping: 24 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || still) return;
    setEnabled(true);

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as Element | null;
      scale.set(target?.closest("a, button, [data-reticle]") ? 1.9 : 1);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [x, y, scale]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[70] hidden md:block"
      style={{ x: sx, y: sy, scale: sScale }}
    >
      <div className="-translate-x-1/2 -translate-y-1/2">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-accent">
          <circle cx="14" cy="14" r="9" stroke="currentColor" strokeOpacity="0.55" />
          <path d="M14 1v6M14 21v6M1 14h6M21 14h6" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </div>
    </motion.div>
  );
}
