import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Search,
  Microscope,
  Stethoscope,
  FileText,
  Wrench,
  Gauge,
  MapPin,
  Cloud,
  Building2,
  Bot,
  ShieldCheck,
  Network,
  Target,
  Check,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { STAGES } from "@/lib/stages";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-white/80 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="font-semibold tracking-tight">SEO Manager OS</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-slate-600 md:flex">
            <a href="#how" className="hover:text-slate-900">How it works</a>
            <a href="#models" className="hover:text-slate-900">SEO models</a>
            <a href="#features" className="hover:text-slate-900">Features</a>
          </nav>
          <ButtonLink href="/discovery" size="sm">
            Start Investigation
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="container-page relative py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex">
              <Badge variant="accent">
                <Bot className="h-3.5 w-3.5" />
                Built for the AI search era
              </Badge>
            </div>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
              SEO Manager OS
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-lg leading-relaxed text-slate-500">
              Diagnose search visibility, trust, authority, retrieval, and
              lead-generation problems <em>before</em> wasting time on SEO tasks.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href="/discovery" size="lg">
                Start Investigation
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/dashboards/local" size="lg" variant="secondary">
                View a dashboard
              </ButtonLink>
            </div>
            <p className="mt-5 text-sm text-slate-400">
              Local · SaaS · Enterprise — one operating system. No account required.
            </p>
          </div>

          {/* Flow ribbon */}
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3 text-sm font-medium text-slate-500">
              {["Interview", "Research", "Diagnosis", "Strategy", "Execution", "Measurement"].map(
                (step, i, arr) => (
                  <span key={step} className="flex items-center gap-2">
                    <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1.5 shadow-soft">
                      {step}
                    </span>
                    {i < arr.length - 1 && (
                      <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
                    )}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="border-b border-[var(--border)] bg-[var(--surface-2)]">
        <div className="container-page py-16">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-600">
                Not another dashboard
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                Most SEO tools stop at charts. This one starts with a question.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-500">
                SEO Manager OS operates like a senior strategist. Before
                recommending a single task, it answers the only question that
                matters: <strong className="text-slate-700">why is this
                business not winning in search?</strong>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-soft">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Typical SEO tool
                </div>
                <ul className="mt-3 space-y-2 text-sm text-slate-500">
                  <li>Data</li>
                  <li>↓ Charts</li>
                  <li>↓ Reports</li>
                </ul>
              </div>
              <div className="rounded-xl border border-accent-200 bg-accent-50/50 p-5 shadow-soft">
                <div className="text-xs font-semibold uppercase tracking-wide text-accent-600">
                  Intelligence OS
                </div>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  <li>Interview → Research</li>
                  <li>↓ Diagnosis → Strategy</li>
                  <li>↓ Execution → Measurement</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works — 8 stages */}
      <section id="how" className="border-b border-[var(--border)]">
        <div className="container-page py-20">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-600">
              How it works
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Eight stages, one continuous loop
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-500">
              From consultant intake to measurement — each stage feeds the next,
              so every recommendation is traceable to a diagnosed root cause.
            </p>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
            {STAGES.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.slug}
                  href={`/${s.slug}`}
                  className="group bg-white p-6 transition-colors hover:bg-slate-50"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-2xl font-semibold text-slate-200 group-hover:text-accent-200">
                      0{s.n}
                    </span>
                  </div>
                  <h3 className="mt-4 font-semibold tracking-tight">{s.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                    {s.blurb}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Supported models */}
      <section id="models" className="border-b border-[var(--border)] bg-[var(--surface-2)]">
        <div className="container-page py-20">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-600">
              Supported SEO models
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              One OS for every search problem
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: MapPin,
                name: "Local SEO",
                tag: "Service-area & multi-location",
                points: ["Geo-grid & GBP health", "Review intelligence", "Local authority & entities"],
              },
              {
                icon: Cloud,
                name: "SaaS SEO",
                tag: "Product-led growth",
                points: ["BOFU & comparison coverage", "Programmatic opportunities", "Conversion & AEO"],
              },
              {
                icon: Building2,
                name: "Enterprise SEO",
                tag: "Scale & technical",
                points: ["Crawl budget & indexation", "Template & link graph", "Forecasting & entities"],
              },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.name}
                  className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-soft"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight">{m.name}</h3>
                  <div className="text-sm text-slate-400">{m.tag}</div>
                  <ul className="mt-4 space-y-2">
                    {m.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm text-slate-600">
                        <Check className="h-4 w-4 text-accent-500" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Screenshot strip */}
      <section className="border-b border-[var(--border)]">
        <div className="container-page py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-600">
                The diagnosis engine
              </div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Root cause, not a generic audit
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-500">
                Every engagement resolves to a ranked set of causes with
                confidence and impact — so you know exactly what to fix and why.
              </p>
              <div className="mt-6">
                <ButtonLink href="/diagnosis" variant="secondary">
                  See the diagnosis
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-card">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">Primary cause</span>
                <Badge variant="bad">High impact</Badge>
              </div>
              <div className="mt-1 text-xl font-semibold tracking-tight">
                Weak Review Velocity
              </div>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[87%] rounded-full bg-accent-500" />
              </div>
              <div className="mt-1.5 text-xs text-slate-400">87% confidence</div>
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Visibility", "48"],
                  ["Trust", "57"],
                  ["Authority", "41"],
                  ["AI Visibility", "29"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg bg-slate-50 px-3 py-2.5">
                    <div className="text-xs text-slate-400">{k}</div>
                    <div className="text-lg font-semibold">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-b border-[var(--border)] bg-[var(--surface-2)]">
        <div className="container-page py-20">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-600">
              Features
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              A strategist&apos;s workflow, operationalized
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Search, title: "Consultant intake", body: "A guided interview that classifies the business and frames the problem." },
              { icon: Microscope, title: "Evidence-first audits", body: "Investigations that surface the signals behind the symptoms." },
              { icon: Stethoscope, title: "Root-cause diagnosis", body: "Ranked causes with confidence and impact — the most important screen." },
              { icon: FileText, title: "Executive strategy brief", body: "A board-ready document generated straight from the diagnosis." },
              { icon: Wrench, title: "Execution planners", body: "30/90/180-day plans plus purpose-built tools per SEO model." },
              { icon: Bot, title: "AEO everywhere", body: "Citation, retrieval and AI-Overview visibility in every dashboard." },
              { icon: ShieldCheck, title: "Trust & authority", body: "Review velocity, entity consistency and local authority modeling." },
              { icon: Network, title: "Link & entity graphs", body: "Internal linking, orphan detection and entity disambiguation." },
              { icon: Target, title: "Forecasted outcomes", body: "Every recommendation tied to an expected, measurable result." },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-soft"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3.5 font-semibold tracking-tight">{f.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">{f.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-b border-[var(--border)]">
        <div className="container-page py-20">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-16 text-center text-white sm:px-16">
            <div className="absolute inset-0 grid-bg opacity-10" />
            <div className="relative mx-auto max-w-2xl">
              <Gauge className="mx-auto h-8 w-8 text-accent-400" />
              <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
                Know exactly why a business isn&apos;t winning
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-300">
                Run a full investigation in minutes — from interview to a
                board-ready strategy and a 180-day execution plan.
              </p>
              <div className="mt-8 flex justify-center">
                <ButtonLink href="/discovery" size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                  Start Investigation
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-8 text-sm text-slate-400 sm:flex-row">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            SEO Manager OS
          </div>
          <div>A senior SEO strategist, operationalized · Prototype</div>
        </div>
      </footer>
    </div>
  );
}
