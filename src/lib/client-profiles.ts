// ──────────────────────────────────────────────────────────────────────────
// Client profiles · the rich record behind each client (the "client database").
// Composed with model.ts (client, contacts, investigations) on the record page.
// ──────────────────────────────────────────────────────────────────────────

export type DocItem = { name: string; kind: string; date: string };
export type NoteItem = { text: string; when: string; by: string };

export type ClientProfile = {
  website: string;
  cms: string;
  hosting: string;
  brandVoice: string;
  goals: string[];
  priorities: string[];
  locations: string[];
  competitors: string[];
  documents: DocItem[];
  notes: NoteItem[];
};

export const clientProfiles: Record<string, ClientProfile> = {
  acme: {
    website: "acmecorp.com",
    cms: "Webflow",
    hosting: "Vercel",
    brandVoice: "Confident, technical, no fluff. Speaks to RevOps and marketing leaders.",
    goals: ["Pipeline from organic", "Topical authority", "BOFU coverage"],
    priorities: ["Comparison pages", "Programmatic integrations", "Demo conversion"],
    locations: ["San Francisco, CA (HQ)"],
    competitors: ["Monday", "Asana", "ClickUp"],
    documents: [
      { name: "saas-technical-audit-v1.pdf", kind: "PDF", date: "Feb 2" },
      { name: "gsc-export-90d.csv", kind: "CSV", date: "Feb 1" },
    ],
    notes: [
      { text: "Buying committee wants a 'vs Monday' page before renewal.", when: "Yesterday", by: "Josh W." },
      { text: "Eng can ship a programmatic template in Q3.", when: "This week", by: "Priya N." },
    ],
  },
  northwind: {
    website: "northwindhvac.com",
    cms: "WordPress",
    hosting: "WP Engine",
    brandVoice: "Warm, local, trustworthy. Family-owned, 14 years in Austin.",
    goals: ["More leads", "More calls", "AI visibility"],
    priorities: ["Review velocity", "Service & location pages", "NAP cleanup"],
    locations: ["Austin, TX (HQ)", "Round Rock, TX", "Cedar Park, TX"],
    competitors: ["ATX Comfort Pros", "Lone Star Mechanical", "Hill Country HVAC"],
    documents: [
      { name: "geo-grid-export.csv", kind: "CSV", date: "Jun 18" },
      { name: "local-visibility-brief.pdf", kind: "PDF", date: "Jun 20" },
    ],
    notes: [
      { text: "Owner approved review-automation rollout.", when: "Jun 22", by: "Mia C." },
      { text: "Two outer ZIPs recovered after velocity lift.", when: "This week", by: "Josh W." },
    ],
  },
  vantage: {
    website: "vantageretail.com",
    cms: "Custom (headless)",
    hosting: "AWS",
    brandVoice: "Premium, editorial, brand-led. Enterprise governance on every change.",
    goals: ["Indexation recovery", "Crawl efficiency", "Template performance"],
    priorities: ["Crawl-budget reclaim", "Orphan resolution", "Template refresh"],
    locations: ["New York, NY (HQ)"],
    competitors: ["Wayfair", "Target", "Walmart"],
    documents: [{ name: "crawl-stats-90d.csv", kind: "CSV", date: "Feb 3" }],
    notes: [{ text: "Governance: all template changes need stakeholder sign-off.", when: "This week", by: "Priya N." }],
  },
  flowdesk: {
    website: "flowdesk.io",
    cms: "Next.js",
    hosting: "Vercel",
    brandVoice: "Modern, product-led, helpful. Speaks to ops teams automating work.",
    goals: ["Organic signups", "Use-case coverage", "Programmatic set"],
    priorities: ["Discovery", "Topic clusters", "Integration pages"],
    locations: ["Seattle, WA (HQ)"],
    competitors: ["Zapier", "Make", "Workato"],
    documents: [],
    notes: [{ text: "Onboarding · discovery interview scheduled.", when: "This week", by: "Jordan R." }],
  },
  hillcountry: {
    website: "hillcountrydental.com",
    cms: "Squarespace",
    hosting: "Squarespace",
    brandVoice: "Friendly, reassuring, modern. Family & cosmetic dentistry.",
    goals: ["New patient calls", "Service-page coverage", "Reviews"],
    priorities: ["Service pages", "Review velocity", "Local authority"],
    locations: ["Austin, TX (HQ)"],
    competitors: ["Austin Dental Works", "Bright Smiles ATX", "Lakeway Dental"],
    documents: [{ name: "monthly-report-dec.pdf", kind: "PDF", date: "Jan 2" }],
    notes: [{ text: "Engagement paused · pending budget renewal.", when: "Jan", by: "Josh W." }],
  },
};
