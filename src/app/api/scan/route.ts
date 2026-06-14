import { NextResponse } from "next/server";
import { z } from "zod";
import { scanDomains } from "@/services/scanner";

export const maxDuration = 60;

const schema = z.object({
  domains: z.array(z.string().min(3)).min(1).max(50),
  concurrency: z.number().int().min(1).max(8).optional(),
});

/**
 * POST /api/scan
 * Body: { domains: string[], concurrency?: number }
 * Runs the discovery + classification + scoring pipeline for each domain.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Provide a `domains` array (1-50 entries)." },
      { status: 400 },
    );
  }

  const results = await scanDomains(parsed.data.domains, parsed.data.concurrency ?? 4);
  const summary = {
    scanned: results.length,
    wordpress: results.filter((r) => r.wordpressDetected).length,
    failed: results.filter((r) => !r.ok).length,
  };

  return NextResponse.json({ summary, results });
}
