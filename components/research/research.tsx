import { ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/site";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { GitHubIcon } from "@/components/ui/icons";

export function Research() {
  return (
    <section id="research" className="container-page py-24 md:py-32">
      <SectionHeading
        id="research"
        kicker="Research"
        title={
          <>
            Two papers, <Accent>both from things I built.</Accent>
          </>
        }
      />
      <ol className="grid gap-4 md:grid-cols-12">
        {profile.publications.map((pub, i) => (
          <li key={pub.title} className={i === 0 ? "md:col-span-7" : "md:col-span-5"}>
            <Reveal delay={i * 0.06} className="h-full">
              <article className="flex h-full flex-col rounded-[1.5rem] border border-line p-7 sm:p-9">
                <p className="hud flex items-center justify-between text-subtle">
                  <span>Paper {String(i + 1).padStart(2, "0")}</span>
                  <span className="font-mono text-sm tracking-normal text-accent normal-case">{pub.year}</span>
                </p>
                <h3 className="mt-8 font-serif text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)] leading-[1.05] text-fg italic">
                  {pub.title}
                </h3>
                <p className="mt-3 text-sm text-muted">{pub.venue}</p>
                <p className="mt-6 leading-relaxed text-muted">{pub.summary}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-8">
                  {pub.link && (
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink"
                    >
                      Read the paper <ArrowUpRight size={14} />
                    </a>
                  )}
                  <a
                    href={pub.project}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-sm text-fg hover:bg-line"
                  >
                    <GitHubIcon size={14} /> Project code
                  </a>
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
