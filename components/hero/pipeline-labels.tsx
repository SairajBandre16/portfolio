const steps = [
  { label: "Manual", note: "invoices, typed by hand", align: "center" },
  { label: "AI", note: "reads and extracts", align: "center" },
  { label: "Automated", note: "clean rows, no typing", align: "center" },
];

/**
 * HUD captions for the hero's particle scene: one manual chore, automated. The particle
 * engine projects three anchor points to the screen and publishes them as CSS variables;
 * these labels sit on them, and only show while the hero scene is on screen (see
 * .pipeline-label in globals.css).
 */
export function PipelineLabels() {
  return (
    <ol aria-hidden className="pointer-events-none">
      {steps.map((s, i) => (
        <li
          key={s.label}
          data-align={s.align}
          className="pipeline-label flex flex-col items-center data-[align=end]:items-end"
          style={
            {
              left: `var(--anchor-${i + 1}-x)`,
              top: `var(--anchor-${i + 1}-y)`,
              "--i": i,
            } as React.CSSProperties
          }
        >
          <span className="tag text-fg flex items-baseline gap-2 whitespace-nowrap">
            <span className="text-accent">{String(i + 1).padStart(2, "0")}</span>
            {s.label}
          </span>
          <span className="tag text-subtle mt-0.5 whitespace-nowrap normal-case">{s.note}</span>
          <span className="from-line-strong to-accent mt-2 h-6 w-px bg-gradient-to-b" />
          <span className="bg-accent size-1.5 rounded-full shadow-[0_0_10px_var(--accent)]" />
        </li>
      ))}
    </ol>
  );
}
