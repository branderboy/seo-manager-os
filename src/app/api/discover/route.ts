import { NextResponse } from "next/server";
import { z } from "zod";
import { discoverContractors } from "@/services/discovery/discover";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const schema = z.object({
  industries: z.array(z.string().min(2)).min(1).max(15),
  locations: z.array(z.string().min(2)).max(25).optional(),
  limit: z.number().int().min(1).max(50).optional(),
});

/**
 * POST /api/discover
 * Body: { industries: string[], locations?: string[], limit? }
 * Searches for local contractor websites, filters out directories, and runs
 * each candidate through the WordPress + classify + score pipeline.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Provide `industries` (1-15) and optional `locations`." },
      { status: 400 },
    );
  }

  const summary = await discoverContractors({
    industries: parsed.data.industries,
    locations: parsed.data.locations ?? [],
    limit: parsed.data.limit,
  });

  return NextResponse.json(summary);
}
