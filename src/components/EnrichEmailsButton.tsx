"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Summary = {
  enabled: boolean;
  targeted: number;
  attempted: number;
  found: number;
  remaining: number;
  note?: string;
};

const MAX_BATCHES = 50;

export function EnrichEmailsButton() {
  const router = useRouter();
  const params = useSearchParams();
  const [running, setRunning] = useState(false);
  const [foundTotal, setFoundTotal] = useState(0);
  const [status, setStatus] = useState<string | null>(null);

  async function run() {
    setRunning(true);
    setFoundTotal(0);
    setStatus("Finding emails…");
    let found = 0;

    try {
      for (let i = 0; i < MAX_BATCHES; i++) {
        const res = await fetch("/api/enrich-emails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: params.toString(), limit: 100 }),
        });
        const data: Summary & { error?: string } = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Enrichment failed");

        if (!data.enabled) {
          setStatus(data.note ?? "Email finder is not configured.");
          return;
        }

        found += data.found;
        setFoundTotal(found);
        setStatus(`Found ${found} so far · ${data.remaining} remaining…`);

        // Done when nothing left to attempt, or this batch made no attempts.
        if (data.remaining === 0 || data.attempted === 0) break;
      }
      setStatus(`Done — found ${found} email${found === 1 ? "" : "s"}.`);
      router.refresh();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Enrichment failed");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button className="btn-secondary" onClick={run} disabled={running}>
        {running ? "Finding emails…" : "Find emails"}
      </button>
      {status && <span className="text-xs text-slate-500">{status}</span>}
    </div>
  );
}
