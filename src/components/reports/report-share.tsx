"use client";

import { useState } from "react";
import { Check, Lock, Mail, MessageSquare, UserCheck, Send, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Status = "draft" | "pending" | "approved";

const STATUS_META: Record<Status, { label: string; cls: string }> = {
  draft: { label: "Draft", cls: "bg-slate-100 text-slate-700 ring-slate-200" },
  pending: { label: "Pending approval", cls: "bg-amber-50 text-amber-700 ring-amber-200" },
  approved: { label: "Approved", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
};

export function ReportShare({
  period = "May 2026",
  manager = "Dana Whitfield",
  client = "Northwind Heating & Air",
  slackChannel = "#seo-team",
  clientContact = "marcus@northwindhvac.com",
}: {
  period?: string;
  manager?: string;
  client?: string;
  slackChannel?: string;
  clientContact?: string;
}) {
  const [status, setStatus] = useState<Status>("draft");
  const [sent, setSent] = useState({ slack: false, client: false });
  const approved = status === "approved";
  const meta = STATUS_META[status];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Performance Report</CardTitle>
            <CardDescription>{period} · {client}</CardDescription>
          </div>
          <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset", meta.cls)}>
            {meta.label}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {/* The report artifact */}
        <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
            <FileText className="h-[18px] w-[18px]" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-slate-800">{period} Performance Report.pdf</div>
            <div className="text-xs text-slate-600">Rankings · Traffic · Leads · Calls · AI Visibility · Revenue</div>
          </div>
        </div>

        {/* Step 1 · share internally with the SEO / marketing team */}
        <div className="mt-5">
          <StepLabel n={1} done={sent.slack}>Share with the team</StepLabel>
          <div className="mt-2 pl-8">
            <ShareTarget
              icon={<MessageSquare className="h-4 w-4" />}
              title="Send to Slack"
              detail={`${slackChannel} · SEO & marketing team`}
              done={sent.slack}
              doneLabel={`Posted to ${slackChannel}`}
              onClick={() => setSent((s) => ({ ...s, slack: true }))}
            />
          </div>
        </div>

        {/* Step 2 · manager approval */}
        <div className="mt-5">
          <StepLabel n={2} done={approved}>Manager approval</StepLabel>
          <div className="mt-2 pl-8">
            {status === "draft" && (
              <button
                onClick={() => setStatus("pending")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent-600 px-3 py-2 text-sm font-medium text-white hover:bg-accent-600"
              >
                <Send className="h-4 w-4" /> Send to {manager} for approval
              </button>
            )}
            {status === "pending" && (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-slate-700">Sent to {manager} · awaiting sign-off</span>
                <button
                  onClick={() => setStatus("approved")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-accent-500 px-3 py-1.5 text-sm font-medium text-accent-700 hover:bg-accent-50"
                >
                  <UserCheck className="h-4 w-4" /> Approve as {manager}
                </button>
              </div>
            )}
            {approved && (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                <Check className="h-4 w-4" /> Approved by {manager}
              </span>
            )}
          </div>
        </div>

        {/* Step 3 · send to client, gated on approval */}
        <div className="mt-5">
          <StepLabel n={3} done={sent.client} locked={!approved}>Send to client</StepLabel>
          <div className="mt-2 pl-8">
            <ShareTarget
              icon={<Mail className="h-4 w-4" />}
              title="Email to client"
              detail={clientContact}
              disabled={!approved}
              done={sent.client}
              doneLabel={`Emailed to ${clientContact}`}
              onClick={() => setSent((s) => ({ ...s, client: true }))}
            />
            {!approved && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-600">
                <Lock className="h-3 w-3" /> The client send unlocks once the report is approved.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StepLabel({ n, done, locked, children }: { n: number; done?: boolean; locked?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
          done ? "bg-emerald-500 text-white" : locked ? "border border-[var(--border)] text-slate-300" : "bg-accent-600 text-white"
        )}
      >
        {done ? <Check className="h-3.5 w-3.5" /> : n}
      </span>
      <span className={cn("text-sm font-semibold", locked ? "text-slate-600" : "text-slate-800")}>{children}</span>
    </div>
  );
}

function ShareTarget({
  icon,
  title,
  detail,
  disabled,
  done,
  doneLabel,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  disabled?: boolean;
  done?: boolean;
  doneLabel: string;
  onClick: () => void;
}) {
  if (done) {
    return (
      <div className="flex max-w-sm items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
        <Check className="h-4 w-4 shrink-0" /> {doneLabel}
      </div>
    );
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex w-full max-w-sm items-center gap-3 rounded-xl border p-3 text-left transition-colors",
        disabled
          ? "cursor-not-allowed border-[var(--border)] bg-[var(--surface-2)] opacity-60"
          : "border-[var(--border)] bg-white hover:border-accent-300 hover:bg-accent-50/40"
      )}
    >
      <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", disabled ? "bg-slate-100 text-slate-600" : "bg-accent-50 text-accent-600")}>
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-slate-800">{title}</span>
        <span className="block truncate text-xs text-slate-600">{detail}</span>
      </span>
    </button>
  );
}
