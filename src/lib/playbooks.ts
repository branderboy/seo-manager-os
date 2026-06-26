// ──────────────────────────────────────────────────────────────────────────
// Playbooks by client type · the operations-platform idea made concrete.
// The engine never changes (Discovery → … → Reporting); the PLAYBOOKS do.
// Each client type gets its own specialized plays.
// ──────────────────────────────────────────────────────────────────────────

import type { Playbook } from "./data";

export type PlaybookType = "Local" | "Ecommerce" | "SaaS" | "Enterprise" | "Migration" | "AI Search";

export const playbookTypes: PlaybookType[] = [
  "Local",
  "Ecommerce",
  "SaaS",
  "Enterprise",
  "Migration",
  "AI Search",
];

export const playbooksByType: Record<PlaybookType, Playbook[]> = {
  Local: [
    { key: "local-gbp", name: "GBP Optimization", goal: "Maximize the Google Business Profile.", plays: ["Categories", "Services", "Posts", "Photos", "Q&A", "Attributes"] },
    { key: "local-reviews", name: "Review Engine", goal: "Lift review velocity and rating.", plays: ["Review Requests", "Response Automation", "Velocity", "Sentiment"] },
    { key: "local-citations", name: "Citations & NAP", goal: "Consistent listings across the web.", plays: ["Directory Cleanup", "NAP Consistency", "Local Listings", "Duplicates"] },
    { key: "local-pages", name: "Location & Service Pages", goal: "Expand the winnable radius.", plays: ["Service-Area Pages", "Location Pages", "Service Pages", "Internal Links"] },
  ],
  Ecommerce: [
    { key: "ecom-collections", name: "Collection Pages", goal: "Win category-level demand.", plays: ["Collection Copy", "Filters Indexing", "Internal Links", "Pagination"] },
    { key: "ecom-products", name: "Product Pages", goal: "Make products rank and convert.", plays: ["Product Schema", "Unique Descriptions", "Reviews", "Variants"] },
    { key: "ecom-faceted", name: "Faceted Navigation", goal: "Control crawl and indexation.", plays: ["Parameter Handling", "Canonicals", "Crawl Control", "Indexable Facets"] },
    { key: "ecom-content", name: "Category Content", goal: "Capture research-stage demand.", plays: ["Buying Guides", "Comparisons", "FAQ", "How-To"] },
  ],
  SaaS: [
    { key: "saas-authority", name: "Topical Authority", goal: "Own the category.", plays: ["Pillar Pages", "Clusters", "Internal Links", "Entity Coverage"] },
    { key: "saas-pld", name: "Product-Led Content", goal: "Tie content to the product.", plays: ["Use Cases", "Integrations", "Alternatives", "Comparisons"] },
    { key: "saas-bofu", name: "BOFU Coverage", goal: "Convert high-intent demand.", plays: ["Pricing", "Demo", "Solution Pages", "CTAs"] },
    { key: "saas-programmatic", name: "Programmatic SEO", goal: "Scale demand-backed pages.", plays: ["Templates", "Data Sources", "Quality Gates", "Internal Links"] },
  ],
  Enterprise: [
    { key: "ent-governance", name: "Governance", goal: "Coordinate at scale.", plays: ["Stakeholder Workflows", "Approval Gates", "Content Standards", "QA"] },
    { key: "ent-crawl", name: "Crawl & Indexation", goal: "Spend crawl where it pays.", plays: ["Crawl Budget", "Log Analysis", "Indexation Control", "Sitemaps"] },
    { key: "ent-templates", name: "Template Performance", goal: "Fix decay by template.", plays: ["Per-Template Audit", "Decay Monitoring", "CWV", "Schema"] },
    { key: "ent-links", name: "Internal Link Graph", goal: "Strengthen the architecture.", plays: ["Hubs", "Orphan Resolution", "Link Depth", "Anchor Strategy"] },
  ],
  Migration: [
    { key: "mig-redirects", name: "Redirect Mapping", goal: "Preserve equity on the move.", plays: ["URL Mapping", "301 Rules", "Chain Removal", "QA"] },
    { key: "mig-prelaunch", name: "Pre-launch Validation", goal: "Catch issues on staging.", plays: ["Staging Crawl", "Parity Checks", "Schema", "Canonicals"] },
    { key: "mig-deploy", name: "Deployment", goal: "Ship safely.", plays: ["Phased Rollout", "Monitoring", "Rollback Plan", "Comms"] },
    { key: "mig-verify", name: "Post-launch Verification", goal: "Confirm recovery.", plays: ["Indexation", "Rankings Recovery", "Error Monitoring", "Redirect Audit"] },
  ],
  "AI Search": [
    { key: "ai-entity", name: "Entity Clarity", goal: "Be unambiguous to machines.", plays: ["Entity Model", "sameAs", "Knowledge Graph", "Disambiguation"] },
    { key: "ai-schema", name: "Structured Data", goal: "Earn rich + AI eligibility.", plays: ["FAQ Schema", "HowTo", "LocalBusiness", "Validation"] },
    { key: "ai-answers", name: "Answer Optimization", goal: "Get cited in AI answers.", plays: ["Concise Answers", "Summaries", "Source-Style Content", "Citations"] },
    { key: "ai-mentions", name: "Brand Mentions", goal: "Build authority signals.", plays: ["Unlinked Mentions", "Citations", "Authoritative Sources", "PR"] },
  ],
};
