"use client";

import * as React from "react";
import { Check, Flame, Mail, Clock, Bell, Send, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ImpactBadge } from "@/components/ui/status-badge";
import { dailyTasks, taskStats, taskAlerts, taskRoles } from "@/lib/data";
import type { TaskGroup, TaskRole } from "@/lib/data";
import { useTaskStore, isGenerated } from "@/components/tasks/task-store";

const GROUPS: TaskGroup[] = ["Today", "Tomorrow", "This week"];

/** Color per team role so tasks bucket by who owns them at a glance. */
const ROLE_STYLES: Record<TaskRole, string> = {
  "Tech SEO": "bg-blue-50 text-blue-700 ring-blue-200",
  "Content (On-Page)": "bg-violet-50 text-violet-700 ring-violet-200",
  "Citations & Links": "bg-amber-50 text-amber-700 ring-amber-200",
  "Local / GBP": "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

function RoleChip({ role }: { role: TaskRole }) {
  return (
    <span className={cn("inline-flex shrink-0 items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset", ROLE_STYLES[role])}>
      {role}
    </span>
  );
}

export function TaskBoard() {
  const { tasks, toggle } = useTaskStore();
  const [shared, setShared] = React.useState<Record<string, boolean>>({});

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
          icon={<Flame className="h-4 w-4 text-amber-500" />}
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
                          <div className={cn("flex items-center gap-2 text-sm font-medium", t.done ? "text-slate-500 line-through" : "text-slate-800")}>
                            <span className="truncate">{t.name}</span>
                            {isGenerated(t.id) && !t.done && (
                              <span className="shrink-0 rounded-full bg-accent-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-700">
                                New
                              </span>
                            )}
                          </div>
                          <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500">
                            <RoleChip role={t.role} />
                            <span>Due {t.due}</span>
                            <span>·</span>
                            <span className="text-slate-500">{t.source}</span>
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
          {/* Share tasks with the SEO manager's team — bold panel so it stands out */}
          <div className="overflow-hidden rounded-2xl border-2 border-accent-300 shadow-card">
            <div className="bg-accent-500 px-4 py-3.5 text-white">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Users className="h-4 w-4" /> Share with team
              </div>
              <p className="mt-0.5 text-xs text-white/80">Route each role its open tasks under the SEO manager.</p>
            </div>
            <div className="space-y-2.5 bg-white p-3">
              {taskRoles.map(({ role, person, email }) => {
                const open = tasks.filter((t) => t.role === role && !t.done).length;
                const sent = shared[role];
                return (
                  <div key={role} className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3">
                    <div className="min-w-0">
                      <RoleChip role={role} />
                      <div className="mt-1.5 truncate text-sm font-semibold text-slate-800">{person}</div>
                      <div className="truncate text-xs text-slate-500">
                        <span className="font-semibold text-slate-600">{open} open</span> · {email}
                      </div>
                    </div>
                    {sent ? (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                        <Check className="h-4 w-4" /> Sent
                      </span>
                    ) : (
                      <button
                        onClick={() => setShared((s) => ({ ...s, [role]: true }))}
                        disabled={open === 0}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-accent-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-accent-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                      >
                        <Send className="h-3.5 w-3.5" /> Send {open}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

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
                        <span className="text-xs text-slate-500">{r.time}</span>
                      </div>
                      <p className="text-xs text-slate-600">{r.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Live digest preview */}
          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5 text-xs text-slate-500">
              <Mail className="h-3.5 w-3.5" />
              Preview · Morning digest
            </div>
            <div className="p-4">
              <div className="text-xs text-slate-500">To: {taskAlerts.recipient}</div>
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
                      <span className="shrink-0 text-xs text-slate-500">{t.due}</span>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-3 border-t border-[var(--border)] pt-3 text-xs text-slate-500">
                Keep your {taskStats.streakDays}-day streak alive — complete today&apos;s
                tasks before 6:00 PM.
              </div>
            </div>
          </Card>

          <div className="px-1">
            <Progress value={(todayDone / Math.max(1, today.length)) * 100} tone="bg-accent-500" />
            <p className="mt-2 text-center text-xs text-slate-500">
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
      <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</div>
      <div className="mt-0.5 text-xs text-slate-500">{sub}</div>
    </Card>
  );
}
