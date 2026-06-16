import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  Lock,
  MapPin,
  TrendingUp,
  Search,
  Zap,
  ClipboardCheck,
  RefreshCcw,
  ChevronRight,
} from "lucide-react";
import { strategy } from "@/lib/data";

export const metadata: Metadata = {
  title: "SEO Manager OS",
  description: "The only dashboard for today's SEO manager. Diagnosis first, from intake to a client report.",
};

const AUTHOR = "Kawani Ali";
const ROLE = "SEO strategist";
const CONTACT = "kawani@digiwaxx.com";

const PIPELINE = [
  { slug: "discovery", label: "01. Interview", name: "Discovery", desc: "Understand the business, goals, and baseline metrics before touching a tool.", tone: "text-blue-600" },
  { slug: "research", label: "02. Data", name: "Data Collection", desc: "Gather comprehensive market, competitor, and technical data.", tone: "text-blue-600" },
  { slug: "investigation", label: "03. Analysis", name: "Gap Analysis", desc: "Sift through the data to identify specific opportunities and underlying issues.", tone: "text-blue-600" },
  { slug: "diagnosis", label: "04. Root Cause", name: "Diagnosis", desc: "Determine the exact constraints holding back performance.", tone: "text-amber-600" },
  { slug: "tools", label: "05. Action", name: "Playbooks", desc: "Select the outcome playbooks that resolve the diagnosis, sequenced into owned work.", tone: "text-amber-600" },
  { slug: "strategy", label: "06. Plan", name: "Project Brief", desc: "Compile the selected playbooks into an executive-ready brief for sign-off.", tone: "text-emerald-600" },
  { slug: "tasks", label: "07. Workflow", name: "Daily Task Engine", desc: "Generate and route today's specific work to the right person, automatically.", tone: "text-emerald-600" },
  { slug: "reports", label: "08. Proof", name: "Reports", desc: "Track empirical results against the original goal and close the loop.", tone: "text-emerald-600" },
];

// 7×7 geo-grid sample (avg rank; center = HQ).
const GEO = [
  9, 8, 7, 6, 8, 11, 14, 8, 6, 4, 3, 5, 9, 12, 7, 4, 2, 2, 3, 6, 10, 6, 3, 1, 1, 2, 5, 9,
  8, 5, 3, 2, 4, 8, 12, 11, 9, 6, 5, 8, 12, 16, 14, 13, 10, 9, 13, 17, 20,
];
function geoCell(v: number) {
  if (v <= 3) return "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200";
  if (v <= 10) return "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200";
  return "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200";
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 antialiased">
      {/* Background grid + glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-grid-lines" />
        <div className="absolute inset-0 bg-radial-glow" />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <span className="text-lg font-bold tracking-tight text-slate-900">SEO MANAGER OS</span>
          <Link href="/workflow" className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
            Open Demo &rarr;
          </Link>
        </div>
      </nav>

      <main className="relative z-10 pb-32 pt-20">
        {/* Hero */}
        <section className="mx-auto mb-24 max-w-5xl px-6 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 font-mono text-xs font-medium text-blue-700">
            <span>SYSTEM v1.0.4</span>
            <span className="h-1 w-1 rounded-full bg-blue-400" />
            <span>STATUS: ONLINE</span>
          </div>

          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-slate-900 md:text-7xl">
            The Only Dashboard for{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Today&apos;s SEO Manager.
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-3xl text-xl font-light leading-relaxed text-slate-600 md:text-2xl">
            Not a rank tracker. A diagnosis-first workflow that finds the real constraint, turns the fix into
            role-routed daily work, and closes the loop with a client-ready report.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/workflow" className="group flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-3.5 font-medium text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-700 sm:w-auto">
              Explore the live demo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/clients" className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-8 py-3.5 font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 sm:w-auto">
              <Eye className="h-4 w-4 text-slate-400" />
              See a client workspace
            </Link>
          </div>
        </section>

        {/* Product mockup */}
        <section className="mx-auto mb-32 max-w-6xl px-6">
          <div className="glass-panel relative overflow-hidden rounded-2xl shadow-premium">
            {/* Mock OS header */}
            <div className="flex h-12 items-center justify-between border-b border-slate-200 bg-slate-100 px-4">
              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs text-slate-500 shadow-sm">
                <Lock className="h-3 w-3" />
                workspace.seomanager.os / northwind
              </div>
              <div className="w-12" />
            </div>

            <div className="bg-white/50 p-6 md:p-8">
              {/* Workspace header */}
              <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-blue-600">
                    <MapPin className="h-4 w-4" /> Local SEO Workspace
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Northwind Heating &amp; Air</h2>
                </div>
                <div className="flex gap-4">
                  {[
                    { l: "Vis", v: 48, c: "text-slate-900" },
                    { l: "Trust", v: 57, c: "text-emerald-600" },
                    { l: "AI", v: 29, c: "text-rose-600" },
                  ].map((s) => (
                    <div key={s.l} className="min-w-[80px] rounded-lg border border-slate-200 bg-white p-3 text-center shadow-sm">
                      <div className="mb-1 font-mono text-xs font-medium uppercase text-slate-500">{s.l}</div>
                      <div className={`text-xl font-bold ${s.c}`}>{s.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Split */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Geo grid */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="mb-1 font-semibold text-slate-900">Geo Grid</h3>
                      <p className="text-xs font-medium text-slate-500">Avg. rank across the service radius</p>
                    </div>
                    <div className="flex gap-3 font-mono text-xs text-slate-600">
                      <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Top 3</div>
                      <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> 4 to 10</div>
                      <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" /> 11+</div>
                    </div>
                  </div>
                  <div className="relative mx-auto aspect-square w-full max-w-sm rounded-lg border border-slate-200 bg-slate-50 p-2 shadow-inner">
                    <div className="grid h-full w-full grid-cols-7 grid-rows-7 gap-1 md:gap-2">
                      {GEO.map((v, i) => (
                        <div
                          key={i}
                          title={`Rank: ${v}`}
                          className={`flex cursor-default items-center justify-center rounded-sm border font-mono text-[10px] font-bold transition-all duration-300 hover:scale-105 md:rounded md:text-xs ${geoCell(v)} ${i === 24 ? "z-10 ring-2 ring-emerald-500 ring-offset-2 ring-offset-slate-50" : ""}`}
                        >
                          {v}
                        </div>
                      ))}
                    </div>
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div className="pin-pulse flex h-8 w-8 translate-y-[2px] items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-50 shadow-sm">
                        <MapPin className="h-4 w-4 text-emerald-600" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-0 right-0 text-center font-mono text-[10px] font-medium text-slate-400">
                      Center pin = headquarters
                    </div>
                  </div>
                </div>

                {/* Modeled outcomes */}
                <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div>
                    <h3 className="mb-1 flex items-center gap-2 font-semibold text-slate-900">
                      <TrendingUp className="h-5 w-5 text-blue-600" /> Modeled outcome
                    </h3>
                    <p className="mb-8 text-xs font-medium text-slate-500">
                      Projection for the 6-month Northwind engagement based on root-cause fixes.
                    </p>
                    <div className="space-y-4">
                      {strategy.expectedOutcomes.map((o) => (
                        <div key={o.metric} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-4 transition-colors hover:bg-slate-100">
                          <span className="text-sm font-medium text-slate-700">{o.metric}</span>
                          <div className="flex items-center gap-3 font-mono">
                            <span className="text-slate-400">{o.from}</span>
                            <ArrowRight className="h-4 w-4 text-emerald-500" />
                            <span className="text-lg font-bold text-emerald-600">{o.to}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                    <div className="text-xs font-medium text-slate-500">
                      Root cause detected:{" "}
                      <span className="rounded border border-amber-100 bg-amber-50 px-2 py-0.5 font-semibold text-amber-600">Weak Review Velocity</span>
                    </div>
                    <Link href="/tools" className="flex items-center gap-1 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800">
                      View Playbook <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pipeline */}
        <section className="relative z-10 mx-auto mb-32 max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">Nine stages, one connected pipeline.</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              Each stage consumes the previous one&apos;s output and produces its own. Nothing is arbitrary. Every
              task traces back to a diagnosis.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {PIPELINE.map((s, i) => (
              <Link
                key={s.slug}
                href={`/${s.slug}`}
                className="pipeline-card group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="pointer-events-none absolute -right-4 -top-4 select-none text-[100px] font-bold text-slate-50 transition-colors group-hover:text-slate-100">
                  {i + 1}
                </div>
                <div className={`mb-2 font-mono text-sm font-semibold ${s.tone}`}>{s.label}</div>
                <h3 className="relative z-10 mb-2 text-xl font-bold text-slate-900">{s.name}</h3>
                <p className="relative z-10 text-sm text-slate-600">{s.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Bento: built on the thinking */}
        <section className="relative z-10 mx-auto mb-20 max-w-7xl px-6">
          <h2 className="mb-10 text-3xl font-bold text-slate-900 md:text-4xl">
            Built on the thinking,
            <br />
            <span className="text-slate-400">not the dashboards.</span>
          </h2>
          <div className="grid auto-rows-[minmax(250px,auto)] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Diagnosis (large) */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-premium lg:col-span-2">
              <div className="absolute -mr-20 -mt-20 right-0 top-0 h-64 w-64 rounded-full bg-blue-100/50 blur-3xl transition-transform duration-500 group-hover:scale-110" />
              <div className="relative z-10">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 shadow-sm">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-slate-900">Diagnosis, not an audit.</h3>
                <p className="max-w-xl text-lg leading-relaxed text-slate-600">
                  Every symptom resolves to a ranked root cause, with confidence and the evidence behind it.
                  Northwind&apos;s reach wasn&apos;t a content problem. It was review velocity at 3/mo against a
                  market median of 11.
                </p>
              </div>
            </div>

            {/* AI search */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-premium">
              <div className="absolute -mb-10 -mr-10 bottom-0 right-0 h-32 w-32 rounded-full bg-violet-100/50 blur-2xl transition-transform duration-500 group-hover:scale-110" />
              <div className="relative z-10">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-violet-100 bg-violet-50 shadow-sm">
                  <Zap className="h-6 w-6 text-violet-600" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">Made for AI search.</h3>
                <p className="leading-relaxed text-slate-600">
                  AEO and GEO are first-class. Entity models, schema and answer-shaped content to get cited in AI
                  Overviews, where most local brands are currently invisible.
                </p>
              </div>
            </div>

            {/* Task routing */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-premium">
              <div className="absolute -mb-10 -ml-10 bottom-0 left-0 h-32 w-32 rounded-full bg-emerald-100/50 blur-2xl transition-transform duration-500 group-hover:scale-110" />
              <div className="relative z-10">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 shadow-sm">
                  <ClipboardCheck className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">Strategy that becomes Monday&apos;s work.</h3>
                <p className="leading-relaxed text-slate-600">
                  Playbooks expand into tasks routed to the right person (Tech SEO, Content, Citations, Local/GBP)
                  on a daily board with email nudges that keep owners on time.
                </p>
              </div>
            </div>

            {/* Closes loop (large) */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-premium lg:col-span-2">
              <div className="absolute -mr-20 right-0 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-amber-100/50 blur-3xl transition-transform duration-500 group-hover:scale-110" />
              <div className="relative z-10 flex flex-col items-start gap-8 md:flex-row md:items-center">
                <div className="flex-1">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-amber-100 bg-amber-50 shadow-sm">
                    <RefreshCcw className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-slate-900">Closes the loop with the client.</h3>
                  <p className="text-lg leading-relaxed text-slate-600">
                    A performance report you approve, share with the team on Slack, then send to the client,
                    measured against the goals set back in Discovery.
                  </p>
                </div>
                <div className="w-full shrink-0 rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm md:w-64">
                  <div className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-3">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="font-mono text-xs font-semibold text-slate-600">Client Report Generated</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full rounded bg-slate-200" />
                    <div className="h-2 w-4/5 rounded bg-slate-200" />
                    <div className="mt-4 h-2 w-full rounded bg-slate-100" />
                    <div className="h-2 w-3/4 rounded bg-slate-100" />
                  </div>
                  <Link href="/reports" className="mt-4 block w-full rounded border border-blue-200 bg-blue-50 py-2 text-center text-xs font-semibold text-blue-700 shadow-sm transition-colors hover:bg-blue-100">
                    Send to Client
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-200 bg-white py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
          <div className="text-sm text-slate-500">
            <span className="font-bold tracking-tight text-slate-900">SEO MANAGER OS</span>
            <span className="mx-2 text-slate-300">·</span>
            Designed and built by <span className="font-semibold text-slate-700">{AUTHOR}</span>, {ROLE}
          </div>
          <div className="flex gap-4 font-medium">
            <Link href="/workflow" className="text-sm text-slate-500 transition-colors hover:text-blue-600">Demo</Link>
            <Link href="/workflow" className="text-sm text-slate-500 transition-colors hover:text-blue-600">Methodology</Link>
            <a href={`mailto:${CONTACT}`} className="text-sm text-slate-500 transition-colors hover:text-blue-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
