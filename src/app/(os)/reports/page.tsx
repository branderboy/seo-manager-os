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
  FileText,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatTile, StatRow } from "@/components/ui/metric";
import { ReportShare } from "@/components/reports/report-share";
import { reportPeriod, reportSummary, completedWork, trafficChanges, aiWorkCompleted } from "@/lib/reports";
import { blockers, approvals, opportunities } from "@/lib/command";
import { deployments } from "@/lib/deployments";

export const metadata: Metadata = { title: "Reports" };

const deployBadge = { Verified: "good", Verifying: "accent", Failed: "bad", Queued: "default" } as const;

export default function ReportsPage() {
  return (
    <>
      <PageHeader stage={9} title="Reports" description="Manager reporting · completed work, ROI, productivity and the risks worth flagging to the client.">
        <Badge variant="outline">{reportPeriod}</Badge>
      </PageHeader>

      {/* Executive summary · the read-first narrative */}
      <Card className="relative overflow-hidden p-6">
        <span className="absolute inset-y-0 left-0 w-1 bg-accent-500" />
        <div className="flex items-center gap-2 text-2xs font-semibold uppercase tracking-[0.06em] text-accent-600">
          <FileText className="h-3.5 w-3.5" /> Executive summary
        </div>
        <p className="mt-2 max-w-4xl text-base leading-relaxed text-[var(--ink-soft)]">
          {reportSummary.executiveSummary}
        </p>
      </Card>

      {/* KPIs */}
      <StatRow cols={4}>
        {reportSummary.stats.map((s, i) => (
          <StatTile
            key={s.label}
            label={s.label}
            value={s.value}
            sub={s.sub}
            tone={(["accent", "good", "warn", "default"] as const)[i % 4]}
          />
        ))}
      </StatRow>

      {/* Completed + Blocked */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel icon={CheckCircle2} title="Completed work" tone="good" count={`${completedWork.length} items`}>
          <ul className="divide-y divide-[var(--border)]">
            {completedWork.map((w) => (
              <li key={w.title} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-[var(--foreground)]">{w.title}</div>
                  <div className="text-xs text-[var(--muted)]">{w.client}</div>
                </div>
                <span className="shrink-0 text-xs text-[var(--faint)]">{w.when}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel icon={Ban} title="Blocked work" tone="bad" count={`${blockers.length} blocked`}>
          <ul className="divide-y divide-[var(--border)]">
            {blockers.map((b) => (
              <li key={b.task} className="px-4 py-2.5">
                <div className="text-sm font-medium text-[var(--foreground)]">{b.task}</div>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-[var(--muted)]">
                  <span>{b.client}</span>
                  <Badge variant="warn">Waiting on {b.waitingOn}</Badge>
                  <span className="tnum">· {b.age}</span>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* Approvals + Deployment history */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel icon={Clock} title="Pending approvals" tone="warn">
          <ul className="divide-y divide-[var(--border)]">
            {approvals.map((a) => (
              <li key={a.item} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-[var(--foreground)]">{a.item}</div>
                  <div className="text-xs text-[var(--muted)]">{a.client}</div>
                </div>
                <span className="shrink-0 text-xs text-[var(--faint)]">{a.since}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel icon={Rocket} title="Deployment history" tone="accent">
          <ul className="divide-y divide-[var(--border)]">
            {deployments.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-[var(--foreground)]">{d.item}</div>
                  <div className="text-xs text-[var(--muted)]">{d.client}</div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant={deployBadge[d.status]}>{d.status}</Badge>
                  <span className="text-xs text-[var(--faint)]">{d.when}</span>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* AI productivity + Traffic */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel icon={Bot} title="AI Workforce productivity" tone="accent">
          <ul className="divide-y divide-[var(--border)]">
            {aiWorkCompleted.map((a) => (
              <li key={`${a.agent}-${a.client}`} className="px-4 py-2.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-[var(--foreground)]">{a.agent}</span>
                  <span className="shrink-0 text-xs text-[var(--faint)]">{a.when}</span>
                </div>
                <div className="text-xs text-[var(--muted)]">{a.client} · {a.result}</div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel icon={TrendingUp} title="Traffic trends" tone="good">
          <ul className="divide-y divide-[var(--border)]">
            {trafficChanges.map((t) => {
              const up = t.dir === "up";
              return (
                <li key={t.client} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <span className="text-sm font-medium text-[var(--foreground)]">{t.client}</span>
                  <span className={`inline-flex items-center gap-1 text-sm font-semibold tnum ${up ? "text-[var(--ok)]" : "text-[var(--danger)]"}`}>
                    {up ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {up ? "+" : ""}{t.delta}% WoW
                  </span>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>

      {/* Revenue opportunities */}
      <Panel icon={Sparkles} title="Revenue opportunities" tone="accent">
        <ul className="divide-y divide-[var(--border)]">
          {opportunities.map((o) => (
            <li key={o.title} className="flex items-center justify-between gap-3 px-4 py-2.5">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-[var(--foreground)]">{o.title}</div>
                <div className="text-xs text-[var(--muted)]">{o.client}</div>
              </div>
              <span className="shrink-0 rounded-md border border-accent-200 bg-[var(--accent-tint)] px-2 py-0.5 text-sm font-semibold tnum text-accent-700">
                {o.score}
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      <ReportShare />
    </>
  );
}

function Panel({
  icon: Icon,
  title,
  count,
  tone = "default",
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  count?: React.ReactNode;
  tone?: "default" | "accent" | "good" | "warn" | "bad";
  children: React.ReactNode;
}) {
  const iconTone = {
    default: "text-[var(--muted)]",
    accent: "text-accent-600",
    good: "text-[var(--ok)]",
    warn: "text-[var(--warn)]",
    bad: "text-[var(--danger)]",
  }[tone];
  return (
    <Card>
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${iconTone}`} />
          <h3 className="text-sm font-semibold text-[var(--foreground)]">{title}</h3>
        </div>
        {count != null && <span className="text-2xs font-medium text-[var(--muted)]">{count}</span>}
      </div>
      {children}
    </Card>
  );
}
