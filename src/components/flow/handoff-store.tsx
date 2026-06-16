"use client";

import * as React from "react";
import { diagnosis } from "@/lib/data";

// What Diagnosis hands off to Strategy. Seeded with the primary + secondary cause.
const DEFAULT = [diagnosis.primary.title, diagnosis.secondary.title];
const KEY = "smos.strategyInputs";

type Ctx = {
  strategyInputs: string[];
  setStrategyInputs: (x: string[]) => void;
};

const C = React.createContext<Ctx | null>(null);

export function HandoffProvider({ children }: { children: React.ReactNode }) {
  const [strategyInputs, setState] = React.useState<string[]>(DEFAULT);

  React.useEffect(() => {
    try {
      const r = window.localStorage.getItem(KEY);
      if (r) setState(JSON.parse(r));
    } catch {
      /* ignore */
    }
  }, []);

  const setStrategyInputs = React.useCallback((x: string[]) => {
    setState(x);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(x));
    } catch {
      /* ignore */
    }
  }, []);

  return <C.Provider value={{ strategyInputs, setStrategyInputs }}>{children}</C.Provider>;
}

export function useHandoff() {
  const c = React.useContext(C);
  if (!c) throw new Error("useHandoff must be used within HandoffProvider");
  return c;
}
