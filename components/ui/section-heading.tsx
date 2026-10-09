import { section, type SectionId } from "@/lib/site";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

type Props = {
  id: SectionId;
  title: React.ReactNode;
  kicker?: string;
  intro?: React.ReactNode;
  className?: string;
};

/** Section header with a flight-level label, e.g. "FL030 · Work". */
export function SectionHeading({ id, title, kicker, intro, className }: Props) {
  const s = section(id);
  return (
    <Reveal className={cn("mb-12 grid gap-6 md:mb-16 md:grid-cols-12", className)}>
      <div className="md:col-span-3">
        <p className="hud flex items-center gap-2 text-subtle">
          <span className="inline-block size-1.5 rounded-full bg-accent" />
          <span className="text-accent">{s.fl}</span>
          <span aria-hidden>/</span>
          <span>{kicker ?? s.label}</span>
        </p>
      </div>
      <div className="md:col-span-9">
        <h2 className="text-h2 leading-[1.02] font-medium tracking-[-0.035em] text-balance text-fg">
          {title}
        </h2>
        {intro && <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-muted">{intro}</p>}
      </div>
    </Reveal>
  );
}

/** Italic serif accent used inside headings. */
export function Accent({ children }: { children: React.ReactNode }) {
  return <em className="font-serif font-normal tracking-[-0.01em] text-accent italic">{children}</em>;
}
