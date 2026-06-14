import { parse } from "node-html-parser";
import { toHomepageUrl, extractLocation, extractPhone, extractEmail } from "@/lib/utils";

export type SiteSnapshot = {
  domain: string;
  url: string;
  ok: boolean;
  status: number;
  /** Lowercased raw HTML for signature matching. */
  html: string;
  /** Lowercased response header string blob (server, x-powered-by, link, etc.). */
  headers: string;
  title: string | null;
  metaDescription: string | null;
  h1: string | null;
  bodyText: string;
  footerText: string;
  phone: string | null;
  email: string | null;
  location: string | null;
  city: string | null;
  state: string | null;
  error?: string;
};

const FETCH_TIMEOUT_MS = 12_000;
const MAX_HTML_BYTES = 1_500_000;

/**
 * Fetch a site's homepage and extract everything the downstream pipeline needs
 * in a single network round-trip.
 */
export async function fetchSiteSnapshot(domain: string): Promise<SiteSnapshot> {
  const url = toHomepageUrl(domain);
  const base: SiteSnapshot = {
    domain,
    url,
    ok: false,
    status: 0,
    html: "",
    headers: "",
    title: null,
    metaDescription: null,
    h1: null,
    bodyText: "",
    footerText: "",
    phone: null,
    email: null,
    location: null,
    city: null,
    state: null,
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; WPProspectorBot/1.0; +https://wpprospector.com/bot)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    const headerBlob = [...res.headers.entries()]
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n")
      .toLowerCase();

    const rawHtml = (await res.text()).slice(0, MAX_HTML_BYTES);
    const html = rawHtml.toLowerCase();

    const root = parse(rawHtml);
    const title = root.querySelector("title")?.text?.trim() || null;
    const metaDescription =
      root.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() || null;
    const h1 = root.querySelector("h1")?.text?.trim() || null;

    // Strip scripts/styles before reading text.
    root.querySelectorAll("script, style, noscript").forEach((n) => n.remove());
    const bodyText = root.querySelector("body")?.text?.replace(/\s+/g, " ").trim().slice(0, 8000) ?? "";
    const footerText =
      root.querySelector("footer")?.text?.replace(/\s+/g, " ").trim().slice(0, 2000) ?? "";

    const searchText = `${footerText}\n${bodyText}`;
    const loc = extractLocation(searchText);

    return {
      ...base,
      ok: res.ok,
      status: res.status,
      html,
      headers: headerBlob,
      title,
      metaDescription,
      h1,
      bodyText,
      footerText,
      phone: extractPhone(searchText),
      email: extractEmail(rawHtml),
      location: loc.location,
      city: loc.city,
      state: loc.state,
    };
  } catch (err) {
    return {
      ...base,
      error: err instanceof Error ? err.message : "fetch failed",
    };
  } finally {
    clearTimeout(timer);
  }
}
