import { GraduationCap } from "lucide-react";
import { profile } from "@/lib/site";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

export function Experience() {
  return (
    <section id="experience" className="border-t border-line py-24 md:py-36">
      <div className="container-page">
        <SectionHeading
          id="experience"
          kicker="Experience"
          title={
            <>
              Logbook: <Accent>where the hours came from.</Accent>
            </>
          }
        />

        <ol className="relative">
          {profile.experience.map((job) => (
            <li key={job.role} className="grid gap-4 border-t border-line py-10 md:grid-cols-12 md:gap-8">
              <Reveal className="md:col-span-3">
                <p className="font-mono text-sm text-fg">
                  {job.start} <span className="text-subtle">→</span> {job.end}
                </p>
                <p className="hud mt-2 text-subtle">
                  {job.org} · {job.place}
                </p>
              </Reveal>
              <Reveal delay={0.05} className="md:col-span-9">
                <h3 className="text-h3 leading-snug font-medium tracking-[-0.02em] text-fg">{job.role}</h3>
                <ul className="mt-5 space-y-3">
                  {job.points.map((pt) => (
                    <li key={pt} className="grid grid-cols-[1rem_1fr] gap-3 leading-relaxed text-muted">
                      <span aria-hidden className="mt-[0.7em] h-px w-2.5 bg-accent" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 flex flex-wrap gap-2">
                  {job.tags.map((t) => (
                    <span key={t} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
                      {t}
                    </span>
                  ))}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {profile.education.map((ed, i) => (
            <Reveal key={ed.degree} delay={i * 0.06}>
              <div className="h-full rounded-[1.5rem] border border-line bg-raised p-7">
                <div className="flex items-start justify-between gap-4">
                  <GraduationCap size={20} strokeWidth={1.5} className="text-accent" aria-hidden />
                  <span className="font-mono text-sm text-subtle">
                    {ed.start}–{ed.end}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-medium text-fg">{ed.degree}</h3>
                <p className="mt-1 text-muted">
                  {ed.org}, {ed.place}
                </p>
                <p className="mt-4 text-sm text-subtle">{ed.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
