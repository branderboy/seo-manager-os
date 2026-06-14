/**
 * Normalize a user-supplied URL or bare domain into a canonical hostname.
 * "https://www.Acme-Roofing.com/contact" -> "acme-roofing.com"
 */
export function normalizeDomain(input: string): string {
  let value = input.trim().toLowerCase();
  value = value.replace(/^https?:\/\//, "");
  value = value.replace(/^www\./, "");
  value = value.split("/")[0];
  value = value.split("?")[0];
  value = value.split("#")[0];
  return value.trim();
}

export function toHomepageUrl(domain: string): string {
  const clean = normalizeDomain(domain);
  return `https://${clean}/`;
}

export function classNames(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function scoreColor(score: number): string {
  if (score >= 80) return "bg-emerald-100 text-emerald-800";
  if (score >= 50) return "bg-amber-100 text-amber-800";
  return "bg-slate-100 text-slate-600";
}

export function formatDate(value: Date | string | null | undefined): string {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Pull a likely US "City, ST" location string out of free text. */
export function extractLocation(text: string): {
  location: string | null;
  city: string | null;
  state: string | null;
} {
  const match = text.match(/([A-Z][a-zA-Z.\s]+),\s*([A-Z]{2})\b/);
  if (!match) return { location: null, city: null, state: null };
  const city = match[1].trim();
  const state = match[2].trim();
  return { location: `${city}, ${state}`, city, state };
}

export function extractPhone(text: string): string | null {
  const match = text.match(/(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  return match ? match[0].trim() : null;
}

export function extractEmail(text: string): string | null {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (!match) return null;
  // Skip obvious asset / placeholder emails.
  const email = match[0].toLowerCase();
  if (/\.(png|jpg|jpeg|gif|svg|webp)$/.test(email)) return null;
  return email;
}
