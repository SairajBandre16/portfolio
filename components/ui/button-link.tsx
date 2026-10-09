import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline";

const styles: Record<Variant, string> = {
  primary: "bg-accent text-accent-ink hover:brightness-110",
  outline: "border border-line-strong text-fg hover:border-fg/40 hover:bg-line",
  ghost: "text-muted hover:text-fg",
};

type Props = {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  external?: boolean;
  download?: boolean;
};

export function ButtonLink({ href, variant = "outline", className, children, external, download }: Props) {
  const cls = cn(
    "inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium transition-[background-color,border-color,color,filter,transform] duration-300 active:scale-[0.97]",
    styles[variant],
    className,
  );
  if (external || download || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...(download ? { download: "" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
