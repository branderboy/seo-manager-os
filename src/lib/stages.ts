import {
  ClipboardList,
  Target,
  Telescope,
  Radar,
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
  /** The concrete artifacts this stage produces · they become the next stage's inputs. */
  outputs: string[];
  /** Integration ids (see lib/integrations) this stage uses to generate its data/plans/insights. */
  apps: string[];
  icon: LucideIcon;
};

/**
 * The 9-stage operating flow. Each stage consumes the prior stage's outputs and
 * produces its own · Discovery → Research → Investigation → Diagnosis → Strategy
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
    apps: ["gcal", "hubspot"],
    icon: ClipboardList,
  },
  {
    n: 2,
    slug: "research",
    name: "Data Collection",
    short: "Data",
    does: "Sync the client's own data.",
    blurb: "Connect the client's internal data sources · Search Console, Analytics, GBP and the site crawl.",
    outputs: ["Search Console", "Analytics", "Google Business Profile", "Website crawl", "Rankings", "CRM"],
    apps: ["gsc", "ga4", "gbp", "screamingfrog"],
    icon: Telescope,
  },
  {
    n: 3,
    slug: "intent",
    name: "Intent Mapping",
    short: "Intent",
    does: "Nail down intent, aligned to goals.",
    blurb: "Map search intent across the funnel (TOF / MOF / BOF) and align it to the business goals before diagnosing.",
    outputs: ["Browsing intent", "Comparing intent", "Ready-to-buy intent", "Goal alignment"],
    apps: ["semrush", "gsc", "gtrends"],
    icon: Target,
  },
  {
    n: 4,
    slug: "competitors",
    name: "Competitive Insights",
    short: "Competitors",
    does: "Size up rivals and the SERP.",
    blurb: "Benchmark the competitors and read the search landscape · who's ranking, what's winning the SERP and AI answers, and where the open lanes are · before diagnosing your own gaps.",
    outputs: ["Competitor set", "Share of search", "Search result features", "Content gaps vs rivals", "Backlink gaps", "AI answer coverage"],
    apps: ["semrush", "ahrefs", "localfalcon"],
    icon: Radar,
  },
  {
    n: 5,
    slug: "diagnosis",
    name: "Diagnosis",
    short: "Diagnosis",
    does: "Find the gaps and root causes.",
    blurb: "Surface the gaps (content, technical, GEO, AEO, authority) and resolve every symptom to a ranked root cause with confidence and impact.",
    outputs: ["Content Gaps", "Technical Gaps", "GEO Gaps", "AEO Gaps", "Authority Gaps", "Root Causes"],
    apps: ["screamingfrog", "gsc", "ahrefs"],
    icon: Stethoscope,
  },
  {
    n: 6,
    slug: "tools",
    name: "Playbooks",
    short: "Playbooks",
    does: "Plan and run the work.",
    blurb: "The action center · outcome playbooks (Traffic, CTR, Leads, Revenue, Local, GEO, AEO) that turn the diagnosis into sequenced, owned work.",
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
    apps: ["trello", "semrush"],
    icon: Wrench,
  },
  {
    n: 7,
    slug: "strategy",
    name: "Project Brief",
    short: "Project Brief",
    does: "Compile the plan for sign-off.",
    blurb: "An executive-ready brief generated from the diagnosis and selected playbooks.",
    outputs: ["SEO Strategy", "GEO Strategy", "AEO Strategy", "Priority Roadmap"],
    apps: ["gdocs", "slack"],
    icon: FileText,
  },
  {
    n: 8,
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
    apps: ["gcal", "slack", "trello"],
    icon: BellRing,
  },
  {
    n: 9,
    slug: "reports",
    name: "Reports",
    short: "Reports",
    does: "Track results against goal.",
    blurb: "Track rankings, traffic, leads, calls, AI visibility and revenue against the goals set in Discovery.",
    outputs: ["Rankings", "Traffic", "Leads", "Calls", "AI Visibility", "Revenue Impact", "Performance Reports"],
    apps: ["looker", "ga4", "slack"],
    icon: Gauge,
  },
];

// Client dashboards, one per SEO model.
export const DASHBOARDS = [
  { slug: "local", name: "Local SEO", model: "Local" },
  { slug: "saas", name: "SaaS SEO", model: "SaaS" },
  { slug: "enterprise", name: "Enterprise SEO", model: "Enterprise" },
] as const;

export function stageHref(slug: string) {
  return `/${slug}`;
}
