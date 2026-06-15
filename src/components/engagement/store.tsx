"use client";

import * as React from "react";

export type Model = "Local" | "SaaS" | "Enterprise";

export type Engagement = {
  business: string;
  website: string;
  industry: string;
  market: string;
  model: Model;
  goals: string[];
  problems: string[];
  assets: string[];
  competitors: string[];
  confidence: number;
};

// Default engagement so the app ships fully populated; the interview overwrites it.
export const DEFAULT_ENGAGEMENT: Engagement = {
  business: "Northwind Heating & Air",
  website: "northwindhvac.com",
  industry: "HVAC / Home Services",
  market: "Austin, TX",
  model: "Local",
  goals: ["More Leads", "More Calls", "More AI Visibility"],
  problems: ["GBP Visibility Problems", "Leads Down", "AI Visibility Problems"],
  assets: ["Google Business Profile", "GA4", "Search Console", "CRM"],
  competitors: ["ATX Comfort Pros", "Lone Star Mechanical", "Hill Country HVAC"],
  confidence: 92,
};

const KEY = "smos.engagement";

type Ctx = {
  engagement: Engagement;
  setEngagement: (e: Engagement) => void;
  reset: () => void;
};

const EngagementContext = React.createContext<Ctx | null>(null);

export function EngagementProvider({ children }: { children: React.ReactNode }) {
  const [engagement, setEngagementState] = React.useState<Engagement>(DEFAULT_ENGAGEMENT);

  // Load any saved engagement after mount (avoids SSR hydration mismatch).
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setEngagementState({ ...DEFAULT_ENGAGEMENT, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  const setEngagement = React.useCallback((e: Engagement) => {
    setEngagementState(e);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(e));
    } catch {
      /* ignore */
    }
  }, []);

  const reset = React.useCallback(() => {
    setEngagementState(DEFAULT_ENGAGEMENT);
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <EngagementContext.Provider value={{ engagement, setEngagement, reset }}>
      {children}
    </EngagementContext.Provider>
  );
}

export function useEngagement(): Ctx {
  const ctx = React.useContext(EngagementContext);
  if (!ctx) throw new Error("useEngagement must be used within EngagementProvider");
  return ctx;
}
