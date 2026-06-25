import type { Metadata } from "next";
import Link from "next/link";
import {
  ListTodo,
  Ban,
  Clock,
  Bot,
  AlertTriangle,
  CheckCircle2,
  Rocket,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

const sevBadge: Record<Severity, "bad" | "warn" | "default"> = {
  high: "bad",
  medium: "warn",
  low: "default",
};

const statTone: Record<OpsStat["tone"], string> = {
  default: "text-slate-900",
  accent: "text-accent-600",
  warn: "text-amber-600",
  bad: "text-rose-600",
};

export default function CommandCenterPage() {
  return (
    <>
      <PageHeader title="Command Center" description="What needs your attention today.">
        <Badge variant="accent">{morningBrief.date}</Badge>
      </PageHeader>

      {/* Morning briefing */}
      <Card className="p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">{morningBrief.greeting}</h2>
          <span className="text-sm font-medium text-slate-500">Your morning briefing</span>
        </div>
        <p className="mt-2 text-[15px] font-medium leading-relaxed text-slate-700">{morningBriefing.headline}</p>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Focus today</div>
            <ul className="space-y-2.5">
              {morningBriefing.focus.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-slate-600">
                  <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-50 text-[11px] font-bold text-accent-700">
                    {i + 1}
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Overnight</div>
            <ul className="space-y-2">
              {morningBriefing.overnight.map((o) => (
                <li key={o} className="flex items-start gap-2 text-sm text-slate-600">
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

      {/* Ops stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {opsStats.map((s) => (
          <Card key={s.key} className="p-5">
            <div className="text-sm font-medium text-slate-600">{s.label}</div>
            <div className={`mt-1 text-3xl font-semibold tracking-tight ${statTone[s.tone]}`}>{s.value}</div>
            <div className="mt-1.5 text-sm text-slate-500">{s.sub}</div>
          </Card>
        ))}
      </div>

      {/* Priority work + clients/jobs */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="h-4 w-4 text-accent-600" /> Priority tasks today
            </CardTitle>
            <CardDescription>Your highest-priority work across all clients.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-[var(--border)]">
              {priorityTasks.map((t) => (
                <li key={t.name} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <div className="truncate font-medium text-slate-800">{t.name}</div>
                    <div className="mt-0.5 text-sm text-slate-500">
                      {t.client} · {t.owner}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <Badge variant={sevBadge[t.priority]}>{t.priority}</Badge>
                    <span className="text-sm font-medium text-slate-600">{t.due}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-500" /> Clients needing attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {clientsNeedingAttention.map((c) => (
                  <li key={c.client} className="flex items-start gap-2.5">
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        c.severity === "high" ? "bg-rose-500" : c.severity === "medium" ? "bg-amber-500" : "bg-slate-300"
                      }`}
                    />
                    <div>
                      <div className="font-medium text-slate-800">{c.client}</div>
                      <div className="text-sm text-slate-500">{c.reason}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-accent-600" /> AI jobs running
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {aiJobs.map((j) => (
                  <li key={`${j.agent}-${j.client}`} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-medium text-slate-800">{j.agent}</div>
                      <div className="text-sm text-slate-500">{j.client}</div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge variant={j.status === "Finishing" ? "good" : j.status === "Queued" ? "default" : "accent"}>
                        {j.status}
                      </Badge>
                      <span className="text-sm text-slate-500">{j.eta}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Blockers · Approvals · Deployments */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ban className="h-4 w-4 text-rose-500" /> Blockers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {blockers.map((b) => (
                <li key={b.task}>
                  <div className="font-medium text-slate-800">{b.task}</div>
                  <div className="mt-0.5 flex items-center gap-2 text-sm text-slate-500">
                    <span>{b.client}</span>
                    <Badge variant="warn">Waiting on {b.waitingOn}</Badge>
                    <span>· {b.age}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" /> Pending approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {approvals.map((a) => (
                <li key={a.item} className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium text-slate-800">{a.item}</div>
                    <div className="text-sm text-slate-500">{a.client}</div>
                  </div>
                  <span className="shrink-0 text-sm text-slate-500">{a.since}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-4 w-4 text-accent-600" /> Deployments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {deployments.map((d) => (
                <li key={d.item} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate font-medium text-slate-800">{d.item}</div>
                    <div className="text-sm text-slate-500">{d.client}</div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant={d.status === "Live" ? "good" : d.status === "Queued" ? "default" : "accent"}>
                      {d.status}
                    </Badge>
                    <span className="text-sm text-slate-500">{d.when}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Opportunities + Wins */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent-600" /> New opportunities
            </CardTitle>
            <CardDescription>Highest-priority upside, scored.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-[var(--border)]">
              {opportunities.map((o) => (
                <li key={o.title} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <div className="truncate font-medium text-slate-800">{o.title}</div>
                    <div className="text-sm text-slate-500">{o.client}</div>
                  </div>
                  <span className="shrink-0 rounded-md bg-accent-50 px-2 py-1 text-sm font-semibold text-accent-700">
                    {o.score}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Wins since yesterday
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {wins.map((w) => (
                <li key={w.text} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <div>
                    <span className="font-medium text-slate-800">{w.text}</span>
                    <span className="text-sm text-slate-500"> · {w.client} · {w.when}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pt-2">
        <Link
          href="/workflow"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-600 hover:text-accent-700"
        >
          Open the workflow <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </>
  );
}
