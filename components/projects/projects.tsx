import Image from "next/image";
import Link from "next/link";
import { Suspense, ViewTransition } from "react";
import { ArrowRight, ArrowUpRight, PenLine } from "lucide-react";
import { archive, projects, type Project } from "@/content/projects";
import { GitHubIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { Breakable } from "@/components/ui/breakable";
import { StatusPill } from "./status-pill";
import { LatestPosts, LatestPostsSkeleton } from "./latest-posts";

function Stats({ p }: { p: Project }) {
  return (
    <dl className="border-line mt-10 grid grid-cols-3 gap-x-6 gap-y-4 border-t pt-6">
      {p.stats.slice(0, 3).map((s) => (
        <div key={s.label} className="flex flex-col-reverse">
          <dt className="text-subtle mt-2 text-xs leading-snug sm:text-sm">{s.label}</dt>
          <dd className="font-display text-fg text-[clamp(1.3rem,0.9rem+1.3vw,2.1rem)] leading-none font-extrabold tracking-tight tabular-nums">
            {s.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function ProjectBlock({ p, index }: { p: Project; index: number }) {
  const blog = p.kind === "blog";
  return (
    <article data-scene={p.slug} className="flex min-h-[88dvh] items-center py-20">
      <div className="container-page">
        <Reveal className="max-w-[40rem]">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-dot text-accent mr-2 text-2xl font-black">
              {String(index + 1).padStart(2, "0")}
              <span className="text-subtle">/{String(projects.length).padStart(2, "0")}</span>
            </span>
            {blog ? (
              <span className="tag bg-accent text-ink inline-flex items-center gap-1.5 rounded-full px-2.5 py-1">
                <PenLine size={11} strokeWidth={2.5} aria-hidden /> Where I write
              </span>
            ) : (
              <StatusPill status={p.status} />
            )}
          </div>

          <ViewTransition name={`project-title-${p.slug}`}>
            <h3 className="headline mt-6 text-[clamp(2rem,1.2rem+3.2vw,4rem)]">
              <Link href={`/projects/${p.slug}`} className="hover:text-accent transition-colors">
                <Breakable text={p.title} />
              </Link>
            </h3>
          </ViewTransition>
          <p className="text-muted mt-5 max-w-[42ch] text-lg leading-snug">{p.tagline}</p>

          {blog ? (
            <Suspense fallback={<LatestPostsSkeleton />}>
              <LatestPosts />
            </Suspense>
          ) : (
            <Stats p={p} />
          )}

          <div className="mt-9 flex flex-wrap items-center gap-3">
            {blog && p.links.demo ? (
              <a
                href={p.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-accent text-ink inline-flex h-12 items-center gap-2 rounded-full px-6 font-semibold transition-transform active:scale-[0.97]"
              >
                Read the blog
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            ) : (
              <Link
                href={`/projects/${p.slug}`}
                className="group bg-accent text-ink inline-flex h-12 items-center gap-2 rounded-full px-6 font-semibold transition-transform active:scale-[0.97]"
              >
                Read the case study
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            )}
            {!blog && p.links.demo && (
              <a
                href={p.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="border-line-strong text-fg hover:bg-line inline-flex h-12 items-center gap-2 rounded-full border px-5 font-medium transition-colors"
              >
                Live demo <ArrowUpRight size={16} />
              </a>
            )}
            {p.links.repo && (
              <a
                href={p.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="border-line-strong text-fg hover:bg-line grid size-12 place-items-center rounded-full border transition-colors"
                aria-label={`${p.title} source on GitHub`}
              >
                <GitHubIcon size={17} />
              </a>
            )}
          </div>

          {p.image && (
            <a
              href={p.links.demo ?? `/projects/${p.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border-line-strong mt-10 block w-full max-w-sm -rotate-2 overflow-hidden rounded-2xl border transition-transform duration-500 hover:rotate-0"
            >
              <Image
                src={p.image.src}
                alt={p.image.alt}
                width={800}
                height={500}
                sizes="384px"
                className="w-full"
              />
            </a>
          )}
        </Reveal>
      </div>
    </article>
  );
}

export function Projects() {
  return (
    <section id="work" className="relative">
      <div className="container-page pt-28 md:pt-40">
        <SectionLabel index="03" label="Selected work" />
        <h2 className="headline text-display mt-5 max-w-[14ch]">
          Things I&apos;ve <span className="text-signal">built.</span>
        </h2>
      </div>

      {projects.map((p, i) => (
        <ProjectBlock key={p.slug} p={p} index={i} />
      ))}

      <div data-scene="chainwatch" className="container-page pb-28">
        <h3 className="tag text-muted">Earlier experiments</h3>
        <ul className="border-line mt-5 border-t">
          {archive.map((a) => (
            <li key={a.title}>
              <a
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group border-line grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 border-b py-6 md:grid-cols-[4rem_minmax(0,16rem)_minmax(0,1fr)_auto]"
              >
                <span className="tag text-subtle hidden md:block">{a.year}</span>
                <span className="font-display text-fg group-hover:text-accent text-2xl font-bold tracking-tight transition-colors">
                  {a.title}
                </span>
                <span className="text-muted col-span-2 row-start-2 md:col-span-1 md:row-start-auto">
                  {a.blurb}
                  {a.note && <span className="tag text-accent ml-2">{a.note}</span>}
                </span>
                <ArrowUpRight
                  size={20}
                  className="text-subtle group-hover:text-accent col-start-2 row-start-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 md:col-start-auto"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
