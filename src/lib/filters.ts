import type { LeadListFilters } from "@/db/schema";
import type { SortKey } from "@/services/leads";

/** Parse URL search params (from a request or a page) into typed filters. */
export function parseFilters(params: URLSearchParams): LeadListFilters {
  const bool = (key: string) => params.get(key) === "true" || params.get(key) === "1";
  const num = (key: string) => {
    const v = params.get(key);
    if (v === null || v === "") return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };
  const str = (key: string) => params.get(key)?.trim() || undefined;

  return {
    industry: str("industry"),
    city: str("city"),
    state: str("state"),
    minScore: num("minScore"),
    maxScore: num("maxScore"),
    wordpressOnly: params.has("wordpressOnly") ? bool("wordpressOnly") : undefined,
    elementor: bool("elementor") || undefined,
    wpforms: bool("wpforms") || undefined,
    contactForm7: bool("contactForm7") || undefined,
    gravityForms: bool("gravityForms") || undefined,
    woocommerce: bool("woocommerce") || undefined,
    missingQuoteTool: bool("missingQuoteTool") || undefined,
    missingBookingTool: bool("missingBookingTool") || undefined,
    search: str("search"),
  };
}

export function parseSort(params: URLSearchParams): SortKey {
  const s = params.get("sort");
  if (s === "newest" || s === "company") return s;
  return "score";
}

/** Serialize filters back to a query string (for links / saved lists). */
export function filtersToQuery(filters: LeadListFilters): string {
  const p = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === "" || value === false) continue;
    p.set(key, String(value));
  }
  return p.toString();
}
