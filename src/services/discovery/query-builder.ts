import type { Industry } from "@/lib/constants";

/**
 * Search phrasing per industry — how a local contractor in that trade
 * actually describes itself, so queries surface real businesses (not just the
 * literal industry word).
 */
const INDUSTRY_PHRASES: Partial<Record<Industry, string[]>> = {
  Roofing: ["roofing contractor", "roofing company"],
  HVAC: ["hvac contractor", "heating and air conditioning"],
  Plumbing: ["plumber", "plumbing company"],
  Electrical: ["electrician", "electrical contractor"],
  Painting: ["painting contractor", "painters"],
  Drywall: ["drywall contractor", "drywall repair"],
  Remodeling: ["remodeling contractor", "home remodeling"],
  Landscaping: ["landscaping company", "landscaper"],
  Concrete: ["concrete contractor", "concrete company"],
  Flooring: ["flooring contractor", "flooring company"],
};

/** Generic fallback phrasing for any industry not in the map. */
function phrasesFor(industry: string): string[] {
  return INDUSTRY_PHRASES[industry as Industry] ?? [industry.toLowerCase()];
}

/**
 * Build local-contractor search queries from industries × locations.
 * Each industry contributes one phrasing per location to keep the query
 * count (and search-API cost) bounded.
 */
export function buildQueries(industries: string[], locations: string[]): string[] {
  const queries = new Set<string>();
  const locs = locations.length ? locations : [""];

  for (const industry of industries) {
    const phrase = phrasesFor(industry)[0];
    for (const loc of locs) {
      queries.add(loc ? `${phrase} ${loc}` : phrase);
    }
  }
  return [...queries];
}
