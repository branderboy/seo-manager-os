import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { STAGES } from "@/lib/stages";
import { GeoGrid } from "@/components/dashboard/geo-grid";
import { ScoreRing } from "@/components/ui/score-ring";
import { localDashboard as d } from "@/lib/dashboards";
import { strategy } from "@/lib/data";

export const metadata: Metadata = {
  title: "SEO Manager OS — an operating system for agency SEO",
  description: "A diagnosis-first SEO operating system: Discovery → Diagnosis → Playbooks → Daily Tasks → Client Reports.",
};

// Credit — change to your preferred name / contact.
const AUTHOR = "Kawani Ali";
const ROLE = "SEO strategist";
const CONTACT = "kawani@digiwaxx.com";

const DIFF = [
  {
    title: "Diagnosis, not an audit.",
    body: "Every symptom resolves to a ranked root cause — with confidence and the evidence behind it. Northwind's reach wasn't a content problem; it was review velocity at 3/mo against a market median of 11.",
  },
  {
    title: "Made for AI search.",
    body: "AEO and GEO are first-class — entity models, schema and answer-shaped content to get cited in AI Overviews, where most local brands are currently invisible.",
  },
  {
    title: "Strategy that becomes Monday's work.",
    body: "Playbooks expand into tasks routed to the right person — Tech SEO, Content, Citations, Local/GBP — on a daily board with email nudges that keep owners on time.",
  },
  {
    title: "Closes the loop with the client.",
    body: "A performance report you approve, share with the team on Slack, then send to the client — measured against the goals set back in Discovery.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2 font-bold tracking-wide">
          <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-brand-900">
            <span className="h-3 w-3 rounded-sm bg-white" />
          </span>
          <span className="text-sm">SEO MANAGER OS</span>
        </div>
        <Link href="/workflow" className="text-sm font-semibold text-brand-700 hover:text-brand-900">
          Open the demo →
        </Link>
      </header>

      {/* Hero — copy left, real product fragment right */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-12 lg:grid-cols-2 lg:py-20">
        <div>
          <div className="reveal text-sm font-medium text-slate-500">A working prototype, built by {AUTHOR} · {ROLE}</div>
          <h1 className="reveal mt-3 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl" style={{ animationDelay: "60ms" }}>
            How an agency <span className="text-brand-700">actually</span> runs SEO — start to reported result.
          </h1>
          <p className="reveal mt-5 max-w-xl text-lg leading-relaxed text-slate-600" style={{ animationDelay: "120ms" }}>
            Not a rank tracker. A diagnosis-first workflow that finds the real constraint, turns the fix into
            role-routed daily work, and closes the loop with a client-ready report.
          </p>
          <div className="reveal mt-8 flex flex-wrap gap-3" style={{ animationDelay: "180ms" }}>
            <Link href="/workflow" className="group inline-flex items-center gap-1.5 rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800">
              Explore the live demo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/clients" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
              See a client workspace
            </Link>
          </div>
        </div>

        {/* Real dashboard fragment */}
        <div className="reveal rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.35)] transition-transform duration-300 hover:-translate-y-1" style={{ animationDelay: "240ms" }}>
          <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
            <span className="ml-2 text-xs text-slate-400">Local SEO · Northwind Heating &amp; Air</span>
          </div>
          <div className="p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-slate-900">Geo Grid</div>
                <div className="text-xs text-slate-400">Avg. rank across the service radius</div>
              </div>
              <div className="flex gap-4">
                {[
                  { label: "Vis", v: d.scores.visibility },
                  { label: "Trust", v: d.scores.trust },
                  { label: "AI", v: d.scores.ai },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col items-center">
                    <ScoreRing value={s.v} size={44} />
                    <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <GeoGrid grid={d.geoGrid} />
          </div>
        </div>
      </section>

      {/* Real result strip — concrete, not generic */}
      <section className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Modeled outcome for the Northwind engagement
          </div>
          <div className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {strategy.expectedOutcomes.map((o) => (
              <div key={o.metric}>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold tracking-tight text-slate-400">{o.from}</span>
                  <ArrowRight className="h-4 w-4 text-slate-300" />
                  <span className="text-2xl font-semibold tracking-tight text-brand-700">{o.to}</span>
                </div>
                <div className="mt-1 text-xs text-slate-500">{o.metric}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The method — editorial list, not icon cards */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <h2 className="text-2xl font-semibold tracking-tight">Nine stages, one connected pipeline</h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-500">
          Each stage consumes the previous one&apos;s output and produces its own. Nothing is arbitrary — every
          task traces back to a diagnosis.
        </p>
        <ol className="mt-8 divide-y divide-slate-100 border-y border-slate-100">
          {STAGES.map((s) => (
            <li key={s.slug} className="group flex items-baseline gap-5 py-3.5">
              <span className="w-6 shrink-0 text-right text-sm font-semibold tabular-nums text-brand-700">{s.n}</span>
              <span className="w-44 shrink-0 text-sm font-semibold text-slate-900 transition-colors group-hover:text-brand-700">{s.name}</span>
              <span className="text-sm text-slate-500">{s.does}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Why it's different — editorial, no icon tiles */}
      <section className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="text-2xl font-semibold tracking-tight">Built on the thinking, not the dashboards</h2>
          <div className="mt-8 grid gap-x-12 gap-y-8 sm:grid-cols-2">
            {DIFF.map((h) => (
              <div key={h.title} className="border-l-2 border-slate-200 pl-4 transition-colors hover:border-brand-700">
                <h3 className="text-[15px] font-semibold text-slate-900">{h.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + footer */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">See it run end-to-end.</h2>
            <p className="mt-1 text-slate-500">Start at the pipeline, or jump into a client&apos;s workspace.</p>
          </div>
          <Link href="/workflow" className="inline-flex items-center gap-1.5 rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800">
            Open the demo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-100">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center">
          <span>Designed &amp; built by <span className="font-semibold text-slate-700">{AUTHOR}</span>, {ROLE} — a working prototype, not a production product.</span>
          <a href={`mailto:${CONTACT}`} className="font-medium text-brand-700 hover:underline">{CONTACT}</a>
        </div>
      </footer>
    </div>
  );
}
