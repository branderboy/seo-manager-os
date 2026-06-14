import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { salesAssets } from "@/db/schema";
import { getLeadByDomain } from "@/services/leads";
import { generateSalesAssets } from "@/services/sales-assistant";
import { normalizeDomain } from "@/lib/utils";

export const maxDuration = 45;

const schema = z.object({
  domain: z.string().min(3),
  regenerate: z.boolean().optional(),
});

/**
 * POST /api/assistant
 * Body: { domain, regenerate? }
 * Returns cached sales assets for a lead, or generates a fresh set.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Provide a domain" }, { status: 400 });
  }

  const domain = normalizeDomain(parsed.data.domain);

  if (!parsed.data.regenerate) {
    const [existing] = await db
      .select()
      .from(salesAssets)
      .where(eq(salesAssets.domain, domain))
      .orderBy(desc(salesAssets.generatedAt))
      .limit(1);
    if (existing) return NextResponse.json({ assets: existing, cached: true });
  }

  const lead = await getLeadByDomain(domain);
  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const assets = await generateSalesAssets({
    domain: lead.website.domain,
    companyName: lead.website.companyName,
    industry: lead.website.industry,
    subIndustry: lead.website.subIndustry,
    location: lead.website.location,
    suggestedProduct: lead.website.suggestedProduct,
    contactName: lead.website.contactName,
    missingFeatures: lead.missingFeatures,
  });

  const [saved] = await db
    .insert(salesAssets)
    .values({ domain, ...assets })
    .returning();

  return NextResponse.json({ assets: saved, cached: false });
}
