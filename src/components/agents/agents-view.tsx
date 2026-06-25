"use client";

import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Section } from "@/components/dashboard/section";
import { cn } from "@/lib/utils";
import { agents, orchestrator, workflow, type Agent, type AgentImpact } from "@/lib/agents";
import { useDeployState, toggleAgent } from "@/components/agents/deploy-store";

// One importance signal per agent — high impact reads first.
const impactDot: Record<AgentImpact, string> = {
  High: "bg-emerald-500",
  Medium: "bg-amber-400",
  Low: "bg-slate-300",
};

// Group order follows the engine.
const PHASES = [
  "Client Interview",
  "Research",
  "Audit",
  "Competitive Insights",
  "Diagnosis",
  "Strategy",
  "Project Brief",
  "Playbooks",
  "Execution",
  "Reporting",
];

export function AgentsView() {
  const deployed = useDeployState();
  const count = agents.filter((a) => deployed[a.id]).length;
  const groups = PHASES.map((phase) => ({ phase, items: agents.filter((a) => a.stage === phase) })).filter(
    (g) => g.items.length > 0
  );

  return (
    <div className="space-y-8">
      {/* Primary: the Orchestrator + run order */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
            <orchestrator.icon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[15px] font-semibold tracking-tight text-slate-900">{orchestrator.name}</h2>
              <span className="rounded-full bg-accent-50 px-2 py-0.5 text-xs font-semibold text-accent-700">
                {count} of {agents.length} deployed
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">{orchestrator.role}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-2">
              {workflow.map((step, i) => (
                <span key={step} className="flex items-center gap-1.5">
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">{step}</span>
                  {i < workflow.length - 1 && <span className="text-slate-300">›</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Specialists, grouped by pipeline phase */}
      {groups.map((g) => (
        <Section key={g.phase} label={g.phase}>
          <Card className="divide-y divide-[var(--border)]">
            {g.items.map((a) => (
              <AgentRow key={a.id} agent={a} active={!!deployed[a.id]} onToggle={(v) => toggleAgent(a.id, v)} />
            ))}
          </Card>
        </Section>
      ))}
    </div>
  );
}

function AgentRow({ agent, active, onToggle }: { agent: Agent; active: boolean; onToggle: (v: boolean) => void }) {
  const Icon = agent.icon;
  return (
    <div className={cn("flex items-center gap-3 px-4 py-3 transition-opacity", !active && "opacity-55")}>
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          active ? "bg-accent-50 text-accent-600" : "bg-slate-100 text-slate-500"
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 shrink-0 rounded-full ${impactDot[agent.effectiveness]}`} title={`${agent.effectiveness} impact`} />
          <span className="truncate text-sm font-semibold text-slate-900">{agent.name}</span>
        </div>
        <p className="truncate text-sm text-slate-500">{agent.role}</p>
      </div>
      <span className="hidden shrink-0 text-xs font-medium text-slate-400 sm:block">{agent.cadence}</span>
      <Switch checked={active} onChange={onToggle} label={`Deploy ${agent.name}`} />
    </div>
  );
}
