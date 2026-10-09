"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { sections } from "@/lib/site";
import { useActiveSection } from "@/lib/use-active-section";
import { Mark } from "@/components/ui/icons";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

const navItems = sections.filter((s) => s.nav);
const allIds = sections.map((s) => s.id);
const none: string[] = [];

export function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const active = useActiveSection(onHome ? allIds : none);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <header className="fixed inset-x-0 top-3 z-40 px-3 sm:top-4">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-fit items-center gap-1 rounded-full border border-line bg-raised/80 p-1.5 shadow-[var(--shadow)] backdrop-blur-md"
      >
        <Link
          href={onHome ? "#top" : "/"}
          className="flex items-center gap-2 rounded-full py-1 pr-3 pl-1.5 text-fg"
          aria-label="Sairaj Bandre, home"
        >
          <Mark size={26} />
          <span className="hud hidden text-muted sm:inline">Sairaj</span>
        </Link>

        <ul className="hidden items-center md:flex">
          {navItems.map((item) => {
            const isActive = onHome && active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={href(item.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative block rounded-full px-3.5 py-2 text-sm transition-colors",
                    isActive ? "text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-line-strong"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        <span aria-hidden className="mx-1 hidden h-5 w-px bg-line-strong md:block" />
        <ThemeToggle />
        <button
          type="button"
          className="grid size-9 place-items-center rounded-full text-muted hover:bg-line hover:text-fg md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} strokeWidth={1.75} /> : <Menu size={18} strokeWidth={1.75} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className="mx-auto mt-2 max-w-sm origin-top rounded-3xl border border-line bg-raised p-2 shadow-[var(--shadow)] md:hidden"
          >
            <ul>
              {sections
                .filter((s) => s.id !== "top")
                .map((s) => (
                  <li key={s.id}>
                    <a
                      href={href(s.id)}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-2xl px-4 py-3 text-fg hover:bg-line"
                    >
                      {s.label}
                      <span className="hud text-subtle">{s.fl}</span>
                    </a>
                  </li>
                ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
