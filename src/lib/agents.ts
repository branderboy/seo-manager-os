// ──────────────────────────────────────────────────────────────────────────
// SEO Manager OS — Agent fleet
//
// An Orchestrator agent controls the run; eight specialist agents do the work and
// report back. They map onto the pipeline:
//   Intake → Research → Audit → Diagnosis → Strategy → Prioritized Opportunities
//   → Execution → Reporting
//
// `effectiveness` = real ROI for the agency. `shine` = demo "wow" / shiny-object pull.
// No agent auto-publishes — every output is a draft, plan, or recommendation.
// ──────────────────────────────────────────────────────────────────────────

import {
  Telescope,
  ClipboardList,
  Wrench,
  FileText,
  MapPin,
  Bot,
  Gauge,
  Rocket,
  Network,
  type LucideIcon,
} from "lucide-react";

export type AgentImpact = "High" | "Medium" | "Low";
export type AgentCadence = "On demand" | "Daily" | "Weekly" | "Monthly";

export type Agent = {
  id: string;
  name: string;
  /** What it does, in one line. */
  role: string;
  /** The pipeline step it owns. */
  stage: string;
  /** Route in the app this agent feeds. */
  href: string;
  inputs: string[];
  output: string;
  effectiveness: AgentImpact;
  shine: AgentImpact;
  cadence: AgentCadence;
  /** Deployed by default in the demo. */
  active: boolean;
  icon: LucideIcon;
};

/** The control agent — runs the workflow and delegates to the specialists. */
export const orchestrator = {
  id: "orchestrator",
  name: "Orchestrator",
  role: "Runs the engagement end-to-end: sequences the specialists, passes each one's output to the next, and assembles the result.",
  manages: 8,
  icon: Network,
};

export const agents: Agent[] = [
  {
    id: "intake",
    name: "Intake Agent",
    role: "Interviews the client and classifies the engagement: Local, SaaS, Enterprise, or AEO/GEO.",
    stage: "Client Interview",
    href: "/discovery",
    inputs: ["Intake answers", "Website", "Goals"],
    output: "Engagement profile + SEO-type classification",
    effectiveness: "High",
    shine: "Medium",
    cadence: "On demand",
    active: true,
    icon: ClipboardList,
  },
  {
    id: "research",
    name: "Research Agent",
    role: "Pulls market, competitors, keywords, SERP, GBP, content gaps and search intent.",
    stage: "Research",
    href: "/research",
    inputs: ["Engagement profile", "GSC", "GBP", "SERP", "Competitors"],
    output: "Research pack: keywords, competitor set, intent map, gaps",
    effectiveness: "High",
    shine: "Medium",
    cadence: "Weekly",
    active: true,
    icon: Telescope,
  },
  {
    id: "technical",
    name: "Technical SEO Agent",
    role: "Checks crawl, indexation, speed, schema, canonicals, redirects, sitemap, robots and internal links.",
    stage: "Audit",
    href: "/diagnosis",
    inputs: ["Site crawl", "Search Console", "Sitemap/robots"],
    output: "Technical audit with prioritized fixes",
    effectiveness: "High",
    shine: "Low",
    cadence: "Monthly",
    active: true,
    icon: Wrench,
  },
  {
    id: "content",
    name: "Content Strategy Agent",
    role: "Builds the page plan: service pages, location pages, blog clusters, landing and comparison pages.",
    stage: "Strategy",
    href: "/strategy",
    inputs: ["Research pack", "Content gaps", "Intent map"],
    output: "Page plan + content briefs",
    effectiveness: "High",
    shine: "Medium",
    cadence: "Monthly",
    active: true,
    icon: FileText,
  },
  {
    id: "local",
    name: "Local SEO Agent",
    role: "Handles GBP, reviews, categories, service areas, local pages, citations and proximity/radius issues.",
    stage: "Strategy",
    href: "/dashboards/local",
    inputs: ["GBP", "Reviews", "Geo-grid", "Citations"],
    output: "Local action plan (GBP, reviews, citations, service-area pages)",
    effectiveness: "High",
    shine: "Medium",
    cadence: "Weekly",
    active: true,
    icon: MapPin,
  },
  {
    id: "aeo",
    name: "AEO/GEO Agent",
    role: "Optimizes for AI answers: entity clarity, FAQs, schema, summaries, source-style content and brand mentions.",
    stage: "Strategy",
    href: "/tracker",
    inputs: ["Entity signals", "Tracked AI prompts", "FAQ/schema coverage"],
    output: "AI-answer optimization plan + tracked-prompt set",
    effectiveness: "Medium",
    shine: "High",
    cadence: "Weekly",
    active: false,
    icon: Bot,
  },
  {
    id: "scoring",
    name: "Opportunity Scoring Agent",
    role: "Turns findings into ranked priorities using results, opportunity and difficulty (src/lib/scoring.ts).",
    stage: "Prioritized Opportunities",
    href: "/diagnosis",
    inputs: ["Audit findings", "Demand + rank gaps", "Competitor difficulty"],
    output: "Priority-ranked opportunity list with traceable scores",
    effectiveness: "High",
    shine: "High",
    cadence: "On demand",
    active: true,
    icon: Gauge,
  },
  {
    id: "execution",
    name: "Execution Agent",
    role: "Produces the deliverables: briefs, page copy, schema, internal-link plan, fixes, tasks and reports.",
    stage: "Execution",
    href: "/tasks",
    inputs: ["Page plan", "Priority list", "Technical fixes"],
    output: "Drafts: briefs, copy, schema, link plan, tasks, reports (never auto-published)",
    effectiveness: "High",
    shine: "Medium",
    cadence: "On demand",
    active: true,
    icon: Rocket,
  },
];

/** The clean run order the Orchestrator follows. */
export const workflow = [
  "Client Interview",
  "Research",
  "Audit",
  "Diagnosis",
  "Strategy",
  "Prioritized Opportunities",
  "Execution",
  "Reporting",
];

/** Which agents deploy from each pipeline stage (by route slug). */
export const stageAgents: Record<string, string[]> = {
  discovery: ["intake"],
  research: ["research"],
  intent: ["research"],
  competitors: ["research"],
  diagnosis: ["technical", "scoring"],
  tools: ["content", "local", "aeo"],
  strategy: ["content"],
  tasks: ["execution"],
  reports: ["execution"],
};
