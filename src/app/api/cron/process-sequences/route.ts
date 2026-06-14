import { NextResponse } from "next/server";
import { processDueSends } from "@/services/outreach";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

/**
 * GET /api/cron/process-sequences
 * Triggered by Vercel Cron. Sends all due sequence steps. Secured by
 * CRON_SECRET (sent as `Authorization: Bearer <secret>`).
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await processDueSends();
  return NextResponse.json({ ok: true, ...result, ranAt: new Date().toISOString() });
}
