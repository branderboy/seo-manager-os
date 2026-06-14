"use client";

import { useEffect, useState } from "react";

type Sequence = { id: number; name: string; steps: unknown[] };

export function LeadOutreach({ domain, hasEmail }: { domain: string; hasEmail: boolean }) {
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [seqId, setSeqId] = useState<number | "">("");
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/sequences")
      .then((r) => r.json())
      .then((d) => {
        setSequences(d.sequences ?? []);
        if (d.sequences?.[0]) setSeqId(d.sequences[0].id);
      })
      .catch(() => {});
  }, []);

  async function sendSingle() {
    setBusy("send");
    setMsg(null);
    try {
      const res = await fetch("/api/outreach/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });
      const data = await res.json();
      setMsg(
        data.ok
          ? `Sent${data.mocked ? " (mock — set RESEND_API_KEY to send for real)" : ""}.`
          : `Not sent: ${data.error ?? "failed"}`,
      );
    } finally {
      setBusy(null);
    }
  }

  async function enroll() {
    if (!seqId) return;
    setBusy("enroll");
    setMsg(null);
    try {
      const res = await fetch("/api/outreach/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, sequenceId: seqId }),
      });
      const data = await res.json();
      setMsg(res.ok ? "Enrolled in sequence." : `Failed: ${data.error ?? "error"}`);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="card p-5">
      <h2 className="mb-3 font-semibold text-slate-900">Outreach</h2>
      {!hasEmail && (
        <p className="mb-3 text-xs text-amber-700">
          No email on file — find one first (it&apos;ll send once available).
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <button className="btn-primary" onClick={sendSingle} disabled={!!busy}>
          {busy === "send" ? "Sending…" : "Send cold email"}
        </button>
        <select
          className="input w-auto"
          value={seqId}
          onChange={(e) => setSeqId(e.target.value ? Number(e.target.value) : "")}
        >
          {sequences.length === 0 && <option value="">No sequences</option>}
          {sequences.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.steps.length} steps)
            </option>
          ))}
        </select>
        <button className="btn-secondary" onClick={enroll} disabled={!!busy || !seqId}>
          {busy === "enroll" ? "Enrolling…" : "Enroll in sequence"}
        </button>
      </div>
      {msg && <p className="mt-3 text-sm text-slate-600">{msg}</p>}
    </div>
  );
}
