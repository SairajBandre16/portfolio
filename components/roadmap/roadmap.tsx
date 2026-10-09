"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Check, Navigation, Circle } from "lucide-react";
import profile from "@/content/profile.json";
import { cn } from "@/lib/utils";

type Status = "logged" | "enroute" | "planned";

const statusMeta: Record<Status, { label: string; className: string }> = {
  logged: { label: "Logged", className: "text-muted" },
  enroute: { label: "En route", className: "text-accent" },
  planned: { label: "Planned", className: "text-subtle" },
};

function Marker({ status }: { status: Status }) {
  if (status === "logged")
    return (
      <span className="grid size-7 place-items-center rounded-full border border-line-strong bg-raised text-fg">
        <Check size={13} strokeWidth={2.25} />
      </span>
    );
  if (status === "enroute")
    return (
      <span className="relative grid size-7 place-items-center rounded-full bg-accent text-accent-ink">
        <span className="animate-ping-slow absolute inset-0 rounded-full bg-accent/50" />
        <Navigation size={12} strokeWidth={2.25} className="relative rotate-45" />
      </span>
    );
  return (
    <span className="grid size-7 place-items-center rounded-full border border-dashed border-line-strong bg-bg text-subtle">
      <Circle size={6} fill="currentColor" />
    </span>
  );
}

/** Learning roadmap as a flight plan. The route line draws itself as you scroll. */
export function RoadmapRoute() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  const items = profile.roadmap as { title: string; where: string; status: Status; proof: string }[];

  return (
    <ol ref={ref} className="relative">
      {/* Track and progress line */}
      <span aria-hidden className="absolute top-3 bottom-3 left-[13px] w-px bg-line-strong md:left-1/2" />
      <motion.span
        aria-hidden
        style={{ scaleY }}
        className="absolute top-3 bottom-3 left-[13px] w-px origin-top bg-accent md:left-1/2"
      />

      {items.map((item, i) => {
        const right = i % 2 === 1;
        const meta = statusMeta[item.status];
        return (
          <li key={item.title} className="relative grid grid-cols-[28px_1fr] gap-5 pb-10 last:pb-0 md:grid-cols-[1fr_28px_1fr] md:gap-10 md:pb-14">
            <motion.div
              initial={{ opacity: 0, x: right ? 16 : -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              className={cn(
                "col-start-2 row-start-1 md:row-start-1",
                right ? "md:col-start-3" : "md:col-start-1 md:text-right",
              )}
            >
              <p className={cn("hud", meta.className)}>
                WPT {String(i + 1).padStart(2, "0")} · {meta.label}
              </p>
              <h3 className={cn("mt-2 text-xl font-medium tracking-tight", item.status === "planned" ? "text-muted" : "text-fg")}>
                {item.title}
              </h3>
              <p className="mt-1 text-muted">{item.where}</p>
              <p className="mt-2 font-mono text-xs text-subtle">{item.proof}</p>
            </motion.div>
            <div className="col-start-1 row-start-1 md:col-start-2">
              <Marker status={item.status} />
            </div>
          </li>
        );
      })}

      <li className="relative grid grid-cols-[28px_1fr] gap-5 pt-6 md:grid-cols-[1fr_28px_1fr] md:gap-10">
        <div className="col-start-1 md:col-start-2">
          <span className="grid size-7 place-items-center rounded-full border border-accent text-accent">
            <span className="size-2 rounded-full bg-accent" />
          </span>
        </div>
        <div className="col-start-2 md:col-start-3">
          <p className="hud text-accent">Destination</p>
          <p className="mt-2 font-serif text-3xl text-fg italic">AI Engineer</p>
        </div>
      </li>
    </ol>
  );
}
