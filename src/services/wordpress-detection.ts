import type { SiteSnapshot } from "./site-fetcher";

const WP_SIGNATURES = ["/wp-content/", "/wp-includes/", "/wp-json/"];

export type WordPressResult = {
  detected: boolean;
  signals: string[];
};

/**
 * WordPress detection per spec: scan homepage HTML for /wp-content/,
 * /wp-includes/, or /wp-json/. Also checks headers / generator meta as
 * corroborating signals.
 */
export function detectWordPress(snapshot: SiteSnapshot): WordPressResult {
  const signals: string[] = [];
  const haystack = `${snapshot.html}\n${snapshot.headers}`;

  for (const sig of WP_SIGNATURES) {
    if (haystack.includes(sig)) signals.push(sig);
  }
  if (/<meta[^>]+name=["']generator["'][^>]+wordpress/i.test(snapshot.html)) {
    signals.push("generator:wordpress");
  }
  if (snapshot.headers.includes("x-powered-by") && snapshot.headers.includes("wordpress")) {
    signals.push("header:wordpress");
  }

  return { detected: signals.length > 0, signals };
}
