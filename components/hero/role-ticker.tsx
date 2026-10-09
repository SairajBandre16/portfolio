"use client";

import { useEffect, useState } from "react";

/** Typewriter that cycles through role lines. Static for reduced motion. */
export function RoleTicker({ roles }: { roles: string[] }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(roles[0] ?? "");
  const [phase, setPhase] = useState<"hold" | "delete" | "type">("hold");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = roles[index];
    let t: number;
    if (phase === "hold") {
      t = window.setTimeout(() => setPhase("delete"), 2200);
    } else if (phase === "delete") {
      t = text.length
        ? window.setTimeout(() => setText(text.slice(0, -1)), 28)
        : window.setTimeout(() => {
            setIndex((i) => (i + 1) % roles.length);
            setPhase("type");
          }, 220);
    } else {
      t =
        text.length < target.length
          ? window.setTimeout(() => setText(target.slice(0, text.length + 1)), 55)
          : window.setTimeout(() => setPhase("hold"), 0);
    }
    return () => window.clearTimeout(t);
  }, [phase, text, index, roles]);

  return (
    <span className="inline-flex items-center">
      <span className="sr-only">{roles.join(", ")}</span>
      <span aria-hidden className="text-fg">
        {text}
      </span>
      <span
        aria-hidden
        className="animate-caret ml-0.5 inline-block h-[1.1em] w-[0.55ch] translate-y-[1px] bg-accent"
      />
    </span>
  );
}
