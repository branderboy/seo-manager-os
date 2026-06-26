"use client";

import { Telescope, Wrench, Stethoscope, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge, StatusDot } from "@/components/ui/badge";
import { StatTile, StatRow } from "@/components/ui/metric";
import { cn } from "@/lib/utils";
import { agents, orchestrator, workflow, agentTools, agentSupervisor, type Agent } from "@/lib/agents";
import { workerState, type WorkerStatus } from "@/lib/workforce";
import { getIntegration } from "@/lib/integrations";
import { teamMemberById } from "@/lib/model";
import { useDeployState, toggleAgent } from "@/components/agents/deploy-store";

const statusTone: Record<WorkerStatus, "good" | "accent" | "warn" | "default"> = {
  Working: "good",
  Queued: "accent",
  Idle: "warn",
  Offline: "default",
};

// ── Departments · specialists grouped by function. Every department uses the
// one brand green; the category icon carries the identity, not a clashing color.
type Accent = { solid: string; tint: string; text: string; ring: string };

const GREEN: Accent = {
  solid: "bg-accent-500",
  tint: "bg-[var(--accent-tint)]",
  text: "text-accent-700",
  ring: "ring-accent-200",
};

// Job Assistants — one AI per human team specialist (supports the team).
const JOB_ASSISTANT_IDS = ["strategy", "local", "content", "technical-auditor"];

// Core AI Workforce — runs the SEO Manager's process end to end.
const CORE_DEPARTMENTS: { id: string; name: string; desc: string; icon: LucideIcon; accent: Accent; ids: string[] }[] = [
  {
    id: "research",
    name: "Research & Discovery",
    desc: "Understand the business, the market and the demand",
    icon: Telescope,
    accent: GREEN,
    ids: ["discovery", "research", "intent", "competitive"],
  },
  {
    id: "planning",
    name: "Diagnosis & Planning",
    desc: "Decide what to fix first and assemble the plan",
    icon: Stethoscope,
    accent: GREEN,
    ids: ["diagnosis", "brief", "playbook"],
  },
  {
    id: "technical",
    name: "Technical Build",
    desc: "Structured data and internal-link structure",
    icon: Wrench,
    accent: GREEN,
    ids: ["schema", "internal-linking"],
  },
  {
    id: "delivery",
    name: "Quality & Delivery",
    desc: "Verify the work and report the results",
    icon: ShieldCheck,
    accent: GREEN,
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
      {/* ── Manager · the Orchestrator runs the floor ───────────────────────── */}
      <section className="reveal overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-card">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">{orchestrator.name}</h2>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-[var(--ok-tint)] px-2 py-0.5 text-2xs font-semibold text-[#157552]">
            <StatusDot tone="good" pulse /> Running
          </span>
          <span className="rounded-md bg-[var(--surface-3)] px-2 py-0.5 text-2xs font-semibold text-[var(--ink-soft)]">
            {deployedCount} of {agents.length} deployed
          </span>
        </div>
        <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">{orchestrator.role}</p>
        <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
          Turn a specialist on to deploy its skills and tool access. The Orchestrator routes each piece of the project brief to the worker whose <span className="font-medium text-[var(--ink-soft)]">skills and access</span> fit.
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
        <StatTile label="Specialists deployed" value={`${deployedCount}/${agents.length}`} sub="of the full roster" />
        <StatTile label="Working now" value={workingCount} tone="good" sub="active assignments" />
        <StatTile label="Jobs completed today" value={jobsToday} tone="accent" />
        <StatTile label="Avg. performance" value={`${avgPerf}%`} sub="QA pass rate" />
      </StatRow>

      {/* ── Job Assistants — support the human team ─────────────────────────── */}
      <section>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-500 text-white shadow-sm">
            <Users className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold tracking-tight text-[var(--foreground)]">Job Assistants</h3>
            <p className="text-xs text-[var(--muted)]">One AI assistant per team specialist — they support your team&apos;s day-to-day work.</p>
          </div>
          <span className="rounded-md bg-[var(--accent-tint)] px-2 py-1 text-2xs font-bold text-accent-700 ring-1 ring-inset ring-accent-200">
            {JOB_ASSISTANT_IDS.filter((id) => deployed[id]).length}/{JOB_ASSISTANT_IDS.length} deployed
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {JOB_ASSISTANT_IDS.map((id) => agentById[id]).filter(Boolean).map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              accent={GREEN}
              deployed={!!deployed[agent.id]}
              state={workerState(agent.id, !!deployed[agent.id])}
              onToggle={(v) => toggleAgent(agent.id, v)}
            />
          ))}
        </div>
      </section>

      {/* ── Core AI Workforce — runs the SEO Manager's process ──────────────── */}
      <div className="flex items-center gap-3 pt-1">
        <span className="text-2xs font-bold uppercase tracking-[0.1em] text-[var(--faint)]">Core AI Workforce · runs the SEO Manager&apos;s process</span>
        <div className="h-px flex-1 bg-[var(--border)]" />
      </div>
      {CORE_DEPARTMENTS.map((dept) => {
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
  return (
    <Card interactive className={cn("flex flex-col overflow-hidden", !deployed && "opacity-[0.92]")}>
      {/* Department identity bar */}
      <div className={cn("h-1 w-full", deployed ? accent.solid : "bg-[var(--border)]")} />

      {/* Header · identity + deploy toggle */}
      <div className="flex items-start gap-3 p-4 pb-3">
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-[var(--foreground)]">{agent.name}</div>
          <div className="truncate text-xs text-[var(--muted)]">{agent.role}</div>
          {teamMemberById(agentSupervisor[agent.id]) && (
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <span className="rounded bg-[var(--accent-tint)] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.04em] text-accent-700">Job assistant</span>
              <span className="truncate text-2xs text-[var(--muted)]">Assists {teamMemberById(agentSupervisor[agent.id])!.name}</span>
            </div>
          )}
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
