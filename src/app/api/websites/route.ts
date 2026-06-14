import { NextResponse } from "next/server";
import { queryLeads } from "@/services/leads";
import { parseFilters, parseSort } from "@/lib/filters";

/**
 * GET /api/websites?industry=Roofing&state=TX&minScore=70&page=1&sort=score
 * Returns a filtered, paginated page of leads.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const filters = parseFilters(url.searchParams);
  const sort = parseSort(url.searchParams);
  const page = Number(url.searchParams.get("page") ?? "1") || 1;

  const result = await queryLeads(filters, { page, sort });
  return NextResponse.json(result);
}
