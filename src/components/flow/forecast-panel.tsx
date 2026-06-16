"use client";

import { useState } from "react";
import { TrendingUp, RotateCcw } from "lucide-react";

type Horizon = 90 | 180;

const BASE = { share: 48, leads: 142, ai: 29 };
const CLOSE_RATE = 0.22; // qualified lead → job
const JOB_VALUE = 420; // avg $ per job

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

function project(
  l: { reviews: number; content: number; links: number; technical: number; aeo: number },
  horizon: Horizon
) {
  const m = horizon === 180 ? 1.7 : 1;
  const shareDelta = ((l.reviews - 3) * 1.7 + (l.technical / 100) * 7 + l.links * 0.35) * m;
  const share = clamp(Math.round(BASE.share + shareDelta), 0, 95);
  const leadsDelta = shareDelta * 2.4 + (l.content * 7 + l.links * 2.0) * m;
  const leads = Math.round(BASE.leads + leadsDelta);
  const aiDelta = ((l.aeo / 100) * 30 + l.content * 0.7 + l.links * 0.25) * m;
  const ai = clamp(Math.round(BASE.ai + aiDelta), 0, 100);
  const revenue = Math.round(leads * CLOSE_RATE * JOB_VALUE);
  return { share, leads, ai, revenue };
}

const LEVERS: {
  key: "reviews" | "content" | "links" | "technical" | "aeo";
  label: string;
  min: number;
  max: number;
  unit: string;
  constraint?: boolean;
}[] = [
  { key: "reviews", label: "Review velocity", min: 3, max: 40, unit: "/mo", constraint: true },
  { key: "content", label: "Pages published", min: 0, max: 50, unit: "/mo" },
  { key: "links", label: "Referring domains", min: 0, max: 50, unit: "/mo" },
  { key: "technical", label: "Technical fixes", min: 0, max: 100, unit: "%" },
  { key: "aeo", label: "AEO / schema coverage", min: 0, max: 100, unit: "%" },
];

const DEFAULTS = { reviews: 8, content: 4, links: 5, technical: 60, aeo: 40 };
const soft = "shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]";

export function ForecastPanel() {
  const [levers, setLevers] = useState(DEFAULTS);
  const [horizon, setHorizon] = useState<Horizon>(90);

  const out = project(levers, horizon);
  const baseRevenue = Math.round(BASE.leads * CLOSE_RATE * JOB_VALUE);
  const edited =
    horizon !== 90 || (Object.keys(DEFAULTS) as (keyof typeof DEFAULTS)[]).some((k) => levers[k] !== DEFAULTS[k]);

  const metrics = [
    { label: "Local Pack Share", from: `${BASE.share}`, to: `${out.share}`, suffix: "%", color: "text-emerald-600" },
    { label: "Qualified Leads / mo", from: `${BASE.leads}`, to: `${out.leads}`, suffix: "", color: "text-[#1DA1F2]" },
    { label: "AI Visibility Index", from: `${BASE.ai}`, to: `${out.ai}`, suffix: "", color: "text-emerald-600" },
    { label: "Est. Revenue / mo", from: `$${baseRevenue.toLocaleString()}`, to: `$${out.revenue.toLocaleString()}`, suffix: "", color: "text-emerald-600" },
  ];

  return (
    <div className={`rounded-2xl border border-slate-200/70 bg-white p-8 ${soft}`}>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h3 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <TrendingUp className="h-6 w-6 text-[#1DA1F2]" /> Forecast
          </h3>
          <p className="mt-1 text-base font-medium text-slate-500">
            The system predicts this from the diagnosis first — then you can edit the improvements live.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-xl bg-slate-200/60 p-1.5">
            {([90, 180] as Horizon[]).map((h) => (
              <button
                key={h}
                onClick={() => setHorizon(h)}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                  horizon === h ? "bg-white text-[#1DA1F2] shadow" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {h} days
              </button>
            ))}
          </div>
          <button
            onClick={() => { setLevers(DEFAULTS); setHorizon(90); }}
            disabled={!edited}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:border-[#1DA1F2] hover:text-[#1DA1F2] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600"
          >
            <RotateCcw className="h-4 w-4" /> System forecast
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Improvement levers */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-[13px] font-bold uppercase tracking-widest text-slate-400">Improvements</h4>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              {edited ? "Your scenario" : "System recommended"}
            </span>
          </div>
          {LEVERS.map((lv) => (
            <div key={lv.key}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-semibold text-slate-700">
                  {lv.label}
                  {lv.constraint && (
                    <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700 ring-1 ring-inset ring-amber-200">
                      Primary constraint
                    </span>
                  )}
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {levers[lv.key]}
                  <span className="ml-0.5 text-slate-400">{lv.unit}</span>
                </span>
              </div>
              <input
                type="range"
                min={lv.min}
                max={lv.max}
                value={levers[lv.key]}
                onChange={(e) => setLevers((s) => ({ ...s, [lv.key]: Number(e.target.value) }))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#1DA1F2]"
              />
            </div>
          ))}
        </div>

        {/* Projected outcomes */}
        <div>
          <div className="mb-5 flex items-center justify-between">
            <h4 className="text-[13px] font-bold uppercase tracking-widest text-slate-400">
              Projection ({horizon} days)
            </h4>
            <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${edited ? "bg-[#1DA1F2]/10 text-[#1DA1F2]" : "bg-emerald-100 text-emerald-800"}`}>
              {edited ? "Edited" : "System prediction"}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {metrics.map((o) => (
              <div key={o.label} className="flex flex-col justify-center rounded-xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-2 text-sm font-semibold text-slate-600">{o.label}</div>
                <div className="flex items-center gap-2 font-mono text-lg font-bold">
                  <span className="text-slate-400 line-through decoration-slate-300">{o.from}{o.suffix}</span>
                  <span className="text-slate-300">→</span>
                  <span className={o.color}>{o.to}{o.suffix}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs font-medium leading-relaxed text-slate-400">
            The system generates this prediction from the diagnosis first; adjust the levers to model
            your own scenario. The active projection carries into the Project Brief as the
            engagement&apos;s expected outcomes.
          </p>
        </div>
      </div>
    </div>
  );
}
