import { queryLeads } from "@/services/leads";
import { parseFilters, parseSort } from "@/lib/filters";
import { toCsv } from "@/lib/csv";

/**
 * GET /api/export?<same filters as /api/websites>
 * Streams a CSV of every matching lead (up to 5000 rows).
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const filters = parseFilters(url.searchParams);
  const sort = parseSort(url.searchParams);

  const { rows } = await queryLeads(filters, { page: 1, pageSize: 5000, sort });

  const csvRows = rows.map((r) => ({
    domain: r.domain,
    website_url: `https://${r.domain}`,
    company: r.companyName ?? "",
    wordpress: r.wordpressDetected ? "yes" : "no",
    contractor: r.contractor ? "yes" : "no",
    industry: r.industry ?? "",
    sub_industry: r.subIndustry ?? "",
    location: r.location ?? "",
    phone: r.phone ?? "",
    email: r.email ?? "",
    opportunity_score: r.opportunityScore,
    suggested_product: r.suggestedProduct ?? "",
    elementor: r.elementor ? "yes" : "no",
    wpforms: r.wpforms ? "yes" : "no",
    contact_form_7: r.contactForm7 ? "yes" : "no",
    gravity_forms: r.gravityForms ? "yes" : "no",
    woocommerce: r.woocommerce ? "yes" : "no",
    has_quote_tool: r.hasQuoteTool ? "yes" : "no",
    has_booking_tool: r.hasBookingTool ? "yes" : "no",
  }));

  const csv = toCsv(csvRows);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="wp-prospector-leads-${Date.now()}.csv"`,
    },
  });
}
