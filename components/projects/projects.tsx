import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowUpRight } from "lucide-react";
import { archive, projects, type Project } from "@/content/projects";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Reveal } from "@/components/ui/reveal";
import { ClaudeCodeBadge, StatusPill } from "./status-pill";
import { AlertsTicker, LaneMap, Pipeline, QueryTerminal } from "./visuals";
import { cn } from "@/lib/utils";

const layout: Record<string, string> = {
  queryforge: "md:col-span-2 lg:col-span-4",
  chainwatch: "lg:col-span-2 lg:row-span-2",
  squawk: "lg:col-span-4",
  "ergode-automation": "lg:col-span-3",
  "personal-automations": "md:col-span-2 lg:col-span-3",
};

function Visual({ slug }: { slug: string }) {
  switch (slug) {
    case "queryforge":
      return <QueryTerminal />;
    case "chainwatch":
      return <LaneMap />;
    case "ergode-automation":
      return <Pipeline />;
    case "personal-automations":
      return <AlertsTicker />;
    default:
      return null;
  }
}

function ProjectCard({ project, priority }: { project: Project; priority?: boolean }) {
  const p = project;
  const wide = p.slug === "queryforge" || p.slug === "squawk";
  return (
    <SpotlightCard as="article" className="group flex w-full flex-col overflow-hidden">
      <div className={cn("flex h-full flex-col gap-7 p-6 sm:p-8", wide && "lg:grid lg:grid-cols-[1fr_1.1fr] lg:gap-10")}>
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <span className="hud mr-1 text-accent">{p.callsign}</span>
            <StatusPill status={p.status} />
            {p.builtWithClaudeCode && <ClaudeCodeBadge />}
          </div>

          <ViewTransition name={`project-title-${p.slug}`}>
            <h3 className="mt-6 text-h3 leading-tight font-medium tracking-[-0.02em] text-fg">
              <Link href={`/projects/${p.slug}`} className="after:absolute after:inset-0 after:z-[2] focus-visible:outline-none">
                {p.title}
              </Link>
            </h3>
          </ViewTransition>
          <p className="mt-3 max-w-[48ch] leading-relaxed text-muted">{p.tagline}</p>

          {p.stats.length > 0 && (
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              {p.stats.slice(0, p.slug === "chainwatch" ? 2 : 3).map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-mono text-xl tracking-tight text-fg">{s.value}</dd>
                  <dd className="mt-1 text-xs leading-snug text-subtle">{s.label}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-auto flex items-center justify-between gap-4 pt-8">
            <p className="hud truncate text-subtle">{p.stack.slice(0, 4).join(" · ")}</p>
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line-strong text-muted transition-all duration-300 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink">
              <ArrowUpRight size={16} />
            </span>
          </div>
        </div>

        {p.image ? (
          <div className="relative -mx-6 -mb-6 overflow-hidden border-t border-line sm:-mx-8 sm:-mb-8 lg:m-0 lg:rounded-2xl lg:border">
            <Image
              src={p.image.src}
              alt={p.image.alt}
              width={800}
              height={500}
              priority={priority}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]"
            />
          </div>
        ) : (
          <div className={cn("relative", p.slug === "chainwatch" && "order-first lg:order-none lg:mt-auto")}>
            <Visual slug={p.slug} />
          </div>
        )}
      </div>
    </SpotlightCard>
  );
}

export function Projects() {
  return (
    <section id="work" className="container-page py-24 md:py-36">
      <SectionHeading
        id="work"
        kicker="Selected work"
        title={
          <>
            Things I&apos;ve built, <Accent>with the numbers attached.</Accent>
          </>
        }
        intro="Each project has a case study covering what I built, how it works, what the results were and what failed."
      />

      <div className="grid auto-rows-auto gap-4 md:grid-cols-2 lg:grid-cols-6 lg:gap-5">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 2) * 0.06} className={cn("flex", layout[p.slug])}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>

      {/* Archive: quieter list, different rhythm */}
      <div className="mt-24">
        <Reveal>
          <h3 className="hud mb-4 text-subtle">Also in the logbook</h3>
        </Reveal>
        <ul className="divide-y divide-line border-y border-line">
          {archive.map((a) => (
            <li key={a.title}>
              <a
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-[3.5rem_1fr_auto] items-baseline gap-x-4 gap-y-1 py-5 transition-colors hover:bg-line/40 sm:grid-cols-[4rem_12rem_1fr_auto] sm:px-3"
              >
                <span className="font-mono text-sm text-subtle">{a.year}</span>
                <span className="font-medium text-fg">
                  {a.title}
                  {a.note && <span className="hud mt-1 block text-accent sm:hidden">{a.note}</span>}
                </span>
                <span className="col-start-2 text-sm text-muted sm:col-start-auto">
                  {a.blurb}
                  {a.note && <span className="hud ml-3 hidden text-accent sm:inline">{a.note}</span>}
                </span>
                <ArrowUpRight
                  size={16}
                  className="col-start-3 row-start-1 text-subtle transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent sm:col-start-auto"
                  aria-hidden
                />
                <span className="sr-only">(opens GitHub in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
