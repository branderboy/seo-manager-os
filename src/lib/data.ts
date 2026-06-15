// ─────────────────────────────────────────────────────────────────────────────
// SEO Manager OS — mock data
// Everything here is illustrative. There is no backend; the prototype renders
// a fully worked example so the experience reads like a real engagement.
// ─────────────────────────────────────────────────────────────────────────────

export type SeoModel = "Local" | "SaaS" | "Enterprise";
export type Impact = "High" | "Medium" | "Low";
export type Status =
  | "Not started"
  | "In progress"
  | "Complete"
  | "Blocked"
  | "Queued";

// ── Demo account (drives stages 1–8) ─────────────────────────────────────────
export const account = {
  business: "Northwind Heating & Air",
  website: "northwindhvac.com",
  industry: "HVAC / Home Services",
  locations: 3,
  primaryMarket: "Austin, TX",
  yearsInBusiness: 14,
  revenueRange: "$5M–$10M",
  teamSize: "25–50",
  model: "Local" as SeoModel,
  revenueModel: ["Leads", "Calls"],
  goals: ["More Leads", "More Calls", "More AI Visibility"],
  problems: ["GBP Visibility Problems", "Leads Down", "AI Visibility Problems"],
  competitors: ["ATX Comfort Pros", "Lone Star Mechanical", "Hill Country HVAC"],
  assets: ["Google Business Profile", "GA4", "Search Console", "CRM"],
  classificationConfidence: 92,
};

// ── Headline scores (Stage 8 + dashboards) ───────────────────────────────────
export type CoreScore = {
  key: string;
  label: string;
  value: number;
  delta: number; // change vs last period
  blurb: string;
};

export const coreScores: CoreScore[] = [
  { key: "visibility", label: "Visibility", value: 48, delta: -6, blurb: "Share of local pack + organic across tracked terms." },
  { key: "authority", label: "Authority", value: 41, delta: +2, blurb: "Link equity and topical authority vs. market." },
  { key: "trust", label: "Trust", value: 57, delta: -3, blurb: "Reviews, ratings, NAP and reputation signals." },
  { key: "ai", label: "AI Visibility", value: 29, delta: -9, blurb: "Presence in AI Overviews, citations and assistants." },
  { key: "lead", label: "Lead", value: 52, delta: -4, blurb: "Conversion readiness of pages that drive leads." },
  { key: "revenue", label: "Revenue", value: 61, delta: +1, blurb: "Coverage of money pages and revenue intents." },
  { key: "opportunity", label: "Opportunity", value: 78, delta: +12, blurb: "Upside available if root causes are resolved." },
  { key: "competitive", label: "Competitive Position", value: 44, delta: -5, blurb: "Standing relative to tracked competitors." },
];

// ── Research plans by model (Stage 2) ────────────────────────────────────────
export type ResearchItem = {
  name: string;
  status: Status;
  detail: string;
  signals: number; // # of data points planned
};

export const researchPlans: Record<SeoModel, ResearchItem[]> = {
  Local: [
    { name: "Google Business Profile", status: "Complete", detail: "Categories, services, posts, photos, Q&A, attributes.", signals: 38 },
    { name: "Geo Grid", status: "Complete", detail: "7×7 rank grid across the service radius.", signals: 49 },
    { name: "Reviews", status: "In progress", detail: "Velocity, rating, sentiment, response rate vs. market.", signals: 26 },
    { name: "Competitors", status: "In progress", detail: "Top 3 rivals — proximity, trust and content overlap.", signals: 31 },
    { name: "Entity Signals", status: "Queued", detail: "Knowledge graph, sameAs, citations, consistency.", signals: 22 },
    { name: "Service Coverage", status: "Queued", detail: "Service-page completeness vs. demand.", signals: 18 },
    { name: "Location Coverage", status: "Not started", detail: "Location-page depth across 3 markets.", signals: 12 },
    { name: "Internal Linking", status: "Not started", detail: "Service ↔ location ↔ money page link paths.", signals: 16 },
    { name: "Local Authority", status: "Not started", detail: "Local links, sponsorships, partners and press.", signals: 20 },
  ],
  SaaS: [
    { name: "Competitors", status: "Complete", detail: "SERP rivals across BOFU and comparison space.", signals: 34 },
    { name: "BOFU Pages", status: "In progress", detail: "Pricing, demo, solution and use-case coverage.", signals: 28 },
    { name: "Comparisons", status: "In progress", detail: "vs-competitor pages and their ranking gaps.", signals: 21 },
    { name: "Alternatives", status: "Queued", detail: "'best alternative to X' opportunity map.", signals: 17 },
    { name: "Integrations", status: "Queued", detail: "Integration landing pages vs. catalog size.", signals: 24 },
    { name: "Use Cases", status: "Not started", detail: "Jobs-to-be-done page coverage.", signals: 19 },
    { name: "Content Coverage", status: "Not started", detail: "Topic cluster completeness and depth.", signals: 33 },
    { name: "Programmatic Opportunities", status: "Not started", detail: "Templatable, demand-backed page sets.", signals: 41 },
  ],
  Enterprise: [
    { name: "Crawl Budget", status: "Complete", detail: "Crawl stats, waste and frequency by template.", signals: 44 },
    { name: "Indexation", status: "In progress", detail: "Indexed vs. submitted, excluded reasons.", signals: 37 },
    { name: "Templates", status: "In progress", detail: "Per-template performance and decay.", signals: 29 },
    { name: "Internal Linking", status: "Queued", detail: "Link graph depth, orphans and hubs.", signals: 52 },
    { name: "Entities", status: "Queued", detail: "Entity coverage and disambiguation.", signals: 26 },
    { name: "Content Inventory", status: "Not started", detail: "Full inventory with quality + intent tags.", signals: 61 },
    { name: "Revenue Pages", status: "Not started", detail: "Money-page health and cannibalization.", signals: 23 },
  ],
};

// ── Investigation audits by model (Stage 3) ──────────────────────────────────
export type Audit = {
  name: string;
  score: number;
  status: Status;
  finding: string;
};

export const investigations: Record<SeoModel, Audit[]> = {
  Local: [
    { name: "GBP Audit", score: 54, status: "Complete", finding: "Primary category correct, but 6 of 12 services missing and posts stale 40+ days." },
    { name: "Geo Grid Audit", score: 38, status: "Complete", finding: "Strong within 2mi of HQ, collapses beyond — proximity-bound visibility." },
    { name: "Review Audit", score: 49, status: "Complete", finding: "4.6★ but velocity is 3/mo vs. market median of 11/mo. Response rate 22%." },
    { name: "Entity Audit", score: 61, status: "In progress", finding: "Inconsistent NAP on 9 citations; weak sameAs and no knowledge panel." },
    { name: "Competitor Audit", score: 44, status: "In progress", finding: "Rivals out-review 3:1 and hold 2× the location-page depth." },
    { name: "Authority Audit", score: 41, status: "Queued", finding: "27 referring domains vs. market median 88; thin local link profile." },
    { name: "AI Visibility Audit", score: 29, status: "Queued", finding: "Absent from AI Overviews and assistant answers for core service terms." },
  ],
  SaaS: [
    { name: "BOFU Audit", score: 52, status: "Complete", finding: "Pricing ranks but use-case and solution pages are thin or missing." },
    { name: "Competitor Gap Audit", score: 47, status: "Complete", finding: "12 comparison terms with no page; rivals own the 'vs' SERPs." },
    { name: "Programmatic Audit", score: 58, status: "In progress", finding: "Integrations templatable — 140 demand-backed pages unbuilt." },
    { name: "Content Audit", score: 63, status: "In progress", finding: "TOFU strong, MOFU↔BOFU links weak; clusters lack pillar hubs." },
    { name: "AEO Audit", score: 34, status: "Queued", finding: "Low citation share in AI answers for category and JTBD queries." },
    { name: "Conversion Audit", score: 55, status: "Queued", finding: "Demo CTA buried; comparison pages lack proof and pricing clarity." },
  ],
  Enterprise: [
    { name: "Crawl Audit", score: 46, status: "Complete", finding: "34% of crawl spent on faceted/parameter URLs with no index value." },
    { name: "Indexation Audit", score: 51, status: "Complete", finding: "61k 'crawled — not indexed'; quality + duplication on key templates." },
    { name: "Template Audit", score: 57, status: "In progress", finding: "Category template decayed 18% YoY; PLP internal links too shallow." },
    { name: "Internal Link Audit", score: 43, status: "In progress", finding: "9,200 orphan URLs; revenue pages average 1.4 internal links." },
    { name: "Entity Audit", score: 60, status: "Queued", finding: "Entity coverage solid, disambiguation weak across regions." },
    { name: "Forecasting Audit", score: 68, status: "Queued", finding: "Indexation + linking fixes model to +22% qualified sessions." },
  ],
};

// ── Diagnosis engine (Stage 4) ───────────────────────────────────────────────
export type Cause = {
  title: string;
  confidence: number;
  impact: Impact;
  evidence: string[];
  model: SeoModel;
};

export const diagnosis = {
  summary:
    "Northwind's visibility is proximity-bound and trust-starved. The business ranks where it is physically close, but weak review velocity and thin authority cap its radius — while near-zero AI visibility is quietly removing it from the next generation of search.",
  primary: {
    title: "Weak Review Velocity",
    confidence: 87,
    impact: "High",
    evidence: [
      "3 reviews/mo vs. market median of 11/mo",
      "Response rate of 22% (top rival: 96%)",
      "Geo-grid rank falls off exactly where review trust thins",
    ],
    model: "Local",
  } as Cause,
  secondary: {
    title: "Weak Service & Location Coverage",
    confidence: 74,
    impact: "Medium",
    evidence: [
      "6 of 12 GBP services have no supporting page",
      "Location pages exist for 1 of 3 markets",
      "Competitors hold 2× location-page depth",
    ],
    model: "Local",
  } as Cause,
  possible: [
    { title: "Weak Authority", confidence: 66, impact: "Medium" as Impact },
    { title: "Weak Internal Linking", confidence: 58, impact: "Medium" as Impact },
    { title: "Weak Entity Signals", confidence: 55, impact: "Medium" as Impact },
    { title: "Weak AI Retrieval", confidence: 71, impact: "High" as Impact },
    { title: "Weak Proximity Coverage", confidence: 49, impact: "Low" as Impact },
    { title: "Weak Content Coverage", confidence: 44, impact: "Low" as Impact },
  ],
};

// ── Strategy brief (Stage 5) ─────────────────────────────────────────────────
export const strategy = {
  executiveSummary:
    "Northwind has durable demand and a trusted brand inside a 2-mile core, but its search footprint is capped by trust and coverage gaps rather than a content problem. Concentrating the next two quarters on review velocity, service/location coverage and local authority will expand the winnable radius and recover lead flow — while an AEO foundation protects the brand as search shifts to AI answers.",
  currentState: [
    "Visibility 48 / Trust 57 / Authority 41 / AI Visibility 29.",
    "Rankings strong within 2mi of HQ, weak beyond — proximity-bound.",
    "Lead volume down ~18% QoQ, concentrated in two outer ZIPs.",
  ],
  keyFindings: [
    "Review velocity is the single largest constraint on reach.",
    "Half of advertised services have no page to rank or convert.",
    "The brand is effectively invisible in AI Overviews and assistants.",
  ],
  rootCauses: [
    "Weak review velocity (87% confidence, High impact).",
    "Weak service & location coverage (74% confidence, Medium impact).",
    "Weak local authority + entity consistency (supporting).",
  ],
  opportunities: [
    "Recover 2 outer ZIPs by lifting review velocity to market median.",
    "Build 6 service + 2 location pages mapped to GBP services.",
    "Capture AI-answer citations before competitors establish them.",
  ],
  risks: [
    "Continued AI-visibility decline compounds as adoption grows.",
    "Rivals' review lead widens if velocity gap is left unaddressed.",
    "NAP inconsistency risks knowledge-panel and pack suppression.",
  ],
  expectedOutcomes: [
    { metric: "Local pack share", from: 48, to: 67 },
    { metric: "Qualified leads / mo", from: 142, to: 205 },
    { metric: "AI visibility", from: 29, to: 55 },
    { metric: "Review velocity / mo", from: 3, to: 12 },
  ],
};

// Priority matrix (Stage 5) — impact vs. effort quadrant.
export type Initiative = {
  id: string;
  name: string;
  impact: number; // 0–100
  effort: number; // 0–100
  model: SeoModel;
};

export const priorityMatrix: Initiative[] = [
  { id: "rev", name: "Review velocity engine", impact: 92, effort: 30, model: "Local" },
  { id: "svc", name: "Service page build-out", impact: 78, effort: 52, model: "Local" },
  { id: "loc", name: "Location page build-out", impact: 70, effort: 58, model: "Local" },
  { id: "nap", name: "Citation / NAP cleanup", impact: 55, effort: 24, model: "Local" },
  { id: "aeo", name: "AEO foundation", impact: 84, effort: 46, model: "Local" },
  { id: "auth", name: "Local authority program", impact: 66, effort: 74, model: "Local" },
  { id: "link", name: "Internal linking pass", impact: 48, effort: 28, model: "Local" },
];

// ── Execution planner (Stage 6) ──────────────────────────────────────────────
export type PlanItem = {
  name: string;
  priority: Impact;
  impact: Impact;
  effort: Impact;
  confidence: number;
  owner: string;
  status: Status;
};

export const executionPlans: { horizon: string; items: PlanItem[] }[] = [
  {
    horizon: "30-Day",
    items: [
      { name: "Launch review-request automation from CRM", priority: "High", impact: "High", effort: "Low", confidence: 88, owner: "Ops", status: "In progress" },
      { name: "Fix NAP across 9 inconsistent citations", priority: "High", impact: "Medium", effort: "Low", confidence: 81, owner: "Local SEO", status: "In progress" },
      { name: "Publish 2 highest-demand service pages", priority: "High", impact: "High", effort: "Medium", confidence: 76, owner: "Content", status: "Not started" },
      { name: "Refresh GBP services, posts & photos", priority: "Medium", impact: "Medium", effort: "Low", confidence: 84, owner: "Local SEO", status: "Not started" },
    ],
  },
  {
    horizon: "90-Day",
    items: [
      { name: "Complete 6 service + 2 location pages", priority: "High", impact: "High", effort: "High", confidence: 72, owner: "Content", status: "Not started" },
      { name: "Stand up AEO foundation (schema, entity, FAQs)", priority: "High", impact: "High", effort: "Medium", confidence: 69, owner: "SEO Lead", status: "Not started" },
      { name: "Internal linking pass: service ↔ location ↔ money", priority: "Medium", impact: "Medium", effort: "Low", confidence: 74, owner: "SEO Lead", status: "Not started" },
      { name: "Launch local authority / sponsorship outreach", priority: "Medium", impact: "Medium", effort: "High", confidence: 61, owner: "Marketing", status: "Not started" },
    ],
  },
  {
    horizon: "180-Day",
    items: [
      { name: "Scale review velocity to 12+/mo across locations", priority: "High", impact: "High", effort: "Medium", confidence: 70, owner: "Ops", status: "Not started" },
      { name: "Expand to full service-area page coverage", priority: "Medium", impact: "High", effort: "High", confidence: 64, owner: "Content", status: "Not started" },
      { name: "Establish AI-answer citation footprint", priority: "High", impact: "High", effort: "Medium", confidence: 58, owner: "SEO Lead", status: "Not started" },
      { name: "Quarterly diagnosis re-run & forecast update", priority: "Low", impact: "Medium", effort: "Low", confidence: 80, owner: "SEO Lead", status: "Not started" },
    ],
  },
];

// ── Execution tools catalog (Stage 7) ────────────────────────────────────────
export const executionTools: Record<SeoModel, { name: string; blurb: string }[]> = {
  Local: [
    { name: "GBP Optimizer", blurb: "Categories, services, posts and attributes against best-in-market." },
    { name: "Review Strategy", blurb: "Velocity targets, request cadence and response playbook." },
    { name: "Internal Linking Planner", blurb: "Map service ↔ location ↔ money-page link paths." },
    { name: "Location Page Builder", blurb: "Generate depth-complete location pages per market." },
    { name: "Service Page Planner", blurb: "Map every GBP service to a ranking + converting page." },
    { name: "Competitor Tracker", blurb: "Proximity, trust and content overlap vs. top rivals." },
    { name: "AEO Planner", blurb: "Schema, entities and FAQs for AI-answer citation." },
  ],
  SaaS: [
    { name: "BOFU Planner", blurb: "Solution, use-case and pricing-intent page map." },
    { name: "Alternative Page Planner", blurb: "'Best alternative to X' set with demand backing." },
    { name: "Comparison Page Planner", blurb: "vs-competitor pages and proof requirements." },
    { name: "Integration Planner", blurb: "Integration landing pages from the catalog." },
    { name: "Industry Page Planner", blurb: "Vertical landing pages mapped to ICPs." },
    { name: "Programmatic Planner", blurb: "Templatable, demand-validated page sets." },
    { name: "AEO Planner", blurb: "Citation strategy for category + JTBD answers." },
  ],
  Enterprise: [
    { name: "Template Planner", blurb: "Per-template optimization and decay recovery." },
    { name: "Internal Link Planner", blurb: "Resolve orphans; route equity to revenue pages." },
    { name: "Entity Mapper", blurb: "Entity coverage and cross-region disambiguation." },
    { name: "Indexation Planner", blurb: "Fix 'crawled — not indexed' at template scale." },
    { name: "Crawl Budget Planner", blurb: "Eliminate crawl waste on parameter/facet URLs." },
    { name: "Forecasting Tool", blurb: "Model traffic + revenue from each fix." },
  ],
};

// ── Measurement trend series (Stage 8) ───────────────────────────────────────
export const trend = [
  { month: "Jan", visibility: 42, authority: 38, trust: 54, ai: 21 },
  { month: "Feb", visibility: 44, authority: 39, trust: 55, ai: 24 },
  { month: "Mar", visibility: 47, authority: 39, trust: 58, ai: 26 },
  { month: "Apr", visibility: 51, authority: 40, trust: 60, ai: 31 },
  { month: "May", visibility: 49, authority: 40, trust: 59, ai: 33 },
  { month: "Jun", visibility: 48, authority: 41, trust: 57, ai: 29 },
];

// ── Daily Task Engine (Stage 9) ──────────────────────────────────────────────
export type TaskGroup = "Today" | "Tomorrow" | "This week";
export type DailyTask = {
  id: string;
  name: string;
  owner: string;
  priority: Impact;
  due: string;
  source: string; // which plan / stage it traces to
  done: boolean;
  group: TaskGroup;
};

export const dailyTasks: DailyTask[] = [
  { id: "t1", name: "Send 8 review requests from yesterday's completed jobs", owner: "Ops", priority: "High", due: "9:00 AM", source: "30-Day · Review automation", done: true, group: "Today" },
  { id: "t2", name: "Respond to 5 new Google reviews", owner: "Ops", priority: "High", due: "11:00 AM", source: "30-Day · Review automation", done: false, group: "Today" },
  { id: "t3", name: "Fix NAP on Yelp + 2 chamber citations", owner: "Local SEO", priority: "High", due: "1:00 PM", source: "30-Day · Citation cleanup", done: false, group: "Today" },
  { id: "t4", name: "Draft 'AC Repair' service page outline", owner: "Content", priority: "Medium", due: "3:00 PM", source: "30-Day · Service pages", done: false, group: "Today" },
  { id: "t5", name: "Publish weekly GBP post + 4 photos", owner: "Local SEO", priority: "Medium", due: "4:30 PM", source: "30-Day · GBP refresh", done: false, group: "Today" },
  { id: "t6", name: "QA + publish 'Furnace Replacement' page", owner: "Content", priority: "High", due: "Tomorrow", source: "90-Day · Service pages", done: false, group: "Tomorrow" },
  { id: "t7", name: "Add FAQ schema to 3 service pages", owner: "SEO Lead", priority: "Medium", due: "Tomorrow", source: "90-Day · AEO foundation", done: false, group: "Tomorrow" },
  { id: "t8", name: "Internal-link pass: 2 location pages → money pages", owner: "SEO Lead", priority: "Medium", due: "Thu", source: "90-Day · Internal linking", done: false, group: "This week" },
  { id: "t9", name: "Outreach to 3 local sponsorship partners", owner: "Marketing", priority: "Low", due: "Fri", source: "90-Day · Local authority", done: false, group: "This week" },
];

export const taskStats = {
  streakDays: 12,
  weekCompleted: 31,
  weekTarget: 40,
};

export const taskAlerts = {
  recipient: "owner@northwindhvac.com",
  digestTime: "8:00 AM CT",
  cadence: "Daily digest + overdue nudges",
  channels: ["Email", "Slack"],
  reminders: [
    { label: "Morning digest", detail: "Today's tasks, owners and due times.", time: "8:00 AM" },
    { label: "Midday nudge", detail: "Anything still open and due today.", time: "1:00 PM" },
    { label: "Overdue alert", detail: "Tasks past due, escalated to the owner.", time: "As needed" },
    { label: "End-of-day recap", detail: "Completed, carried over, and the streak.", time: "6:00 PM" },
  ],
};

// ── AEO module (all dashboards) ──────────────────────────────────────────────
export const aeo = {
  score: 29,
  metrics: [
    { label: "Citation Visibility", value: 24, blurb: "Share of AI answers citing the brand." },
    { label: "Retrieval Visibility", value: 31, blurb: "Coverage in assistant retrieval sets." },
    { label: "AI Overview Presence", value: 18, blurb: "Appearance in Google AI Overviews." },
    { label: "Brand Mentions", value: 46, blurb: "Unlinked brand mentions in answers." },
    { label: "Entity Clarity", value: 52, blurb: "How unambiguously the brand is modeled." },
    { label: "Competitor Citations", value: 73, blurb: "Rivals' citation share (lower is better for us)." },
    { label: "Source Authority", value: 38, blurb: "Authority of sources that mention the brand." },
  ],
};
