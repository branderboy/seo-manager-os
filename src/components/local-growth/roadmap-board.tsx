"use client";

import * as React from "react";
import { CheckCircle2, Clock3, LayoutGrid, List, LockKeyhole, Rows3, Sparkles } from "lucide-react";
import { demoCampaigns, roadmapInitiatives } from "@/lib/local-growth/demo-data";
import type { RoadmapInitiative, Status } from "@/lib/local-growth/types";
import { statusLabel } from "@/lib/local-growth/types";

const columns: { status: Status; label: string }[] = [
  { status: "planned", label: "Planned" },
  { status: "in_progress", label: "In progress" },
  { status: "waiting_on_client", label: "Waiting on client" },
  { status: "completed", label: "Completed" },
];

export function RoadmapBoard() {
  const [view, setView] = React.useState<"board" | "timeline" | "list">("board");
  const [campaign, setCampaign] = React.useState("all");
  const [rows, setRows] = React.useState(roadmapInitiatives);
  const visible = rows.filter((row) => campaign === "all" || row.campaignId === campaign);

  function approve(id: string) {
    setRows((current) => current.map((row) => row.id === id ? { ...row, humanApproved: true } : row));
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">Strategy roadmaps</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">From finding to approved execution</h1><p className="mt-2 text-sm text-slate-600">30-day, 90-day, six-month and twelve-month initiatives can share the same typed initiative model.</p></div>
        <div className="flex flex-wrap gap-2"><select aria-label="Filter roadmap by campaign" value={campaign} onChange={(event) => setCampaign(event.target.value)} className="h-10 rounded-lg border border-[var(--border)] bg-white px-3 text-sm"><option value="all">All campaigns</option>{demoCampaigns.map((item) => <option key={item.id} value={item.id}>{item.clientName}</option>)}</select><ViewButton active={view === "board"} onClick={() => setView("board")} icon={<LayoutGrid className="h-4 w-4" />} label="Board" /><ViewButton active={view === "timeline"} onClick={() => setView("timeline")} icon={<Rows3 className="h-4 w-4" />} label="Timeline" /><ViewButton active={view === "list"} onClick={() => setView("list")} icon={<List className="h-4 w-4" />} label="List" /></div>
      </header>

      <div className="grid gap-3 sm:grid-cols-4"><Horizon label="First 30 days" value={visible.filter((row) => withinDays(row, 30)).length} /><Horizon label="90 days" value={visible.length} active /><Horizon label="Six months" value={0} muted /><Horizon label="Twelve months" value={0} muted /></div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900"><div className="flex items-start gap-2"><Sparkles className="mt-0.5 h-4 w-4 shrink-0" /><p><b>AI strategy is draft-only.</b> Generated initiatives remain internal until a human strategist approves them. Client-facing publication should enforce the same `human_approved` gate in Supabase.</p></div></div>

      {view === "board" && <Board rows={visible} approve={approve} />}
      {view === "timeline" && <Timeline rows={visible} approve={approve} />}
      {view === "list" && <RoadmapList rows={visible} approve={approve} />}
    </div>
  );
}

function Board({ rows, approve }: { rows: RoadmapInitiative[]; approve: (id: string) => void }) {
  return <div className="grid gap-4 xl:grid-cols-4">{columns.map((column) => <section key={column.status} className="rounded-2xl bg-slate-100/70 p-3"><div className="mb-3 flex items-center justify-between px-1"><h2 className="text-sm font-semibold text-slate-800">{column.label}</h2><span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-500">{rows.filter((row) => row.status === column.status).length}</span></div><div className="space-y-3">{rows.filter((row) => row.status === column.status).map((row) => <InitiativeCard key={row.id} row={row} approve={approve} />)}{rows.filter((row) => row.status === column.status).length === 0 && <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 p-5 text-center text-xs text-slate-500">No initiatives</div>}</div></section>)}</div>;
}

function Timeline({ rows, approve }: { rows: RoadmapInitiative[]; approve: (id: string) => void }) {
  return <section className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-card)]"><div className="grid min-w-[800px] grid-cols-[250px_repeat(4,1fr)] border-b border-[var(--border)] pb-2 text-xs font-semibold uppercase tracking-wide text-slate-500"><div>Initiative</div><div>Sep</div><div>Oct</div><div>Nov</div><div>Q4+</div></div><div className="overflow-x-auto">{rows.map((row, index) => <div key={row.id} className="grid min-w-[800px] grid-cols-[250px_repeat(4,1fr)] items-center border-b border-[var(--border)] py-3 last:border-0"><div className="pr-4"><div className="text-sm font-semibold text-slate-800">{row.name}</div><div className="mt-1 text-xs text-slate-500">{row.owner} · {row.type.replace("_", " ")}</div>{!row.humanApproved && <button onClick={() => approve(row.id)} className="mt-1 text-[11px] font-semibold text-amber-700">Approve draft</button>}</div><div className="col-span-4 relative h-8 rounded-lg bg-slate-50"><div className="absolute inset-y-1 rounded-md bg-emerald-100 px-2 text-xs font-semibold leading-6 text-emerald-800" style={{ left: `${Math.min(60, index * 10)}px`, width: `${Math.max(80, 150 - index * 8)}px` }}>{row.startDate} → {row.endDate}</div></div></div>)}</div></section>;
}

function RoadmapList({ rows, approve }: { rows: RoadmapInitiative[]; approve: (id: string) => void }) {
  return <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow-card)]"><table className="w-full min-w-[1000px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Initiative</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Priority</th><th className="px-4 py-3">Owner</th><th className="px-4 py-3">Dates</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Approval</th></tr></thead><tbody className="divide-y divide-[var(--border)]">{rows.map((row) => <tr key={row.id}><td className="px-4 py-4"><div className="font-semibold text-slate-900">{row.name}</div><div className="mt-1 max-w-md text-xs text-slate-500">{row.clientExplanation}</div></td><td className="px-4 py-4 text-slate-600">{row.type.replace("_", " ")}</td><td className="px-4 py-4 font-semibold text-slate-800">{row.priorityScore}</td><td className="px-4 py-4 text-slate-600">{row.owner}</td><td className="px-4 py-4 text-slate-600">{row.startDate}<br />{row.endDate}</td><td className="px-4 py-4 text-slate-700">{statusLabel[row.status]}</td><td className="px-4 py-4">{row.humanApproved ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" />Approved</span> : <button onClick={() => approve(row.id)} className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700"><LockKeyhole className="h-3.5 w-3.5" />Approve draft</button>}</td></tr>)}</tbody></table></div>;
}

function InitiativeCard({ row, approve }: { row: RoadmapInitiative; approve: (id: string) => void }) { const campaign = demoCampaigns.find((item) => item.id === row.campaignId); return <article className="rounded-xl border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-card)]"><div className="flex items-start justify-between gap-2"><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase text-slate-600">{row.type.replace("_", " ")}</span><span className="text-xs font-semibold text-slate-700">{row.priorityScore}</span></div><h3 className="mt-3 text-sm font-semibold leading-5 text-slate-900">{row.name}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{campaign?.clientName}</p><div className="mt-3 flex items-center justify-between text-xs text-slate-500"><span>{row.owner}</span><span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{row.endDate}</span></div><div className="mt-3 border-t border-[var(--border)] pt-3">{row.humanApproved ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" />Human approved</span> : <button onClick={() => approve(row.id)} className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700"><LockKeyhole className="h-3.5 w-3.5" />Approve before client share</button>}</div></article>; }
function ViewButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) { return <button onClick={onClick} className={`inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-semibold ${active ? "border-slate-900 bg-slate-900 text-white" : "border-[var(--border)] bg-white text-slate-600"}`}>{icon}{label}</button>; }
function Horizon({ label, value, active, muted }: { label: string; value: number; active?: boolean; muted?: boolean }) { return <div className={`rounded-xl border p-4 ${active ? "border-emerald-300 bg-emerald-50" : "border-[var(--border)] bg-white"} ${muted ? "bg-[var(--surface-2)]" : ""}`}><div className="text-xs text-slate-500">{label}</div><div className="mt-1 text-xl font-semibold text-slate-900">{value}</div><div className="mt-1 text-[11px] text-slate-500">{muted ? "Ready for future initiatives" : "initiatives"}</div></div>; }
function withinDays(row: RoadmapInitiative, days: number) { const start = new Date("2026-08-30T00:00:00"); const end = new Date(row.endDate); return (end.getTime() - start.getTime()) / 86400000 <= days; }
