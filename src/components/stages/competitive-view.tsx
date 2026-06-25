"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEngagement } from "@/components/engagement/store";
import { competitiveLandscapeByType } from "@/lib/stage-content";

const RIVAL_SOV = [31, 22, 16];
const RIVAL_RANK = ["1.4", "2.1", "2.8"];

export function CompetitiveView() {
  const { engagement } = useEngagement();
  const landscape = competitiveLandscapeByType[engagement.model];

  // Rivals from the engagement + the active business (you), ranked by share of voice.
  const rivals = engagement.competitors.slice(0, 3).map((name, i) => ({
    name,
    sov: RIVAL_SOV[i] ?? 12,
    rank: RIVAL_RANK[i] ?? "3.0",
    ai: i < 2 ? "Cited" : "Absent",
    you: false,
  }));
  const youSov = Math.max(8, 100 - rivals.reduce((s, r) => s + r.sov, 0) - 30);
  const set = [
    ...rivals,
    { name: engagement.business, sov: youSov, rank: "4.8", ai: engagement.scores.ai >= 35 ? "Cited" : "Absent", you: true },
  ].sort((a, b) => b.sov - a.sov);

  return (
    <>
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Badge variant="accent">{engagement.model} SEO</Badge>
        <span>Market read for {engagement.business} · {engagement.market}</span>
      </div>

      <Card>
        <div className="p-6">
          <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">Competitor set &amp; share of voice</h3>
          <p className="mt-1 text-sm text-slate-600">Benchmarked against the goals and intent mapped upstream.</p>
          <div className="mt-5 space-y-3">
            {set.map((c) => (
              <div key={c.name} className={`rounded-lg border p-4 ${c.you ? "border-accent-300 bg-accent-50/40" : "border-[var(--border)]"}`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="inline-flex shrink-0 items-center rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-200">
                      {c.sov}% SOV
                    </span>
                    <span className={`truncate text-sm font-semibold ${c.you ? "text-slate-900" : "text-slate-800"}`}>
                      {c.name}{c.you && " (you)"}
                    </span>
                  </div>
                  <Badge variant={c.ai === "Cited" ? "accent" : "outline"}>{c.ai} in AI</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500">
                  <span>Avg. rank <strong className="text-slate-700">{c.rank}</strong></span>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${c.you ? "bg-accent-500" : "bg-slate-400"}`} style={{ width: `${c.sov}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-5 sm:grid-cols-2">
        {landscape.map((s) => (
          <Card key={s.label} className="p-6">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{s.label}</div>
            <div className="mt-2 text-lg font-bold text-slate-900">{s.value}</div>
            <p className="mt-1 text-sm text-slate-500">{s.note}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
