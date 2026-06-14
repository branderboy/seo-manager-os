import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * Websites — the core entity. Every discovered WordPress site lands here.
 */
export const websites = pgTable(
  "websites",
  {
    id: serial("id").primaryKey(),
    domain: text("domain").notNull(),
    companyName: text("company_name"),
    title: text("title"),
    metaDescription: text("meta_description"),
    location: text("location"),
    city: text("city"),
    state: text("state"),
    phone: text("phone"),
    email: text("email"),
    contactName: text("contact_name"),
    emailSource: text("email_source"),
    wordpressDetected: boolean("wordpress_detected").default(false).notNull(),
    industry: text("industry"),
    subIndustry: text("sub_industry"),
    classificationConfidence: real("classification_confidence"),
    opportunityScore: integer("opportunity_score").default(0).notNull(),
    suggestedProduct: text("suggested_product"),
    emailOptOut: boolean("email_opt_out").default(false).notNull(),
    source: text("source").default("manual").notNull(),
    lastScannedAt: timestamp("last_scanned_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    domainIdx: uniqueIndex("websites_domain_idx").on(t.domain),
    industryIdx: index("websites_industry_idx").on(t.industry),
    scoreIdx: index("websites_score_idx").on(t.opportunityScore),
    stateIdx: index("websites_state_idx").on(t.state),
  }),
);

/**
 * Technology Detection — which plugins / builders / tools a site runs.
 * One row per domain (1:1 with websites via domain).
 */
export const technologyDetection = pgTable("technology_detection", {
  domain: text("domain").primaryKey(),
  wordpress: boolean("wordpress").default(false).notNull(),
  elementor: boolean("elementor").default(false).notNull(),
  wpforms: boolean("wpforms").default(false).notNull(),
  gravityForms: boolean("gravity_forms").default(false).notNull(),
  contactForm7: boolean("contact_form_7").default(false).notNull(),
  woocommerce: boolean("woocommerce").default(false).notNull(),
  rankMath: boolean("rank_math").default(false).notNull(),
  yoast: boolean("yoast").default(false).notNull(),
  bookingSystem: boolean("booking_system").default(false).notNull(),
  quoteSystem: boolean("quote_system").default(false).notNull(),
  detectedAt: timestamp("detected_at").defaultNow().notNull(),
});

/**
 * Opportunity Detection — gap analysis that feeds the opportunity score.
 */
export const opportunityDetection = pgTable("opportunity_detection", {
  domain: text("domain").primaryKey(),
  hasQuoteTool: boolean("has_quote_tool").default(false).notNull(),
  hasBookingTool: boolean("has_booking_tool").default(false).notNull(),
  hasLiveChat: boolean("has_live_chat").default(false).notNull(),
  hasCrm: boolean("has_crm").default(false).notNull(),
  hasSms: boolean("has_sms").default(false).notNull(),
  score: integer("score").default(0).notNull(),
  detectedAt: timestamp("detected_at").defaultNow().notNull(),
});

/**
 * Lead Lists — saved, filter-defined prospect segments.
 */
export const leadLists = pgTable("lead_lists", {
  id: serial("id").primaryKey(),
  listName: text("list_name").notNull(),
  description: text("description"),
  filters: jsonb("filters").$type<LeadListFilters>().notNull(),
  totalResults: integer("total_results").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * AI Sales Assets — generated cold email / SMS / call script / Loom outline per lead.
 */
export const salesAssets = pgTable(
  "sales_assets",
  {
    id: serial("id").primaryKey(),
    domain: text("domain").notNull(),
    coldEmail: text("cold_email"),
    sms: text("sms"),
    callScript: text("call_script"),
    loomOutline: text("loom_outline"),
    generatedAt: timestamp("generated_at").defaultNow().notNull(),
  },
  (t) => ({
    domainIdx: index("sales_assets_domain_idx").on(t.domain),
  }),
);

/**
 * Discovery Runs — one row per "find local contractors" batch. Logs the
 * targeting (industries + locations), which search provider ran, and the
 * outcome counts so the funnel is auditable.
 */
export const discoveryRuns = pgTable("discovery_runs", {
  id: serial("id").primaryKey(),
  provider: text("provider").notNull(),
  industries: jsonb("industries").$type<string[]>().notNull(),
  locations: jsonb("locations").$type<string[]>().notNull(),
  queriesRun: integer("queries_run").default(0).notNull(),
  candidatesFound: integer("candidates_found").default(0).notNull(),
  newSites: integer("new_sites").default(0).notNull(),
  wordpressSites: integer("wordpress_sites").default(0).notNull(),
  contractorSites: integer("contractor_sites").default(0).notNull(),
  status: text("status").default("completed").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Campaigns — saved trade+location targets that run automatically on a
 * schedule (via Vercel Cron) so new leads keep flowing in without clicks.
 */
export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  industries: jsonb("industries").$type<string[]>().notNull(),
  locations: jsonb("locations").$type<string[]>().notNull(),
  perRunLimit: integer("per_run_limit").default(25).notNull(),
  frequency: text("frequency").default("daily").notNull(), // daily | weekly | manual
  enabled: boolean("enabled").default(true).notNull(),
  lastRunAt: timestamp("last_run_at"),
  lastRunSummary: jsonb("last_run_summary").$type<Record<string, number>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Sequences — a reusable multi-step email drip (step 0 sends first, each later
 * step waits `delayDays` after the previous send).
 */
export const sequences = pgTable("sequences", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  steps: jsonb("steps").$type<SequenceStep[]>().notNull(),
  enabled: boolean("enabled").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/** Enrollment of one lead into one sequence, tracking drip progress. */
export const sequenceEnrollments = pgTable(
  "sequence_enrollments",
  {
    id: serial("id").primaryKey(),
    sequenceId: integer("sequence_id").notNull(),
    domain: text("domain").notNull(),
    status: text("status").default("active").notNull(), // active | completed | stopped | unsubscribed
    currentStep: integer("current_step").default(0).notNull(),
    nextSendAt: timestamp("next_send_at"),
    lastSentAt: timestamp("last_sent_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    domainIdx: index("enrollments_domain_idx").on(t.domain),
    dueIdx: index("enrollments_due_idx").on(t.status, t.nextSendAt),
  }),
);

/** Log of every email we attempted to send (single or sequence step). */
export const emailMessages = pgTable(
  "email_messages",
  {
    id: serial("id").primaryKey(),
    domain: text("domain").notNull(),
    toEmail: text("to_email").notNull(),
    subject: text("subject").notNull(),
    body: text("body").notNull(),
    sequenceId: integer("sequence_id"),
    stepIndex: integer("step_index"),
    status: text("status").notNull(), // sent | failed | skipped
    providerId: text("provider_id"),
    error: text("error"),
    sentAt: timestamp("sent_at").defaultNow().notNull(),
  },
  (t) => ({
    domainIdx: index("email_messages_domain_idx").on(t.domain),
  }),
);

export type SequenceStep = {
  subject: string;
  body: string;
  /** Days to wait before sending this step (relative to the previous send). */
  delayDays: number;
};

export type LeadListFilters = {
  industry?: string;
  city?: string;
  state?: string;
  minScore?: number;
  maxScore?: number;
  wordpressOnly?: boolean;
  elementor?: boolean;
  wpforms?: boolean;
  contactForm7?: boolean;
  gravityForms?: boolean;
  woocommerce?: boolean;
  missingQuoteTool?: boolean;
  missingBookingTool?: boolean;
  /** Only sites that pass both gates: WordPress = yes AND a contractor trade. */
  qualifiedOnly?: boolean;
  /** Only sites that don't yet have an email (targets for enrichment). */
  missingEmail?: boolean;
  /** Only sites we haven't yet run through the email finder. */
  unattemptedEmail?: boolean;
  search?: string;
};

export type Website = typeof websites.$inferSelect;
export type NewWebsite = typeof websites.$inferInsert;
export type TechnologyDetection = typeof technologyDetection.$inferSelect;
export type OpportunityDetection = typeof opportunityDetection.$inferSelect;
export type LeadList = typeof leadLists.$inferSelect;
export type SalesAsset = typeof salesAssets.$inferSelect;
export type DiscoveryRun = typeof discoveryRuns.$inferSelect;
export type Campaign = typeof campaigns.$inferSelect;
export type NewCampaign = typeof campaigns.$inferInsert;
export type Sequence = typeof sequences.$inferSelect;
export type SequenceEnrollment = typeof sequenceEnrollments.$inferSelect;
export type EmailMessage = typeof emailMessages.$inferSelect;
