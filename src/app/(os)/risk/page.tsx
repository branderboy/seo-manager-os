import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  portfolioRisk,
  riskSummary,
  riskTone,
  riskBadge,
  RISK_DIMS,
  type ClientRisk,
} from "@/lib/risk";

export const metadata: Metadata = { title: "Risk Center" };

export default function RiskCenterPage() {
  return (
    <>
      <PageHeader
        title="Risk Center"
        description="Business risk per client across eight dimensions — where revenue, traffic and visibility are exposed. Higher is more at risk."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <div className="text-sm font-medium text-slate-600">Portfolio risk</div>
          <div className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">{riskSummary.avg}</div>
          <div className="mt-2"><Progress value={riskSummary.avg} tone={riskTone(riskSummary.avg)} /></div>
        </Card>
        <Card className="p-5">
          <div className="text-sm font-medium text-slate-600">High-risk clients</div>
          <div className="mt-1 text-3xl font-semibold tracking-tight text-rose-600">{riskSummary.high}</div>
          <div className="mt-2 text-sm text-slate-500">of {riskSummary.clients} accounts</div>
        </Card>
        <Card className="hidden p-5 lg:block">
          <div className="text-sm font-medium text-slate-600">Most common exposure</div>
          <div className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">AI Search</div>
          <div className="mt-2 text-sm text-slate-500">across the portfolio</div>
        </Card>
      </div>

      <div className="space-y-4">
        {portfolioRisk.map((r) => (
          <RiskCard key={r.client.id} risk={r} />
        ))}
      </div>
    </>
  );
}

function RiskCard({ risk: r }: { risk: ClientRisk }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white ${r.client.color}`}>
            {r.client.initials}
          </span>
          <div>
            <div className="text-[15px] font-semibold tracking-tight text-slate-900">{r.client.name}</div>
            <div className="text-sm text-slate-500">
              {r.client.model} · {r.client.industry}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-900">{r.overall}</div>
            <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">risk</div>
          </div>
          <Badge variant={riskBadge(r.level)}>{r.level}</Badge>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-[var(--border)] pt-4 sm:grid-cols-4">
        {RISK_DIMS.map((d) => (
          <div key={d}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className={`text-slate-500 ${d === r.topRisk ? "font-semibold text-slate-700" : ""}`}>{d}</span>
              <span className="font-medium text-slate-700">{r.dims[d]}</span>
            </div>
            <Progress value={r.dims[d]} tone={riskTone(r.dims[d])} />
          </div>
        ))}
      </div>
    </Card>
  );
}
