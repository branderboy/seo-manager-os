import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  websites,
  technologyDetection,
  opportunityDetection,
} from "@/db/schema";
import { normalizeDomain } from "@/lib/utils";
import { fetchSiteSnapshot } from "./site-fetcher";
import { detectWordPress } from "./wordpress-detection";
import { detectTechnologies } from "./technology-detection";
import { scoreOpportunity } from "./opportunity";
import { classifyBusiness } from "./classification";
import { suggestProduct } from "./suggested-product";
import { findEmailForDomain, isEmailFinderEnabled } from "./email-finder";

export type ScanResult = {
  domain: string;
  ok: boolean;
  wordpressDetected: boolean;
  industry: string | null;
  opportunityScore: number;
  suggestedProduct: string | null;
  error?: string;
};

/**
 * Runs the full 6-step pipeline for one domain and upserts everything:
 *   1. Discover  -> fetch homepage snapshot
 *   2. Extract   -> company/contact/location from snapshot
 *   3. Classify  -> industry + sub-industry (AI w/ keyword fallback)
 *   4. Detect    -> WordPress + plugin/technology fingerprints
 *   5. Score     -> opportunity gap analysis
 *   6. Persist   -> websites + technology_detection + opportunity_detection
 */
export async function scanDomain(
  rawDomain: string,
  source: string = "manual",
): Promise<ScanResult> {
  const domain = normalizeDomain(rawDomain);
  if (!domain || !domain.includes(".")) {
    return {
      domain: rawDomain,
      ok: false,
      wordpressDetected: false,
      industry: null,
      opportunityScore: 0,
      suggestedProduct: null,
      error: "Invalid domain",
    };
  }

  // 1. Discover
  const snapshot = await fetchSiteSnapshot(domain);
  if (!snapshot.ok) {
    // Still record the attempt so we don't re-scan dead domains constantly.
    await db
      .insert(websites)
      .values({ domain, source, lastScannedAt: new Date(), wordpressDetected: false })
      .onConflictDoUpdate({
        target: websites.domain,
        set: { lastScannedAt: new Date(), updatedAt: new Date() },
      });
    return {
      domain,
      ok: false,
      wordpressDetected: false,
      industry: null,
      opportunityScore: 0,
      suggestedProduct: null,
      error: snapshot.error ?? `HTTP ${snapshot.status}`,
    };
  }

  // 4a. WordPress + technology detection
  const wp = detectWordPress(snapshot);
  const tech = detectTechnologies(snapshot, wp);

  // 5. Opportunity scoring
  const opportunity = scoreOpportunity(snapshot, tech);

  // 3. Classification (only worth the AI spend on real WP sites, but we run it
  //    regardless so non-WP sites still get an industry for completeness).
  const classification = await classifyBusiness(snapshot);

  // Suggested product
  const hasSeoPlugin = tech.rankMath || tech.yoast;
  const suggestedProduct = suggestProduct(
    classification.industry || null,
    opportunity,
    snapshot,
    hasSeoPlugin,
  );

  const companyName =
    snapshot.title?.split(/[|\-–—]/)[0]?.trim() || domain;

  // Email enrichment: only hit Hunter when the homepage didn't expose an email.
  let email = snapshot.email;
  let contactName: string | null = null;
  let emailSource: string | null = email ? "homepage" : null;
  if (!email && isEmailFinderEnabled()) {
    const found = await findEmailForDomain(domain);
    if (found) {
      email = found.email;
      contactName = found.contactName;
      emailSource = found.source;
    } else {
      // Attempted but nothing found — mark so bulk runs don't retry it.
      emailSource = "hunter_none";
    }
  }

  // 6. Persist — websites
  await db
    .insert(websites)
    .values({
      domain,
      companyName,
      title: snapshot.title,
      metaDescription: snapshot.metaDescription,
      location: snapshot.location,
      city: snapshot.city,
      state: snapshot.state,
      phone: snapshot.phone,
      email,
      contactName,
      emailSource,
      wordpressDetected: wp.detected,
      industry: classification.industry || null,
      subIndustry: classification.subIndustry || null,
      classificationConfidence: classification.confidence,
      opportunityScore: opportunity.score,
      suggestedProduct,
      source,
      lastScannedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: websites.domain,
      set: {
        companyName,
        title: snapshot.title,
        metaDescription: snapshot.metaDescription,
        location: snapshot.location,
        city: snapshot.city,
        state: snapshot.state,
        phone: snapshot.phone,
        email: snapshot.email,
        wordpressDetected: wp.detected,
        industry: classification.industry || null,
        subIndustry: classification.subIndustry || null,
        classificationConfidence: classification.confidence,
        opportunityScore: opportunity.score,
        suggestedProduct,
        lastScannedAt: new Date(),
        updatedAt: new Date(),
      },
    });

  // 6. Persist — technology_detection
  await db
    .insert(technologyDetection)
    .values({ domain, ...tech })
    .onConflictDoUpdate({
      target: technologyDetection.domain,
      set: { ...tech, detectedAt: new Date() },
    });

  // 6. Persist — opportunity_detection
  await db
    .insert(opportunityDetection)
    .values({
      domain,
      hasQuoteTool: opportunity.hasQuoteTool,
      hasBookingTool: opportunity.hasBookingTool,
      hasLiveChat: opportunity.hasLiveChat,
      hasCrm: opportunity.hasCrm,
      hasSms: opportunity.hasSms,
      score: opportunity.score,
    })
    .onConflictDoUpdate({
      target: opportunityDetection.domain,
      set: {
        hasQuoteTool: opportunity.hasQuoteTool,
        hasBookingTool: opportunity.hasBookingTool,
        hasLiveChat: opportunity.hasLiveChat,
        hasCrm: opportunity.hasCrm,
        hasSms: opportunity.hasSms,
        score: opportunity.score,
        detectedAt: new Date(),
      },
    });

  return {
    domain,
    ok: true,
    wordpressDetected: wp.detected,
    industry: classification.industry || null,
    opportunityScore: opportunity.score,
    suggestedProduct,
  };
}

/** Scan many domains with bounded concurrency. */
export async function scanDomains(
  domains: string[],
  concurrency = 4,
  source: string = "manual",
): Promise<ScanResult[]> {
  const results: ScanResult[] = [];
  const queue = [...domains];

  async function worker() {
    while (queue.length > 0) {
      const next = queue.shift();
      if (!next) break;
      try {
        results.push(await scanDomain(next, source));
      } catch (err) {
        results.push({
          domain: next,
          ok: false,
          wordpressDetected: false,
          industry: null,
          opportunityScore: 0,
          suggestedProduct: null,
          error: err instanceof Error ? err.message : "scan failed",
        });
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, domains.length) }, worker),
  );
  return results;
}

/** Recompute aggregate dashboard metrics. */
export async function getDashboardStats() {
  const [row] = await db
    .select({
      totalWordPress: sql<number>`count(*) filter (where ${websites.wordpressDetected} = true)`,
      totalContractors: sql<number>`count(*) filter (where ${websites.industry} is not null)`,
      totalOpportunities: sql<number>`count(*) filter (where ${websites.opportunityScore} >= 70)`,
      avgScore: sql<number>`coalesce(avg(${websites.opportunityScore}), 0)`,
      newSites: sql<number>`count(*) filter (where ${websites.createdAt} >= now() - interval '7 days')`,
      total: sql<number>`count(*)`,
    })
    .from(websites);

  return {
    totalWordPressSites: Number(row?.totalWordPress ?? 0),
    totalContractors: Number(row?.totalContractors ?? 0),
    totalOpportunities: Number(row?.totalOpportunities ?? 0),
    averageOpportunityScore: Math.round(Number(row?.avgScore ?? 0)),
    newSitesFound: Number(row?.newSites ?? 0),
    totalSites: Number(row?.total ?? 0),
  };
}
