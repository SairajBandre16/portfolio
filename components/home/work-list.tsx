"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/projects";
import { ProjectMark } from "@/components/site/project-mark";
import { Shot } from "@/components/site/shot";
import { cn } from "@/lib/utils";

/** A muted film for the row preview: it plays only while its row is under the pointer. */
function PreviewFilm({ video, active }: { video: NonNullable<Project["video"]>; active: boolean }) {
  const el = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = el.current;
    if (!v) return;
    if (active) {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else v.pause();
  }, [active]);
  return (
    <video
      ref={el}
      muted
      loop
      playsInline
      preload="none"
      tabIndex={-1}
      className="absolute inset-0 h-full w-full object-cover"
    >
      <source src={video.webm} type="video/webm" />
      <source src={video.mp4} type="video/mp4" />
    </video>
  );
}

/**
 * Every project as one quiet row. On devices with a mouse, the row under the pointer brings
 * its screenshot along with it.
 */
export function WorkList({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<string | null>(null);
  const preview = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const fine = useRef(false);

  useEffect(() => {
    fine.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }, []);

  // Ease the preview towards the pointer while it is showing.
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const loop = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.16;
      pos.current.y += (target.current.y - pos.current.y) * 0.16;
      if (preview.current) {
        preview.current.style.translate = `${pos.current.x}px ${pos.current.y}px`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  const move = (e: React.PointerEvent) => {
    target.current = { x: e.clientX + 28, y: e.clientY - 110 };
  };

  const enter = (p: Project, e: React.PointerEvent) => {
    if (!fine.current || !p.image) return setActive(null);
    // Jump straight to the pointer the first time, then follow it.
    if (!active) {
      move(e);
      pos.current = { ...target.current };
    }
    setActive(p.slug);
  };

  const shown = projects.find((p) => p.slug === active);

  return (
    <>
      <ol
        onPointerLeave={() => setActive(null)}
        onPointerMove={move}
        className="[&:hover>li:not(:hover)]:opacity-45"
      >
        {projects.map((p) => (
          <li
            key={p.slug}
            className="border-line border-b transition-opacity duration-300 last:border-b-0"
          >
            <Link
              href={`/projects/${p.slug}`}
              onPointerEnter={(e) => enter(p, e)}
              className="group grid grid-cols-[2.75rem_minmax(0,1fr)_auto] items-baseline gap-x-3 py-4 sm:grid-cols-[9.5rem_minmax(0,1fr)_auto] sm:gap-x-5"
            >
              <span className="label text-soft">{p.year}</span>
              <span className="min-w-0 md:flex md:items-baseline md:gap-3">
                <span className="text-fg inline-flex shrink-0 items-baseline gap-2 font-medium">
                  <ProjectMark project={p} className="self-center text-[0.95rem]" />
                  {p.title}
                </span>
                <span className="text-soft mt-1 block text-[0.95rem] leading-snug md:mt-0 md:truncate">
                  {p.tagline}
                </span>
              </span>
              <span className="label text-soft flex items-center gap-2 whitespace-nowrap">
                <span className="hidden items-center gap-1.5 sm:inline-flex">
                  {p.status === "In progress" && (
                    <span className="bg-accent size-1.5 rounded-full" aria-hidden />
                  )}
                  {p.status}
                </span>
                <ArrowUpRight
                  size={15}
                  className="group-hover:text-fg transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <div ref={preview} aria-hidden className="row-preview" data-on={Boolean(shown)}>
        <div className="bg-surface relative aspect-[16/10] overflow-hidden rounded-[1rem] shadow-[0_24px_50px_-18px_rgb(var(--shadow)/0.5),inset_0_0_0_1px_var(--line)]">
          {projects
            .filter((p) => p.image)
            .map((p) => (
              <div
                key={p.slug}
                className={cn(
                  "absolute inset-0 transition-opacity duration-300",
                  p.slug === active ? "opacity-100" : "opacity-0",
                )}
              >
                {p.video ? (
                  // Projects with a film show its title card, then the film itself.
                  <>
                    <Image
                      src={p.video.poster}
                      alt=""
                      fill
                      sizes="22rem"
                      className="object-cover"
                    />
                    <PreviewFilm video={p.video} active={p.slug === active} />
                  </>
                ) : (
                  <Shot project={p} sizes="(min-width: 1024px) 30vw, 78vw" />
                )}
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
