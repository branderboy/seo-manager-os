"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Download,
  ExternalLink,
  FileText,
  Printer,
  RefreshCcw,
  Star,
} from "lucide-react";
import { GeoGrid } from "@/components/dashboard/geo-grid";
import {
  campaignKpis,
  citations,
  clientActions,
  clientRequests,
  contentItems,
  getCampaign,
  getCampaignData,
  latestReviews,
  leadSummaries,
  prioritiesByCampaign,
  rankingSummaries,
  reports,
  reviewSummaries,
  risksByCampaign,
  tasks,
  whatChanged,
  workCompletedTimeline,
} from "@/lib/local-growth/demo-data";
import type { Kpi } from "@/lib/local-growth/types";

export function CampaignDashboard({ campaignId }: { campaignId: string }) {
  const campaign = getCampaign(campaignId);
  // Memoised so the empty-array fallback is not a new reference on every render, which
  // would invalidate the csv memo below on each pass.
  const kpis = useMemo<Kpi[]>(() => campaignKpis[campaign.id] ?? [], [campaign.id]);
  const campaignCitations = getCampaignData(citations, campaign.id);
  const campaignContent = getCampaignData(contentItems, campaign.id);
  const ranking = rankingSummaries.find((row) => row.campaignId === campaign.id);
  const review = reviewSummaries.find((row) => row.campaignId === campaign.id);
  const leads = leadSummaries.find((row) => row.campaignId === campaign.id);
  const report = reports.find((row) => row.campaignId === campaign.id);
  const campaignTasks = getCampaignData(tasks, campaign.id);
  const openRequests = getCampaignData(clientRequests, campaign.id).filter((request) => request.status === "open" || request.status === "overdue");
  const citationAccuracy = campaignCitations.length ? Math.round(campaignCitations.reduce((sum, row) => sum + row.napMatchScore, 0) / campaignCitations.length) : 0;
  const publishedContent = campaignContent.filter((row) => row.status === "published").length;

  const csv = useMemo(() => {
    const rows = [["Metric", "Value", "MoM Change", "Source", "Freshness"]];
    kpis.forEach((kpi) => rows.push([kpi.label, String(kpi.value), kpi.change == null ? "" : `${kpi.change}%`, kpi.freshness?.source ?? "", kpi.freshness?.updatedAt ?? kpi.freshness?.status ?? ""]));
    return rows.map((row) => row.map(csvCell).join(",")).join("\n");
  }, [kpis]);

  const exportHref = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
            <span>{campaign.industry}</span><span>·</span><span>{campaign.market}</span><span>·</span><span className="text-emerald-700">{campaign.status}</span>
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">{campaign.clientName}</h1>
          <p className="mt-2 text-sm text-slate-600">Owner: {campaign.strategist} · Started {campaign.startDate} · {campaign.businessModel.replace("_", " ")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select aria-label="Date range" defaultValue="30" className="h-10 rounded-lg border border-[var(--border)] bg-white px-3 text-sm text-slate-700"><option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="month">This month</option></select>
          <a href={exportHref} download={`${campaign.id}-local-growth.csv`} className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold text-slate-700"><Download className="h-4 w-4" />CSV</a>
          <button onClick={() => window.print()} className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold text-slate-700"><Printer className="h-4 w-4" />Print / PDF</button>
        </div>
      </header>

      <section>
        <div className="mb-3 flex items-center justify-between"><div><h2 className="text-lg font-semibold text-slate-900">Performance</h2><p className="text-sm text-slate-500">Each metric carries its source and freshness state.</p></div></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
          {kpis.map((kpi) => <KpiCard key={kpi.key} kpi={kpi} />)}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel title="What changed this month" subtitle="Strategist-ready explanation, not a raw metric dump.">
          <ul className="space-y-3">{(whatChanged[campaign.id] ?? []).map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />{item}</li>)}</ul>
        </Panel>
        <Panel title="Data freshness" subtitle="Unavailable sources are disclosed instead of silently inferred.">
          <div className="space-y-2.5">{uniqueFreshness(kpis).map((item) => <div key={item.source} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2.5"><div><div className="text-sm font-semibold text-slate-800">{item.source}</div><div className="text-xs text-slate-500">{item.updatedAt ?? item.note ?? "No timestamp"}</div></div><Freshness state={item.status} /></div>)}</div>
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Panel title="Top priorities" subtitle="Impact × confidence ÷ effort drives ordering.">
          <div className="space-y-3">{(prioritiesByCampaign[campaign.id] ?? []).map((item) => <div key={item.title} className="rounded-xl border border-[var(--border)] p-3.5"><div className="flex items-start justify-between gap-3"><div className="text-sm font-semibold text-slate-800">{item.title}</div><span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">{item.status}</span></div><div className="mt-2 flex gap-3 text-xs text-slate-500"><span>Impact {item.impact}/5</span><span>Effort {item.effort}/5</span><span>{item.owner}</span></div></div>)}</div>
        </Panel>
        <Panel title="Needs client action" subtitle={`${openRequests.length} open portal request${openRequests.length === 1 ? "" : "s"}.`}>
          <div className="space-y-3">{(clientActions[campaign.id] ?? []).map((item, index) => <div key={item} className="flex gap-3 rounded-xl bg-amber-50 p-3.5 text-sm text-amber-950"><Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" /><div><div className="font-medium">{item}</div>{openRequests[index] && <div className="mt-1 text-xs text-amber-700">Due {openRequests[index].dueDate} · {openRequests[index].contact}</div>}</div></div>)}</div>
          <Link href="/growth/requests" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">Open client requests <ExternalLink className="h-3.5 w-3.5" /></Link>
        </Panel>
        <Panel title="Risks & blockers" subtitle="Items that can change the plan or reporting confidence.">
          <div className="space-y-3">{(risksByCampaign[campaign.id] ?? []).map((item) => <div key={item} className="flex gap-3 rounded-xl bg-red-50 p-3.5 text-sm leading-5 text-red-900"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" />{item}</div>)}</div>
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Local pack geo-grid" subtitle={ranking ? `${ranking.keyword} · ${ranking.localPackVisibility}% visibility · avg rank ${ranking.averageRank}` : "No snapshot available"}>
          {ranking ? <><GeoGrid grid={ranking.grid} /><div className="mt-4 grid grid-cols-3 gap-3"><MiniStat label="Share of local voice" value={`${ranking.shareOfLocalVoice}%`} /><MiniStat label="Organic rank" value={`#${ranking.organicRank}`} /><MiniStat label="Movement" value={`${ranking.movement > 0 ? "+" : ""}${ranking.movement}`} /></div></> : <Empty>No ranking snapshot.</Empty>}
        </Panel>
        <Panel title="Reputation & reviews" subtitle="Velocity matters alongside total reviews and rating.">
          {review ? <div className="grid gap-3 sm:grid-cols-2"><MiniStat label="Reviews" value={review.count.toLocaleString()} /><MiniStat label="Rating" value={`${review.rating}★`} /><MiniStat label="Reviews / month" value={String(review.monthlyVelocity)} warn={review.monthlyVelocity < review.competitorVelocity} /><MiniStat label="Competitor velocity" value={String(review.competitorVelocity)} /><MiniStat label="Response rate" value={`${review.responseRate}%`} /></div> : <Empty>No review data.</Empty>}
          <div className="mt-4 space-y-2">{latestReviews.filter((item) => item.campaignId === campaign.id).map((item) => <div key={item.reviewer} className="rounded-lg bg-slate-50 p-3"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-slate-800">{item.reviewer}</span><span className="flex items-center gap-1 text-xs text-amber-700"><Star className="h-3.5 w-3.5 fill-current" />{item.rating}</span></div><p className="mt-1 text-xs leading-5 text-slate-600">{item.text}</p><div className="mt-1 text-[11px] text-slate-500">{item.date} · {item.status}</div></div>)}</div>
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Panel title="Citations" subtitle="NAP accuracy vs. master record."><MiniStat label="Average NAP match" value={`${citationAccuracy}%`} warn={citationAccuracy < 90} /><div className="mt-4 space-y-2">{campaignCitations.slice(0, 4).map((row) => <div key={row.id} className="flex items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm"><span className="font-medium text-slate-700">{row.directory}</span><span className={row.napMatchScore === 100 ? "font-semibold text-emerald-700" : "font-semibold text-amber-700"}>{row.napMatchScore}%</span></div>)}</div><Link href="/growth/citations" className="mt-4 inline-block text-sm font-semibold text-emerald-700">Open citation audit</Link></Panel>
        <Panel title="Content pipeline" subtitle={`${publishedContent} published · ${campaignContent.length - publishedContent} active`}><div className="space-y-3">{campaignContent.map((item) => <div key={item.id} className="rounded-xl border border-[var(--border)] p-3"><div className="text-sm font-semibold text-slate-800">{item.title}</div><div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500"><span>{item.type.replaceAll("_", " ")}</span><span>·</span><span>{item.status.replaceAll("_", " ")}</span>{item.qaFlags.length > 0 && <span className="font-semibold text-amber-700">{item.qaFlags.length} QA flag</span>}</div></div>)}</div><Link href="/growth/content" className="mt-4 inline-block text-sm font-semibold text-emerald-700">Open content calendar</Link></Panel>
        <Panel title="Lead funnel" subtitle={leads?.revenueSourceAvailable ? "Revenue shown only where source data supplies it." : "Revenue unavailable — not inferred."}>{leads ? <div className="grid grid-cols-2 gap-3"><MiniStat label="Leads" value={String(leads.leads)} /><MiniStat label="Qualified" value={String(leads.qualified)} /><MiniStat label="Booked" value={String(leads.booked)} /><MiniStat label="Closed" value={String(leads.closed)} />{leads.revenueSourceAvailable && leads.revenue != null ? <MiniStat label="Verified revenue" value={`$${leads.revenue.toLocaleString()}`} /> : <div className="col-span-2 rounded-lg border border-dashed border-slate-300 p-3 text-xs text-slate-500">Revenue source is unavailable. Local Growth OS leaves the value blank rather than estimating it.</div>}</div> : <Empty>No lead data.</Empty>}<Link href="/growth/leads" className="mt-4 inline-block text-sm font-semibold text-emerald-700">Open leads & conversions</Link></Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel title="Work completed" subtitle="Completion evidence should be attached to production tasks."><div className="space-y-3">{workCompletedTimeline.filter((item) => item.campaignId === campaign.id).map((item) => <div key={`${item.date}-${item.title}`} className="flex gap-3"><div className="w-14 shrink-0 text-xs font-semibold text-slate-500">{item.date}</div><div><div className="text-sm font-semibold text-slate-800">{item.title}</div><div className="text-xs text-slate-500">{item.type}</div></div></div>)}</div></Panel>
        <Panel title="Execution queue" subtitle={`${campaignTasks.filter((task) => task.status !== "completed").length} open tasks across local SEO workstreams.`}><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="text-xs uppercase tracking-wide text-slate-500"><tr><th className="pb-2">Task</th><th className="pb-2">Owner</th><th className="pb-2">Due</th><th className="pb-2">Status</th></tr></thead><tbody className="divide-y divide-[var(--border)]">{campaignTasks.map((task) => <tr key={task.id}><td className="py-3 pr-3 font-medium text-slate-800">{task.title}</td><td className="py-3 pr-3 text-slate-600">{task.owner}</td><td className="py-3 pr-3 text-slate-600">{task.dueDate}</td><td className="py-3"><span className={task.status === "blocked" ? "text-red-700" : task.status === "waiting_on_client" ? "text-amber-700" : task.status === "completed" ? "text-emerald-700" : "text-blue-700"}>{task.status.replaceAll("_", " ")}</span></td></tr>)}</tbody></table></div><Link href="/growth/tasks" className="mt-4 inline-block text-sm font-semibold text-emerald-700">Open task board</Link></Panel>
      </div>

      {report && <section className="rounded-2xl border border-slate-800 bg-[#15181e] p-6 text-white shadow-[var(--shadow-card)]"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.1em] text-emerald-400">Latest monthly report · {report.period}</p><h2 className="mt-1 text-xl font-semibold">{report.publishStatus === "published" ? "Client report is published" : "Report is still in internal workflow"}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-white/70">{report.executiveSummary}</p></div><Link href="/growth/reports" className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-950"><FileText className="h-4 w-4" />Open report</Link></div></section>}
    </div>
  );
}

function KpiCard({ kpi }: { kpi: Kpi }) {
  const value = formatValue(kpi);
  return <div className="rounded-xl border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-card)]"><div className="flex items-start justify-between gap-2"><div className="text-xs font-medium text-slate-500">{kpi.label}</div><Freshness state={kpi.freshness?.status ?? "unavailable"} compact /></div><div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{value}</div><div className="mt-2 flex items-center justify-between gap-2">{kpi.change == null ? <span className="text-xs text-slate-500">No comparison</span> : <span className={`inline-flex items-center gap-1 text-xs font-semibold ${kpi.change >= 0 ? "text-emerald-700" : "text-red-700"}`}>{kpi.change >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}{Math.abs(kpi.change)}% MoM</span>}<span className="text-[10px] text-slate-500">{kpi.freshness?.source}</span></div></div>;
}
function formatValue(kpi: Kpi) { if (kpi.format === "percent") return `${kpi.value}%`; if (kpi.format === "currency") return `$${Number(kpi.value).toLocaleString()}`; if (kpi.format === "rating") return `${kpi.value}★`; return typeof kpi.value === "number" ? kpi.value.toLocaleString() : kpi.value; }
function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) { return <section className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-card)]"><div className="mb-4"><h2 className="text-lg font-semibold text-slate-900">{title}</h2>{subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}</div>{children}</section>; }
function MiniStat({ label, value, warn }: { label: string; value: string; warn?: boolean }) { return <div className={`rounded-xl p-3 ${warn ? "bg-amber-50" : "bg-slate-50"}`}><div className={`text-xs ${warn ? "text-amber-700" : "text-slate-500"}`}>{label}</div><div className={`mt-1 text-xl font-semibold ${warn ? "text-amber-900" : "text-slate-900"}`}>{value}</div></div>; }
function Freshness({ state, compact }: { state: "fresh" | "stale" | "unavailable"; compact?: boolean }) { const cls = state === "fresh" ? "bg-emerald-50 text-emerald-700" : state === "stale" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500"; return <span className={`inline-flex items-center gap-1 rounded-full font-semibold ${cls} ${compact ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-1 text-[10px]"}`}>{state === "fresh" && <RefreshCcw className="h-2.5 w-2.5" />}{state}</span>; }
function Empty({ children }: { children: React.ReactNode }) { return <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">{children}</div>; }
function csvCell(value: string) { return `"${value.replaceAll('"', '""')}"`; }
function uniqueFreshness(kpis: Kpi[]) { const seen = new Map<string, NonNullable<Kpi["freshness"]>>(); kpis.forEach((kpi) => { if (kpi.freshness && !seen.has(kpi.freshness.source)) seen.set(kpi.freshness.source, kpi.freshness); }); return [...seen.values()]; }
