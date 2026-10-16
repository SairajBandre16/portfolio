import { cn } from "@/lib/utils";

/** One block of the index under the intro: a small label on the left, a list on the right. */
export function IndexSection({
  id,
  title,
  count,
  children,
  className,
}: {
  id: string;
  title: string;
  count?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn(
        "border-line grid scroll-mt-6 gap-5 border-t py-12 sm:py-14 lg:grid-cols-[10rem_minmax(0,1fr)] lg:gap-10",
        className,
      )}
    >
      <h2 id={`${id}-title`} className="text-soft text-sm lg:pt-4">
        {title}
        {count !== undefined && <sup className="label ml-1">{count}</sup>}
      </h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

/** A plain row: a short label column, then the content. */
export function Row({
  meta,
  children,
  href,
  external,
}: {
  meta: React.ReactNode;
  children: React.ReactNode;
  href?: string;
  external?: boolean;
}) {
  const inner = (
    <>
      <span className="label text-soft pt-[0.2rem]">{meta}</span>
      <span className="min-w-0">{children}</span>
    </>
  );
  const cls =
    "grid grid-cols-1 gap-x-5 gap-y-1 py-4 sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:items-baseline";
  return (
    <li className="border-line border-b transition-opacity duration-300 last:border-b-0">
      {href ? (
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className={cn("group", cls)}
        >
          {inner}
        </a>
      ) : (
        <div className={cls}>{inner}</div>
      )}
    </li>
  );
}

export const dimOthers = "[&:hover>li:not(:hover)]:opacity-45";
