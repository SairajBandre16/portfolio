"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/utils";

/**
 * A muted film laid over a project card. Nothing downloads until the pointer rests on the
 * card it sits in; then it plays from the start and fades in, and fades out on leave.
 * Skipped for touch screens and reduced motion.
 */
export function HoverFilm({ project, className }: { project: Project; className?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = video.current;
    const card = el?.closest("a");
    if (!el || !card) return;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || still) return;

    const enter = () => {
      el.currentTime = 0;
      el.play().catch(() => {});
    };
    const leave = () => {
      el.pause();
      setPlaying(false);
    };
    const onPlaying = () => setPlaying(true);
    card.addEventListener("pointerenter", enter);
    card.addEventListener("pointerleave", leave);
    el.addEventListener("playing", onPlaying);
    return () => {
      card.removeEventListener("pointerenter", enter);
      card.removeEventListener("pointerleave", leave);
      el.removeEventListener("playing", onPlaying);
    };
  }, []);

  if (!project.video) return null;
  return (
    <video
      ref={video}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      tabIndex={-1}
      className={cn(
        "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
        playing ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      <source src={project.video.webm} type="video/webm" />
      <source src={project.video.mp4} type="video/mp4" />
    </video>
  );
}
