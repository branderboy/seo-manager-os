"use client";

import * as React from "react";
import Link from "next/link";
import { AlertOctagon, ArrowRight, CheckCircle2, ClipboardPlus, ShieldCheck, Sparkles } from "lucide-react";
import { auditFindings, demoCampaigns } from "@/lib/local-growth/demo-data";
import type { AuditFinding } from "@/lib/local-growth/types";
import { statusLabel } from "@/lib/local-growth/types";

const policyWarnings = [
  "Never recommend keyword stuffing in the Google Business Profile business name.",
  "Never recommend fake locations, virtual-office abuse, fake reviews, review gating, or duplicate profiles.",
  "High-risk GBP changes require strategist acknowledgement before they can be marked ready.",
];

export function AuditWorkflow({ gbpOnly = false }: { gbpOnly?: boolean }) {
  const initialRows = gbpOnly ? auditFindings.filter((finding) => finding.auditType === "Google Business Profile") : auditFindings;
  const [findings, setFindings] = React.useState(initialRows);
  const [campaignId, setCampaignId] = React.useState(gbpOnly ? "capital-comfort" : "all");
  const [created, setCreated] = React.useState<{ findingId: string; kind: "initiative" | "task" }[]>([]);

  const visible = findings
    .filter((finding) => campaignId === "all" || finding.campaignId === campaignId)
    .slice()
    .sort((a, b) => priorityScore(b) - priorityScore(a));

  const health = Math.round(100 - (visible.reduce((sum, finding) => sum + severityPenalty(finding), 0) / Math.max(1, visible.length)));

  function acknowledge(id: string) {
    setFindings((rows) => rows.map((row) => row.id === id ? { ...row, riskAcknowledged: true } : row));
  }

  function convert(finding: AuditFinding, kind: "initiative" | "task") {
    if (finding.riskAcknowledgementRequired && !finding.riskAcknowledged) return;
    setCreated((rows) => rows.some((row) => row.findingId === finding.id && row.kind === kind) ? rows : [...rows, { findingId: finding.id, kind }]);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">{gbpOnly ? "Google Business Profile audit" : "Guided audits"}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">{gbpOnly ? "GBP audit · Capital Comfort HVAC" : "Audit findings & recommendations"}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Every finding carries severity, impact, effort, confidence, evidence, ownership, visibility and a direct path into strategy or production.</p>
        </div>
        <div className="flex items-center gap-3">
          {!gbpOnly && <select value={campaignId} onChange={(event) => setCampaignId(event.target.value)} className="h-10 rounded-lg border border-[var(--border)] bg-white px-3 text-sm"><option value="all">All campaigns</option>{demoCampaigns.map((campaign) => <option key={campaign.id} value={campaign.id}>{campaign.clientName}</option>)}</select>}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5"><div className="text-[10px] font-semibold uppercase tracking-wide text-emerald-700">Audit health</div><div className="text-xl font-semibold text-emerald-950">{Math.max(0, health)}%</div></div>
        </div>
      </header>

      {gbpOnly && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" /><div><h2 className="font-semibold text-amber-950">GBP policy guardrails</h2><ul className="mt-2 space-y-1.5 text-sm leading-6 text-amber-900">{policyWarnings.map((warning) => <li key={warning}>• {warning}</li>)}</ul></div></div>
        </section>
      )}

      {!gbpOnly && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Google Business Profile", "Eligibility, categories, services, reviews, access and risk", "/growth/audits/gbp"],
            ["Technical SEO", "Indexing, crawlability, CWV, structured data and rendering", "/growth/technical"],
            ["Citation & NAP", "Master NAP, duplicates, ownership and priority directories", "/growth/citations"],
            ["On-page & conversion", "Intent match, proof, CTAs, internal links and page quality", "/growth/content"],
          ].map(([name, detail, href]) => <Link key={name} href={href} className="rounded-xl border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-card)] hover:border-slate-300"><div className="font-semibold text-slate-900">{name}</div><p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p><div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">Open audit <ArrowRight className="h-3.5 w-3.5" /></div></Link>)}
        </div>
      )}

      <section className="rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow-card)]">
        <div className="border-b border-[var(--border)] p-5">
          <h2 className="text-lg font-semibold text-slate-900">Prioritized recommendations</h2>
          <p className="mt-1 text-sm text-slate-500">Sorted by Impact × Confidence ÷ Effort. The score prioritizes review; it does not publish strategy automatically.</p>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {visible.map((finding) => {
            const campaign = demoCampaigns.find((item) => item.id === finding.campaignId);
            const score = priorityScore(finding);
            const initiativeCreated = created.some((row) => row.findingId === finding.id && row.kind === "initiative");
            const taskCreated = created.some((row) => row.findingId === finding.id && row.kind === "task");
            const locked = !!finding.riskAcknowledgementRequired && !finding.riskAcknowledged;
            return (
              <article key={finding.id} className="p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className={severityClass(finding.severity)}>{finding.severity}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-600">{finding.auditType}</span>
                      <span className="text-slate-400">{campaign?.clientName}</span>
                    </div>
                    <h3 className="mt-2 text-base font-semibold text-slate-950">{finding.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{finding.recommendation}</p>
                    <div className="mt-3 rounded-lg bg-blue-50 p-3"><div className="text-[10px] font-semibold uppercase tracking-wide text-blue-700">Client-facing explanation</div><p className="mt-1 text-sm leading-5 text-blue-900">{finding.clientExplanation}</p></div>
                    {finding.evidence && <div className="mt-3 text-xs leading-5 text-slate-500"><span className="font-semibold text-slate-700">Evidence:</span> {finding.evidence}</div>}
                  </div>

                  <div className="w-full shrink-0 xl:w-[330px]">
                    <div className="grid grid-cols-4 gap-2">
                      <Score label="Impact" value={finding.impact} />
                      <Score label="Confidence" value={finding.confidence} />
                      <Score label="Effort" value={finding.effort} />
                      <Score label="Priority" value={Number(score.toFixed(1))} />
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500"><span>Owner: <b className="text-slate-700">{finding.owner}</b></span><span>Status: <b className="text-slate-700">{statusLabel[finding.status]}</b></span>{finding.dueDate && <span>Due: <b className="text-slate-700">{finding.dueDate}</b></span>}<span>Client: <b className="text-slate-700">{finding.clientVisible ? "Visible" : "Internal"}</b></span></div>

                    {locked && <button onClick={() => acknowledge(finding.id)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900"><AlertOctagon className="h-4 w-4" />Acknowledge high-risk GBP change</button>}

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button disabled={locked || initiativeCreated} onClick={() => convert(finding, "initiative")} className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white disabled:bg-slate-300">{initiativeCreated ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}{initiativeCreated ? "Roadmap draft" : "To roadmap"}</button>
                      <button disabled={locked || taskCreated} onClick={() => convert(finding, "task")} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-slate-700 disabled:text-slate-300">{taskCreated ? <CheckCircle2 className="h-3.5 w-3.5" /> : <ClipboardPlus className="h-3.5 w-3.5" />}{taskCreated ? "Task created" : "Create task"}</button>
                    </div>
                    {(initiativeCreated || taskCreated) && <p className="mt-2 text-[11px] leading-4 text-slate-500">Demo state created. Production writes use the finding ID as the relational source so completion evidence can trace back to the audit.</p>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function priorityScore(finding: AuditFinding) { return (finding.impact * finding.confidence) / Math.max(1, finding.effort); }
function severityPenalty(finding: AuditFinding) { const weight = { low: 7, medium: 14, high: 22, critical: 30 }[finding.severity]; const done = finding.status === "completed" || finding.status === "not_applicable" ? 0 : 1; return weight * done; }
function severityClass(severity: AuditFinding["severity"]) { if (severity === "critical") return "rounded-full bg-red-100 px-2 py-1 font-semibold text-red-800"; if (severity === "high") return "rounded-full bg-amber-100 px-2 py-1 font-semibold text-amber-800"; if (severity === "medium") return "rounded-full bg-blue-50 px-2 py-1 font-semibold text-blue-700"; return "rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-600"; }
function Score({ label, value }: { label: string; value: number }) { return <div className="rounded-lg bg-slate-50 p-2 text-center"><div className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">{label}</div><div className="mt-1 text-base font-semibold text-slate-900">{value}</div></div>; }
