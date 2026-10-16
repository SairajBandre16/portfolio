import { ArrowDown, ArrowRight } from "lucide-react";
import { profile } from "@/lib/site";
import { Magnetic } from "@/components/ui/magnetic";
import { LiveClock } from "./live-clock";
import { PipelineLabels } from "./pipeline-labels";

/** Wraps each accent phrase in the line with the signal gradient. */
function Highlight({ line, accents }: { line: string; accents: string[] }) {
  const pattern = new RegExp(
    `(${accents.map((a) => a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
  );
  return line.split(pattern).map((part, i) =>
    accents.includes(part) ? (
      <span key={i} className="text-signal">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export function Hero() {
  const { intro, location } = profile;
  return (
    <section id="top" data-scene="core" className="relative flex min-h-dvh flex-col pt-24 pb-16">
      <PipelineLabels />
      <div className="container-page my-auto">
        <div className="rise max-w-[46rem]">
          <p className="tag text-muted flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>
              {location.from.city}, {location.from.country}
            </span>
            <ArrowRight size={12} aria-hidden className="text-accent" />
            <span className="sr-only">now in</span>
            <span className="text-fg">
              {location.city}, {location.country}
            </span>
            <span aria-hidden className="text-subtle">
              ·
            </span>
            <span>
              <LiveClock seconds={false} /> local
            </span>
          </p>

          <h1 className="font-display mt-7 text-[min(clamp(2.6rem,1.4rem+3.8vw,5.25rem),12dvh)] leading-[1.04] font-normal tracking-[-0.03em]">
            {intro.greeting} <strong className="font-extrabold">{intro.name}</strong>
          </h1>
          <p className="text-lead text-muted mt-6 max-w-[30ch] leading-snug font-normal">
            <Highlight line={intro.line} accents={intro.accents} />
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href="#work"
                className="bg-accent text-ink inline-flex h-12 items-center gap-2 rounded-full px-6 font-semibold transition-transform active:scale-[0.97]"
              >
                See the work <ArrowDown size={16} />
              </a>
            </Magnetic>
            <a
              href="#contact"
              className="border-line-strong text-fg hover:bg-line inline-flex h-12 items-center gap-2 rounded-full border px-6 font-medium transition-colors"
            >
              Say hello
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
