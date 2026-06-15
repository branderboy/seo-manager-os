import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { STAGES } from "@/lib/stages";

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
  const stageDef = typeof stage === "number" ? STAGES.find((s) => s.n === stage) : undefined;
  const Icon = stageDef?.icon;

  return (
    <div className="flex flex-wrap items-start justify-between gap-4 pb-2">
      <div className="flex items-start gap-4">
        {Icon && (
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-500 text-white shadow-soft">
            <Icon className="h-6 w-6" />
          </span>
        )}
        <div className="max-w-2xl">
          <div className="mb-2 flex items-center gap-2">
            {typeof stage === "number" && (
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-600">
                Stage {stage}
              </span>
            )}
            {badge && <Badge variant="accent">{badge}</Badge>}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
          {description && (
            <p className="mt-2 text-[15px] leading-relaxed text-slate-500">{description}</p>
          )}
        </div>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
