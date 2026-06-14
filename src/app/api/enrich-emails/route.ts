import { NextResponse } from "next/server";
import { z } from "zod";
import { enrichEmails } from "@/services/email-enrichment";
import { parseFilters } from "@/lib/filters";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const schema = z.object({
  query: z.string().optional(),
  limit: z.number().int().min(1).max(300).optional(),
});

/**
 * POST /api/enrich-emails
 * Body: { query?: "<leads query string>", limit? }
 * Bulk-finds emails (Hunter) for the filtered set of leads that have none.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body ?? {});
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const params = new URLSearchParams(parsed.data.query ?? "");
  const filters = parseFilters(params);

  const summary = await enrichEmails(filters, { limit: parsed.data.limit ?? 100 });
  return NextResponse.json(summary);
}
