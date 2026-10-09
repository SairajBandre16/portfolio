"use client";

import { memo, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BriefcaseBusiness, House } from "lucide-react";

const alerts = [
  { icon: House, source: "daft.ie", text: "New listing matches your filters" },
  { icon: BriefcaseBusiness, source: "jobs", text: "Fresh AI engineer roles in today's digest" },
  { icon: House, source: "daft.ie", text: "Another new listing in your search area" },
  { icon: BriefcaseBusiness, source: "jobs", text: "New ML role posted in Dublin" },
];

/** A small notification stack that cycles, like the alerts these pipelines send. */
export const AlertsTicker = memo(function AlertsTicker() {
  const [start, setStart] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setStart((s) => (s + 1) % alerts.length), 2600);
    return () => window.clearInterval(id);
  }, []);

  const visible = [0, 1].map((o) => ({ ...alerts[(start + o) % alerts.length], key: (start + o) % alerts.length }));

  return (
    <ul className="relative space-y-2" aria-label="Example alerts from the Daft.ie and job pipelines">
      <AnimatePresence initial={false} mode="popLayout">
        {visible.map(({ icon: Icon, source, text, key }, i) => (
          <motion.li
            key={key}
            layout
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: i === 0 ? 1 : 0.55, y: 0, scale: i === 0 ? 1 : 0.97 }}
            exit={{ opacity: 0, y: -14, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="flex items-center gap-3 rounded-2xl border border-line bg-sunken px-3.5 py-3"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
              <Icon size={15} strokeWidth={1.7} />
            </span>
            <span className="min-w-0">
              <span className="hud block text-[10px] text-subtle">{source} · now</span>
              <span className="block truncate text-sm text-fg">{text}</span>
            </span>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
});
