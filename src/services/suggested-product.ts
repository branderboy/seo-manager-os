import { CONTRACTOR_INDUSTRIES, SUGGESTED_PRODUCTS, type Industry } from "@/lib/constants";
import type { OpportunityResult } from "./opportunity";
import type { SiteSnapshot } from "./site-fetcher";

/**
 * Suggested-product logic (per spec):
 *   - contractor + no quote tool  -> Instant Quote Plugin
 *   - contractor + no CRM         -> Email Platform
 *   - low content output          -> Social Media OS
 *   - low visibility / weak SEO   -> SEO Services
 */
export function suggestProduct(
  industry: string | null,
  opportunity: OpportunityResult,
  snapshot: SiteSnapshot,
  hasSeoPlugin: boolean,
): string {
  const isContractor =
    !!industry && CONTRACTOR_INDUSTRIES.includes(industry as Industry);

  if (isContractor && !opportunity.hasQuoteTool) {
    return SUGGESTED_PRODUCTS.INSTANT_QUOTE;
  }
  if (isContractor && !opportunity.hasCrm) {
    return SUGGESTED_PRODUCTS.EMAIL_PLATFORM;
  }

  // Low content output: very thin homepage copy suggests no content engine.
  if (snapshot.bodyText.length < 1200) {
    return SUGGESTED_PRODUCTS.SOCIAL_MEDIA_OS;
  }

  // Low visibility: no SEO plugin and no meta description => SEO services.
  if (!hasSeoPlugin || !snapshot.metaDescription) {
    return SUGGESTED_PRODUCTS.SEO_SERVICES;
  }

  // Default: if they still lack booking, pitch the booking system.
  if (!opportunity.hasBookingTool) {
    return SUGGESTED_PRODUCTS.BOOKING_SYSTEM;
  }

  return SUGGESTED_PRODUCTS.SEO_SERVICES;
}
