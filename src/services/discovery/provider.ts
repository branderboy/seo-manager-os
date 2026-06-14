/**
 * Search-provider abstraction for discovery. Given a query like
 * "roofing contractor Austin TX", a provider returns candidate website
 * domains. Swap providers with DISCOVERY_PROVIDER; falls back to a no-op
 * mock when no key is configured so the app still runs offline.
 */
import { normalizeDomain } from "@/lib/utils";

export interface SearchProvider {
  readonly name: string;
  /** Returns candidate domains (already normalized) for a single query. */
  search(query: string, limit: number): Promise<string[]>;
}

/** Serper.dev — Google Search results as JSON. */
class SerperProvider implements SearchProvider {
  readonly name = "serper";
  constructor(private apiKey: string) {}

  async search(query: string, limit: number): Promise<string[]> {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": this.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: query, num: Math.min(limit, 20) }),
    });
    if (!res.ok) {
      throw new Error(`Serper error ${res.status}: ${await res.text()}`);
    }
    const data = await res.json();
    const organic: Array<{ link?: string }> = data.organic ?? [];
    return organic.map((r) => r.link).filter(Boolean).map((l) => normalizeDomain(l!));
  }
}

/** Google Programmable Search Engine (Custom Search JSON API). */
class GoogleCseProvider implements SearchProvider {
  readonly name = "google-cse";
  constructor(
    private apiKey: string,
    private cx: string,
  ) {}

  async search(query: string, limit: number): Promise<string[]> {
    const url = new URL("https://www.googleapis.com/customsearch/v1");
    url.searchParams.set("key", this.apiKey);
    url.searchParams.set("cx", this.cx);
    url.searchParams.set("q", query);
    url.searchParams.set("num", String(Math.min(limit, 10)));
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Google CSE error ${res.status}: ${await res.text()}`);
    }
    const data = await res.json();
    const items: Array<{ link?: string }> = data.items ?? [];
    return items.map((r) => r.link).filter(Boolean).map((l) => normalizeDomain(l!));
  }
}

/** Offline fallback — returns nothing, so discovery degrades gracefully. */
class MockSearchProvider implements SearchProvider {
  readonly name = "mock";
  async search(): Promise<string[]> {
    return [];
  }
}

let cached: SearchProvider | null = null;

export function getSearchProvider(): SearchProvider {
  if (cached) return cached;
  const provider = (process.env.DISCOVERY_PROVIDER || "").toLowerCase();

  if (provider === "serper" && process.env.SERPER_API_KEY) {
    cached = new SerperProvider(process.env.SERPER_API_KEY);
  } else if (
    provider === "google" &&
    process.env.GOOGLE_CSE_KEY &&
    process.env.GOOGLE_CSE_CX
  ) {
    cached = new GoogleCseProvider(process.env.GOOGLE_CSE_KEY, process.env.GOOGLE_CSE_CX);
  } else if (process.env.SERPER_API_KEY) {
    cached = new SerperProvider(process.env.SERPER_API_KEY);
  } else {
    cached = new MockSearchProvider();
  }
  return cached;
}
