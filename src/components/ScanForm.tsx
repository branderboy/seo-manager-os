"use client";

import { useState } from "react";
import Link from "next/link";

type ScanResult = {
  domain: string;
  ok: boolean;
  wordpressDetected: boolean;
  industry: string | null;
  opportunityScore: number;
  suggestedProduct: string | null;
  error?: string;
};

export function ScanForm() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ScanResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    const domains = input
      .split(/[\s,]+/)
      .map((d) => d.trim())
      .filter(Boolean)
      .slice(0, 50);
    if (domains.length === 0) return;

    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domains }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Scan failed");
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="card p-5">
        <label className="label">Domains to scan (one per line, max 50)</label>
        <textarea
          className="input h-40 font-mono text-xs"
          placeholder={"acmeroofing.com\nbluskyhvac.com\nlonestarplumbing.com"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="mt-3 flex items-center gap-3">
          <button className="btn-primary" onClick={run} disabled={loading}>
            {loading ? "Scanning…" : "Run pipeline"}
          </button>
          <p className="text-xs text-slate-400">
            Fetches each homepage, detects WordPress + plugins, classifies the
            industry, and scores the opportunity.
          </p>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      {results && (
        <div className="card overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm font-medium text-slate-600">
            {results.filter((r) => r.ok).length}/{results.length} scanned ·{" "}
            {results.filter((r) => r.wordpressDetected).length} WordPress
          </div>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100">
              {results.map((r) => (
                <tr key={r.domain}>
                  <td className="px-5 py-3">
                    {r.ok ? (
                      <Link
                        href={`/leads/${r.domain}`}
                        className="font-medium text-brand-700"
                      >
                        {r.domain}
                      </Link>
                    ) : (
                      <span className="font-medium text-slate-500">{r.domain}</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {r.ok ? (
                      <>
                        {r.wordpressDetected ? "WordPress" : "Not WordPress"}
                        {r.industry ? ` · ${r.industry}` : ""}
                      </>
                    ) : (
                      <span className="text-red-500">{r.error ?? "failed"}</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right text-slate-600">
                    {r.ok ? r.opportunityScore : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
