import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { lifecycle, workTasks, type Priority, type WorkTask } from "@/lib/work";

const prDot: Record<Priority, string> = { High: "bg-rose-500", Medium: "bg-amber-500", Low: "bg-slate-300" };

/** Every task on its lifecycle step: Fix → Assign → Complete → QA → Deploy → Verify → Close. */
export function TaskLifecycleBoard() {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-max gap-3">
        {lifecycle.map((step) => {
          const items = workTasks.filter((t) => t.step === step);
          return (
            <div key={step} className="w-60 shrink-0">
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="text-sm font-semibold text-slate-700">{step}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((t) => (
                  <TaskChip key={t.id} task={t} />
                ))}
                {items.length === 0 && (
                  <div className="rounded-lg border border-dashed border-[var(--border)] px-3 py-4 text-center text-xs text-slate-400">
                    Nothing here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TaskChip({ task: t }: { task: WorkTask }) {
  const waiting = t.lane.startsWith("Waiting");
  return (
    <Card className="p-3">
      <div className="flex items-start gap-2">
        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${prDot[t.priority]}`} />
        <div className="min-w-0">
          <div className="text-sm font-medium leading-snug text-slate-800">{t.title}</div>
          <div className="mt-1 text-xs text-slate-500">{t.client} · {t.owner}</div>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {waiting && <Badge variant="warn">{t.lane.replace("Waiting on ", "⏳ ")}</Badge>}
            <span className="text-xs text-slate-400">{t.due}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
