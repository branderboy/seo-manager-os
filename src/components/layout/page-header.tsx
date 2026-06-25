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
    <div className="reveal">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          {(typeof stage === "number" || badge) && (
            <div className="mb-1.5 flex items-center gap-2">
              {typeof stage === "number" && (
                <span className="eyebrow text-signal-ink">
                  Stage {String(stage).padStart(2, "0")}
                </span>
              )}
              {badge && <Badge variant="accent">{badge}</Badge>}
            </div>
          )}
          <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
          {description && (
            <p className="mt-1.5 max-w-[60ch] text-base text-ink-2">{description}</p>
          )}
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
      <StageAgents stage={stage} className="mt-5" />
    </div>
  );
}
