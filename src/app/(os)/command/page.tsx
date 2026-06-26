import type { Metadata } from "next";
import Link from "next/link";
import {
  ListChecks,
  Loader,
  Hourglass,
  Rocket,
  Bot,
  Search,
  Bell,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  CheckCircle2,
  Check,
  Plus,
  TrendingUp,
  Users,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DonutChart, TrafficArea } from "@/components/command/charts";
import { STAGES } from "@/lib/stages";
import { featuredInvestigation as inv, currentUser, clients } from "@/lib/model";
import { workforceSummary } from "@/lib/workforce";
import { ProfileSwitcher } from "@/components/layout/profile-switcher";
import {
  priorityTasks,
  aiJobs,
  clientsNeedingAttention,
  deployments,
} from "@/lib/command";

const DEPLOY_TODAY = 8;

// Map a client name back to its profile so dashboard data links to a real record.
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

export const metadata: Metadata = { title: "Command Center" };

// ── Local view data (matches the operations dashboard) ─────────────────────
const kpis = [
  { label: "Total Tasks", value: 127, delta: 10, up: true, icon: ListChecks },
  { label: "In Progress", value: 32, delta: 12, up: true, icon: Loader },
  { label: "Waiting", value: 14, delta: 8, up: false, icon: Hourglass },
  { label: "Deploy Today", value: DEPLOY_TODAY, delta: 23, up: true, icon: Rocket },
  { label: "AI Jobs Running", value: workforceSummary.working, delta: null, up: true, icon: Bot },
];

const tasksByStatus = [
  { name: "Backlog", value: 27, color: "#94a3b8" },
  { name: "In Progress", value: 32, color: "#3b82f6" },
  { name: "Waiting", value: 14, color: "#f43f5e" },
  { name: "QA", value: 11, color: "#f59e0b" },
  { name: "Deploying", value: 8, color: "#8b5cf6" },
  { name: "Verified", value: 35, color: "#16b364" },
];

const trafficTrend = [
  { label: "Apr 18", value: 4200 },
  { label: "Apr 25", value: 6100 },
  { label: "May 2", value: 7400 },
  { label: "May 9", value: 9800 },
  { label: "May 16", value: 13200 },
];

const riskBars = [
  { label: "Traffic Risk", level: "High", value: 72, tone: "bad" },
  { label: "Revenue Risk", level: "Medium", value: 58, tone: "warn" },
  { label: "Technical Risk", level: "High", value: 76, tone: "bad" },
  { label: "Content Risk", level: "Medium", value: 54, tone: "warn" },
  { label: "Local Risk", level: "Medium", value: 62, tone: "warn" },
  { label: "Authority Risk", level: "Low", value: 38, tone: "good" },
] as const;

const diagnosisRows = [
  { issue: "Fix missing title tags", impact: "High", hours: 4, revenue: "$2,400/mo", owner: "PR" },
  { issue: "Improve Core Web Vitals", impact: "High", hours: 8, revenue: "$4,800/mo", owner: "JD" },
  { issue: "Add schema markup", impact: "High", hours: 3, revenue: "$1,100/mo", owner: "AK" },
  { issue: "Optimize meta descriptions", impact: "Medium", hours: 2, revenue: "$900/mo", owner: "PR" },
  { issue: "Fix thin content pages", impact: "Medium", hours: 6, revenue: "$1,300/mo", owner: "JD" },
];

const kanban = [
  { lane: "Backlog", count: 27, tone: "default", tasks: ["Create service page brief", "Fix broken links", "Add FAQ schema", "Update sitemap"] },
  { lane: "In Progress", count: 32, tone: "accent", tasks: ["Fix title tags", "Improve LCP", "Update robots.txt"] },
  { lane: "QA", count: 11, tone: "warn", tasks: ["Check schema", "Cross-browser test", "Schema updates"] },
  { lane: "Deployed", count: 8, tone: "good", tasks: ["New landing pages", "Title tags fixed", "Internal links added"] },
];

const reportsOverview = [
  { label: "Work Completed", value: "24", delta: 20, up: true, icon: CheckCircle2 },
  { label: "Blocked Tasks", value: "7", delta: 12, up: false, icon: AlertCircle },
  { label: "Traffic Change", value: "+14%", delta: 14, up: true, icon: TrendingUp },
  { label: "Leads Generated", value: "128", delta: 18, up: true, icon: Users },
];

const workforce = [
  { name: "Orchestrator", status: "Running", color: "bg-sky-500" },
  { name: "Tech Auditor", status: "Running", color: "bg-blue-500" },
  { name: "Content Strategist", status: "Running", color: "bg-violet-500" },
  { name: "Intent Mapper", status: "Running", color: "bg-teal-500" },
  { name: "Schema Specialist", status: "Running", color: "bg-emerald-500" },
  { name: "QA Inspector", status: "Waiting", color: "bg-orange-500" },
  { name: "Reporting Manager", status: "Completed", color: "bg-rose-500" },
];

const morningChecklist = [
  { text: `${priorityTasks.length} priority tasks today`, meta: "High priority" },
  { text: `${clientsNeedingAttention.length} clients need your attention`, meta: "Requires action" },
  { text: `${workforceSummary.working} AI jobs running`, meta: "In progress" },
  { text: `${DEPLOY_TODAY} deployments scheduled`, meta: "Today" },
  { text: "Traffic up 14%", meta: "vs last 30 days" },
];

const impactBadge = { High: "bad", Medium: "warn", Low: "good" } as const;
const pBadge = ["bg-rose-500", "bg-amber-500", "bg-slate-400"];

export default function CommandCenterPage() {
  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
            Good morning, {currentUser.name.split(" ")[0]} <span className="align-middle">👋</span>
          </h1>
          <p className="mt-1 text-base text-[var(--muted)]">Portfolio-wide view across every client. Open a client to drill into its workspace.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <ProfileSwitcher />
          <div className="relative hidden sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--faint)]" />
            <input
              placeholder="Search clients, tasks, reports…"
              className="h-10 w-72 rounded-lg border border-[var(--border)] bg-[var(--surface)] pl-9 pr-3 text-sm shadow-card outline-none placeholder:text-[var(--faint)] focus:border-accent-400 focus:ring-2 focus:ring-accent-100"
            />
          </div>
          <button className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] shadow-card hover:text-[var(--foreground)]">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--danger)] px-1 text-2xs font-bold text-white">3</span>
          </button>
          <button className="flex h-10 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-medium text-[var(--ink-soft)] shadow-card hover:text-[var(--foreground)]">
            <Calendar className="h-4 w-4 text-[var(--muted)]" />
            May 12 – May 18, 2025
          </button>
        </div>
      </div>

      {/* ── KPI cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {kpis.map((k) => (
          <Panel key={k.label} className="p-5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-tint)] text-accent-600">
                <k.icon className="h-4 w-4" />
              </span>
              <span className="text-sm font-medium text-[var(--muted)]">{k.label}</span>
            </div>
            <div className="mt-3 tnum text-4xl font-bold tracking-tight text-[var(--foreground)]">{k.value}</div>
            {k.delta != null && (
              <div className={`mt-2 flex items-center gap-1 text-sm font-semibold ${k.up ? "text-accent-600" : "text-[var(--danger)]"}`}>
                {k.up ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                {k.delta}% <span className="font-normal text-[var(--muted)]">from last week</span>
              </div>
            )}
          </Panel>
        ))}
      </div>

      {/* ── Row: Priority Tasks · AI Jobs · Tasks by Status ────────────────── */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="flex flex-col">
          <PanelHead title="Priority Tasks" href="/tracker" />
          <ul className="flex-1 divide-y divide-[var(--border)] px-5">
            {priorityTasks.map((t) => (
              <li key={t.name} className="flex items-center gap-3 py-3">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-2xs font-bold text-white ${pBadge[t.priority === "high" ? 0 : t.priority === "medium" ? 1 : 2]}`}>
                  P{t.priority === "high" ? 1 : t.priority === "medium" ? 2 : 3}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-[var(--foreground)]">{t.name}</div>
                  <div className="truncate text-xs text-[var(--muted)]"><ClientLink name={t.client} /> · {t.due}</div>
                </div>
                <Badge variant={t.priority === "high" ? "bad" : t.priority === "medium" ? "warn" : "good"}>
                  {t.priority === "high" ? "High" : t.priority === "medium" ? "Medium" : "Low"} impact
                </Badge>
              </li>
            ))}
          </ul>
          <PanelFoot href="/tracker" label="View all tasks" />
        </Panel>

        <Panel className="flex flex-col">
          <PanelHead title={`AI Jobs Running (${workforceSummary.working})`} href="/agents" />
          <ul className="flex-1 divide-y divide-[var(--border)] px-5">
            {aiJobs.map((j) => (
              <li key={`${j.agent}-${j.client}`} className="flex items-center gap-3 py-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-3)] text-[var(--ink-soft)]">
                  <Bot className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-[var(--foreground)]">{j.agent}</div>
                  <div className="truncate text-xs text-[var(--muted)]"><ClientLink name={j.client} /></div>
                </div>
                <Badge variant={j.status === "Queued" ? "warn" : "good"}>{j.status === "Queued" ? "Queued" : "Running"}</Badge>
              </li>
            ))}
            {workforceSummary.working > aiJobs.length && (
              <li className="py-2.5 text-xs text-[var(--muted)]">+{workforceSummary.working - aiJobs.length} more running</li>
            )}
          </ul>
          <PanelFoot href="/agents" label="View all jobs" />
        </Panel>

        <Panel className="flex flex-col">
          <PanelHead title="Tasks by Status" href="/tracker" />
          <div className="flex flex-1 items-center gap-4 p-5">
            <DonutChart data={tasksByStatus} />
            <ul className="flex-1 space-y-2">
              {tasksByStatus.map((s) => (
                <li key={s.name} className="flex items-center gap-2 text-sm">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="flex-1 text-[var(--ink-soft)]">{s.name}</span>
                  <span className="tnum font-semibold text-[var(--foreground)]">{s.value}</span>
                </li>
              ))}
            </ul>
          </div>
          <PanelFoot href="/tracker" label="View all tasks" />
        </Panel>
      </div>

      {/* ── Row: Traffic · Attention · Risk · Deploy Queue ─────────────────── */}
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <Panel className="p-5">
          <div className="text-sm font-semibold text-[var(--foreground)]">Traffic Overview</div>
          <div className="text-xs text-[var(--muted)]">vs last 30 days</div>
          <div className="mt-2 text-3xl font-bold text-accent-600">+14%</div>
          <div className="text-xs text-[var(--muted)]">Total organic traffic</div>
          <div className="mt-2"><TrafficArea data={trafficTrend} /></div>
        </Panel>

        <Panel className="flex flex-col">
          <div className="px-5 pt-5">
            <div className="text-sm font-semibold text-[var(--foreground)]">Clients Need Attention</div>
            <div className="mt-1 tnum text-3xl font-bold text-[var(--foreground)]">{clientsNeedingAttention.length}</div>
          </div>
          <ul className="mt-1 flex-1 px-5">
            {clientsNeedingAttention.map((c) => (
              <li key={c.client} className="border-t border-[var(--border)] py-2.5 first:border-t-0">
                <div className="text-sm font-medium text-[var(--foreground)]"><ClientLink name={c.client} /></div>
                <div className={`text-xs font-medium ${c.severity === "high" ? "text-[var(--danger)]" : "text-[var(--warn)]"}`}>{c.reason.split(" — ")[0]}</div>
              </li>
            ))}
          </ul>
          <PanelFoot href="/clients" label="View all clients" />
        </Panel>

        <Panel className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[var(--foreground)]">Risk Center</span>
            <Link href="/risk" className="text-xs font-medium text-accent-600 hover:text-accent-700">View full report</Link>
          </div>
          <ul className="mt-3 space-y-2.5">
            {riskBars.map((r) => (
              <li key={r.label} className="flex items-center gap-2 text-xs">
                <span className="w-24 shrink-0 text-[var(--ink-soft)]">{r.label}</span>
                <span className={`w-12 shrink-0 font-semibold ${r.tone === "bad" ? "text-[var(--danger)]" : r.tone === "warn" ? "text-[var(--warn)]" : "text-accent-600"}`}>{r.level}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-3)]">
                  <span className={`block h-full rounded-full ${r.tone === "bad" ? "bg-[var(--danger)]" : r.tone === "warn" ? "bg-[var(--warn)]" : "bg-accent-500"}`} style={{ width: `${r.value}%` }} />
                </span>
                <span className="tnum w-12 shrink-0 text-right text-[var(--muted)]">{r.value}/100</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel className="flex flex-col">
          <PanelHead title="Deployment Queue" href="/deployments" />
          <ul className="flex-1 divide-y divide-[var(--border)] px-5">
            {deployments.map((d, i) => (
              <li key={d.item} className="flex items-center gap-3 py-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-3)] text-[var(--muted)]"><Rocket className="h-4 w-4" /></span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-[var(--foreground)]"><ClientLink name={d.client} /></div>
                  <div className="truncate text-xs text-[var(--muted)]">{d.item}</div>
                </div>
                <Badge variant={i === 0 ? "good" : i === 1 ? "warn" : "default"}>{d.when}</Badge>
              </li>
            ))}
          </ul>
          <PanelFoot href="/deployments" label="View all" />
        </Panel>
      </div>

      {/* ── SEO Pipeline stepper ──────────────────────────────────────────── */}
      <Panel className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[var(--foreground)]">SEO Pipeline</span>
          <Link href="/workflow" className="text-xs font-medium text-accent-600 hover:text-accent-700">View full pipeline</Link>
        </div>
        <div className="mt-5 flex items-start gap-1 overflow-x-auto pb-1">
          {STAGES.map((s, i) => {
            const done = s.n < inv.currentStage;
            const current = s.n === inv.currentStage;
            const Icon = s.icon;
            return (
              <div key={s.slug} className="flex min-w-[88px] flex-1 flex-col items-center text-center">
                <div className="flex w-full items-center">
                  <span className={`h-0.5 flex-1 ${i === 0 ? "opacity-0" : done || current ? "bg-accent-400" : "bg-[var(--border)]"}`} />
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 ${done ? "border-accent-500 bg-accent-500 text-white" : current ? "border-accent-500 bg-[var(--accent-tint)] text-accent-600" : "border-[var(--border)] bg-[var(--surface)] text-[var(--faint)]"}`}>
                    {done ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </span>
                  <span className={`h-0.5 flex-1 ${i === STAGES.length - 1 ? "opacity-0" : done ? "bg-accent-400" : "bg-[var(--border)]"}`} />
                </div>
                <div className="mt-2 text-xs font-semibold text-[var(--foreground)]">{s.short}</div>
                <div className={`text-2xs ${current ? "font-semibold text-accent-600" : "text-[var(--muted)]"}`}>
                  {current ? "In Progress" : done ? "Complete" : "Upcoming"}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      {/* ── Row: Diagnosis · Daily Task Engine · Reports ───────────────────── */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="flex flex-col">
          <PanelHead title="Diagnosis Priority Board" href="/diagnosis" />
          <div className="flex gap-1.5 px-5 pb-3">
            <span className="rounded-md bg-accent-500 px-2.5 py-1 text-xs font-semibold text-white">Priority 1 (12)</span>
            <span className="rounded-md bg-[var(--surface-3)] px-2.5 py-1 text-xs font-medium text-[var(--muted)]">Priority 2 (18)</span>
            <span className="rounded-md bg-[var(--surface-3)] px-2.5 py-1 text-xs font-medium text-[var(--muted)]">Priority 3 (24)</span>
          </div>
          <ul className="flex-1 divide-y divide-[var(--border)] px-5">
            {diagnosisRows.map((d) => (
              <li key={d.issue} className="flex items-center gap-2 py-2.5">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-[var(--foreground)]">{d.issue}</div>
                  <div className="text-xs text-[var(--muted)]">{d.hours}h · <span className="font-medium text-accent-600">{d.revenue}</span></div>
                </div>
                <Badge variant={impactBadge[d.impact as keyof typeof impactBadge]}>{d.impact}</Badge>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--surface-3)] text-2xs font-bold text-[var(--ink-soft)]">{d.owner}</span>
              </li>
            ))}
          </ul>
          <PanelFoot href="/diagnosis" label="View all diagnoses" />
        </Panel>

        <Panel className="flex flex-col">
          <PanelHead title="Daily Task Engine" href="/tasks" />
          <div className="grid flex-1 grid-cols-2 gap-2 p-5 pt-0">
            {kanban.map((col) => (
              <div key={col.lane} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-2.5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--foreground)]">{col.lane}</span>
                  <span className="tnum text-2xs font-bold text-[var(--muted)]">{col.count}</span>
                </div>
                <div className="space-y-1.5">
                  {col.tasks.slice(0, 3).map((t) => (
                    <div key={t} className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-xs text-[var(--ink-soft)]">{t}</div>
                  ))}
                  <div className="text-2xs text-[var(--faint)]">+ {Math.max(0, col.count - 3)} more</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="flex flex-col">
          <PanelHead title="Reports Overview" href="/reports" />
          <ul className="flex-1 divide-y divide-[var(--border)] px-5">
            {reportsOverview.map((r) => (
              <li key={r.label} className="flex items-center gap-3 py-3.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent-tint)] text-accent-600"><r.icon className="h-4 w-4" /></span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-[var(--muted)]">{r.label}</div>
                  <div className="tnum text-xl font-bold text-[var(--foreground)]">{r.value}</div>
                </div>
                <span className={`flex items-center gap-0.5 text-sm font-semibold ${r.up ? "text-accent-600" : "text-[var(--danger)]"}`}>
                  {r.up ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}{r.delta}%
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* ── Row: AI Workforce · Morning Brief ──────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel className="flex flex-col">
          <PanelHead title="AI Workforce at Work" href="/agents" />
          <div className="grid grid-cols-3 gap-3 p-5 sm:grid-cols-4">
            {workforce.map((w) => (
              <div key={w.name} className="flex flex-col items-center rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3 text-center">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-white ${w.color}`}><Bot className="h-5 w-5" /></span>
                <span className="mt-2 line-clamp-1 text-2xs font-semibold text-[var(--foreground)]">{w.name}</span>
                <Badge variant={w.status === "Running" ? "good" : w.status === "Waiting" ? "warn" : "default"} className="mt-1">{w.status}</Badge>
              </div>
            ))}
            <Link href="/agents" className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border-strong)] p-3 text-center text-[var(--muted)] hover:border-accent-400 hover:text-accent-600">
              <Plus className="h-5 w-5" />
              <span className="mt-1 text-2xs font-medium">Add Specialist</span>
            </Link>
          </div>
        </Panel>

        <Panel className="flex flex-col">
          <PanelHead title="Morning Brief" href="/wins" />
          <ul className="flex-1 px-5">
            {morningChecklist.map((m, i) => (
              <li key={i} className="flex items-center gap-3 border-t border-[var(--border)] py-3 first:border-t-0">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[var(--accent-tint)] text-accent-600"><Check className="h-3.5 w-3.5" /></span>
                <span className="flex-1 text-sm font-medium text-[var(--foreground)]">{m.text}</span>
                <span className="text-xs text-[var(--muted)]">{m.meta}</span>
              </li>
            ))}
          </ul>
          <PanelFoot href="/wins" label="View full brief" />
        </Panel>
      </div>
    </div>
  );
}

/* ── shared panel primitives ───────────────────────────────────────────── */
function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-card ${className ?? ""}`}>{children}</div>;
}

function PanelHead({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between px-5 pt-5 pb-3">
      <span className="text-sm font-semibold text-[var(--foreground)]">{title}</span>
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
