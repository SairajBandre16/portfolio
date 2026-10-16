import { CloudRain, Database, PenLine, Plane, Ship, Terminal, Workflow } from "lucide-react";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/utils";

const icons: Record<string, typeof Plane> = {
  queryforge: Database,
  ownit: PenLine,
  squawk: Plane,
  "ctrl-automate": Terminal,
  "personal-automations": Workflow,
  rainwise: CloudRain,
  chainwatch: Ship,
};

// Light tints get dark ink, everything else white.
const darkInk = new Set(["queryforge", "personal-automations"]);

/** A project's little app icon: its brand colour with a glyph. Sized in em to sit in text. */
export function ProjectMark({ project, className }: { project: Project; className?: string }) {
  const Icon = icons[project.slug] ?? Workflow;
  return (
    <span
      aria-hidden
      className={cn("chip-icon shadow-[inset_0_-0.08em_0_rgb(0_0_0/0.18)]", className)}
      style={{
        background: project.tint,
        color: darkInk.has(project.slug) ? "#1c2104" : "#fff",
      }}
    >
      <Icon strokeWidth={2.2} className="size-[62%]" />
    </span>
  );
}
