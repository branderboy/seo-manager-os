// ─────────────────────────────────────────────────────────────────────────────
// SEO Manager OS · Tracker mock data
// Continuous monitoring surface: search-ranking tracking + LLM/AI-mention
// tracking for the active engagement (Northwind Heating & Air, Austin TX).
// Illustrative only · no backend; numbers are worked to read like a real account.
// ─────────────────────────────────────────────────────────────────────────────

export type Trend = "up" | "down" | "flat";
export type Intent = "Local" | "Commercial" | "Transactional" | "Informational";
export type SerpFeature =
  | "Local Pack"
  | "AI Overview"
  | "Featured Snippet"
  | "People Also Ask"
  | "Reviews"
  | "Sitelinks";

// ── Headline tracker scorecards ──────────────────────────────────────────────
export type TrackerStat = {
  key: string;
  label: string;
  value: string;
  delta: number; // change vs last scan (positive = improvement)
  blurb: string;
};

export const trackerStats: TrackerStat[] = [
  { key: "keywords", label: "Tracked Keywords", value: "184", delta: +12, blurb: "Across 3 locations · desktop + mobile, daily scans." },
  { key: "avgpos", label: "Avg. Position", value: "14.2", delta: +1.6, blurb: "Mean rank across all tracked terms (lower is better)." },
  { key: "top3", label: "Top-3 Keywords", value: "29", delta: +4, blurb: "Terms ranking in positions 1 to 3 this period." },
  { key: "aimentions", label: "AI Mention Rate", value: "31%", delta: -6, blurb: "Share of tracked prompts that cite or mention the brand." },
];

// ── Search-ranking tracking ──────────────────────────────────────────────────
export type RankedKeyword = {
  keyword: string;
  position: number; // 0 = not ranking
  previous: number;
  best: number;
  volume: number;
  intent: Intent;
  url: string;
  features: SerpFeature[];
  location: string;
};

export const rankedKeywords: RankedKeyword[] = [
  { keyword: "ac repair austin", position: 3, previous: 5, best: 2, volume: 4400, intent: "Local", url: "/services/ac-repair", features: ["Local Pack", "Reviews"], location: "Austin, TX" },
  { keyword: "hvac company near me", position: 6, previous: 6, best: 4, volume: 8100, intent: "Local", url: "/", features: ["Local Pack", "AI Overview"], location: "Austin, TX" },
  { keyword: "emergency ac repair", position: 2, previous: 4, best: 2, volume: 2900, intent: "Transactional", url: "/services/emergency-ac", features: ["Local Pack"], location: "Austin, TX" },
  { keyword: "furnace replacement cost", position: 11, previous: 9, best: 8, volume: 1600, intent: "Commercial", url: "/services/furnace-replacement", features: ["People Also Ask", "AI Overview"], location: "Austin, TX" },
  { keyword: "ac installation round rock", position: 8, previous: 14, best: 8, volume: 880, intent: "Transactional", url: "/locations/round-rock", features: ["Local Pack"], location: "Round Rock, TX" },
  { keyword: "best hvac contractor austin", position: 5, previous: 7, best: 5, volume: 1300, intent: "Commercial", url: "/", features: ["Local Pack", "Reviews", "AI Overview"], location: "Austin, TX" },
  { keyword: "heat pump installation", position: 18, previous: 22, best: 15, volume: 2400, intent: "Commercial", url: "/services/heat-pumps", features: ["People Also Ask"], location: "Austin, TX" },
  { keyword: "duct cleaning austin", position: 24, previous: 19, best: 12, volume: 1900, intent: "Local", url: "/services/duct-cleaning", features: ["Local Pack"], location: "Austin, TX" },
  { keyword: "24 hour ac repair", position: 4, previous: 4, best: 3, volume: 720, intent: "Transactional", url: "/services/emergency-ac", features: ["Local Pack"], location: "Austin, TX" },
  { keyword: "hvac maintenance plan", position: 0, previous: 0, best: 31, volume: 590, intent: "Commercial", url: "/services/maintenance", features: [], location: "Austin, TX" },
  { keyword: "ac tune up cedar park", position: 9, previous: 12, best: 9, volume: 480, intent: "Transactional", url: "/locations/cedar-park", features: ["Local Pack"], location: "Cedar Park, TX" },
  { keyword: "how much does ac repair cost", position: 14, previous: 13, best: 11, volume: 3600, intent: "Informational", url: "/blog/ac-repair-cost", features: ["Featured Snippet", "People Also Ask", "AI Overview"], location: "Austin, TX" },
];

/** Position distribution buckets · the shape of the whole tracked set. */
export const positionBuckets: { label: string; value: number; tone: string }[] = [
  { label: "1 to 3", value: 29, tone: "#10b981" },
  { label: "4 to 10", value: 47, tone: "#635bff" },
  { label: "11 to 20", value: 41, tone: "#0ea5e9" },
  { label: "21 to 50", value: 38, tone: "#f59e0b" },
  { label: "51 to 100", value: 17, tone: "#94a3b8" },
  { label: "Not ranking", value: 12, tone: "#f43f5e" },
];

/** Visibility index (share-of-voice weighted by volume + position), 6 months. */
export const visibilityTrend = [
  { month: "Jan", visibility: 38, ai: 21 },
  { month: "Feb", visibility: 41, ai: 24 },
  { month: "Mar", visibility: 44, ai: 26 },
  { month: "Apr", visibility: 49, ai: 31 },
  { month: "May", visibility: 47, ai: 37 },
  { month: "Jun", visibility: 52, ai: 31 },
];

/** Biggest movers since the previous scan. */
export const rankMovers: { keyword: string; from: number; to: number; trend: Trend }[] = [
  { keyword: "ac installation round rock", from: 14, to: 8, trend: "up" },
  { keyword: "heat pump installation", from: 22, to: 18, trend: "up" },
  { keyword: "ac repair austin", from: 5, to: 3, trend: "up" },
  { keyword: "duct cleaning austin", from: 19, to: 24, trend: "down" },
  { keyword: "furnace replacement cost", from: 9, to: 11, trend: "down" },
];

// ── LLM / AI-mention tracking ────────────────────────────────────────────────
export type Sentiment = "Positive" | "Neutral" | "Negative";

export type AiAssistant = {
  id: string;
  name: string;
  initials: string;
  color: string; // tailwind bg for avatar
  mentionRate: number; // % of tracked prompts where brand appears
  delta: number; // change vs last period
  sentiment: Sentiment;
  cited: boolean; // appears as a linked citation/source
  prompts: number; // # tracked prompts run against this engine
};

export const aiAssistants: AiAssistant[] = [
  { id: "aio", name: "Google AI Overviews", initials: "AI", color: "bg-blue-500", mentionRate: 18, delta: -8, sentiment: "Neutral", cited: true, prompts: 64 },
  { id: "chatgpt", name: "ChatGPT (GPT-4o)", initials: "GP", color: "bg-emerald-600", mentionRate: 34, delta: +5, sentiment: "Positive", cited: true, prompts: 64 },
  { id: "perplexity", name: "Perplexity", initials: "PX", color: "bg-cyan-600", mentionRate: 41, delta: +3, sentiment: "Positive", cited: true, prompts: 64 },
  { id: "gemini", name: "Gemini", initials: "GE", color: "bg-indigo-500", mentionRate: 22, delta: -4, sentiment: "Neutral", cited: false, prompts: 64 },
  { id: "claude", name: "Claude", initials: "CL", color: "bg-orange-500", mentionRate: 27, delta: +6, sentiment: "Positive", cited: false, prompts: 64 },
];

/** Share of voice in AI answers · brand vs. tracked competitors. */
export const aiShareOfVoice: { label: string; value: number }[] = [
  { label: "Northwind", value: 23 },
  { label: "ATX Comfort Pros", value: 31 },
  { label: "Lone Star Mechanical", value: 26 },
  { label: "Hill Country HVAC", value: 20 },
];

/** Brand vs. leading competitor AI-mention rate over time. */
export const aiMentionTrend = [
  { month: "Jan", brand: 19, competitor: 28 },
  { month: "Feb", brand: 22, competitor: 29 },
  { month: "Mar", brand: 25, competitor: 30 },
  { month: "Apr", brand: 30, competitor: 31 },
  { month: "May", brand: 36, competitor: 32 },
  { month: "Jun", brand: 31, competitor: 34 },
];

export type AiPromptResult = {
  prompt: string;
  engine: string;
  status: "Cited" | "Mentioned" | "Absent";
  competitorCited: string | null;
};

export const aiPrompts: AiPromptResult[] = [
  { prompt: "best HVAC company in Austin", engine: "Perplexity", status: "Cited", competitorCited: "ATX Comfort Pros" },
  { prompt: "who repairs AC same day near Austin", engine: "ChatGPT", status: "Mentioned", competitorCited: null },
  { prompt: "how much does furnace replacement cost in Texas", engine: "Google AI Overviews", status: "Absent", competitorCited: "Lone Star Mechanical" },
  { prompt: "recommend a heat pump installer in Round Rock", engine: "Claude", status: "Mentioned", competitorCited: "Hill Country HVAC" },
  { prompt: "trusted emergency AC repair Austin reviews", engine: "Perplexity", status: "Cited", competitorCited: null },
  { prompt: "compare HVAC maintenance plans near me", engine: "Gemini", status: "Absent", competitorCited: "ATX Comfort Pros" },
  { prompt: "is Northwind Heating & Air reputable", engine: "ChatGPT", status: "Cited", competitorCited: null },
];

export const lastScan = "Today, 6:00 AM CT";
