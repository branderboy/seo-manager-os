import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight, ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { STAGES } from "@/lib/stages";
import { featuredInvestigation as inv } from "@/lib/model";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Workflow" };

type Status = "done" | "active" | "upcoming";

function statusOf(n: number): Status {
  if (n < inv.currentStage) return "done";
  if (n === inv.currentStage) return "active";
  return "upcoming";
}

export default function WorkflowPage() {
  return (
    <>
      <PageHeader
        title="The Workflow"
        description="Nine stages, one pipeline. Each stage consumes the previous stage's outputs and produces its own — from the Discovery Interview all the way to today's task list."
      >
        <span className="rounded-full bg-accent-50 px-3 py-1.5 text-sm font-medium text-accent-700">
          {inv.name} · Stage {inv.currentStage} of {STAGES.length}
        </span>
      </PageHeader>

      <ol className="relative">
        {STAGES.map((s, i) => {
          const status = statusOf(s.n);
          const last = i === STAGES.length - 1;
          const Icon = s.icon;
          return (
            <li key={s.slug} className="relative flex gap-4 pb-4 last:pb-0">
              {/* Rail: numbered node + connector showing outputs flow downward */}
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ring-4 ring-[var(--surface-2)]",
                    status === "done" && "bg-emerald-500 text-white",
                    status === "active" && "bg-accent-500 text-white",
                    status === "upcoming" && "border border-[var(--border)] bg-white text-slate-400"
                  )}
                >
                  {status === "done" ? <Check className="h-4 w-4" /> : s.n}
                </span>
                {!last && (
                  <div className="mt-1 flex flex-1 flex-col items-center">
                    <span
                      className={cn(
                        "w-px flex-1",
                        status === "done" ? "bg-emerald-300" : "bg-[var(--border)]"
                      )}
                    />
                    {/* Arrow marks the handoff to the next step */}
                    <ChevronDown
                      className={cn(
                        "-my-0.5 h-4 w-4",
                        status === "done" ? "text-emerald-400" : "text-slate-300"
                      )}
                    />
                  </div>
                )}
              </div>

              {/* Stage card */}
              <Link
                href={`/${s.slug}`}
                className={cn(
                  "group mb-0 flex-1 rounded-xl border bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-300 hover:bg-accent-50/30 hover:shadow-card",
                  status === "active" ? "border-accent-300 ring-1 ring-accent-200" : "border-[var(--border)]"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Icon className={cn("h-4 w-4", status === "upcoming" ? "text-slate-400" : "text-accent-500")} />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-900">{s.name}</h3>
                        {status === "active" && (
                          <span className="rounded-full bg-accent-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-700">
                            In progress
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500">{s.does}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-accent-500" />
                </div>

                {/* Outputs — the artifacts this stage hands to the next */}
                <div className="mt-3 pl-[26px]">
                  <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Output
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {s.outputs.map((o) => (
                      <span
                        key={o}
                        className={cn(
                          "rounded-md px-2 py-1 text-xs font-medium",
                          status === "upcoming"
                            ? "bg-slate-50 text-slate-500"
                            : "bg-accent-50 text-accent-700"
                        )}
                      >
                        {o}
                      </span>
                    ))}
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
