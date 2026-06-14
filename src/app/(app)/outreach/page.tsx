import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { sequences, sequenceEnrollments, emailMessages } from "@/db/schema";
import { ensureDefaultSequence } from "@/services/outreach";
import { SequenceForm } from "@/components/SequenceForm";
import { SequenceRow } from "@/components/SequenceRow";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OutreachPage() {
  await ensureDefaultSequence();

  const [seqs, activeCounts, recent, statusCounts] = await Promise.all([
    db.select().from(sequences).orderBy(desc(sequences.createdAt)),
    db
      .select({
        sequenceId: sequenceEnrollments.sequenceId,
        count: sql<number>`count(*)`,
      })
      .from(sequenceEnrollments)
      .where(eq(sequenceEnrollments.status, "active"))
      .groupBy(sequenceEnrollments.sequenceId),
    db.select().from(emailMessages).orderBy(desc(emailMessages.sentAt)).limit(15),
    db
      .select({ status: sequenceEnrollments.status, count: sql<number>`count(*)` })
      .from(sequenceEnrollments)
      .groupBy(sequenceEnrollments.status),
  ]);

  const activeBySeq = new Map(activeCounts.map((r) => [r.sequenceId, Number(r.count)]));
  const totalActive = statusCounts.find((s) => s.status === "active")?.count ?? 0;
  const totalSent = recent.filter((m) => m.status === "sent").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Outreach</h1>
          <p className="text-sm text-slate-500">
            Send one-off cold emails or enroll leads in multi-step sequences that
            drip automatically. Sends run via Resend; due steps go out on schedule.
          </p>
        </div>
        <SequenceForm />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Sequences</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{seqs.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Active enrollments</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{Number(totalActive)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Recent sends</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{totalSent}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Enroll leads</p>
          <Link href="/leads" className="mt-1 inline-block text-sm font-medium text-brand-600">
            From Leads →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {seqs.map((s) => (
          <SequenceRow
            key={s.id}
            sequence={{
              id: s.id,
              name: s.name,
              steps: s.steps,
              enabled: s.enabled,
              activeEnrollments: activeBySeq.get(s.id) ?? 0,
            }}
          />
        ))}
      </div>

      <div className="card">
        <div className="border-b border-slate-200 px-5 py-3 font-semibold text-slate-900">
          Recent activity
        </div>
        {recent.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">
            No emails sent yet.
          </p>
        ) : (
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100">
              {recent.map((m) => (
                <tr key={m.id}>
                  <td className="px-5 py-2">
                    <Link href={`/leads/${m.domain}`} className="text-brand-700">
                      {m.domain}
                    </Link>
                  </td>
                  <td className="px-5 py-2 text-slate-600">{m.subject}</td>
                  <td className="px-5 py-2">
                    <span
                      className={`badge ${
                        m.status === "sent"
                          ? "bg-emerald-100 text-emerald-700"
                          : m.status === "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="px-5 py-2 text-right text-xs text-slate-400">
                    {formatDate(m.sentAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
