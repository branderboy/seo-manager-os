"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { agents, orchestrator, workflow, type Agent, type AgentImpact } from "@/lib/agents";
import { useDeployState, toggleAgent } from "@/components/agents/deploy-store";

const impactVariant: Record<AgentImpact, "good" | "warn" | "default"> = {
  High: "good",
  Medium: "warn",
  Low: "default",
};

export function AgentsView() {
  const deployed = useDeployState();
  const count = agents.filter((a) => deployed[a.id]).length;

  return (
    <div className="space-y-6">
      {/* Orchestrator hero */}
      <Card className="overflow-hidden border-0">
        <div className="relative bg-gradient-to-br from-accent-600 via-accent-500 to-[#2F3E4D] p-6 text-white">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
                <orchestrator.icon className="h-6 w-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold tracking-tight">{orchestrator.name}</h2>
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold backdrop-blur">
                    {count} / {agents.length} deployed
                  </span>
                </div>
                <p className="mt-1 max-w-xl text-sm text-white/80">{orchestrator.role}</p>
              </div>
            </div>
          </div>

          {/* Run order */}
          <div className="mt-6 flex flex-wrap items-center gap-x-1.5 gap-y-2">
            {workflow.map((step, i) => (
              <span key={step} className="flex items-center gap-1.5">
                <span className="rounded-md bg-white/10 px-2 py-1 text-[11px] font-medium text-white/90 backdrop-blur">
                  {step}
                </span>
                {i < workflow.length - 1 && <ArrowRight className="h-3 w-3 text-white/40" />}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* The store — specialists in pipeline order */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((a, i) => (
          <AgentCard
            key={a.id}
            agent={a}
            step={i + 1}
            active={!!deployed[a.id]}
            onToggle={(v) => toggleAgent(a.id, v)}
          />
        ))}
      </div>
    </div>
  );
}

function AgentCard({
  agent,
  step,
  active,
  onToggle,
}: {
  agent: Agent;
  step: number;
  active: boolean;
  onToggle: (v: boolean) => void;
}) {
  const Icon = agent.icon;
  return (
    <Card
      className={cn(
        "flex flex-col p-5 transition-shadow",
        active && "ring-2 ring-accent-200"
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            active ? "bg-accent-50 text-accent-600" : "bg-slate-100 text-slate-600"
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <Switch checked={active} onChange={onToggle} label={`Deploy ${agent.name}`} />
      </div>

      <div className="mt-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-semibold text-slate-400">
            {String(step).padStart(2, "0")}
          </span>
          <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">{agent.name}</h3>
        </div>
        <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wide text-accent-600">
          {agent.stage}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{agent.role}</p>
      </div>

      <div className="mt-3 space-y-1.5 text-xs text-slate-500">
        <div>
          <span className="font-medium text-slate-600">Inputs:</span> {agent.inputs.join(", ")}
        </div>
        <div>
          <span className="font-medium text-slate-600">Output:</span> {agent.output}
        </div>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-4">
        <Badge variant={impactVariant[agent.effectiveness]}>Impact · {agent.effectiveness}</Badge>
        <Badge variant={agent.shine === "High" ? "accent" : "outline"}>Shine · {agent.shine}</Badge>
        <Badge variant="outline">{agent.cadence}</Badge>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-3">
        <span
          className={cn(
            "inline-flex items-center gap-1 text-xs font-semibold",
            active ? "text-emerald-600" : "text-slate-400"
          )}
        >
          {active && <Check className="h-3.5 w-3.5" />}
          {active ? "Deployed" : "Not deployed"}
        </span>
        <Link href={agent.href} className="text-xs font-medium text-accent-600 hover:text-accent-700">
          Open stage →
        </Link>
      </div>
    </Card>
  );
}
