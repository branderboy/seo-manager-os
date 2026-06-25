import type { Metadata } from "next";
import { Check, X, Clock, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  deployments,
  deploySummary,
  passCount,
  CHECK_LABELS,
  type Deployment,
  type CheckStatus,
  type DeployStatus,
} from "@/lib/deployments";

export const metadata: Metadata = { title: "Deployments" };

const statusBadge: Record<DeployStatus, "good" | "accent" | "bad" | "default"> = {
  Verified: "good",
  Verifying: "accent",
  Failed: "bad",
  Queued: "default",
};

export default function DeploymentsPage() {
  return (
    <>
      <PageHeader
        title="Deployment Verification"
        description="Every deploy is automatically verified — re-crawl, indexation, schema, links, Core Web Vitals and more. Tasks auto-close only when verification passes."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Deployments" value={deploySummary.total} />
        <Stat label="Verified" value={deploySummary.verified} tone="text-emerald-600" />
        <Stat label="Verifying" value={deploySummary.verifying} tone="text-accent-600" />
        <Stat label="Failed" value={deploySummary.failed} tone="text-rose-600" />
      </div>

      <div className="space-y-4">
        {deployments.map((d) => (
          <DeploymentCard key={d.id} deployment={d} />
        ))}
      </div>
    </>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <Card className="p-5">
      <div className="text-sm font-medium text-slate-700">{label}</div>
      <div className={`mt-1 text-3xl font-semibold tracking-tight ${tone ?? "text-slate-900"}`}>{value}</div>
    </Card>
  );
}

function DeploymentCard({ deployment: d }: { deployment: Deployment }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">{d.item}</h3>
            <Badge variant={statusBadge[d.status]}>{d.status}</Badge>
            {d.autoClosed && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" /> Task auto-closed
              </span>
            )}
          </div>
          <div className="mt-0.5 text-sm text-slate-600">
            {d.client} · {d.when}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-sm font-semibold text-slate-700">
            {passCount(d)}/{CHECK_LABELS.length}
          </div>
          <div className="text-[11px] uppercase tracking-wide text-slate-500">checks</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-[var(--border)] pt-4 sm:grid-cols-3 lg:grid-cols-5">
        {CHECK_LABELS.map((label) => (
          <CheckRow key={label} label={label} status={d.checks[label]} />
        ))}
      </div>
    </Card>
  );
}

function CheckRow({ label, status }: { label: string; status: CheckStatus }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {status === "pass" ? (
        <Check className="h-4 w-4 shrink-0 text-emerald-500" />
      ) : status === "fail" ? (
        <X className="h-4 w-4 shrink-0 text-rose-500" />
      ) : (
        <Clock className="h-4 w-4 shrink-0 text-slate-300" />
      )}
      <span className={status === "fail" ? "text-rose-600" : status === "pending" ? "text-slate-500" : "text-slate-700"}>
        {label}
      </span>
    </div>
  );
}
