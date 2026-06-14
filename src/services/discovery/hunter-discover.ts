/**
 * Hunter.io Discover as a discovery source.
 *
 * Discover is a B2B company database with structured filters. We query it for
 * WordPress sites in the target locations and let our own pipeline confirm
 * WordPress and classify the exact contractor trade (Hunter's `industry`
 * taxonomy is too coarse for trades like Roofing/HVAC).
 *
 * Endpoint: POST https://api.hunter.io/v2/discover?api_key=KEY
 * Requires a paid Hunter plan with advanced Discover filters (technology).
 *
 * Note: the `industry` taxonomy differs from ours, so by default we do NOT
 * send an industry filter — set HUNTER_DISCOVER_INDUSTRIES (comma-separated,
 * using Hunter's exact taxonomy, e.g. "Construction") to narrow server-side.
 */
import { normalizeDomain } from "@/lib/utils";

export function isHunterDiscoverEnabled(): boolean {
  return Boolean(process.env.HUNTER_API_KEY);
}

type LocationFilter = { city?: string; state?: string; country?: string };

function buildLocationFilter(locations: string[]): { include: LocationFilter[] } {
  const include: LocationFilter[] = [];
  for (const loc of locations) {
    const [city] = loc.split(",").map((s) => s.trim());
    if (city) include.push({ city });
  }
  // Default to US when no specific cities were given.
  include.push({ country: "US" });
  return { include };
}

type DiscoverBody = Record<string, unknown>;

function buildBody(locations: string[]): DiscoverBody {
  const body: DiscoverBody = {
    technology: { match: "any", include: ["wordpress"] },
    headquarters_location: buildLocationFilter(locations),
  };

  const industries = process.env.HUNTER_DISCOVER_INDUSTRIES;
  if (industries) {
    body.industry = {
      include: industries.split(",").map((s) => s.trim()).filter(Boolean),
    };
  }
  return body;
}

/**
 * Returns candidate domains from Hunter Discover. On any error (bad plan,
 * schema drift, rate limit) it logs and returns [] so discovery degrades
 * gracefully instead of failing the whole run.
 */
export async function hunterDiscover(
  locations: string[],
  limit: number,
): Promise<string[]> {
  const apiKey = process.env.HUNTER_API_KEY;
  if (!apiKey) return [];

  const url = new URL("https://api.hunter.io/v2/discover");
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("limit", String(Math.min(Math.max(limit, 1), 100)));

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildBody(locations)),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      console.error(`[hunter-discover] ${res.status}: ${await res.text()}`);
      return [];
    }
    const json = await res.json();
    const rows: Array<{ domain?: string; organization?: string }> = json?.data ?? [];
    return rows
      .map((r) => r.domain)
      .filter((d): d is string => Boolean(d))
      .map((d) => normalizeDomain(d));
  } catch (err) {
    console.error("[hunter-discover] request failed:", err);
    return [];
  }
}
