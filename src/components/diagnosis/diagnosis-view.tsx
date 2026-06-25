"use client";

import { AlertTriangle, Clock, DollarSign, User, GitBranch } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useEngagement } from "@/components/engagement/store";
import { getDiagnosis, type Fix, type Impact, type FixStatus } from "@/lib/recommendations";

const impactVariant: Record<Impact, "good" | "warn" | "default"> = { High: "good", Medium: "warn", Low: "default" };
const difficultyVariant: Record<Impact, "bad" | "warn" | "good"> = { High: "bad", Medium: "warn", Low: "good" };
const statusVariant: Record<FixStatus, "default" | "accent" | "bad" | "good"> = {
  "Not started": "default",
  "In progress": "accent",
  Blocked: "bad",
  Done: "good",
};
const priorityRing: Record<number, string> = { 1: "bg-rose-500", 2: "bg-amber-500", 3: "bg-slate-400" };

export function DiagnosisView() {
  const { engagement } = useEngagement();
  const { primary, groups, summary } = getDiagnosis(engagement.model);
  const s = engagement.scores;

  return (
    <div className="space-y-6">
      {/* Active client */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">{engagement.business}</h2>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Badge variant="accent">{engagement.model} SEO</Badge>
            <span>{engagement.industry}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>{engagement.market}</span>
          </div>
        </div>
      </div>

      {/* Primary root cause + baseline */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="border-2 border-accent-500 p-6 lg:col-span-2">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-accent-600">
            <AlertTriangle className="h-3.5 w-3.5" /> Primary root cause
          </div>
          <h3 className="mt-1.5 text-xl font-bold text-slate-900">{primary.title}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{primary.summary}</p>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-accent-500" style={{ width: `${primary.confidence}%` }} />
          </div>
          <div className="mt-1.5 flex justify-between text-xs text-slate-600">
            <span>{primary.confidence}% confidence</span>
            <span>{primary.impact} impact</span>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Baseline</h4>
          <div className="mt-3 space-y-3">
            <Baseline label="Visibility" value={s.visibility} />
            <Baseline label="Trust" value={s.trust} />
            <Baseline label="AI visibility" value={s.ai} />
          </div>
        </Card>
      </div>

      {/* What to fix first */}
      <section className="space-y-5">
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900">What to fix first</h3>
          <p className="mt-1 text-base text-slate-500">
            {summary.totalFixes} prioritized fixes · {summary.p1} to do now · {summary.totalHours}h total ·{" "}
            ${summary.totalRevenue.toLocaleString()}/mo upside
          </p>
        </div>

        {groups.map(
          (g) =>
            g.fixes.length > 0 && (
              <div key={g.priority} className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${priorityRing[g.priority]}`}>
                    {g.priority}
                  </span>
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Priority {g.priority} — {g.label}
                  </h4>
                </div>
                <div className="space-y-3">
                  {g.fixes.map((f) => (
                    <FixCard key={f.id} fix={f} />
                  ))}
                </div>
              </div>
            )
        )}
      </section>
    </div>
  );
}

function Baseline({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-800">{value}</span>
      </div>
      <Progress value={value} />
    </div>
  );
}

function FixCard({ fix: f }: { fix: Fix }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h5 className="text-[17px] font-semibold tracking-tight text-slate-900">{f.title}</h5>
            <Badge variant={statusVariant[f.status]}>{f.status}</Badge>
          </div>
          <p className="mt-1 text-[15px] leading-relaxed text-slate-600">{f.why}</p>
        </div>
        <div className="flex shrink-0 flex-col items-center rounded-lg bg-accent-50 px-3 py-1.5">
          <span className="text-lg font-bold text-accent-700">{f.score}</span>
          <span className="text-[11px] font-medium uppercase tracking-wide text-accent-600">priority</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-[var(--border)] pt-4 sm:grid-cols-3 lg:grid-cols-4">
        <Field label="Business impact"><Badge variant={impactVariant[f.businessImpact]}>{f.businessImpact}</Badge></Field>
        <Field label="SEO impact"><Badge variant={impactVariant[f.seoImpact]}>{f.seoImpact}</Badge></Field>
        <Field label="Difficulty"><Badge variant={difficultyVariant[f.difficulty]}>{f.difficulty}</Badge></Field>
        <Field label="Est. hours">
          <span className="inline-flex items-center gap-1 font-medium text-slate-700"><Clock className="h-4 w-4 text-slate-400" />{f.hours}h</span>
        </Field>
        <Field label="Revenue / mo">
          <span className="inline-flex items-center gap-1 font-medium text-emerald-600"><DollarSign className="h-4 w-4" />{f.revenuePerMonth.toLocaleString()}</span>
        </Field>
        <Field label="Owner">
          <span className="inline-flex items-center gap-1 font-medium text-slate-700"><User className="h-4 w-4 text-slate-400" />{f.owner}</span>
        </Field>
        <Field label="Dependencies">
          {f.dependencies.length === 0 ? (
            <span className="text-slate-400">None</span>
          ) : (
            <span className="inline-flex items-center gap-1 text-slate-700"><GitBranch className="h-4 w-4 text-slate-400" />{f.dependencies.join(", ")}</span>
          )}
        </Field>
      </div>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">{label}</div>
      <div className="text-sm">{children}</div>
    </div>
  );
}
