"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Campaign = {
  id: number;
  name: string;
  industries: string[];
  locations: string[];
  frequency: string;
  perRunLimit: number;
  enabled: boolean;
  lastRunAt: string | null;
  lastRunSummary: Record<string, number> | null;
};

export function CampaignRow({ campaign }: { campaign: Campaign }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [runMsg, setRunMsg] = useState<string | null>(null);

  async function toggleEnabled() {
    setBusy("toggle");
    await fetch(`/api/campaigns/${campaign.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !campaign.enabled }),
    });
    setBusy(null);
    router.refresh();
  }

  async function runNow() {
    setBusy("run");
    setRunMsg("Running…");
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}/run`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Run failed");
      const s = data.summary ?? {};
      setRunMsg(
        `Done — ${s.contractorSites ?? 0} contractors, ${s.emailsFound ?? 0} emails`,
      );
      router.refresh();
    } catch (err) {
      setRunMsg(err instanceof Error ? err.message : "Run failed");
    } finally {
      setBusy(null);
    }
  }

  async function remove() {
    if (!confirm(`Delete campaign "${campaign.name}"?`)) return;
    setBusy("delete");
    await fetch(`/api/campaigns/${campaign.id}`, { method: "DELETE" });
    router.refresh();
  }

  const last = campaign.lastRunSummary;

  return (
    <div className="card flex flex-col gap-3 p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900">{campaign.name}</h3>
            <span
              className={`badge ${
                campaign.enabled
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {campaign.enabled ? "Active" : "Paused"}
            </span>
            <span className="badge bg-slate-100 text-slate-600 capitalize">
              {campaign.frequency}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {campaign.industries.length} trades ·{" "}
            {campaign.locations.length || "national"} locations ·{" "}
            {campaign.perRunLimit}/run
          </p>
        </div>
        <button onClick={remove} disabled={!!busy} className="text-xs text-slate-400 hover:text-red-600">
          Delete
        </button>
      </div>

      <div className="text-xs text-slate-500">
        {campaign.lastRunAt ? (
          <>
            Last run {new Date(campaign.lastRunAt).toLocaleString()}
            {last && (
              <>
                {" "}
                · {last.contractorSites ?? 0} contractors · {last.emailsFound ?? 0}{" "}
                emails · {last.newSites ?? 0} new
              </>
            )}
          </>
        ) : (
          "Never run yet"
        )}
      </div>

      <div className="flex items-center gap-2">
        <button className="btn-primary" onClick={runNow} disabled={!!busy}>
          {busy === "run" ? "Running…" : "Run now"}
        </button>
        <button className="btn-secondary" onClick={toggleEnabled} disabled={!!busy}>
          {campaign.enabled ? "Pause" : "Activate"}
        </button>
        {runMsg && <span className="text-xs text-slate-500">{runMsg}</span>}
      </div>
    </div>
  );
}
