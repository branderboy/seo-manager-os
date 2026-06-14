import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { sequences } from "@/db/schema";
import { ensureDefaultSequence } from "@/services/outreach";

export const dynamic = "force-dynamic";

const stepSchema = z.object({
  subject: z.string().min(1),
  body: z.string().min(1),
  delayDays: z.number().int().min(0).max(60),
});

const createSchema = z.object({
  name: z.string().min(1).max(120),
  steps: z.array(stepSchema).min(1).max(10),
});

export async function GET() {
  // Make sure a starter sequence exists so the UI is never empty.
  await ensureDefaultSequence();
  const rows = await db.select().from(sequences).orderBy(desc(sequences.createdAt));
  return NextResponse.json({ sequences: rows });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid sequence" }, { status: 400 });
  }
  const [created] = await db.insert(sequences).values(parsed.data).returning();
  return NextResponse.json({ sequence: created }, { status: 201 });
}
