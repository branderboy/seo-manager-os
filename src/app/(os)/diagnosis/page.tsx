import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  Star,
  MoreVertical,
  AlertTriangle,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  Check,
  Info,
  Zap,
  UserCircle2,
  ClipboardList,
} from "lucide-react";
import { PushToStrategy } from "@/components/flow/push-to-strategy";
import { diagnosis } from "@/lib/data";
import { localDashboard as d } from "@/lib/dashboards";
import { strategy } from "@/lib/data";

export const metadata: Metadata = { title: "Diagnosis" };

const GEO = d.geoGrid.flat();
function geoCell(v: number) {
  if (v <= 3) return "bg-emerald-100 text-emerald-800";
  if (v <= 10) return "bg-amber-100 text-amber-800";
  return "bg-rose-100 text-rose-800";
}

const OUTCOMES = strategy.expectedOutcomes.slice(0, 3);

const ACTIVITY = [
  { tone: "blue", icon: ClipboardList, text: <>System queued the playbook <span className="font-semibold text-accent-600">&ldquo;Local Review Generation&rdquo;</span></>, time: "10:42 AM" },
  { tone: "amber", icon: Zap, text: <>Diagnosis identified root cause: <strong className="rounded bg-amber-50 px-1.5 py-0.5 text-amber-600">{diagnosis.primary.title}</strong></>, time: "09:15 AM" },
  { tone: "emerald", icon: UserCircle2, text: <>You marked the <span className="font-semibold text-accent-600">Discovery phase</span> as complete</>, time: "Yesterday, 4:30 PM" },
];
const toneBox: Record<string, string> = {
  blue: "bg-accent-50 text-accent-600",
  amber: "bg-amber-50 text-amber-500",
  emerald: "bg-emerald-50 text-emerald-500",
};

export default function DiagnosisPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Entity header */}
      <div className="flex flex-col justify-between gap-6 border-b border-slate-200 pb-2 sm:flex-row sm:items-center">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500 shadow-sm">
            <Building2 className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Northwind Heating &amp; Air</h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-base font-medium text-slate-500">
              <span>Local SEO Workspace</span>
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
              <span>$1,200/mo</span>
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
              <span className="flex items-center text-emerald-600"><Check className="mr-1 h-4 w-4" /> Synced 4m ago</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-lg border border-slate-200 bg-white p-2.5 text-amber-500 shadow-sm transition-colors hover:border-amber-200 hover:bg-amber-50">
            <Star className="h-6 w-6 fill-current" />
          </button>
          <button className="rounded-lg border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-700">
            <MoreVertical className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Primary constraint + baseline stats */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-[#fff8e6] p-7 shadow-sm">
          <div className="absolute left-0 top-0 h-full w-1.5 bg-amber-400" />
          <div>
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-amber-700">
                <AlertTriangle className="h-5 w-5 text-amber-500" /> Primary Constraint
              </div>
              <span className="rounded border border-amber-300 bg-white px-2 py-1 font-mono text-xs font-semibold text-amber-800 shadow-sm">
                {diagnosis.primary.confidence}% CONFIDENCE
              </span>
            </div>
            <h3 className="mb-3 text-2xl font-bold leading-tight text-slate-900">{diagnosis.primary.title}</h3>
            <p className="mb-6 text-base leading-relaxed text-slate-700">
              Market median is <strong>11 reviews/mo</strong>. Current acquisition rate is <strong>3/mo</strong>.
              Resolving this constraint takes priority before further technical execution.
            </p>
          </div>
          <Link href="/tools" className="inline-flex w-max items-center gap-2 self-start rounded-lg bg-amber-500 px-6 py-3 font-bold text-white shadow transition-all hover:-translate-y-0.5 hover:bg-amber-600">
            Deploy Review Playbook <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex flex-col justify-center rounded-2xl border border-slate-200/70 bg-white p-8 shadow-soft">
          <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-400">Current Baseline Stats</h4>
          <div className="grid grid-cols-3 gap-y-4 divide-x divide-slate-100">
            <Stat label="Vis Score" value={d.scores.visibility} tone="slate" />
            <Stat label="Trust Score" value={d.scores.trust} tone="up" />
            <Stat label="AI Share" value={d.scores.ai} tone="down" />
          </div>
        </div>
      </div>

      {/* Record fields + modeled outcomes */}
      <div className="rounded-2xl border border-slate-200/70 bg-white p-8 shadow-soft">
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Field label="Pipeline Stage">
            <div className="relative">
              <select className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-base font-medium text-slate-800 transition-all focus:border-transparent focus:bg-white focus:ring-2 focus:ring-accent-500">
                <option>04. Diagnosis</option>
                <option>05. Project Brief</option>
                <option>06. Execution Planner</option>
              </select>
              <ChevronDown className="pointer-events-none absolute inset-y-0 right-3 my-auto h-5 w-5 text-slate-500" />
            </div>
          </Field>
          <Field label="Primary Contact">
            <div className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 transition-all hover:border-accent-300 hover:bg-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-100 text-sm font-bold text-accent-700 shadow-sm">MG</span>
              <span className="text-base font-semibold text-slate-800">Maria Gomez</span>
            </div>
          </Field>
          <Field label="Target Close Date">
            <input type="date" defaultValue="2026-10-24" className="w-full cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-base font-medium text-slate-800 transition-all focus:border-transparent focus:bg-white focus:ring-2 focus:ring-accent-500" />
          </Field>
        </div>

        <div className="border-t border-slate-100 pt-8">
          <div className="mb-5 flex items-center justify-between">
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400">Modeled Outcomes (90 Days)</h4>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-800">Projection Active</span>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {OUTCOMES.map((o, i) => (
              <div key={o.metric} className="flex flex-col justify-center rounded-xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-2 text-sm font-semibold text-slate-600">{o.metric}</div>
                <div className="flex items-center gap-3 font-mono text-xl font-bold">
                  <span className="text-slate-400 line-through decoration-slate-300">{o.from}</span>
                  <span className="text-slate-300">→</span>
                  <span className={i === 1 ? "text-accent-600" : "text-emerald-600"}>{o.to}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Geo grid analysis */}
      <div className="rounded-2xl border border-slate-200/70 bg-white p-8 shadow-soft">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Geo Grid Rank Analysis</h3>
            <p className="mt-1 text-base font-medium text-slate-500">
              Keyword: <span className="text-slate-700">&ldquo;HVAC Repair&rdquo;</span> <span className="mx-2">•</span> Radius: <span className="text-slate-700">2mi</span>
            </p>
          </div>
          <div className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm">
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-emerald-400" /> 1-3</span>
            <span className="ml-2 flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-amber-400" /> 4-10</span>
            <span className="ml-2 flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-rose-400" /> 11+</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-10 rounded-xl border border-slate-200 bg-slate-50 p-8 md:flex-row">
          <div className="relative aspect-square w-full max-w-[300px] shrink-0">
            <div className="grid h-full w-full grid-cols-7 grid-rows-7 gap-[2px] rounded-lg border-[3px] border-white bg-slate-300 p-[2px] shadow-lg">
              {GEO.map((v, i) => (
                <div
                  key={i}
                  title={`Rank: ${v}`}
                  className={`flex items-center justify-center rounded-sm font-mono text-[13px] font-bold transition-transform duration-200 hover:scale-105 ${i === 24 ? "opacity-0" : geoCell(v)}`}
                >
                  {i === 24 ? "" : v}
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="pin-pulse flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-white bg-accent-500 shadow-lg">
                <span className="h-2.5 w-2.5 rounded-full bg-white" />
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Info className="h-5 w-5 text-accent-500" /> Automated Analysis
            </h4>
            <p className="text-base font-medium leading-relaxed text-slate-600">
              Severe rank dropoff outside the immediate center pin correlates directly with the localized review
              velocity constraint. Surrounding competitors are out-pacing the client by
              <strong className="text-slate-800"> 8 reviews per month</strong> on average.
            </p>
          </div>
        </div>
      </div>

      {/* Activity timeline */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-soft">
        <div className="border-b border-slate-200 bg-slate-50 px-8 pb-4 pt-6">
          <div className="inline-flex space-x-1 rounded-xl bg-slate-200/60 p-1.5">
            <button className="rounded-lg bg-white px-6 py-2.5 text-sm font-bold text-accent-600 shadow">Activity Timeline</button>
            <button className="rounded-lg px-6 py-2.5 text-sm font-bold text-slate-500 transition-all hover:bg-slate-300/50 hover:text-slate-800">Workspace Notes</button>
          </div>
        </div>
        <div className="border-b border-slate-100 bg-white p-6 px-8">
          <div className="flex items-center gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-600">KA</span>
            <input
              type="text"
              placeholder="Log an update or drop a note here..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-base placeholder-slate-400 transition-all focus:border-transparent focus:bg-white focus:ring-2 focus:ring-accent-500"
            />
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {ACTIVITY.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} className="flex items-start gap-5 px-8 py-5 transition-colors hover:bg-slate-50">
                <span className={`mt-1 rounded-full p-2 ${toneBox[a.tone]}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="text-base text-slate-700">{a.text}</p>
                  <div className="mt-1 text-sm font-medium text-slate-400">{a.time}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hand off to the next stage */}
      <PushToStrategy />
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: "slate" | "up" | "down" }) {
  const color = tone === "up" ? "text-emerald-500" : tone === "down" ? "text-rose-500" : "text-slate-800";
  return (
    <div className="px-4 text-center">
      <div className={`flex items-center justify-center gap-1 text-[42px] font-black leading-none tracking-tighter ${color}`}>
        {value}
        {tone === "up" && <ArrowUp className="-mt-2 h-6 w-6 text-emerald-400" strokeWidth={3} />}
        {tone === "down" && <ArrowDown className="mt-2 h-6 w-6 text-rose-400" strokeWidth={3} />}
      </div>
      <div className="mt-2 text-sm font-medium uppercase tracking-wide text-slate-500">{label}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-[13px] font-bold uppercase tracking-wide text-slate-500">{label}</label>
      {children}
    </div>
  );
}
