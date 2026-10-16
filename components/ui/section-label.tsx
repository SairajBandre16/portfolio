import { cn } from "@/lib/utils";

export function SectionLabel({ index, label, className }: { index: string; label: string; className?: string }) {
  return (
    <p className={cn("tag flex items-center gap-3", className)}>
      <span className="text-accent">{index}</span>
      <span aria-hidden className="h-px w-10 bg-line-strong" />
      <span className="text-muted">{label}</span>
    </p>
  );
}
