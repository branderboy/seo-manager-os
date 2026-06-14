import { inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { websites, discoveryRuns } from "@/db/schema";
import { CONTRACTOR_INDUSTRIES, isDirectoryDomain, type Industry } from "@/lib/constants";
import { normalizeDomain } from "@/lib/utils";
import { scanDomains, type ScanResult } from "../scanner";
import { getSearchProvider } from "./provider";
import { buildQueries } from "./query-builder";
import { hunterDiscover, isHunterDiscoverEnabled } from "./hunter-discover";

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
  emailsFound: number;
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
  const limit = Math.min(Math.max(input.limit ?? 25, 1), 50);
  const perQuery = Math.min(Math.max(input.perQuery ?? 10, 1), 20);

  // Source candidate domains from either Hunter Discover or a web-search
  // provider, depending on DISCOVERY_PROVIDER.
  const useHunter =
    (process.env.DISCOVERY_PROVIDER || "").toLowerCase() === "hunter" &&
    isHunterDiscoverEnabled();

  let providerName: string;
  let queriesRun: number;
  const candidates = new Set<string>();

  if (useHunter) {
    providerName = "hunter-discover";
    queriesRun = 1;
    const domains = await hunterDiscover(input.locations, limit * 2);
    for (const raw of domains) {
      const domain = normalizeDomain(raw);
      if (!domain || !domain.includes(".")) continue;
      if (isDirectoryDomain(domain)) continue;
      candidates.add(domain);
    }
  } else {
    const provider = getSearchProvider();
    providerName = provider.name;
    const queries = buildQueries(input.industries, input.locations);
    queriesRun = queries.length;
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

  // Emails are found inline by the scanner; count how many scanned domains
  // ended up with a contact email.
  const scannedDomains = results.filter((r) => r.ok).map((r) => r.domain);
  let emailsFound = 0;
  if (scannedDomains.length) {
    const [row] = await db
      .select({
        count: sql<number>`count(*) filter (where ${websites.email} is not null)`,
      })
      .from(websites)
      .where(inArray(websites.domain, scannedDomains));
    emailsFound = Number(row?.count ?? 0);
  }

  // 5. Log the run.
  await db.insert(discoveryRuns).values({
    provider: providerName,
    industries: input.industries,
    locations: input.locations,
    queriesRun,
    candidatesFound: candidateList.length,
    newSites,
    wordpressSites,
    contractorSites,
  });

  const summary: DiscoverSummary = {
    provider: providerName,
    queriesRun,
    candidatesFound: candidateList.length,
    newSites,
    scanned: results.length,
    wordpressSites,
    contractorSites,
    emailsFound,
    results,
  };

  if (providerName === "mock") {
    summary.note =
      "No discovery source configured. Set DISCOVERY_PROVIDER to \"serper\" " +
      "(+ SERPER_API_KEY) or \"hunter\" (+ HUNTER_API_KEY), or paste domains " +
      "under “Scan domains”.";
  } else if (useHunter && candidateList.length === 0) {
    summary.note =
      "Hunter Discover returned no candidates. The technology filter needs a " +
      "paid Hunter plan with advanced Discover filters; check your plan/locations.";
  }

  return summary;
}
