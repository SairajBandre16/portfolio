import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, ViewTransition } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { getProject, projects, type Section } from "@/content/projects";
import { ClaudeCodeBadge, StatusPill } from "@/components/projects/status-pill";
import { ButtonLink } from "@/components/ui/button-link";
import { GitHubIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { AlertsTicker, LaneMap, Pipeline, QueryTerminal } from "@/components/projects/visuals";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return { title: "Project not found" };
  return {
    title: p.title,
    description: p.tagline,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title: p.title, description: p.tagline, url: `/projects/${p.slug}` },
  };
}

function Visual({ slug }: { slug: string }) {
  if (slug === "queryforge") return <QueryTerminal />;
  if (slug === "chainwatch") return <LaneMap />;
  if (slug === "ergode-automation") return <Pipeline />;
  if (slug === "personal-automations") return <AlertsTicker />;
  return null;
}

function SectionBlock({ s, index }: { s: Section; index: number }) {
  return (
    <Reveal className="grid gap-4 border-t border-line py-12 md:grid-cols-12 md:gap-8">
      <div className="md:col-span-4">
        <p className="hud text-subtle">{String(index + 1).padStart(2, "0")}</p>
        <h2 className="mt-2 text-h3 leading-tight font-medium tracking-[-0.02em] text-fg">{s.heading}</h2>
      </div>
      <div className="space-y-5 text-lg leading-relaxed text-muted md:col-span-8">
        {s.body?.map((b) => <p key={b}>{b}</p>)}
        {s.bullets && (
          <ul className="space-y-3">
            {s.bullets.map((b) => (
              <li key={b} className="grid grid-cols-[1rem_1fr] gap-3">
                <span aria-hidden className="mt-[0.75em] h-px w-2.5 bg-accent" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
        {s.table && (
          <figure className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full text-left text-base">
              <thead className="hud bg-sunken text-subtle">
                <tr>
                  {s.table.head.map((h) => (
                    <th key={h} scope="col" className="px-5 py-3 font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {s.table.rows.map((row) => (
                  <tr key={row.join()}>
                    {row.map((cell, i) => (
                      <td key={i} className={i === row.length - 1 ? "px-5 py-3 font-mono text-fg" : "px-5 py-3"}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {s.table.caption && (
              <figcaption className="border-t border-line px-5 py-3 text-sm text-subtle">{s.table.caption}</figcaption>
            )}
          </figure>
        )}
      </div>
    </Reveal>
  );
}

async function CaseStudy({ params }: Pick<PageProps<"/projects/[slug]">, "params">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const i = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(i + 1) % projects.length];

  return (
    <article className="container-page pt-28 pb-24 sm:pt-32">
      <Link href="/#work" className="group inline-flex items-center gap-2 text-sm text-muted hover:text-fg">
        <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" /> All projects
      </Link>

      <header className="mt-10 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="hud mr-1 text-accent">{p.callsign}</span>
            <StatusPill status={p.status} />
            {p.builtWithClaudeCode && <ClaudeCodeBadge />}
          </div>
          <ViewTransition name={`project-title-${p.slug}`}>
            <h1 className="mt-6 text-hero leading-[0.95] font-medium tracking-[-0.045em] text-fg">{p.title}</h1>
          </ViewTransition>
          <p className="mt-6 max-w-[52ch] text-xl leading-relaxed text-muted">{p.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {p.links.demo && (
              <ButtonLink href={p.links.demo} external variant="primary">
                Live demo <ArrowUpRight size={16} />
              </ButtonLink>
            )}
            {p.links.repo && (
              <ButtonLink href={p.links.repo} external>
                <GitHubIcon size={15} /> Source
              </ButtonLink>
            )}
          </div>
        </div>
        <dl className="grid content-start gap-6 md:col-span-4 md:border-l md:border-line md:pl-8">
          <div>
            <dt className="hud text-subtle">Role</dt>
            <dd className="mt-1 text-fg">{p.role}</dd>
          </div>
          <div>
            <dt className="hud text-subtle">Year</dt>
            <dd className="mt-1 font-mono text-fg">{p.year}</dd>
          </div>
          <div>
            <dt className="hud text-subtle">Stack</dt>
            <dd className="mt-2 flex flex-wrap gap-1.5">
              {p.stack.map((t) => (
                <span key={t} className="rounded-full border border-line px-2.5 py-1 text-xs text-muted">
                  {t}
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </header>

      <div className="mt-16 grid gap-4 md:grid-cols-12">
        <div className="rounded-[1.75rem] border border-line bg-raised p-6 sm:p-8 md:col-span-7">
          {p.image ? (
            <Image
              src={p.image.src}
              alt={p.image.alt}
              width={800}
              height={500}
              priority
              sizes="(min-width: 768px) 55vw, 100vw"
              className="w-full rounded-xl"
            />
          ) : (
            <Visual slug={p.slug} />
          )}
        </div>
        <dl className="grid gap-4 md:col-span-5">
          {p.stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse rounded-[1.5rem] border border-line p-6">
              <dt className="mt-2 text-sm text-muted">{s.label}</dt>
              <dd className="font-mono text-3xl tracking-tight text-fg">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {p.slug === "squawk" && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Image src="/projects/squawk-orbit.jpg" alt="SQUAWK orbit view over Dublin" width={764} height={868} sizes="50vw" className="w-full rounded-[1.5rem] border border-line" />
          <Image src="/projects/squawk-ground.jpg" alt="SQUAWK ground view looking up at aircraft" width={764} height={868} sizes="50vw" className="w-full rounded-[1.5rem] border border-line" />
        </div>
      )}

      <Reveal className="mt-20 max-w-[62ch]">
        <p className="text-2xl leading-snug tracking-[-0.01em] text-fg">{p.summary}</p>
      </Reveal>

      <div className="mt-16">
        {p.sections.map((s, idx) => (
          <SectionBlock key={s.heading} s={s} index={idx} />
        ))}
      </div>

      <Link
        href={`/projects/${next.slug}`}
        className="group mt-16 flex items-center justify-between gap-6 rounded-[1.75rem] border border-line p-8 transition-colors hover:border-line-strong hover:bg-raised"
      >
        <span>
          <span className="hud text-subtle">Next contact · {next.callsign}</span>
          <span className="mt-2 block text-h3 font-medium tracking-tight text-fg">{next.title}</span>
        </span>
        <ArrowRight size={22} className="shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent" />
      </Link>
    </article>
  );
}

function CaseStudySkeleton() {
  return (
    <div className="container-page pt-32 pb-24" aria-busy="true">
      <div className="skeleton h-4 w-28" />
      <div className="skeleton mt-12 h-16 w-2/3" />
      <div className="skeleton mt-6 h-6 w-1/2" />
      <div className="skeleton mt-16 h-72 w-full rounded-[1.75rem]" />
    </div>
  );
}

export default function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  return (
    <main id="main">
      <Suspense fallback={<CaseStudySkeleton />}>
        <CaseStudy params={params} />
      </Suspense>
    </main>
  );
}
