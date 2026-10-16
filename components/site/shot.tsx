import Image from "next/image";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/utils";

/**
 * A project screenshot that fills its (positioned, rounded) parent. Website screenshots sit
 * in a window that runs off the bottom-right edge over a wash of the project's own colour;
 * "cover" images fill the frame.
 */
export function Shot({
  project,
  sizes,
  priority,
  eager,
  className,
}: {
  project: Project;
  sizes: string;
  priority?: boolean;
  /** Load straight away, for screens that are visible on first paint. */
  eager?: boolean;
  className?: string;
}) {
  const loading = eager && !priority ? "eager" : undefined;
  const img = project.image;
  if (!img) return null;

  if (img.frame === "cover") {
    return (
      <Image
        src={img.src}
        alt={img.alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={loading}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn("absolute inset-0", className)}
      style={{ background: `color-mix(in oklab, ${project.tint} 20%, var(--surface))` }}
    >
      <Image
        src={img.src}
        alt={img.alt}
        width={img.width}
        height={img.height}
        sizes={sizes}
        priority={priority}
        loading={loading}
        className="absolute top-[11%] left-[9%] h-auto w-[118%] max-w-none rounded-[0.55rem] shadow-[0_24px_48px_-20px_rgb(var(--shadow)/0.55),0_0_0_1px_rgb(0_0_0/0.06)]"
      />
    </div>
  );
}
