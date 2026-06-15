// Integration catalog for the (mock) connections surface.
export type IntegrationCategory =
  | "Search & Analytics"
  | "Local & Reviews"
  | "CRM & Leads"
  | "SEO Data"
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

  // Local & Reviews
  { id: "greviews", name: "Google Reviews", blurb: "Pull reviews, ratings and respond from one place.", category: "Local & Reviews", initials: "GR", color: "bg-rose-500", connected: true, account: "412 reviews · 4.6★", synced: "5 minutes ago", metric: "Velocity 3/mo" },
  { id: "yelp", name: "Yelp", blurb: "Sync Yelp reviews and listing data.", category: "Local & Reviews", initials: "YE", color: "bg-red-600", connected: false },
  { id: "birdeye", name: "Birdeye", blurb: "Review generation, requests and reputation monitoring.", category: "Local & Reviews", initials: "BE", color: "bg-indigo-500", connected: false },

  // CRM & Leads
  { id: "hubspot", name: "HubSpot", blurb: "Sync leads, deals and revenue attribution.", category: "CRM & Leads", initials: "HS", color: "bg-orange-500", connected: true, account: "Northwind HVAC portal", synced: "1 hour ago", metric: "142 leads / 30d" },
  { id: "salesforce", name: "Salesforce", blurb: "Enterprise CRM lead and pipeline sync.", category: "CRM & Leads", initials: "SF", color: "bg-sky-600", connected: false },
  { id: "callrail", name: "CallRail", blurb: "Call tracking attributed to search visibility.", category: "CRM & Leads", initials: "CR", color: "bg-green-600", connected: false },

  // SEO Data
  { id: "semrush", name: "Semrush", blurb: "Keyword, backlink and competitor data.", category: "SEO Data", initials: "SE", color: "bg-orange-600", connected: true, account: "Project: Northwind HVAC", synced: "Today, 6:00 AM", metric: "1,860 keywords" },
  { id: "ahrefs", name: "Ahrefs", blurb: "Backlinks, referring domains and rank tracking.", category: "SEO Data", initials: "AH", color: "bg-blue-600", connected: false },

  // Alerts & Automation
  { id: "email", name: "Email (SMTP)", blurb: "Send daily task digests and overdue alerts.", category: "Alerts & Automation", initials: "@", color: "bg-slate-700", connected: true, account: "Resend · alerts@northwindhvac.com", synced: "Sends 8:00 AM CT", metric: "Daily digest on" },
  { id: "slack", name: "Slack", blurb: "Post task reminders and score changes to a channel.", category: "Alerts & Automation", initials: "SL", color: "bg-violet-600", connected: true, account: "#seo-northwind", synced: "Connected", metric: "Nudges on" },
  { id: "twilio", name: "Twilio SMS", blurb: "Text overdue-task alerts to owners.", category: "Alerts & Automation", initials: "TW", color: "bg-red-500", connected: false },
  { id: "zapier", name: "Zapier", blurb: "Trigger 6,000+ apps from OS events.", category: "Alerts & Automation", initials: "ZP", color: "bg-orange-500", connected: false },
];

export const integrationCategories: IntegrationCategory[] = [
  "Search & Analytics",
  "Local & Reviews",
  "CRM & Leads",
  "SEO Data",
  "Alerts & Automation",
];
