import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { sequences } from "@/db/schema";

const patchSchema = z.object({ enabled: z.boolean() });

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update" }, { status: 400 });
  }
  const [updated] = await db
    .update(sequences)
    .set({ enabled: parsed.data.enabled, updatedAt: new Date() })
    .where(eq(sequences.id, id))
    .returning();
  return NextResponse.json({ sequence: updated });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  await db.delete(sequences).where(eq(sequences.id, id));
  return NextResponse.json({ ok: true });
}
