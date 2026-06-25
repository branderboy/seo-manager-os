import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight, Lock } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge, StatusDot } from "@/components/ui/badge";
import { StatTile, StatRow } from "@/components/ui/metric";
import { STAGES } from "@/lib/stages";
import { agents, stageAgents } from "@/lib/agents";
import { featuredInvestigation as inv } from "@/lib/model";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "SEO Pipeline" };

const agentById = Object.fromEntries(agents.map((a) => [a.id, a]));

type Status = "done" | "current" | "upcoming";

function stageProgress(n: number): number {
  if (n < inv.currentStage) return 100;
  if (n === inv.currentStage) return 60; // work in flight
  return 0;
}

export default function WorkflowPage() {
  const total = STAGES.length;
  const done = inv.currentStage - 1;
  const pct = Math.round((done / total) * 100);

  return (
    <>
      <PageHeader
        title="SEO Pipeline"
        description="The nine-stage operating flow for this engagement. Each stage consumes the last one's deliverables and hands its own to the next."
      >
        <Badge variant="outline">{inv.name}</Badge>
      </PageHeader>

      {/* Pipeline health */}
      <StatRow cols={4}>
        <StatTile label="Current stage" value={`${inv.currentStage} / ${total}`} sub={STAGES[inv.currentStage - 1]?.name} />
        <StatTile label="Overall progress" value={`${pct}%`} tone="accent" />
        <StatTile label="Stages complete" value={done} tone="good" />
        <StatTile label="Active workers" value={(stageAgents[STAGES[inv.currentStage - 1]?.slug] ?? []).length} sub="on this stage" />
      </StatRow>

      {/* The flow */}
      <ol className="relative space-y-3">
        {STAGES.map((s, idx) => {
          const status: Status =
            s.n < inv.currentStage ? "done" : s.n === inv.currentStage ? "current" : "upcoming";
          const progress = stageProgress(s.n);
          const workers = (stageAgents[s.slug] ?? []).map((id) => agentById[id]).filter(Boolean);
          const isLast = idx === STAGES.length - 1;

          return (
            <li key={s.slug} className="relative flex gap-4">
              {/* Rail + node */}
              <div className="relative flex flex-col items-center">
                <span
                  className={cn(
                    "z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold tnum shadow-card",
                    status === "done" && "bg-[var(--ok)] text-white",
                    status === "current" && "bg-accent-500 text-white ring-4 ring-accent-100",
                    status === "upcoming" && "border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--faint)]"
                  )}
                >
                  {status === "done" ? <Check className="h-4 w-4" /> : status === "upcoming" ? <Lock className="h-3.5 w-3.5" /> : s.n}
                </span>
                {!isLast && (
                  <span
                    className={cn(
                      "w-px flex-1",
                      status === "done" ? "bg-[var(--ok)]/40" : "bg-[var(--border)]"
                    )}
                  />
                )}
              </div>

              {/* Stage card */}
              <Link
                href={`/${s.slug}`}
                className={cn(
                  "group mb-1 flex-1 rounded-xl border bg-[var(--surface)] p-4 shadow-card transition-all duration-150 hover:border-[var(--border-strong)] hover:shadow-md",
                  status === "current" ? "border-accent-300 ring-1 ring-accent-200" : "border-[var(--border)]",
                  status === "upcoming" && "opacity-80"
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1.5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="eyebrow">Stage {String(s.n).padStart(2, "0")}</span>
                      {status === "current" && (
                        <span className="inline-flex items-center gap-1 text-2xs font-semibold text-accent-600">
                          <StatusDot tone="accent" pulse /> In progress
                        </span>
                      )}
                      {status === "done" && <Badge variant="good">Completed</Badge>}
                    </div>
                    <h3 className="mt-0.5 text-base font-semibold tracking-tight text-[var(--foreground)]">{s.name}</h3>
                    <p className="mt-0.5 text-sm text-[var(--muted)]">{s.does}</p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[var(--faint)] transition-colors group-hover:text-accent-600" />
                </div>

                {/* Progress */}
                {status !== "upcoming" && (
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-3)]">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          status === "done" ? "bg-[var(--ok)]" : "bg-accent-500"
                        )}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="w-9 shrink-0 text-right text-2xs font-semibold tnum text-[var(--muted)]">{progress}%</span>
                  </div>
                )}

                {/* Workers + deliverables */}
                <div className="mt-3 grid gap-3 border-t border-[var(--border)] pt-3 sm:grid-cols-[auto_1fr]">
                  <div>
                    <div className="mb-1 text-2xs font-semibold uppercase tracking-[0.06em] text-[var(--faint)]">
                      Assigned workers
                    </div>
                    {workers.length > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-1.5">
                          {workers.map((w) => {
                            const WIcon = w.icon;
                            return (
                              <span
                                key={w.id}
                                title={w.name}
                                className="flex h-6 w-6 items-center justify-center rounded-md border border-[var(--surface)] bg-[var(--accent-tint)] text-accent-600"
                              >
                                <WIcon className="h-3.5 w-3.5" />
                              </span>
                            );
                          })}
                        </div>
                        <span className="text-xs text-[var(--muted)]">
                          {workers.length === 1 ? workers[0].name : `${workers.length} specialists`}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-[var(--faint)]">—</span>
                    )}
                  </div>
                  <div className="sm:border-l sm:border-[var(--border)] sm:pl-3">
                    <div className="mb-1 text-2xs font-semibold uppercase tracking-[0.06em] text-[var(--faint)]">
                      Deliverables
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {s.outputs.slice(0, 5).map((o) => (
                        <span
                          key={o}
                          className="rounded border border-[var(--border)] bg-[var(--surface-2)] px-1.5 py-0.5 text-2xs text-[var(--ink-soft)]"
                        >
                          {o}
                        </span>
                      ))}
                      {s.outputs.length > 5 && (
                        <span className="px-1 py-0.5 text-2xs text-[var(--faint)]">+{s.outputs.length - 5}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </>
  );
}
