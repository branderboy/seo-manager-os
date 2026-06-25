// ──────────────────────────────────────────────────────────────────────────
// Deployment Verification — after every deploy, auto-verify the change and
// close the task only when it passes. Closes the execution loop.
// ──────────────────────────────────────────────────────────────────────────

export type CheckStatus = "pass" | "fail" | "pending";

export const CHECK_LABELS = [
  "Re-crawl",
  "Indexation",
  "Schema",
  "Internal links",
  "Core Web Vitals",
  "Redirects",
  "Canonical",
  "Robots",
  "Screenshots",
  "Validation",
] as const;
export type CheckLabel = (typeof CHECK_LABELS)[number];

export type DeployStatus = "Queued" | "Verifying" | "Verified" | "Failed";

export type Deployment = {
  id: string;
  item: string;
  client: string;
  when: string;
  status: DeployStatus;
  checks: Record<CheckLabel, CheckStatus>;
  autoClosed: boolean;
};

function checks(overrides: Partial<Record<CheckLabel, CheckStatus>>, base: CheckStatus): Record<CheckLabel, CheckStatus> {
  const out = {} as Record<CheckLabel, CheckStatus>;
  for (const label of CHECK_LABELS) out[label] = overrides[label] ?? base;
  return out;
}

export const deployments: Deployment[] = [
  {
    id: "d1",
    item: "Title-tag fixes · 12 pages",
    client: "Beacon Dental",
    when: "10 min ago",
    status: "Verified",
    checks: checks({}, "pass"),
    autoClosed: true,
  },
  {
    id: "d2",
    item: "FAQ schema · 8 service pages",
    client: "Northwind HVAC",
    when: "1 hour ago",
    status: "Verifying",
    checks: checks(
      { Indexation: "pending", "Core Web Vitals": "pending", Screenshots: "pending" },
      "pass"
    ),
    autoClosed: false,
  },
  {
    id: "d3",
    item: "Redirect map · migration batch 2",
    client: "Trailhead Outfitters",
    when: "Today, 8:00 AM",
    status: "Failed",
    checks: checks({ Redirects: "fail", Canonical: "fail", Indexation: "pending", Screenshots: "pending" }, "pass"),
    autoClosed: false,
  },
  {
    id: "d4",
    item: "Internal-link pass · money pages",
    client: "Summit Roofing",
    when: "Queued",
    status: "Queued",
    checks: checks({}, "pending"),
    autoClosed: false,
  },
];

export function passCount(d: Deployment): number {
  return CHECK_LABELS.filter((l) => d.checks[l] === "pass").length;
}

export const deploySummary = {
  total: deployments.length,
  verified: deployments.filter((d) => d.status === "Verified").length,
  failed: deployments.filter((d) => d.status === "Failed").length,
  verifying: deployments.filter((d) => d.status === "Verifying").length,
};
