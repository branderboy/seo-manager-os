// ──────────────────────────────────────────────────────────────────────────
// AI Workforce — operational state for the specialist roster.
// Treats each agent like an employee: status, current task, queue, throughput,
// performance, availability. Metrics are derived *deterministically* from the
// agent id so server and client render identically (no hydration drift).
// ──────────────────────────────────────────────────────────────────────────

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
  discovery: { task: "Intake summary + goal mapping", client: "Hill Country Plumbing" },
  research: { task: "Keyword + SERP demand pull", client: "Summit Roofing" },
  "technical-auditor": { task: "Crawl + Core Web Vitals audit", client: "Beacon Dental" },
  intent: { task: "Intent clustering (TOF/MOF/BOF)", client: "Northwind HVAC" },
  competitive: { task: "SERP gap + share-of-voice analysis", client: "Summit Roofing" },
  diagnosis: { task: "Root-cause ranking", client: "Northwind HVAC" },
  strategy: { task: "Q3 strategy + roadmap", client: "Lakeside Spa" },
  content: { task: "6 location-page content briefs", client: "Northwind HVAC" },
  local: { task: "GBP categories + citation build", client: "Lakeside Spa" },
  qa: { task: "Post-deploy verification", client: "Beacon Dental" },
  reporting: { task: "Monthly manager report", client: "Lakeside Spa" },
};

const RECENT: Record<string, string[]> = {
  discovery: ["Discovery — Trailhead Outfitters", "Goal map — Beacon Dental"],
  research: ["Keyword pack — Lakeside Spa", "SERP pull — Northwind HVAC"],
  "technical-auditor": ["Schema audit — Summit Roofing", "Redirect map — Trailhead"],
  intent: ["Intent map — Beacon Dental", "Page match — Summit Roofing"],
  competitive: ["Backlink gap — Northwind HVAC", "AI-answer coverage — Beacon"],
  diagnosis: ["Root causes — Beacon Dental", "Confidence pass — Summit Roofing"],
  strategy: ["Roadmap — Northwind HVAC", "Priority sort — Beacon Dental"],
  content: ["3 service briefs — Summit Roofing", "Comparison page — Beacon"],
  local: ["Review responses — Northwind HVAC", "Citations — Hill Country"],
  qa: ["Deploy check — Trailhead", "CWV re-test — Beacon Dental"],
  reporting: ["Exec summary — Summit Roofing", "ROI model — Northwind HVAC"],
  schema: ["FAQ schema — Northwind HVAC", "Product schema — Beacon"],
  "internal-linking": ["Link plan — Summit Roofing", "Silo map — Beacon Dental"],
  brief: ["Project brief — Northwind HVAC", "KPI sheet — Lakeside Spa"],
  playbook: ["Local playbook — Lakeside Spa", "Tasks generated — Beacon"],
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
