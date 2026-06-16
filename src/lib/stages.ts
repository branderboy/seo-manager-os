import {
  ClipboardList,
  Telescope,
  Microscope,
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
    name: "Research Engine",
    short: "Research",
    does: "Gather data.",
    blurb: "Auto-generate the research plan for the detected SEO model.",
    outputs: ["Keywords", "Competitors", "SERPs", "Entities", "Technical Data", "GBP Data"],
    icon: Telescope,
  },
  {
    n: 3,
    slug: "investigation",
    name: "Investigation",
    short: "Investigation",
    does: "Identify opportunities and issues.",
    blurb: "Run the audits that surface evidence behind the symptoms.",
    outputs: ["Content Gaps", "Technical Gaps", "GEO Gaps", "AEO Gaps", "Authority Gaps"],
    icon: Microscope,
  },
  {
    n: 4,
    slug: "diagnosis",
    name: "Diagnosis",
    short: "Diagnosis",
    does: "Determine root causes.",
    blurb: "Root-cause analysis with confidence and impact — not a generic audit.",
    outputs: [
      "Why rankings are low",
      "Why traffic is low",
      "Why AI visibility is low",
      "Why leads are low",
    ],
    icon: Stethoscope,
  },
  {
    n: 5,
    slug: "strategy",
    name: "Project Brief",
    short: "Strategy",
    does: "Create the game plan.",
    blurb: "An executive-ready strategy document generated from the diagnosis.",
    outputs: ["SEO Strategy", "GEO Strategy", "AEO Strategy", "Priority Roadmap"],
    icon: FileText,
  },
  {
    n: 6,
    slug: "tools",
    name: "Playbooks",
    short: "Playbooks",
    does: "Plan and run the work.",
    blurb: "The action center — outcome playbooks (Traffic, CTR, Leads, Revenue, Local, GEO, AEO) that turn the strategy into sequenced, owned work.",
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
    n: 7,
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
    n: 8,
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
