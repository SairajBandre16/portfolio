"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

function Word({
  word,
  index,
  total,
  progress,
  accent,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  accent: boolean;
}) {
  const start = index / total;
  const opacity = useTransform(progress, [start, start + 1 / total], [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className={cn("inline-block", accent && "text-accent")}>
      {word}&nbsp;
    </motion.span>
  );
}

/** A paragraph that lights up word by word as it scrolls through the viewport. */
export function ScrollWords({
  text,
  accents,
  className,
}: {
  text: string;
  accents: string[];
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = text.split(" ");
  const accentSet = new Set(accents);

  if (reduced) {
    return (
      <p ref={ref} className={className}>
        {text}
      </p>
    );
  }

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <Word
            key={i}
            word={w}
            index={i}
            total={words.length}
            progress={scrollYProgress}
            accent={accentSet.has(w.replace(/[.,:;]/g, ""))}
          />
        ))}
      </span>
    </p>
  );
}
