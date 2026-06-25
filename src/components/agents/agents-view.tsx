"use client";

import * as React from "react";
import {
  Gauge,
  ListChecks,
  CheckCircle2,
  History,
  Telescope,
  Wrench,
  Stethoscope,
  PenLine,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge, StatusDot } from "@/components/ui/badge";
import { StatTile, StatRow } from "@/components/ui/metric";
import { cn } from "@/lib/utils";
import { agents, orchestrator, workflow, type Agent } from "@/lib/agents";
import { workerState, type WorkerStatus } from "@/lib/workforce";
import { useDeployState, toggleAgent } from "@/components/agents/deploy-store";

const statusTone: Record<WorkerStatus, "good" | "accent" | "warn" | "default"> = {
  Working: "good",
  Queued: "accent",
  Idle: "warn",
  Offline: "default",
};

// ── Departments — specialists grouped by function. Each department owns one
// color from a green-complementary palette, so the roster reads as an organized
// set of assets, not a clashing pile of icons.
type Accent = { solid: string; tint: string; text: string; ring: string };

const DEPARTMENTS: {
  id: string;
  name: string;
  desc: string;
  icon: LucideIcon;
  accent: Accent;
  ids: string[];
}[] = [
  {
    id: "research",
    name: "Research & Discovery",
    desc: "Understand the business, the market and the demand",
    icon: Telescope,
    accent: { solid: "bg-teal-500", tint: "bg-teal-50", text: "text-teal-700", ring: "ring-teal-200" },
    ids: ["discovery", "research", "intent", "competitive"],
  },
  {
    id: "technical",
    name: "Technical SEO",
    desc: "Crawl, indexation, schema, structure and links",
    icon: Wrench,
    accent: { solid: "bg-sky-600", tint: "bg-sky-50", text: "text-sky-700", ring: "ring-sky-200" },
    ids: ["technical-auditor", "schema", "internal-linking"],
  },
  {
    id: "strategy",
    name: "Diagnosis & Strategy",
    desc: "Decide what to fix first and chart the roadmap",
    icon: Stethoscope,
    accent: { solid: "bg-amber-500", tint: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200" },
    ids: ["diagnosis", "strategy", "brief"],
  },
  {
    id: "content",
    name: "Content & Local",
    desc: "Produce pages, briefs and local presence",
    icon: PenLine,
    accent: { solid: "bg-emerald-600", tint: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200" },
    ids: ["content", "playbook", "local"],
  },
  {
    id: "delivery",
    name: "Quality & Delivery",
    desc: "Verify the work and report the results",
    icon: ShieldCheck,
    accent: { solid: "bg-green-700", tint: "bg-green-50", text: "text-green-700", ring: "ring-green-200" },
    ids: ["qa", "reporting"],
  },
];

const agentById = Object.fromEntries(agents.map((a) => [a.id, a]));

export function AgentsView() {
  const deployed = useDeployState();

  const states = agents.map((a) => ({ agent: a, deployed: !!deployed[a.id], state: workerState(a.id, !!deployed[a.id]) }));
  const deployedCount = states.filter((s) => s.deployed).length;
  const workingCount = states.filter((s) => s.state.status === "Working").length;
  const jobsToday = states.reduce((n, s) => n + (s.deployed ? s.state.queue : 0), 0) + 23;
  const avgPerf = Math.round(
    states.filter((s) => s.deployed).reduce((n, s) => n + s.state.performance, 0) / Math.max(1, deployedCount)
  );

  return (
    <div className="space-y-7">
      {/* ── Manager — the Orchestrator runs the floor ───────────────────────── */}
      <section className="reveal overflow-hidden rounded-2xl border border-[var(--feature-border)] bg-[var(--feature)] text-white shadow-lg">
        <div className="flex flex-wrap items-start gap-4 p-6">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <orchestrator.icon className="h-6 w-6 text-white" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight text-white">{orchestrator.name}</h2>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-1.5 py-0.5 text-2xs font-semibold text-white/80">
                <StatusDot tone="good" pulse /> Running
              </span>
              <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-2xs font-semibold text-white/80">
                {deployedCount} of {agents.length} deployed
              </span>
            </div>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-white/65">{orchestrator.role}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-1 gap-y-2">
              {workflow.map((step, i) => (
                <span key={step} className="flex items-center gap-1">
                  <span className="rounded-md bg-white/[0.07] px-2 py-1 text-2xs font-medium text-white/75">{step}</span>
                  {i < workflow.length - 1 && <span className="text-white/25">›</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Workforce KPIs ──────────────────────────────────────────────────── */}
      <StatRow cols={4}>
        <StatTile label="Specialists deployed" value={`${deployedCount}/${agents.length}`} sub="of the full roster" icon={ListChecks} />
        <StatTile label="Working now" value={workingCount} tone="good" sub="active assignments" />
        <StatTile label="Jobs completed today" value={jobsToday} tone="accent" icon={CheckCircle2} />
        <StatTile label="Avg. performance" value={`${avgPerf}%`} sub="QA pass rate" icon={Gauge} />
      </StatRow>

      {/* ── Departments ─────────────────────────────────────────────────────── */}
      {DEPARTMENTS.map((dept) => {
        const members = dept.ids.map((id) => agentById[id]).filter(Boolean);
        const deployedHere = members.filter((m) => deployed[m.id]).length;
        const workingHere = members.filter((m) => deployed[m.id] && workerState(m.id, true).status === "Working").length;
        const DeptIcon = dept.icon;
        return (
          <section key={dept.id}>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm", dept.accent.solid)}>
                <DeptIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold tracking-tight text-[var(--foreground)]">{dept.name}</h3>
                <p className="text-xs text-[var(--muted)]">{dept.desc}</p>
              </div>
              <span className={cn("rounded-md px-2 py-1 text-2xs font-bold ring-1 ring-inset", dept.accent.tint, dept.accent.text, dept.accent.ring)}>
                {deployedHere}/{members.length} deployed
              </span>
              <span className="rounded-md bg-[var(--ok-tint)] px-2 py-1 text-2xs font-bold text-[#157552]">
                {workingHere} working
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {members.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  accent={dept.accent}
                  deployed={!!deployed[agent.id]}
                  state={workerState(agent.id, !!deployed[agent.id])}
                  onToggle={(v) => toggleAgent(agent.id, v)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function AgentCard({
  agent,
  accent,
  deployed,
  state,
  onToggle,
}: {
  agent: Agent;
  accent: Accent;
  deployed: boolean;
  state: ReturnType<typeof workerState>;
  onToggle: (v: boolean) => void;
}) {
  const Icon = agent.icon;
  return (
    <Card interactive className={cn("flex flex-col overflow-hidden", !deployed && "opacity-[0.92]")}>
      {/* Department identity bar */}
      <div className={cn("h-1 w-full", deployed ? accent.solid : "bg-[var(--border)]")} />

      {/* Header — identity + deploy toggle */}
      <div className="flex items-start gap-3 p-4 pb-3">
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm",
            deployed ? cn(accent.solid, "text-white") : "bg-[var(--surface-3)] text-[var(--muted)]"
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-[var(--foreground)]">{agent.name}</div>
          <div className="truncate text-xs text-[var(--muted)]">{agent.role}</div>
        </div>
        <Switch checked={deployed} onChange={onToggle} label={`Deploy ${agent.name}`} />
      </div>

      {/* Status line */}
      <div className="flex items-center gap-2 px-4 pb-3">
        <Badge variant={statusTone[state.status]} className="gap-1.5">
          <StatusDot tone={statusTone[state.status]} pulse={state.status === "Working"} />
          {state.status}
        </Badge>
        <span className="truncate text-xs text-[var(--muted)]">{state.availability}</span>
      </div>

      {/* Current task */}
      <div className="border-t border-[var(--border)] bg-[var(--surface-2)] px-4 py-3">
        <div className="mb-1 text-2xs font-semibold uppercase tracking-[0.06em] text-[var(--faint)]">Current task</div>
        {state.currentTask ? (
          <div>
            <div className="text-sm font-medium leading-snug text-[var(--foreground)]">{state.currentTask}</div>
            <div className="mt-0.5 text-xs text-[var(--muted)]">{state.client}</div>
          </div>
        ) : (
          <div className="text-sm text-[var(--muted)]">
            {deployed ? "Idle — ready for assignment" : "Offline — deploy to assign work"}
          </div>
        )}
      </div>

      {/* Stats footer */}
      <div className="grid grid-cols-3 divide-x divide-[var(--border)] border-t border-[var(--border)]">
        <Stat label="Queue" value={state.queue} />
        <Stat label="Completed" value={state.completed} />
        <Stat label="Performance" value={`${state.performance}%`} />
      </div>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="px-3 py-2.5 text-center">
      <div className="tnum text-base font-semibold text-[var(--foreground)]">{value}</div>
      <div className="text-2xs text-[var(--muted)]">{label}</div>
    </div>
  );
}
