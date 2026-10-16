"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import {
  ArrowRight,
  Command,
  Copy,
  CornerDownLeft,
  FileDown,
  Hash,
  type LucideIcon,
  Moon,
  PenLine,
  Plane,
  Search,
} from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import { profile, sections } from "@/lib/site";
import { scrollToTarget } from "./smooth-scroll";
import { cn } from "@/lib/utils";

const OPEN_EVENT = "command-menu:open";
export const SPAWN_PLANE_EVENT = "plane-spotter:spawn";

export type CommandProject = { slug: string; title: string; tagline: string; callsign: string };

type Action =
  | { kind: "section"; id: string }
  | { kind: "project"; slug: string }
  | { kind: "external"; href: string }
  | { kind: "copy-email" | "resume" | "theme" | "plane" };

type Item = {
  id: string;
  group: "Jump to" | "Projects" | "Do";
  label: string;
  hint?: string;
  keywords?: string;
  icon: LucideIcon | typeof GitHubIcon;
  action: Action;
};

/** Lower is better; null means no match. Prefix beats substring beats in-order letters. */
function score(text: string, query: string): number | null {
  if (!query) return 0;
  const t = text.toLowerCase();
  if (t.startsWith(query)) return 0;
  const at = t.indexOf(query);
  if (at >= 0) return 1 + at / 100;
  let i = 0;
  for (const ch of t) if (ch === query[i]) i++;
  return i === query.length ? 3 : null;
}

export function CommandButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      className="text-muted hover:bg-line hover:text-fg hidden h-9 items-center gap-1 rounded-full px-2.5 transition-colors md:inline-flex"
      aria-label="Open command menu"
      title="Command menu (Ctrl K)"
    >
      <Command size={14} strokeWidth={1.75} aria-hidden />
      <span className="font-mono text-[11px]">K</span>
    </button>
  );
}

export function CommandMenu({ projects }: { projects: CommandProject[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [flash, setFlash] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const listId = useId();

  const close = useCallback(() => {
    setOpen(false);
    returnFocus.current?.focus?.();
  }, []);

  useEffect(() => {
    const show = () => {
      returnFocus.current = document.activeElement as HTMLElement | null;
      setQuery("");
      setActive(0);
      setFlash(null);
      setOpen(true);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) close();
        else show();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, show);
    };
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    input.current?.focus();
    return () => {
      root.style.overflow = "";
    };
  }, [open]);

  const light = resolvedTheme === "light";
  const items = useMemo<Item[]>(
    () => [
      ...sections.map<Item>((s) => ({
        id: `section-${s.id}`,
        group: "Jump to",
        label: s.id === "top" ? "Top of the page" : s.label === "Path" ? "Learning path" : s.label,
        icon: Hash,
        keywords: s.id,
        action: { kind: "section", id: s.id },
      })),
      ...projects.map<Item>((p) => ({
        id: `project-${p.slug}`,
        group: "Projects",
        label: p.title,
        hint: p.callsign,
        keywords: p.tagline,
        icon: ArrowRight,
        action: { kind: "project", slug: p.slug },
      })),
      {
        id: "copy-email",
        group: "Do",
        label: "Copy my email address",
        hint: profile.email,
        keywords: "contact mail",
        icon: Copy,
        action: { kind: "copy-email" },
      },
      {
        id: "resume",
        group: "Do",
        label: "Download résumé",
        hint: "PDF",
        keywords: "cv resume",
        icon: FileDown,
        action: { kind: "resume" },
      },
      {
        id: "theme",
        group: "Do",
        label: light ? "Switch to dark theme" : "Switch to light theme",
        keywords: "theme mode colour color dark light",
        icon: Moon,
        action: { kind: "theme" },
      },
      {
        id: "plane",
        group: "Do",
        label: "Spot a plane",
        hint: "easter egg",
        keywords: "flight aviation squawk",
        icon: Plane,
        action: { kind: "plane" },
      },
      {
        id: "github",
        group: "Do",
        label: "Open GitHub",
        icon: GitHubIcon,
        action: { kind: "external", href: profile.links.github },
      },
      {
        id: "linkedin",
        group: "Do",
        label: "Open LinkedIn",
        icon: LinkedInIcon,
        action: { kind: "external", href: profile.links.linkedin },
      },
      {
        id: "blog",
        group: "Do",
        label: "Read the blog",
        hint: "Ctrl+Automate",
        keywords: "writing posts",
        icon: PenLine,
        action: { kind: "external", href: profile.links.blog },
      },
    ],
    [projects, light],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .map((item) => {
        const s = [item.label, item.keywords ?? "", item.hint ?? ""].map((t) => score(t, q));
        const best = s.reduce<number | null>(
          (acc, v, i) => (v === null ? acc : Math.min(acc ?? 99, v + i)),
          null,
        );
        return { item, best };
      })
      .filter((r): r is { item: Item; best: number } => r.best !== null)
      .sort((a, b) => (q ? a.best - b.best : 0))
      .map((r) => r.item);
  }, [items, query]);

  const current = results[Math.min(active, results.length - 1)];

  useEffect(() => {
    if (!current) return;
    document.getElementById(`${listId}-${current.id}`)?.scrollIntoView({ block: "nearest" });
  }, [current, listId]);

  const runItem = ({ id, action }: Item) => {
    switch (action.kind) {
      case "section": {
        close();
        // Let the scroll lock lift before scrolling.
        window.setTimeout(() => {
          const el = document.getElementById(action.id);
          if (pathname === "/" && el) scrollToTarget(action.id === "top" ? 0 : el);
          else router.push(`/#${action.id}`);
        }, 50);
        return;
      }
      case "project":
        close();
        router.push(`/projects/${action.slug}`);
        return;
      case "external":
        close();
        window.open(action.href, "_blank", "noopener,noreferrer");
        return;
      case "copy-email":
        navigator.clipboard?.writeText(profile.email).then(
          () => {
            setFlash(id);
            window.setTimeout(close, 900);
          },
          () => {
            close();
            window.location.assign(`mailto:${profile.email}`);
          },
        );
        return;
      case "resume": {
        close();
        const a = document.createElement("a");
        a.href = profile.links.resume;
        a.download = "";
        a.click();
        return;
      }
      case "theme":
        close();
        setTheme(light ? "dark" : "light");
        return;
      case "plane":
        close();
        window.dispatchEvent(new Event(SPAWN_PLANE_EVENT));
        return;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter" && current) {
      e.preventDefault();
      runItem(current);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      e.preventDefault();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="command-menu"
          data-lenis-prevent
          className="bg-bg/55 fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh] backdrop-blur-[3px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            className="panel panel-solid w-full max-w-xl overflow-hidden rounded-[1.75rem] shadow-2xl shadow-black/30"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            onKeyDown={onKeyDown}
          >
            <div className="border-line flex items-center gap-3 border-b px-5">
              <Search size={17} className="text-subtle shrink-0" aria-hidden />
              <input
                ref={input}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                placeholder="Jump to a section, project or action…"
                className="text-fg placeholder:text-subtle h-14 min-w-0 flex-1 bg-transparent text-base focus:outline-none"
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-activedescendant={current ? `${listId}-${current.id}` : undefined}
                aria-autocomplete="list"
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className="tag border-line-strong text-subtle rounded-md border px-1.5 py-0.5">
                esc
              </kbd>
            </div>

            <ul
              id={listId}
              role="listbox"
              aria-label="Commands"
              className="max-h-[min(26rem,56vh)] overflow-y-auto overscroll-contain p-2"
            >
              {results.length === 0 && (
                <li className="text-muted px-4 py-10 text-center text-sm" role="presentation">
                  Nothing matches &ldquo;{query}&rdquo;. Try &ldquo;work&rdquo; or
                  &ldquo;email&rdquo;.
                </li>
              )}
              {results.map((item, i) => {
                // Ranked search results are one flat list; group headings only make sense unfiltered.
                const heading =
                  !query.trim() && item.group !== results[i - 1]?.group ? item.group : null;
                const selected = item === current;
                const Icon = item.icon;
                return (
                  <li key={item.id} role="presentation">
                    {heading && (
                      <p className="tag text-subtle px-3 pt-3 pb-1.5" aria-hidden>
                        {heading}
                      </p>
                    )}
                    <div
                      id={`${listId}-${item.id}`}
                      role="option"
                      aria-selected={selected}
                      onMouseMove={() => setActive(i)}
                      onClick={() => runItem(item)}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-[0.95rem] transition-colors",
                        selected ? "bg-accent text-ink" : "text-fg",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-8 shrink-0 place-items-center rounded-xl border",
                          selected ? "border-ink/20" : "border-line text-muted",
                        )}
                      >
                        <Icon size={15} aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1 truncate font-medium">
                        {flash === item.id ? "Copied to clipboard" : item.label}
                      </span>
                      {item.hint && (
                        <span
                          className={cn(
                            "hidden truncate font-mono text-[11px] sm:block",
                            selected ? "text-ink/70" : "text-subtle",
                          )}
                        >
                          {item.hint}
                        </span>
                      )}
                      {selected && <CornerDownLeft size={14} className="shrink-0" aria-hidden />}
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="tag border-line text-subtle flex items-center justify-between gap-4 border-t px-5 py-3">
              <span>↑ ↓ to move · ↵ to run</span>
              <span className="hidden sm:inline">Ctrl / ⌘ K anywhere</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
