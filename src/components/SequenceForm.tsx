"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = { subject: string; body: string; delayDays: number };

const EMPTY: Step = { subject: "", body: "", delayDays: 0 };

export function SequenceForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [steps, setSteps] = useState<Step[]>([{ ...EMPTY }]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(i: number, patch: Partial<Step>) {
    setSteps((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }

  async function save() {
    if (!name.trim() || steps.some((s) => !s.subject.trim() || !s.body.trim())) {
      setError("Name and every step's subject + body are required.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/sequences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, steps }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      setName("");
      setSteps([{ ...EMPTY }]);
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button className="btn-primary" onClick={() => setOpen(true)}>
        + New sequence
      </button>
    );
  }

  return (
    <div className="card space-y-4 p-5">
      <div>
        <label className="label">Sequence name</label>
        <input
          className="input"
          placeholder="Roofing 3-step"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <p className="text-xs text-slate-400">
        Placeholders: <code>{"{{firstName}}"}</code>, <code>{"{{company}}"}</code>,{" "}
        <code>{"{{domain}}"}</code>. Step 1 delay is from enrollment; later delays
        are from the previous send.
      </p>

      {steps.map((step, i) => (
        <div key={i} className="rounded-lg border border-slate-200 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Step {i + 1}</span>
            <label className="flex items-center gap-1 text-xs text-slate-500">
              Wait
              <input
                type="number"
                min={0}
                className="input w-16 px-2 py-1"
                value={step.delayDays}
                onChange={(e) => update(i, { delayDays: Number(e.target.value) })}
              />
              days
            </label>
          </div>
          <input
            className="input mb-2"
            placeholder="Subject"
            value={step.subject}
            onChange={(e) => update(i, { subject: e.target.value })}
          />
          <textarea
            className="input h-24 text-sm"
            placeholder="Body"
            value={step.body}
            onChange={(e) => update(i, { body: e.target.value })}
          />
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-2">
        <button
          className="btn-secondary"
          onClick={() => setSteps((p) => [...p, { ...EMPTY, delayDays: 3 }])}
          disabled={steps.length >= 10}
        >
          + Add step
        </button>
        {steps.length > 1 && (
          <button
            className="btn-secondary"
            onClick={() => setSteps((p) => p.slice(0, -1))}
          >
            Remove last
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button className="btn-primary" onClick={save} disabled={busy}>
          {busy ? "Saving…" : "Create sequence"}
        </button>
        <button className="btn-secondary" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </div>
  );
}
