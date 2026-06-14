"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = { subject: string; body: string; delayDays: number };
type Sequence = {
  id: number;
  name: string;
  steps: Step[];
  enabled: boolean;
  activeEnrollments: number;
};

export function SequenceRow({ sequence }: { sequence: Sequence }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    await fetch(`/api/sequences/${sequence.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !sequence.enabled }),
    });
    router.refresh();
  }

  async function remove() {
    if (!confirm(`Delete sequence "${sequence.name}"?`)) return;
    setBusy(true);
    await fetch(`/api/sequences/${sequence.id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900">{sequence.name}</h3>
            <span
              className={`badge ${
                sequence.enabled
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {sequence.enabled ? "Active" : "Paused"}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {sequence.steps.length} steps · {sequence.activeEnrollments} active enrollments
          </p>
        </div>
        <button onClick={remove} disabled={busy} className="text-xs text-slate-400 hover:text-red-600">
          Delete
        </button>
      </div>

      <ol className="mt-3 space-y-1 text-xs text-slate-600">
        {sequence.steps.map((s, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-slate-400">
              {i === 0 ? "Day 0" : `+${s.delayDays}d`}
            </span>
            <span className="truncate">{s.subject}</span>
          </li>
        ))}
      </ol>

      <button className="btn-secondary mt-3" onClick={toggle} disabled={busy}>
        {sequence.enabled ? "Pause" : "Activate"}
      </button>
    </div>
  );
}
