import Link from "next/link";
import { team, allTasks, teamMemberForOwner, clientById } from "@/lib/model";
import { cn } from "@/lib/utils";

/**
 * Team workload — who's holding what, how loaded they are, and what they're on
 * right now. Built from the real task list so the numbers reconcile with the
 * rest of the app.
 */
export function TeamView() {
  const rows = team.map((m) => {
    const tasks = allTasks.filter((t) => teamMemberForOwner(t.owner)?.id === m.id);
    const active = tasks.filter((t) => t.status !== "Done");
    const inProgress = active.filter((t) => t.status === "In progress");
    const focus = inProgress[0] ?? active[0];
    const focusClient = focus ? clientById(focus.clientId) : undefined;
    const clientCount = new Set(active.map((t) => t.clientId)).size;
    const load = Math.round((active.length / m.capacity) * 100);
    return { m, active: active.length, inProgress: inProgress.length, focus, focusClient, clientCount, load };
  });

  const totalActive = rows.reduce((n, r) => n + r.active, 0);
  const loadTone = (load: number) =>
    load >= 100 ? "bg-[var(--danger)]" : load >= 75 ? "bg-[var(--warn)]" : "bg-accent-500";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm">
        <span className="text-[var(--muted)]">
          <span className="font-semibold text-[var(--foreground)]">{team.length}</span> people
        </span>
        <span className="text-[var(--muted)]">
          <span className="font-semibold text-[var(--foreground)]">{totalActive}</span> active tasks
        </span>
        <span className="text-[var(--muted)]">
          <span className="font-semibold text-[var(--foreground)]">{rows.filter((r) => r.active === 0).length}</span> available
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-card">
        <div className="hidden grid-cols-[1.5fr_1.2fr_auto_auto_1.7fr] gap-4 border-b border-[var(--border)] px-5 py-2.5 text-2xs font-semibold uppercase tracking-[0.06em] text-[var(--faint)] sm:grid">
          <span>Member</span>
          <span>Workload</span>
          <span className="text-right">Active</span>
          <span className="text-right">Clients</span>
          <span>Working on now</span>
        </div>
        <ul className="divide-y divide-[var(--border)]">
          {rows.map(({ m, active, focus, focusClient, clientCount, load }) => (
            <li key={m.id} className="grid grid-cols-1 items-center gap-3 px-5 py-3.5 sm:grid-cols-[1.5fr_1.2fr_auto_auto_1.7fr] sm:gap-4">
              {/* Member */}
              <div className="flex min-w-0 items-center gap-2.5">
                <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-2xs font-bold text-white", m.color)}>
                  {m.initials}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-[var(--foreground)]">{m.name}</div>
                  <div className="truncate text-xs text-[var(--muted)]">{m.role}</div>
                </div>
              </div>

              {/* Workload */}
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-3)]">
                  <div className={cn("h-full rounded-full", loadTone(load))} style={{ width: `${Math.min(100, load)}%` }} />
                </div>
                <span className="w-9 shrink-0 text-right text-2xs font-semibold tnum text-[var(--muted)]">{load}%</span>
              </div>

              {/* Active */}
              <span className="text-left text-sm tnum text-[var(--ink-soft)] sm:text-right">
                <span className="text-[var(--faint)] sm:hidden">Active: </span>{active}/{m.capacity}
              </span>

              {/* Clients */}
              <span className="text-left text-sm tnum text-[var(--ink-soft)] sm:text-right">
                <span className="text-[var(--faint)] sm:hidden">Clients: </span>{clientCount}
              </span>

              {/* Working on now */}
              <div className="min-w-0">
                {focus ? (
                  <>
                    <div className="truncate text-sm font-medium text-[var(--foreground)]">{focus.title}</div>
                    {focusClient && (
                      <Link href={`/clients/${focusClient.id}`} className="truncate text-xs text-[var(--muted)] hover:text-accent-600 hover:underline">
                        {focusClient.name}
                      </Link>
                    )}
                  </>
                ) : (
                  <span className="text-sm text-accent-600">Available for work</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
