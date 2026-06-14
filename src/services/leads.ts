import { and, asc, desc, eq, gte, ilike, inArray, isNull, lte, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import {
  websites,
  technologyDetection,
  opportunityDetection,
  type LeadListFilters,
} from "@/db/schema";
import { CONTRACTOR_INDUSTRIES, PAGE_SIZE } from "@/lib/constants";

export type LeadRow = {
  id: number;
  domain: string;
  companyName: string | null;
  industry: string | null;
  subIndustry: string | null;
  location: string | null;
  city: string | null;
  state: string | null;
  phone: string | null;
  email: string | null;
  contactName: string | null;
  wordpressDetected: boolean;
  contractor: boolean;
  opportunityScore: number;
  suggestedProduct: string | null;
  elementor: boolean;
  wpforms: boolean;
  contactForm7: boolean;
  gravityForms: boolean;
  woocommerce: boolean;
  hasQuoteTool: boolean;
  hasBookingTool: boolean;
  createdAt: Date;
};

export type SortKey = "score" | "newest" | "company";

function buildWhere(filters: LeadListFilters): SQL | undefined {
  const conditions: SQL[] = [];

  if (filters.wordpressOnly) {
    conditions.push(eq(websites.wordpressDetected, true));
  }
  // The two simple gates: WordPress site = yes AND local contractor = yes.
  if (filters.qualifiedOnly) {
    conditions.push(eq(websites.wordpressDetected, true));
    conditions.push(inArray(websites.industry, [...CONTRACTOR_INDUSTRIES]));
  }
  if (filters.industry) {
    conditions.push(eq(websites.industry, filters.industry));
  }
  if (filters.city) {
    conditions.push(ilike(websites.city, filters.city));
  }
  if (filters.state) {
    conditions.push(eq(websites.state, filters.state.toUpperCase()));
  }
  if (typeof filters.minScore === "number") {
    conditions.push(gte(websites.opportunityScore, filters.minScore));
  }
  if (typeof filters.maxScore === "number") {
    conditions.push(lte(websites.opportunityScore, filters.maxScore));
  }
  if (filters.elementor) conditions.push(eq(technologyDetection.elementor, true));
  if (filters.wpforms) conditions.push(eq(technologyDetection.wpforms, true));
  if (filters.contactForm7) conditions.push(eq(technologyDetection.contactForm7, true));
  if (filters.gravityForms) conditions.push(eq(technologyDetection.gravityForms, true));
  if (filters.woocommerce) conditions.push(eq(technologyDetection.woocommerce, true));
  if (filters.missingQuoteTool) {
    conditions.push(
      or(
        eq(opportunityDetection.hasQuoteTool, false),
        sql`${opportunityDetection.domain} is null`,
      )!,
    );
  }
  if (filters.missingEmail) {
    conditions.push(isNull(websites.email));
  }
  if (filters.unattemptedEmail) {
    conditions.push(isNull(websites.emailSource));
  }
  if (filters.missingBookingTool) {
    conditions.push(
      or(
        eq(opportunityDetection.hasBookingTool, false),
        sql`${opportunityDetection.domain} is null`,
      )!,
    );
  }
  if (filters.search) {
    const term = `%${filters.search}%`;
    conditions.push(
      or(
        ilike(websites.domain, term),
        ilike(websites.companyName, term),
        ilike(websites.title, term),
      )!,
    );
  }

  return conditions.length ? and(...conditions) : undefined;
}

export async function queryLeads(
  filters: LeadListFilters,
  opts: { page?: number; pageSize?: number; sort?: SortKey } = {},
): Promise<{ rows: LeadRow[]; total: number; page: number; pageSize: number }> {
  const page = Math.max(1, opts.page ?? 1);
  const pageSize = opts.pageSize ?? PAGE_SIZE;
  const where = buildWhere(filters);

  const orderBy =
    opts.sort === "newest"
      ? desc(websites.createdAt)
      : opts.sort === "company"
        ? asc(websites.companyName)
        : desc(websites.opportunityScore);

  const base = db
    .select({
      id: websites.id,
      domain: websites.domain,
      companyName: websites.companyName,
      industry: websites.industry,
      subIndustry: websites.subIndustry,
      location: websites.location,
      city: websites.city,
      state: websites.state,
      phone: websites.phone,
      email: websites.email,
      contactName: websites.contactName,
      wordpressDetected: websites.wordpressDetected,
      contractor: sql<boolean>`(${websites.industry} = any(${CONTRACTOR_INDUSTRIES}))`,
      opportunityScore: websites.opportunityScore,
      suggestedProduct: websites.suggestedProduct,
      elementor: sql<boolean>`coalesce(${technologyDetection.elementor}, false)`,
      wpforms: sql<boolean>`coalesce(${technologyDetection.wpforms}, false)`,
      contactForm7: sql<boolean>`coalesce(${technologyDetection.contactForm7}, false)`,
      gravityForms: sql<boolean>`coalesce(${technologyDetection.gravityForms}, false)`,
      woocommerce: sql<boolean>`coalesce(${technologyDetection.woocommerce}, false)`,
      hasQuoteTool: sql<boolean>`coalesce(${opportunityDetection.hasQuoteTool}, false)`,
      hasBookingTool: sql<boolean>`coalesce(${opportunityDetection.hasBookingTool}, false)`,
      createdAt: websites.createdAt,
    })
    .from(websites)
    .leftJoin(technologyDetection, eq(technologyDetection.domain, websites.domain))
    .leftJoin(opportunityDetection, eq(opportunityDetection.domain, websites.domain));

  const rows = await (where ? base.where(where) : base)
    .orderBy(orderBy)
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const countBase = db
    .select({ count: sql<number>`count(*)` })
    .from(websites)
    .leftJoin(technologyDetection, eq(technologyDetection.domain, websites.domain))
    .leftJoin(opportunityDetection, eq(opportunityDetection.domain, websites.domain));

  const [{ count }] = await (where ? countBase.where(where) : countBase);

  return { rows: rows as LeadRow[], total: Number(count), page, pageSize };
}

/** Full detail for a single lead: website + technology + opportunity. */
export async function getLeadByDomain(domain: string) {
  const [website] = await db.select().from(websites).where(eq(websites.domain, domain));
  if (!website) return null;

  const [tech] = await db
    .select()
    .from(technologyDetection)
    .where(eq(technologyDetection.domain, domain));
  const [opp] = await db
    .select()
    .from(opportunityDetection)
    .where(eq(opportunityDetection.domain, domain));

  const missingFeatures: string[] = [];
  if (opp) {
    if (!opp.hasQuoteTool) missingFeatures.push("Instant Quote Tool");
    if (!opp.hasBookingTool) missingFeatures.push("Booking Tool");
    if (!opp.hasLiveChat) missingFeatures.push("Live Chat");
    if (!opp.hasCrm) missingFeatures.push("CRM Integration");
    if (!opp.hasSms) missingFeatures.push("SMS Capability");
  }

  return { website, technology: tech ?? null, opportunity: opp ?? null, missingFeatures };
}
