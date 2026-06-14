import { INDUSTRIES, type Industry } from "@/lib/constants";
import { getAiProvider, parseJsonLoose } from "./ai/provider";
import type { SiteSnapshot } from "./site-fetcher";

export type ClassificationResult = {
  industry: string;
  subIndustry: string;
  confidence: number;
  method: "ai" | "keyword" | "none";
};

/** Lightweight keyword heuristic used as a fallback and to validate AI output. */
const KEYWORDS: Record<Industry, string[]> = {
  Roofing: ["roof", "roofer", "shingle", "re-roof", "gutter"],
  HVAC: ["hvac", "heating", "air conditioning", "furnace", "ac repair", "cooling"],
  Plumbing: ["plumb", "plumber", "drain", "water heater", "leak", "sewer"],
  Electrical: ["electric", "electrician", "wiring", "panel upgrade", "lighting install"],
  Painting: ["paint", "painter", "interior painting", "exterior painting"],
  Drywall: ["drywall", "sheetrock", "plaster", "taping"],
  Remodeling: ["remodel", "renovation", "kitchen remodel", "bathroom remodel", "contractor"],
  Landscaping: ["landscap", "lawn", "irrigation", "hardscape", "tree service"],
  Concrete: ["concrete", "paving", "driveway", "foundation", "masonry"],
  Flooring: ["flooring", "hardwood floor", "tile install", "carpet", "laminate"],
  Dentist: ["dentist", "dental", "orthodont", "teeth", "implants"],
  Attorney: ["attorney", "law firm", "lawyer", "legal", "litigation"],
  Chiropractor: ["chiropract", "spinal", "adjustment", "back pain"],
  "Med Spa": ["med spa", "medspa", "botox", "filler", "aesthetic", "laser"],
  Church: ["church", "ministry", "worship", "sermon", "congregation"],
  Restaurant: ["restaurant", "menu", "dine", "reservation", "cuisine"],
  "Event Planner": ["event planner", "wedding planner", "events", "catering", "venue"],
  "Real Estate": ["real estate", "realtor", "homes for sale", "listings", "broker"],
  Insurance: ["insurance", "policy", "coverage", "agent", "premium"],
};

function keywordClassify(snapshot: SiteSnapshot): ClassificationResult {
  const text = [
    snapshot.title,
    snapshot.metaDescription,
    snapshot.h1,
    snapshot.bodyText,
    snapshot.footerText,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  let best: { industry: Industry; hits: number } | null = null;
  for (const industry of INDUSTRIES) {
    const hits = KEYWORDS[industry].reduce(
      (acc, kw) => acc + (text.includes(kw) ? 1 : 0),
      0,
    );
    if (hits > 0 && (!best || hits > best.hits)) best = { industry, hits };
  }

  if (!best) return { industry: "", subIndustry: "", confidence: 0, method: "none" };
  // 1 hit ~0.45, 3+ hits => ~0.85.
  const confidence = Math.min(0.9, 0.3 + best.hits * 0.18);
  return {
    industry: best.industry,
    subIndustry: "",
    confidence: Number(confidence.toFixed(2)),
    method: "keyword",
  };
}

const SYSTEM_PROMPT = `You are a business classification engine for a B2B sales intelligence tool.
Given a website's homepage signals, classify the business into exactly one industry
from this fixed list:
${INDUSTRIES.join(", ")}.

Rules:
- "industry" MUST be one of the listed values verbatim, or "" if none fit.
- "sub_industry" is a short, specific niche (e.g. "Commercial Roofing", "Family Law").
- "confidence" is a number from 0 to 1.
Respond ONLY with JSON: {"industry": "", "sub_industry": "", "confidence": 0}`;

/**
 * Classify a business by analyzing homepage title, meta description, H1, main
 * content, and footer. Uses the configured AI provider, falling back to the
 * keyword heuristic when AI is unavailable or returns nothing usable.
 */
export async function classifyBusiness(
  snapshot: SiteSnapshot,
): Promise<ClassificationResult> {
  const fallback = keywordClassify(snapshot);

  const provider = getAiProvider();
  if (provider.name === "mock") return fallback;

  const userPrompt = `Classify this business.
TITLE: ${snapshot.title ?? ""}
META DESCRIPTION: ${snapshot.metaDescription ?? ""}
H1: ${snapshot.h1 ?? ""}
FOOTER: ${snapshot.footerText.slice(0, 600)}
MAIN CONTENT: ${snapshot.bodyText.slice(0, 2500)}`;

  try {
    const raw = await provider.complete(
      [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      { json: true },
    );
    const parsed = parseJsonLoose<{
      industry?: string;
      sub_industry?: string;
      confidence?: number;
    }>(raw);

    if (parsed && parsed.industry) {
      const matched = INDUSTRIES.find(
        (i) => i.toLowerCase() === String(parsed.industry).toLowerCase(),
      );
      if (matched) {
        return {
          industry: matched,
          subIndustry: parsed.sub_industry ?? "",
          confidence:
            typeof parsed.confidence === "number"
              ? Number(Math.max(0, Math.min(1, parsed.confidence)).toFixed(2))
              : 0.7,
          method: "ai",
        };
      }
    }
  } catch (err) {
    console.error("[classification] AI provider failed, using keyword fallback:", err);
  }

  return fallback;
}
