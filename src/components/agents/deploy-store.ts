"use client";

// Shared deploy state for the agent fleet. Persists to localStorage and syncs across
// every component (the Agent Store page + the per-stage deploy chips) via
// useSyncExternalStore · no provider needed.

import { useSyncExternalStore } from "react";
import { agents } from "@/lib/agents";

const KEY = "smos.agents.deployed";
const defaults: Record<string, boolean> = Object.fromEntries(agents.map((a) => [a.id, a.active]));

let state: Record<string, boolean> = { ...defaults };
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function hydrate() {
  if (hydrated) return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      state = { ...defaults, ...JSON.parse(raw) };
      emit();
    }
  } catch {
    /* ignore */
  }
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function toggleAgent(id: string, value?: boolean) {
  state = { ...state, [id]: value ?? !state[id] };
  persist();
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  hydrate();
  return () => {
    listeners.delete(cb);
  };
}

export function useDeployState(): Record<string, boolean> {
  return useSyncExternalStore(subscribe, () => state, () => defaults);
}
