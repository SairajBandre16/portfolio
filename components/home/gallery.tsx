import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { gallery } from "@/content/home";
import { getProject, type Project } from "@/content/projects";
import { Shot } from "@/components/site/shot";
import { HoverFilm } from "@/components/site/hover-film";
import { runtime } from "@/lib/utils";

type Item = { p: Project; caption: string };

function Card({ p, caption, copy, index }: Item & { copy?: boolean; index: number }) {
  return (
    <li>
      <Link href={`/projects/${p.slug}`} className="group block">
        <span
          className={`bg-surface relative block overflow-hidden rounded-[1.35rem] ${p.video ? "aspect-video" : "aspect-[5/4]"}`}
        >
          {p.video ? (
            // A project with a film shows its title card, and the film plays on hover.
            <Image
              src={p.video.poster}
              alt={`${p.title} title card: ${p.tagline}`}
              fill
              sizes="(min-width: 1024px) 30vw, 78vw"
              preload={!copy && index === 0}
              loading={!copy && index === 0 ? undefined : "eager"}
              className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.035]"
            />
          ) : (
            <Shot
              project={p}
              sizes="(min-width: 1024px) 30vw, 78vw"
              priority={!copy && index === 0}
              eager
              className="transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.035]"
            />
          )}
          {!copy && <HoverFilm project={p} />}
          {p.video && (
            <span className="label pointer-events-none absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/45 py-1 pr-2.5 pl-2 text-white backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-0">
              <Play size={10} fill="currentColor" aria-hidden />
              <span className="sr-only">Film, </span>
              {runtime(p.video.seconds)}
            </span>
          )}
          <span className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_var(--line)]" />
        </span>
        <span className="mt-3 flex items-baseline justify-between gap-3 px-1">
          <span className="text-fg text-[0.95rem] font-medium">{p.title}</span>
          <span className="label text-soft truncate">{caption}</span>
        </span>
      </Link>
    </li>
  );
}

/**
 * Screens from the projects that have one. On desktop the column drifts upwards and pauses
 * under the pointer (a second, inert copy makes the loop seamless); on smaller screens it is
 * a row you swipe.
 */
export function Gallery() {
  const items = gallery.flatMap(({ slug, caption }): Item[] => {
    const p = getProject(slug);
    return p?.image ? [{ p, caption }] : [];
  });
  return (
    <div className="gallery settle" style={{ "--i": 2 } as React.CSSProperties}>
      <div className="gallery-track">
        <ul className="gallery-row" aria-label="Project screens">
          {items.map((item, i) => (
            <Card key={item.p.slug} {...item} index={i} />
          ))}
        </ul>
        <ul className="gallery-copy" aria-hidden inert>
          {items.map((item, i) => (
            <Card key={item.p.slug} {...item} index={i} copy />
          ))}
        </ul>
      </div>
    </div>
  );
}
