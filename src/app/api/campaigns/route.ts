import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { campaigns } from "@/db/schema";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  name: z.string().min(1).max(120),
  industries: z.array(z.string().min(2)).min(1).max(15),
  locations: z.array(z.string().min(2)).max(25).default([]),
  perRunLimit: z.number().int().min(1).max(50).default(25),
  frequency: z.enum(["daily", "weekly", "manual"]).default("daily"),
});

export async function GET() {
  const rows = await db.select().from(campaigns).orderBy(desc(campaigns.createdAt));
  return NextResponse.json({ campaigns: rows });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid campaign" }, { status: 400 });
  }
  const [created] = await db.insert(campaigns).values(parsed.data).returning();
  return NextResponse.json({ campaign: created }, { status: 201 });
}
