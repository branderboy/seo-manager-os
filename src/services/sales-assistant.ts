import { getAiProvider } from "./ai/provider";
import type { Website } from "@/db/schema";

export type SalesAssets = {
  coldEmail: string;
  sms: string;
  callScript: string;
  loomOutline: string;
};

type LeadContext = Pick<
  Website,
  | "domain"
  | "companyName"
  | "industry"
  | "subIndustry"
  | "location"
  | "suggestedProduct"
  | "contactName"
> & { missingFeatures: string[] };

const SYSTEM_PROMPT = `You are an elite B2B sales copywriter for an agency that sells WordPress
growth tools (instant quote plugins, booking systems, CRM/email platforms, SEO).
Write concise, specific, non-spammy outreach that references the prospect's
industry and the concrete gap on their site. Avoid hype and filler.

Return ONLY valid JSON with these keys:
{
  "coldEmail": "subject line + 90-130 word email",
  "sms": "max 320 char text",
  "callScript": "short opener + 2 discovery questions + value prop + ask",
  "loomOutline": "5-7 bullet outline for a personalized audit video"
}`;

function buildPrompt(lead: LeadContext): string {
  return `Prospect:
- Company: ${lead.companyName ?? lead.domain}
- Contact: ${lead.contactName ?? "Unknown"}
- Website: ${lead.domain}
- Industry: ${lead.industry ?? "Unknown"}${lead.subIndustry ? ` (${lead.subIndustry})` : ""}
- Location: ${lead.location ?? "Unknown"}
- Missing features: ${lead.missingFeatures.join(", ") || "None obvious"}
- Recommended product to pitch: ${lead.suggestedProduct ?? "SEO Services"}

Write the outreach assets.`;
}

function templateFallback(lead: LeadContext): SalesAssets {
  const name = lead.companyName ?? lead.domain;
  const firstName = lead.contactName?.split(" ")[0];
  const greeting = firstName ? `Hi ${firstName}` : "Hi there";
  const product = lead.suggestedProduct ?? "a quick win";
  const gap = lead.missingFeatures[0] ?? "a missing conversion tool";
  return {
    coldEmail: `Subject: Quick idea for ${name}\n\n${greeting} — I was looking at ${lead.domain} and noticed you're missing ${gap.toLowerCase()}. For ${lead.industry ?? "businesses like yours"}, that's usually the difference between a visitor and a booked job. We add ${product} to WordPress sites without rebuilding anything. Worth a 10-minute look? I can send a short audit video.`,
    sms: `Hi, this is from WP Prospector. Noticed ${lead.domain} is missing ${gap.toLowerCase()} — we can add it fast. Want a quick audit video?`,
    callScript: `Opener: "Hi, I run growth audits for ${lead.industry ?? "local"} WordPress sites and ${name} came up."\n\nDiscovery:\n1. How are most leads reaching you today?\n2. What happens after someone lands on your site?\n\nValue: "Sites like yours convert 20-40% more when they add ${product.toLowerCase()}."\n\nAsk: "Can I send you a 3-minute audit video this week?"`,
    loomOutline: `- Intro: who I am, why ${name} caught my eye\n- Show homepage and the missing ${gap.toLowerCase()}\n- Compare to a competitor doing it well\n- Quantify the lost leads\n- Demo ${product}\n- Easy install, no rebuild\n- CTA: reply to book 15 min`,
  };
}

/** Generate cold email, SMS, call script, and Loom outline for a lead. */
export async function generateSalesAssets(lead: LeadContext): Promise<SalesAssets> {
  const provider = getAiProvider();
  if (provider.name === "mock") return templateFallback(lead);

  try {
    const raw = await provider.complete(
      [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildPrompt(lead) },
      ],
      { json: true },
    );
    const parsed = JSON.parse(
      raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1),
    ) as Partial<SalesAssets>;
    const fb = templateFallback(lead);
    return {
      coldEmail: parsed.coldEmail || fb.coldEmail,
      sms: parsed.sms || fb.sms,
      callScript: parsed.callScript || fb.callScript,
      loomOutline: parsed.loomOutline || fb.loomOutline,
    };
  } catch (err) {
    console.error("[sales-assistant] AI failed, using template fallback:", err);
    return templateFallback(lead);
  }
}
