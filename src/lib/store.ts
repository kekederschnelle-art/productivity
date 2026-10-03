"use client";

import { useCallback, useSyncExternalStore } from "react";

// Einfacher localStorage-Speicher, der alle Komponenten synchron hält.
// Wird später durch eine echte Datenbank ersetzt.

const listeners = new Set<() => void>();
const cache = new Map<string, unknown>();

function read<T>(key: string, fallback: T): T {
  if (cache.has(key)) return cache.get(key) as T;
  let value = fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw) value = JSON.parse(raw) as T;
  } catch {}
  cache.set(key, value);
  return value;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useStored<T>(key: string, fallback: T) {
  const value = useSyncExternalStore(
    subscribe,
    () => read(key, fallback),
    () => fallback,
  );

  const setValue = useCallback(
    (update: T | ((prev: T) => T)) => {
      const prev = read(key, fallback);
      const next =
        typeof update === "function" ? (update as (p: T) => T)(prev) : update;
      cache.set(key, next);
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {}
      listeners.forEach((l) => l());
    },
    [key, fallback],
  );

  return [value, setValue] as const;
}

export function dayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
