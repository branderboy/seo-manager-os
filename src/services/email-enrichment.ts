import { eq } from "drizzle-orm";
import { db } from "@/db";
import { websites, type LeadListFilters } from "@/db/schema";
import { queryLeads } from "./leads";
import { findEmailForDomain, isEmailFinderEnabled } from "./email-finder";

export type EnrichSummary = {
  enabled: boolean;
  targeted: number;
  attempted: number;
  found: number;
  remaining: number;
  note?: string;
};

/**
 * Bulk email enrichment. Finds leads matching `filters` that have no email
 * yet, runs Hunter Domain Search across them with bounded concurrency, and
 * writes results back. Processes up to `limit` per call; returns how many
 * still have no email so the caller can run again for true scale.
 */
export async function enrichEmails(
  filters: LeadListFilters,
  opts: { limit?: number; concurrency?: number } = {},
): Promise<EnrichSummary> {
  const limit = Math.min(Math.max(opts.limit ?? 100, 1), 300);
  const concurrency = Math.min(Math.max(opts.concurrency ?? 5, 1), 10);

  // Target leads with no email that we haven't already run through Hunter,
  // so repeated calls never retry undiscoverable domains.
  const targetFilters: LeadListFilters = {
    ...filters,
    missingEmail: true,
    unattemptedEmail: true,
  };

  // How many we can still attempt (for the "remaining" count).
  const { total } = await queryLeads(targetFilters, { page: 1, pageSize: 1 });

  if (!isEmailFinderEnabled()) {
    return {
      enabled: false,
      targeted: total,
      attempted: 0,
      found: 0,
      remaining: total,
      note: "Set HUNTER_API_KEY to enable bulk email finding.",
    };
  }

  // Pull this batch of domains to work.
  const { rows } = await queryLeads(targetFilters, {
    page: 1,
    pageSize: limit,
    sort: "score",
  });
  const { attempted, found } = await enrichDomains(
    rows.map((r) => r.domain),
    concurrency,
  );

  return {
    enabled: true,
    targeted: total,
    attempted,
    found,
    // Every attempted domain is now excluded from future runs (found => has
    // email, miss => email_source set), so remaining shrinks each batch.
    remaining: Math.max(0, total - attempted),
  };
}

/**
 * Run Hunter Domain Search across an explicit list of domains (no-op for any
 * that already have an email or were already attempted). Writes results back.
 * Shared by bulk enrichment and one-click campaigns.
 */
export async function enrichDomains(
  domains: string[],
  concurrency = 5,
): Promise<{ attempted: number; found: number }> {
  let attempted = 0;
  let found = 0;
  if (!domains.length || !isEmailFinderEnabled()) return { attempted, found };

  const queue = [...domains];

  async function worker() {
    while (queue.length > 0) {
      const domain = queue.shift();
      if (!domain) break;
      attempted++;
      const result = await findEmailForDomain(domain);
      if (result) {
        found++;
        await db
          .update(websites)
          .set({
            email: result.email,
            contactName: result.contactName,
            emailSource: result.source,
            updatedAt: new Date(),
          })
          .where(eq(websites.domain, domain));
      } else {
        // Mark as attempted-but-not-found so future runs skip it.
        await db
          .update(websites)
          .set({ emailSource: "hunter_none", updatedAt: new Date() })
          .where(eq(websites.domain, domain));
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, domains.length) }, worker),
  );

  return { attempted, found };
}
