"use client";

import { useState } from "react";

type Assets = {
  coldEmail?: string | null;
  sms?: string | null;
  callScript?: string | null;
  loomOutline?: string | null;
};

const TABS: { key: keyof Assets; label: string }[] = [
  { key: "coldEmail", label: "Cold Email" },
  { key: "sms", label: "SMS" },
  { key: "callScript", label: "Call Script" },
  { key: "loomOutline", label: "Loom Outline" },
];

export function AssistantPanel({ domain }: { domain: string }) {
  const [assets, setAssets] = useState<Assets | null>(null);
  const [tab, setTab] = useState<keyof Assets>("coldEmail");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate(regenerate = false) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, regenerate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      setAssets(data.assets);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">AI Sales Assistant</h2>
        {assets && (
          <button
            className="text-xs font-medium text-brand-600 disabled:opacity-50"
            onClick={() => generate(true)}
            disabled={loading}
          >
            Regenerate
          </button>
        )}
      </div>

      {!assets ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
          <p className="mb-3 text-sm text-slate-500">
            Generate a cold email, SMS, call script, and Loom audit outline tailored
            to this lead.
          </p>
          <button className="btn-primary" onClick={() => generate(false)} disabled={loading}>
            {loading ? "Generating…" : "Generate outreach"}
          </button>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>
      ) : (
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`badge border ${
                  tab === t.key
                    ? "border-brand-600 bg-brand-50 text-brand-700"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <textarea
            readOnly
            value={assets[tab] ?? ""}
            className="h-56 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-700"
          />
          <button
            className="btn-secondary mt-2"
            onClick={() => navigator.clipboard.writeText(assets[tab] ?? "")}
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
}
