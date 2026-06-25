import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { StageAgents } from "@/components/agents/stage-agents";

export function PageHeader({
  stage,
  title,
  description,
  badge,
  children,
}: {
  stage?: number;
  title: string;
  description?: string;
  badge?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="reveal pb-2">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <div className="mb-2 flex items-center gap-2">
            {typeof stage === "number" && (
              <span className="text-xs font-extrabold uppercase tracking-[0.1em] text-accent-600">
                Stage {String(stage).padStart(2, "0")}
              </span>
            )}
            {badge && <Badge variant="accent">{badge}</Badge>}
          </div>
          <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.02em] text-slate-900">{title}</h1>
          {description && (
            <p className="mt-2 max-w-[58ch] text-[15px] leading-relaxed text-slate-600">{description}</p>
          )}
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
      <StageAgents stage={stage} className="mt-4" />
    </div>
  );
}
