// ──────────────────────────────────────────────────────────────────────────
// SEO Manager OS · Command Center (operations homepage) mock data.
// Answers one question: "What does the SEO Manager need to do today?"
// ──────────────────────────────────────────────────────────────────────────

export type Severity = "high" | "medium" | "low";
export type WaitingOn = "Client" | "Developer" | "Content" | "Google";

export const morningBrief = {
  greeting: "Good morning, Kawani",
  date: "Wednesday, June 25",
  line: "9 tasks due today across 5 clients. 3 are blocked, 2 need client sign-off, and 13 AI specialists are working. Northwind and Hill Country Dental need your attention first.",
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
  { key: "aijobs", label: "AI jobs running", value: 13, sub: "2 finishing soon", tone: "accent" },
];

export type PriorityTask = {
  name: string;
  client: string;
  owner: string;
  due: string;
  priority: Severity;
};

export const priorityTasks: PriorityTask[] = [
  { name: "Approve 6 location-page briefs", client: "Northwind Heating & Air", owner: "You", due: "10:00 AM", priority: "high" },
  { name: "Ship title-tag fixes to dev (12 pages)", client: "Hill Country Dental", owner: "Priya", due: "11:30 AM", priority: "high" },
  { name: "Review competitor gap analysis", client: "Vantage Retail", owner: "You", due: "1:00 PM", priority: "high" },
  { name: "Publish 'AC Repair Austin' service page", client: "Northwind Heating & Air", owner: "Jordan", due: "2:00 PM", priority: "medium" },
  { name: "Send monthly report draft for sign-off", client: "Flowdesk", owner: "You", due: "4:00 PM", priority: "medium" },
];

export type ClientAttention = {
  client: string;
  reason: string;
  severity: Severity;
};

export const clientsNeedingAttention: ClientAttention[] = [
  { client: "Northwind Heating & Air", reason: "Traffic down 14% WoW · diagnosis flagged review velocity", severity: "high" },
  { client: "Hill Country Dental", reason: "Deployment waiting on developer for 3 days", severity: "high" },
  { client: "Vantage Retail", reason: "Content brief approved · work unassigned", severity: "medium" },
  { client: "Flowdesk", reason: "Monthly report due to client tomorrow", severity: "low" },
];

export type Blocker = {
  task: string;
  client: string;
  waitingOn: WaitingOn;
  age: string;
};

export const blockers: Blocker[] = [
  { task: "Publish 6 location pages", client: "Northwind Heating & Air", waitingOn: "Client", age: "2 days" },
  { task: "Deploy schema markup", client: "Hill Country Dental", waitingOn: "Developer", age: "3 days" },
  { task: "Index new collection pages", client: "Acme Corp", waitingOn: "Google", age: "5 days" },
];

export type Approval = { item: string; client: string; since: string };

export const approvals: Approval[] = [
  { item: "6 location-page content briefs", client: "Northwind Heating & Air", since: "Yesterday" },
  { item: "Homepage meta + H1 changes", client: "Vantage Retail", since: "2 days ago" },
];

export type Deployment = {
  item: string;
  client: string;
  status: "Queued" | "Deploying" | "Verifying" | "Live";
  when: string;
};

export const deployments: Deployment[] = [
  { item: "Title-tag fixes · 12 pages", client: "Hill Country Dental", status: "Verifying", when: "10 min ago" },
  { item: "Redirect map · migration batch 2", client: "Acme Corp", status: "Queued", when: "Today" },
  { item: "FAQ schema · 8 pages", client: "Northwind Heating & Air", status: "Live", when: "Yesterday" },
];

export type Opportunity = {
  title: string;
  client: string;
  score: number; // priority score (see lib/scoring)
};

export const opportunities: Opportunity[] = [
  { title: "Rank top-3 for 'ac repair austin' (now #6)", client: "Northwind Heating & Air", score: 72 },
  { title: "Build 'invisalign cost' comparison page", client: "Hill Country Dental", score: 64 },
  { title: "Capture 'metal roof vs shingle' featured snippet", client: "Vantage Retail", score: 58 },
];

export type Win = { text: string; client: string; when: string };

export const wins: Win[] = [
  { text: "Google indexed 12 new pages", client: "Acme Corp", when: "6:10 AM" },
  { text: "Moved to #2 for 'emergency plumber'", client: "Vantage Retail", when: "Overnight" },
  { text: "Core Web Vitals passed on 9 templates", client: "Hill Country Dental", when: "Yesterday" },
  { text: "Client approved 6 content briefs", client: "Flowdesk", when: "Yesterday" },
  { text: "Schema validated on all service pages", client: "Northwind Heating & Air", when: "Yesterday" },
];

export type AiJob = {
  agent: string;
  client: string;
  status: "Running" | "Finishing" | "Queued";
  eta: string;
};

export const aiJobs: AiJob[] = [
  { agent: "Technical Auditor", client: "Hill Country Dental", status: "Running", eta: "~8 min" },
  { agent: "Competitive Analyst", client: "Vantage Retail", status: "Finishing", eta: "~2 min" },
  { agent: "Content Strategist", client: "Northwind Heating & Air", status: "Running", eta: "~15 min" },
  { agent: "Reporting Specialist", client: "Flowdesk", status: "Queued", eta: "next" },
];

// ── Indexing queue · pages submitted to Google, by indexation state ─────────
export type IndexItem = {
  pages: number;
  client: string;
  state: "Submitted" | "Crawled" | "Indexed";
  when: string;
};

export const indexingQueue: IndexItem[] = [
  { pages: 12, client: "Acme Corp", state: "Indexed", when: "1h ago" },
  { pages: 8, client: "Northwind Heating & Air", state: "Crawled", when: "Today" },
  { pages: 6, client: "Vantage Retail", state: "Submitted", when: "Today" },
];

// ── Risk alerts · portfolio-level warnings that need a manager's eyes ───────
export type RiskAlert = {
  client: string;
  signal: string;
  metric: string;
  severity: Severity;
};

export const riskAlerts: RiskAlert[] = [
  { client: "Northwind Heating & Air", signal: "Organic traffic down 14% WoW", metric: "−14%", severity: "high" },
  { client: "Hill Country Dental", signal: "Schema deploy blocked 3 days · SLA risk", metric: "3d", severity: "high" },
  { client: "Acme Corp", signal: "Migration batch 2 awaiting Google indexation", metric: "5d", severity: "medium" },
];

// ── Upcoming deadlines · what's due, in order ──────────────────────────────
export type Deadline = {
  item: string;
  client: string;
  when: string;
  owner: string;
  due: "overdue" | "today" | "soon";
};

export const upcomingDeadlines: Deadline[] = [
  { item: "Approve 6 location-page briefs", client: "Northwind Heating & Air", when: "Today, 10:00 AM", owner: "You", due: "today" },
  { item: "Ship title-tag fixes to dev", client: "Hill Country Dental", when: "Today, 11:30 AM", owner: "Priya", due: "today" },
  { item: "Monthly report to client", client: "Flowdesk", when: "Tomorrow", owner: "You", due: "soon" },
  { item: "Q3 strategy sign-off", client: "Vantage Retail", when: "Jun 27", owner: "You", due: "soon" },
];

// ── Recent activity · the live operational feed ────────────────────────────
export type Activity = {
  actor: string;
  action: string;
  target: string;
  client: string;
  when: string;
  kind: "deploy" | "approve" | "agent" | "win" | "comment" | "alert";
};

export const recentActivity: Activity[] = [
  { actor: "Competitive Analyst", action: "completed", target: "SERP gap analysis", client: "Vantage Retail", when: "2m ago", kind: "agent" },
  { actor: "Priya", action: "deployed", target: "title-tag fixes · 12 pages", client: "Hill Country Dental", when: "18m ago", kind: "deploy" },
  { actor: "System", action: "indexed", target: "12 new collection pages", client: "Acme Corp", when: "1h ago", kind: "win" },
  { actor: "Jordan", action: "approved", target: "homepage meta + H1", client: "Vantage Retail", when: "2h ago", kind: "approve" },
  { actor: "Technical Auditor", action: "flagged", target: "review velocity stalled", client: "Northwind Heating & Air", when: "3h ago", kind: "alert" },
  { actor: "You", action: "commented on", target: "Q3 roadmap brief", client: "Flowdesk", when: "4h ago", kind: "comment" },
];
