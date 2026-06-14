import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { leadLists } from "@/db/schema";
import { queryLeads } from "@/services/leads";

export const dynamic = "force-dynamic";

const filtersSchema = z.object({
  industry: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  minScore: z.number().optional(),
  maxScore: z.number().optional(),
  wordpressOnly: z.boolean().optional(),
  elementor: z.boolean().optional(),
  wpforms: z.boolean().optional(),
  contactForm7: z.boolean().optional(),
  gravityForms: z.boolean().optional(),
  woocommerce: z.boolean().optional(),
  missingQuoteTool: z.boolean().optional(),
  missingBookingTool: z.boolean().optional(),
  search: z.string().optional(),
});

const createSchema = z.object({
  listName: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  filters: filtersSchema,
});

/** GET /api/lead-lists — all saved lists, newest first. */
export async function GET() {
  const lists = await db.select().from(leadLists).orderBy(desc(leadLists.createdAt));
  return NextResponse.json({ lists });
}

/** POST /api/lead-lists — save a new filter-defined list (snapshots result count). */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid list payload" }, { status: 400 });
  }

  const { total } = await queryLeads(parsed.data.filters, { page: 1, pageSize: 1 });

  const [created] = await db
    .insert(leadLists)
    .values({
      listName: parsed.data.listName,
      description: parsed.data.description,
      filters: parsed.data.filters,
      totalResults: total,
    })
    .returning();

  return NextResponse.json({ list: created }, { status: 201 });
}
