import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { STAGES } from "@/lib/stages";
import { featuredInvestigation as inv } from "@/lib/model";
import { cn } from "@/lib/utils";
import { WorkflowDependencies } from "@/components/workflow/dependencies";

export const metadata: Metadata = { title: "Workflow" };

export default function WorkflowPage() {
  const total = STAGES.length;
  const done = inv.currentStage - 1;
  const pct = Math.round((done / total) * 100);

  return (
    <>
      <PageHeader
        title="Workflow"
        description="Where this engagement is in the journey. Open any stage to work on it."
      >
        <span className="rounded-full bg-accent-50 px-3 py-1.5 text-sm font-medium text-accent-700">
          {inv.name}
        </span>
      </PageHeader>

      {/* Progress summary */}
      <div className="rounded-2xl bg-white p-5 shadow-border">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-600">
            Stage {inv.currentStage} of {total}
          </span>
          <span className="text-sm font-semibold text-slate-900">{pct}% complete</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-accent-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Dependency flow — work moving through the system */}
      <WorkflowDependencies />

      {/* Journey */}
      <ol className="space-y-2">
        {STAGES.map((s) => {
          const status = s.n < inv.currentStage ? "done" : s.n === inv.currentStage ? "current" : "upcoming";
          const label =
            status === "done" ? "Completed" : status === "current" ? "In progress" : "Not started";
          return (
            <li key={s.slug}>
              <Link
                href={`/${s.slug}`}
                className={cn(
                  "group flex items-center gap-4 rounded-xl bg-white p-4 shadow-border transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-border-hover",
                  status === "current" && "ring-2 ring-accent-300"
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                    status === "done" && "bg-emerald-500 text-white",
                    status === "current" && "bg-accent-500 text-white",
                    status === "upcoming" && "border-2 border-slate-200 text-slate-500"
                  )}
                >
                  {status === "done" ? <Check className="h-4 w-4" /> : s.n}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-slate-900">{s.name}</div>
                  <div
                    className={cn(
                      "text-sm",
                      status === "done" ? "text-emerald-600" : status === "current" ? "text-accent-600" : "text-slate-600"
                    )}
                  >
                    {label}
                  </div>
                </div>
                {status === "current" && (
                  <span className="hidden rounded-full bg-accent-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent-700 sm:inline">
                    You are here
                  </span>
                )}
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-accent-500" />
              </Link>
            </li>
          );
        })}
      </ol>
    </>
  );
}
