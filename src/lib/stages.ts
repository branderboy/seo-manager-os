import {
  ClipboardList,
  Telescope,
  Microscope,
  Stethoscope,
  FileText,
  CalendarRange,
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
 * → Execution Planner → Execution Tools → Measurement → Daily Tasks.
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
    name: "Diagnosis Engine",
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
    name: "Strategy Brief",
    short: "Strategy",
    does: "Create the game plan.",
    blurb: "An executive-ready strategy document generated from the diagnosis.",
    outputs: ["SEO Strategy", "GEO Strategy", "AEO Strategy", "Priority Roadmap"],
    icon: FileText,
  },
  {
    n: 6,
    slug: "execution",
    name: "Execution Planner",
    short: "Execution",
    does: "Break strategy into projects.",
    blurb: "30 / 90 / 180-day plans with priority, impact, effort and owners.",
    outputs: ["Tasks", "Owners", "Due Dates", "Dependencies"],
    icon: CalendarRange,
  },
  {
    n: 7,
    slug: "tools",
    name: "Execution Playbooks",
    short: "Playbooks",
    does: "Do the work.",
    blurb: "Model-specific playbooks that turn each recommendation into ready-to-run, structured work.",
    outputs: [
      "Content Generator",
      "Schema Generator",
      "Internal Link Builder",
      "GEO Optimizer",
      "AEO Optimizer",
      "GBP Optimizer",
    ],
    icon: Wrench,
  },
  {
    n: 8,
    slug: "measurement",
    name: "Measurement",
    short: "Measurement",
    does: "Measure impact.",
    blurb: "Track visibility, authority, trust, AI visibility, lead and revenue scores.",
    outputs: ["Rankings", "Traffic", "Leads", "Calls", "AI Visibility", "Revenue Impact"],
    icon: Gauge,
  },
  {
    n: 9,
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
];

export const DASHBOARDS = [
  { slug: "local", name: "Local SEO", model: "Local" },
  { slug: "saas", name: "SaaS SEO", model: "SaaS" },
  { slug: "enterprise", name: "Enterprise SEO", model: "Enterprise" },
] as const;

export function stageHref(slug: string) {
  return `/${slug}`;
}
