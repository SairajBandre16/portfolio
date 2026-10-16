import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, ViewTransition } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { getProject, projects, type Section } from "@/content/projects";
import { StatusPill } from "@/components/projects/status-pill";
import { GitHubIcon } from "@/components/ui/icons";
import { Breakable } from "@/components/ui/breakable";
import { Reveal } from "@/components/ui/reveal";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
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

function SectionBlock({ s, index }: { s: Section; index: number }) {
  return (
    <Reveal className="border-line grid gap-4 border-t py-12 md:grid-cols-12 md:gap-8">
      <div className="md:col-span-4">
        <p className="font-dot text-accent text-3xl font-black">
          {String(index + 1).padStart(2, "0")}
        </p>
        <h2 className="font-display text-h3 text-fg mt-3 leading-tight font-bold tracking-tight">
          {s.heading}
        </h2>
      </div>
      <div className="text-muted space-y-5 text-lg leading-relaxed md:col-span-8">
        {s.body?.map((b) => (
          <p key={b}>{b}</p>
        ))}
        {s.bullets && (
          <ul className="space-y-3">
            {s.bullets.map((b) => (
              <li key={b} className="grid grid-cols-[1.25rem_1fr] gap-3">
                <span aria-hidden className="bg-accent mt-[0.6em] size-2 rounded-full" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
        {s.table && (
          <figure className="panel overflow-x-auto rounded-2xl">
            <table className="w-full text-left text-base">
              <thead className="tag text-subtle">
                <tr className="border-line border-b">
                  {s.table.head.map((h) => (
                    <th key={h} scope="col" className="px-5 py-3 font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-line divide-y">
                {s.table.rows.map((row) => (
                  <tr key={row.join()}>
                    {row.map((cell, i) => (
                      <td
                        key={i}
                        className={
                          i === row.length - 1 ? "text-fg px-5 py-3 font-mono" : "px-5 py-3"
                        }
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {s.table.caption && (
              <figcaption className="border-line text-subtle border-t px-5 py-3 text-sm">
                {s.table.caption}
              </figcaption>
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
  const prev = projects[(i - 1 + projects.length) % projects.length];

  return (
    <article data-scene={p.slug}>
      <header className="container-page flex min-h-dvh flex-col pt-28 pb-12 sm:pt-32">
        <Link
          href="/#work"
          className="group text-muted hover:text-fg inline-flex w-fit items-center gap-2 text-sm"
        >
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" /> All
          projects
        </Link>

        <div className="my-auto max-w-[44rem] py-12">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-dot text-accent mr-1 text-2xl font-black">{p.callsign}</span>
            <StatusPill status={p.status} />
          </div>
          <ViewTransition name={`project-title-${p.slug}`}>
            <h1 className="headline mt-6 text-[clamp(2.2rem,1.2rem+4vw,5.25rem)]">
              <Breakable text={p.title} />
            </h1>
          </ViewTransition>
          <p className="text-muted mt-6 max-w-[44ch] text-xl leading-relaxed">{p.tagline}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            {p.links.demo && (
              <a
                href={p.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent text-ink inline-flex h-12 items-center gap-2 rounded-full px-6 font-semibold transition-transform active:scale-[0.97]"
              >
                {p.kind === "blog" ? "Read the blog" : "Live demo"} <ArrowUpRight size={16} />
              </a>
            )}
            {p.links.repo && (
              <a
                href={p.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="border-line-strong text-fg hover:bg-line inline-flex h-12 items-center gap-2 rounded-full border px-6 font-medium transition-colors"
              >
                <GitHubIcon size={15} /> Source
              </a>
            )}
          </div>
        </div>

        <dl className="border-line grid gap-6 border-t pt-6 sm:grid-cols-3">
          {p.stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse">
              <dt className="text-subtle mt-2 text-sm">{s.label}</dt>
              <dd className="font-display text-fg text-[clamp(1.6rem,1.1rem+1.4vw,2.5rem)] leading-none font-extrabold tracking-tight tabular-nums">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="container-page pb-24">
        <div className="border-line grid gap-10 border-t pt-12 md:grid-cols-12">
          <Reveal className="md:col-span-8">
            <p className="font-display text-fg text-[clamp(1.25rem,1rem+0.9vw,1.8rem)] leading-snug font-semibold tracking-tight">
              {p.summary}
            </p>
          </Reveal>
          <dl className="grid content-start gap-6 md:col-span-4">
            <div>
              <dt className="tag text-subtle">Role</dt>
              <dd className="text-fg mt-1">{p.role}</dd>
            </div>
            <div>
              <dt className="tag text-subtle">Year</dt>
              <dd className="text-fg mt-1 font-mono">{p.year}</dd>
            </div>
            <div>
              <dt className="tag text-subtle">Stack</dt>
              <dd className="mt-2 flex flex-wrap gap-1.5">
                {p.stack.map((t) => (
                  <span
                    key={t}
                    className="border-line text-muted rounded-full border px-2.5 py-1 text-xs"
                  >
                    {t}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </div>

        {p.slug === "squawk" && p.image && (
          <div className="mt-16 grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
            <Image
              src={p.image.src}
              alt={p.image.alt}
              width={800}
              height={500}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="border-line h-full w-full rounded-[1.5rem] border object-cover"
            />
            <Image
              src="/projects/squawk-orbit.jpg"
              alt="SQUAWK orbit view over Dublin"
              width={764}
              height={868}
              sizes="(min-width: 768px) 25vw, 100vw"
              className="border-line w-full rounded-[1.5rem] border"
            />
            <Image
              src="/projects/squawk-ground.jpg"
              alt="SQUAWK ground view looking up at aircraft"
              width={764}
              height={868}
              sizes="(min-width: 768px) 25vw, 100vw"
              className="border-line w-full rounded-[1.5rem] border"
            />
          </div>
        )}

        <div className="mt-16">
          {p.sections.map((s, idx) => (
            <SectionBlock key={s.heading} s={s} index={idx} />
          ))}
        </div>

        <nav
          aria-label="More projects"
          className="mt-16 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
        >
          <Link
            href={`/projects/${prev.slug}`}
            className="panel group hover:border-accent/60 flex items-center gap-5 rounded-[2rem] p-7 transition-colors md:p-9"
          >
            <ArrowLeft
              size={22}
              className="text-muted group-hover:text-accent shrink-0 transition-transform group-hover:-translate-x-1"
            />
            <span className="min-w-0">
              <span className="tag text-subtle">Previous · {prev.callsign}</span>
              <span className="headline group-hover:text-accent mt-3 block text-[clamp(1.4rem,5vw,2.25rem)]">
                <Breakable text={prev.title} />
              </span>
            </span>
          </Link>
          <Link
            href={`/projects/${next.slug}`}
            className="panel group hover:border-accent/60 flex items-center justify-between gap-6 rounded-[2rem] p-7 transition-colors md:p-10"
          >
            <span className="min-w-0">
              <span className="tag text-subtle">
                Next project · {next.callsign} ·{" "}
                {String(((i + 1) % projects.length) + 1).padStart(2, "0")}/
                {String(projects.length).padStart(2, "0")}
              </span>
              <span className="headline group-hover:text-accent mt-3 block text-[clamp(1.6rem,1rem+2.6vw,3rem)]">
                <Breakable text={next.title} />
              </span>
            </span>
            <ArrowRight
              size={28}
              className="text-muted group-hover:text-accent shrink-0 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </nav>
      </div>
    </article>
  );
}

function CaseStudySkeleton() {
  return (
    <div className="container-page pt-32 pb-24" aria-busy="true">
      <div className="skeleton h-4 w-28" />
      <div className="skeleton mt-24 h-20 w-2/3" />
      <div className="skeleton mt-6 h-6 w-1/2" />
      <div className="skeleton mt-24 h-24 w-full rounded-[1.75rem]" />
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
