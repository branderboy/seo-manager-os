import { NextResponse } from "next/server";
import { runCampaignById } from "@/services/campaigns";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

/** POST /api/campaigns/:id/run — run a campaign immediately ("Run now"). */
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const result = await runCampaignById(id);
  if (!result) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }
  return NextResponse.json(result);
}
