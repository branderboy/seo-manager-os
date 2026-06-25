// ──────────────────────────────────────────────────────────────────────────
// SEO Manager OS — Command Center (operations homepage) mock data.
// Answers one question: "What does the SEO Manager need to do today?"
// ──────────────────────────────────────────────────────────────────────────

export type Severity = "high" | "medium" | "low";
export type WaitingOn = "Client" | "Developer" | "Content" | "Google";

export const morningBrief = {
  greeting: "Good morning, Kawani",
  date: "Wednesday, June 25",
  line: "9 tasks due today across 6 clients. 3 are blocked, 2 need client sign-off, and 4 AI jobs are running. Northwind and Beacon Dental need your attention first.",
};

export type OpsStat = {
  key: string;
  label: string;
  value: number;
  sub: string;
  tone: "default" | "accent" | "warn" | "bad";
};

export const opsStats: OpsStat[] = [
  { key: "tasks", label: "Tasks today", value: 9, sub: "3 high priority", tone: "default" },
  { key: "blockers", label: "Blockers", value: 3, sub: "2 waiting on client", tone: "bad" },
  { key: "approvals", label: "Pending approvals", value: 2, sub: "client sign-off", tone: "warn" },
  { key: "aijobs", label: "AI jobs running", value: 4, sub: "2 finishing soon", tone: "accent" },
];

export type PriorityTask = {
  name: string;
  client: string;
  owner: string;
  due: string;
  priority: Severity;
};

export const priorityTasks: PriorityTask[] = [
  { name: "Approve 6 location-page briefs", client: "Northwind HVAC", owner: "You", due: "10:00 AM", priority: "high" },
  { name: "Ship title-tag fixes to dev (12 pages)", client: "Beacon Dental", owner: "Priya", due: "11:30 AM", priority: "high" },
  { name: "Review competitor gap analysis", client: "Summit Roofing", owner: "You", due: "1:00 PM", priority: "high" },
  { name: "Publish 'AC Repair Austin' service page", client: "Northwind HVAC", owner: "Jordan", due: "2:00 PM", priority: "medium" },
  { name: "Send monthly report draft for sign-off", client: "Lakeside Spa", owner: "You", due: "4:00 PM", priority: "medium" },
];

export type ClientAttention = {
  client: string;
  reason: string;
  severity: Severity;
};

export const clientsNeedingAttention: ClientAttention[] = [
  { client: "Northwind HVAC", reason: "Traffic down 14% WoW — diagnosis flagged review velocity", severity: "high" },
  { client: "Beacon Dental", reason: "Deployment waiting on developer for 3 days", severity: "high" },
  { client: "Summit Roofing", reason: "Content brief approved — work unassigned", severity: "medium" },
  { client: "Lakeside Spa", reason: "Monthly report due to client tomorrow", severity: "low" },
];

export type Blocker = {
  task: string;
  client: string;
  waitingOn: WaitingOn;
  age: string;
};

export const blockers: Blocker[] = [
  { task: "Publish 6 location pages", client: "Northwind HVAC", waitingOn: "Client", age: "2 days" },
  { task: "Deploy schema markup", client: "Beacon Dental", waitingOn: "Developer", age: "3 days" },
  { task: "Index new collection pages", client: "Trailhead Outfitters", waitingOn: "Google", age: "5 days" },
];

export type Approval = { item: string; client: string; since: string };

export const approvals: Approval[] = [
  { item: "6 location-page content briefs", client: "Northwind HVAC", since: "Yesterday" },
  { item: "Homepage meta + H1 changes", client: "Summit Roofing", since: "2 days ago" },
];

export type Deployment = {
  item: string;
  client: string;
  status: "Queued" | "Deploying" | "Verifying" | "Live";
  when: string;
};

export const deployments: Deployment[] = [
  { item: "Title-tag fixes · 12 pages", client: "Beacon Dental", status: "Verifying", when: "10 min ago" },
  { item: "Redirect map · migration batch 2", client: "Trailhead Outfitters", status: "Queued", when: "Today" },
  { item: "FAQ schema · 8 pages", client: "Northwind HVAC", status: "Live", when: "Yesterday" },
];

export type Opportunity = {
  title: string;
  client: string;
  score: number; // priority score (see lib/scoring)
};

export const opportunities: Opportunity[] = [
  { title: "Rank top-3 for 'ac repair austin' (now #6)", client: "Northwind HVAC", score: 72 },
  { title: "Build 'invisalign cost' comparison page", client: "Beacon Dental", score: 64 },
  { title: "Capture 'metal roof vs shingle' featured snippet", client: "Summit Roofing", score: 58 },
];

export type Win = { text: string; client: string; when: string };

export const wins: Win[] = [
  { text: "Google indexed 12 new pages", client: "Trailhead Outfitters", when: "6:10 AM" },
  { text: "Moved to #2 for 'emergency plumber'", client: "Summit Roofing", when: "Overnight" },
  { text: "Core Web Vitals passed on 9 templates", client: "Beacon Dental", when: "Yesterday" },
  { text: "Client approved 6 content briefs", client: "Lakeside Spa", when: "Yesterday" },
  { text: "Schema validated on all service pages", client: "Northwind HVAC", when: "Yesterday" },
];

export type AiJob = {
  agent: string;
  client: string;
  status: "Running" | "Finishing" | "Queued";
  eta: string;
};

export const aiJobs: AiJob[] = [
  { agent: "Technical Auditor", client: "Beacon Dental", status: "Running", eta: "~8 min" },
  { agent: "Competitive Analyst", client: "Summit Roofing", status: "Finishing", eta: "~2 min" },
  { agent: "Content Strategist", client: "Northwind HVAC", status: "Running", eta: "~15 min" },
  { agent: "Reporting Specialist", client: "Lakeside Spa", status: "Queued", eta: "next" },
];
