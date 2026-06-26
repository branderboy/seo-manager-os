import * as React from "react";
import { StageAgents } from "@/components/agents/stage-agents";

/**
 * Page header · the screen's anchor. A small stage eyebrow, one strong title,
 * a tight supporting line, and a right-aligned action cluster. Optional
 * `meta` row carries quick facts so the eye gets context before scrolling.
 */
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
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="max-w-2xl">
          {(typeof stage === "number" || badge) && (
            <div className="mb-1.5 flex items-center gap-2">
              {typeof stage === "number" && (
                <span className="inline-flex items-center gap-1.5 rounded bg-[var(--surface-3)] px-1.5 py-0.5 text-2xs font-semibold uppercase tracking-[0.06em] text-[var(--muted)]">
                  <span className="tnum text-accent-600">{String(stage).padStart(2, "0")}</span>
                  <span className="text-[var(--faint)]">/ 09</span>
                  Pipeline stage
                </span>
              )}
              {badge && (
                <span className="text-2xs font-semibold uppercase tracking-[0.06em] text-[var(--muted)]">
                  {badge}
                </span>
              )}
            </div>
          )}
          <h1 className="text-2xl font-semibold leading-tight tracking-[-0.02em] text-[var(--foreground)]">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 max-w-[64ch] text-base leading-relaxed text-[var(--muted)]">
              {description}
            </p>
          )}
        </div>
        {children && (
          <div className="flex flex-wrap items-center gap-2">{children}</div>
        )}
      </div>
      <StageAgents stage={stage} className="mt-4" />
    </div>
  );
}
