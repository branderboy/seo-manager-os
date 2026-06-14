import { NextResponse } from "next/server";
import { unsubscribeDomain } from "@/services/outreach";

export const dynamic = "force-dynamic";

/**
 * GET /api/unsubscribe?d=<domain>
 * Public (exempt from auth middleware). Opts a lead out of all email and stops
 * active enrollments. Linked from every outgoing email's footer.
 */
export async function GET(req: Request) {
  const domain = new URL(req.url).searchParams.get("d");
  if (!domain) {
    return new Response("Missing unsubscribe target.", { status: 400 });
  }
  await unsubscribeDomain(domain);
  return new Response(
    `<html><body style="font-family:sans-serif;padding:40px;text-align:center">
      <h2>You're unsubscribed</h2>
      <p>${domain} will no longer receive emails from us.</p>
    </body></html>`,
    { headers: { "Content-Type": "text/html" } },
  );
}
