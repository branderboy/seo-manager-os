import { STAGES } from "@/lib/stages";
import { getIntegration } from "@/lib/integrations";
import { cn } from "@/lib/utils";

/**
 * The connected apps a given stage uses to generate its data, plans and insights.
 * Resolves the stage's app ids against the integration catalog so the chips stay
 * in sync with the Integrations surface.
 */
export function StageApps({ stage, className }: { stage?: number; className?: string }) {
  const s = STAGES.find((x) => x.n === stage);
  if (!s || !s.apps.length) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        Powered by
      </span>
      {s.apps.map((id) => {
        const app = getIntegration(id);
        if (!app) return null;
        return (
          <span
            key={id}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white py-1 pl-1 pr-2.5 text-xs font-medium text-slate-700 shadow-sm"
          >
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white",
                app.color
              )}
            >
              {app.initials}
            </span>
            {app.name}
          </span>
        );
      })}
    </div>
  );
}
