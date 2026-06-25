import type { Metadata } from "next";
import {
  CheckCircle2,
  Ban,
  Clock,
  Rocket,
  Bot,
  TrendingUp,
  TrendingDown,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReportShare } from "@/components/reports/report-share";
import { reportPeriod, reportSummary, completedWork, trafficChanges, aiWorkCompleted } from "@/lib/reports";
import { blockers, approvals, opportunities } from "@/lib/command";
import { deployments } from "@/lib/deployments";

export const metadata: Metadata = { title: "Reports" };

const deployBadge = { Verified: "good", Verifying: "accent", Failed: "bad", Queued: "default" } as const;

export default function ReportsPage() {
  return (
    <>
      <PageHeader stage={9} title="Reports" description="Manager reporting — what got done, what's blocked, and the ROI.">
        <Badge variant="accent">{reportPeriod}</Badge>
      </PageHeader>

      {/* Executive summary */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">Executive summary</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-slate-700">{reportSummary.executiveSummary}</p>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {reportSummary.stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="text-sm font-medium text-slate-700">{s.label}</div>
            <div className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">{s.value}</div>
            <div className="mt-1.5 text-sm text-slate-600">{s.sub}</div>
          </Card>
        ))}
      </div>

      {/* Completed + Blocked */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Completed work</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-[var(--border)]">
              {completedWork.map((w) => (
                <li key={w.title} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <div className="truncate font-medium text-slate-800">{w.title}</div>
                    <div className="text-sm text-slate-600">{w.client}</div>
                  </div>
                  <span className="shrink-0 text-sm text-slate-600">{w.when}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Ban className="h-4 w-4 text-rose-500" /> Blocked work</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-[var(--border)]">
              {blockers.map((b) => (
                <li key={b.task} className="py-2.5">
                  <div className="font-medium text-slate-800">{b.task}</div>
                  <div className="mt-0.5 flex items-center gap-2 text-sm text-slate-600">
                    <span>{b.client}</span>
                    <Badge variant="warn">Waiting on {b.waitingOn}</Badge>
                    <span>· {b.age}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Approvals + Deployment history */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Clock className="h-4 w-4 text-amber-500" /> Pending approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-[var(--border)]">
              {approvals.map((a) => (
                <li key={a.item} className="flex items-center justify-between gap-3 py-2.5">
                  <div><div className="font-medium text-slate-800">{a.item}</div><div className="text-sm text-slate-600">{a.client}</div></div>
                  <span className="shrink-0 text-sm text-slate-600">{a.since}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Rocket className="h-4 w-4 text-accent-600" /> Deployment history</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-[var(--border)]">
              {deployments.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0"><div className="truncate font-medium text-slate-800">{d.item}</div><div className="text-sm text-slate-600">{d.client}</div></div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant={deployBadge[d.status]}>{d.status}</Badge>
                    <span className="text-sm text-slate-600">{d.when}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* AI work + Traffic */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bot className="h-4 w-4 text-accent-600" /> AI work completed</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-[var(--border)]">
              {aiWorkCompleted.map((a) => (
                <li key={`${a.agent}-${a.client}`} className="py-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-slate-800">{a.agent}</span>
                    <span className="shrink-0 text-sm text-slate-600">{a.when}</span>
                  </div>
                  <div className="text-sm text-slate-600">{a.client} · {a.result}</div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-emerald-500" /> Traffic changes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-[var(--border)]">
              {trafficChanges.map((t) => {
                const up = t.dir === "up";
                return (
                  <li key={t.client} className="flex items-center justify-between gap-3 py-2.5">
                    <span className="font-medium text-slate-800">{t.client}</span>
                    <span className={`inline-flex items-center gap-1 text-sm font-semibold ${up ? "text-emerald-600" : "text-rose-600"}`}>
                      {up ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      {up ? "+" : ""}{t.delta}% WoW
                    </span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Revenue opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-accent-600" /> Revenue opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-[var(--border)]">
            {opportunities.map((o) => (
              <li key={o.title} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0"><div className="truncate font-medium text-slate-800">{o.title}</div><div className="text-sm text-slate-600">{o.client}</div></div>
                <span className="shrink-0 rounded-md bg-accent-50 px-2 py-1 text-sm font-semibold text-accent-700">{o.score}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <ReportShare />
    </>
  );
}
