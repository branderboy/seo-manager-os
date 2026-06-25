import { Clock, DollarSign, User, GitBranch } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { priorityGroups, diagnosisSummary, type Fix, type Impact, type FixStatus } from "@/lib/diagnosis";

const impactVariant: Record<Impact, "good" | "warn" | "default"> = {
  High: "good",
  Medium: "warn",
  Low: "default",
};
// Difficulty reads inverted — High = hard = bad.
const difficultyVariant: Record<Impact, "bad" | "warn" | "good"> = {
  High: "bad",
  Medium: "warn",
  Low: "good",
};
const statusVariant: Record<FixStatus, "default" | "accent" | "bad" | "good"> = {
  "Not started": "default",
  "In progress": "accent",
  Blocked: "bad",
  Done: "good",
};
const priorityRing: Record<number, string> = {
  1: "bg-rose-500",
  2: "bg-amber-500",
  3: "bg-slate-400",
};

export function DiagnosisPriorities() {
  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900">What to fix first</h3>
          <p className="mt-1 text-base text-slate-500">
            {diagnosisSummary.totalFixes} prioritized fixes · {diagnosisSummary.p1} to do now ·{" "}
            {diagnosisSummary.totalHours}h total · ${diagnosisSummary.totalRevenue.toLocaleString()}/mo upside
          </p>
        </div>
      </div>

      {priorityGroups.map(
        (g) =>
          g.fixes.length > 0 && (
            <div key={g.priority} className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${priorityRing[g.priority]}`}
                >
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
        <Field label="Business impact">
          <Badge variant={impactVariant[f.businessImpact]}>{f.businessImpact}</Badge>
        </Field>
        <Field label="SEO impact">
          <Badge variant={impactVariant[f.seoImpact]}>{f.seoImpact}</Badge>
        </Field>
        <Field label="Difficulty">
          <Badge variant={difficultyVariant[f.difficulty]}>{f.difficulty}</Badge>
        </Field>
        <Field label="Est. hours">
          <span className="inline-flex items-center gap-1 font-medium text-slate-700">
            <Clock className="h-4 w-4 text-slate-400" />
            {f.hours}h
          </span>
        </Field>
        <Field label="Revenue / mo">
          <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
            <DollarSign className="h-4 w-4" />
            {f.revenuePerMonth.toLocaleString()}
          </span>
        </Field>
        <Field label="Owner">
          <span className="inline-flex items-center gap-1 font-medium text-slate-700">
            <User className="h-4 w-4 text-slate-400" />
            {f.owner}
          </span>
        </Field>
        <Field label="Dependencies">
          {f.dependencies.length === 0 ? (
            <span className="text-slate-400">None</span>
          ) : (
            <span className="inline-flex items-center gap-1 text-slate-700">
              <GitBranch className="h-4 w-4 text-slate-400" />
              {f.dependencies.join(", ")}
            </span>
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
