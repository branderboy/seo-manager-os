"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEngagement } from "@/components/engagement/store";
import { intentByType } from "@/lib/stage-content";

const tierTone: Record<string, string> = {
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};
const order = ["blue", "amber", "emerald"];

export function IntentView() {
  const { engagement } = useEngagement();
  const funnel = intentByType[engagement.model];

  return (
    <>
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Badge variant="accent">{engagement.model} SEO</Badge>
        <span>Intent mapped for {engagement.business}</span>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {funnel.map((f, i) => (
          <Card key={f.tier} className="p-6">
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center rounded-md px-2 py-0.5 font-mono text-xs font-semibold uppercase tracking-wide ring-1 ring-inset ${tierTone[order[i] ?? "blue"]}`}>
                {f.tier}
              </span>
              <span className="text-sm font-semibold text-slate-500">{f.share}% of demand</span>
            </div>
            <h3 className="mt-3 text-lg font-bold text-slate-900">{f.name}</h3>
            <p className="text-sm text-slate-500">{f.intent}</p>
            <div className="mt-4">
              <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Example queries</div>
              <ul className="space-y-1.5">
                {f.queries.map((q) => (
                  <li key={q} className="text-sm text-slate-600">&ldquo;{q}&rdquo;</li>
                ))}
              </ul>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-4">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Aligned goal</span>
              <Badge variant="accent">{f.goal}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
