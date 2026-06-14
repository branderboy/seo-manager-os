import type { SiteSnapshot } from "./site-fetcher";
import type { TechnologyResult } from "./technology-detection";

export type OpportunityResult = {
  hasQuoteTool: boolean;
  hasBookingTool: boolean;
  hasLiveChat: boolean;
  hasCrm: boolean;
  hasSms: boolean;
  score: number;
  missingFeatures: string[];
};

const LIVE_CHAT_SIGNATURES = [
  "intercom",
  "drift",
  "tawk.to",
  "livechatinc",
  "zendesk",
  "crisp.chat",
  "hubspot-messages",
  "tidio",
  "olark",
  "freshchat",
];

const CRM_SIGNATURES = [
  "hubspot",
  "salesforce",
  "pardot",
  "marketo",
  "activecampaign",
  "keap",
  "infusionsoft",
  "gohighlevel",
  "zoho",
  "pipedrive",
];

const SMS_SIGNATURES = ["twilio", "textmagic", "podium", "textline", "sms", "text us"];

/**
 * Opportunity scoring (per spec):
 *   - A site with only a contact form, no booking, no estimator => 90+ (hot).
 *   - A site that already has booking + estimator + CRM => much lower.
 *
 * We start every site at 100 and subtract for each capability it already has,
 * since existing tooling means less to sell.
 */
export function scoreOpportunity(
  snapshot: SiteSnapshot,
  tech: TechnologyResult,
): OpportunityResult {
  const haystack = `${snapshot.html}\n${snapshot.headers}`;
  const has = (sigs: string[]) => sigs.some((s) => haystack.includes(s));

  const hasQuoteTool = tech.quoteSystem;
  const hasBookingTool = tech.bookingSystem;
  const hasLiveChat = has(LIVE_CHAT_SIGNATURES);
  const hasCrm = has(CRM_SIGNATURES);
  const hasSms = has(SMS_SIGNATURES);

  // Each capability the prospect already owns lowers how much opportunity remains.
  let score = 100;
  if (hasQuoteTool) score -= 35;
  if (hasBookingTool) score -= 25;
  if (hasCrm) score -= 20;
  if (hasLiveChat) score -= 12;
  if (hasSms) score -= 8;

  score = Math.max(0, Math.min(100, score));

  const missingFeatures: string[] = [];
  if (!hasQuoteTool) missingFeatures.push("Instant Quote Tool");
  if (!hasBookingTool) missingFeatures.push("Booking Tool");
  if (!hasLiveChat) missingFeatures.push("Live Chat");
  if (!hasCrm) missingFeatures.push("CRM Integration");
  if (!hasSms) missingFeatures.push("SMS Capability");

  return {
    hasQuoteTool,
    hasBookingTool,
    hasLiveChat,
    hasCrm,
    hasSms,
    score,
    missingFeatures,
  };
}
