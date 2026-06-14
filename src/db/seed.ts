/**
 * Seed the database with sample leads so the UI is explorable without crawling.
 * Run with: npm run db:seed
 */
import "dotenv/config";
import { db } from "./index";
import { websites, technologyDetection, opportunityDetection, leadLists } from "./schema";

type TechFlags = Partial<{
  wordpress: boolean;
  elementor: boolean;
  wpforms: boolean;
  gravityForms: boolean;
  contactForm7: boolean;
  woocommerce: boolean;
  rankMath: boolean;
  yoast: boolean;
  bookingSystem: boolean;
  quoteSystem: boolean;
}>;

type OppFlags = Partial<{
  hasQuoteTool: boolean;
  hasBookingTool: boolean;
  hasLiveChat: boolean;
  hasCrm: boolean;
  hasSms: boolean;
}>;

type Sample = {
  domain: string;
  company: string;
  industry: string;
  sub: string;
  city: string;
  state: string;
  score: number;
  product: string;
  tech: TechFlags;
  opp: OppFlags;
};

const SAMPLES: Sample[] = [
  {
    domain: "summitpeakroofing.com",
    company: "Summit Peak Roofing",
    industry: "Roofing",
    sub: "Residential Roofing",
    city: "Denver",
    state: "CO",
    score: 92,
    product: "Instant Quote Plugin",
    tech: { wordpress: true, elementor: true, contactForm7: true, yoast: true },
    opp: {},
  },
  {
    domain: "blueskyhvacservices.com",
    company: "Blue Sky HVAC Services",
    industry: "HVAC",
    sub: "Residential HVAC",
    city: "Austin",
    state: "TX",
    score: 85,
    product: "Email Platform",
    tech: { wordpress: true, wpforms: true, rankMath: true, quoteSystem: true },
    opp: { hasQuoteTool: true },
  },
  {
    domain: "lonestarplumbingco.com",
    company: "Lone Star Plumbing Co",
    industry: "Plumbing",
    sub: "Emergency Plumbing",
    city: "Houston",
    state: "TX",
    score: 78,
    product: "Booking System",
    tech: { wordpress: true, elementor: true, gravityForms: true, yoast: true, quoteSystem: true },
    opp: { hasQuoteTool: true, hasCrm: true },
  },
  {
    domain: "evergreenlandscapingpros.com",
    company: "Evergreen Landscaping Pros",
    industry: "Landscaping",
    sub: "Commercial Landscaping",
    city: "Portland",
    state: "OR",
    score: 95,
    product: "Instant Quote Plugin",
    tech: { wordpress: true, contactForm7: true },
    opp: {},
  },
  {
    domain: "brightsmiledentalcare.com",
    company: "Bright Smile Dental Care",
    industry: "Dentist",
    sub: "Family Dentistry",
    city: "Phoenix",
    state: "AZ",
    score: 60,
    product: "SEO Services",
    tech: { wordpress: true, elementor: true, yoast: true, bookingSystem: true },
    opp: { hasBookingTool: true, hasLiveChat: true },
  },
  {
    domain: "elegantmomentsevents.com",
    company: "Elegant Moments Events",
    industry: "Event Planner",
    sub: "Wedding Planning",
    city: "Nashville",
    state: "TN",
    score: 90,
    product: "Booking System",
    tech: { wordpress: true, wpforms: true, woocommerce: true },
    opp: {},
  },
];

async function main() {
  console.log("Seeding sample leads…");
  for (const s of SAMPLES) {
    await db
      .insert(websites)
      .values({
        domain: s.domain,
        companyName: s.company,
        title: `${s.company} | ${s.industry}`,
        metaDescription: `${s.company} provides trusted ${s.industry.toLowerCase()} services in ${s.city}, ${s.state}.`,
        location: `${s.city}, ${s.state}`,
        city: s.city,
        state: s.state,
        phone: "(555) 123-4567",
        email: `info@${s.domain}`,
        wordpressDetected: true,
        industry: s.industry,
        subIndustry: s.sub,
        classificationConfidence: 0.88,
        opportunityScore: s.score,
        suggestedProduct: s.product,
        lastScannedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: websites.domain,
        set: { opportunityScore: s.score, lastScannedAt: new Date() },
      });

    await db
      .insert(technologyDetection)
      .values({ domain: s.domain, ...s.tech })
      .onConflictDoUpdate({ target: technologyDetection.domain, set: { ...s.tech } });

    await db
      .insert(opportunityDetection)
      .values({ domain: s.domain, score: s.score, ...s.opp })
      .onConflictDoUpdate({
        target: opportunityDetection.domain,
        set: { score: s.score, ...s.opp },
      });
  }

  await db
    .insert(leadLists)
    .values([
      {
        listName: "WordPress Roofing Companies Without Quote Tools",
        filters: { wordpressOnly: true, industry: "Roofing", missingQuoteTool: true },
        totalResults: 1,
      },
      {
        listName: "WordPress HVAC Companies Using Elementor",
        filters: { wordpressOnly: true, industry: "HVAC", elementor: true },
        totalResults: 0,
      },
      {
        listName: "WordPress Event Planners Without Booking Systems",
        filters: { wordpressOnly: true, industry: "Event Planner", missingBookingTool: true },
        totalResults: 1,
      },
    ]);

  console.log(`Seeded ${SAMPLES.length} leads and 3 saved lists.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
