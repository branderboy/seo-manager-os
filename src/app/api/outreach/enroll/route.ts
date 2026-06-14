import { NextResponse } from "next/server";
import { z } from "zod";
import { enrollLead, enrollMany } from "@/services/outreach";
import { parseFilters } from "@/lib/filters";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

const schema = z.object({
  sequenceId: z.number().int(),
  domain: z.string().optional(),
  query: z.string().optional(),
  limit: z.number().int().min(1).max(500).optional(),
});

/**
 * POST /api/outreach/enroll
 * Either { sequenceId, domain } for a single lead, or { sequenceId, query }
 * to bulk-enroll everyone matching the current leads filter.
 */
export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (parsed.data.domain) {
    const enrollment = await enrollLead(parsed.data.domain, parsed.data.sequenceId);
    if (!enrollment) {
      return NextResponse.json({ error: "Sequence not found" }, { status: 404 });
    }
    return NextResponse.json({ enrolled: 1, enrollment });
  }

  const filters = parseFilters(new URLSearchParams(parsed.data.query ?? ""));
  const result = await enrollMany(
    filters,
    parsed.data.sequenceId,
    parsed.data.limit ?? 200,
  );
  return NextResponse.json(result);
}
