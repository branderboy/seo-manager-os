import { ChevronRight, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { contentFlow, flowSummary, type NodeStatus } from "@/lib/dependencies";

const dot: Record<NodeStatus, string> = {
  flowing: "bg-accent-500",
  waiting: "bg-amber-500",
  done: "bg-emerald-500",
};
const nodeBorder: Record<NodeStatus, string> = {
  flowing: "border-accent-200",
  waiting: "border-amber-200",
  done: "border-[var(--border)]",
};
const countTone: Record<NodeStatus, string> = {
  flowing: "bg-accent-50 text-accent-700",
  waiting: "bg-amber-50 text-amber-700",
  done: "bg-slate-100 text-slate-500",
};

export function WorkflowDependencies() {
  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-900">How work flows</h3>
          <p className="mt-1 text-sm text-slate-500">
            {flowSummary.inFlight} items in flight across the content pipeline.
          </p>
        </div>
        {flowSummary.bottleneck && (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700">
            <AlertCircle className="h-4 w-4" />
            Bottleneck: {flowSummary.bottleneck.count} waiting at {flowSummary.bottleneck.stage}
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-stretch gap-x-1.5 gap-y-3">
        {contentFlow.map((n, i) => (
          <div key={n.stage} className="flex items-center gap-1.5">
            <div className={`min-w-[104px] rounded-lg border bg-white px-3 py-2.5 ${nodeBorder[n.status]}`}>
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 shrink-0 rounded-full ${dot[n.status]}`} />
                <span className="text-sm font-medium text-slate-700">{n.stage}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className={`rounded px-1.5 py-0.5 text-xs font-semibold ${countTone[n.status]}`}>
                  {n.count}
                </span>
                {n.note && <span className="text-[11px] text-slate-400">waiting · {n.note}</span>}
              </div>
            </div>
            {i < contentFlow.length - 1 && (
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-[var(--border)] pt-3 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent-500" /> Flowing</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /> Waiting</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Clear</span>
      </div>
    </Card>
  );
}
