import type { Metadata } from "next";
import {
  Building2,
  Star,
  MoreVertical,
  AlertTriangle,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  Info,
  Zap,
  UserCircle2,
  ClipboardList,
  Send,
} from "lucide-react";

export const metadata: Metadata = { title: "Diagnosis Engine" };

const GEO = [
  9, 8, 7, 6, 8, 11, 14, 8, 6, 4, 3, 5, 9, 12, 7, 4, 2, 2, 3, 6, 10, 6, 3, 1, 1, 2, 5, 9,
  8, 5, 3, 2, 4, 8, 12, 11, 9, 6, 5, 8, 12, 16, 14, 13, 10, 9, 13, 17, 20,
];
const soft = "shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]";

export default function DiagnosisPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-16">
      {/* Entity Header */}
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
              <span className="flex items-center text-emerald-600">
                <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Synced 4m ago
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-lg border border-slate-200 bg-white p-2.5 text-amber-500 shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-200 hover:bg-amber-50">
            <Star className="h-6 w-6 fill-current" />
          </button>
          <button className="rounded-lg border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-50 hover:text-slate-700">
            <MoreVertical className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Alert + Metrics grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Primary Constraint */}
        <div className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-[#fff8e6] p-7 ${soft}`}>
          <div className="absolute left-0 top-0 h-full w-1.5 bg-amber-400" />
          <div>
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-amber-700">
                <AlertTriangle className="h-5 w-5 text-amber-500" /> Primary Constraint
              </div>
              <span className="rounded border border-amber-300 bg-white px-2 py-1 font-mono text-xs font-semibold text-amber-800 shadow-sm">94% CONFIDENCE</span>
            </div>
            <h3 className="mb-3 text-2xl font-bold leading-tight text-slate-900">Review Velocity Anomaly</h3>
            <p className="mb-6 text-base leading-relaxed text-slate-700">
              Market median is <strong>11 reviews/mo</strong>. Current acquisition rate is <strong>3/mo</strong>. Resolving this constraint takes immediate priority before further technical execution.
            </p>
          </div>
          <button className="flex w-full items-center justify-center gap-2 self-start rounded-lg bg-amber-500 px-6 py-3 font-bold text-white shadow transition-all hover:-translate-y-0.5 hover:bg-amber-600 hover:shadow-lg sm:w-auto">
            Deploy Review Playbook <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Baseline Stats */}
        <div className={`flex flex-col justify-center rounded-2xl border border-slate-200/70 bg-white p-8 ${soft}`}>
          <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-400">Current Baseline Stats</h4>
          <div className="grid grid-cols-3 gap-y-4 divide-x divide-slate-100">
            <div className="px-4 text-center">
              <div className="text-[42px] font-black leading-none tracking-tighter text-slate-800">48</div>
              <div className="mt-2 text-sm font-medium uppercase tracking-wide text-slate-500">Vis Score</div>
            </div>
            <div className="px-4 text-center">
              <div className="flex items-center justify-center gap-1 text-[42px] font-black leading-none tracking-tighter text-emerald-500">
                57 <ArrowUp className="-mt-2 h-6 w-6 text-emerald-400" strokeWidth={3} />
              </div>
              <div className="mt-2 text-sm font-medium uppercase tracking-wide text-slate-500">Trust Score</div>
            </div>
            <div className="px-4 text-center">
              <div className="flex items-center justify-center gap-1 text-[42px] font-black leading-none tracking-tighter text-rose-500">
                29 <ArrowDown className="mt-2 h-6 w-6 text-rose-400" strokeWidth={3} />
              </div>
              <div className="mt-2 text-sm font-medium uppercase tracking-wide text-slate-500">AI Share</div>
            </div>
          </div>
        </div>
      </div>

      {/* Record fields + Modeled Outcomes */}
      <div className={`rounded-2xl border border-slate-200/70 bg-white p-8 ${soft}`}>
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-[13px] font-bold uppercase tracking-wide text-slate-500">Pipeline Stage</label>
            <div className="relative">
              <select className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-base font-medium text-slate-800 transition-all focus:border-transparent focus:bg-white focus:ring-2 focus:ring-[#1DA1F2]">
                <option>05. Diagnosis</option>
                <option>06. Playbooks</option>
                <option>07. Project Brief</option>
              </select>
              <ChevronDown className="pointer-events-none absolute inset-y-0 right-4 my-auto h-5 w-5 text-slate-500" />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-[13px] font-bold uppercase tracking-wide text-slate-500">Primary Contact</label>
            <div className="group flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 transition-all hover:border-blue-300 hover:bg-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 shadow-sm">SS</div>
              <div className="text-base font-semibold text-slate-800 transition-colors group-hover:text-[#1DA1F2]">Sarah Smith</div>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-[13px] font-bold uppercase tracking-wide text-slate-500">Target Close Date</label>
            <input type="date" defaultValue="2026-10-24" className="w-full cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-base font-medium text-slate-800 transition-all focus:border-transparent focus:bg-white focus:ring-2 focus:ring-[#1DA1F2]" />
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8">
          <div className="mb-5 flex items-center justify-between">
            <h4 className="text-[13px] font-bold uppercase tracking-widest text-slate-400">Modeled Outcomes (90 Days)</h4>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-800">Projection Active</span>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { label: "Local Pack Share", from: 48, to: 67, color: "text-emerald-600" },
              { label: "Qualified Leads / mo", from: 142, to: 205, color: "text-[#1DA1F2]" },
              { label: "AI Visibility Index", from: 29, to: 55, color: "text-emerald-600" },
            ].map((o) => (
              <div key={o.label} className="flex flex-col justify-center rounded-xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-2 text-sm font-semibold text-slate-600">{o.label}</div>
                <div className="flex items-center gap-3 font-mono text-xl font-bold">
                  <span className="text-slate-400 line-through decoration-slate-300">{o.from}</span>
                  <span className="text-slate-300">→</span>
                  <span className={o.color}>{o.to}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Geo Grid */}
      <div className={`rounded-2xl border border-slate-200/70 bg-white p-8 ${soft}`}>
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Geo Grid Rank Analysis</h3>
            <p className="mt-1 text-base font-medium text-slate-500">
              Keyword: <span className="text-slate-700">&ldquo;HVAC Repair&rdquo;</span> <span className="mx-2">•</span> Radius: <span className="text-slate-700">2mi</span>
            </p>
          </div>
          <div className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm">
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-emerald-400 shadow-inner" /> 1-3</span>
            <span className="ml-2 flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-amber-400 shadow-inner" /> 4-10</span>
            <span className="ml-2 flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-rose-400 shadow-inner" /> 11+</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-10 rounded-xl border border-slate-200 bg-slate-50 p-8 md:flex-row">
          <div className="relative aspect-square w-full max-w-[300px] shrink-0">
            <div className="grid h-full w-full grid-cols-7 grid-rows-7 gap-[2px] rounded-lg border-[3px] border-white bg-slate-300 p-[2px] shadow-lg">
              {GEO.map((v, i) => {
                const cls = v <= 3 ? "bg-emerald-100 text-emerald-800" : v <= 10 ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800";
                return (
                  <div key={i} className={`flex items-center justify-center rounded-sm font-mono text-[13px] font-bold transition-all duration-200 hover:scale-105 hover:shadow-sm ${i === 24 ? "opacity-0" : cls}`}>
                    {i === 24 ? "" : v}
                  </div>
                );
              })}
            </div>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="pin-pulse relative flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-white bg-[#1DA1F2] shadow-lg">
                <div className="h-2.5 w-2.5 rounded-full bg-white" />
                <div className="absolute -bottom-2 h-0 w-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#1DA1F2]" />
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Info className="h-5 w-5 text-[#1DA1F2]" /> Automated Analysis
            </h4>
            <p className="text-base font-medium leading-relaxed text-slate-600">
              Severe rank dropoff outside the immediate center pin directly correlates with the localized review velocity constraint. Surrounding competitors (specifically zip 90211) are out-pacing the client by <strong className="text-slate-800">8 reviews per month</strong> on average.
            </p>
            <button className="mt-6 flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-bold text-[#1DA1F2] shadow-sm transition-all hover:border-[#1DA1F2] hover:shadow">
              View Full Map Details <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className={`overflow-hidden rounded-2xl border border-slate-200/70 bg-white ${soft}`}>
        <div className="border-b border-slate-200 bg-slate-50 px-8 pb-4 pt-6">
          <div className="inline-flex space-x-1 rounded-xl bg-slate-200/60 p-1.5">
            <button className="rounded-lg bg-white px-6 py-2.5 text-sm font-bold text-[#1DA1F2] shadow">Activity Timeline</button>
            <button className="rounded-lg px-6 py-2.5 text-sm font-bold text-slate-500 transition-all hover:bg-slate-300/50 hover:text-slate-800">Workspace Notes</button>
          </div>
        </div>
        <div className="border-b border-slate-100 bg-white p-6 px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-600 shadow-inner">KA</div>
            <div className="relative flex-1">
              <input type="text" placeholder="Log an update or drop a note here..." className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-5 pr-14 text-base placeholder-slate-400 transition-all focus:border-transparent focus:bg-white focus:ring-2 focus:ring-[#1DA1F2]" />
              <button className="absolute bottom-1.5 right-2 top-1.5 flex w-10 items-center justify-center rounded-full bg-[#1DA1F2] text-white shadow-sm transition-colors hover:bg-blue-600">
                <Send className="ml-0.5 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-8 py-4 text-sm">
          <span className="font-bold uppercase tracking-widest text-slate-400">Today</span>
          <button className="flex items-center gap-1 font-semibold text-slate-600 transition-colors hover:text-[#1DA1F2]">All Activity <ChevronDown className="h-4 w-4" /></button>
        </div>
        <div className="divide-y divide-slate-100">
          <div className="group flex cursor-pointer items-start gap-5 px-8 py-5 transition-colors hover:bg-slate-50">
            <div className="mt-1 rounded-full bg-blue-50 p-2 text-[#1DA1F2] transition-colors group-hover:bg-[#1DA1F2] group-hover:text-white">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-base text-slate-700"><span className="font-bold text-slate-900">System</span> automatically queued the Playbook <span className="font-semibold text-[#1DA1F2] hover:underline">&ldquo;Local Review Generation&rdquo;</span></p>
              <div className="mt-1 text-sm font-medium text-slate-400">10:42 AM</div>
            </div>
          </div>
          <div className="group flex cursor-pointer items-start gap-5 px-8 py-5 transition-colors hover:bg-slate-50">
            <div className="mt-1 rounded-full bg-amber-50 p-2 text-amber-500 transition-colors group-hover:bg-amber-500 group-hover:text-white">
              <Zap className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-base text-slate-700"><span className="font-bold text-slate-900">Diagnosis Engine</span> identified root cause: <strong className="rounded bg-amber-50 px-1.5 py-0.5 text-amber-600">Review Velocity Anomaly</strong></p>
              <div className="mt-1 text-sm font-medium text-slate-400">09:15 AM</div>
            </div>
          </div>
          <div className="group flex cursor-pointer items-start gap-5 px-8 py-5 transition-colors hover:bg-slate-50">
            <div className="mt-1 rounded-full bg-emerald-50 p-2 text-emerald-500 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
              <UserCircle2 className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-base text-slate-700"><span className="font-bold text-slate-900">You</span> marked the <span className="font-semibold text-[#1DA1F2] hover:underline">Discovery phase</span> as Complete</p>
              <div className="mt-1 text-sm font-medium text-slate-400">Yesterday, 4:30 PM</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
