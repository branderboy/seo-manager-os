import type { Metadata } from "next";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImpactBadge } from "@/components/ui/status-badge";
import { ButtonLink } from "@/components/ui/button";
import { EngName } from "@/components/engagement/eng";
import { diagnosis } from "@/lib/data";
import type { Cause } from "@/lib/data";

export const metadata: Metadata = { title: "Diagnosis Engine" };

function CauseCard({ cause, rank }: { cause: Cause; rank: "Primary" | "Secondary" }) {
  const primary = rank === "Primary";
  return (
    <Card className={primary ? "border-accent-200 ring-1 ring-accent-100" : ""}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            {rank} cause
          </span>
          <ImpactBadge impact={cause.impact} />
        </div>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          {cause.title}
        </h3>

        <div className="mt-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Confidence</span>
            <span className="font-semibold text-slate-800">{cause.confidence}%</span>
          </div>
          <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${primary ? "bg-accent-500" : "bg-slate-400"}`}
              style={{ width: `${cause.confidence}%` }}
            />
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Evidence
          </div>
          <ul className="space-y-2">
            {cause.evidence.map((e) => (
              <li key={e} className="flex items-start gap-2 text-sm text-slate-600">
                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                {e}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}

export default function DiagnosisPage() {
  return (
    <>
      <PageHeader
        stage={4}
        title="Diagnosis Engine"
        badge="Root-cause analysis"
        description="Not a generic audit. The OS resolves every symptom to a ranked set of causes — each with confidence and impact — so the strategy targets the real constraint."
      />

      {/* Headline summary */}
      <Card className="border-slate-900 bg-slate-900 text-white">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <AlertTriangle className="h-5 w-5 text-accent-300" />
          </span>
          <div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent-300">
              Diagnosis · <EngName />
            </div>
            <p className="text-[15px] leading-relaxed text-slate-200">{diagnosis.summary}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <CauseCard cause={diagnosis.primary} rank="Primary" />
        <CauseCard cause={diagnosis.secondary} rank="Secondary" />
      </div>

      {/* Possible causes */}
      <Card>
        <div className="p-6">
          <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">
            Possible contributing causes
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Ranked by confidence. Monitored but not yet primary drivers.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {diagnosis.possible.map((p) => (
              <div
                key={p.title}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-800">{p.title}</span>
                  <Badge variant={p.impact === "High" ? "bad" : p.impact === "Medium" ? "warn" : "default"}>
                    {p.impact}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-slate-400" style={{ width: `${p.confidence}%` }} />
                  </div>
                  <span className="text-xs font-medium text-slate-500">{p.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <ButtonLink href="/strategy">
          Generate strategy brief
          <ChevronRight className="h-4 w-4" />
        </ButtonLink>
      </div>
    </>
  );
}
