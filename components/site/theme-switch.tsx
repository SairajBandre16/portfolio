"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const options = [
  { value: "light", label: "Light theme", Icon: Sun },
  { value: "dark", label: "Dark theme", Icon: Moon },
] as const;

/** Two-way switch. The sliding thumb is placed by CSS, so the first paint is already right. */
export function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      role="group"
      aria-label="Colour theme"
      className="bg-surface relative flex rounded-full p-1 shadow-[inset_0_0_0_1px_var(--line)]"
    >
      <span
        aria-hidden
        className="bg-bg absolute top-1 left-1 size-8 rounded-full shadow-[0_1px_2px_rgb(var(--shadow)/0.18),0_0_0_1px_var(--line)] transition-transform duration-500 ease-[var(--ease-out-expo)] dark:translate-x-8"
      />
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          aria-label={label}
          aria-pressed={mounted ? resolvedTheme === value : undefined}
          className={`text-soft hover:text-fg relative grid size-8 place-items-center rounded-full transition-colors active:scale-95 ${
            value === "dark" ? "dark:text-fg" : "[:root:not([data-theme=dark])_&]:text-fg"
          }`}
        >
          <Icon size={15} strokeWidth={1.8} />
        </button>
      ))}
    </div>
  );
}
