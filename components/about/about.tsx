import { Plane } from "lucide-react";
import { profile } from "@/lib/site";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";

export function About() {
  const { about } = profile;
  return (
    <section id="about" className="container-page py-24 md:py-36">
      <SectionHeading
        id="about"
        kicker="About"
        title={
          <>
            A builder who learned AI <Accent>on the warehouse floor.</Accent>
          </>
        }
      />

      <div className="grid gap-12 md:grid-cols-12">
        <div className="space-y-6 text-lg leading-relaxed text-muted md:col-span-7 md:col-start-4">
          {about.story.map((para, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <p className={i === 0 ? "text-fg" : undefined}>{para}</p>
            </Reveal>
          ))}
          <Reveal>
            <p className="flex gap-3 border-l-2 border-accent pl-5 text-base">
              <Plane size={18} strokeWidth={1.5} className="mt-1 shrink-0 -rotate-45 text-accent" aria-hidden />
              <span>{about.aside}</span>
            </p>
          </Reveal>
        </div>
      </div>

      {/* How I learn: a closed loop */}
      <div className="mt-20 md:mt-28">
        <Reveal>
          <p className="hud mb-6 text-subtle">How I learn · repeat until hired</p>
        </Reveal>
        <Stagger className="grid overflow-hidden rounded-[1.75rem] border border-line md:grid-cols-3">
          {about.loop.map((step, i) => (
            <StaggerItem
              key={step.step}
              className="relative border-line bg-raised p-7 not-last:border-b md:not-last:border-r md:not-last:border-b-0 md:p-9"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-sm text-accent">0{i + 1}</span>
                <span className="hud text-subtle">{i === 2 ? "↺ loop" : "→"}</span>
              </div>
              <h3 className="mt-8 text-h3 font-medium tracking-tight text-fg">{step.step}</h3>
              <p className="mt-3 leading-relaxed text-muted">{step.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal>
          <p className="mt-5 max-w-[62ch] text-sm text-subtle">
            Claude Code is my pair-programmer for every project here. I set the plan and the
            constraints, review every change, and own the numbers in the write-up.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
