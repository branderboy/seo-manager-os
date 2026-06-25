"use client";

import * as React from "react";
import { Gauge, ListChecks, CheckCircle2, History } from "lucide-react";
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
const dotTone: Record<WorkerStatus, "good" | "accent" | "warn" | "default"> = {
  Working: "good",
  Queued: "accent",
  Idle: "warn",
  Offline: "default",
};

type Filter = "all" | "working" | "idle" | "offline";

export function AgentsView() {
  const deployed = useDeployState();
  const [filter, setFilter] = React.useState<Filter>("all");

  const states = agents.map((a) => ({ agent: a, deployed: !!deployed[a.id], state: workerState(a.id, !!deployed[a.id]) }));
  const deployedCount = states.filter((s) => s.deployed).length;
  const workingCount = states.filter((s) => s.state.status === "Working").length;
  const jobsToday = states.reduce((n, s) => n + (s.deployed ? s.state.queue : 0), 0) + 23;
  const avgPerf = Math.round(
    states.filter((s) => s.deployed).reduce((n, s) => n + s.state.performance, 0) / Math.max(1, deployedCount)
  );

  const filtered = states.filter((s) => {
    if (filter === "all") return true;
    if (filter === "working") return s.state.status === "Working" || s.state.status === "Queued";
    if (filter === "idle") return s.state.status === "Idle";
    return s.state.status === "Offline";
  });

  const counts = {
    all: states.length,
    working: states.filter((s) => s.state.status === "Working" || s.state.status === "Queued").length,
    idle: states.filter((s) => s.state.status === "Idle").length,
    offline: states.filter((s) => s.state.status === "Offline").length,
  };

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

      {/* ── Roster ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">Specialist roster</h3>
        <div className="flex items-center gap-0.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-0.5 text-sm shadow-card">
          {(["all", "working", "idle", "offline"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                filter === f
                  ? "bg-accent-600 text-white"
                  : "text-[var(--muted)] hover:bg-[var(--surface-3)] hover:text-[var(--foreground)]"
              )}
            >
              {f} <span className="tnum opacity-60">{counts[f]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {filtered.map(({ agent, deployed: dep, state }) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            deployed={dep}
            state={state}
            onToggle={(v) => toggleAgent(agent.id, v)}
          />
        ))}
      </div>
    </div>
  );
}

function AgentCard({
  agent,
  deployed,
  state,
  onToggle,
}: {
  agent: Agent;
  deployed: boolean;
  state: ReturnType<typeof workerState>;
  onToggle: (v: boolean) => void;
}) {
  const Icon = agent.icon;
  return (
    <Card
      interactive
      className={cn("flex flex-col overflow-hidden", !deployed && "opacity-[0.85]")}
    >
      {/* Header — identity + live status */}
      <div className="flex items-start gap-3 p-4 pb-3">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            deployed ? "bg-[var(--accent-tint)] text-accent-600" : "bg-[var(--surface-3)] text-[var(--muted)]"
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-[var(--foreground)]">{agent.name}</div>
          <div className="truncate text-xs text-[var(--muted)]">{agent.stage} · {agent.cadence}</div>
        </div>
        <Switch checked={deployed} onChange={onToggle} label={`Deploy ${agent.name}`} />
      </div>

      {/* Status line */}
      <div className="flex items-center gap-2 px-4 pb-3">
        <Badge variant={statusTone[state.status]} className="gap-1.5">
          <StatusDot tone={dotTone[state.status]} pulse={state.status === "Working"} />
          {state.status}
        </Badge>
        <span className="truncate text-xs text-[var(--muted)]">{state.availability}</span>
      </div>

      {/* Current task — the focal content */}
      <div className="border-t border-[var(--border)] bg-[var(--surface-2)] px-4 py-3">
        <div className="mb-1 text-2xs font-semibold uppercase tracking-[0.06em] text-[var(--faint)]">
          Current task
        </div>
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

      {/* Recent work */}
      {state.recentWork.length > 0 && (
        <div className="border-t border-[var(--border)] px-4 py-2.5">
          <div className="mb-1 flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-[0.06em] text-[var(--faint)]">
            <History className="h-3 w-3" /> Recent work
          </div>
          <ul className="space-y-0.5">
            {state.recentWork.slice(0, 2).map((w) => (
              <li key={w} className="truncate text-xs text-[var(--muted)]">{w}</li>
            ))}
          </ul>
        </div>
      )}
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
