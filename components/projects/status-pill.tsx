import { Terminal } from "lucide-react";
import type { ProjectStatus } from "@/content/projects";
import { cn } from "@/lib/utils";

const dot: Record<ProjectStatus, string> = {
  Live: "bg-ok",
  Running: "bg-ok",
  "In progress": "bg-accent",
  Shipped: "bg-muted",
  Internal: "bg-subtle",
};

export function StatusPill({ status, className }: { status: ProjectStatus; className?: string }) {
  return (
    <span className={cn("hud inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-muted", className)}>
      <span className={cn("size-1.5 rounded-full", dot[status])} />
      {status}
    </span>
  );
}

export function ClaudeCodeBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "hud inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-accent",
        className,
      )}
      title="Built with Claude Code as pair-programmer"
    >
      <Terminal size={11} strokeWidth={2} aria-hidden />
      Claude Code
    </span>
  );
}
