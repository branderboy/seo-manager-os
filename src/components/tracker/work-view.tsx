import { CalendarClock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { tasksByLane, deadlines, workTasks, type Priority, type WorkTask } from "@/lib/work";

const prDot: Record<Priority, string> = {
  High: "bg-rose-500",
  Medium: "bg-amber-500",
  Low: "bg-slate-300",
};

const laneAccent: Record<string, string> = {
  Active: "text-accent-600",
  "QA & Deploy": "text-accent-600",
  Done: "text-emerald-600",
};

export function WorkView() {
  const groups = tasksByLane();
  const waiting = workTasks.filter((t) => t.lane.startsWith("Waiting")).length;
  const summary = [
    { label: "Active", value: workTasks.filter((t) => t.lane === "Active").length },
    { label: "Waiting on", value: waiting },
    { label: "QA & Deploy", value: workTasks.filter((t) => t.lane === "QA & Deploy").length },
    { label: "Done", value: workTasks.filter((t) => t.lane === "Done").length },
  ];

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summary.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="text-sm font-medium text-slate-600">{s.label}</div>
            <div className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">{s.value}</div>
          </Card>
        ))}
      </div>

      {/* Lanes + deadlines */}
      <div className="grid gap-5 lg:grid-cols-2">
        {groups.map((g) => (
          <Card key={g.lane}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className={laneAccent[g.lane] ?? "text-slate-700"}>{g.lane}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                  {g.tasks.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-[var(--border)]">
                {g.tasks.map((t) => (
                  <TaskRow key={t.id} task={t} />
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-amber-500" /> Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-[var(--border)]">
              {deadlines.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <div className="truncate font-medium text-slate-800">{t.title}</div>
                    <div className="text-sm text-slate-500">{t.client}</div>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-slate-600">{t.due}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TaskRow({ task: t }: { task: WorkTask }) {
  return (
    <li className="flex items-center justify-between gap-3 py-2.5">
      <div className="flex min-w-0 items-start gap-2.5">
        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${prDot[t.priority]}`} />
        <div className="min-w-0">
          <div className="truncate font-medium text-slate-800">{t.title}</div>
          <div className="text-sm text-slate-500">
            {t.client} · {t.owner}
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Badge variant="outline">{t.step}</Badge>
        <span className="text-sm text-slate-500">{t.due}</span>
      </div>
    </li>
  );
}
