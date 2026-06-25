import type { Metadata } from "next";
import Link from "next/link";
import {
  ListTodo,
  Ban,
  Clock3,
  Bot,
  AlertTriangle,
  CheckCircle2,
  Rocket,
  TrendingUp,
  ArrowRight,
  Sun,
  CalendarClock,
  Activity as ActivityIcon,
  ShieldAlert,
  Circle,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge, StatusDot } from "@/components/ui/badge";
import { StatTile, StatRow } from "@/components/ui/metric";
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
  wins,
  aiJobs,
  riskAlerts,
  upcomingDeadlines,
  recentActivity,
  type OpsStat,
  type Severity,
  type Activity,
} from "@/lib/command";

export const metadata: Metadata = { title: "Command Center" };

const sevBadge: Record<Severity, "bad" | "warn" | "default"> = {
  high: "bad",
  medium: "warn",
  low: "default",
};
const sevDot: Record<Severity, "bad" | "warn" | "default"> = {
  high: "bad",
  medium: "warn",
  low: "default",
};
const statTone: Record<OpsStat["tone"], "default" | "accent" | "warn" | "bad"> = {
  default: "default",
  accent: "accent",
  warn: "warn",
  bad: "bad",
};

const activityIcon: Record<Activity["kind"], React.ComponentType<{ className?: string }>> = {
  deploy: Rocket,
  approve: CheckCircle2,
  agent: Bot,
  win: TrendingUp,
  comment: Circle,
  alert: AlertTriangle,
};
const activityTint: Record<Activity["kind"], string> = {
  deploy: "text-accent-600 bg-[var(--accent-tint)]",
  approve: "text-[var(--ok)] bg-[var(--ok-tint)]",
  agent: "text-[var(--ink-soft)] bg-[var(--surface-3)]",
  win: "text-[var(--ok)] bg-[var(--ok-tint)]",
  comment: "text-[var(--muted)] bg-[var(--surface-3)]",
  alert: "text-[var(--danger)] bg-[var(--danger-tint)]",
};

export default function CommandCenterPage() {
  const runningJobs = aiJobs.filter((j) => j.status !== "Queued").length;

  return (
    <>
      <PageHeader title="Command Center" description="Everything that needs your attention today, in one place.">
        <span className="hidden items-center gap-1.5 text-sm text-[var(--muted)] sm:flex">
          <Sun className="h-4 w-4 text-[var(--warn)]" />
          {morningBrief.date}
        </span>
      </PageHeader>

      {/* ── HERO — the single read-first zone. Dark mission-control strip. ──── */}
      <section className="reveal overflow-hidden rounded-2xl border border-[var(--feature-border)] bg-[var(--feature)] text-white shadow-lg">
        <div className="grid gap-0 lg:grid-cols-[1.7fr_1fr]">
          <div className="p-6 lg:p-7">
            <div className="flex items-center gap-2 text-2xs font-semibold uppercase tracking-[0.1em] text-white/45">
              <Sun className="h-3.5 w-3.5" />
              Morning brief
            </div>
            <h2 className="mt-2 text-2xl font-semibold leading-snug tracking-tight text-white">
              {morningBrief.greeting.replace("Kawani", "Josh")}.
            </h2>
            <p className="mt-1 text-lg font-medium leading-relaxed text-white/80">
              {morningBriefing.headline}
            </p>

            <div className="mt-5">
              <div className="mb-2.5 text-2xs font-semibold uppercase tracking-[0.08em] text-white/40">
                Focus today
              </div>
              <ul className="space-y-2.5">
                {morningBriefing.focus.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-white/85">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/10 text-2xs font-bold tnum text-white">
                      {i + 1}
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Overnight rail — visually nested inside the dark zone */}
          <div className="border-t border-white/10 bg-white/[0.03] p-6 lg:border-l lg:border-t-0 lg:p-7">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-2xs font-semibold uppercase tracking-[0.08em] text-white/40">
                Overnight
              </span>
              <Link href="/wins" className="text-2xs font-medium text-white/55 hover:text-white">
                All wins →
              </Link>
            </div>
            <ul className="space-y-2.5">
              {morningBriefing.overnight.map((o) => (
                <li key={o} className="flex items-start gap-2.5 text-sm text-white/80">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  {o}
                </li>
              ))}
            </ul>
            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/10 pt-5">
              {opsStats.slice(0, 3).map((s) => (
                <div key={s.key}>
                  <div className="tnum text-xl font-semibold text-white">{s.value}</div>
                  <div className="mt-0.5 text-2xs leading-tight text-white/45">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── KPI band — one object, hairline-divided tiles ──────────────────── */}
      <StatRow cols={4}>
        {opsStats.map((s) => (
          <StatTile
            key={s.key}
            label={s.label}
            value={s.value}
            sub={s.sub}
            tone={statTone[s.tone]}
          />
        ))}
      </StatRow>

      {/* ── ACT NOW — primary worklist + attention rail ────────────────────── */}
      <Section label="Act now" action={{ href: "/tracker", label: "Open tracker" }}>
        <div className="grid gap-5 lg:grid-cols-[1.7fr_1fr]">
          {/* Priority tasks — the main panel, given the most weight */}
          <Card>
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
              <div className="flex items-center gap-2">
                <ListTodo className="h-4 w-4 text-accent-600" />
                <h3 className="text-sm font-semibold text-[var(--foreground)]">Priority tasks today</h3>
              </div>
              <Badge variant="default">{priorityTasks.length} due</Badge>
            </div>
            <ul className="divide-y divide-[var(--border)]">
              {priorityTasks.map((t) => (
                <li
                  key={t.name}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--surface-2)]"
                >
                  <StatusDot tone={sevDot[t.priority]} pulse={t.priority === "high"} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-[var(--foreground)]">{t.name}</div>
                    <div className="mt-0.5 text-xs text-[var(--muted)]">
                      {t.client} · {t.owner}
                    </div>
                  </div>
                  <Badge variant={sevBadge[t.priority]}>{t.priority}</Badge>
                  <span className="w-20 shrink-0 text-right text-xs font-medium tnum text-[var(--ink-soft)]">
                    {t.due}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Right rail — attention + risk, two quieter stacked cards */}
          <div className="space-y-5">
            <Card>
              <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
                <AlertTriangle className="h-4 w-4 text-[var(--danger)]" />
                <h3 className="text-sm font-semibold text-[var(--foreground)]">Clients needing attention</h3>
              </div>
              <ul className="divide-y divide-[var(--border)]">
                {clientsNeedingAttention.map((c) => (
                  <li key={c.client} className="flex items-start gap-2.5 px-4 py-2.5">
                    <StatusDot tone={sevDot[c.severity]} className="mt-1.5" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-[var(--foreground)]">{c.client}</div>
                      <div className="text-xs leading-snug text-[var(--muted)]">{c.reason}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
                <ShieldAlert className="h-4 w-4 text-[var(--warn)]" />
                <h3 className="text-sm font-semibold text-[var(--foreground)]">Risk alerts</h3>
              </div>
              <ul className="divide-y divide-[var(--border)]">
                {riskAlerts.map((r) => (
                  <li key={r.client} className="flex items-center gap-3 px-4 py-2.5">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-[var(--foreground)]">{r.client}</div>
                      <div className="truncate text-xs text-[var(--muted)]">{r.signal}</div>
                    </div>
                    <span
                      className={`shrink-0 rounded-md px-1.5 py-0.5 text-2xs font-bold tnum ${
                        r.severity === "high"
                          ? "bg-[var(--danger-tint)] text-[#b13a31]"
                          : "bg-[var(--warn-tint)] text-[#9a6512]"
                      }`}
                    >
                      {r.metric}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </Section>

      {/* ── OPERATIONS — quieter monitor grid ──────────────────────────────── */}
      <Section label="Operations">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Panel icon={Ban} title="Blockers" tone="bad" count={blockers.length}>
            <ul className="space-y-2.5">
              {blockers.map((b) => (
                <li key={b.task}>
                  <div className="text-sm font-medium text-[var(--ink-soft)]">{b.task}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-[var(--muted)]">
                    <span>{b.client}</span>
                    <Badge variant="warn">Waiting on {b.waitingOn}</Badge>
                    <span className="tnum">· {b.age}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel icon={Clock3} title="Approvals waiting" tone="warn" count={approvals.length}>
            <ul className="space-y-2.5">
              {approvals.map((a) => (
                <li key={a.item} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-[var(--ink-soft)]">{a.item}</div>
                    <div className="text-xs text-[var(--muted)]">{a.client}</div>
                  </div>
                  <span className="shrink-0 text-xs text-[var(--faint)]">{a.since}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel icon={Bot} title="AI Workforce" tone="accent" count={`${runningJobs} active`} href="/agents">
            <ul className="space-y-2.5">
              {aiJobs.map((j) => (
                <li key={`${j.agent}-${j.client}`} className="flex items-center gap-2.5">
                  <StatusDot
                    tone={j.status === "Queued" ? "default" : "good"}
                    pulse={j.status === "Running"}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-[var(--ink-soft)]">{j.agent}</div>
                    <div className="truncate text-xs text-[var(--muted)]">{j.client}</div>
                  </div>
                  <span className="shrink-0 text-xs tnum text-[var(--faint)]">{j.eta}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel icon={Rocket} title="Deployments today" tone="default" count={deployments.length} href="/deployments">
            <ul className="space-y-2.5">
              {deployments.map((d) => (
                <li key={d.item} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-[var(--ink-soft)]">{d.item}</div>
                    <div className="text-xs text-[var(--muted)]">{d.client}</div>
                  </div>
                  <Badge variant={d.status === "Live" ? "good" : d.status === "Queued" ? "default" : "accent"}>
                    {d.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </Section>

      {/* ── PULSE — activity feed + deadlines + wins ───────────────────────── */}
      <Section label="Pulse">
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          {/* Activity feed — the live operational stream */}
          <Card>
            <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
              <ActivityIcon className="h-4 w-4 text-[var(--muted)]" />
              <h3 className="text-sm font-semibold text-[var(--foreground)]">Recent activity</h3>
            </div>
            <ul className="px-4 py-1">
              {recentActivity.map((a, i) => {
                const Icon = activityIcon[a.kind];
                return (
                  <li key={i} className="relative flex gap-3 py-2.5">
                    {i < recentActivity.length - 1 && (
                      <span className="absolute left-[15px] top-9 h-[calc(100%-1rem)] w-px bg-[var(--border)]" />
                    )}
                    <span
                      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${activityTint[a.kind]}`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1 pt-1">
                      <div className="text-sm leading-snug text-[var(--ink-soft)]">
                        <span className="font-semibold text-[var(--foreground)]">{a.actor}</span> {a.action}{" "}
                        <span className="font-medium text-[var(--foreground)]">{a.target}</span>
                      </div>
                      <div className="mt-0.5 text-xs text-[var(--muted)]">
                        {a.client} · {a.when}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>

          <div className="space-y-5">
            {/* Upcoming deadlines */}
            <Card>
              <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
                <CalendarClock className="h-4 w-4 text-[var(--muted)]" />
                <h3 className="text-sm font-semibold text-[var(--foreground)]">Upcoming deadlines</h3>
              </div>
              <ul className="divide-y divide-[var(--border)]">
                {upcomingDeadlines.map((d) => (
                  <li key={d.item} className="flex items-center gap-3 px-4 py-2.5">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-[var(--foreground)]">{d.item}</div>
                      <div className="text-xs text-[var(--muted)]">
                        {d.client} · {d.owner}
                      </div>
                    </div>
                    <span
                      className={`shrink-0 text-xs font-medium ${
                        d.due === "overdue"
                          ? "text-[var(--danger)]"
                          : d.due === "today"
                          ? "text-[var(--warn)]"
                          : "text-[var(--muted)]"
                      }`}
                    >
                      {d.when}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Recent wins */}
            <Card>
              <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
                <CheckCircle2 className="h-4 w-4 text-[var(--ok)]" />
                <h3 className="text-sm font-semibold text-[var(--foreground)]">Recent wins</h3>
              </div>
              <ul className="px-4 py-2">
                {wins.slice(0, 4).map((w) => (
                  <li key={w.text} className="flex items-start gap-2.5 py-1.5 text-sm text-[var(--ink-soft)]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ok)]" />
                    <span>
                      {w.text} <span className="text-[var(--muted)]">· {w.client}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}

function Panel({
  icon: Icon,
  title,
  count,
  tone = "default",
  href,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  count?: React.ReactNode;
  tone?: "default" | "accent" | "warn" | "bad";
  href?: string;
  children: React.ReactNode;
}) {
  const iconTone = {
    default: "text-[var(--muted)]",
    accent: "text-accent-600",
    warn: "text-[var(--warn)]",
    bad: "text-[var(--danger)]",
  }[tone];
  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${iconTone}`} />
          <h3 className="text-sm font-semibold text-[var(--foreground)]">{title}</h3>
        </div>
        {count != null && (
          <span className="text-2xs font-medium text-[var(--muted)]">{count}</span>
        )}
      </div>
      <div className="flex-1 p-4">{children}</div>
      {href && (
        <Link
          href={href}
          className="flex items-center justify-center gap-1 border-t border-[var(--border)] py-2 text-xs font-medium text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-accent-600"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </Card>
  );
}
