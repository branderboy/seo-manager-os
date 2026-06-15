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
  blurb: string;
  icon: LucideIcon;
};

/** The 8-stage operating flow: Interview → Research → … → Measurement. */
export const STAGES: Stage[] = [
  {
    n: 1,
    slug: "discovery",
    name: "Discovery Interview",
    short: "Discovery",
    blurb: "Consultant-style intake to understand the business before any audit.",
    icon: ClipboardList,
  },
  {
    n: 2,
    slug: "research",
    name: "Research Engine",
    short: "Research",
    blurb: "Auto-generate the research plan for the detected SEO model.",
    icon: Telescope,
  },
  {
    n: 3,
    slug: "investigation",
    name: "Investigation",
    short: "Investigation",
    blurb: "Run the audits that surface evidence behind the symptoms.",
    icon: Microscope,
  },
  {
    n: 4,
    slug: "diagnosis",
    name: "Diagnosis Engine",
    short: "Diagnosis",
    blurb: "Root-cause analysis with confidence and impact — not a generic audit.",
    icon: Stethoscope,
  },
  {
    n: 5,
    slug: "strategy",
    name: "Strategy Brief",
    short: "Strategy",
    blurb: "An executive-ready strategy document generated from the diagnosis.",
    icon: FileText,
  },
  {
    n: 6,
    slug: "execution",
    name: "Execution Planner",
    short: "Execution",
    blurb: "30 / 90 / 180-day plans with priority, impact, effort and owners.",
    icon: CalendarRange,
  },
  {
    n: 7,
    slug: "tools",
    name: "Execution Tools",
    short: "Tools",
    blurb: "Purpose-built planners for local, SaaS and enterprise execution.",
    icon: Wrench,
  },
  {
    n: 8,
    slug: "measurement",
    name: "Measurement",
    short: "Measurement",
    blurb: "Track visibility, authority, trust, AI visibility, lead and revenue scores.",
    icon: Gauge,
  },
  {
    n: 9,
    slug: "tasks",
    name: "Daily Task Engine",
    short: "Daily Tasks",
    blurb: "Today's worklist with email alerts that keep owners on task and on time.",
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
