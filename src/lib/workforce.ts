// ──────────────────────────────────────────────────────────────────────────
// AI Workforce — operational state for the specialist roster.
// Treats each agent like an employee: status, current task, queue, throughput,
// performance, availability. Metrics are derived *deterministically* from the
// agent id so server and client render identically (no hydration drift).
// ──────────────────────────────────────────────────────────────────────────

import { agents } from "./agents";

export type WorkerStatus = "Working" | "Idle" | "Queued" | "Offline";

export type WorkerState = {
  status: WorkerStatus;
  currentTask: string | null;
  client: string | null;
  queue: number;
  completed: number; // jobs completed this month
  performance: number; // QA pass rate, %
  availability: string;
  recentWork: string[];
};

// What each specialist is actively working on (when deployed).
const CURRENT: Record<string, { task: string; client: string }> = {
  discovery: { task: "Intake summary + goal mapping", client: "Northwind Heating & Air" },
  research: { task: "Keyword + SERP demand pull", client: "Vantage Retail" },
  "technical-auditor": { task: "Crawl + Core Web Vitals audit", client: "Hill Country Dental" },
  intent: { task: "Intent clustering (TOF/MOF/BOF)", client: "Northwind Heating & Air" },
  competitive: { task: "SERP gap + share-of-voice analysis", client: "Vantage Retail" },
  diagnosis: { task: "Root-cause ranking", client: "Northwind Heating & Air" },
  strategy: { task: "Q3 strategy + roadmap", client: "Flowdesk" },
  playbook: { task: "Local playbook + task generation", client: "Hill Country Dental" },
  brief: { task: "Executive project-brief assembly", client: "Acme Corp" },
  content: { task: "6 location-page content briefs", client: "Northwind Heating & Air" },
  local: { task: "GBP categories + citation build", client: "Flowdesk" },
  qa: { task: "Post-deploy verification", client: "Hill Country Dental" },
  reporting: { task: "Monthly manager report", client: "Flowdesk" },
};

const RECENT: Record<string, string[]> = {
  discovery: ["Discovery — Acme Corp", "Goal map — Hill Country Dental"],
  research: ["Keyword pack — Flowdesk", "SERP pull — Northwind Heating & Air"],
  "technical-auditor": ["Schema audit — Vantage Retail", "Redirect map — Acme Corp"],
  intent: ["Intent map — Hill Country Dental", "Page match — Vantage Retail"],
  competitive: ["Backlink gap — Northwind Heating & Air", "AI-answer coverage — Hill Country Dental"],
  diagnosis: ["Root causes — Hill Country Dental", "Confidence pass — Vantage Retail"],
  strategy: ["Roadmap — Northwind Heating & Air", "Priority sort — Hill Country Dental"],
  content: ["3 service briefs — Vantage Retail", "Comparison page — Hill Country Dental"],
  local: ["Review responses — Northwind Heating & Air", "Citations — Hill Country"],
  qa: ["Deploy check — Acme Corp", "CWV re-test — Hill Country Dental"],
  reporting: ["Exec summary — Vantage Retail", "ROI model — Northwind Heating & Air"],
  schema: ["FAQ schema — Northwind Heating & Air", "Product schema — Hill Country Dental"],
  "internal-linking": ["Link plan — Vantage Retail", "Silo map — Hill Country Dental"],
  brief: ["Project brief — Northwind Heating & Air", "KPI sheet — Flowdesk"],
  playbook: ["Local playbook — Flowdesk", "Tasks generated — Hill Country Dental"],
};

// Stable hash → small integers, so derived metrics are consistent per id.
function hash(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

export function workerState(id: string, deployed: boolean): WorkerState {
  const h = hash(id);
  const recentWork = RECENT[id] ?? [];
  if (!deployed) {
    return {
      status: "Offline",
      currentTask: null,
      client: null,
      queue: 0,
      completed: 40 + (h % 60),
      performance: 90 + (h % 8),
      availability: "Not deployed",
      recentWork,
    };
  }
  const cur = CURRENT[id];
  const queued = h % 5; // 0–4
  if (cur) {
    return {
      status: "Working",
      currentTask: cur.task,
      client: cur.client,
      queue: queued,
      completed: 80 + (h % 140),
      performance: 92 + (h % 8),
      availability: queued > 0 ? `${queued} in queue` : "Available next",
      recentWork,
    };
  }
  // Deployed but nothing active right now.
  return {
    status: queued > 0 ? "Queued" : "Idle",
    currentTask: null,
    client: null,
    queue: queued,
    completed: 60 + (h % 100),
    performance: 91 + (h % 9),
    availability: queued > 0 ? `${queued} in queue` : "Available now",
    recentWork,
  };
}

// ── Single source of truth for AI-workforce counts ────────────────────────
// Every surface (Command Center, sidebar, AI Workforce page) reads from here so
// the numbers always tell one story. Default deploy state = agents marked
// `active`, which is exactly what the deploy store seeds, so the AI Workforce
// page matches these figures on load.
export const workforceSummary = (() => {
  const deployedAgents = agents.filter((a) => a.active);
  const states = deployedAgents.map((a) => workerState(a.id, true));
  const working = states.filter((s) => s.status === "Working").length;
  const jobsToday = states.reduce((n, s) => n + s.queue, 0) + 23;
  const avgPerformance = Math.round(
    states.reduce((n, s) => n + s.performance, 0) / Math.max(1, states.length)
  );
  return {
    total: agents.length,
    deployed: deployedAgents.length,
    working,
    jobsToday,
    avgPerformance,
  };
})();
