"use client";

import { useState } from "react";
import Link from "next/link";
import { INDUSTRIES, CONTRACTOR_INDUSTRIES } from "@/lib/constants";

type ScanResult = {
  domain: string;
  ok: boolean;
  wordpressDetected: boolean;
  industry: string | null;
  opportunityScore: number;
};

type Summary = {
  provider: string;
  queriesRun: number;
  candidatesFound: number;
  newSites: number;
  scanned: number;
  wordpressSites: number;
  contractorSites: number;
  results: ScanResult[];
  note?: string;
};

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-center">
      <div className="text-lg font-bold text-slate-900">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
    </div>
  );
}

export function DiscoverForm() {
  const [selected, setSelected] = useState<string[]>([...CONTRACTOR_INDUSTRIES]);
  const [locationsText, setLocationsText] = useState("");
  const [limit, setLimit] = useState(25);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggle = (industry: string) =>
    setSelected((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry],
    );

  async function run() {
    const locations = locationsText
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, 25);

    if (selected.length === 0) {
      setError("Pick at least one industry.");
      return;
    }

    setLoading(true);
    setError(null);
    setSummary(null);
    try {
      const res = await fetch("/api/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industries: selected, locations, limit }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Discovery failed");
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Discovery failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="card space-y-4 p-5">
        <div>
          <label className="label">Industries (contractor trades preselected)</label>
          <div className="flex flex-wrap gap-2">
            {INDUSTRIES.map((industry) => {
              const active = selected.includes(industry);
              const contractor = CONTRACTOR_INDUSTRIES.includes(industry as never);
              return (
                <button
                  key={industry}
                  type="button"
                  onClick={() => toggle(industry)}
                  className={`badge border ${
                    active
                      ? "border-brand-600 bg-brand-50 text-brand-700"
                      : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                  }`}
                  title={contractor ? "Contractor trade" : ""}
                >
                  {industry}
                  {contractor ? " ★" : ""}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="label">Target locations (one “City, ST” per line)</label>
            <textarea
              className="input h-28 font-mono text-xs"
              placeholder={"Austin, TX\nDallas, TX\nHouston, TX"}
              value={locationsText}
              onChange={(e) => setLocationsText(e.target.value)}
            />
            <p className="mt-1 text-xs text-slate-400">
              Leave blank to search nationally (less precise for local targeting).
            </p>
          </div>
          <div>
            <label className="label">Max sites to scan</label>
            <select
              className="input"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="btn-primary" onClick={run} disabled={loading}>
            {loading ? "Discovering…" : "Find local contractors"}
          </button>
          <p className="text-xs text-slate-400">
            Searches for contractor sites, drops directories, then scans each for
            WordPress + opportunity.
          </p>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      {summary && (
        <div className="card p-5">
          {summary.note && (
            <div className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              {summary.note}
            </div>
          )}
          <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
            <Stat label="Queries" value={summary.queriesRun} />
            <Stat label="Candidates" value={summary.candidatesFound} />
            <Stat label="New" value={summary.newSites} />
            <Stat label="Scanned" value={summary.scanned} />
            <Stat label="WordPress" value={summary.wordpressSites} />
            <Stat label="Contractors" value={summary.contractorSites} />
          </div>

          {summary.results.length > 0 && (
            <table className="mt-4 w-full text-sm">
              <tbody className="divide-y divide-slate-100">
                {summary.results.map((r) => (
                  <tr key={r.domain}>
                    <td className="py-2">
                      {r.ok ? (
                        <Link href={`/leads/${r.domain}`} className="font-medium text-brand-700">
                          {r.domain}
                        </Link>
                      ) : (
                        <span className="text-slate-500">{r.domain}</span>
                      )}
                    </td>
                    <td className="py-2 text-slate-600">
                      {r.wordpressDetected ? "WordPress" : "—"}
                      {r.industry ? ` · ${r.industry}` : ""}
                    </td>
                    <td className="py-2 text-right text-slate-600">
                      {r.ok ? r.opportunityScore : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
