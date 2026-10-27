import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { getProject, projects, type Section } from "@/content/projects";
import { TopBar } from "@/components/site/top-bar";
import { ProjectMark } from "@/components/site/project-mark";
import { Shot } from "@/components/site/shot";
import { runtime } from "@/lib/utils";

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

function SectionBlock({ s }: { s: Section }) {
  return (
    <section className="mt-14">
      <h2 className="text-fg text-xl font-semibold tracking-[-0.01em]">{s.heading}</h2>
      <div className="text-fg/80 mt-4 space-y-4 text-[1.05rem] leading-relaxed">
        {s.body?.map((b) => (
          <p key={b}>{b}</p>
        ))}
        {s.bullets && (
          <ul className="space-y-3">
            {s.bullets.map((b) => (
              <li key={b} className="grid grid-cols-[1.1rem_1fr] gap-2">
                <span aria-hidden className="bg-accent mt-[0.68em] size-1.5 rounded-full" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
        {s.table && (
          <figure className="overflow-x-auto">
            <table className="w-full text-left text-[0.95rem]">
              <thead>
                <tr className="border-line border-b">
                  {s.table.head.map((h) => (
                    <th key={h} scope="col" className="label text-soft py-2.5 pr-4 font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.table.rows.map((row) => (
                  <tr key={row.join()} className="border-line border-b">
                    {row.map((cell, i) => (
                      <td
                        key={i}
                        className={
                          i === row.length - 1
                            ? "text-fg py-2.5 font-mono text-sm tabular-nums"
                            : "py-2.5 pr-4"
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
              <figcaption className="text-soft mt-3 text-sm">{s.table.caption}</figcaption>
            )}
          </figure>
        )}
      </div>
    </section>
  );
}

const textLink =
  "group text-fg inline-flex items-center gap-1 font-medium underline decoration-[color-mix(in_oklab,var(--fg)_30%,transparent)] underline-offset-[0.25em] transition-[text-decoration-color] hover:decoration-[var(--accent)]";

async function CaseStudy({ params }: Pick<PageProps<"/projects/[slug]">, "params">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const i = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(i + 1) % projects.length];
  const prev = projects[(i - 1 + projects.length) % projects.length];

  return (
    <article className="max-w-[46rem] pt-10 sm:pt-16">
      <p className="label text-soft flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <span>{p.year}</span>
        <span aria-hidden>·</span>
        <span className="inline-flex items-center gap-1.5">
          {p.status === "In progress" && <span className="bg-accent size-1.5 rounded-full" />}
          {p.status}
        </span>
        <span aria-hidden>·</span>
        <span>{p.role}</span>
      </p>
      <h1 className="text-fg mt-5 flex items-center gap-[0.3em] text-[clamp(2.4rem,1.6rem+3vw,4rem)] leading-[1.02] font-semibold tracking-[-0.035em]">
        <ProjectMark project={p} className="text-[0.75em]" />
        {p.title}
      </h1>
      <p className="text-intro text-soft mt-5 leading-[1.4] tracking-[-0.012em] text-pretty">
        {p.tagline}
      </p>

      {(p.links.demo || p.links.repo) && (
        <p className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
          {p.links.demo && (
            <a href={p.links.demo} target="_blank" rel="noopener noreferrer" className={textLink}>
              {p.kind === "blog" ? "Read the blog" : "Live demo"}
              <ArrowUpRight size={15} aria-hidden />
            </a>
          )}
          {p.links.repo && (
            <a href={p.links.repo} target="_blank" rel="noopener noreferrer" className={textLink}>
              Source on GitHub
              <ArrowUpRight size={15} aria-hidden />
            </a>
          )}
        </p>
      )}

      {p.video ? (
        <figure className="mt-12">
          <video
            controls
            playsInline
            preload="none"
            poster={p.video.poster}
            aria-label={p.video.label}
            className="bg-surface aspect-video w-full rounded-[1.4rem] shadow-[inset_0_0_0_1px_var(--line)]"
          >
            <source src={p.video.webm} type="video/webm" />
            <source src={p.video.mp4} type="video/mp4" />
          </video>
          <figcaption className="label text-soft mt-3">
            {p.video.label} · {runtime(p.video.seconds)}, with sound
          </figcaption>
        </figure>
      ) : null}
      {/* Website screenshots sit under the film, or stand alone when there is none. */}
      {(!p.video || p.image?.frame === "window") && p.image && (
        <figure
          className={`bg-surface relative aspect-[16/10] overflow-hidden rounded-[1.4rem] ${p.video ? "mt-8" : "mt-12"}`}
        >
          <Shot project={p} sizes="(min-width: 768px) 46rem, 100vw" priority={!p.video} />
          <span className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_var(--line)]" />
        </figure>
      )}
      {p.screens && (
        <div className="mt-8 grid grid-cols-2 gap-3">
          {p.screens.map((s) => (
            <Image
              key={s.src}
              src={s.src}
              alt={s.alt}
              width={s.width}
              height={s.height}
              sizes={s.wide ? "(min-width: 768px) 46rem, 100vw" : "(min-width: 768px) 23rem, 50vw"}
              className={`w-full rounded-[1.1rem] ${s.wide ? "col-span-2" : ""}`}
            />
          ))}
        </div>
      )}

      <dl className="border-line mt-12 grid gap-6 border-y py-7 sm:grid-cols-3">
        {p.stats.map((s) => (
          <div key={s.label} className="flex flex-col-reverse justify-end">
            <dt className="text-soft mt-1.5 text-sm leading-snug">{s.label}</dt>
            <dd className="text-fg text-[1.9rem] leading-none font-semibold tracking-[-0.03em] tabular-nums">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="text-fg mt-12 text-[1.25rem] leading-[1.5] tracking-[-0.01em] text-pretty">
        {p.summary}
      </p>
      <p className="mt-6 flex flex-wrap gap-x-1.5 gap-y-1 text-sm">
        <span className="text-soft">Built with</span>
        {p.stack.map((t, idx) => (
          <span key={t} className="text-fg/85">
            {t}
            {idx < p.stack.length - 1 && <span className="text-soft">,</span>}
          </span>
        ))}
      </p>

      {p.sections.map((s) => (
        <SectionBlock key={s.heading} s={s} />
      ))}

      <nav aria-label="More projects" className="border-line mt-20 grid border-t sm:grid-cols-2">
        <Link
          href={`/projects/${prev.slug}`}
          className="group border-line flex flex-col gap-1 border-b py-6 sm:border-r sm:border-b-0 sm:pr-6"
        >
          <span className="label text-soft inline-flex items-center gap-1.5">
            <ArrowLeft
              size={13}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
            />
            Previous
          </span>
          <span className="text-fg text-lg font-medium">{prev.title}</span>
        </Link>
        <Link
          href={`/projects/${next.slug}`}
          className="group flex flex-col items-end gap-1 py-6 text-right sm:pl-6"
        >
          <span className="label text-soft inline-flex items-center gap-1.5">
            Next
            <ArrowRight
              size={13}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </span>
          <span className="text-fg text-lg font-medium">{next.title}</span>
        </Link>
      </nav>
    </article>
  );
}

function CaseStudySkeleton() {
  return (
    <div className="max-w-[46rem] pt-16" aria-busy="true">
      <div className="bg-surface h-3 w-40 animate-pulse rounded" />
      <div className="bg-surface mt-6 h-14 w-2/3 animate-pulse rounded-lg" />
      <div className="bg-surface mt-6 h-6 w-full animate-pulse rounded" />
      <div className="bg-surface mt-12 aspect-[16/10] w-full animate-pulse rounded-[1.4rem]" />
    </div>
  );
}

export default function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  return (
    <main id="main" className="gutter">
      <TopBar back />
      <Suspense fallback={<CaseStudySkeleton />}>
        <CaseStudy params={params} />
      </Suspense>
    </main>
  );
}
