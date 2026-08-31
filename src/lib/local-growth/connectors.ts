import type { DataFreshness } from "./types";

export type ConnectionState = "not_requested" | "requested" | "received" | "connected" | "blocked" | "error";

export type CampaignContext = {
  organizationId: string;
  clientId: string;
  campaignId: string;
  dateFrom: string;
  dateTo: string;
};

export type SyncError = {
  code: string;
  message: string;
  retryable: boolean;
  occurredAt: string;
};

export type SyncResult<T> = {
  provider: string;
  state: ConnectionState;
  rows: T[];
  syncedAt: string;
  freshAt?: string;
  errors: SyncError[];
  mode: "mock" | "live";
};

export interface Connector<T> {
  readonly provider: string;
  readonly mode: "mock" | "live";
  connect(): Promise<ConnectionState>;
  sync(context: CampaignContext): Promise<SyncResult<T>>;
  freshness(): Promise<DataFreshness>;
  importCsv?(rows: Record<string, unknown>[], context: CampaignContext): Promise<SyncResult<T>>;
}

export type AnalyticsRow = {
  date: string;
  landingPage?: string;
  event?: string;
  clicks?: number;
  impressions?: number;
  sessions?: number;
  conversions?: number;
  value?: number | null;
};

export type GbpRow = {
  date: string;
  calls: number;
  websiteClicks: number;
  directionRequests: number;
  views?: number;
};

export type RankRow = {
  date: string;
  keyword: string;
  resultType: "local_pack" | "organic";
  rank: number | null;
  latitude?: number;
  longitude?: number;
  zip?: string;
  rankingUrl?: string;
};

export type CallRow = {
  occurredAt: string;
  source: string;
  durationSeconds?: number;
  qualified?: boolean;
  booked?: boolean;
  revenue?: number | null;
};

export type CitationRow = {
  directory: string;
  listingUrl?: string;
  businessName?: string;
  address?: string;
  phone?: string;
  website?: string;
  checkedAt: string;
};

export class MockConnector<T> implements Connector<T> {
  readonly mode = "mock" as const;

  constructor(
    readonly provider: string,
    private readonly rows: T[],
    private readonly state: ConnectionState = "connected",
    private readonly freshAt = new Date().toISOString(),
  ) {}

  async connect(): Promise<ConnectionState> {
    return this.state;
  }

  async sync(_context: CampaignContext): Promise<SyncResult<T>> {
    return {
      provider: this.provider,
      state: this.state,
      rows: this.rows,
      syncedAt: new Date().toISOString(),
      freshAt: this.freshAt,
      errors: this.state === "blocked"
        ? [{ code: "ACCESS_BLOCKED", message: "Demo connector is blocked until access is supplied.", retryable: true, occurredAt: new Date().toISOString() }]
        : [],
      mode: "mock",
    };
  }

  async freshness(): Promise<DataFreshness> {
    return {
      source: this.provider,
      status: this.state === "connected" ? "fresh" : this.state === "blocked" ? "unavailable" : "stale",
      updatedAt: this.state === "connected" ? this.freshAt : undefined,
      note: this.state === "connected" ? "Mock provider" : `Connection state: ${this.state}`,
    };
  }

  async importCsv(rows: Record<string, unknown>[], _context: CampaignContext): Promise<SyncResult<T>> {
    return {
      provider: this.provider,
      state: "connected",
      rows: rows as T[],
      syncedAt: new Date().toISOString(),
      freshAt: new Date().toISOString(),
      errors: [],
      mode: "mock",
    };
  }
}

export const connectorCatalog = [
  { provider: "ga4", purpose: "Organic sessions, landing pages, events and conversion goals", liveAdapter: "Google Analytics Data API" },
  { provider: "gsc", purpose: "Clicks, impressions, CTR, queries and landing pages", liveAdapter: "Google Search Console API" },
  { provider: "google_business_profile", purpose: "GBP profile data and performance metrics", liveAdapter: "Google Business Profile APIs" },
  { provider: "google_drive", purpose: "Client assets and report/file handoff", liveAdapter: "Google Drive API" },
  { provider: "slack", purpose: "Status updates, approvals, alerts and digests", liveAdapter: "Slack Web API / webhooks" },
  { provider: "brightlocal", purpose: "Local rank tracking and citation data", liveAdapter: "BrightLocal adapter" },
  { provider: "local_falcon", purpose: "Geo-grid local rank snapshots", liveAdapter: "Local Falcon adapter" },
  { provider: "whitespark", purpose: "Citation discovery and status", liveAdapter: "Whitespark adapter / CSV" },
  { provider: "ahrefs", purpose: "Backlinks and competitor authority", liveAdapter: "Ahrefs API" },
  { provider: "semrush", purpose: "Keyword and competitor research", liveAdapter: "Semrush API" },
  { provider: "callrail", purpose: "Phone leads and qualified/booked call outcomes", liveAdapter: "CallRail API" },
  { provider: "zapier_webhook", purpose: "CRM and unsupported workflow handoff", liveAdapter: "Signed webhook" },
] as const;
