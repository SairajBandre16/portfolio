"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      className={cn(
        "grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-line hover:text-fg active:scale-95",
        className,
      )}
      aria-label="Toggle colour theme"
    >
      {/* Both icons render; CSS picks one, so there's no hydration flash. */}
      <Sun size={16} strokeWidth={1.75} className="hidden dark:block" />
      <Moon size={16} strokeWidth={1.75} className="block dark:hidden" />
    </button>
  );
}
