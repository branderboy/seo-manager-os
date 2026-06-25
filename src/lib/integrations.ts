// Integration catalog for the (mock) connections surface.
export type IntegrationCategory =
  | "Search & Analytics"
  | "Local & Reviews"
  | "CRM & Leads"
  | "SEO Data"
  | "AI"
  | "Planning & Delivery"
  | "Alerts & Automation";

export type Integration = {
  id: string;
  name: string;
  blurb: string;
  category: IntegrationCategory;
  initials: string;
  color: string; // tailwind bg for the avatar
  connected: boolean;
  account?: string; // shown when connected
  synced?: string; // last sync, shown when connected
  metric?: string; // a believable data point when connected
};

export const integrations: Integration[] = [
  // Search & Analytics
  { id: "gbp", name: "Google Business Profile", blurb: "Profile, posts, reviews, Q&A and insights for every location.", category: "Local & Reviews", initials: "GB", color: "bg-blue-500", connected: true, account: "Northwind HVAC · 3 locations", synced: "2 minutes ago", metric: "3 locations syncing" },
  { id: "ga4", name: "Google Analytics 4", blurb: "Sessions, conversions and channel performance.", category: "Search & Analytics", initials: "GA", color: "bg-amber-500", connected: true, account: "GA4 · 312,480 sessions / 90d", synced: "11 minutes ago", metric: "Conversions tracked" },
  { id: "gsc", name: "Google Search Console", blurb: "Queries, impressions, clicks and indexation coverage.", category: "Search & Analytics", initials: "SC", color: "bg-emerald-500", connected: true, account: "sc-domain:northwindhvac.com", synced: "9 minutes ago", metric: "1,204 queries tracked" },
  { id: "bing", name: "Bing Webmaster Tools", blurb: "Bing/Copilot search performance and crawl data.", category: "Search & Analytics", initials: "BW", color: "bg-cyan-600", connected: false },
  { id: "gtrends", name: "Google Trends", blurb: "Demand trends and seasonality behind search intent.", category: "Search & Analytics", initials: "GT", color: "bg-blue-400", connected: true, account: "US · HVAC topics", synced: "Today", metric: "Trend signals on" },

  // Local & Reviews
  { id: "greviews", name: "Google Reviews", blurb: "Pull reviews, ratings and respond from one place.", category: "Local & Reviews", initials: "GR", color: "bg-rose-500", connected: true, account: "412 reviews · 4.6★", synced: "5 minutes ago", metric: "Velocity 3/mo" },
  { id: "yelp", name: "Yelp", blurb: "Sync Yelp reviews and listing data.", category: "Local & Reviews", initials: "YE", color: "bg-red-600", connected: false },
  { id: "birdeye", name: "Birdeye", blurb: "Review generation, requests and reputation monitoring.", category: "Local & Reviews", initials: "BE", color: "bg-indigo-500", connected: false },
  { id: "localfalcon", name: "Local Falcon", blurb: "Geo-grid rank scans across the service radius.", category: "Local & Reviews", initials: "LF", color: "bg-emerald-600", connected: true, account: "Northwind HVAC · 3 grids", synced: "Today, 6:00 AM", metric: "Geo-grid scans on" },

  // CRM & Leads
  { id: "hubspot", name: "HubSpot", blurb: "Sync leads, deals and revenue attribution.", category: "CRM & Leads", initials: "HS", color: "bg-orange-500", connected: true, account: "Northwind HVAC portal", synced: "1 hour ago", metric: "142 leads / 30d" },
  { id: "salesforce", name: "Salesforce", blurb: "Enterprise CRM lead and pipeline sync.", category: "CRM & Leads", initials: "SF", color: "bg-sky-600", connected: false },
  { id: "callrail", name: "CallRail", blurb: "Call tracking attributed to search visibility.", category: "CRM & Leads", initials: "CR", color: "bg-green-600", connected: false },

  // SEO Data
  { id: "semrush", name: "Semrush", blurb: "Keyword, backlink and competitor data.", category: "SEO Data", initials: "SE", color: "bg-orange-600", connected: true, account: "Project: Northwind HVAC", synced: "Today, 6:00 AM", metric: "1,860 keywords" },
  { id: "ahrefs", name: "Ahrefs", blurb: "Backlinks, referring domains and rank tracking.", category: "SEO Data", initials: "AH", color: "bg-blue-600", connected: false },
  { id: "screamingfrog", name: "Screaming Frog", blurb: "Full technical site crawl — status codes, schema and on-page.", category: "SEO Data", initials: "SF", color: "bg-green-700", connected: true, account: "northwindhvac.com", synced: "Today, 5:40 AM", metric: "1,930 URLs crawled" },
  { id: "ranktracker", name: "Rank Tracker", blurb: "Daily keyword rank scans across markets — desktop, mobile and local.", category: "SEO Data", initials: "RT", color: "bg-violet-600", connected: true, account: "184 keywords · 3 markets", synced: "Today, 6:00 AM", metric: "Daily scans on" },
  { id: "aitracker", name: "AI Answer Tracker", blurb: "Track brand mentions and citations across ChatGPT, Perplexity, Gemini, Claude and AI Overviews.", category: "SEO Data", initials: "AI", color: "bg-fuchsia-600", connected: true, account: "64 prompts · 5 engines", synced: "Today, 6:00 AM", metric: "31% mention rate" },

  // Planning & Delivery
  { id: "gcal", name: "Google Calendar", blurb: "Schedule intake calls and push due-dated tasks to the calendar.", category: "Planning & Delivery", initials: "GC", color: "bg-blue-600", connected: true, account: "kawani@digiwaxx.com", synced: "Connected", metric: "Tasks on calendar" },
  { id: "trello", name: "Trello", blurb: "Sync playbook plays and daily tasks to a team board.", category: "Planning & Delivery", initials: "TR", color: "bg-sky-500", connected: true, account: "Board: Northwind SEO", synced: "Connected", metric: "Cards syncing" },
  { id: "gdocs", name: "Google Docs", blurb: "Generate the project brief as a shareable document.", category: "Planning & Delivery", initials: "GD", color: "bg-blue-500", connected: true, account: "Northwind workspace", synced: "Connected", metric: "Briefs exported" },
  { id: "looker", name: "Looker Studio", blurb: "Build the client-facing performance report dashboard.", category: "Planning & Delivery", initials: "LS", color: "bg-indigo-600", connected: true, account: "Northwind report", synced: "Today", metric: "Live report on" },

  // Alerts & Automation
  { id: "email", name: "Email (SMTP)", blurb: "Send daily task digests and overdue alerts.", category: "Alerts & Automation", initials: "@", color: "bg-slate-700", connected: true, account: "Resend · alerts@northwindhvac.com", synced: "Sends 8:00 AM CT", metric: "Daily digest on" },
  { id: "slack", name: "Slack", blurb: "Post task reminders and score changes to a channel.", category: "Alerts & Automation", initials: "SL", color: "bg-violet-600", connected: true, account: "#seo-northwind", synced: "Connected", metric: "Nudges on" },
  { id: "twilio", name: "Twilio SMS", blurb: "Text overdue-task alerts to owners.", category: "Alerts & Automation", initials: "TW", color: "bg-red-500", connected: false },
  { id: "zapier", name: "Zapier", blurb: "Trigger 6,000+ apps from OS events.", category: "Alerts & Automation", initials: "ZP", color: "bg-orange-500", connected: false },

  // Search & Analytics — performance
  { id: "pagespeed", name: "PageSpeed Insights", blurb: "Field + lab performance scores per URL.", category: "Search & Analytics", initials: "PS", color: "bg-lime-600", connected: true, account: "northwindhvac.com", synced: "Today", metric: "LCP / CLS tracked" },
  { id: "lighthouse", name: "Lighthouse", blurb: "Automated performance, SEO and best-practice audits.", category: "Search & Analytics", initials: "LH", color: "bg-orange-500", connected: false },

  // SEO Data
  { id: "dataforseo", name: "DataForSEO", blurb: "SERP, keyword volume and rank data via API.", category: "SEO Data", initials: "DF", color: "bg-blue-700", connected: true, account: "Pay-as-you-go", synced: "Today, 6:00 AM", metric: "SERP API on" },

  // AI
  { id: "openai", name: "OpenAI", blurb: "GPT models for generation and the AI-mention tracker.", category: "AI", initials: "OA", color: "bg-emerald-700", connected: true, account: "gpt-4o", synced: "Connected", metric: "Generation on" },
  { id: "claude", name: "Claude (Anthropic)", blurb: "Powers diagnosis, strategy and the mention judge.", category: "AI", initials: "CL", color: "bg-orange-600", connected: true, account: "Opus / Haiku", synced: "Connected", metric: "Reasoning on" },

  // Planning & Delivery
  { id: "whitelabel", name: "White Label", blurb: "Brand the client-facing reports and portal as your agency.", category: "Planning & Delivery", initials: "WL", color: "bg-fuchsia-700", connected: true, account: "Boring SEO Agency", synced: "Connected", metric: "Branding on" },
  { id: "teams", name: "Team Seats", blurb: "Invite teammates and route work by role.", category: "Planning & Delivery", initials: "TS", color: "bg-teal-600", connected: true, account: "5 seats", synced: "Connected", metric: "5 members" },

  // Alerts & Automation
  { id: "recurring", name: "Recurring Audits", blurb: "Schedule automatic re-audits and re-crawls per client.", category: "Alerts & Automation", initials: "RA", color: "bg-indigo-600", connected: true, account: "Weekly", synced: "Scheduled", metric: "Auto-audits on" },
  { id: "webhooks", name: "Webhooks", blurb: "Fire events to external systems on deploys, approvals and wins.", category: "Alerts & Automation", initials: "WH", color: "bg-slate-600", connected: false },
  { id: "api", name: "API Access", blurb: "Programmatic access to clients, tasks and reports.", category: "Alerts & Automation", initials: "AP", color: "bg-slate-800", connected: false },
];

export const integrationCategories: IntegrationCategory[] = [
  "Search & Analytics",
  "Local & Reviews",
  "CRM & Leads",
  "SEO Data",
  "AI",
  "Planning & Delivery",
  "Alerts & Automation",
];

/** Quick lookup of an integration by id (for per-stage app chips). */
export function getIntegration(id: string): Integration | undefined {
  return integrations.find((i) => i.id === id);
}
