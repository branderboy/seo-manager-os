// ──────────────────────────────────────────────────────────────────────────
// Diagnosis v2 — prioritized fixes.
// "Do not output hundreds of issues. Output priorities." Each fix is scored
// through src/lib/scoring.ts (Opportunity ÷ Difficulty, weighted by results
// trend) and bucketed into Priority 1/2/3. Every number traces to its inputs.
// ──────────────────────────────────────────────────────────────────────────

import { priorityScore, type Score } from "./scoring";

export type Impact = "High" | "Medium" | "Low";
export type FixStatus = "Not started" | "In progress" | "Blocked" | "Done";

type RawFix = {
  id: string;
  title: string;
  why: string;
  businessImpact: Impact;
  seoImpact: Impact;
  difficulty: Impact;
  hours: number;
  revenuePerMonth: number; // estimated $/mo upside
  owner: string;
  dependencies: string[];
  status: FixStatus;
  // scoring inputs
  opportunity: Score;
  difficultyScore: Score;
  resultsTrend: number;
};

const RAW: RawFix[] = [
  {
    id: "reviews",
    title: "Launch review-velocity engine",
    why: "Review acquisition is 3/mo vs. market median 11/mo — the primary constraint on local rank.",
    businessImpact: "High",
    seoImpact: "High",
    difficulty: "Low",
    hours: 6,
    revenuePerMonth: 4200,
    owner: "Ops",
    dependencies: [],
    status: "In progress",
    opportunity: 88,
    difficultyScore: 30,
    resultsTrend: 0.82,
  },
  {
    id: "service-pages",
    title: "Build 6 service + 2 location pages",
    why: "6 of 12 GBP services have no supporting page; only 1 of 3 markets has a location page.",
    businessImpact: "High",
    seoImpact: "High",
    difficulty: "Medium",
    hours: 40,
    revenuePerMonth: 3100,
    owner: "Content",
    dependencies: ["Content briefs approved"],
    status: "Not started",
    opportunity: 82,
    difficultyScore: 53,
    resultsTrend: 0.82,
  },
  {
    id: "nap",
    title: "Fix NAP across 9 citations",
    why: "Inconsistent name/address/phone suppresses pack visibility and knowledge-panel trust.",
    businessImpact: "Medium",
    seoImpact: "Medium",
    difficulty: "Low",
    hours: 5,
    revenuePerMonth: 900,
    owner: "Local SEO",
    dependencies: [],
    status: "In progress",
    opportunity: 58,
    difficultyScore: 24,
    resultsTrend: 0.9,
  },
  {
    id: "schema",
    title: "Add FAQ + LocalBusiness schema",
    why: "Missing structured data caps rich-result and AI-answer eligibility on service pages.",
    businessImpact: "Medium",
    seoImpact: "Medium",
    difficulty: "Low",
    hours: 8,
    revenuePerMonth: 700,
    owner: "Tech SEO",
    dependencies: ["Service pages published"],
    status: "Blocked",
    opportunity: 54,
    difficultyScore: 35,
    resultsTrend: 1.0,
  },
  {
    id: "links",
    title: "Local authority / sponsorship outreach",
    why: "27 referring domains vs. market median 88 — thin local link profile limits reach.",
    businessImpact: "Medium",
    seoImpact: "Medium",
    difficulty: "High",
    hours: 30,
    revenuePerMonth: 1200,
    owner: "Marketing",
    dependencies: ["Service pages published"],
    status: "Not started",
    opportunity: 60,
    difficultyScore: 74,
    resultsTrend: 1.0,
  },
  {
    id: "internal-links",
    title: "Internal-link pass: service ↔ location ↔ money",
    why: "Money pages average 1.4 internal links; weak paths dilute relevance and crawl flow.",
    businessImpact: "Low",
    seoImpact: "Medium",
    difficulty: "Low",
    hours: 6,
    revenuePerMonth: 500,
    owner: "Tech SEO",
    dependencies: ["Service pages published"],
    status: "Not started",
    opportunity: 44,
    difficultyScore: 28,
    resultsTrend: 1.0,
  },
];

export type Fix = Omit<RawFix, "opportunity" | "difficultyScore" | "resultsTrend"> & {
  score: Score;
  priority: 1 | 2 | 3;
};

function bucket(score: Score): 1 | 2 | 3 {
  if (score >= 70) return 1;
  if (score >= 50) return 2;
  return 3;
}

export const fixes: Fix[] = RAW.map((r) => {
  const score = priorityScore({
    opportunity: r.opportunity,
    difficulty: r.difficultyScore,
    resultsTrend: r.resultsTrend,
  }).score;
  return {
    id: r.id,
    title: r.title,
    why: r.why,
    businessImpact: r.businessImpact,
    seoImpact: r.seoImpact,
    difficulty: r.difficulty,
    hours: r.hours,
    revenuePerMonth: r.revenuePerMonth,
    owner: r.owner,
    dependencies: r.dependencies,
    status: r.status,
    score,
    priority: bucket(score),
  };
}).sort((a, b) => b.score - a.score);

export const priorityGroups: { priority: 1 | 2 | 3; label: string; fixes: Fix[] }[] = [
  { priority: 1, label: "Fix first", fixes: fixes.filter((f) => f.priority === 1) },
  { priority: 2, label: "Then these", fixes: fixes.filter((f) => f.priority === 2) },
  { priority: 3, label: "Later", fixes: fixes.filter((f) => f.priority === 3) },
];

/** Rolled-up totals for the section header. */
export const diagnosisSummary = {
  totalFixes: fixes.length,
  totalHours: fixes.reduce((s, f) => s + f.hours, 0),
  totalRevenue: fixes.reduce((s, f) => s + f.revenuePerMonth, 0),
  p1: fixes.filter((f) => f.priority === 1).length,
};
