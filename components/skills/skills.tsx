import { profile } from "@/lib/site";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/ui/reveal";

const marquee = ["Python", "LLM agents", "Text-to-SQL", "n8n", "RPA", "PyTorch", "FastAPI", "SQL", "Evaluation", "Claude Code", "OpenCV", "Next.js"];

export function Skills() {
  return (
    <section id="skills" className="overflow-hidden border-t border-line py-24 md:py-32">
      <div className="container-page">
        <SectionHeading
          id="skills"
          kicker="Skills"
          title={
            <>
              The toolkit, <Accent>only what I&apos;ve shipped with.</Accent>
            </>
          }
        />
      </div>

      {/* Typographic marquee: decorative, so hidden from assistive tech */}
      <div aria-hidden className="relative mb-16 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
          {[...marquee, ...marquee].map((m, i) => (
            <span key={i} className="flex items-center gap-10 text-[clamp(2rem,1.4rem+2.4vw,3.75rem)] font-medium tracking-[-0.04em] text-fg/90">
              {i % 3 === 1 ? <em className="font-serif font-normal text-accent">{m}</em> : m}
              <span className="size-2 rounded-full bg-line-strong" />
            </span>
          ))}
        </div>
      </div>

      <div className="container-page">
        <Stagger className="grid gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {profile.skills.map((group) => (
            <StaggerItem key={group.group} className="bg-bg p-7">
              <h3 className="hud text-accent">{group.group}</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {group.items.map((s) => (
                  <li key={s} className="rounded-full border border-line px-3 py-1.5 text-sm text-muted">
                    {s}
                  </li>
                ))}
              </ul>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
