// Dashboard module data for the Local / SaaS / Enterprise views.

export const localDashboard = {
  account: "Northwind Heating & Air",
  market: "Austin, TX · 3 locations",
  scores: { visibility: 48, trust: 57, authority: 41, ai: 29 },
  // 7×7 geo grid of average rank (1 = best). Center is HQ.
  geoGrid: [
    [9, 8, 7, 6, 8, 11, 14],
    [8, 6, 4, 3, 5, 9, 12],
    [7, 4, 2, 2, 3, 6, 10],
    [6, 3, 1, 1, 2, 5, 9],
    [8, 5, 3, 2, 4, 8, 12],
    [11, 9, 6, 5, 8, 12, 16],
    [14, 13, 10, 9, 13, 17, 20],
  ],
  gbp: [
    { label: "Primary category", value: "Correct", ok: true },
    { label: "Services listed", value: "6 / 12", ok: false },
    { label: "Posts (last 30d)", value: "0", ok: false },
    { label: "Photos", value: "184", ok: true },
    { label: "Q&A answered", value: "3 / 9", ok: false },
    { label: "Attributes", value: "Partial", ok: false },
  ],
  reviews: {
    rating: 4.6,
    total: 412,
    velocity: 3,
    marketVelocity: 11,
    responseRate: 22,
    sentiment: [
      { label: "Positive", value: 78 },
      { label: "Neutral", value: 13 },
      { label: "Negative", value: 9 },
    ],
  },
  competitors: [
    { name: "ATX Comfort Pros", reviews: 1180, velocity: 14, authority: 71, share: 31 },
    { name: "Lone Star Mechanical", reviews: 940, velocity: 12, authority: 64, share: 26 },
    { name: "Hill Country HVAC", reviews: 610, velocity: 9, authority: 53, share: 19 },
    { name: "Northwind (you)", reviews: 412, velocity: 3, authority: 41, share: 14 },
  ],
  authority: {
    referringDomains: 27,
    marketMedian: 88,
    localLinks: 9,
    sources: [
      { label: "Local press", value: 4 },
      { label: "Partners / suppliers", value: 7 },
      { label: "Sponsorships", value: 2 },
      { label: "Directories", value: 14 },
    ],
  },
};

export const saasDashboard = {
  account: "Flowdesk",
  market: "Workflow automation · Mid-market",
  scores: { visibility: 56, authority: 49, conversion: 55, ai: 34 },
  bofu: [
    { page: "Pricing", status: "Ranking", rank: 4, coverage: 90 },
    { page: "Use cases", status: "Thin", rank: 18, coverage: 35 },
    { page: "Solutions", status: "Missing", rank: null, coverage: 10 },
    { page: "Demo / trial", status: "Ranking", rank: 7, coverage: 80 },
  ],
  comparisons: [
    { term: "flowdesk vs zapier", hasPage: false, volume: 2400, difficulty: 38 },
    { term: "flowdesk vs make", hasPage: false, volume: 1300, difficulty: 31 },
    { term: "best zapier alternative", hasPage: true, volume: 5400, difficulty: 52 },
    { term: "flowdesk vs workato", hasPage: false, volume: 720, difficulty: 27 },
  ],
  programmatic: { built: 60, opportunity: 200, intentBacked: 140 },
  integrations: { live: 38, catalog: 96, ranking: 21 },
  funnel: [
    { stage: "Sessions", value: 100 },
    { stage: "Page engaged", value: 61 },
    { stage: "Demo / trial CTA", value: 24 },
    { stage: "Signup", value: 9 },
    { stage: "Qualified", value: 4 },
  ],
};

export const enterpriseDashboard = {
  account: "Vantage Retail",
  market: "E-commerce · 1.2M URLs",
  scores: { visibility: 53, indexation: 51, crawl: 46, ai: 27 },
  crawl: [
    { label: "Product pages", value: 38 },
    { label: "Category / PLP", value: 21 },
    { label: "Parameter / facet", value: 34 },
    { label: "Other", value: 7 },
  ],
  indexation: {
    submitted: 1200000,
    indexed: 742000,
    crawledNotIndexed: 61000,
    duplicate: 38000,
  },
  templates: [
    { name: "Product (PDP)", traffic: 100, decay: -4, links: 8 },
    { name: "Category (PLP)", traffic: 74, decay: -18, links: 3 },
    { name: "Brand hub", traffic: 41, decay: -9, links: 5 },
    { name: "Editorial", traffic: 33, decay: +6, links: 11 },
  ],
  links: { orphans: 9200, avgRevenueLinks: 1.4, hubs: 320 },
  forecast: [
    { month: "Now", sessions: 100 },
    { month: "M1", sessions: 103 },
    { month: "M2", sessions: 108 },
    { month: "M3", sessions: 113 },
    { month: "M4", sessions: 118 },
    { month: "M5", sessions: 122 },
    { month: "M6", sessions: 122 },
  ],
};
