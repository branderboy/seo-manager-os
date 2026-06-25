// ──────────────────────────────────────────────────────────────────────────
// SEO Manager OS — AI Workforce
//
// An Orchestrator coordinates the run; fifteen specialists do the work and
// report back. They map onto the pipeline:
//   Client Interview → Research → Audit → Diagnosis → Strategy
//   → Prioritized Opportunities → Execution → Reporting
//
// `effectiveness` = real ROI for the agency. `shine` = demo "wow" / shiny-object
// pull. No agent auto-publishes — every output is a draft, plan, or recommendation.
// ──────────────────────────────────────────────────────────────────────────

import {
  ClipboardList,
  Telescope,
  Wrench,
  Target,
  Radar,
  Stethoscope,
  FileText,
  BookOpen,
  PenLine,
  MapPin,
  Code2,
  Link2,
  ShieldCheck,
  BarChart3,
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
  manages: 15,
  icon: Network,
};

export const agents: Agent[] = [
  {
    id: "discovery",
    name: "Discovery Specialist",
    role: "Interviews the client and classifies the engagement by SEO type and goals.",
    stage: "Client Interview",
    href: "/discovery",
    inputs: ["Intake answers", "Website", "Goals"],
    output: "Client profile, discovery summary, project goals",
    effectiveness: "High",
    shine: "Medium",
    cadence: "On demand",
    active: true,
    icon: ClipboardList,
  },
  {
    id: "research",
    name: "Research Analyst",
    role: "Pulls market, keywords, SERP, GBP and content gaps.",
    stage: "Research",
    href: "/research",
    inputs: ["Engagement profile", "GSC", "SERP", "GBP"],
    output: "Research pack: keywords, gaps, demand",
    effectiveness: "High",
    shine: "Medium",
    cadence: "Weekly",
    active: true,
    icon: Telescope,
  },
  {
    id: "technical-auditor",
    name: "Technical Auditor",
    role: "Checks crawl, indexation, speed, schema, canonicals, redirects and links.",
    stage: "Audit",
    href: "/diagnosis",
    inputs: ["Site crawl", "Search Console", "Lighthouse"],
    output: "Technical audit with prioritized fixes",
    effectiveness: "High",
    shine: "Low",
    cadence: "Monthly",
    active: true,
    icon: Wrench,
  },
  {
    id: "intent",
    name: "Intent Mapper",
    role: "Clusters keywords by intent and maps them to existing pages.",
    stage: "Research",
    href: "/intent",
    inputs: ["Keyword set", "Current pages"],
    output: "Intent map (TOF/MOF/BOF) + content gaps",
    effectiveness: "Medium",
    shine: "Medium",
    cadence: "Weekly",
    active: true,
    icon: Target,
  },
  {
    id: "competitive",
    name: "Competitive Analyst",
    role: "Benchmarks competitors across content, authority, links and SERP ownership.",
    stage: "Competitive Insights",
    href: "/competitors",
    inputs: ["Competitor set", "SERP", "Backlinks"],
    output: "Competitive opportunities",
    effectiveness: "Medium",
    shine: "Medium",
    cadence: "Monthly",
    active: true,
    icon: Radar,
  },
  {
    id: "diagnosis",
    name: "Diagnosis Specialist",
    role: "Resolves findings to ranked root causes — what to fix first.",
    stage: "Diagnosis",
    href: "/diagnosis",
    inputs: ["Audit", "Research pack", "Competitive opportunities"],
    output: "Prioritized root causes with confidence + impact",
    effectiveness: "High",
    shine: "High",
    cadence: "On demand",
    active: true,
    icon: Stethoscope,
  },
  {
    id: "strategy",
    name: "Strategy Planner",
    role: "Turns the diagnosis into a sequenced strategy and roadmap.",
    stage: "Strategy",
    href: "/strategy",
    inputs: ["Diagnosis", "Goals", "Constraints"],
    output: "Strategy + priority roadmap",
    effectiveness: "High",
    shine: "Medium",
    cadence: "Monthly",
    active: true,
    icon: FileText,
  },
  {
    id: "playbook",
    name: "Playbook Builder",
    role: "Assembles the execution playbooks for this client type and auto-creates tasks.",
    stage: "Playbooks",
    href: "/tools",
    inputs: ["Strategy", "Client type"],
    output: "Execution playbooks → tasks",
    effectiveness: "High",
    shine: "Medium",
    cadence: "Monthly",
    active: true,
    icon: BookOpen,
  },
  {
    id: "brief",
    name: "Project Brief Generator",
    role: "Compiles objectives, deliverables, timeline, KPIs and team into the brief.",
    stage: "Project Brief",
    href: "/strategy",
    inputs: ["Strategy", "Playbooks", "Team"],
    output: "Executive project brief",
    effectiveness: "Medium",
    shine: "Medium",
    cadence: "Monthly",
    active: true,
    icon: PenLine,
  },
  {
    id: "content",
    name: "Content Strategist",
    role: "Plans pages and writes briefs: service, location, blog, landing, comparison.",
    stage: "Strategy",
    href: "/tools",
    inputs: ["Intent map", "Content gaps"],
    output: "Page plan + content briefs",
    effectiveness: "High",
    shine: "Medium",
    cadence: "Monthly",
    active: true,
    icon: FileText,
  },
  {
    id: "local",
    name: "Local SEO Specialist",
    role: "Handles GBP, reviews, categories, service areas, citations and proximity.",
    stage: "Playbooks",
    href: "/tools",
    inputs: ["GBP", "Reviews", "Citations"],
    output: "Local action plan",
    effectiveness: "High",
    shine: "Medium",
    cadence: "Weekly",
    active: true,
    icon: MapPin,
  },
  {
    id: "schema",
    name: "Schema Engineer",
    role: "Designs and validates structured data for rich results and AI answers.",
    stage: "Playbooks",
    href: "/tools",
    inputs: ["Page templates", "Entity model"],
    output: "Schema specs + validation",
    effectiveness: "Medium",
    shine: "Medium",
    cadence: "Monthly",
    active: false,
    icon: Code2,
  },
  {
    id: "internal-linking",
    name: "Internal Linking Specialist",
    role: "Builds the internal-link plan across service, location and money pages.",
    stage: "Playbooks",
    href: "/tools",
    inputs: ["Site structure", "Priority pages"],
    output: "Internal-link plan",
    effectiveness: "Medium",
    shine: "Low",
    cadence: "Monthly",
    active: false,
    icon: Link2,
  },
  {
    id: "qa",
    name: "QA Inspector",
    role: "Verifies work before and after deploy — re-crawl, schema, links, CWV.",
    stage: "Execution",
    href: "/tasks",
    inputs: ["Deployed changes", "Crawl", "Lighthouse"],
    output: "QA + deployment verification report",
    effectiveness: "High",
    shine: "Medium",
    cadence: "On demand",
    active: true,
    icon: ShieldCheck,
  },
  {
    id: "reporting",
    name: "Reporting Specialist",
    role: "Assembles the manager report: work done, blockers, ROI, executive summary.",
    stage: "Reporting",
    href: "/reports",
    inputs: ["Completed work", "Traffic", "Hours"],
    output: "Manager report + executive summary",
    effectiveness: "High",
    shine: "Medium",
    cadence: "Monthly",
    active: true,
    icon: BarChart3,
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
  discovery: ["discovery"],
  research: ["research"],
  intent: ["intent"],
  competitors: ["competitive"],
  diagnosis: ["technical-auditor", "diagnosis"],
  tools: ["playbook", "content", "local", "schema", "internal-linking"],
  strategy: ["strategy", "brief"],
  tasks: ["qa"],
  reports: ["reporting"],
};
