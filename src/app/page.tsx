import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Stethoscope, Bot, ListChecks, FileCheck2 } from "lucide-react";
import { STAGES } from "@/lib/stages";

export const metadata: Metadata = {
  title: "SEO Manager OS — an operating system for agency SEO",
  description: "A diagnosis-first SEO operating system: Discovery → Diagnosis → Playbooks → Daily Tasks → Client Reports.",
};

// Credit — change to your preferred name / contact.
const AUTHOR = "Kawani";
const CONTACT = "kawani@digiwaxx.com";

const HIGHLIGHTS = [
  { icon: Stethoscope, title: "Diagnosis-first", body: "Every recommendation traces back to a root cause — with confidence, impact and the evidence behind it (GBP, geo-grid, crawl)." },
  { icon: Bot, title: "Built for AI search", body: "AEO & GEO are first-class. Win citations in AI answers and featured results, not just the ten blue links." },
  { icon: ListChecks, title: "Plays become daily work", body: "Playbooks generate tasks that route to the right role — Tech SEO, Content, Citations, Local — and land on a daily board." },
  { icon: FileCheck2, title: "Client-ready reporting", body: "Approve a performance report, share it with the team on Slack, and send it to the client — in one flow." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Top bar */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2 font-bold tracking-wide">
          <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-brand-900">
            <span className="h-3 w-3 rounded-sm bg-white" />
          </span>
          <span className="text-sm">SEO MANAGER OS</span>
        </div>
        <Link href="/workflow" className="inline-flex items-center gap-1.5 rounded-lg bg-accent-500 px-3.5 py-2 text-sm font-semibold text-white hover:bg-accent-600">
          Open the demo <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      {/* Hero */}
      <section className="bg-brand-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-100 ring-1 ring-inset ring-white/15">
            Working prototype · Built by {AUTHOR}
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            An operating system for how an agency actually runs SEO.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-100">
            Not another rank tracker. A diagnosis-first workflow that takes a client from intake to a reported
            result — resolving every symptom to a root cause, turning strategy into role-routed daily work, and
            closing the loop with a client-ready report.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/workflow" className="inline-flex items-center gap-1.5 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-brand-900 hover:bg-brand-50">
              Explore the live demo <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/clients" className="inline-flex items-center gap-1.5 rounded-lg border border-white/25 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10">
              See a client workspace
            </Link>
          </div>
        </div>
      </section>

      {/* The method */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-600">The method</div>
        <h2 className="text-2xl font-semibold tracking-tight">Nine stages, one connected pipeline</h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-500">
          Each stage consumes the previous stage&apos;s output and produces its own — so the work is never
          arbitrary. Every task can be traced back to a diagnosis.
        </p>
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STAGES.map((s) => {
            const Icon = s.icon;
            return (
              <li key={s.slug} className="flex items-start gap-3 rounded-xl border border-[var(--border)] p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-900 text-xs font-bold text-white ring-2 ring-brand-200">
                  {s.n}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-accent-500" />
                    <span className="text-sm font-semibold text-slate-900">{s.name}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-slate-500">{s.does}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Why it's different */}
      <section className="bg-[var(--surface-2)]">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-600">Why it&apos;s different</div>
          <h2 className="text-2xl font-semibold tracking-tight">The thinking, not just the dashboards</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {HIGHLIGHTS.map((h) => {
              const Icon = h.icon;
              return (
                <div key={h.title} className="flex gap-4 rounded-2xl border border-[var(--border)] bg-white p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{h.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">{h.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-brand-900 p-8 text-white sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold">See it run end-to-end</h2>
            <p className="mt-1 text-brand-100">Start at the pipeline, or jump straight into a client&apos;s workspace.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/workflow" className="inline-flex items-center gap-1.5 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-brand-900 hover:bg-brand-50">
              Open the demo <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/clients" className="inline-flex items-center gap-1.5 rounded-lg border border-white/25 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10">
              Browse clients
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center">
          <span>Designed & built by <span className="font-semibold text-slate-700">{AUTHOR}</span> — a working prototype, not a production product.</span>
          <a href={`mailto:${CONTACT}`} className="font-medium text-accent-600 hover:underline">{CONTACT}</a>
        </div>
      </footer>
    </div>
  );
}
