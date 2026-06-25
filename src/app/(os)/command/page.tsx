import type { Metadata } from "next";
import Link from "next/link";
import {
  Ban,
  Bot,
  AlertTriangle,
  CheckCircle2,
  Rocket,
  ArrowRight,
  Sun,
  Activity as ActivityIcon,
  ListChecks,
  GitPullRequestArrow,
  Building2,
  TrendingUp,
  Circle,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Tabs } from "@/components/ui/tabs";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge, StatusDot } from "@/components/ui/badge";
import {
  TableShell,
  THead,
  TH,
  TBody,
  TR,
  TD,
} from "@/components/ui/data-table";
import { morningBriefing } from "@/lib/wins";
import {
  morningBrief,
  opsStats,
  priorityTasks,
  clientsNeedingAttention,
  blockers,
  approvals,
  deployments,
  aiJobs,
  riskAlerts,
  recentActivity,
  type Severity,
  type Activity,
} from "@/lib/command";

export const metadata: Metadata = { title: "Command Center" };

const sevBadge: Record<Severity, "bad" | "warn" | "default"> = { high: "bad", medium: "warn", low: "default" };
const sevDot: Record<Severity, "bad" | "warn" | "default"> = { high: "bad", medium: "warn", low: "default" };
const sevLabel: Record<Severity, string> = { high: "High", medium: "Medium", low: "Low" };

const activityIcon: Record<Activity["kind"], React.ComponentType<{ className?: string }>> = {
  deploy: Rocket, approve: CheckCircle2, agent: Bot, win: TrendingUp, comment: Circle, alert: AlertTriangle,
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
  return (
    <>
      <PageHeader title="Command Center" description="Your day, in priority order. Pick a view below — work the list from the top.">
        <span className="hidden items-center gap-1.5 text-base font-medium text-[var(--muted)] sm:flex">
          <Sun className="h-5 w-5 text-[var(--warn)]" />
          {morningBrief.date}
        </span>
      </PageHeader>

      {/* ── Morning brief — the one focal banner (not a card) ──────────────── */}
      <section className="reveal overflow-hidden rounded-2xl border border-[var(--feature-border)] bg-[var(--feature)] text-white shadow-lg">
        <div className="grid gap-0 lg:grid-cols-[1.7fr_1fr]">
          <div className="p-6 lg:p-7">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-white/50">
              <Sun className="h-4 w-4" /> Morning brief
            </div>
            <h2 className="mt-2 text-2xl font-bold leading-snug tracking-tight">
              {morningBrief.greeting.replace("Kawani", "Josh")}.
            </h2>
            <p className="mt-1.5 text-lg font-medium leading-relaxed text-white/85">{morningBriefing.headline}</p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <ButtonLink href="/tracker" size="sm" className="!bg-white !from-white !to-white !text-[var(--feature)] !shadow-[0_4px_0_0_rgba(255,255,255,0.4)]">
                Start the day
              </ButtonLink>
              <Link href="/wins" className="inline-flex h-9 items-center rounded-lg px-3.5 text-xs font-bold uppercase tracking-[0.04em] text-white/85 ring-1 ring-inset ring-white/25 transition-colors hover:bg-white/10">
                Overnight wins
              </Link>
            </div>
          </div>
          <div className="border-t border-white/10 bg-white/[0.04] p-6 lg:border-l lg:border-t-0 lg:p-7">
            <div className="text-xs font-bold uppercase tracking-[0.1em] text-white/45">At a glance</div>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-4">
              {opsStats.map((s) => (
                <div key={s.key}>
                  <div className="tnum text-3xl font-bold leading-none">{s.value}</div>
                  <div className="mt-1 text-sm leading-tight text-white/55">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Sub-navigation — one focused view at a time ────────────────────── */}
      <Tabs
        tabs={[
          { id: "priorities", label: "Priorities", icon: ListChecks, count: priorityTasks.length, content: <PrioritiesView /> },
          { id: "decisions", label: "Decisions", icon: GitPullRequestArrow, count: approvals.length + blockers.length, content: <DecisionsView /> },
          { id: "accounts", label: "Accounts at risk", icon: Building2, count: clientsNeedingAttention.length, content: <AccountsView /> },
          { id: "operations", label: "Operations", icon: ActivityIcon, content: <OperationsView /> },
        ]}
      />
    </>
  );
}

/* ── Priorities — the ranked worklist ──────────────────────────────────── */
function PrioritiesView() {
  return (
    <div className="space-y-3">
      <Toolbar title="Today's priorities" sub="Ranked. Work top to bottom." href="/tracker" action="Open tracker" />
      <TableShell>
        <THead>
          <TH className="w-12">#</TH>
          <TH>Task</TH>
          <TH className="hidden sm:table-cell">Owner</TH>
          <TH>Priority</TH>
          <TH align="right">Due</TH>
          <TH align="right">Action</TH>
        </THead>
        <TBody>
          {priorityTasks.map((t, i) => (
            <TR key={t.name}>
              <TD className="tnum text-lg font-bold text-[var(--faint)]">{String(i + 1).padStart(2, "0")}</TD>
              <TD>
                <div className="flex items-center gap-2.5">
                  <StatusDot tone={sevDot[t.priority]} pulse={t.priority === "high"} />
                  <div className="min-w-0">
                    <div className="truncate text-base font-semibold text-[var(--foreground)]">{t.name}</div>
                    <div className="truncate text-sm text-[var(--muted)]">{t.client}</div>
                  </div>
                </div>
              </TD>
              <TD className="hidden sm:table-cell">{t.owner}</TD>
              <TD><Badge variant={sevBadge[t.priority]}>{sevLabel[t.priority]}</Badge></TD>
              <TD align="right" className="font-semibold tnum text-[var(--ink-soft)]">{t.due}</TD>
              <TD align="right"><Button variant="secondary" size="xs">Open</Button></TD>
            </TR>
          ))}
        </TBody>
      </TableShell>
    </div>
  );
}

/* ── Decisions — approvals + blockers, every row actionable ────────────── */
function DecisionsView() {
  return (
    <div className="space-y-3">
      <Toolbar title="Needs your decision" sub="Work parked until you act." />
      <TableShell>
        <THead>
          <TH>Awaiting approval</TH>
          <TH className="hidden md:table-cell">Client</TH>
          <TH className="hidden sm:table-cell" align="right">Waiting</TH>
          <TH align="right">Action</TH>
        </THead>
        <TBody>
          {approvals.map((a) => (
            <TR key={a.item}>
              <TD>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-[18px] w-[18px] shrink-0 text-[var(--warn)]" />
                  <span className="text-base font-medium text-[var(--foreground)]">{a.item}</span>
                </div>
              </TD>
              <TD className="hidden md:table-cell">{a.client}</TD>
              <TD align="right" className="hidden sm:table-cell text-[var(--muted)]">{a.since}</TD>
              <TD align="right">
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" size="xs">Review</Button>
                  <Button size="xs">Approve</Button>
                </div>
              </TD>
            </TR>
          ))}
          {blockers.map((b) => (
            <TR key={b.task}>
              <TD>
                <div className="flex items-center gap-2.5">
                  <Ban className="h-[18px] w-[18px] shrink-0 text-[var(--danger)]" />
                  <span className="text-base font-medium text-[var(--foreground)]">{b.task}</span>
                </div>
              </TD>
              <TD className="hidden md:table-cell">{b.client}</TD>
              <TD align="right" className="hidden sm:table-cell">
                <Badge variant="warn">Waiting on {b.waitingOn} · {b.age}</Badge>
              </TD>
              <TD align="right"><Button variant="secondary" size="xs">Nudge</Button></TD>
            </TR>
          ))}
        </TBody>
      </TableShell>
    </div>
  );
}

/* ── Accounts at risk — clickable, with the metric ─────────────────────── */
function AccountsView() {
  return (
    <div className="space-y-3">
      <Toolbar title="Accounts at risk" sub="Open one to drop into its workspace." href="/clients" action="All clients" />
      <TableShell>
        <THead>
          <TH>Client</TH>
          <TH>Signal</TH>
          <TH align="right">Severity</TH>
          <TH align="right">Action</TH>
        </THead>
        <TBody>
          {clientsNeedingAttention.map((c) => {
            const alert = riskAlerts.find((r) => r.client === c.client);
            return (
              <TR key={c.client}>
                <TD>
                  <div className="flex items-center gap-2.5">
                    <StatusDot tone={sevDot[c.severity]} pulse={c.severity === "high"} />
                    <span className="text-base font-semibold text-[var(--foreground)]">{c.client}</span>
                  </div>
                </TD>
                <TD className="max-w-md"><span className="text-[var(--ink-soft)]">{c.reason}</span></TD>
                <TD align="right">
                  <div className="inline-flex items-center gap-2">
                    {alert && <span className="tnum text-sm font-bold text-[var(--danger)]">{alert.metric}</span>}
                    <Badge variant={sevBadge[c.severity]}>{sevLabel[c.severity]}</Badge>
                  </div>
                </TD>
                <TD align="right"><ButtonLink href="/clients" variant="secondary" size="xs">Review</ButtonLink></TD>
              </TR>
            );
          })}
        </TBody>
      </TableShell>
    </div>
  );
}

/* ── Operations — monitoring, three quiet lists ────────────────────────── */
function OperationsView() {
  const runningJobs = aiJobs.filter((j) => j.status !== "Queued").length;
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <ListPanel icon={Bot} title="AI Workforce" meta={`${runningJobs} active`} href="/agents" accent>
        {aiJobs.map((j) => (
          <li key={`${j.agent}-${j.client}`} className="flex items-center gap-2.5 py-2.5">
            <StatusDot tone={j.status === "Queued" ? "default" : "good"} pulse={j.status === "Running"} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-[var(--foreground)]">{j.agent}</div>
              <div className="truncate text-xs text-[var(--muted)]">{j.client}</div>
            </div>
            <span className="shrink-0 text-xs tnum text-[var(--faint)]">{j.eta}</span>
          </li>
        ))}
      </ListPanel>

      <ListPanel icon={Rocket} title="Deployments" meta={`${deployments.length} today`} href="/deployments">
        {deployments.map((d) => (
          <li key={d.item} className="flex items-center gap-2.5 py-2.5">
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-[var(--foreground)]">{d.item}</div>
              <div className="truncate text-xs text-[var(--muted)]">{d.client}</div>
            </div>
            <Badge variant={d.status === "Live" ? "good" : d.status === "Queued" ? "default" : "accent"}>{d.status}</Badge>
          </li>
        ))}
      </ListPanel>

      <ListPanel icon={ActivityIcon} title="Recent activity" href="/tracker">
        {recentActivity.slice(0, 5).map((a, i) => {
          const Icon = activityIcon[a.kind];
          return (
            <li key={i} className="flex items-start gap-2.5 py-2.5">
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${activityTint[a.kind]}`}>
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-[var(--ink-soft)]">
                  <span className="font-semibold text-[var(--foreground)]">{a.actor}</span> {a.action} {a.target}
                </div>
                <div className="text-xs text-[var(--muted)]">{a.when}</div>
              </div>
            </li>
          );
        })}
      </ListPanel>
    </div>
  );
}

/* ── shared ──────────────────────────────────────────────────────────── */
function Toolbar({ title, sub, href, action }: { title: string; sub: string; href?: string; action?: string }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">{title}</h2>
        <p className="mt-0.5 text-sm text-[var(--muted)]">{sub}</p>
      </div>
      {href && action && (
        <ButtonLink href={href} variant="secondary" size="sm">
          {action} <ArrowRight className="h-3.5 w-3.5" />
        </ButtonLink>
      )}
    </div>
  );
}

function ListPanel({
  icon: Icon,
  title,
  meta,
  href,
  accent,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  meta?: string;
  href?: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-card">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <h3 className="flex items-center gap-2 text-base font-bold text-[var(--foreground)]">
          <Icon className={`h-5 w-5 ${accent ? "text-accent-600" : "text-[var(--muted)]"}`} /> {title}
        </h3>
        {meta && <span className="text-sm font-medium text-[var(--muted)]">{meta}</span>}
      </div>
      <ul className="flex-1 divide-y divide-[var(--border)] px-4">{children}</ul>
      {href && (
        <Link href={href} className="flex items-center justify-center gap-1 border-t border-[var(--border)] py-2.5 text-sm font-semibold text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-accent-600">
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
