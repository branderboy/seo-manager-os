"use client";

import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge, StatusDot } from "@/components/ui/badge";
import { StatTile, StatRow } from "@/components/ui/metric";
import { cn } from "@/lib/utils";
import { agents, orchestrator, workflow, agentTools, assistantsFor, type Agent } from "@/lib/agents";
import { workerState, type WorkerStatus } from "@/lib/workforce";
import { getIntegration } from "@/lib/integrations";
import { team } from "@/lib/model";
import { useDeployState, toggleAgent } from "@/components/agents/deploy-store";
import { useAnnounce } from "@/components/layout/announcer";

const statusTone: Record<WorkerStatus, "good" | "accent" | "warn" | "default"> = {
  Working: "good",
  Queued: "accent",
  Idle: "warn",
  Offline: "default",
};

export function AgentsView() {
  const deployed = useDeployState();
  const announce = useAnnounce();

  const states = agents.map((a) => ({ agent: a, deployed: !!deployed[a.id], state: workerState(a.id, !!deployed[a.id]) }));
  const deployedCount = states.filter((s) => s.deployed).length;
  const workingCount = states.filter((s) => s.state.status === "Working").length;
  const jobsToday = states.reduce((n, s) => n + (s.deployed ? s.state.queue : 0), 0) + 23;
  const avgPerf = Math.round(
    states.filter((s) => s.deployed).reduce((n, s) => n + s.state.performance, 0) / Math.max(1, deployedCount)
  );

  return (
    <div className="space-y-7">
      {/* ── Manager · the Orchestrator runs the floor ───────────────────────── */}
      <section className="reveal overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-card">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">{orchestrator.name}</h2>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-[var(--ok-tint)] px-2 py-0.5 text-2xs font-semibold text-[#116349]">
            <StatusDot tone="good" pulse /> Running
          </span>
          <span className="rounded-md bg-[var(--surface-3)] px-2 py-0.5 text-2xs font-semibold text-[var(--ink-soft)]">
            {deployedCount} of {agents.length} deployed
          </span>
        </div>
        <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">{orchestrator.role}</p>
        <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
          The roster is organized by job role. Each role&apos;s AI assistants do its work; turn one on to deploy its skills and tool access, and the Orchestrator routes the matching brief work to it.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-1 gap-y-2">
          {workflow.map((step, i) => (
            <span key={step} className="flex items-center gap-1">
              <span className="rounded-md bg-[var(--surface-3)] px-2 py-1 text-2xs font-medium text-[var(--ink-soft)]">{step}</span>
              {i < workflow.length - 1 && <span className="text-[var(--faint)]">›</span>}
            </span>
          ))}
        </div>
      </section>

      {/* ── Workforce KPIs ──────────────────────────────────────────────────── */}
      <StatRow cols={4}>
        <StatTile label="AI assistants deployed" value={`${deployedCount}/${agents.length}`} sub="of the full roster" />
        <StatTile label="Working now" value={workingCount} tone="good" sub="active assignments" />
        <StatTile label="Jobs completed today" value={jobsToday} tone="accent" />
        <StatTile label="Avg. performance" value={`${avgPerf}%`} sub="QA pass rate" />
      </StatRow>

      {/* ── By job role — SEO Manager first, then the team ──────────────────── */}
      {team.map((member) => {
        const members = assistantsFor(member.id);
        if (members.length === 0) return null;
        const deployedHere = members.filter((a) => deployed[a.id]).length;
        const workingHere = members.filter((a) => deployed[a.id] && workerState(a.id, true).status === "Working").length;
        return (
          <section key={member.id}>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm", member.color)}>
                {member.initials}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold tracking-tight text-[var(--foreground)]">{member.role}</h3>
                <p className="text-xs text-[var(--muted)]">
                  {member.name} · {members.length} AI assistant{members.length > 1 ? "s" : ""}
                </p>
              </div>
              <span className="rounded-md bg-[var(--accent-tint)] px-2 py-1 text-2xs font-bold text-accent-700 ring-1 ring-inset ring-accent-200">
                {deployedHere}/{members.length} deployed
              </span>
              <span className="rounded-md bg-[var(--ok-tint)] px-2 py-1 text-2xs font-bold text-[#116349]">
                {workingHere} working
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {members.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  deployed={!!deployed[agent.id]}
                  state={workerState(agent.id, !!deployed[agent.id])}
                  onToggle={(v) => {
                    toggleAgent(agent.id, v);
                    announce(`${agent.name} ${v ? "deployed" : "stood down"}`);
                  }}
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
  deployed,
  state,
  onToggle,
}: {
  agent: Agent;
  deployed: boolean;
  state: ReturnType<typeof workerState>;
  onToggle: (v: boolean) => void;
}) {
  return (
    <Card interactive className={cn("flex flex-col overflow-hidden", !deployed && "opacity-[0.92]")}>
      {/* Identity bar */}
      <div className={cn("h-1 w-full", deployed ? "bg-accent-500" : "bg-[var(--border)]")} />

      {/* Header · identity + deploy toggle */}
      <div className="flex items-start gap-3 p-4 pb-3">
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

      {/* Current task — the brief work it accepted */}
      <div className="border-t border-[var(--border)] bg-[var(--surface-2)] px-4 py-3">
        <div className="mb-1 text-2xs font-semibold uppercase tracking-[0.06em] text-[var(--faint)]">Current task</div>
        {state.currentTask ? (
          <div>
            <div className="text-sm font-medium leading-snug text-[var(--foreground)]">{state.currentTask}</div>
            <div className="mt-0.5 text-xs text-[var(--muted)]">{state.client}</div>
          </div>
        ) : (
          <div className="text-sm text-[var(--muted)]">
            {deployed ? "On · ready to accept brief work that fits its skills" : "Off · brief work for this skill is uncovered"}
          </div>
        )}
      </div>

      {/* Tool access — its toolbelt; connected tools (green) are live */}
      <div className="border-t border-[var(--border)] px-4 py-3">
        <div className="mb-1.5 text-2xs font-semibold uppercase tracking-[0.06em] text-[var(--faint)]">Access</div>
        <div className="flex flex-wrap gap-1">
          {(agentTools[agent.id] ?? []).map((tid) => {
            const tool = getIntegration(tid);
            if (!tool) return null;
            return (
              <span
                key={tid}
                title={tool.connected ? `${tool.name} · connected` : `${tool.name} · not connected`}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-2xs font-medium",
                  tool.connected
                    ? "border-[var(--border)] bg-[var(--surface-2)] text-[var(--ink-soft)]"
                    : "border-dashed border-[var(--border)] text-[var(--faint)]"
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", tool.connected ? "bg-accent-500" : "bg-[var(--faint)]")} />
                {tool.name}
              </span>
            );
          })}
        </div>
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
