import {
  ClipboardList,
  Telescope,
  Stethoscope,
  FileText,
  Wrench,
  Gauge,
  BellRing,
  type LucideIcon,
} from "lucide-react";

export type Stage = {
  n: number;
  slug: string;
  name: string;
  short: string;
  /** One-line description of what this stage *does* in the pipeline. */
  does: string;
  blurb: string;
  /** The concrete artifacts this stage produces — they become the next stage's inputs. */
  outputs: string[];
  icon: LucideIcon;
};

/**
 * The 9-stage operating flow. Each stage consumes the prior stage's outputs and
 * produces its own — Discovery → Research → Investigation → Diagnosis → Strategy
 * → Execution Planner → Playbooks → Daily Tasks → Reports.
 */
export const STAGES: Stage[] = [
  {
    n: 1,
    slug: "discovery",
    name: "Discovery Interview",
    short: "Discovery",
    does: "Understand the business.",
    blurb: "Consultant-style intake to understand the business before any audit.",
    outputs: ["Goals", "Services", "Locations", "Competitors", "Budget", "Resources"],
    icon: ClipboardList,
  },
  {
    n: 2,
    slug: "research",
    name: "Data Collection",
    short: "Data",
    does: "Sync the client's own data.",
    blurb: "Connect the client's internal data sources — Search Console, Analytics, GBP and the site crawl.",
    outputs: ["Search Console", "Analytics", "GBP Data", "Site Crawl", "Rankings", "CRM"],
    icon: Telescope,
  },
  {
    n: 3,
    slug: "diagnosis",
    name: "Diagnosis",
    short: "Diagnosis",
    does: "Find the gaps and root causes.",
    blurb: "Surface the gaps (content, technical, GEO, AEO, authority) and resolve every symptom to a ranked root cause with confidence and impact.",
    outputs: ["Content Gaps", "Technical Gaps", "GEO Gaps", "AEO Gaps", "Authority Gaps", "Root Causes"],
    icon: Stethoscope,
  },
  {
    n: 4,
    slug: "tools",
    name: "Playbooks",
    short: "Playbooks",
    does: "Plan and run the work.",
    blurb: "The action center — outcome playbooks (Traffic, CTR, Leads, Revenue, Local, GEO, AEO) that turn the diagnosis into sequenced, owned work.",
    outputs: [
      "Traffic",
      "CTR",
      "Lead Gen",
      "Revenue",
      "Local SEO",
      "GEO",
      "AEO",
      "Recommended Actions",
    ],
    icon: Wrench,
  },
  {
    n: 5,
    slug: "strategy",
    name: "Project Brief",
    short: "Project Brief",
    does: "Compile the plan for sign-off.",
    blurb: "An executive-ready brief generated from the diagnosis and selected playbooks.",
    outputs: ["SEO Strategy", "GEO Strategy", "AEO Strategy", "Priority Roadmap"],
    icon: FileText,
  },
  {
    n: 6,
    slug: "tasks",
    name: "Daily Task Engine",
    short: "Daily Tasks",
    does: "Generate today's work.",
    blurb: "Today's worklist with email alerts that keep owners on task and on time.",
    outputs: [
      "Fix schema on 3 pages",
      "Add FAQs to 5 pages",
      "Build 10 citations",
      "Publish 2 location pages",
      "Answer 5 GBP reviews",
    ],
    icon: BellRing,
  },
  {
    n: 7,
    slug: "reports",
    name: "Reports",
    short: "Reports",
    does: "Track results against goal.",
    blurb: "Track rankings, traffic, leads, calls, AI visibility and revenue against the goals set in Discovery.",
    outputs: ["Rankings", "Traffic", "Leads", "Calls", "AI Visibility", "Revenue Impact", "Performance Reports"],
    icon: Gauge,
  },
];

export const DASHBOARDS = [
  { slug: "local", name: "Local SEO", model: "Local" },
  { slug: "saas", name: "SaaS SEO", model: "SaaS" },
  { slug: "enterprise", name: "Enterprise SEO", model: "Enterprise" },
] as const;

export function stageHref(slug: string) {
  return `/${slug}`;
}
