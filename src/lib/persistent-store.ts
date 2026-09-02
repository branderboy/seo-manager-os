"use client";

import * as React from "react";

/**
 * A localStorage-backed value read through `useSyncExternalStore`.
 *
 * The obvious way to do this — `useState(fallback)` plus an effect that reads storage and
 * calls `setState` — causes a cascading render on every mount (`react-hooks/set-state-in-effect`)
 * and never notices a write made in another tab. This does neither: the server snapshot is
 * the fallback, so SSR and the first client render agree, and React picks up the stored
 * value without a second render pass driven by an effect.
 *
 * Storage is a best-effort mirror. A browser that refuses it (private mode, blocked site
 * data) still gets working in-memory state for the session.
 */
export function createPersistentStore<T>(
  key: string,
  fallback: T,
  parse: (raw: string) => T,
) {
  const listeners = new Set<() => void>();

  // Last value written in this tab. Takes precedence over storage, so the state still
  // works when localStorage throws.
  let memory: T | undefined;
  // Cached parse of the raw string, so getSnapshot returns a referentially stable value.
  let cachedRaw: string | null = null;
  let cachedValue: T = fallback;
  let primed = false;

  const emit = () => {
    for (const listener of listeners) listener();
  };

  const readRaw = (): string | null => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const subscribe = (onStoreChange: () => void) => {
    listeners.add(onStoreChange);
    const onStorage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== key) return;
      // Another tab wrote. Drop this tab's cached write and re-read.
      memory = undefined;
      primed = false;
      onStoreChange();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(onStoreChange);
      window.removeEventListener("storage", onStorage);
    };
  };

  const getSnapshot = (): T => {
    if (memory !== undefined) return memory;
    const raw = readRaw();
    if (!primed || raw !== cachedRaw) {
      primed = true;
      cachedRaw = raw;
      cachedValue = fallback;
      if (raw !== null) {
        try {
          cachedValue = parse(raw);
        } catch {
          cachedValue = fallback;
        }
      }
    }
    return cachedValue;
  };

  const getServerSnapshot = (): T => fallback;

  const write = (value: T) => {
    memory = value;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage is a mirror, not the source of truth */
    }
    emit();
  };

  const clear = () => {
    memory = undefined;
    primed = false;
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    emit();
  };

  const useValue = (): T =>
    React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return { useValue, write, clear };
}
