"use client";

import { AlertTriangle, Clock, DollarSign, User, GitBranch, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatTile, StatRow } from "@/components/ui/metric";
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

// Priority bands read top-down: P1 is loud, P3 is quiet.
const priorityMeta: Record<number, { dot: string; label: string; ring: string }> = {
  1: { dot: "bg-[var(--danger)]", label: "Do now", ring: "ring-[var(--danger)]/15" },
  2: { dot: "bg-[var(--warn)]", label: "Do next", ring: "ring-[var(--warn)]/15" },
  3: { dot: "bg-[var(--faint)]", label: "Backlog", ring: "ring-[var(--border)]" },
};

export function DiagnosisView() {
  const { engagement } = useEngagement();
  const { primary, groups, summary } = getDiagnosis(engagement.model);
  const s = engagement.scores;

  return (
    <div className="space-y-6">
      {/* Active client */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">{engagement.business}</h2>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
            <Badge variant="accent">{engagement.model} SEO</Badge>
            <span>{engagement.industry}</span>
            <span className="h-1 w-1 rounded-full bg-[var(--border-strong)]" />
            <span>{engagement.market}</span>
          </div>
        </div>
      </div>

      {/* Primary root cause + baseline */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="relative overflow-hidden p-6 lg:col-span-2">
          <span className="absolute inset-y-0 left-0 w-1 bg-[var(--danger)]" />
          <div className="flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-[0.06em] text-[var(--danger)]">
            <AlertTriangle className="h-3.5 w-3.5" /> Primary root cause
          </div>
          <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-[var(--foreground)]">{primary.title}</h3>
          <p className="mt-2 text-base leading-relaxed text-[var(--ink-soft)]">{primary.summary}</p>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-3)]">
            <div className="h-full rounded-full bg-[var(--danger)]" style={{ width: `${primary.confidence}%` }} />
          </div>
          <div className="mt-1.5 flex justify-between text-xs text-[var(--muted)]">
            <span className="tnum">{primary.confidence}% confidence</span>
            <span>{primary.impact} impact</span>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="eyebrow">Baseline scores</h4>
          <div className="mt-3 space-y-3">
            <Baseline label="Visibility" value={s.visibility} />
            <Baseline label="Trust" value={s.trust} />
            <Baseline label="AI visibility" value={s.ai} />
          </div>
        </Card>
      </div>

      {/* Triage summary */}
      <StatRow cols={4}>
        <StatTile label="Prioritized fixes" value={summary.totalFixes} />
        <StatTile label="To do now (P1)" value={summary.p1} tone="bad" />
        <StatTile label="Total effort" value={`${summary.totalHours}h`} sub="across all fixes" />
        <StatTile label="Revenue upside" value={`$${summary.totalRevenue.toLocaleString()}`} sub="/ month" tone="good" />
      </StatRow>

      {/* What to fix first */}
      <section className="space-y-5">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">What to fix first</h3>
          <p className="mt-0.5 text-sm text-[var(--muted)]">
            Ranked by business impact, revenue and effort · work the top band before the next.
          </p>
        </div>

        {groups.map(
          (g) =>
            g.fixes.length > 0 && (
              <div key={g.priority} className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold tnum text-white ${priorityMeta[g.priority].dot}`}>
                    {g.priority}
                  </span>
                  <h4 className="text-sm font-semibold text-[var(--foreground)]">
                    Priority {g.priority}
                    <span className="ml-1.5 font-normal text-[var(--muted)]">· {g.label}</span>
                  </h4>
                  <Badge variant={g.priority === 1 ? "bad" : g.priority === 2 ? "warn" : "default"}>
                    {priorityMeta[g.priority].label}
                  </Badge>
                  <span className="text-xs text-[var(--faint)]">{g.fixes.length} fixes</span>
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
        <span className="text-[var(--ink-soft)]">{label}</span>
        <span className="font-semibold tnum text-[var(--foreground)]">{value}</span>
      </div>
      <Progress value={value} />
    </div>
  );
}

function FixCard({ fix: f }: { fix: Fix }) {
  return (
    <Card interactive className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h5 className="text-base font-semibold tracking-tight text-[var(--foreground)]">{f.title}</h5>
            <Badge variant={statusVariant[f.status]}>{f.status}</Badge>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{f.why}</p>
        </div>
        <div className="flex shrink-0 flex-col items-center justify-center rounded-lg border border-accent-200 bg-[var(--accent-tint)] px-3 py-1.5">
          <span className="tnum text-lg font-bold text-accent-700">{f.score}</span>
          <span className="text-2xs font-semibold uppercase tracking-wide text-accent-600">priority</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-[var(--border)] pt-4 sm:grid-cols-3 lg:grid-cols-6">
        <Field label="Business impact"><Badge variant={impactVariant[f.businessImpact]}>{f.businessImpact}</Badge></Field>
        <Field label="SEO impact"><Badge variant={impactVariant[f.seoImpact]}>{f.seoImpact}</Badge></Field>
        <Field label="Difficulty"><Badge variant={difficultyVariant[f.difficulty]}>{f.difficulty}</Badge></Field>
        <Field label="Est. hours">
          <span className="inline-flex items-center gap-1 font-medium tnum text-[var(--ink-soft)]"><Clock className="h-3.5 w-3.5 text-[var(--faint)]" />{f.hours}h</span>
        </Field>
        <Field label="Revenue / mo">
          <span className="inline-flex items-center gap-1 font-semibold tnum text-[var(--ok)]"><DollarSign className="h-3.5 w-3.5" />{f.revenuePerMonth.toLocaleString()}</span>
        </Field>
        <Field label="Owner">
          <span className="inline-flex items-center gap-1 font-medium text-[var(--ink-soft)]"><User className="h-3.5 w-3.5 text-[var(--faint)]" />{f.owner}</span>
        </Field>
        <Field label="Dependencies" className="col-span-2 sm:col-span-3 lg:col-span-6">
          {f.dependencies.length === 0 ? (
            <span className="text-[var(--faint)]">None · ready to start</span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[var(--ink-soft)]">
              <GitBranch className="h-3.5 w-3.5 text-[var(--faint)]" />
              {f.dependencies.map((d) => (
                <span key={d} className="rounded border border-[var(--border)] bg-[var(--surface-2)] px-1.5 py-0.5 text-2xs">{d}</span>
              ))}
            </span>
          )}
        </Field>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-3">
        <span className="text-xs text-[var(--muted)]">
          Recommended playbook: <span className="font-medium text-[var(--ink-soft)]">{f.owner} workflow</span>
        </span>
        <Link href="/tools" className="inline-flex items-center gap-1 text-xs font-medium text-accent-600 hover:text-accent-700">
          Open playbook <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </Card>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <div className="mb-1 text-2xs font-semibold uppercase tracking-[0.05em] text-[var(--faint)]">{label}</div>
      <div className="text-sm">{children}</div>
    </div>
  );
}
