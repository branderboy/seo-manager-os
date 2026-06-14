import { NextResponse } from "next/server";
import { z } from "zod";
import { sendSingleEmail } from "@/services/outreach";

export const maxDuration = 45;
export const dynamic = "force-dynamic";

const schema = z.object({ domain: z.string().min(3) });

/** POST /api/outreach/send — send a single AI cold email to one lead. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Provide a domain" }, { status: 400 });
  }
  const result = await sendSingleEmail(parsed.data.domain);
  const status = result.ok ? 200 : result.status === "skipped" ? 422 : 502;
  return NextResponse.json(result, { status });
}
