"use client";

import { useSyncExternalStore } from "react";

// localStorage as a tiny external store: hydration-safe (the server snapshot is the
// fallback) and every write notifies subscribers in the same tab.

const EVENT = "localstore";

export function readStore(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStore(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Blocked storage: the change just won't persist.
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function useStore(key: string, fallback: string) {
  return useSyncExternalStore(
    subscribe,
    () => readStore(key) ?? fallback,
    () => fallback,
  );
}
