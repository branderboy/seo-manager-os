import type {
  AuditFinding,
  Campaign,
  Citation,
  ClientRequest,
  ContentItem,
  Integration,
  Kpi,
  KeywordMapRow,
  LeadSummary,
  MonthlyReport,
  RankingSummary,
  ReviewSummary,
  RoadmapInitiative,
  SeoTask,
} from "./types";

export const demoCampaigns: Campaign[] = [
  {
    id: "capital-comfort",
    clientId: "capital-comfort-client",
    clientName: "Capital Comfort HVAC",
    legalName: "Capital Comfort HVAC LLC",
    website: "capitalcomforthvac.example",
    industry: "HVAC",
    businessModel: "service_area",
    market: "Washington, DC",
    targetCities: ["Washington, DC", "Arlington, VA", "Silver Spring, MD"],
    targetZips: ["20002", "20009", "20011", "22201", "20910"],
    services: [
      { name: "AC Replacement", priority: "critical", highMargin: true, averageTicket: 9800 },
      { name: "Emergency AC Repair", priority: "high", highMargin: false, averageTicket: 625 },
      { name: "Heat Pump Installation", priority: "high", highMargin: true, averageTicket: 12400 },
    ],
    strategist: "Priya Nair",
    status: "active",
    startDate: "2026-06-01",
    healthScore: 74,
    visibilityScore: 61,
    clientActionCount: 2,
    blockerCount: 1,
    latestReportStatus: "published",
  },
  {
    id: "dmv-roofing",
    clientId: "dmv-roofing-client",
    clientName: "DMV Roofing & Exteriors",
    legalName: "DMV Roofing and Exteriors LLC",
    website: "dmvroofing.example",
    industry: "Roofing",
    businessModel: "service_area",
    market: "Silver Spring, MD",
    targetCities: ["Silver Spring, MD", "Bethesda, MD", "Rockville, MD", "College Park, MD"],
    targetZips: ["20910", "20814", "20850", "20740"],
    services: [
      { name: "Roof Replacement", priority: "critical", highMargin: true, averageTicket: 16800 },
      { name: "Storm Damage Inspection", priority: "high", highMargin: false, averageTicket: 0 },
      { name: "Gutters", priority: "medium", highMargin: false, averageTicket: 2200 },
    ],
    strategist: "Jordan Reyes",
    status: "active",
    startDate: "2026-05-15",
    healthScore: 66,
    visibilityScore: 54,
    clientActionCount: 2,
    blockerCount: 1,
    latestReportStatus: "review",
  },
  {
    id: "potomac-plumbing",
    clientId: "potomac-plumbing-client",
    clientName: "Potomac Plumbing Co.",
    legalName: "Potomac Plumbing Company LLC",
    website: "potomacplumbing.example",
    industry: "Plumbing",
    businessModel: "hybrid",
    market: "Alexandria, VA",
    targetCities: ["Alexandria, VA", "Arlington, VA", "Falls Church, VA", "Springfield, VA"],
    targetZips: ["22314", "22201", "22046", "22150"],
    services: [
      { name: "Water Heater Replacement", priority: "critical", highMargin: true, averageTicket: 2350 },
      { name: "Emergency Plumbing", priority: "high", highMargin: false, averageTicket: 475 },
      { name: "Sewer Line Repair", priority: "high", highMargin: true, averageTicket: 6400 },
    ],
    strategist: "Priya Nair",
    status: "active",
    startDate: "2026-07-01",
    healthScore: 79,
    visibilityScore: 67,
    clientActionCount: 1,
    blockerCount: 1,
    latestReportStatus: "draft",
  },
];

export const campaignKpis: Record<string, Kpi[]> = {
  "capital-comfort": [
    { key: "organic_clicks", label: "Organic clicks", value: 2384, change: 14.2, freshness: { source: "GSC", status: "fresh", updatedAt: "18h ago" } },
    { key: "impressions", label: "Organic impressions", value: 68920, change: 11.8, freshness: { source: "GSC", status: "fresh", updatedAt: "18h ago" } },
    { key: "ctr", label: "Organic CTR", value: 3.46, change: 0.3, format: "percent", freshness: { source: "GSC", status: "fresh", updatedAt: "18h ago" } },
    { key: "organic_leads", label: "Organic leads", value: 87, change: 18.0, freshness: { source: "GA4", status: "fresh", updatedAt: "3h ago" } },
    { key: "gbp_calls", label: "GBP calls", value: 118, change: 9.3, freshness: { source: "GBP", status: "stale", updatedAt: "18h ago", note: "Demo connector" } },
    { key: "gbp_clicks", label: "GBP website clicks", value: 82, change: 6.5, freshness: { source: "GBP", status: "stale", updatedAt: "18h ago" } },
    { key: "directions", label: "Direction requests", value: 21, change: 0, freshness: { source: "GBP", status: "stale", updatedAt: "18h ago" } },
    { key: "form_leads", label: "Form leads", value: 42, change: 16.7, freshness: { source: "GA4", status: "fresh", updatedAt: "3h ago" } },
    { key: "phone_leads", label: "Phone leads", value: 76, change: 8.6, freshness: { source: "Call tracking", status: "unavailable", note: "Using GBP + website call events in demo" } },
    { key: "booked", label: "Booked estimates", value: 31, change: 19.2, freshness: { source: "CRM", status: "stale", updatedAt: "1d ago" } },
    { key: "reviews", label: "Review count", value: 286, change: 3.2, freshness: { source: "GBP", status: "stale", updatedAt: "18h ago" } },
    { key: "rating", label: "Review rating", value: 4.8, format: "rating", freshness: { source: "GBP", status: "stale", updatedAt: "18h ago" } },
    { key: "visibility", label: "Ranking visibility", value: 61, change: 7.0, format: "percent", freshness: { source: "Local Falcon", status: "fresh", updatedAt: "1d ago" } },
  ],
  "dmv-roofing": [
    { key: "organic_clicks", label: "Organic clicks", value: 1744, change: 8.4, freshness: { source: "GSC", status: "fresh", updatedAt: "20h ago" } },
    { key: "impressions", label: "Organic impressions", value: 52210, change: 10.1, freshness: { source: "GSC", status: "fresh", updatedAt: "20h ago" } },
    { key: "ctr", label: "Organic CTR", value: 3.34, change: -0.1, format: "percent", freshness: { source: "GSC", status: "fresh", updatedAt: "20h ago" } },
    { key: "organic_leads", label: "Organic leads", value: 63, change: 12.5, freshness: { source: "GA4", status: "fresh", updatedAt: "5h ago" } },
    { key: "gbp_calls", label: "GBP calls", value: 76, change: 6.1, freshness: { source: "GBP", status: "fresh", updatedAt: "12h ago" } },
    { key: "gbp_clicks", label: "GBP website clicks", value: 54, change: 3.8, freshness: { source: "GBP", status: "fresh", updatedAt: "12h ago" } },
    { key: "directions", label: "Direction requests", value: 13, change: 8.3, freshness: { source: "GBP", status: "fresh", updatedAt: "12h ago" } },
    { key: "form_leads", label: "Form leads", value: 37, change: 15.6, freshness: { source: "GA4", status: "fresh", updatedAt: "5h ago" } },
    { key: "phone_leads", label: "Phone leads", value: 44, change: 2.3, freshness: { source: "Call tracking", status: "fresh", updatedAt: "3h ago" } },
    { key: "booked", label: "Booked estimates", value: 24, change: 9.1, freshness: { source: "CRM", status: "stale", updatedAt: "2d ago" } },
    { key: "reviews", label: "Review count", value: 214, change: 4.9, freshness: { source: "GBP", status: "fresh", updatedAt: "12h ago" } },
    { key: "rating", label: "Review rating", value: 4.7, format: "rating", freshness: { source: "GBP", status: "fresh", updatedAt: "12h ago" } },
    { key: "visibility", label: "Ranking visibility", value: 54, change: 5.6, format: "percent", freshness: { source: "BrightLocal", status: "fresh", updatedAt: "12h ago" } },
  ],
  "potomac-plumbing": [
    { key: "organic_clicks", label: "Organic clicks", value: 2018, change: 17.7, freshness: { source: "GSC", status: "fresh", updatedAt: "14h ago" } },
    { key: "impressions", label: "Organic impressions", value: 57180, change: 15.2, freshness: { source: "GSC", status: "fresh", updatedAt: "14h ago" } },
    { key: "ctr", label: "Organic CTR", value: 3.53, change: 0.2, format: "percent", freshness: { source: "GSC", status: "fresh", updatedAt: "14h ago" } },
    { key: "organic_leads", label: "Organic leads", value: 72, change: 20.0, freshness: { source: "GA4", status: "fresh", updatedAt: "4h ago" } },
    { key: "gbp_calls", label: "GBP calls", value: 93, change: 13.4, freshness: { source: "GBP", status: "fresh", updatedAt: "10h ago" } },
    { key: "gbp_clicks", label: "GBP website clicks", value: 61, change: 8.9, freshness: { source: "GBP", status: "fresh", updatedAt: "10h ago" } },
    { key: "directions", label: "Direction requests", value: 18, change: 12.5, freshness: { source: "GBP", status: "fresh", updatedAt: "10h ago" } },
    { key: "form_leads", label: "Form leads", value: 28, change: 16.7, freshness: { source: "GA4", status: "fresh", updatedAt: "4h ago" } },
    { key: "phone_leads", label: "Phone leads", value: 58, change: 18.4, freshness: { source: "CallRail", status: "unavailable", note: "Awaiting client admin access" } },
    { key: "booked", label: "Booked estimates", value: 35, change: 25.0, freshness: { source: "CRM", status: "fresh", updatedAt: "8h ago" } },
    { key: "reviews", label: "Review count", value: 341, change: 2.1, freshness: { source: "GBP", status: "fresh", updatedAt: "10h ago" } },
    { key: "rating", label: "Review rating", value: 4.9, format: "rating", freshness: { source: "GBP", status: "fresh", updatedAt: "10h ago" } },
    { key: "visibility", label: "Ranking visibility", value: 67, change: 9.8, format: "percent", freshness: { source: "Mock rank tracker", status: "fresh", updatedAt: "1d ago" } },
  ],
};

export const whatChanged: Record<string, string[]> = {
  "capital-comfort": [
    "Map visibility improved in the core DC grid after service-page and GBP service updates.",
    "AC replacement became the strongest non-brand lead source this month.",
    "Review velocity improved, but remains below the top three local competitors.",
  ],
  "dmv-roofing": [
    "Silver Spring local-pack visibility moved from 7 to 4 for roof replacement.",
    "Storm-damage content generated more assisted form starts after the recent wind event.",
    "Two priority citations still carry the old phone number and are waiting on client confirmation.",
  ],
  "potomac-plumbing": [
    "Water-heater visibility improved across Alexandria and Old Town.",
    "Emergency plumbing calls increased without a matching rise in non-qualified traffic.",
    "CallRail remains blocked, so phone-lead reporting is currently using other verified sources only.",
  ],
};

export const prioritiesByCampaign: Record<string, { title: string; impact: number; effort: number; status: string; owner: string }[]> = {
  "capital-comfort": [
    { title: "Launch post-job review request workflow", impact: 5, effort: 2, status: "In progress", owner: "Priya" },
    { title: "Publish AC replacement proof blocks", impact: 5, effort: 3, status: "Waiting on client", owner: "Sam" },
    { title: "Expand compliant GBP service/category coverage", impact: 4, effort: 2, status: "Blocked", owner: "Priya" },
  ],
  "dmv-roofing": [
    { title: "Correct BBB and Angi NAP", impact: 4, effort: 2, status: "Waiting on client", owner: "Jordan" },
    { title: "Ship Silver Spring storm case study", impact: 5, effort: 3, status: "Blocked", owner: "Sam" },
    { title: "Strengthen Bethesda roof replacement page", impact: 4, effort: 3, status: "In progress", owner: "Jordan" },
  ],
  "potomac-plumbing": [
    { title: "Strengthen water-heater internal links", impact: 4, effort: 2, status: "Planned", owner: "Priya" },
    { title: "Confirm Labor Day GBP special hours", impact: 3, effort: 1, status: "Waiting on client", owner: "Priya" },
    { title: "Build sewer-service proof section", impact: 4, effort: 3, status: "Planned", owner: "Sam" },
  ],
};

export const clientActions: Record<string, string[]> = {
  "capital-comfort": ["Upload 6–10 recent AC replacement project photos.", "Grant GBP manager access to the agency account."],
  "dmv-roofing": ["Confirm the permanent public business phone.", "Upload before/after photos from a recent storm roof replacement."],
  "potomac-plumbing": ["Confirm Labor Day office and emergency-dispatch hours."],
};

export const risksByCampaign: Record<string, string[]> = {
  "capital-comfort": ["GBP category work cannot ship until owner/manager access is verified."],
  "dmv-roofing": ["Two high-priority directories still display an older phone number."],
  "potomac-plumbing": ["Phone-attribution completeness is reduced while CallRail access is blocked."],
};

export const auditFindings: AuditFinding[] = [
  {
    id: "finding-review-velocity",
    campaignId: "capital-comfort",
    auditType: "Google Business Profile",
    section: "Reviews",
    title: "Review velocity trails top local competitors",
    severity: "critical",
    impact: 5,
    effort: 2,
    confidence: 5,
    status: "in_progress",
    owner: "Priya Nair",
    dueDate: "2026-09-04",
    recommendation: "Launch a policy-compliant post-job review request workflow without gating or incentives.",
    clientExplanation: "Capital Comfort is adding reviews more slowly than businesses holding the strongest map visibility.",
    evidence: "Top 3 competitors average 26 reviews/month; Capital Comfort averages 11.",
    clientVisible: true,
  },
  {
    id: "finding-gbp-category",
    campaignId: "capital-comfort",
    auditType: "Google Business Profile",
    section: "Categories & services",
    title: "GBP category mix under-represents replacement work",
    severity: "high",
    impact: 5,
    effort: 2,
    confidence: 5,
    status: "blocked",
    owner: "Priya Nair",
    dueDate: "2026-09-02",
    recommendation: "After manager access is verified, evaluate compliant secondary categories and service coverage around installation/heat pumps.",
    clientExplanation: "The profile currently signals repair more strongly than higher-value replacement services.",
    evidence: "Current primary category: HVAC contractor; secondary set is repair-heavy.",
    clientVisible: true,
    riskAcknowledgementRequired: true,
    riskAcknowledged: false,
  },
  {
    id: "finding-roof-nap",
    campaignId: "dmv-roofing",
    auditType: "Citation & NAP",
    section: "NAP accuracy",
    title: "Old phone number persists on two priority citations",
    severity: "high",
    impact: 4,
    effort: 2,
    confidence: 5,
    status: "waiting_on_client",
    owner: "Jordan Reyes",
    dueDate: "2026-09-01",
    recommendation: "Confirm the NAP master phone, then correct BBB and Angi.",
    clientExplanation: "Two trusted directories show a different phone number than Google and the website.",
    evidence: "BBB + Angi: (301) 555-0100. Website/GBP: (301) 555-0199.",
    clientVisible: true,
  },
  {
    id: "finding-water-heater-links",
    campaignId: "potomac-plumbing",
    auditType: "Technical SEO",
    section: "Internal linking",
    title: "Water-heater service page is orphaned from strong service hubs",
    severity: "medium",
    impact: 4,
    effort: 2,
    confidence: 4,
    status: "planned",
    owner: "Marcus Lee",
    dueDate: "2026-09-06",
    recommendation: "Add contextual links from plumbing-services, financing, and relevant FAQ pages.",
    clientExplanation: "The page is harder for users and search crawlers to reach than competing service pages.",
    evidence: "Only one internal link found in the latest crawl.",
    clientVisible: false,
  },
];

export const roadmapInitiatives: RoadmapInitiative[] = [
  {
    id: "initiative-reviews",
    campaignId: "capital-comfort",
    name: "Increase review velocity",
    type: "reputation",
    businessObjective: "Build more post-job trust and lower conversion friction.",
    searchObjective: "Strengthen GBP trust signals in priority markets.",
    impact: 5,
    effort: 2,
    confidence: 5,
    priorityScore: 12.5,
    owner: "Priya Nair",
    status: "in_progress",
    startDate: "2026-08-26",
    endDate: "2026-09-12",
    kpi: "Review count + local-pack visibility",
    sourceFindingId: "finding-review-velocity",
    clientExplanation: "Build a consistent, policy-compliant process for asking completed-job customers for feedback.",
    humanApproved: true,
    clientVisible: true,
  },
  {
    id: "initiative-nap",
    campaignId: "dmv-roofing",
    name: "Repair priority citation NAP",
    type: "citations",
    businessObjective: "Reduce lost calls and listing confusion.",
    searchObjective: "Improve local entity/NAP corroboration.",
    impact: 4,
    effort: 2,
    confidence: 5,
    priorityScore: 10,
    owner: "Jordan Reyes",
    status: "waiting_on_client",
    startDate: "2026-08-29",
    endDate: "2026-09-08",
    kpi: "Citation accuracy",
    sourceFindingId: "finding-roof-nap",
    clientExplanation: "Make the public business phone consistent across priority directories.",
    humanApproved: true,
    clientVisible: true,
  },
  {
    id: "initiative-water-heater-links",
    campaignId: "potomac-plumbing",
    name: "Strengthen water-heater internal links",
    type: "on_page",
    businessObjective: "Increase qualified water-heater leads.",
    searchObjective: "Improve crawl depth and topical reinforcement.",
    impact: 4,
    effort: 2,
    confidence: 4,
    priorityScore: 8,
    owner: "Marcus Lee",
    status: "planned",
    startDate: "2026-09-01",
    endDate: "2026-09-09",
    kpi: "Organic leads",
    sourceFindingId: "finding-water-heater-links",
    clientExplanation: "Connect the water-heater page to the strongest related pages so users and search engines can reach it naturally.",
    humanApproved: false,
    clientVisible: false,
  },
];

export const tasks: SeoTask[] = [
  { id: "task-review-workflow", campaignId: "capital-comfort", title: "Build post-job review request workflow", workstream: "reputation", priority: "critical", owner: "Priya Nair", dueDate: "2026-09-04", status: "in_progress", estimatedMinutes: 120, relatedFindingId: "finding-review-velocity", relatedInitiativeId: "initiative-reviews", clientVisible: true, approvalStatus: "approved" },
  { id: "task-gbp-access", campaignId: "capital-comfort", title: "Confirm GBP manager access before category edit", workstream: "gbp", priority: "high", owner: "Priya Nair", dueDate: "2026-09-02", status: "blocked", estimatedMinutes: 30, dependency: "Client must grant owner/manager access", relatedFindingId: "finding-gbp-category", clientVisible: false, approvalStatus: "pending" },
  { id: "task-roof-citations", campaignId: "dmv-roofing", title: "Correct Angi and BBB phone records", workstream: "citations", priority: "high", owner: "Jordan Reyes", dueDate: "2026-09-06", status: "waiting_on_client", estimatedMinutes: 75, dependency: "Client must confirm NAP master phone", relatedFindingId: "finding-roof-nap", relatedInitiativeId: "initiative-nap", clientVisible: true, approvalStatus: "approved" },
  { id: "task-roof-photos", campaignId: "dmv-roofing", title: "Get storm-project photos from client", workstream: "content", priority: "medium", owner: "Sam Cole", dueDate: "2026-09-02", status: "blocked", estimatedMinutes: 20, dependency: "Real project proof required", clientVisible: true, approvalStatus: "not_required" },
  { id: "task-water-links", campaignId: "potomac-plumbing", title: "Add water-heater contextual internal links", workstream: "on_page", priority: "high", owner: "Marcus Lee", dueDate: "2026-09-06", status: "planned", estimatedMinutes: 60, relatedFindingId: "finding-water-heater-links", relatedInitiativeId: "initiative-water-heater-links", clientVisible: false, approvalStatus: "pending" },
  { id: "task-hours", campaignId: "potomac-plumbing", title: "Confirm Labor Day emergency hours", workstream: "gbp", priority: "medium", owner: "Priya Nair", dueDate: "2026-09-03", status: "waiting_on_client", estimatedMinutes: 15, dependency: "Client must provide real special hours", clientVisible: true, approvalStatus: "not_required" },
  { id: "task-tech-validate", campaignId: "potomac-plumbing", title: "Validate resolved sitemap redirect chain", workstream: "technical", priority: "medium", owner: "Marcus Lee", dueDate: "2026-09-08", status: "completed", estimatedMinutes: 45, clientVisible: false, approvalStatus: "approved", completionEvidence: "Validated 200 status and canonical target in crawl 2026-08-29." },
];

export const keywordMap: KeywordMapRow[] = [
  { id: "kw1", campaignId: "capital-comfort", cluster: "AC Replacement DC", primaryKeyword: "ac replacement washington dc", service: "AC Replacement", location: "Washington, DC", intent: "transactional", searchVolume: 390, difficulty: 31, cpc: 28.4, businessValue: 5, targetUrl: "/ac-replacement-washington-dc/", serpFeatures: ["Local pack", "Ads", "PAA"], priority: "critical" },
  { id: "kw2", campaignId: "capital-comfort", cluster: "Emergency HVAC DC", primaryKeyword: "emergency hvac repair dc", service: "Emergency AC Repair", location: "Washington, DC", intent: "emergency", searchVolume: 260, difficulty: 27, cpc: 34.1, businessValue: 5, targetUrl: "/emergency-hvac-repair-dc/", competingUrls: ["/hvac-repair-dc/", "/24-hour-hvac-dc/"], serpFeatures: ["Local pack", "Ads"], priority: "critical" },
  { id: "kw3", campaignId: "dmv-roofing", cluster: "Roof Replacement Silver Spring", primaryKeyword: "roof replacement silver spring md", service: "Roof Replacement", location: "Silver Spring, MD", intent: "transactional", searchVolume: 210, difficulty: 29, cpc: 22.75, businessValue: 5, targetUrl: "/roof-replacement-silver-spring-md/", serpFeatures: ["Local pack", "Ads", "Directories"], priority: "critical" },
  { id: "kw4", campaignId: "dmv-roofing", cluster: "Storm Damage Bethesda", primaryKeyword: "storm damage roof inspection bethesda", service: "Storm Damage Inspection", location: "Bethesda, MD", intent: "commercial_investigation", searchVolume: 90, difficulty: 18, cpc: 16.2, businessValue: 4, serpFeatures: ["Local pack", "PAA"], priority: "high" },
  { id: "kw5", campaignId: "potomac-plumbing", cluster: "Water Heater Alexandria", primaryKeyword: "water heater replacement alexandria va", service: "Water Heater Replacement", location: "Alexandria, VA", intent: "transactional", searchVolume: 170, difficulty: 24, cpc: 19.9, businessValue: 5, targetUrl: "/water-heater-replacement-alexandria-va/", serpFeatures: ["Local pack", "Ads", "PAA"], priority: "critical" },
  { id: "kw6", campaignId: "potomac-plumbing", cluster: "Emergency Plumber Arlington", primaryKeyword: "emergency plumber arlington va", service: "Emergency Plumbing", location: "Arlington, VA", intent: "emergency", searchVolume: 320, difficulty: 34, cpc: 41.8, businessValue: 5, targetUrl: "/emergency-plumber-arlington-va/", serpFeatures: ["Local pack", "Ads"], priority: "critical" },
];

export const rankingSummaries: RankingSummary[] = [
  { campaignId: "capital-comfort", keyword: "ac replacement washington dc", localPackVisibility: 61, averageRank: 5.4, shareOfLocalVoice: 18.2, organicRank: 6, movement: 3, competitor: "District Air Pros", grid: [[9,7,6,5,5,8,11],[7,5,4,3,4,6,9],[6,4,3,2,3,5,8],[5,3,2,2,2,4,7],[6,4,3,2,3,5,8],[8,6,5,4,5,7,10],[11,9,8,7,8,10,13]] },
  { campaignId: "dmv-roofing", keyword: "roof replacement silver spring md", localPackVisibility: 54, averageRank: 6.8, shareOfLocalVoice: 14.7, organicRank: 8, movement: 3, competitor: "Maryland Roof Masters", grid: [[12,10,8,7,8,10,13],[10,8,6,5,6,8,11],[8,6,5,4,5,7,9],[7,5,4,4,4,6,8],[8,6,5,4,5,7,10],[10,8,7,6,7,9,12],[13,11,10,9,10,12,14]] },
  { campaignId: "potomac-plumbing", keyword: "water heater replacement alexandria va", localPackVisibility: 67, averageRank: 4.9, shareOfLocalVoice: 20.1, organicRank: 5, movement: 2, competitor: "Old Town Plumbing", grid: [[8,6,5,4,5,7,9],[6,4,3,3,3,5,7],[5,3,2,2,2,4,6],[4,3,2,3,2,3,5],[5,3,2,2,2,4,6],[7,5,4,3,4,5,7],[9,7,6,5,6,7,10]] },
];

export const citations: Citation[] = [
  { id: "citation-capital-yelp", campaignId: "capital-comfort", directory: "Yelp", listingStatus: "claimed", napMatchScore: 100, duplicateRisk: "low", priority: "high", phone: "(202) 555-0144", expectedPhone: "(202) 555-0144", checkedAt: "2026-08-26", nextAction: "No action", owner: "Priya" },
  { id: "citation-capital-mapquest", campaignId: "capital-comfort", directory: "MapQuest", listingStatus: "incorrect", napMatchScore: 55, duplicateRisk: "medium", priority: "medium", phone: "(202) 555-0190", expectedPhone: "(202) 555-0144", checkedAt: "2026-08-21", nextAction: "Correct name and phone", owner: "Priya" },
  { id: "citation-roof-bbb", campaignId: "dmv-roofing", directory: "BBB", listingStatus: "incorrect", napMatchScore: 72, duplicateRisk: "low", priority: "critical", phone: "(301) 555-0100", expectedPhone: "(301) 555-0199", checkedAt: "2026-08-27", nextAction: "Waiting for NAP confirmation", owner: "Jordan" },
  { id: "citation-roof-angi", campaignId: "dmv-roofing", directory: "Angi", listingStatus: "incorrect", napMatchScore: 72, duplicateRisk: "medium", priority: "high", phone: "(301) 555-0100", expectedPhone: "(301) 555-0199", checkedAt: "2026-08-27", nextAction: "Waiting for NAP confirmation", owner: "Jordan" },
  { id: "citation-plumb-yelp", campaignId: "potomac-plumbing", directory: "Yelp", listingStatus: "claimed", napMatchScore: 100, duplicateRisk: "low", priority: "high", phone: "(703) 555-0118", expectedPhone: "(703) 555-0118", checkedAt: "2026-08-24", nextAction: "No action", owner: "Priya" },
];

export const contentItems: ContentItem[] = [
  { id: "content-capital-ac", campaignId: "capital-comfort", type: "service_page", title: "AC Replacement in Washington, DC", service: "AC Replacement", location: "Washington, DC", intent: "Transactional", targetUrl: "/ac-replacement-washington-dc/", status: "editing", owner: "Sam Cole", publishDate: "2026-09-08", clientAssetsRequired: ["Recent installation photos", "Financing details"], qaFlags: ["Needs real project proof"] },
  { id: "content-capital-heatpump", campaignId: "capital-comfort", type: "service_page", title: "Heat Pump Installation in DC", service: "Heat Pump Installation", location: "Washington, DC", intent: "Transactional", targetUrl: "/heat-pump-installation-dc/", status: "published", owner: "Sam Cole", publishDate: "2026-08-18", clientAssetsRequired: [], qaFlags: [] },
  { id: "content-roof-case", campaignId: "dmv-roofing", type: "project_case_study", title: "Storm-Damaged Roof Replacement in Silver Spring", service: "Roof Replacement", location: "Silver Spring, MD", intent: "Commercial investigation", targetUrl: "/projects/silver-spring-storm-roof/", status: "waiting_on_client", owner: "Sam Cole", clientAssetsRequired: ["Before photos", "After photos", "Roof material", "Project timeline"], qaFlags: ["Cannot invent project details", "Missing real-world proof"] },
  { id: "content-plumb-cost", campaignId: "potomac-plumbing", type: "pricing", title: "Water Heater Replacement Cost in Northern Virginia", service: "Water Heater Replacement", location: "Northern Virginia", intent: "Commercial investigation", targetUrl: "/water-heater-replacement-cost-northern-va/", status: "brief", owner: "Sam Cole", publishDate: "2026-09-16", clientAssetsRequired: ["Approved price ranges", "Warranty language"], qaFlags: ["Pricing must be supplied/approved by client"] },
];

export const reviewSummaries: ReviewSummary[] = [
  { campaignId: "capital-comfort", count: 286, rating: 4.8, monthlyVelocity: 11, competitorVelocity: 26, responseRate: 74 },
  { campaignId: "dmv-roofing", count: 214, rating: 4.7, monthlyVelocity: 16, competitorVelocity: 21, responseRate: 82 },
  { campaignId: "potomac-plumbing", count: 341, rating: 4.9, monthlyVelocity: 19, competitorVelocity: 24, responseRate: 91 },
];

export const leadSummaries: LeadSummary[] = [
  { campaignId: "capital-comfort", leads: 118, qualified: 82, booked: 31, closed: 14, revenue: 11850, revenueSourceAvailable: true },
  { campaignId: "dmv-roofing", leads: 81, qualified: 52, booked: 24, closed: 9, revenue: 0, revenueSourceAvailable: false },
  { campaignId: "potomac-plumbing", leads: 86, qualified: 67, booked: 35, closed: 21, revenue: 0, revenueSourceAvailable: false },
];

export const clientRequests: ClientRequest[] = [
  { id: "request-capital-photos", campaignId: "capital-comfort", type: "photos", title: "Upload two recent AC replacement projects", whyItMatters: "Real project proof makes the replacement page more credible and useful.", exactRequestedItem: "Upload 6–10 before/after photos from two recent DC-area AC replacement jobs. No customer faces or private documents.", dueDate: "2026-09-05", status: "open", contact: "Tanya Brooks", relatedContent: "AC Replacement in Washington, DC" },
  { id: "request-capital-gbp", campaignId: "capital-comfort", type: "access", title: "Grant GBP manager access", whyItMatters: "Category/service improvements cannot be safely made without verified profile access.", exactRequestedItem: "Add the agency account as a Manager on the verified Google Business Profile. Do not transfer primary ownership.", dueDate: "2026-09-02", status: "open", contact: "Tanya Brooks" },
  { id: "request-roof-phone", campaignId: "dmv-roofing", type: "service_update", title: "Confirm the public business phone", whyItMatters: "Two priority directories show an older phone number.", exactRequestedItem: "Confirm whether (301) 555-0199 is the permanent public NAP phone used across Google, the website, and directories.", dueDate: "2026-09-01", status: "open", contact: "Marcus Hill" },
  { id: "request-roof-photos", campaignId: "dmv-roofing", type: "photos", title: "Upload storm-roof case-study photos", whyItMatters: "The case study cannot be published without real project evidence.", exactRequestedItem: "Upload before/after photos, roof material, project city, and completion month for one recent Silver Spring storm job.", dueDate: "2026-09-03", status: "open", contact: "Marcus Hill", relatedContent: "Storm-Damaged Roof Replacement in Silver Spring" },
  { id: "request-plumb-hours", campaignId: "potomac-plumbing", type: "business_hours_update", title: "Confirm Labor Day emergency hours", whyItMatters: "Google special hours should reflect the real schedule and must not be guessed.", exactRequestedItem: "Confirm Labor Day office hours and whether emergency dispatch remains available.", dueDate: "2026-09-03", status: "open", contact: "Alicia Grant" },
];

export const integrations: Integration[] = [
  { provider: "ga4", label: "Google Analytics 4", category: "Analytics", state: "connected", lastSync: "3h ago", dataFreshAt: "18h ago", mode: "mock", detail: "Mock provider is supplying realistic events until OAuth is configured." },
  { provider: "gsc", label: "Google Search Console", category: "Search", state: "connected", lastSync: "5h ago", dataFreshAt: "1d ago", mode: "mock", detail: "Clicks, impressions, CTR and landing pages are populated from demo snapshots." },
  { provider: "gbp", label: "Google Business Profile", category: "Local", state: "requested", mode: "mock", detail: "OAuth adapter placeholder; demo metrics remain available." },
  { provider: "drive", label: "Google Drive", category: "Assets", state: "not_requested", mode: "mock", detail: "Client asset/file fallback uses Supabase Storage." },
  { provider: "slack", label: "Slack", category: "Notifications", state: "not_requested", mode: "mock", detail: "Webhook-ready notification adapter." },
  { provider: "brightlocal", label: "BrightLocal", category: "Rankings / citations", state: "connected", lastSync: "2h ago", dataFreshAt: "12h ago", mode: "mock", detail: "Adapter interface supports rank/citation imports." },
  { provider: "localfalcon", label: "Local Falcon", category: "Rankings", state: "received", mode: "mock", detail: "CSV import and API adapter boundary are ready." },
  { provider: "whitespark", label: "Whitespark", category: "Citations", state: "not_requested", mode: "mock", detail: "CSV fallback supported." },
  { provider: "ahrefs", label: "Ahrefs", category: "Links / competitors", state: "not_requested", mode: "mock", detail: "Backlink/competitor adapter placeholder." },
  { provider: "semrush", label: "Semrush", category: "Research", state: "not_requested", mode: "mock", detail: "Keyword and competitor adapter placeholder." },
  { provider: "callrail", label: "CallRail", category: "Calls / leads", state: "blocked", mode: "mock", detail: "Awaiting client admin access. Revenue is not inferred while source data is unavailable." },
  { provider: "zapier", label: "Zapier / Webhooks", category: "Automation", state: "not_requested", mode: "mock", detail: "Generic signed webhook adapter placeholder." },
];

export const reports: MonthlyReport[] = [
  {
    id: "report-capital-aug-2026",
    campaignId: "capital-comfort",
    period: "August 2026",
    executiveSummary: "Local visibility improved in the core DC grid, while review velocity and outer-grid reach remain the biggest constraints. AC replacement produced the strongest qualified organic demand this month.",
    workCompleted: ["Published heat-pump service improvements", "Corrected 6 citation inconsistencies", "Built August local-pack baseline", "Added AC replacement conversion proof requirements"],
    risks: ["GBP manager access still pending", "Review velocity remains below market leaders"],
    nextPriorities: ["Launch review request workflow", "Publish AC replacement proof blocks", "Expand compliant GBP service coverage after access is verified"],
    publishStatus: "published",
    leadSeoApproval: "approved",
    snapshot: { organicClicks: 2384, organicLeads: 87, gbpCalls: 118, bookedEstimates: 31, reviews: 286, rating: 4.8, rankingVisibility: 61 },
    freshness: [
      { source: "GA4", status: "fresh", updatedAt: "2026-08-29 19:00 ET" },
      { source: "GSC", status: "fresh", updatedAt: "2026-08-29 04:00 ET" },
      { source: "GBP", status: "stale", updatedAt: "2026-08-29 08:00 ET", note: "Demo connector" },
      { source: "Rank tracker", status: "fresh", updatedAt: "2026-08-29 10:30 ET" },
    ],
  },
  {
    id: "report-roof-aug-2026",
    campaignId: "dmv-roofing",
    period: "August 2026",
    executiveSummary: "Silver Spring visibility improved and storm-related content gained assisted conversions. The biggest near-term risk is unresolved NAP inconsistency on two trusted directories.",
    workCompleted: ["Built Silver Spring rank baseline", "Audited 22 citations", "Updated roof-replacement on-page brief", "Added storm-event tracking notes"],
    risks: ["BBB and Angi phone mismatch", "Storm case study blocked by missing client photos"],
    nextPriorities: ["Confirm NAP master phone", "Correct priority citations", "Publish storm case study with real project proof"],
    publishStatus: "review",
    leadSeoApproval: "pending",
    snapshot: { organicClicks: 1744, organicLeads: 63, gbpCalls: 76, bookedEstimates: 24, reviews: 214, rating: 4.7, rankingVisibility: 54 },
    freshness: [
      { source: "GA4", status: "fresh", updatedAt: "2026-08-30 05:00 ET" },
      { source: "GSC", status: "fresh", updatedAt: "2026-08-29 02:00 ET" },
      { source: "GBP", status: "fresh", updatedAt: "2026-08-30 10:00 ET" },
      { source: "BrightLocal", status: "fresh", updatedAt: "2026-08-30 10:00 ET" },
    ],
  },
  {
    id: "report-plumb-aug-2026",
    campaignId: "potomac-plumbing",
    period: "August 2026",
    executiveSummary: "Water-heater visibility improved quickly in Alexandria. Phone attribution is intentionally incomplete because CallRail has not been connected; no revenue is inferred from unavailable source data.",
    workCompleted: ["Validated sitemap redirect fix", "Mapped water-heater keyword cluster", "Built Alexandria geo-grid baseline", "Added special-hours client request"],
    risks: ["CallRail access blocked", "Holiday hours must be confirmed before GBP update"],
    nextPriorities: ["Strengthen water-heater internal links", "Confirm Labor Day special hours", "Build sewer-service proof section"],
    publishStatus: "draft",
    leadSeoApproval: "pending",
    snapshot: { organicClicks: 2018, organicLeads: 72, gbpCalls: 93, bookedEstimates: 35, reviews: 341, rating: 4.9, rankingVisibility: 67, revenue: null },
    freshness: [
      { source: "GA4", status: "fresh", updatedAt: "2026-08-30 06:00 ET" },
      { source: "GSC", status: "fresh", updatedAt: "2026-08-29 08:00 ET" },
      { source: "GBP", status: "fresh", updatedAt: "2026-08-30 12:00 ET" },
      { source: "CallRail", status: "unavailable", note: "Awaiting client admin access" },
    ],
  },
];

export const workCompletedTimeline = [
  { campaignId: "capital-comfort", date: "Aug 29", title: "Heat-pump page optimization published", type: "Content" },
  { campaignId: "capital-comfort", date: "Aug 27", title: "6 citation NAP fixes validated", type: "Citations" },
  { campaignId: "capital-comfort", date: "Aug 25", title: "Local-pack geo-grid baseline refreshed", type: "Rankings" },
  { campaignId: "dmv-roofing", date: "Aug 28", title: "Silver Spring roof page brief approved", type: "Content" },
  { campaignId: "dmv-roofing", date: "Aug 26", title: "22 citation records audited", type: "Citations" },
  { campaignId: "potomac-plumbing", date: "Aug 29", title: "Sitemap redirect validation completed", type: "Technical" },
  { campaignId: "potomac-plumbing", date: "Aug 27", title: "Water-heater keyword map approved", type: "Keywords" },
];

export const latestReviews = [
  { campaignId: "capital-comfort", reviewer: "J. Carter", rating: 5, date: "Aug 28", text: "Fast AC repair during a hot weekend.", status: "Responded" },
  { campaignId: "dmv-roofing", reviewer: "M. Lewis", rating: 5, date: "Aug 25", text: "Crew protected the landscaping and finished the roof in one day.", status: "Needs response" },
  { campaignId: "potomac-plumbing", reviewer: "R. Nguyen", rating: 4, date: "Aug 29", text: "Water heater was replaced same day. Communication could have been better before arrival.", status: "Needs response" },
];

export function getCampaign(id: string) {
  return demoCampaigns.find((campaign) => campaign.id === id) ?? demoCampaigns[0];
}

export function getCampaignData<T extends { campaignId: string }>(rows: T[], id: string) {
  return rows.filter((row) => row.campaignId === id);
}
