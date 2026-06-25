// ──────────────────────────────────────────────────────────────────────────
// Per-type content for the upstream pipeline stages (Intent, Competitive).
// Read by client components against the active engagement's SEO type.
// ──────────────────────────────────────────────────────────────────────────

import type { PlaybookType } from "./playbooks";

export type FunnelTier = {
  tier: string;
  name: string;
  intent: string;
  queries: string[];
  goal: string;
  share: number;
};

export const intentByType: Record<PlaybookType, FunnelTier[]> = {
  Local: [
    { tier: "TOF", name: "Top of Funnel", intent: "Informational · Awareness", queries: ["how to fix an AC", "furnace not heating", "what is a SEER rating"], goal: "AI Visibility", share: 38 },
    { tier: "MOF", name: "Middle of Funnel", intent: "Commercial · Consideration", queries: ["best HVAC company austin", "AC repair vs replace", "HVAC reviews"], goal: "Qualified Leads", share: 34 },
    { tier: "BOF", name: "Bottom of Funnel", intent: "Transactional · Decision", queries: ["emergency AC repair near me", "book HVAC tech today", "AC repair cost"], goal: "Calls", share: 28 },
  ],
  Ecommerce: [
    { tier: "TOF", name: "Top of Funnel", intent: "Informational · Research", queries: ["how to choose hiking boots", "best fabrics for rain", "layering guide"], goal: "Traffic & Authority", share: 40 },
    { tier: "MOF", name: "Middle of Funnel", intent: "Commercial · Comparison", queries: ["best hiking boots 2026", "brand A vs brand B", "waterproof boot reviews"], goal: "Category Rankings", share: 36 },
    { tier: "BOF", name: "Bottom of Funnel", intent: "Transactional · Purchase", queries: ["buy merrell moab 3", "trail runners on sale", "size 11 hiking boots"], goal: "Revenue", share: 24 },
  ],
  SaaS: [
    { tier: "TOF", name: "Top of Funnel", intent: "Informational · Jobs-to-be-done", queries: ["how to automate approvals", "what is workflow automation", "ops efficiency tips"], goal: "AI Visibility", share: 42 },
    { tier: "MOF", name: "Middle of Funnel", intent: "Commercial · Evaluation", queries: ["best workflow software", "monday vs asana", "zapier alternatives"], goal: "Pipeline", share: 36 },
    { tier: "BOF", name: "Bottom of Funnel", intent: "Transactional · Signup", queries: ["acme pricing", "acme vs monday", "request a demo"], goal: "Signups", share: 22 },
  ],
  Enterprise: [
    { tier: "TOF", name: "Top of Funnel", intent: "Informational · Category", queries: ["how to choose a sofa", "living room layout ideas", "furniture materials guide"], goal: "Reach", share: 44 },
    { tier: "MOF", name: "Middle of Funnel", intent: "Commercial · Comparison", queries: ["best sectional sofas", "leather vs fabric", "sofa brand reviews"], goal: "Qualified Sessions", share: 34 },
    { tier: "BOF", name: "Bottom of Funnel", intent: "Transactional · Purchase", queries: ["buy modular sectional", "sofa free shipping", "in-stock sectionals"], goal: "Revenue", share: 22 },
  ],
  Migration: [
    { tier: "Pre", name: "Pre-migration", intent: "Baseline · Mapping", queries: ["top organic landing pages", "highest-equity URLs", "ranking keyword inventory"], goal: "Equity Inventory", share: 40 },
    { tier: "Cut", name: "Cutover", intent: "Validation · Parity", queries: ["staging vs prod parity", "redirect coverage", "schema parity"], goal: "Zero Loss", share: 35 },
    { tier: "Post", name: "Post-migration", intent: "Recovery · Monitoring", queries: ["indexation status", "ranking recovery", "404 / redirect errors"], goal: "Recovery", share: 25 },
  ],
  "AI Search": [
    { tier: "TOF", name: "Questions", intent: "Informational · Answer-seeking", queries: ["is X safe", "how does X work", "what causes X"], goal: "AI Citations", share: 46 },
    { tier: "MOF", name: "Comparison", intent: "Commercial · Evaluation", queries: ["best option for X", "X vs Y", "alternatives to X"], goal: "Answer Presence", share: 32 },
    { tier: "BOF", name: "Action", intent: "Transactional · Decision", queries: ["book X near me", "X provider reviews", "X cost"], goal: "Conversions", share: 22 },
  ],
};

export type Landscape = { label: string; value: string; note: string };

export const competitiveLandscapeByType: Record<PlaybookType, Landscape[]> = {
  Local: [
    { label: "SERP features won by rivals", value: "Local Pack · FAQ · AI Overview", note: "You appear in 0 of 3" },
    { label: "Content gaps vs. competitors", value: "18 topics", note: "Ranked by rivals, missing on-site" },
    { label: "Backlink gap", value: "−214 referring domains", note: "Behind the market median" },
    { label: "AI answer coverage", value: "9% of queries", note: "vs. 41% for the leader" },
  ],
  Ecommerce: [
    { label: "SERP features won by rivals", value: "Shopping · Reviews · PAA", note: "You appear in 1 of 3" },
    { label: "Category gaps", value: "26 collections", note: "Rivals rank, you have no page" },
    { label: "Backlink gap", value: "−480 referring domains", note: "Behind category leaders" },
    { label: "Product-schema coverage", value: "22% of PDPs", note: "vs. 90% for the leader" },
  ],
  SaaS: [
    { label: "SERP features won by rivals", value: "AI Overview · PAA · Sitelinks", note: "You appear in 0 of 3" },
    { label: "Comparison-term gaps", value: "12 'vs' terms", note: "Rivals own the comparison SERPs" },
    { label: "Backlink gap", value: "−320 referring domains", note: "Behind category leaders" },
    { label: "AI answer coverage", value: "14% of queries", note: "vs. 38% for the leader" },
  ],
  Enterprise: [
    { label: "SERP features won by rivals", value: "Shopping · Sitelinks · PAA", note: "You appear in 1 of 3" },
    { label: "Template-coverage gaps", value: "9 templates", note: "Rivals rank where you decay" },
    { label: "Backlink gap", value: "−1,100 referring domains", note: "Behind enterprise leaders" },
    { label: "Indexed-page share", value: "61% indexed", note: "vs. 88% for the leader" },
  ],
  Migration: [
    { label: "At-risk ranking URLs", value: "1,240 URLs", note: "Need a mapped redirect" },
    { label: "Equity concentration", value: "Top 5% of URLs = 60% of traffic", note: "Protect these first" },
    { label: "Redirect coverage", value: "40% mapped", note: "Target 100% before cutover" },
    { label: "Parity gaps on staging", value: "Metadata · Schema · Canonicals", note: "Resolve before launch" },
  ],
  "AI Search": [
    { label: "AI answers won by rivals", value: "ChatGPT · Perplexity · AI Overview", note: "You appear in 0 of 3" },
    { label: "Entity coverage gap", value: "Weak knowledge-graph presence", note: "Rivals are well-modeled" },
    { label: "Schema coverage", value: "Thin", note: "vs. comprehensive for leaders" },
    { label: "AI answer coverage", value: "8% of prompts", note: "vs. 44% for the leader" },
  ],
};
