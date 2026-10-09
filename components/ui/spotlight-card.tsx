"use client";

import { cn } from "@/lib/utils";

/** Card whose border and wash light up under the pointer. */
export function SpotlightCard({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}) {
  return (
    <Tag
      onPointerMove={(e) => {
        const el = e.currentTarget as HTMLElement;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className={cn(
        "spotlight rounded-[1.75rem] border border-line bg-raised shadow-[var(--shadow)] transition-transform duration-500 ease-[var(--ease-out)] hover:-translate-y-1",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
