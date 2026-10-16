"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const GLYPHS = "01<>/{}[]#*+=AIXZ$%";

/** One letter: rises in when scrolled into view, scrambles through glyphs when the pointer touches it. */
function Letter({ ch, delay, outline }: { ch: string; delay: number; outline?: boolean }) {
  const [shown, setShown] = useState(ch);
  const busy = useRef(false);

  const scramble = () => {
    if (busy.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    busy.current = true;
    let n = 0;
    const id = window.setInterval(() => {
      n++;
      if (n > 7) {
        window.clearInterval(id);
        setShown(ch);
        busy.current = false;
      } else {
        setShown(GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);
      }
    }, 42);
  };

  return (
    <motion.span
      className="relative inline-block"
      variants={{
        hidden: { y: "105%" },
        shown: { y: "0%", transition: { delay, type: "spring", stiffness: 110, damping: 17 } },
      }}
      onPointerEnter={scramble}
    >
      {/* The real glyph holds the width so scrambling never shifts its neighbours. */}
      <span className="invisible">{ch}</span>
      <span
        className={cn(
          "absolute inset-0 text-center transition-colors duration-300",
          outline
            ? "text-transparent [-webkit-text-stroke:2px_var(--fg)] hover:text-accent hover:[-webkit-text-stroke:2px_var(--accent)]"
            : "hover:text-accent",
        )}
      >
        {shown}
      </span>
    </motion.span>
  );
}

export function SplitName({ first, last }: { first: string; last: string }) {
  return (
    <motion.p
      aria-hidden
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.4 }}
      className="headline text-mega uppercase select-none"
    >
      <span className="block overflow-hidden pb-[0.04em] whitespace-nowrap">
        {[...first].map((ch, i) => (
          <Letter key={i} ch={ch} delay={0.1 + i * 0.045} />
        ))}
      </span>
      <span className="block overflow-hidden pb-[0.06em] whitespace-nowrap md:pr-[4vw] md:text-right">
        {[...last].map((ch, i) => (
          <Letter key={i} ch={ch} delay={0.32 + i * 0.045} outline />
        ))}
      </span>
    </motion.p>
  );
}
