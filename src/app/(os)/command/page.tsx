import type { Metadata } from "next";
import Link from "next/link";
import { ListTodo, Ban, Clock, Bot, AlertTriangle, CheckCircle2, Rocket, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/dashboard/section";
import { morningBriefing } from "@/lib/wins";
import {
  morningBrief,
  opsStats,
  priorityTasks,
  clientsNeedingAttention,
  blockers,
  approvals,
  deployments,
  opportunities,
  wins,
  aiJobs,
  type OpsStat,
  type Severity,
} from "@/lib/command";

export const metadata: Metadata = { title: "Command Center" };

const sevBadge: Record<Severity, "bad" | "warn" | "default"> = { high: "bad", medium: "warn", low: "default" };
const statTone: Record<OpsStat["tone"], string> = {
  default: "text-slate-900",
  accent: "text-accent-600",
  warn: "text-amber-600",
  bad: "text-rose-600",
};
const sevDot: Record<Severity, string> = { high: "bg-rose-500", medium: "bg-amber-500", low: "bg-slate-300" };

export default function CommandCenterPage() {
  return (
    <>
      <PageHeader title="Command Center" description="What needs your attention today.">
        <Badge variant="accent">{morningBrief.date}</Badge>
      </PageHeader>

      {/* ── Level 1 — the briefing (the one thing to read first) ───────────── */}
      <Card className="border-l-4 border-accent-500 p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">{morningBrief.greeting}</h2>
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Morning briefing</span>
        </div>
        <p className="mt-2 text-lg font-medium leading-relaxed text-slate-800">{morningBriefing.headline}</p>
        <div className="mt-5 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Focus today</div>
            <ul className="space-y-2.5">
              {morningBriefing.focus.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-slate-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-500 text-[11px] font-bold text-white">
                    {i + 1}
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Overnight</div>
            <ul className="space-y-2">
              {morningBriefing.overnight.map((o) => (
                <li key={o} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  {o}
                </li>
              ))}
            </ul>
            <Link href="/wins" className="mt-3 inline-block text-sm font-medium text-accent-600 hover:text-accent-700">
              See all wins →
            </Link>
          </div>
        </div>
      </Card>

      {/* ── Level 2 — KPIs (one glanceable bar, not four boxes) ─────────────── */}
      <Card className="grid grid-cols-2 divide-y divide-[var(--border)] sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        {opsStats.map((s) => (
          <div key={s.key} className="p-5">
            <div className="text-sm font-medium text-slate-700">{s.label}</div>
            <div className={`mt-1 text-2xl font-semibold tracking-tight ${statTone[s.tone]}`}>{s.value}</div>
            <div className="mt-1 text-xs text-slate-600">{s.sub}</div>
          </div>
        ))}
      </Card>

      {/* ── Level 3 — act now (the working focus) ───────────────────────────── */}
      <Section label="Act now">
        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ListTodo className="h-4 w-4 text-accent-600" /> Priority tasks today</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-[var(--border)]">
                {priorityTasks.map((t) => (
                  <li key={t.name} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <div className="truncate font-medium text-slate-800">{t.name}</div>
                      <div className="mt-0.5 text-sm text-slate-600">{t.client} · {t.owner}</div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <Badge variant={sevBadge[t.priority]}>{t.priority}</Badge>
                      <span className="text-sm font-medium text-slate-700">{t.due}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-rose-500" /> Clients needing attention</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {clientsNeedingAttention.map((c) => (
                  <li key={c.client} className="flex items-start gap-2.5">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${sevDot[c.severity]}`} />
                    <div>
                      <div className="font-medium text-slate-800">{c.client}</div>
                      <div className="text-sm text-slate-600">{c.reason}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* ── Level 4 — monitor (lighter, secondary) ──────────────────────────── */}
      <Section label="Monitor">
        <div className="grid gap-4 lg:grid-cols-3">
          <Panel icon={Ban} title="Blockers">
            <ul className="space-y-3">
              {blockers.map((b) => (
                <li key={b.task} className="text-sm">
                  <div className="font-medium text-slate-700">{b.task}</div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-slate-600">
                    <span>{b.client}</span><Badge variant="warn">Waiting on {b.waitingOn}</Badge><span>· {b.age}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel icon={Clock} title="Pending approvals">
            <ul className="space-y-2.5">
              {approvals.map((a) => (
                <li key={a.item} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0"><div className="truncate font-medium text-slate-700">{a.item}</div><div className="text-slate-600">{a.client}</div></div>
                  <span className="shrink-0 text-slate-500">{a.since}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel icon={Bot} title="AI jobs running">
            <ul className="space-y-2.5">
              {aiJobs.map((j) => (
                <li key={`${j.agent}-${j.client}`} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0"><div className="truncate font-medium text-slate-700">{j.agent}</div><div className="text-slate-600">{j.client}</div></div>
                  <span className="shrink-0 text-slate-500">{j.eta}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </Section>

      {/* ── Level 5 — momentum (tertiary) ───────────────────────────────────── */}
      <Section label="Pipeline & momentum">
        <div className="grid gap-4 lg:grid-cols-3">
          <Panel icon={Rocket} title="Deployments">
            <ul className="space-y-2.5">
              {deployments.map((d) => (
                <li key={d.item} className="flex items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate font-medium text-slate-700">{d.item}</span>
                  <span className="shrink-0 text-slate-500">{d.when}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel icon={TrendingUp} title="Opportunities">
            <ul className="space-y-2.5">
              {opportunities.map((o) => (
                <li key={o.title} className="flex items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate font-medium text-slate-700">{o.title}</span>
                  <span className="shrink-0 rounded bg-accent-50 px-1.5 py-0.5 text-xs font-semibold text-accent-700">{o.score}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel icon={CheckCircle2} title="Wins since yesterday">
            <ul className="space-y-2.5">
              {wins.slice(0, 5).map((w) => (
                <li key={w.text} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span className="text-slate-700">{w.text}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </Section>
    </>
  );
}

function Panel({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
        <Icon className="h-4 w-4 text-slate-500" /> {title}
      </div>
      {children}
    </div>
  );
}
