import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { countByStep } from "@/lib/work";

/** The lifecycle every task moves through: Fix → Assign → Complete → QA → Deploy → Verify → Close. */
export function TaskLifecycle() {
  const steps = countByStep();
  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Task lifecycle</h3>
      <p className="mt-1 text-sm text-slate-600">
        Every recommendation becomes work and moves through these stages until it&apos;s verified and closed.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-3">
        {steps.map((s, i) => (
          <div key={s.step} className="flex items-center gap-1.5">
            <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-white px-3 py-2">
              <span className="text-sm font-medium text-slate-700">{s.step}</span>
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-50 px-1.5 text-xs font-semibold text-accent-700">
                {s.count}
              </span>
            </div>
            {i < steps.length - 1 && <ChevronRight className="h-4 w-4 text-slate-300" />}
          </div>
        ))}
      </div>
    </Card>
  );
}
