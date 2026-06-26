// ──────────────────────────────────────────────────────────────────────────
// Risk Center · replaces the single "health score" with a per-project business
// risk profile across eight dimensions. Higher = more at risk. Derived from the
// client's search scores so every number traces to its inputs.
// ──────────────────────────────────────────────────────────────────────────

import { clients, type Client, type Scores } from "./model";

export const RISK_DIMS = [
  "Traffic",
  "Revenue",
  "Technical",
  "Local",
  "AI Search",
  "Content",
  "Authority",
  "Indexation",
] as const;
export type RiskDim = (typeof RISK_DIMS)[number];
export type RiskLevel = "High" | "Medium" | "Low";

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

/** Risk per dimension = 100 − the relevant strength score(s). */
function dimsFor(s: Scores): Record<RiskDim, number> {
  return {
    Traffic: clamp(100 - s.visibility),
    Revenue: clamp(100 - s.revenue),
    Technical: clamp(100 - (s.visibility + s.authority) / 2),
    Local: clamp(100 - s.trust),
    "AI Search": clamp(100 - s.ai),
    Content: clamp(100 - s.lead),
    Authority: clamp(100 - s.authority),
    Indexation: clamp(100 - (s.visibility + s.trust) / 2),
  };
}

export function levelFor(overall: number): RiskLevel {
  if (overall >= 60) return "High";
  if (overall >= 45) return "Medium";
  return "Low";
}

export type ClientRisk = {
  client: Client;
  overall: number;
  level: RiskLevel;
  dims: Record<RiskDim, number>;
  topRisk: RiskDim;
};

export function riskForClient(c: Client): ClientRisk {
  const dims = dimsFor(c.scores);
  const overall = clamp(RISK_DIMS.reduce((sum, k) => sum + dims[k], 0) / RISK_DIMS.length);
  const topRisk = RISK_DIMS.reduce((a, b) => (dims[b] > dims[a] ? b : a), RISK_DIMS[0]);
  return { client: c, overall, level: levelFor(overall), dims, topRisk };
}

/** Most at-risk first. */
export const portfolioRisk: ClientRisk[] = clients
  .map(riskForClient)
  .sort((a, b) => b.overall - a.overall);

export const riskSummary = {
  avg: clamp(portfolioRisk.reduce((s, r) => s + r.overall, 0) / portfolioRisk.length),
  high: portfolioRisk.filter((r) => r.level === "High").length,
  clients: portfolioRisk.length,
};

/** Bar/badge tone by risk value (higher = worse). */
export function riskTone(v: number): string {
  if (v >= 60) return "bg-rose-500";
  if (v >= 45) return "bg-amber-500";
  return "bg-emerald-500";
}
export function riskBadge(level: RiskLevel): "bad" | "warn" | "good" {
  return level === "High" ? "bad" : level === "Medium" ? "warn" : "good";
}
