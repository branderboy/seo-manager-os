import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Gauge } from "lucide-react";
import { STAGES } from "@/lib/stages";
import { GeoGrid } from "@/components/dashboard/geo-grid";
import { ScoreRing } from "@/components/ui/score-ring";
import { localDashboard as d } from "@/lib/dashboards";
import { strategy } from "@/lib/data";

export const metadata: Metadata = {
  title: "SEO Manager OS",
  description: "The operating system for agency SEO. Diagnosis first, from intake to a client report.",
};

const AUTHOR = "Kawani Ali";
const ROLE = "SEO strategist";
const CONTACT = "kawani@digiwaxx.com";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header with a proper logo */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-700 shadow-border">
            <Gauge className="h-6 w-6 text-white" />
          </span>
          <span className="text-lg font-bold tracking-tight">SEO Manager OS</span>
        </div>
        <Link href="/workflow" className="inline-flex items-center gap-1.5 rounded-lg bg-brand-700 px-4 py-2.5 text-[15px] font-semibold text-white hover:bg-brand-800">
          Open The Demo <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-10 lg:grid-cols-2 lg:py-16">
        <div>
          <div className="text-base font-medium text-slate-500">A Working Prototype by {AUTHOR}, {ROLE}</div>
          <h1 className="mt-4 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            How An Agency Actually Runs SEO.
          </h1>
          <p className="mt-6 max-w-xl text-xl leading-relaxed text-slate-600">
            Find the real constraint. Turn the fix into daily work for the right person. Ship a report the
            client can act on. Diagnosis first, with AEO and GEO built in.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/workflow" className="group inline-flex items-center gap-2 rounded-lg bg-brand-700 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-800">
              Explore The Live Demo <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/clients" className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-200 px-6 py-3 text-base font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50">
              See A Client Workspace
            </Link>
          </div>
        </div>

        {/* Real dashboard fragment */}
        <div className="rounded-2xl bg-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.35)] ring-1 ring-slate-200 transition-transform duration-300 hover:-translate-y-1">
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
                <div className="text-xs text-slate-400">Average rank across the service radius</div>
              </div>
              <div className="flex gap-4">
                {[
                  { label: "Vis", v: d.scores.visibility },
                  { label: "Trust", v: d.scores.trust },
                  { label: "AI", v: d.scores.ai },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col items-center">
                    <ScoreRing value={s.v} size={46} />
                    <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <GeoGrid grid={d.geoGrid} />
          </div>
        </div>
      </section>

      {/* Proof strip */}
      <section className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-9">
          <div className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Modeled Outcome For The Northwind Engagement
          </div>
          <div className="mt-5 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {strategy.expectedOutcomes.map((o) => (
              <div key={o.metric}>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-slate-400">{o.from}</span>
                  <ArrowRight className="h-5 w-5 text-slate-300" />
                  <span className="text-3xl font-bold tracking-tight text-brand-700">{o.to}</span>
                </div>
                <div className="mt-1.5 text-sm text-slate-500">{o.metric}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The method */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="text-3xl font-bold tracking-tight">Nine Stages, One Pipeline.</h2>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-slate-500">
          Each stage uses the previous stage&apos;s output and produces its own. Every task traces back to a diagnosis.
        </p>
        <ol className="mt-8 grid gap-x-10 gap-y-3 sm:grid-cols-2">
          {STAGES.map((s) => (
            <li key={s.slug} className="flex items-baseline gap-4 border-b border-slate-100 py-3">
              <span className="w-6 shrink-0 text-right text-base font-bold tabular-nums text-brand-700">{s.n}</span>
              <span className="text-base font-semibold text-slate-900">{s.name}</span>
              <span className="ml-auto text-right text-sm text-slate-500">{s.does}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA + footer */}
      <section className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-12 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">See It Run End To End.</h2>
            <p className="mt-2 text-lg text-slate-500">Designed and built by {AUTHOR}, {ROLE}.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/workflow" className="inline-flex items-center gap-2 rounded-lg bg-brand-700 px-6 py-3 text-base font-semibold text-white hover:bg-brand-800">
              Open The Demo <ArrowRight className="h-5 w-5" />
            </Link>
            <a href={`mailto:${CONTACT}`} className="inline-flex items-center rounded-lg border-2 border-slate-200 px-6 py-3 text-base font-semibold text-slate-700 hover:bg-white">
              Contact
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
