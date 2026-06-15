import * as React from "react";
import { Badge } from "@/components/ui/badge";

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
    <div className="flex flex-wrap items-start justify-between gap-4 pb-2">
      <div className="max-w-2xl">
        <div className="mb-2 flex items-center gap-2">
          {typeof stage === "number" && (
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-600">
              Stage {stage}
            </span>
          )}
          {badge && <Badge variant="accent">{badge}</Badge>}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-[15px] leading-relaxed text-slate-500">
            {description}
          </p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
