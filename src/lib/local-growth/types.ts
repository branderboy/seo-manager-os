export type AppRole =
  | "agency_admin"
  | "lead_seo"
  | "seo_strategist"
  | "content_outreach"
  | "client_viewer"
  | "client_editor";

export type Priority = "low" | "medium" | "high" | "critical";
export type Status =
  | "not_started"
  | "new"
  | "investigating"
  | "planned"
  | "in_progress"
  | "waiting_on_client"
  | "blocked"
  | "completed"
  | "accepted_risk"
  | "not_applicable";

export type BusinessModel = "storefront" | "service_area" | "hybrid";
export type Workstream =
  | "gbp"
  | "technical"
  | "on_page"
  | "citations"
  | "content"
  | "reputation"
  | "links"
  | "cro"
  | "analytics"
  | "competitors"
  | "strategy";

export type DataFreshness = {
  source: string;
  status: "fresh" | "stale" | "unavailable";
  updatedAt?: string;
  note?: string;
};

export type Kpi = {
  key: string;
  label: string;
  value: number | string;
  previous?: number | string;
  change?: number;
  format?: "number" | "percent" | "currency" | "rating";
  freshness?: DataFreshness;
};

export type Service = {
  name: string;
  priority: Priority;
  highMargin: boolean;
  averageTicket?: number;
};

export type Campaign = {
  id: string;
  clientId: string;
  clientName: string;
  legalName: string;
  website: string;
  industry: string;
  businessModel: BusinessModel;
  market: string;
  targetCities: string[];
  targetZips: string[];
  services: Service[];
  strategist: string;
  status: "onboarding" | "active" | "paused";
  startDate: string;
  healthScore: number;
  visibilityScore: number;
  clientActionCount: number;
  blockerCount: number;
  latestReportStatus: "draft" | "review" | "published";
};

export type AuditFinding = {
  id: string;
  campaignId: string;
  auditType: string;
  section: string;
  title: string;
  severity: Priority;
  impact: number;
  effort: number;
  confidence: number;
  status: Status;
  owner: string;
  dueDate?: string;
  recommendation: string;
  clientExplanation: string;
  evidence?: string;
  clientVisible: boolean;
  riskAcknowledgementRequired?: boolean;
  riskAcknowledged?: boolean;
};

export type RoadmapInitiative = {
  id: string;
  campaignId: string;
  name: string;
  type: Workstream;
  businessObjective: string;
  searchObjective: string;
  impact: number;
  effort: number;
  confidence: number;
  priorityScore: number;
  owner: string;
  status: Status;
  startDate: string;
  endDate: string;
  kpi: string;
  sourceFindingId?: string;
  clientExplanation: string;
  humanApproved: boolean;
  clientVisible: boolean;
};

export type SeoTask = {
  id: string;
  campaignId: string;
  title: string;
  workstream: Workstream;
  priority: Priority;
  owner: string;
  dueDate: string;
  status: Status;
  estimatedMinutes: number;
  dependency?: string;
  relatedFindingId?: string;
  relatedInitiativeId?: string;
  clientVisible: boolean;
  approvalStatus: "not_required" | "pending" | "approved" | "rejected";
  completionEvidence?: string;
};

export type KeywordMapRow = {
  id: string;
  campaignId: string;
  cluster: string;
  primaryKeyword: string;
  service: string;
  location: string;
  intent: "transactional" | "commercial_investigation" | "informational" | "navigational" | "emergency";
  searchVolume: number;
  difficulty: number;
  cpc: number;
  businessValue: number;
  targetUrl?: string;
  competingUrls?: string[];
  serpFeatures: string[];
  priority: Priority;
};

export type RankingSummary = {
  campaignId: string;
  keyword: string;
  localPackVisibility: number;
  averageRank: number;
  shareOfLocalVoice: number;
  organicRank: number;
  movement: number;
  competitor: string;
  grid: number[][];
};

export type Citation = {
  id: string;
  campaignId: string;
  directory: string;
  listingStatus: "claimed" | "pending" | "incorrect" | "missing" | "duplicate";
  napMatchScore: number;
  duplicateRisk: Priority;
  priority: Priority;
  phone: string;
  expectedPhone: string;
  checkedAt: string;
  nextAction: string;
  owner: string;
};

export type ContentItem = {
  id: string;
  campaignId: string;
  type: "service_page" | "city_page" | "project_case_study" | "blog" | "faq" | "comparison" | "pricing" | "seasonal" | "landing_page" | "gbp_post";
  title: string;
  service: string;
  location: string;
  intent: string;
  targetUrl: string;
  status: "idea" | "brief" | "drafting" | "editing" | "waiting_on_client" | "approved" | "published";
  owner: string;
  publishDate?: string;
  clientAssetsRequired: string[];
  qaFlags: string[];
};

export type ReviewSummary = {
  campaignId: string;
  count: number;
  rating: number;
  monthlyVelocity: number;
  competitorVelocity: number;
  responseRate: number;
};

export type LeadSummary = {
  campaignId: string;
  leads: number;
  qualified: number;
  booked: number;
  closed: number;
  revenue?: number;
  revenueSourceAvailable: boolean;
};

export type ClientRequest = {
  id: string;
  campaignId: string;
  type: string;
  title: string;
  whyItMatters: string;
  exactRequestedItem: string;
  dueDate: string;
  status: "open" | "client_replied" | "approved" | "rejected" | "unavailable" | "completed" | "overdue";
  contact: string;
  relatedContent?: string;
};

export type Integration = {
  provider: string;
  label: string;
  category: string;
  state: "not_requested" | "requested" | "received" | "connected" | "blocked" | "error";
  lastSync?: string;
  dataFreshAt?: string;
  mode: "mock" | "live";
  detail: string;
};

export type MonthlyReport = {
  id: string;
  campaignId: string;
  period: string;
  executiveSummary: string;
  workCompleted: string[];
  risks: string[];
  nextPriorities: string[];
  publishStatus: "draft" | "review" | "published";
  leadSeoApproval: "pending" | "approved" | "changes_requested";
  snapshot: Record<string, number | string | null>;
  freshness: DataFreshness[];
};

export const statusLabel: Record<Status, string> = {
  not_started: "Not started",
  new: "New",
  investigating: "Investigating",
  planned: "Planned",
  in_progress: "In progress",
  waiting_on_client: "Waiting on client",
  blocked: "Blocked",
  completed: "Completed",
  accepted_risk: "Accepted risk",
  not_applicable: "Not applicable",
};

export const roleLabel: Record<AppRole, string> = {
  agency_admin: "Agency Admin",
  lead_seo: "Lead SEO",
  seo_strategist: "SEO Strategist",
  content_outreach: "Content / Outreach Specialist",
  client_viewer: "Client Viewer",
  client_editor: "Client Editor",
};
