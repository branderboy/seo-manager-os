"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { INDUSTRIES, CONTRACTOR_INDUSTRIES } from "@/lib/constants";

export function CampaignForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string[]>([...CONTRACTOR_INDUSTRIES]);
  const [locationsText, setLocationsText] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [perRunLimit, setPerRunLimit] = useState(25);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (i: string) =>
    setSelected((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

  async function save() {
    const locations = locationsText
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (!name.trim() || selected.length === 0) {
      setError("Name and at least one industry are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          industries: selected,
          locations,
          frequency,
          perRunLimit,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed to save");
      setName("");
      setLocationsText("");
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button className="btn-primary" onClick={() => setOpen(true)}>
        + New campaign
      </button>
    );
  }

  return (
    <div className="card space-y-4 p-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <label className="label">Campaign name</label>
          <input
            className="input"
            placeholder="Texas roofers — daily"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Frequency</label>
            <select
              className="input"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="manual">Manual only</option>
            </select>
          </div>
          <div>
            <label className="label">Sites / run</label>
            <select
              className="input"
              value={perRunLimit}
              onChange={(e) => setPerRunLimit(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="label">Industries</label>
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggle(i)}
              className={`badge border ${
                selected.includes(i)
                  ? "border-brand-600 bg-brand-50 text-brand-700"
                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Locations (one “City, ST” per line)</label>
        <textarea
          className="input h-24 font-mono text-xs"
          placeholder={"Austin, TX\nDallas, TX"}
          value={locationsText}
          onChange={(e) => setLocationsText(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button className="btn-primary" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Create campaign"}
        </button>
        <button className="btn-secondary" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </div>
  );
}
