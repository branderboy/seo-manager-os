/**
 * Email enrichment via Hunter.io Domain Search.
 * Given a domain, returns the best contact email (+ name when available).
 * No-ops when HUNTER_API_KEY is unset, so scans still work without it.
 */

export type EmailResult = {
  email: string;
  contactName: string | null;
  confidence: number | null;
  source: "hunter";
};

type HunterEmail = {
  value: string;
  type?: "personal" | "generic";
  confidence?: number;
  first_name?: string | null;
  last_name?: string | null;
  position?: string | null;
};

export function isEmailFinderEnabled(): boolean {
  return Boolean(process.env.HUNTER_API_KEY);
}

/** Pick the strongest contact: prefer a confident personal email, then any. */
function pickBest(emails: HunterEmail[]): HunterEmail | null {
  if (!emails.length) return null;
  const score = (e: HunterEmail) =>
    (e.type === "personal" ? 1000 : 0) + (e.confidence ?? 0);
  return [...emails].sort((a, b) => score(b) - score(a))[0];
}

export async function findEmailForDomain(domain: string): Promise<EmailResult | null> {
  const apiKey = process.env.HUNTER_API_KEY;
  if (!apiKey) return null;

  try {
    const url = new URL("https://api.hunter.io/v2/domain-search");
    url.searchParams.set("domain", domain);
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("limit", "10");

    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) {
      console.error(`[email-finder] Hunter ${res.status} for ${domain}`);
      return null;
    }
    const data = await res.json();
    const best = pickBest((data?.data?.emails ?? []) as HunterEmail[]);
    if (!best?.value) return null;

    const name = [best.first_name, best.last_name].filter(Boolean).join(" ").trim();
    return {
      email: best.value,
      contactName: name || null,
      confidence: best.confidence ?? null,
      source: "hunter",
    };
  } catch (err) {
    console.error(`[email-finder] failed for ${domain}:`, err);
    return null;
  }
}
