"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Publishes the `[data-scene]` element crossing the middle of the viewport on
 * <html data-scene>. CSS re-tints from that attribute; the particle field morphs from it.
 * When scenes nest, the innermost (last in document order) wins.
 */
export function SceneDirector() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const crossing = new Set<HTMLElement>();
    const watched = new WeakSet<Element>();
    let raf = 0;
    let rescan = 0;

    const publish = () => {
      raf = 0;
      let chosen: HTMLElement | undefined;
      for (const el of crossing) {
        if (!el.isConnected) {
          crossing.delete(el);
          continue;
        }
        if (!chosen || chosen.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING)
          chosen = el;
      }
      const id = chosen?.dataset.scene;
      if (id && id !== root.dataset.scene) {
        root.dataset.scene = id;
        window.dispatchEvent(new Event("scenechange"));
      }
    };

    // A zero-height band across the middle of the viewport: no layout reads, ever.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) crossing.add(el);
          else crossing.delete(el);
        }
        if (!raf) raf = requestAnimationFrame(publish);
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );

    const observeAll = () => {
      rescan = 0;
      document.querySelectorAll<HTMLElement>("[data-scene]").forEach((el) => {
        if (el === root || watched.has(el)) return;
        watched.add(el);
        io.observe(el);
      });
    };
    observeAll();

    // Streamed content (Suspense) can add scenes after mount. Only look for new
    // elements, debounced, and never touch layout from here.
    const mo = new MutationObserver(() => {
      if (!rescan) rescan = window.setTimeout(observeAll, 150);
    });
    const main = document.getElementById("main") ?? document.body;
    mo.observe(main, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(rescan);
      mo.disconnect();
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
