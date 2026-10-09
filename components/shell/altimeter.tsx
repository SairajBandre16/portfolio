"use client";

import { AnimatePresence, motion } from "motion/react";
import { sections } from "@/lib/site";
import { useActiveSection } from "@/lib/use-active-section";

const ids = sections.map((s) => s.id);

/** Desktop-only readout of the current "flight level" as the page climbs. */
export function Altimeter() {
  const active = useActiveSection(ids);
  const index = Math.max(0, ids.indexOf(active as (typeof ids)[number]));
  const current = sections[index];

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-6 left-6 z-30 hidden items-end gap-3 xl:flex"
    >
      <div className="flex h-28 flex-col-reverse justify-between">
        {sections.map((s, i) => (
          <span
            key={s.id}
            className="block h-px transition-all duration-500"
            style={{
              width: i === index ? 18 : 8,
              background: i <= index ? "var(--accent)" : "var(--line-strong)",
            }}
          />
        ))}
      </div>
      <div className="hud leading-tight">
        <div className="text-subtle">ALT</div>
        <div className="relative h-4 overflow-hidden text-fg">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={current.fl}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              className="block"
            >
              {current.fl}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="text-subtle">{current.label}</div>
      </div>
    </div>
  );
}
