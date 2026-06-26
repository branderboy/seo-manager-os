// ──────────────────────────────────────────────────────────────────────────
// Type-aware recommendations · the engine stays the same, the diagnosis and
// strategy CHANGE per client type. Fixes are scored through src/lib/scoring.ts.
// ──────────────────────────────────────────────────────────────────────────

import { priorityScore, type Score } from "./scoring";
import type { PlaybookType } from "./playbooks";

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
  revenuePerMonth: number;
  owner: string;
  dependencies: string[];
  status: FixStatus;
  opportunity: Score;
  difficultyScore: Score;
  resultsTrend: number;
};

export type Fix = Omit<RawFix, "opportunity" | "difficultyScore" | "resultsTrend"> & {
  score: Score;
  priority: 1 | 2 | 3;
};

type DiagnosisContent = {
  primary: { title: string; confidence: number; impact: Impact; summary: string };
  raw: RawFix[];
};

const DIAGNOSIS: Record<PlaybookType, DiagnosisContent> = {
  Local: {
    primary: { title: "Weak Review Velocity", confidence: 87, impact: "High", summary: "Visibility is proximity-bound and trust-starved: 3 reviews/mo vs. a market median of 11 caps the winnable radius while AI visibility quietly erodes." },
    raw: [
      { id: "l1", title: "Launch review-velocity engine", why: "3 reviews/mo vs. market median 11 · the primary constraint on local rank.", businessImpact: "High", seoImpact: "High", difficulty: "Low", hours: 6, revenuePerMonth: 4200, owner: "Ops", dependencies: [], status: "In progress", opportunity: 88, difficultyScore: 30, resultsTrend: 0.82 },
      { id: "l2", title: "Build 6 service + 2 location pages", why: "Half of advertised services have no page; only 1 of 3 markets has a location page.", businessImpact: "High", seoImpact: "High", difficulty: "Medium", hours: 40, revenuePerMonth: 3100, owner: "Content", dependencies: ["Briefs approved"], status: "Not started", opportunity: 82, difficultyScore: 53, resultsTrend: 0.82 },
      { id: "l3", title: "Fix NAP across 9 citations", why: "Inconsistent listings suppress pack visibility and knowledge-panel trust.", businessImpact: "Medium", seoImpact: "Medium", difficulty: "Low", hours: 5, revenuePerMonth: 900, owner: "Local SEO", dependencies: [], status: "In progress", opportunity: 58, difficultyScore: 24, resultsTrend: 0.9 },
      { id: "l4", title: "Local authority outreach", why: "27 referring domains vs. market median 88 · thin local link profile.", businessImpact: "Medium", seoImpact: "Medium", difficulty: "High", hours: 30, revenuePerMonth: 1200, owner: "Marketing", dependencies: ["Pages published"], status: "Not started", opportunity: 60, difficultyScore: 74, resultsTrend: 1.0 },
    ],
  },
  Ecommerce: {
    primary: { title: "Faceted-Navigation Crawl Waste", confidence: 84, impact: "High", summary: "Crawl budget is burned on parameter URLs while thin collection pages under-rank · money flows to category demand the site can't capture." },
    raw: [
      { id: "e1", title: "Control faceted navigation", why: "34% of crawl is spent on filter/parameter URLs with no index value.", businessImpact: "High", seoImpact: "High", difficulty: "Medium", hours: 24, revenuePerMonth: 5200, owner: "Tech SEO", dependencies: [], status: "In progress", opportunity: 84, difficultyScore: 50, resultsTrend: 0.85 },
      { id: "e2", title: "Enrich top 20 collection pages", why: "Collection pages are thin · no intro copy, buying guidance or internal links.", businessImpact: "High", seoImpact: "High", difficulty: "Medium", hours: 30, revenuePerMonth: 3800, owner: "Content", dependencies: [], status: "Not started", opportunity: 80, difficultyScore: 48, resultsTrend: 0.9 },
      { id: "e3", title: "Add product + review schema", why: "Missing structured data forfeits rich results on high-intent product queries.", businessImpact: "Medium", seoImpact: "Medium", difficulty: "Low", hours: 10, revenuePerMonth: 1600, owner: "Schema", dependencies: [], status: "Not started", opportunity: 60, difficultyScore: 30, resultsTrend: 1.0 },
      { id: "e4", title: "Dedupe variant/product URLs", why: "Color/size variants create duplicate, competing URLs.", businessImpact: "Medium", seoImpact: "Medium", difficulty: "Medium", hours: 16, revenuePerMonth: 1100, owner: "Tech SEO", dependencies: ["Faceted nav fixed"], status: "Not started", opportunity: 54, difficultyScore: 46, resultsTrend: 1.0 },
    ],
  },
  SaaS: {
    primary: { title: "Thin BOFU Coverage", confidence: 81, impact: "High", summary: "Top-of-funnel ranks but the comparison, alternative and use-case pages that convert are missing · rivals own the 'vs' SERPs and the pipeline." },
    raw: [
      { id: "s1", title: "Build 12 comparison / vs pages", why: "12 high-intent comparison terms have no page; rivals own the 'vs' SERPs.", businessImpact: "High", seoImpact: "High", difficulty: "Medium", hours: 36, revenuePerMonth: 6000, owner: "Content", dependencies: [], status: "Not started", opportunity: 86, difficultyScore: 50, resultsTrend: 0.88 },
      { id: "s2", title: "Strengthen pillar → cluster links", why: "Clusters lack pillar hubs; MOFU↔BOFU internal links are weak.", businessImpact: "High", seoImpact: "Medium", difficulty: "Low", hours: 12, revenuePerMonth: 2400, owner: "SEO Lead", dependencies: [], status: "In progress", opportunity: 70, difficultyScore: 28, resultsTrend: 0.9 },
      { id: "s3", title: "Ship integrations programmatic set", why: "140 demand-backed integration pages are templatable but unbuilt.", businessImpact: "High", seoImpact: "High", difficulty: "High", hours: 50, revenuePerMonth: 3200, owner: "Content", dependencies: ["Template approved"], status: "Not started", opportunity: 78, difficultyScore: 72, resultsTrend: 1.0 },
      { id: "s4", title: "Clarify pricing-page conversion", why: "Demo CTA is buried; pricing lacks proof and comparison clarity.", businessImpact: "Medium", seoImpact: "Low", difficulty: "Low", hours: 8, revenuePerMonth: 1400, owner: "Design", dependencies: [], status: "Not started", opportunity: 52, difficultyScore: 26, resultsTrend: 1.0 },
    ],
  },
  Enterprise: {
    primary: { title: "Crawl Budget Waste & Indexation Decay", confidence: 79, impact: "High", summary: "A third of crawl is wasted on parameter URLs and 61k pages sit 'crawled · not indexed,' while category templates decay and orphan money pages lose equity." },
    raw: [
      { id: "n1", title: "Reclaim crawl budget", why: "34% of crawl spent on faceted/parameter URLs with no index value.", businessImpact: "High", seoImpact: "High", difficulty: "High", hours: 44, revenuePerMonth: 7200, owner: "Tech SEO", dependencies: [], status: "In progress", opportunity: 84, difficultyScore: 70, resultsTrend: 0.86 },
      { id: "n2", title: "Resolve 9,200 orphan URLs", why: "Revenue pages average 1.4 internal links; orphans lose equity.", businessImpact: "High", seoImpact: "High", difficulty: "Medium", hours: 30, revenuePerMonth: 4100, owner: "Eng", dependencies: [], status: "Not started", opportunity: 80, difficultyScore: 52, resultsTrend: 0.9 },
      { id: "n3", title: "Refresh decayed category template", why: "Category template decayed 18% YoY; PLP internal links too shallow.", businessImpact: "Medium", seoImpact: "Medium", difficulty: "Medium", hours: 28, revenuePerMonth: 2600, owner: "Content", dependencies: [], status: "Not started", opportunity: 64, difficultyScore: 48, resultsTrend: 1.0 },
      { id: "n4", title: "Fix indexation on key templates", why: "61k 'crawled · not indexed' from quality + duplication issues.", businessImpact: "Medium", seoImpact: "High", difficulty: "High", hours: 36, revenuePerMonth: 2200, owner: "Tech SEO", dependencies: ["Crawl reclaimed"], status: "Not started", opportunity: 66, difficultyScore: 68, resultsTrend: 1.0 },
    ],
  },
  Migration: {
    primary: { title: "Replatform Equity-Loss Risk", confidence: 83, impact: "High", summary: "The migration risks dropping rankings if redirects, parity and schema aren't locked before launch · the whole engagement hinges on a clean cutover." },
    raw: [
      { id: "m1", title: "Complete 1:1 redirect map", why: "Every legacy URL needs a mapped 301 to preserve equity on cutover.", businessImpact: "High", seoImpact: "High", difficulty: "High", hours: 40, revenuePerMonth: 8000, owner: "Tech SEO", dependencies: [], status: "In progress", opportunity: 90, difficultyScore: 66, resultsTrend: 0.8 },
      { id: "m2", title: "Pre-launch staging parity audit", why: "Catch metadata, schema and content gaps before they ship.", businessImpact: "High", seoImpact: "High", difficulty: "Medium", hours: 20, revenuePerMonth: 3000, owner: "QA", dependencies: ["Staging ready"], status: "Not started", opportunity: 78, difficultyScore: 46, resultsTrend: 0.9 },
      { id: "m3", title: "Remove redirect chains", why: "Chained redirects dilute equity and slow crawl.", businessImpact: "Medium", seoImpact: "Medium", difficulty: "Low", hours: 8, revenuePerMonth: 900, owner: "Tech SEO", dependencies: ["Redirect map"], status: "Not started", opportunity: 56, difficultyScore: 28, resultsTrend: 1.0 },
      { id: "m4", title: "Post-launch recovery monitoring", why: "Verify indexation and ranking recovery in the first 30 days.", businessImpact: "Medium", seoImpact: "Medium", difficulty: "Low", hours: 12, revenuePerMonth: 1100, owner: "SEO Lead", dependencies: ["Launch"], status: "Not started", opportunity: 58, difficultyScore: 30, resultsTrend: 1.0 },
    ],
  },
  "AI Search": {
    primary: { title: "Absent From AI Answers", confidence: 80, impact: "High", summary: "Near-zero presence in AI Overviews and assistants for category and JTBD queries: weak entity modeling and thin schema keep the brand out of the answers customers now see first." },
    raw: [
      { id: "a1", title: "Build the entity model", why: "Weak sameAs and disambiguation keep the brand out of the knowledge graph.", businessImpact: "High", seoImpact: "High", difficulty: "Medium", hours: 24, revenuePerMonth: 3600, owner: "SEO Lead", dependencies: [], status: "In progress", opportunity: 82, difficultyScore: 48, resultsTrend: 0.85 },
      { id: "a2", title: "Add FAQ + answer-style content", why: "Concise, source-style answers earn citations in AI responses.", businessImpact: "High", seoImpact: "Medium", difficulty: "Low", hours: 16, revenuePerMonth: 2400, owner: "Content", dependencies: [], status: "Not started", opportunity: 72, difficultyScore: 30, resultsTrend: 0.9 },
      { id: "a3", title: "Deploy + validate schema", why: "Missing structured data caps AI-answer and rich-result eligibility.", businessImpact: "Medium", seoImpact: "Medium", difficulty: "Low", hours: 10, revenuePerMonth: 1200, owner: "Schema", dependencies: [], status: "Blocked", opportunity: 58, difficultyScore: 32, resultsTrend: 1.0 },
      { id: "a4", title: "Build brand-mention footprint", why: "Authoritative unlinked mentions strengthen the entity for AI retrieval.", businessImpact: "Medium", seoImpact: "Medium", difficulty: "High", hours: 28, revenuePerMonth: 1400, owner: "PR", dependencies: ["Entity model"], status: "Not started", opportunity: 60, difficultyScore: 70, resultsTrend: 1.0 },
    ],
  },
};

function bucket(score: Score): 1 | 2 | 3 {
  if (score >= 70) return 1;
  if (score >= 50) return 2;
  return 3;
}

function scoreFix(r: RawFix): Fix {
  const score = priorityScore({ opportunity: r.opportunity, difficulty: r.difficultyScore, resultsTrend: r.resultsTrend }).score;
  return {
    id: r.id, title: r.title, why: r.why, businessImpact: r.businessImpact, seoImpact: r.seoImpact,
    difficulty: r.difficulty, hours: r.hours, revenuePerMonth: r.revenuePerMonth, owner: r.owner,
    dependencies: r.dependencies, status: r.status, score, priority: bucket(score),
  };
}

export function getDiagnosis(type: PlaybookType) {
  const c = DIAGNOSIS[type];
  const fixes = c.raw.map(scoreFix).sort((a, b) => b.score - a.score);
  const groups = (
    [
      { priority: 1 as const, label: "Fix first" },
      { priority: 2 as const, label: "Then these" },
      { priority: 3 as const, label: "Later" },
    ]
  ).map((g) => ({ ...g, fixes: fixes.filter((f) => f.priority === g.priority) }));
  const summary = {
    totalFixes: fixes.length,
    totalHours: fixes.reduce((s, f) => s + f.hours, 0),
    totalRevenue: fixes.reduce((s, f) => s + f.revenuePerMonth, 0),
    p1: fixes.filter((f) => f.priority === 1).length,
  };
  return { primary: c.primary, groups, summary };
}

// ── Strategy content per type ────────────────────────────────────────────────
export type StrategyContent = {
  executiveSummary: string;
  currentState: string[];
  keyFindings: string[];
  opportunities: string[];
  risks: string[];
  expectedOutcomes: { metric: string; from: number; to: number }[];
};

export const strategyByType: Record<PlaybookType, StrategyContent> = {
  Local: {
    executiveSummary: "Durable demand and a trusted brand inside a 2-mile core, but reach is capped by trust and coverage · not content. Two quarters on review velocity, service/location coverage and local authority expand the winnable radius and recover leads, while an AEO foundation protects the brand as search shifts to AI answers.",
    currentState: ["Visibility 48 / Trust 57 / AI 29.", "Strong within 2mi of HQ, weak beyond · proximity-bound.", "Leads down ~18% QoQ in two outer ZIPs."],
    keyFindings: ["Review velocity is the largest constraint on reach.", "Half of advertised services have no page.", "Effectively invisible in AI Overviews."],
    opportunities: ["Recover 2 outer ZIPs by lifting review velocity.", "Build 6 service + 2 location pages.", "Capture AI-answer citations before rivals."],
    risks: ["AI-visibility decline compounds with adoption.", "Rivals' review lead widens if velocity gap persists.", "NAP inconsistency risks pack suppression."],
    expectedOutcomes: [
      { metric: "Local pack share", from: 48, to: 67 },
      { metric: "Qualified leads / mo", from: 142, to: 205 },
      { metric: "AI visibility", from: 29, to: 55 },
      { metric: "Review velocity / mo", from: 3, to: 12 },
    ],
  },
  Ecommerce: {
    executiveSummary: "Category demand is strong but the site can't capture it: crawl budget leaks into faceted URLs while thin collection pages under-rank. Fixing crawl control and enriching collections unlocks revenue from terms the catalog already deserves to win.",
    currentState: ["Visibility 52 / Authority 55 / AI 30.", "34% of crawl wasted on parameter URLs.", "Collection pages thin and under-linked."],
    keyFindings: ["Faceted navigation is the primary technical constraint.", "Top collections lack content and internal links.", "Product/review schema largely missing."],
    opportunities: ["Capture category demand with enriched collections.", "Recover crawl budget for revenue pages.", "Win rich results on product queries."],
    risks: ["Duplicate variants cannibalize rankings.", "Crawl waste slows indexation of new products.", "Competitors out-content category pages."],
    expectedOutcomes: [
      { metric: "Non-brand revenue / mo", from: 100, to: 138 },
      { metric: "Indexed revenue pages", from: 62, to: 88 },
      { metric: "Crawl efficiency", from: 53, to: 78 },
      { metric: "Rich-result coverage", from: 18, to: 70 },
    ],
  },
  SaaS: {
    executiveSummary: "Top-of-funnel content ranks, but the comparison, alternative and use-case pages that actually convert are missing, so rivals own the 'vs' SERPs and the pipeline. Building BOFU coverage and a programmatic integrations set turns existing demand into qualified signups.",
    currentState: ["Visibility 56 / Authority 49 / AI 34.", "TOFU strong; MOFU↔BOFU links weak.", "12 comparison terms with no page."],
    keyFindings: ["Thin BOFU is the largest pipeline constraint.", "Clusters lack pillar hubs.", "140 integration pages templatable but unbuilt."],
    opportunities: ["Own the 'vs' and 'alternative' SERPs.", "Ship a programmatic integrations set.", "Lift demo conversion on money pages."],
    risks: ["Rivals entrench on comparison terms.", "Programmatic set ships thin without quality gates.", "AI answers bypass branded TOFU content."],
    expectedOutcomes: [
      { metric: "BOFU pipeline / mo", from: 100, to: 150 },
      { metric: "Comparison-term coverage", from: 0, to: 12 },
      { metric: "Programmatic pages", from: 0, to: 140 },
      { metric: "Demo conversion", from: 55, to: 72 },
    ],
  },
  Enterprise: {
    executiveSummary: "Scale is the constraint: a third of crawl is wasted, tens of thousands of pages sit unindexed, and decayed templates plus orphaned money pages bleed equity. Governed technical fixes to crawl, indexation and internal linking compound into material qualified-traffic gains.",
    currentState: ["Visibility 53 / Authority 58 / AI 27.", "34% crawl waste; 61k crawled-not-indexed.", "9,200 orphan URLs; shallow PLP links."],
    keyFindings: ["Crawl waste and indexation decay cap visibility.", "Revenue pages average 1.4 internal links.", "Category template decayed 18% YoY."],
    opportunities: ["Reclaim crawl budget for revenue pages.", "Recover indexation on key templates.", "Strengthen the internal-link graph."],
    risks: ["Indexation decay compounds at scale.", "Governance gaps stall execution.", "Orphan money pages keep losing equity."],
    expectedOutcomes: [
      { metric: "Qualified sessions", from: 100, to: 122 },
      { metric: "Indexation rate", from: 51, to: 78 },
      { metric: "Crawl efficiency", from: 46, to: 75 },
      { metric: "Revenue-page links (avg)", from: 1, to: 6 },
    ],
  },
  Migration: {
    executiveSummary: "The engagement hinges on a clean cutover. Without a complete redirect map, staging parity and post-launch monitoring, the replatform risks dropping rankings and revenue overnight. Locking these protects equity and makes the migration a non-event for search.",
    currentState: ["Visibility 58 / Authority 62 / AI 33.", "Replatform scheduled; redirect map incomplete.", "Staging parity unverified."],
    keyFindings: ["Incomplete redirect map is the top risk.", "Staging lacks metadata/schema parity.", "No post-launch recovery monitoring in place."],
    opportunities: ["Preserve 100% of equity on cutover.", "Catch parity gaps before launch.", "Recover rankings within 30 days."],
    risks: ["Unmapped URLs drop to 404 on launch.", "Redirect chains dilute equity.", "Undetected parity gaps tank rankings."],
    expectedOutcomes: [
      { metric: "Equity preserved", from: 0, to: 98 },
      { metric: "Mapped redirects", from: 40, to: 100 },
      { metric: "Post-launch traffic retention", from: 0, to: 96 },
      { metric: "Broken redirects", from: 12, to: 0 },
    ],
  },
  "AI Search": {
    executiveSummary: "Customers increasingly see an AI answer before a blue link, and the brand is largely absent. Strengthening the entity model, schema and answer-style content earns citations in AI Overviews and assistants · claiming presence in the surface that now shapes consideration.",
    currentState: ["Visibility 50 / Trust 66 / AI 24.", "Absent from AI answers for category queries.", "Weak entity model; thin schema."],
    keyFindings: ["Weak entity modeling blocks AI retrieval.", "No answer-style/FAQ content.", "Structured data largely missing."],
    opportunities: ["Earn citations in AI Overviews and assistants.", "Model the brand unambiguously for machines.", "Build an authoritative mention footprint."],
    risks: ["AI-answer share is consolidating to rivals.", "Thin schema forfeits eligibility.", "Mention gap weakens entity over time."],
    expectedOutcomes: [
      { metric: "AI mention rate", from: 24, to: 52 },
      { metric: "AI Overview presence", from: 18, to: 48 },
      { metric: "Entity clarity", from: 52, to: 80 },
      { metric: "Cited-source share", from: 23, to: 45 },
    ],
  },
};
