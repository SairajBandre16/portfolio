import type { ProjectStatus } from "@/content/projects";
import { cn } from "@/lib/utils";

const dot: Record<ProjectStatus, string> = {
  Live: "bg-lime",
  Running: "bg-lime",
  "In progress": "bg-yellow",
  Shipped: "bg-muted",
  Internal: "bg-subtle",
};

export function StatusPill({ status, className }: { status: ProjectStatus; className?: string }) {
  const live = status === "Live" || status === "Running";
  return (
    <span className={cn("tag inline-flex items-center gap-2 rounded-full border border-line-strong px-2.5 py-1 text-fg", className)}>
      <span className="relative grid size-2 place-items-center">
        {live && <span className={cn("animate-ping-slow absolute inset-0 rounded-full", dot[status])} />}
        <span className={cn("relative size-1.5 rounded-full", dot[status])} />
      </span>
      {status}
    </span>
  );
}
