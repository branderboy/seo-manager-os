"use client";

import { Target, Package, ClipboardCheck, Users, CalendarRange, GitBranch, Gauge } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEngagement } from "@/components/engagement/store";
import { getDiagnosis, strategyByType } from "@/lib/recommendations";

const HORIZONS: { label: string; priority: 1 | 2 | 3 }[] = [
  { label: "30-Day", priority: 1 },
  { label: "90-Day", priority: 2 },
  { label: "180-Day", priority: 3 },
];

/** The project-management half of the brief — assembled from the active client. */
export function ProjectPlan() {
  const { engagement } = useEngagement();
  const { groups, summary } = getDiagnosis(engagement.model);
  const fixes = groups.flatMap((g) => g.fixes);
  const kpis = strategyByType[engagement.model].expectedOutcomes;

  const owners = Array.from(new Set(fixes.map((f) => f.owner))).map((owner) => ({
    owner,
    count: fixes.filter((f) => f.owner === owner).length,
    hours: fixes.filter((f) => f.owner === owner).reduce((s, f) => s + f.hours, 0),
  }));
  const deps = fixes.filter((f) => f.dependencies.length > 0).map((f) => ({ task: f.title, on: f.dependencies }));

  return (
    <Card>
      <div className="space-y-8 p-7 sm:p-9">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Project plan</h2>
          <span className="text-sm text-slate-600">
            {summary.totalFixes} deliverables · {summary.totalHours}h
          </span>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <Block icon={Target} title="Objectives">
            <Chips items={engagement.goals} />
          </Block>
          <Block icon={ClipboardCheck} title="Requirements">
            <Chips items={engagement.assets} />
          </Block>
        </div>

        {/* Timeline */}
        <Block icon={CalendarRange} title="Timeline">
          <div className="space-y-4">
            {HORIZONS.map((h) => {
              const items = fixes.filter((f) => f.priority === h.priority);
              if (items.length === 0) return null;
              const hours = items.reduce((s, f) => s + f.hours, 0);
              return (
                <div key={h.label}>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-md bg-accent-600 px-2 py-0.5 font-mono text-xs font-semibold text-white">{h.label}</span>
                    <span className="text-xs text-slate-600">{items.length} deliverables · {hours}h</span>
                  </div>
                  <ul className="divide-y divide-[var(--border)] overflow-hidden rounded-xl border border-[var(--border)]">
                    {items.map((f) => (
                      <li key={f.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                        <span className="truncate text-sm text-slate-700">{f.title}</span>
                        <span className="shrink-0 text-xs text-slate-600">{f.owner} · {f.hours}h</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Block>

        <div className="grid gap-8 sm:grid-cols-2">
          {/* Team */}
          <Block icon={Users} title="Assigned team">
            <ul className="space-y-2">
              {owners.map((o) => (
                <li key={o.owner} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{o.owner}</span>
                  <span className="text-slate-600">{o.count} tasks · {o.hours}h</span>
                </li>
              ))}
            </ul>
          </Block>

          {/* Dependencies */}
          <Block icon={GitBranch} title="Dependencies">
            {deps.length === 0 ? (
              <p className="text-sm text-slate-500">No blocking dependencies.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {deps.map((d) => (
                  <li key={d.task} className="text-slate-700">
                    <span className="font-medium text-slate-700">{d.task}</span> needs {d.on.join(", ")}
                  </li>
                ))}
              </ul>
            )}
          </Block>
        </div>

        {/* Deliverables */}
        <Block icon={Package} title="Deliverables">
          <div className="flex flex-wrap gap-1.5">
            {fixes.map((f) => (
              <span key={f.id} className="rounded-md bg-[var(--surface-2)] px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-[var(--border)]">
                {f.title}
              </span>
            ))}
          </div>
        </Block>

        {/* KPIs */}
        <Block icon={Gauge} title="KPIs & success metrics">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map((k) => (
              <div key={k.metric} className="rounded-xl border border-[var(--border)] p-3">
                <div className="text-sm text-slate-700">{k.metric}</div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-slate-500 line-through">{k.from}</span>
                  <span className="text-lg font-semibold text-slate-900">→ {k.to}</span>
                </div>
              </div>
            ))}
          </div>
        </Block>
      </div>
    </Card>
  );
}

function Block({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700"><Icon className="h-4 w-4" /></span>
        <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((i) => (
        <li key={i}><Badge variant="outline">{i}</Badge></li>
      ))}
    </ul>
  );
}
