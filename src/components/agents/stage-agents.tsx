"use client";

import { STAGES } from "@/lib/stages";
import { agents, stageAgents } from "@/lib/agents";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useDeployState, toggleAgent } from "@/components/agents/deploy-store";

/** Deployable agent chips for a pipeline stage · rendered in each stage's header. */
export function StageAgents({ stage, className }: { stage?: number; className?: string }) {
  const deployed = useDeployState();
  if (typeof stage !== "number") return null;

  const slug = STAGES.find((s) => s.n === stage)?.slug;
  const ids = slug ? stageAgents[slug] ?? [] : [];
  if (ids.length === 0) return null;

  const list = ids
    .map((id) => agents.find((a) => a.id === id))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        Agents
      </span>
      {list.map((a) => {
        const on = !!deployed[a.id];
        const Icon = a.icon;
        return (
          <span
            key={a.id}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs transition-colors",
              on
                ? "border-accent-200 bg-accent-50 text-accent-700"
                : "border-[var(--border)] bg-white text-slate-700"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="font-medium">{a.name}</span>
            <Switch checked={on} onChange={(v) => toggleAgent(a.id, v)} label={`Deploy ${a.name}`} />
          </span>
        );
      })}
    </div>
  );
}
