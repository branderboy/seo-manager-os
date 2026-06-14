import { NextResponse } from "next/server";
import { runDueCampaigns } from "@/services/campaigns";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

/**
 * GET /api/cron/run-campaigns
 * Triggered by Vercel Cron (see vercel.json). Runs every campaign that's due.
 * Secured by CRON_SECRET: Vercel sends it as `Authorization: Bearer <secret>`.
 * This route is exempt from the auth middleware (see PUBLIC_PATHS).
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const result = await runDueCampaigns();
  return NextResponse.json({ ok: true, ...result, ranAt: new Date().toISOString() });
}
