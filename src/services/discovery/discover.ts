import { inArray } from "drizzle-orm";
import { db } from "@/db";
import { websites, discoveryRuns } from "@/db/schema";
import { CONTRACTOR_INDUSTRIES, isDirectoryDomain, type Industry } from "@/lib/constants";
import { normalizeDomain } from "@/lib/utils";
import { scanDomains, type ScanResult } from "../scanner";
import { getSearchProvider } from "./provider";
import { buildQueries } from "./query-builder";

export type DiscoverInput = {
  industries: string[];
  locations: string[];
  /** Max candidate domains to actually scan (bounds runtime + AI cost). */
  limit?: number;
  perQuery?: number;
};

export type DiscoverSummary = {
  provider: string;
  queriesRun: number;
  candidatesFound: number;
  newSites: number;
  scanned: number;
  wordpressSites: number;
  contractorSites: number;
  results: ScanResult[];
  note?: string;
};

const isContractor = (industry: string | null) =>
  !!industry && CONTRACTOR_INDUSTRIES.includes(industry as Industry);

/**
 * Full discovery funnel for local contractors:
 *   1. Build queries from industries × locations
 *   2. Search each query for candidate domains
 *   3. Drop directories/aggregators + dedupe + flag which are new
 *   4. Run candidates through the scan pipeline (WordPress + classify + score)
 *   5. Log the run and return funnel counts
 */
export async function discoverContractors(input: DiscoverInput): Promise<DiscoverSummary> {
  const provider = getSearchProvider();
  const limit = Math.min(Math.max(input.limit ?? 25, 1), 50);
  const perQuery = Math.min(Math.max(input.perQuery ?? 10, 1), 20);

  const queries = buildQueries(input.industries, input.locations);

  // 2-3. Search + filter + dedupe.
  const candidates = new Set<string>();
  for (const q of queries) {
    if (candidates.size >= limit * 2) break;
    try {
      const domains = await provider.search(q, perQuery);
      for (const raw of domains) {
        const domain = normalizeDomain(raw);
        if (!domain || !domain.includes(".")) continue;
        if (isDirectoryDomain(domain)) continue;
        candidates.add(domain);
      }
    } catch (err) {
      console.error(`[discover] query failed: "${q}"`, err);
    }
  }

  const candidateList = [...candidates];

  // Which candidates are brand new (not already in our DB)?
  let knownDomains = new Set<string>();
  if (candidateList.length) {
    const existing = await db
      .select({ domain: websites.domain })
      .from(websites)
      .where(inArray(websites.domain, candidateList));
    knownDomains = new Set(existing.map((e) => e.domain));
  }
  const newSites = candidateList.filter((d) => !knownDomains.has(d)).length;

  // 4. Scan up to `limit` candidates (prioritize new ones).
  const toScan = [
    ...candidateList.filter((d) => !knownDomains.has(d)),
    ...candidateList.filter((d) => knownDomains.has(d)),
  ].slice(0, limit);

  const results = await scanDomains(toScan, 4, "discovery");

  const wordpressSites = results.filter((r) => r.wordpressDetected).length;
  const contractorSites = results.filter((r) => isContractor(r.industry)).length;

  // 5. Log the run.
  await db.insert(discoveryRuns).values({
    provider: provider.name,
    industries: input.industries,
    locations: input.locations,
    queriesRun: queries.length,
    candidatesFound: candidateList.length,
    newSites,
    wordpressSites,
    contractorSites,
  });

  const summary: DiscoverSummary = {
    provider: provider.name,
    queriesRun: queries.length,
    candidatesFound: candidateList.length,
    newSites,
    scanned: results.length,
    wordpressSites,
    contractorSites,
    results,
  };

  if (provider.name === "mock") {
    summary.note =
      "No search provider configured (DISCOVERY_PROVIDER / SERPER_API_KEY). " +
      "Set one to pull live candidates, or paste domains under “Scan domains”.";
  }

  return summary;
}
