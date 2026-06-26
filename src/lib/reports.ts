// ──────────────────────────────────────────────────────────────────────────
// Reports v2 — manager reporting, not ranking charts.
// Answers: what got done, what's blocked, what's the ROI?
// ──────────────────────────────────────────────────────────────────────────

export const reportPeriod = "Last 30 days · June 2026";

export const reportSummary = {
  executiveSummary:
    "Across the portfolio, 28 tasks shipped and 11 deployments were verified this month. Northwind's review engine launched and recovered two outer ZIPs; Beacon passed Core Web Vitals on 9 templates. Three items are blocked — two waiting on clients — and two await sign-off. Estimated ROI on delivered work is 4.2×.",
  stats: [
    { label: "Work completed", value: "28", sub: "tasks shipped" },
    { label: "Hours spent", value: "96", sub: "across the team" },
    { label: "Deployments", value: "11", sub: "verified" },
    { label: "Est. ROI", value: "4.2×", sub: "on delivered work" },
  ],
};

export const completedWork = [
  { title: "Launched review-request automation", client: "Northwind Heating & Air", when: "Jun 22" },
  { title: "Shipped title-tag fixes · 12 pages", client: "Hill Country Dental", when: "Jun 21" },
  { title: "Passed Core Web Vitals · 9 templates", client: "Hill Country Dental", when: "Jun 20" },
  { title: "Published 2 service pages", client: "Northwind Heating & Air", when: "Jun 19" },
  { title: "Validated schema on service pages", client: "Northwind Heating & Air", when: "Jun 18" },
  { title: "Migrated redirect batch 1 · 0 broken", client: "Acme Corp", when: "Jun 16" },
];

export const trafficChanges = [
  { client: "Hill Country Dental", delta: 18, dir: "up" as const },
  { client: "Vantage Retail", delta: 11, dir: "up" as const },
  { client: "Acme Corp", delta: 9, dir: "up" as const },
  { client: "Northwind Heating & Air", delta: -6, dir: "down" as const },
];

export const aiWorkCompleted = [
  { agent: "Technical Auditor", client: "Hill Country Dental", result: "Audited 1,930 URLs · 42 fixes proposed", when: "Jun 20" },
  { agent: "Content Strategist", client: "Northwind Heating & Air", result: "6 location-page briefs drafted", when: "Jun 21" },
  { agent: "Competitive Analyst", client: "Vantage Retail", result: "Gap analysis · 14 opportunities", when: "Jun 23" },
  { agent: "Reporting Specialist", client: "Flowdesk", result: "Monthly report assembled", when: "Jun 24" },
];
