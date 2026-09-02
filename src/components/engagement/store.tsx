"use client";

import * as React from "react";
import { createPersistentStore } from "@/lib/persistent-store";
import type { Client, Scores } from "@/lib/model";
import type { PlaybookType } from "@/lib/playbooks";

/** The active SEO type · drives playbooks, specialists and recommendations. */
export type Model = PlaybookType;

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
  scores: Scores;
  clientId?: string;
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
  scores: { visibility: 48, authority: 41, trust: 57, ai: 29, lead: 52, revenue: 61 },
  clientId: "northwind",
};

/** Build an engagement context from a selected client (keeps prior discovery defaults). */
export function engagementFromClient(c: Client): Engagement {
  return {
    ...DEFAULT_ENGAGEMENT,
    business: c.name,
    industry: c.industry,
    market: c.location,
    model: c.model,
    scores: c.scores,
    clientId: c.id,
  };
}

const KEY = "smos.engagement";

type Ctx = {
  engagement: Engagement;
  setEngagement: (e: Engagement) => void;
  reset: () => void;
};

const EngagementContext = React.createContext<Ctx | null>(null);

// Merged onto the default so an engagement saved by an older build gains any new field
// rather than rendering undefined.
const store = createPersistentStore<Engagement>(KEY, DEFAULT_ENGAGEMENT, (raw) => ({
  ...DEFAULT_ENGAGEMENT,
  ...JSON.parse(raw),
}));

export function EngagementProvider({ children }: { children: React.ReactNode }) {
  const engagement = store.useValue();

  const value = React.useMemo<Ctx>(
    () => ({ engagement, setEngagement: store.write, reset: store.clear }),
    [engagement],
  );

  return <EngagementContext.Provider value={value}>{children}</EngagementContext.Provider>;
}

export function useEngagement(): Ctx {
  const ctx = React.useContext(EngagementContext);
  if (!ctx) throw new Error("useEngagement must be used within EngagementProvider");
  return ctx;
}
