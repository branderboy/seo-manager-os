import { CalendarClock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge, StatusDot } from "@/components/ui/badge";
import { StatTile, StatRow } from "@/components/ui/metric";
import { tasksByLane, deadlines, workTasks, type Priority, type WorkTask } from "@/lib/work";

const prTone: Record<Priority, "bad" | "warn" | "default"> = {
  High: "bad",
  Medium: "warn",
  Low: "default",
};

// Lane header tone · waiting lanes read as amber (parked), Done as green.
function laneTone(lane: string): { dot: "good" | "accent" | "warn" | "default"; count: string } {
  if (lane === "Done") return { dot: "good", count: "text-[var(--ok)]" };
  if (lane.startsWith("Waiting")) return { dot: "warn", count: "text-[var(--warn)]" };
  return { dot: "accent", count: "text-accent-600" };
}

export function WorkView() {
  const groups = tasksByLane();
  const waiting = workTasks.filter((t) => t.lane.startsWith("Waiting")).length;

  return (
    <div className="space-y-5">
      {/* Summary */}
      <StatRow cols={4}>
        <StatTile label="Active" value={workTasks.filter((t) => t.lane === "Active").length} tone="accent" />
        <StatTile label="Waiting on" value={waiting} tone="warn" sub="client / dev / Google" />
        <StatTile label="QA & Deploy" value={workTasks.filter((t) => t.lane === "QA & Deploy").length} />
        <StatTile label="Done this week" value={workTasks.filter((t) => t.lane === "Done").length} tone="good" />
      </StatRow>

      {/* Lanes + deadlines */}
      <div className="grid gap-5 lg:grid-cols-2">
        {groups.map((g) => {
          const tone = laneTone(g.lane);
          return (
            <Card key={g.lane} className="flex flex-col">
              <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <StatusDot tone={tone.dot} />
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">{g.lane}</h3>
                </div>
                <span className={`text-xs font-semibold tnum ${tone.count}`}>{g.tasks.length}</span>
              </div>
              <ul className="divide-y divide-[var(--border)]">
                {g.tasks.map((t) => (
                  <TaskRow key={t.id} task={t} />
                ))}
                {g.tasks.length === 0 && (
                  <li className="px-4 py-6 text-center text-xs text-[var(--faint)]">Nothing here</li>
                )}
              </ul>
            </Card>
          );
        })}

        <Card>
          <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-2.5">
            <CalendarClock className="h-4 w-4 text-[var(--warn)]" />
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Deadlines</h3>
          </div>
          <ul className="divide-y divide-[var(--border)]">
            {deadlines.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-[var(--foreground)]">{t.title}</div>
                  <div className="text-xs text-[var(--muted)]">{t.client}</div>
                </div>
                <span className="shrink-0 text-xs font-medium text-[var(--ink-soft)]">{t.due}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function TaskRow({ task: t }: { task: WorkTask }) {
  return (
    <li className="flex items-center justify-between gap-3 px-4 py-2.5 transition-colors hover:bg-[var(--surface-2)]">
      <div className="flex min-w-0 items-start gap-2.5">
        <StatusDot tone={prTone[t.priority]} className="mt-1.5" />
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-[var(--foreground)]">{t.title}</div>
          <div className="text-xs text-[var(--muted)]">
            {t.client} · {t.owner}
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Badge variant="outline">{t.step}</Badge>
        <span className="text-xs text-[var(--muted)]">{t.due}</span>
      </div>
    </li>
  );
}
