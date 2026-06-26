import type { Metadata } from "next";
import Link from "next/link";
import {
  Users,
  ListChecks,
  Bot,
  Ban,
  Rocket,
  CheckCircle2,
  ArrowUpRight,
  ArrowRight,
  TrendingUp,
  Sparkles,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { Badge, StatusDot } from "@/components/ui/badge";
import { TrafficArea } from "@/components/command/charts";
import { currentUser, clients, investigations } from "@/lib/model";
import { workforceSummary } from "@/lib/workforce";
import {
  morningBrief,
  priorityTasks,
  riskAlerts,
  blockers,
  approvals,
  deployments,
  opportunities,
  wins,
  aiJobs,
  upcomingDeadlines,
  indexingQueue,
} from "@/lib/command";

export const metadata: Metadata = { title: "Command Center" };

// Reconciled portfolio numbers (single source of truth).
const openCampaigns = investigations.filter((i) => i.status === "Open").length;
const aiRunning = workforceSummary.working;

const clientIdByName: Record<string, string> = Object.fromEntries(clients.map((c) => [c.name, c.id]));

function ClientLink({ name, className }: { name: string; className?: string }) {
  const id = clientIdByName[name];
  if (!id) return <span className={className}>{name}</span>;
  return (
    <Link href={`/clients/${id}`} className={`transition-colors hover:text-accent-600 hover:underline ${className ?? ""}`}>
      {name}
    </Link>
  );
}

const trafficTrend = [
  { label: "Apr 18", value: 4200 },
  { label: "Apr 25", value: 6100 },
  { label: "May 2", value: 7400 },
  { label: "May 9", value: 9800 },
  { label: "May 16", value: 13200 },
];

// ── KPI strip — the six numbers a manager scans first ──────────────────────
const kpis = [
  { label: "Active clients", value: clients.length, sub: `${openCampaigns} campaigns running`, icon: Users, href: "/clients" },
  { label: "Tasks today", value: 9, sub: "3 high priority", icon: ListChecks, href: "/tracker" },
  { label: "AI jobs running", value: aiRunning, sub: `of ${workforceSummary.total} specialists`, icon: Bot, href: "/agents" },
  { label: "Blocked tasks", value: blockers.length, sub: "oldest 5 days", icon: Ban, href: "/tracker", tone: "bad" as const },
  { label: "Deployments", value: deployments.length, sub: "1 verifying", icon: Rocket, href: "/deployments" },
  { label: "Approvals", value: approvals.length, sub: "client sign-off", icon: CheckCircle2, href: "/reports", tone: "warn" as const },
];

const sevTone = { high: "bad", medium: "warn", low: "good" } as const;

export default function CommandCenterPage() {
  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Good morning, {currentUser.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-base text-[var(--muted)]">{morningBrief.date} · here&apos;s what needs you today.</p>
      </div>

      {/* ── Morning Brief — the one-paragraph answer to "what do I do today?" ── */}
      <div className="rounded-xl border border-accent-200 bg-[var(--accent-tint)] p-5">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-500 text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <div className="text-2xs font-bold uppercase tracking-[0.08em] text-accent-700">Morning brief</div>
            <p className="mt-1 text-base leading-relaxed text-[var(--foreground)]">{morningBrief.line}</p>
          </div>
        </div>
      </div>

      {/* ── KPI strip ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {kpis.map((k) => (
          <Link key={k.label} href={k.href} className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-card transition-colors hover:border-[var(--border-strong)]">
            <div className="flex items-center gap-2">
              <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${k.tone === "bad" ? "bg-[var(--danger-tint)] text-[var(--danger)]" : k.tone === "warn" ? "bg-[var(--warn-tint)] text-[var(--warn)]" : "bg-[var(--accent-tint)] text-accent-600"}`}>
                <k.icon className="h-4 w-4" />
              </span>
              <span className="text-xs font-medium text-[var(--muted)]">{k.label}</span>
            </div>
            <div className="mt-2 tnum text-3xl font-bold tracking-tight text-[var(--foreground)]">{k.value}</div>
            <div className="mt-0.5 text-xs text-[var(--muted)]">{k.sub}</div>
          </Link>
        ))}
      </div>

      {/* ══ NEEDS ACTION ════════════════════════════════════════════════ */}
      <SectionLabel>Needs action today</SectionLabel>
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Clients needing attention */}
        <Panel className="flex flex-col">
          <PanelHead title="Needs your attention" href="/clients" icon={<AlertTriangle className="h-4 w-4 text-[var(--danger)]" />} />
          <ul className="flex-1 divide-y divide-[var(--border)] px-5">
            {riskAlerts.map((a) => (
              <li key={a.client} className="py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-[var(--foreground)]"><ClientLink name={a.client} /></span>
                  <Badge variant={sevTone[a.severity]}>{a.metric}</Badge>
                </div>
                <div className="mt-0.5 text-xs text-[var(--muted)]">{a.signal}</div>
              </li>
            ))}
          </ul>
          <PanelFoot href="/risk" label="Open Risk Center" />
        </Panel>

        {/* Today's priorities */}
        <Panel className="flex flex-col">
          <PanelHead title="Today's priorities" href="/tracker" />
          <ul className="flex-1 divide-y divide-[var(--border)] px-5">
            {priorityTasks.map((t) => (
              <li key={t.name} className="flex items-center gap-3 py-3">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-2xs font-bold text-white ${t.priority === "high" ? "bg-rose-500" : t.priority === "medium" ? "bg-amber-500" : "bg-slate-400"}`}>
                  {t.due.replace(/[: ].*/, "")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-[var(--foreground)]">{t.name}</div>
                  <div className="truncate text-xs text-[var(--muted)]"><ClientLink name={t.client} /> · {t.owner} · {t.due}</div>
                </div>
              </li>
            ))}
          </ul>
          <PanelFoot href="/tracker" label="View all tasks" />
        </Panel>

        {/* Blockers */}
        <Panel className="flex flex-col">
          <PanelHead title="Blockers" href="/tracker" icon={<Ban className="h-4 w-4 text-[var(--warn)]" />} />
          <ul className="flex-1 divide-y divide-[var(--border)] px-5">
            {blockers.map((b) => (
              <li key={b.task} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-[var(--foreground)]">{b.task}</div>
                  <div className="truncate text-xs text-[var(--muted)]"><ClientLink name={b.client} /></div>
                </div>
                <div className="shrink-0 text-right">
                  <Badge variant="outline">Waiting on {b.waitingOn}</Badge>
                  <div className="mt-1 text-2xs text-[var(--muted)]">{b.age}</div>
                </div>
              </li>
            ))}
          </ul>
          <PanelFoot href="/tracker" label="View all blockers" />
        </Panel>
      </div>

      {/* ══ IN MOTION ═══════════════════════════════════════════════════ */}
      <SectionLabel>In motion</SectionLabel>
      <div className="grid gap-4 lg:grid-cols-3">
        {/* AI workforce */}
        <Panel className="flex flex-col">
          <PanelHead title={`AI workforce (${aiRunning} running)`} href="/agents" icon={<Bot className="h-4 w-4 text-accent-600" />} />
          <ul className="flex-1 divide-y divide-[var(--border)] px-5">
            {aiJobs.map((j) => (
              <li key={`${j.agent}-${j.client}`} className="flex items-center gap-3 py-3">
                <StatusDot tone={j.status === "Queued" ? "warn" : "good"} pulse={j.status !== "Queued"} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-[var(--foreground)]">{j.agent}</div>
                  <div className="truncate text-xs text-[var(--muted)]"><ClientLink name={j.client} /> · {j.eta}</div>
                </div>
                <Badge variant={j.status === "Queued" ? "warn" : "good"}>{j.status}</Badge>
              </li>
            ))}
            {aiRunning > aiJobs.length && (
              <li className="py-2.5 text-xs text-[var(--muted)]">+{aiRunning - aiJobs.length} more specialists working</li>
            )}
          </ul>
          <PanelFoot href="/agents" label="View AI Workforce" />
        </Panel>

        {/* Deployments */}
        <Panel className="flex flex-col">
          <PanelHead title="Deployments" href="/deployments" icon={<Rocket className="h-4 w-4 text-accent-600" />} />
          <ul className="flex-1 divide-y divide-[var(--border)] px-5">
            {deployments.map((d) => (
              <li key={d.item} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-[var(--foreground)]">{d.item}</div>
                  <div className="truncate text-xs text-[var(--muted)]"><ClientLink name={d.client} /> · {d.when}</div>
                </div>
                <Badge variant={d.status === "Live" ? "good" : d.status === "Verifying" ? "accent" : "warn"}>{d.status}</Badge>
              </li>
            ))}
          </ul>
          <PanelFoot href="/deployments" label="View deploy queue" />
        </Panel>

        {/* Approvals + Indexing */}
        <Panel className="flex flex-col">
          <PanelHead title="Approvals & indexing" href="/reports" icon={<CheckCircle2 className="h-4 w-4 text-[var(--warn)]" />} />
          <div className="flex-1 px-5">
            <div className="pt-3 text-2xs font-semibold uppercase tracking-[0.06em] text-[var(--faint)]">Waiting on client</div>
            <ul className="divide-y divide-[var(--border)]">
              {approvals.map((a) => (
                <li key={a.item} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-[var(--foreground)]">{a.item}</div>
                    <div className="truncate text-xs text-[var(--muted)]"><ClientLink name={a.client} /></div>
                  </div>
                  <span className="shrink-0 text-2xs text-[var(--muted)]">{a.since}</span>
                </li>
              ))}
            </ul>
            <div className="pt-3 text-2xs font-semibold uppercase tracking-[0.06em] text-[var(--faint)]">Indexing queue</div>
            <ul className="divide-y divide-[var(--border)]">
              {indexingQueue.map((ix) => (
                <li key={ix.client} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-[var(--foreground)]">{ix.pages} pages</div>
                    <div className="truncate text-xs text-[var(--muted)]"><ClientLink name={ix.client} /></div>
                  </div>
                  <Badge variant={ix.state === "Indexed" ? "good" : ix.state === "Crawled" ? "accent" : "default"}>{ix.state}</Badge>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </div>

      {/* ══ RESULTS & MOMENTUM ══════════════════════════════════════════ */}
      <SectionLabel>Results &amp; momentum</SectionLabel>
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Traffic */}
        <Panel className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[var(--foreground)]">Traffic changes</span>
            <span className="flex items-center gap-0.5 text-sm font-bold text-accent-600"><ArrowUpRight className="h-4 w-4" />+14%</span>
          </div>
          <div className="text-xs text-[var(--muted)]">Portfolio organic, vs last 30 days</div>
          <div className="mt-3"><TrafficArea data={trafficTrend} /></div>
        </Panel>

        {/* Revenue opportunities */}
        <Panel className="flex flex-col">
          <PanelHead title="Revenue opportunities" href="/diagnosis" icon={<TrendingUp className="h-4 w-4 text-accent-600" />} />
          <ul className="flex-1 divide-y divide-[var(--border)] px-5">
            {opportunities.map((o) => (
              <li key={o.title} className="flex items-center gap-3 py-3">
                <span className="flex h-7 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--accent-tint)] text-2xs font-bold text-accent-700">{o.score}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-[var(--foreground)]">{o.title}</div>
                  <div className="truncate text-xs text-[var(--muted)]"><ClientLink name={o.client} /></div>
                </div>
              </li>
            ))}
          </ul>
          <PanelFoot href="/diagnosis" label="View all insights" />
        </Panel>

        {/* Wins */}
        <Panel className="flex flex-col">
          <PanelHead title="Wins" href="/wins" icon={<Sparkles className="h-4 w-4 text-accent-600" />} />
          <ul className="flex-1 divide-y divide-[var(--border)] px-5">
            {wins.slice(0, 5).map((w) => (
              <li key={w.text} className="flex items-center gap-3 py-3">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-accent-600" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-[var(--foreground)]">{w.text}</div>
                  <div className="truncate text-xs text-[var(--muted)]"><ClientLink name={w.client} /> · {w.when}</div>
                </div>
              </li>
            ))}
          </ul>
          <PanelFoot href="/wins" label="View all wins" />
        </Panel>
      </div>

      {/* ══ UPCOMING DEADLINES ══════════════════════════════════════════ */}
      <SectionLabel>Upcoming deadlines</SectionLabel>
      <Panel className="p-2">
        <ul className="divide-y divide-[var(--border)]">
          {upcomingDeadlines.map((d) => (
            <li key={d.item} className="flex items-center gap-3 px-3 py-3">
              <Clock className={`h-4 w-4 shrink-0 ${d.due === "overdue" ? "text-[var(--danger)]" : d.due === "today" ? "text-[var(--warn)]" : "text-[var(--muted)]"}`} />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--foreground)]">{d.item}</span>
              <span className="hidden min-w-0 flex-1 truncate text-xs text-[var(--muted)] sm:block"><ClientLink name={d.client} /> · {d.owner}</span>
              <Badge variant={d.due === "overdue" ? "bad" : d.due === "today" ? "warn" : "outline"}>{d.when}</Badge>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

/* ── shared primitives ─────────────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 pt-1">
      <span className="text-2xs font-bold uppercase tracking-[0.1em] text-[var(--faint)]">{children}</span>
      <div className="h-px flex-1 bg-[var(--border)]" />
    </div>
  );
}

function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-card ${className ?? ""}`}>{children}</div>;
}

function PanelHead({ title, href, icon }: { title: string; href: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 pb-3 pt-5">
      <span className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">{icon}{title}</span>
      <Link href={href} className="text-xs font-medium text-accent-600 hover:text-accent-700">View all</Link>
    </div>
  );
}

function PanelFoot({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-1 border-t border-[var(--border)] px-5 py-3 text-xs font-semibold text-accent-600 hover:bg-[var(--surface-2)]">
      {label} <ArrowRight className="h-3.5 w-3.5" />
    </Link>
  );
}
