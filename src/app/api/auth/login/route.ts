import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createSession,
  setSessionCookie,
  validateCredentials,
} from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { email, password } = parsed.data;
  if (!validateCredentials(email, password)) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = await createSession({ email, role: "admin" });
  await setSessionCookie(token);
  return NextResponse.json({ ok: true });
}
