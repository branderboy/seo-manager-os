"use client";

import * as React from "react";
import { Check, Flame, Mail, Clock, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ImpactBadge } from "@/components/ui/status-badge";
import { dailyTasks, taskStats, taskAlerts } from "@/lib/data";
import type { DailyTask, TaskGroup } from "@/lib/data";

const GROUPS: TaskGroup[] = ["Today", "Tomorrow", "This week"];

export function TaskBoard() {
  const [tasks, setTasks] = React.useState<DailyTask[]>(dailyTasks);

  const toggle = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const today = tasks.filter((t) => t.group === "Today");
  const todayDone = today.filter((t) => t.done).length;
  const openToday = today.filter((t) => !t.done);
  const weekCompleted = taskStats.weekCompleted + (todayDone - dailyTasks.filter((t) => t.group === "Today" && t.done).length);

  return (
    <div className="space-y-6">
      {/* Stat row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Clock className="h-4 w-4" />}
          label="Due today"
          value={`${todayDone}/${today.length}`}
          sub={`${openToday.length} still open`}
        />
        <StatCard
          icon={<Flame className="h-4 w-4 text-orange-500" />}
          label="Current streak"
          value={`${taskStats.streakDays} days`}
          sub="On-time completion"
        />
        <StatCard
          icon={<Check className="h-4 w-4 text-emerald-500" />}
          label="This week"
          value={`${weekCompleted}/${taskStats.weekTarget}`}
          sub="Tasks completed"
        />
        <StatCard
          icon={<Mail className="h-4 w-4 text-accent-500" />}
          label="Next email digest"
          value={taskAlerts.digestTime}
          sub={`to ${taskAlerts.recipient}`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Task lists */}
        <div className="space-y-6">
          {GROUPS.map((g) => {
            const items = tasks.filter((t) => t.group === g);
            if (!items.length) return null;
            return (
              <Card key={g}>
                <CardHeader>
                  <CardTitle>{g}</CardTitle>
                  <CardDescription>
                    {items.filter((t) => t.done).length} of {items.length} done
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="divide-y divide-[var(--border)]">
                    {items.map((t) => (
                      <li key={t.id} className="flex items-start gap-3 py-3">
                        <button
                          onClick={() => toggle(t.id)}
                          className={cn(
                            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                            t.done
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : "border-slate-300 hover:border-accent-400"
                          )}
                          aria-label={t.done ? "Mark incomplete" : "Mark complete"}
                        >
                          {t.done && <Check className="h-3.5 w-3.5" />}
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className={cn("text-sm font-medium", t.done ? "text-slate-400 line-through" : "text-slate-800")}>
                            {t.name}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                            <span>{t.owner}</span>
                            <span>·</span>
                            <span>Due {t.due}</span>
                            <span>·</span>
                            <span className="text-slate-400">{t.source}</span>
                          </div>
                        </div>
                        <ImpactBadge impact={t.priority} />
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Email alerts rail */}
        <div className="space-y-6">
          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Email alerts</CardTitle>
              <CardDescription>Automated nudges that keep owners on task.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {taskAlerts.channels.map((c) => (
                  <Badge key={c} variant="accent">{c}</Badge>
                ))}
                <Badge variant="outline">{taskAlerts.cadence}</Badge>
              </div>
              <ul className="space-y-3">
                {taskAlerts.reminders.map((r) => (
                  <li key={r.label} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                      <Bell className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-slate-800">{r.label}</span>
                        <span className="text-xs text-slate-400">{r.time}</span>
                      </div>
                      <p className="text-xs text-slate-500">{r.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Live digest preview */}
          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5 text-xs text-slate-400">
              <Mail className="h-3.5 w-3.5" />
              Preview · Morning digest
            </div>
            <div className="p-4">
              <div className="text-xs text-slate-400">To: {taskAlerts.recipient}</div>
              <div className="mt-1 text-sm font-semibold text-slate-900">
                ☀️ {openToday.length} task{openToday.length === 1 ? "" : "s"} on deck for Northwind today
              </div>
              <div className="mt-3 space-y-2">
                {openToday.length === 0 ? (
                  <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                    🎉 All caught up — nothing due today. Streak safe.
                  </div>
                ) : (
                  openToday.map((t) => (
                    <div key={t.id} className="flex items-center justify-between gap-2 rounded-lg bg-[var(--surface-2)] px-3 py-2">
                      <span className="truncate text-sm text-slate-700">{t.name}</span>
                      <span className="shrink-0 text-xs text-slate-400">{t.due}</span>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-3 border-t border-[var(--border)] pt-3 text-xs text-slate-400">
                Keep your {taskStats.streakDays}-day streak alive — complete today&apos;s
                tasks before 6:00 PM.
              </div>
            </div>
          </Card>

          <div className="px-1">
            <Progress value={(todayDone / Math.max(1, today.length)) * 100} tone="bg-accent-500" />
            <p className="mt-2 text-center text-xs text-slate-400">
              {todayDone}/{today.length} of today&apos;s tasks complete
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</div>
      <div className="mt-0.5 text-xs text-slate-400">{sub}</div>
    </Card>
  );
}
