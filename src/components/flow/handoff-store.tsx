"use client";

import * as React from "react";
import { createPersistentStore } from "@/lib/persistent-store";
import { diagnosis } from "@/lib/data";

// What Diagnosis hands off to Strategy. Seeded with the primary + secondary cause.
const DEFAULT = [diagnosis.primary.title, diagnosis.secondary.title];
const KEY = "smos.strategyInputs";

type Ctx = {
  strategyInputs: string[];
  setStrategyInputs: (x: string[]) => void;
};

const C = React.createContext<Ctx | null>(null);

const store = createPersistentStore<string[]>(KEY, DEFAULT, (raw) => {
  const parsed: unknown = JSON.parse(raw);
  return Array.isArray(parsed) ? (parsed as string[]) : DEFAULT;
});

export function HandoffProvider({ children }: { children: React.ReactNode }) {
  const strategyInputs = store.useValue();

  const value = React.useMemo<Ctx>(
    () => ({ strategyInputs, setStrategyInputs: store.write }),
    [strategyInputs],
  );

  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useHandoff() {
  const c = React.useContext(C);
  if (!c) throw new Error("useHandoff must be used within HandoffProvider");
  return c;
}
