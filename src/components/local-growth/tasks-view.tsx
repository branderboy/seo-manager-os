"use client";

import * as React from "react";
import { CalendarDays, CheckCircle2, Clock3, Copy, LayoutGrid, List, UserRound } from "lucide-react";
import { demoCampaigns, tasks as seedTasks } from "@/lib/local-growth/demo-data";
import type { SeoTask, Status } from "@/lib/local-growth/types";
import { statusLabel } from "@/lib/local-growth/types";

const boardColumns: { status: Status; label: string }[] = [
  { status: "not_started", label: "Not started" },
  { status: "planned", label: "Planned" },
  { status: "in_progress", label: "In progress" },
  { status: "waiting_on_client", label: "Waiting on client" },
  { status: "blocked", label: "Blocked" },
  { status: "completed", label: "Completed" },
];

export function TasksView() {
  const [view, setView] = React.useState<"board" | "list" | "calendar">("board");
  const [scope, setScope] = React.useState<"all" | "mine" | "overdue" | "waiting">("all");
  const [rows, setRows] = React.useState(seedTasks);
  const [copied, setCopied] = React.useState<string | null>(null);

  const filtered = rows.filter((task) => {
    if (scope === "mine") return task.owner === "Priya Nair";
    if (scope === "overdue") return task.status !== "completed" && task.dueDate < "2026-08-30";
    if (scope === "waiting") return task.status === "waiting_on_client";
    return true;
  });

  function markDone(id: string) {
    setRows((current) => current.map((row) => row.id === id ? { ...row, status: "completed" as const, completionEvidence: row.completionEvidence || "Completion marked in demo mode; attach proof before QA approval." } : row));
  }

  async function copyUpdate(task: SeoTask) {
    const campaign = demoCampaigns.find((item) => item.id === task.campaignId);
    const text = `${campaign?.clientName ?? "Campaign"}: ${task.title} — ${statusLabel[task.status]}. Owner: ${task.owner}. Due: ${task.dueDate}.${task.dependency ? ` Blocker/dependency: ${task.dependency}.` : ""}`;
    try { await navigator.clipboard.writeText(text); setCopied(task.id); setTimeout(() => setCopied(null), 1500); } catch { setCopied(null); }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">SEO production</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Tasks & team workload</h1><p className="mt-2 text-sm text-slate-600">Production tasks stay connected to campaigns, audit findings, roadmap initiatives, QA and completion evidence.</p></div>
        <div className="flex flex-wrap gap-2"><ViewButton active={view === "board"} onClick={() => setView("board")} icon={<LayoutGrid className="h-4 w-4" />} label="Board" /><ViewButton active={view === "list"} onClick={() => setView("list")} icon={<List className="h-4 w-4" />} label="List" /><ViewButton active={view === "calendar"} onClick={() => setView("calendar")} icon={<CalendarDays className="h-4 w-4" />} label="Calendar" /></div>
      </header>

      <div className="flex flex-wrap gap-2">{(["all", "mine", "overdue", "waiting"] as const).map((item) => <button key={item} onClick={() => setScope(item)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${scope === item ? "bg-slate-950 text-white" : "bg-white text-slate-600 ring-1 ring-[var(--border)]"}`}>{item === "mine" ? "My tasks" : item === "waiting" ? "Waiting on client" : item[0].toUpperCase() + item.slice(1)}</button>)}</div>

      {view === "board" && <Board rows={filtered} markDone={markDone} copyUpdate={copyUpdate} copied={copied} />}
      {view === "list" && <TaskList rows={filtered} markDone={markDone} copyUpdate={copyUpdate} copied={copied} />}
      {view === "calendar" && <Calendar rows={filtered} />}

      <section className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-card)]">
        <h2 className="text-lg font-semibold text-slate-900">Team workload</h2><p className="mt-1 text-sm text-slate-500">Open estimated time by owner from the visible task set.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{["Priya Nair", "Jordan Reyes", "Sam Cole", "Marcus Lee"].map((owner) => { const ownerTasks = filtered.filter((task) => task.owner === owner && task.status !== "completed"); const minutes = ownerTasks.reduce((sum, task) => sum + task.estimatedMinutes, 0); return <div key={owner} className="rounded-xl bg-slate-50 p-4"><div className="flex items-center gap-2 text-sm font-semibold text-slate-800"><UserRound className="h-4 w-4 text-slate-500" />{owner}</div><div className="mt-3 text-2xl font-semibold text-slate-950">{ownerTasks.length}</div><div className="text-xs text-slate-500">open tasks · {(minutes / 60).toFixed(1)} estimated hours</div></div>; })}</div>
      </section>
    </div>
  );
}

function Board({ rows, markDone, copyUpdate, copied }: { rows: SeoTask[]; markDone: (id: string) => void; copyUpdate: (task: SeoTask) => void; copied: string | null }) {
  return <div className="grid gap-3 2xl:grid-cols-6">{boardColumns.map((column) => <section key={column.status} className="rounded-xl bg-slate-100/70 p-2.5"><div className="mb-2 flex items-center justify-between px-1"><span className="text-xs font-semibold text-slate-700">{column.label}</span><span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-slate-500">{rows.filter((row) => row.status === column.status).length}</span></div><div className="space-y-2.5">{rows.filter((row) => row.status === column.status).map((task) => <TaskCard key={task.id} task={task} markDone={markDone} copyUpdate={copyUpdate} copied={copied} />)}{rows.filter((row) => row.status === column.status).length === 0 && <div className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-[11px] text-slate-500">Empty</div>}</div></section>)}</div>;
}

function TaskList({ rows, markDone, copyUpdate, copied }: { rows: SeoTask[]; markDone: (id: string) => void; copyUpdate: (task: SeoTask) => void; copied: string | null }) {
  return <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow-card)]"><table className="w-full min-w-[1050px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Task</th><th className="px-4 py-3">Campaign</th><th className="px-4 py-3">Workstream</th><th className="px-4 py-3">Priority</th><th className="px-4 py-3">Owner</th><th className="px-4 py-3">Due</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr></thead><tbody className="divide-y divide-[var(--border)]">{rows.map((task) => { const campaign = demoCampaigns.find((item) => item.id === task.campaignId); return <tr key={task.id}><td className="px-4 py-4"><div className="font-semibold text-slate-900">{task.title}</div>{task.dependency && <div className="mt-1 max-w-sm text-xs text-amber-700">Dependency: {task.dependency}</div>}</td><td className="px-4 py-4 text-slate-600">{campaign?.clientName}</td><td className="px-4 py-4 text-slate-600">{task.workstream.replace("_", " ")}</td><td className="px-4 py-4"><Priority value={task.priority} /></td><td className="px-4 py-4 text-slate-600">{task.owner}</td><td className="px-4 py-4 text-slate-600">{task.dueDate}</td><td className="px-4 py-4 text-slate-700">{statusLabel[task.status]}</td><td className="px-4 py-4"><div className="flex gap-2"><button onClick={() => copyUpdate(task)} className="rounded-md border border-[var(--border)] p-2 text-slate-500" title="Copy Slack-ready status"><Copy className="h-3.5 w-3.5" /></button>{task.status !== "completed" && <button onClick={() => markDone(task.id)} className="rounded-md border border-[var(--border)] p-2 text-emerald-700" title="Mark complete"><CheckCircle2 className="h-3.5 w-3.5" /></button>} {copied === task.id && <span className="self-center text-[10px] font-semibold text-emerald-700">Copied</span>}</div></td></tr>; })}</tbody></table></div>;
}

function Calendar({ rows }: { rows: SeoTask[] }) { const grouped = Object.entries(rows.reduce<Record<string, SeoTask[]>>((acc, task) => { (acc[task.dueDate] ||= []).push(task); return acc; }, {})).sort(([a], [b]) => a.localeCompare(b)); return <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{grouped.map(([date, dayTasks]) => <section key={date} className="rounded-xl border border-[var(--border)] bg-white p-4"><div className="flex items-center gap-2 text-sm font-semibold text-slate-900"><CalendarDays className="h-4 w-4 text-emerald-600" />{date}</div><div className="mt-3 space-y-2">{dayTasks.map((task) => <div key={task.id} className="rounded-lg bg-slate-50 p-3"><div className="text-sm font-medium text-slate-800">{task.title}</div><div className="mt-1 text-xs text-slate-500">{task.owner} · {statusLabel[task.status]}</div></div>)}</div></section>)}</div>; }

function TaskCard({ task, markDone, copyUpdate, copied }: { task: SeoTask; markDone: (id: string) => void; copyUpdate: (task: SeoTask) => void; copied: string | null }) { const campaign = demoCampaigns.find((item) => item.id === task.campaignId); return <article className="rounded-lg border border-[var(--border)] bg-white p-3 shadow-[var(--shadow-card)]"><div className="flex items-start justify-between gap-2"><Priority value={task.priority} /><span className="text-[10px] text-slate-500">{task.estimatedMinutes}m</span></div><h3 className="mt-2 text-xs font-semibold leading-5 text-slate-900">{task.title}</h3><div className="mt-1 text-[10px] leading-4 text-slate-500">{campaign?.clientName}</div>{task.dependency && <div className="mt-2 rounded-md bg-amber-50 p-2 text-[10px] leading-4 text-amber-800">{task.dependency}</div>}<div className="mt-3 flex items-center justify-between text-[10px] text-slate-500"><span>{task.owner.split(" ")[0]}</span><span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" />{task.dueDate.slice(5)}</span></div><div className="mt-2 flex gap-1.5 border-t border-[var(--border)] pt-2"><button onClick={() => copyUpdate(task)} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-50" title="Copy Slack-ready status"><Copy className="h-3.5 w-3.5" /></button>{task.status !== "completed" && <button onClick={() => markDone(task.id)} className="rounded-md p-1.5 text-emerald-600 hover:bg-emerald-50" title="Mark complete"><CheckCircle2 className="h-3.5 w-3.5" /></button>}{copied === task.id && <span className="self-center text-[9px] font-semibold text-emerald-700">Copied</span>}</div></article>; }
function Priority({ value }: { value: SeoTask["priority"] }) { const cls = value === "critical" ? "bg-red-50 text-red-700" : value === "high" ? "bg-amber-50 text-amber-700" : value === "medium" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-600"; return <span className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase ${cls}`}>{value}</span>; }
function ViewButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) { return <button onClick={onClick} className={`inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-semibold ${active ? "border-slate-950 bg-slate-950 text-white" : "border-[var(--border)] bg-white text-slate-600"}`}>{icon}{label}</button>; }
