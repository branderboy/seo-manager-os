// ─────────────────────────────────────────────────────────────────────────────
// SEO Manager OS — unified data model (single source of truth)
//
// Entities are connected by id:
//   Client ──< Investigation ──< Task / Activity / Brief / File
//   Client ──< Person ;  Investigation -> primaryContact (Person)
// Every page reads from this module via the selectors at the bottom.
// All data is illustrative — there is no backend.
// ─────────────────────────────────────────────────────────────────────────────

export type SeoModel = "Local" | "SaaS" | "Enterprise";
export type Impact = "High" | "Medium" | "Low";
export type InvStatus = "Open" | "Won" | "Lost" | "On hold";
export type PipelineStage = "Qualifying" | "Discovery" | "Diagnosis" | "Proposal" | "Won";

export type Scores = {
  visibility: number;
  authority: number;
  trust: number;
  ai: number;
  lead: number;
  revenue: number;
};

export type Person = {
  id: string;
  name: string;
  title: string;
  clientId: string;
  email: string;
  phone: string;
  initials: string;
  color: string;
};

export type ActivityType = "stage" | "note" | "email" | "task" | "person" | "file" | "score";
export type Activity = { id: string; type: ActivityType; text: string; time: string; day: string };

export type TaskStatus = "To do" | "In progress" | "Done";
export type Task = {
  id: string;
  title: string;
  owner: string;
  due: string;
  priority: Impact;
  status: TaskStatus;
};

export type Brief = { id: string; title: string; date: string; status: "Draft" | "Sent" | "Approved" };
export type FileItem = { id: string; name: string; kind: string; size: string; date: string };

export type Investigation = {
  id: string;
  name: string;
  clientId: string;
  model: SeoModel;
  value: number;
  owner: string;
  status: InvStatus;
  pipeline: PipelineStage;
  stageLabel: string;
  currentStage: number; // 1–9 of the SEO workflow
  progress: number; // 0–100
  target: string;
  source: string;
  primaryContactId: string;
  synced: string;
  scores: Scores;
  rootCause: { title: string; confidence: number; impact: Impact };
  activity: Activity[];
  tasks: Task[];
  files: FileItem[];
  briefs: Brief[];
};

export type Client = {
  id: string;
  name: string;
  model: SeoModel;
  industry: string;
  location: string;
  owner: string;
  status: "Active" | "Onboarding" | "Paused";
  scores: Scores;
  initials: string;
  color: string;
};

/** Overall client health = average of the six search scores. */
export const clientHealth = (c: Client) =>
  Math.round(
    (c.scores.visibility + c.scores.authority + c.scores.trust + c.scores.ai + c.scores.lead + c.scores.revenue) / 6
  );

// ── Workspace identity ───────────────────────────────────────────────────────
export const currentUser = {
  name: "Josh Williamson",
  agency: "Boring SEO Agency",
  initials: "JW",
  trialDays: 14,
};

// ── Clients ──────────────────────────────────────────────────────────────────
export const clients: Client[] = [
  { id: "acme", name: "Acme Corp", model: "SaaS", industry: "B2B Software", location: "San Francisco, CA", owner: "Josh Williamson", status: "Active", initials: "AC", color: "bg-blue-600", scores: { visibility: 56, authority: 49, trust: 60, ai: 34, lead: 55, revenue: 61 } },
  { id: "northwind", name: "Northwind Heating & Air", model: "Local", industry: "HVAC / Home Services", location: "Austin, TX", owner: "Josh Williamson", status: "Active", initials: "NW", color: "bg-emerald-600", scores: { visibility: 48, authority: 41, trust: 57, ai: 29, lead: 52, revenue: 61 } },
  { id: "vantage", name: "Vantage Retail", model: "Enterprise", industry: "E-commerce", location: "New York, NY", owner: "Priya Nair", status: "Active", initials: "VR", color: "bg-violet-600", scores: { visibility: 53, authority: 58, trust: 62, ai: 27, lead: 49, revenue: 64 } },
  { id: "flowdesk", name: "Flowdesk", model: "SaaS", industry: "Workflow Automation", location: "Seattle, WA", owner: "Jordan Reyes", status: "Onboarding", initials: "FD", color: "bg-amber-600", scores: { visibility: 56, authority: 49, trust: 58, ai: 34, lead: 55, revenue: 60 } },
  { id: "hillcountry", name: "Hill Country Dental", model: "Local", industry: "Dental", location: "Austin, TX", owner: "Josh Williamson", status: "Paused", initials: "HC", color: "bg-cyan-700", scores: { visibility: 61, authority: 47, trust: 67, ai: 41, lead: 58, revenue: 55 } },
];

// ── People (contacts) ────────────────────────────────────────────────────────
export const people: Person[] = [
  { id: "jon", name: "Jon Lee", title: "CEO", clientId: "acme", email: "jonlee@acmecorp.com", phone: "(415) 355-4776", initials: "JL", color: "bg-blue-500" },
  { id: "rita", name: "Rita Shaw", title: "VP Marketing", clientId: "acme", email: "rita@acmecorp.com", phone: "(415) 355-4780", initials: "RS", color: "bg-indigo-500" },
  { id: "maria", name: "Maria Gomez", title: "Owner", clientId: "northwind", email: "maria@northwindhvac.com", phone: "(512) 555-0142", initials: "MG", color: "bg-emerald-500" },
  { id: "dev", name: "Dev Patel", title: "VP Marketing", clientId: "vantage", email: "dev@vantageretail.com", phone: "(212) 555-0177", initials: "DP", color: "bg-violet-500" },
  { id: "sara", name: "Sara Kim", title: "Head of Growth", clientId: "flowdesk", email: "sara@flowdesk.io", phone: "(206) 555-0110", initials: "SK", color: "bg-amber-500" },
  { id: "tom", name: "Tom Reilly", title: "Practice Manager", clientId: "hillcountry", email: "tom@hillcountrydental.com", phone: "(512) 555-0188", initials: "TR", color: "bg-cyan-600" },
];

// ── Investigations (records) ─────────────────────────────────────────────────
export const investigations: Investigation[] = [
  {
    id: "saas-acme",
    name: "SaaS Technical Audit",
    clientId: "acme",
    model: "SaaS",
    value: 12000,
    owner: "Josh Williamson",
    status: "Open",
    pipeline: "Proposal",
    stageLabel: "Project Brief",
    currentStage: 5,
    progress: 62,
    target: "2/12/2026",
    source: "Referral",
    primaryContactId: "jon",
    synced: "4 minutes ago",
    scores: { visibility: 56, authority: 49, trust: 60, ai: 34, lead: 55, revenue: 61 },
    rootCause: { title: "Thin BOFU coverage", confidence: 81, impact: "High" },
    activity: [
      { id: "a1", type: "stage", text: "Advanced to Project Brief", time: "1:04 PM", day: "Today" },
      { id: "a2", type: "score", text: "AI Visibility recalculated to 34 (−6)", time: "12:40 PM", day: "Today" },
      { id: "a3", type: "email", text: "Sent audit proposal to Jon Lee", time: "11:18 AM", day: "Today" },
      { id: "a4", type: "person", text: 'Added the contact "Rita Shaw"', time: "Yesterday", day: "Yesterday" },
      { id: "a5", type: "file", text: "Uploaded screaming-frog-crawl.csv", time: "Yesterday", day: "Yesterday" },
    ],
    tasks: [
      { id: "t1", title: "Draft 12 missing comparison pages", owner: "Content", due: "Feb 6", priority: "High", status: "In progress" },
      { id: "t2", title: "Add FAQ schema to pricing page", owner: "SEO Lead", due: "Feb 4", priority: "Medium", status: "To do" },
      { id: "t3", title: "Fix demo-CTA placement", owner: "Design", due: "Feb 8", priority: "Medium", status: "To do" },
    ],
    files: [
      { id: "f1", name: "screaming-frog-crawl.csv", kind: "CSV", size: "2.4 MB", date: "Feb 1" },
      { id: "f2", name: "gsc-export-90d.csv", kind: "CSV", size: "880 KB", date: "Feb 1" },
      { id: "f3", name: "technical-audit-v1.pdf", kind: "PDF", size: "1.1 MB", date: "Feb 2" },
    ],
    briefs: [{ id: "b1", title: "SaaS Technical Audit — Project Brief", date: "Feb 2", status: "Draft" }],
  },
  {
    id: "local-northwind",
    name: "Local Visibility Investigation",
    clientId: "northwind",
    model: "Local",
    value: 8500,
    owner: "Josh Williamson",
    status: "Open",
    pipeline: "Diagnosis",
    stageLabel: "Diagnosis",
    currentStage: 4,
    progress: 50,
    target: "1/30/2026",
    source: "Inbound",
    primaryContactId: "maria",
    synced: "12 minutes ago",
    scores: { visibility: 48, authority: 41, trust: 57, ai: 29, lead: 52, revenue: 61 },
    rootCause: { title: "Weak review velocity", confidence: 87, impact: "High" },
    activity: [
      { id: "a1", type: "stage", text: "Diagnosis: weak review velocity (87%)", time: "9:22 AM", day: "Today" },
      { id: "a2", type: "email", text: "Sent diagnosis summary to Maria Gomez", time: "9:18 AM", day: "Today" },
      { id: "a3", type: "task", text: 'Created task "Fix NAP across 9 citations"', time: "Yesterday", day: "Yesterday" },
    ],
    tasks: [
      { id: "t1", title: "Launch review-request automation", owner: "Ops", due: "Jan 22", priority: "High", status: "In progress" },
      { id: "t2", title: "Fix NAP across 9 citations", owner: "Local SEO", due: "Jan 24", priority: "High", status: "To do" },
      { id: "t3", title: "Publish 2 service pages", owner: "Content", due: "Jan 28", priority: "Medium", status: "To do" },
    ],
    files: [{ id: "f1", name: "geo-grid-export.csv", kind: "CSV", size: "640 KB", date: "Jan 18" }],
    briefs: [{ id: "b1", title: "Local Visibility — Project Brief", date: "Jan 26", status: "Draft" }],
  },
  {
    id: "ent-vantage",
    name: "Enterprise Indexation Audit",
    clientId: "vantage",
    model: "Enterprise",
    value: 24000,
    owner: "Priya Nair",
    status: "Open",
    pipeline: "Discovery",
    stageLabel: "Research",
    currentStage: 2,
    progress: 28,
    target: "3/04/2026",
    source: "Outbound",
    primaryContactId: "dev",
    synced: "1 hour ago",
    scores: { visibility: 53, authority: 58, trust: 62, ai: 27, lead: 49, revenue: 64 },
    rootCause: { title: "Crawl budget waste", confidence: 76, impact: "High" },
    activity: [
      { id: "a1", type: "stage", text: "Research plan generated (7 areas)", time: "10:02 AM", day: "Today" },
      { id: "a2", type: "file", text: "Connected Google Search Console", time: "Yesterday", day: "Yesterday" },
    ],
    tasks: [
      { id: "t1", title: "Map crawl waste by template", owner: "SEO Lead", due: "Feb 10", priority: "High", status: "In progress" },
      { id: "t2", title: "Resolve 9,200 orphan URLs", owner: "Eng", due: "Feb 20", priority: "Medium", status: "To do" },
    ],
    files: [{ id: "f1", name: "crawl-stats-90d.csv", kind: "CSV", size: "5.2 MB", date: "Feb 3" }],
    briefs: [],
  },
  {
    id: "saas-flowdesk",
    name: "SaaS Growth Audit",
    clientId: "flowdesk",
    model: "SaaS",
    value: 15000,
    owner: "Jordan Reyes",
    status: "Open",
    pipeline: "Qualifying",
    stageLabel: "Discovery",
    currentStage: 1,
    progress: 12,
    target: "2/28/2026",
    source: "Inbound",
    primaryContactId: "sara",
    synced: "2 hours ago",
    scores: { visibility: 56, authority: 49, trust: 58, ai: 34, lead: 55, revenue: 60 },
    rootCause: { title: "Unbuilt programmatic set", confidence: 64, impact: "Medium" },
    activity: [{ id: "a1", type: "stage", text: "Discovery interview started", time: "2:15 PM", day: "Today" }],
    tasks: [{ id: "t1", title: "Complete discovery interview", owner: "Josh Williamson", due: "Feb 1", priority: "High", status: "To do" }],
    files: [],
    briefs: [],
  },
  {
    id: "local-hill",
    name: "Local SEO Investigation",
    clientId: "hillcountry",
    model: "Local",
    value: 6000,
    owner: "Josh Williamson",
    status: "Won",
    pipeline: "Won",
    stageLabel: "Execution Tools",
    currentStage: 7,
    progress: 88,
    target: "1/10/2026",
    source: "Referral",
    primaryContactId: "tom",
    synced: "Yesterday",
    scores: { visibility: 61, authority: 47, trust: 67, ai: 41, lead: 58, revenue: 55 },
    rootCause: { title: "Service-page gaps", confidence: 72, impact: "Medium" },
    activity: [
      { id: "a1", type: "stage", text: "Moved to Execution Tools", time: "Yesterday", day: "Yesterday" },
      { id: "a2", type: "score", text: "Visibility improved to 61 (+7)", time: "Mon", day: "This week" },
    ],
    tasks: [{ id: "t1", title: "Build 4 service pages", owner: "Content", due: "Jan 12", priority: "Medium", status: "Done" }],
    files: [{ id: "f1", name: "monthly-report-dec.pdf", kind: "PDF", size: "900 KB", date: "Jan 2" }],
    briefs: [{ id: "b1", title: "Local SEO — Project Brief", date: "Dec 20", status: "Approved" }],
  },
];

// ── Selectors ────────────────────────────────────────────────────────────────
export const clientById = (id: string) => clients.find((c) => c.id === id);
export const personById = (id: string) => people.find((p) => p.id === id);
export const investigationById = (id: string) => investigations.find((i) => i.id === id);
export const peopleForClient = (clientId: string) => people.filter((p) => p.clientId === clientId);
export const investigationsForClient = (clientId: string) =>
  investigations.filter((i) => i.clientId === clientId);

/** The record shown on the home screen. */
export const featuredInvestigation = investigations[0];

export const allTasks = investigations.flatMap((inv) =>
  inv.tasks.map((t) => ({ ...t, investigationId: inv.id, clientId: inv.clientId }))
);

export const pipelineStages: PipelineStage[] = ["Qualifying", "Discovery", "Diagnosis", "Proposal", "Won"];

export const money = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n}`;

// Portfolio roll-ups for overview surfaces.
export const portfolio = {
  clients: clients.length,
  activeInvestigations: investigations.filter((i) => i.status === "Open").length,
  pipelineValue: investigations
    .filter((i) => i.status === "Open")
    .reduce((s, i) => s + i.value, 0),
  openTasks: allTasks.filter((t) => t.status !== "Done").length,
  avgVisibility: Math.round(clients.reduce((s, c) => s + c.scores.visibility, 0) / clients.length),
  avgAi: Math.round(clients.reduce((s, c) => s + c.scores.ai, 0) / clients.length),
};
