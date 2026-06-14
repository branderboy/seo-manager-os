import { and, asc, eq, lte } from "drizzle-orm";
import { db } from "@/db";
import {
  websites,
  sequences,
  sequenceEnrollments,
  emailMessages,
  type SequenceStep,
  type LeadListFilters,
} from "@/db/schema";
import { normalizeDomain } from "@/lib/utils";
import { queryLeads, getLeadByDomain } from "./leads";
import { generateSalesAssets } from "./sales-assistant";
import { sendEmail } from "./resend";

function appUrl(): string {
  return process.env.APP_URL?.replace(/\/$/, "") || "http://localhost:3000";
}

function unsubscribeUrl(domain: string): string {
  return `${appUrl()}/api/unsubscribe?d=${encodeURIComponent(domain)}`;
}

/** Fill {{firstName}}, {{company}}, {{domain}} placeholders in a template. */
export function renderTemplate(
  template: string,
  vars: { firstName?: string | null; company?: string | null; domain: string },
): string {
  return template
    .replace(/\{\{\s*firstName\s*\}\}/gi, vars.firstName || "there")
    .replace(/\{\{\s*company\s*\}\}/gi, vars.company || vars.domain)
    .replace(/\{\{\s*domain\s*\}\}/gi, vars.domain);
}

type SendOutcome = { ok: boolean; status: string; error?: string };

/** Core send: respects opt-out + missing email, logs every attempt. */
async function deliver(
  domain: string,
  to: string | null,
  subject: string,
  body: string,
  optOut: boolean,
  meta: { sequenceId?: number; stepIndex?: number } = {},
): Promise<SendOutcome> {
  if (optOut) {
    return { ok: false, status: "skipped", error: "opted out" };
  }
  if (!to) {
    return { ok: false, status: "skipped", error: "no email" };
  }

  const result = await sendEmail({
    to,
    subject,
    text: body,
    unsubscribeUrl: unsubscribeUrl(domain),
  });

  await db.insert(emailMessages).values({
    domain,
    toEmail: to,
    subject,
    body,
    sequenceId: meta.sequenceId,
    stepIndex: meta.stepIndex,
    status: result.ok ? "sent" : "failed",
    providerId: result.id,
    error: result.error,
  });

  return { ok: result.ok, status: result.ok ? "sent" : "failed", error: result.error };
}

/**
 * Send a single one-off email to a lead using the AI-generated cold email
 * (subject parsed from the "Subject:" line).
 */
export async function sendSingleEmail(rawDomain: string): Promise<SendOutcome> {
  const domain = normalizeDomain(rawDomain);
  const lead = await getLeadByDomain(domain);
  if (!lead) return { ok: false, status: "failed", error: "lead not found" };

  const assets = await generateSalesAssets({
    domain: lead.website.domain,
    companyName: lead.website.companyName,
    industry: lead.website.industry,
    subIndustry: lead.website.subIndustry,
    location: lead.website.location,
    suggestedProduct: lead.website.suggestedProduct,
    contactName: lead.website.contactName,
    missingFeatures: lead.missingFeatures,
  });

  const { subject, body } = splitColdEmail(assets.coldEmail);
  return deliver(domain, lead.website.email, subject, body, lead.website.emailOptOut);
}

/** Split the AI cold email "Subject: x\n\nbody" into parts. */
export function splitColdEmail(text: string): { subject: string; body: string } {
  const match = text.match(/^\s*subject:\s*(.+)\n+([\s\S]*)$/i);
  if (match) return { subject: match[1].trim(), body: match[2].trim() };
  return { subject: "Quick idea for your site", body: text.trim() };
}

/** Enroll one lead into a sequence (first step scheduled per its delay). */
export async function enrollLead(rawDomain: string, sequenceId: number) {
  const domain = normalizeDomain(rawDomain);
  const [seq] = await db.select().from(sequences).where(eq(sequences.id, sequenceId));
  if (!seq) return null;

  const existing = await db
    .select()
    .from(sequenceEnrollments)
    .where(
      and(
        eq(sequenceEnrollments.domain, domain),
        eq(sequenceEnrollments.sequenceId, sequenceId),
      ),
    );
  if (existing.length) return existing[0];

  const firstDelay = seq.steps[0]?.delayDays ?? 0;
  const nextSendAt = new Date(Date.now() + firstDelay * 86_400_000);

  const [created] = await db
    .insert(sequenceEnrollments)
    .values({ sequenceId, domain, currentStep: 0, nextSendAt })
    .returning();
  return created;
}

/** Enroll all leads matching filters (up to limit) into a sequence. */
export async function enrollMany(
  filters: LeadListFilters,
  sequenceId: number,
  limit = 200,
): Promise<{ enrolled: number }> {
  const { rows } = await queryLeads(filters, { page: 1, pageSize: limit, sort: "score" });
  let enrolled = 0;
  for (const row of rows) {
    if (!row.email) continue;
    const e = await enrollLead(row.domain, sequenceId);
    if (e) enrolled++;
  }
  return { enrolled };
}

/**
 * Send all due sequence steps. For each active enrollment whose nextSendAt has
 * passed, render + send the current step, then advance or complete. Bounded
 * per invocation so a cron tick stays within the time limit.
 */
export async function processDueSends(maxPerTick = 50): Promise<{
  due: number;
  sent: number;
  skipped: number;
  failed: number;
}> {
  const now = new Date();
  const due = await db
    .select()
    .from(sequenceEnrollments)
    .where(
      and(
        eq(sequenceEnrollments.status, "active"),
        lte(sequenceEnrollments.nextSendAt, now),
      ),
    )
    .orderBy(asc(sequenceEnrollments.nextSendAt))
    .limit(maxPerTick);

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const enrollment of due) {
    const [seq] = await db
      .select()
      .from(sequences)
      .where(eq(sequences.id, enrollment.sequenceId));
    const [site] = await db
      .select()
      .from(websites)
      .where(eq(websites.domain, enrollment.domain));

    if (!seq || !seq.enabled || !site) {
      await db
        .update(sequenceEnrollments)
        .set({ status: "stopped" })
        .where(eq(sequenceEnrollments.id, enrollment.id));
      continue;
    }

    const step: SequenceStep | undefined = seq.steps[enrollment.currentStep];
    if (!step) {
      await db
        .update(sequenceEnrollments)
        .set({ status: "completed", nextSendAt: null })
        .where(eq(sequenceEnrollments.id, enrollment.id));
      continue;
    }

    const vars = {
      firstName: site.contactName?.split(" ")[0],
      company: site.companyName,
      domain: site.domain,
    };
    const outcome = await deliver(
      site.domain,
      site.email,
      renderTemplate(step.subject, vars),
      renderTemplate(step.body, vars),
      site.emailOptOut,
      { sequenceId: seq.id, stepIndex: enrollment.currentStep },
    );

    if (outcome.status === "sent") sent++;
    else if (outcome.status === "failed") failed++;
    else skipped++;

    // Opt-out => stop the enrollment entirely.
    if (outcome.error === "opted out") {
      await db
        .update(sequenceEnrollments)
        .set({ status: "unsubscribed" })
        .where(eq(sequenceEnrollments.id, enrollment.id));
      continue;
    }

    const nextStepIndex = enrollment.currentStep + 1;
    const nextStep = seq.steps[nextStepIndex];
    if (nextStep) {
      await db
        .update(sequenceEnrollments)
        .set({
          currentStep: nextStepIndex,
          lastSentAt: now,
          nextSendAt: new Date(Date.now() + (nextStep.delayDays ?? 0) * 86_400_000),
        })
        .where(eq(sequenceEnrollments.id, enrollment.id));
    } else {
      await db
        .update(sequenceEnrollments)
        .set({ status: "completed", lastSentAt: now, nextSendAt: null })
        .where(eq(sequenceEnrollments.id, enrollment.id));
    }
  }

  return { due: due.length, sent, skipped, failed };
}

/** Mark a domain opted-out and stop its active enrollments. */
export async function unsubscribeDomain(rawDomain: string): Promise<void> {
  const domain = normalizeDomain(rawDomain);
  await db
    .update(websites)
    .set({ emailOptOut: true, updatedAt: new Date() })
    .where(eq(websites.domain, domain));
  await db
    .update(sequenceEnrollments)
    .set({ status: "unsubscribed" })
    .where(
      and(
        eq(sequenceEnrollments.domain, domain),
        eq(sequenceEnrollments.status, "active"),
      ),
    );
}

/** Built-in 3-step starter drip, created on first use. */
export async function ensureDefaultSequence(): Promise<number> {
  const existing = await db.select().from(sequences).limit(1);
  if (existing.length) return existing[0].id;

  const steps: SequenceStep[] = [
    {
      delayDays: 0,
      subject: "Quick idea for {{company}}",
      body: "Hi {{firstName}},\n\nI was looking at {{domain}} and noticed a quick win that could turn more visitors into booked jobs. We add it to WordPress sites without a rebuild.\n\nWorth a 10-minute look? I can send a short audit video.\n\nBest,\nThe team",
    },
    {
      delayDays: 3,
      subject: "Re: Quick idea for {{company}}",
      body: "Hi {{firstName}},\n\nFollowing up — happy to record a 3-minute audit of {{domain}} showing exactly what I mean. Want me to send it over?\n\nBest,\nThe team",
    },
    {
      delayDays: 5,
      subject: "Should I close the file?",
      body: "Hi {{firstName}},\n\nDon't want to clutter your inbox. If growing leads from {{domain}} isn't a priority right now, no worries — just let me know and I'll close the file.\n\nBest,\nThe team",
    },
  ];

  const [created] = await db
    .insert(sequences)
    .values({ name: "Default 3-step drip", steps })
    .returning();
  return created.id;
}
