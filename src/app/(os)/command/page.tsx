import type { Metadata } from "next";
import Link from "next/link";
import { ListTodo, Ban, Clock, Bot, AlertTriangle, CheckCircle2, Rocket, TrendingUp, ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/dashboard/section";
import { currentUser } from "@/lib/model";
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
  default: "text-ink",
  accent: "text-signal-ink",
  warn: "text-warn",
  bad: "text-danger",
};
const sevDot: Record<Severity, string> = { high: "bg-danger", medium: "bg-warn", low: "bg-ink-3" };

export default function CommandCenterPage() {
  return (
    <>
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="reveal flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="eyebrow text-signal-ink">{morningBrief.date}</div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">{morningBrief.greeting}</h1>
        </div>
        <Link
          href="/wins"
          className="inline-flex items-center gap-1 text-sm font-medium text-ink-2 transition-colors hover:text-ink"
        >
          View all wins <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {/* ── Level 1 — the briefing (the one thing to read first) ──────────── */}
      <Card className="overflow-hidden">
        <div className="grid gap-px bg-line lg:grid-cols-[1.6fr_1fr]">
          <div className="bg-surface p-6">
            <div className="eyebrow">Today’s briefing</div>
            <p className="mt-3 max-w-[42ch] text-xl font-medium leading-snug tracking-tight text-ink">
              {morningBriefing.headline}
            </p>
            <ol className="mt-6 space-y-3">
              {morningBriefing.focus.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-base text-ink-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-surface-2 text-2xs font-semibold text-ink-3 nums">
                    {i + 1}
                  </span>
                  <span className="text-ink">{f}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="bg-surface p-6">
            <div className="eyebrow">Overnight</div>
            <ul className="mt-3 space-y-2.5">
              {morningBriefing.overnight.map((o) => (
                <li key={o} className="flex items-start gap-2.5 text-sm text-ink-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ok" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* ── Level 2 — KPIs (one glanceable bar) ───────────────────────────── */}
      <Card className="grid grid-cols-2 divide-x divide-y divide-line sm:grid-cols-4 sm:divide-y-0">
        {opsStats.map((s) => (
          <div key={s.key} className="p-5">
            <div className="text-sm text-ink-2">{s.label}</div>
            <div className={`mt-1.5 text-2xl font-semibold tracking-tight nums ${statTone[s.tone]}`}>{s.value}</div>
            <div className="mt-0.5 text-xs text-ink-3">{s.sub}</div>
          </div>
        ))}
      </Card>

      {/* ── Level 3 — act now ─────────────────────────────────────────────── */}
      <Section label="Act now">
        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ListTodo className="h-4 w-4 text-ink-3" /> Priority tasks today</CardTitle>
              <Badge variant="default" className="nums">{priorityTasks.length}</Badge>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="divide-y divide-line">
                {priorityTasks.map((t) => (
                  <li key={t.name} className="group flex items-center justify-between gap-4 py-2.5 transition-colors">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-ink">{t.name}</div>
                      <div className="mt-0.5 text-xs text-ink-3">{t.client} · {t.owner}</div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <Badge variant={sevBadge[t.priority]}>{t.priority}</Badge>
                      <span className="w-14 text-right text-xs font-medium text-ink-2 nums">{t.due}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-danger" /> Needs attention</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="divide-y divide-line">
                {clientsNeedingAttention.map((c) => (
                  <li key={c.client} className="flex items-start gap-2.5 py-2.5">
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${sevDot[c.severity]}`} />
                    <div>
                      <div className="text-sm font-medium text-ink">{c.client}</div>
                      <div className="text-xs text-ink-3">{c.reason}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* ── Level 4 — monitor ─────────────────────────────────────────────── */}
      <Section label="Monitor">
        <div className="grid gap-4 lg:grid-cols-3">
          <Panel icon={Ban} title="Blockers" count={blockers.length}>
            <ul className="space-y-2.5">
              {blockers.map((b) => (
                <li key={b.task} className="text-sm">
                  <div className="font-medium text-ink">{b.task}</div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-ink-3">
                    <span>{b.client}</span><Badge variant="warn">Waiting · {b.waitingOn}</Badge><span>{b.age}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel icon={Clock} title="Pending approvals" count={approvals.length}>
            <ul className="divide-y divide-line">
              {approvals.map((a) => (
                <li key={a.item} className="flex items-center justify-between gap-3 py-2 text-sm first:pt-0 last:pb-0">
                  <div className="min-w-0"><div className="truncate font-medium text-ink">{a.item}</div><div className="text-xs text-ink-3">{a.client}</div></div>
                  <span className="shrink-0 text-xs text-ink-3 nums">{a.since}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel icon={Bot} title="AI jobs running" count={aiJobs.length}>
            <ul className="divide-y divide-line">
              {aiJobs.map((j) => (
                <li key={`${j.agent}-${j.client}`} className="flex items-center justify-between gap-3 py-2 text-sm first:pt-0 last:pb-0">
                  <div className="min-w-0"><div className="truncate font-medium text-ink">{j.agent}</div><div className="text-xs text-ink-3">{j.client}</div></div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-ink-3 nums">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />{j.eta}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </Section>

      {/* ── Level 5 — momentum ────────────────────────────────────────────── */}
      <Section label="Pipeline & momentum">
        <div className="grid gap-4 lg:grid-cols-3">
          <Panel icon={Rocket} title="Deployments">
            <ul className="divide-y divide-line">
              {deployments.map((d) => (
                <li key={d.item} className="flex items-center justify-between gap-3 py-2 text-sm first:pt-0 last:pb-0">
                  <span className="min-w-0 truncate font-medium text-ink">{d.item}</span>
                  <span className="shrink-0 text-xs text-ink-3 nums">{d.when}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel icon={TrendingUp} title="Opportunities">
            <ul className="divide-y divide-line">
              {opportunities.map((o) => (
                <li key={o.title} className="flex items-center justify-between gap-3 py-2 text-sm first:pt-0 last:pb-0">
                  <span className="min-w-0 truncate font-medium text-ink">{o.title}</span>
                  <span className="shrink-0 rounded-md bg-signal-weak px-1.5 py-0.5 text-2xs font-semibold text-signal-ink nums">{o.score}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel icon={CheckCircle2} title="Wins since yesterday">
            <ul className="space-y-2">
              {wins.slice(0, 5).map((w) => (
                <li key={w.text} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ok" />
                  <span className="text-ink-2">{w.text}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </Section>

      <p className="pt-2 text-center text-xs text-ink-3">
        {currentUser.agency} · {opsStats.length} live signals tracked
      </p>
    </>
  );
}

function Panel({
  icon: Icon,
  title,
  count,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface shadow-sm">
      <div className="flex items-center justify-between gap-2 px-4 pb-2.5 pt-3.5">
        <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-ink">
          <Icon className="h-4 w-4 text-ink-3" /> {title}
        </div>
        {typeof count === "number" && (
          <span className="text-xs text-ink-3 nums">{count}</span>
        )}
      </div>
      <div className="px-4 pb-4">{children}</div>
    </div>
  );
}
