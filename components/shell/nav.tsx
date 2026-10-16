"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDownToLine, ArrowUpRight } from "lucide-react";
import { profile, sections } from "@/lib/site";
import { useActiveSection } from "@/lib/use-active-section";
import { ThemeToggle } from "./theme-toggle";
import { SpottedCount } from "./plane-spotter";
import { CommandButton } from "./command-menu";
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
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <header className="before:from-bg/90 before:via-bg/55 fixed inset-x-0 top-0 z-50 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:-z-10 before:h-24 before:bg-linear-to-b before:to-transparent">
      <div className="container-page flex items-center justify-between gap-4 pt-3 sm:pt-4">
        <Link
          href={onHome ? "#top" : "/"}
          className="group panel panel-solid flex h-11 items-center gap-2.5 rounded-full pr-4 pl-1.5"
          aria-label="Sairaj Bandre, home"
        >
          <span className="bg-accent font-display text-ink grid size-8 place-items-center rounded-full text-sm font-extrabold transition-transform duration-500 group-hover:rotate-[360deg]">
            sb
          </span>
          <span className="font-display text-fg text-sm font-bold tracking-tight">sairaj.</span>
        </Link>

        <nav
          aria-label="Primary"
          className="panel panel-solid hidden h-11 items-center rounded-full p-1 lg:flex"
        >
          <ul className="flex items-center">
            {navItems.map((item) => {
              const isActive = onHome && active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={href(item.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative block rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      isActive ? "text-ink" : "text-muted hover:text-fg",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="bg-accent absolute inset-0 -z-10 rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    {item.label}
                  </a>
                </li>
              );
            })}
            <li>
              <a
                href={profile.links.blog}
                target="_blank"
                rel="noopener noreferrer"
                className="group text-muted hover:text-fg flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors"
              >
                Blog
                <ArrowUpRight
                  size={13}
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="panel panel-solid flex h-11 items-center rounded-full p-1">
            <CommandButton />
            <SpottedCount />
            <ThemeToggle />
            <a
              href={profile.links.resume}
              download
              className="text-fg hover:bg-line hidden h-9 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition-colors sm:inline-flex"
            >
              Résumé <ArrowDownToLine size={14} strokeWidth={2} aria-hidden />
            </a>
          </div>
          <button
            type="button"
            className="panel panel-solid relative z-[60] grid size-11 place-items-center rounded-full lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-5">
              <span
                className={cn(
                  "bg-fg absolute left-0 h-0.5 w-5 rounded transition-transform duration-300",
                  open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "bg-fg absolute left-0 h-0.5 w-5 rounded transition-transform duration-300",
                  open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            data-lenis-prevent
            initial={{ clipPath: "circle(0% at calc(100% - 2.4rem) 2.4rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2.4rem) 2.4rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 2.4rem) 2.4rem)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="bg-bg fixed inset-0 z-[55] flex flex-col justify-between px-6 pt-24 pb-10 lg:hidden"
          >
            <ul className="space-y-1">
              {sections
                .filter((s) => s.id !== "top")
                .map((s, i) => (
                  <motion.li
                    key={s.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.12 + i * 0.05 } }}
                  >
                    <a
                      href={href(s.id)}
                      onClick={() => setOpen(false)}
                      className="font-display text-fg flex min-w-0 items-baseline gap-3 py-1 text-[clamp(1.9rem,8.5vw,3rem)] font-extrabold tracking-tight"
                    >
                      <span className="tag text-accent shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0">{s.label}</span>
                    </a>
                  </motion.li>
                ))}
            </ul>
            <div className="flex flex-col gap-3">
              <a
                href={profile.links.blog}
                target="_blank"
                rel="noopener noreferrer"
                className="tag text-fg"
              >
                Read the blog: Ctrl+Automate ↗
              </a>
              <a href={profile.links.resume} download className="tag text-muted">
                Download résumé (PDF)
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
