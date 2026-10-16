"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { Check } from "lucide-react";
import { profile } from "@/lib/site";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/utils";

type Status = "logged" | "enroute" | "planned";

const statusText: Record<Status, string> = {
  logged: "Done",
  enroute: "In progress",
  planned: "Up next",
};

/**
 * Vertical scroll drives a horizontal track. The section is exactly as tall as the
 * track is wide, so one pixel of scroll moves the track one pixel. The height comes
 * from CSS (.path-runway), so it is right in the server HTML and anchors below never shift.
 */
export function LearningPath() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const items = profile.roadmap as {
    title: string;
    where: string;
    status: Status;
    proof: string;
  }[];

  return (
    <section
      ref={section}
      id="path"
      data-scene="path"
      className="path-runway relative"
      style={{ "--cards": items.length } as React.CSSProperties}
    >
      <div className="sticky top-0 flex h-dvh flex-col justify-center overflow-hidden pt-20 pb-4">
        <div className="container-page flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel index="02" label="Learning path" />
            <h2 className="headline text-display mt-4">
              Learn. Build. <span className="text-signal">Ship.</span>
            </h2>
          </div>
          <ul className="tag text-muted flex gap-5">
            <li className="flex items-center gap-2">
              <span className="bg-fg size-2 rounded-full" /> Done
            </li>
            <li className="flex items-center gap-2">
              <span className="bg-accent size-2 rounded-full" /> In progress
            </li>
            <li className="flex items-center gap-2">
              <span className="border-fg/60 size-2 rounded-full border border-dashed" /> Up next
            </li>
          </ul>
        </div>

        <motion.div
          ref={track}
          style={{ x }}
          className="mt-[clamp(1.5rem,4vh,3rem)] flex w-max items-stretch gap-5 pr-[8vw] pl-4 sm:pl-7 lg:pl-12"
        >
          <div className="flex w-[80vw] shrink-0 flex-col justify-between gap-8 sm:w-[52vw] lg:w-[34vw]">
            <p className="tag text-muted">How I learn</p>
            <ol className="space-y-4">
              {profile.about.loop.map((s, i) => (
                <li key={s.step} className="flex items-baseline gap-4">
                  <span className="font-dot text-accent text-3xl font-black">{i + 1}</span>
                  <span>
                    <span className="font-display text-fg text-2xl font-bold">{s.step}</span>
                    <span className="text-subtle block text-sm">{s.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {items.map((item, i) => (
            <article
              key={item.title}
              className={cn(
                "panel relative flex min-h-[min(22rem,40vh)] w-[78vw] shrink-0 flex-col rounded-[2rem] p-6 sm:w-[44vw] lg:w-[28vw] xl:w-[24vw]",
                item.status === "planned" && "border-dashed bg-transparent",
              )}
            >
              <div className="flex items-start justify-between">
                <span
                  className={cn(
                    "font-dot text-[clamp(2.6rem,7vh,4.5rem)] leading-none font-black",
                    item.status === "logged" && "text-fg",
                    item.status === "enroute" && "text-accent",
                    item.status === "planned" && "text-subtle",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "tag inline-flex items-center gap-1.5 rounded-full px-2.5 py-1",
                    item.status === "logged" && "bg-fg text-bg",
                    item.status === "enroute" && "bg-accent text-ink",
                    item.status === "planned" &&
                      "border-line-strong text-muted border border-dashed",
                  )}
                >
                  {item.status === "logged" && <Check size={11} strokeWidth={3} aria-hidden />}
                  {statusText[item.status]}
                </span>
              </div>
              <h3 className="font-display text-fg mt-auto pt-8 text-2xl leading-tight font-bold tracking-tight">
                {item.title}
              </h3>
              <p className="text-muted mt-2 text-sm">{item.where}</p>
              <p className="border-line text-fg mt-5 border-t pt-4 text-sm">
                <span className="tag text-subtle mr-2">Proof</span>
                {item.proof}
              </p>
            </article>
          ))}
        </motion.div>

        <div className="container-page mt-[clamp(1rem,3vh,2.5rem)]">
          <div className="bg-line h-px w-full">
            <motion.div style={{ scaleX: progress }} className="bg-accent h-px origin-left" />
          </div>
        </div>
      </div>
    </section>
  );
}
