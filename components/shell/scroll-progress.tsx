"use client";

import { motion, useScroll, useSpring } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="bg-accent fixed inset-x-0 top-0 z-50 h-[2px] origin-left"
      style={{ scaleX }}
    />
  );
}
