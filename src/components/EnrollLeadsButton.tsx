"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Sequence = { id: number; name: string };

export function EnrollLeadsButton() {
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [seqId, setSeqId] = useState<number | "">("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    fetch("/api/sequences")
      .then((r) => r.json())
      .then((d) => {
        setSequences(d.sequences ?? []);
        if (d.sequences?.[0]) setSeqId(d.sequences[0].id);
      })
      .catch(() => {});
  }, [open]);

  async function enroll() {
    if (!seqId) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/outreach/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sequenceId: seqId, query: params.toString() }),
      });
      const data = await res.json();
      setMsg(res.ok ? `Enrolled ${data.enrolled} leads.` : data.error ?? "Failed");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button className="btn-secondary" onClick={() => setOpen(true)}>
        Enroll in sequence
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <select
        className="input w-auto"
        value={seqId}
        onChange={(e) => setSeqId(e.target.value ? Number(e.target.value) : "")}
      >
        {sequences.length === 0 && <option value="">Loading…</option>}
        {sequences.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
      <button className="btn-primary" onClick={enroll} disabled={busy || !seqId}>
        {busy ? "Enrolling…" : "Enroll filtered"}
      </button>
      <button className="btn-secondary" onClick={() => setOpen(false)}>
        Cancel
      </button>
      {msg && <span className="text-xs text-slate-600">{msg}</span>}
    </div>
  );
}
