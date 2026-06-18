import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Competitive Insights" };

const COMPETITORS = [
  { name: "Comfort Pros HVAC", sov: 31, rank: "1.4", reviews: 412, ai: "Cited", tone: "bg-rose-50 text-rose-700 ring-rose-200" },
  { name: "Austin Air Experts", sov: 22, rank: "2.1", reviews: 286, ai: "Cited", tone: "bg-amber-50 text-amber-700 ring-amber-200" },
  { name: "Northwind Heating & Air", sov: 11, rank: "4.8", reviews: 47, ai: "Absent", tone: "bg-blue-50 text-blue-700 ring-blue-200" },
];

const SEARCH = [
  { label: "SERP features won by rivals", value: "Local Pack · FAQ · AI Overview", note: "Northwind appears in 0 of 3" },
  { label: "Content gaps vs. competitors", value: "18 topics", note: "Ranked by rivals, missing on-site" },
  { label: "Backlink gap", value: "−214 referring domains", note: "Behind the market median" },
  { label: "AI answer coverage", value: "9% of queries", note: "vs. 41% for the leader" },
];

export default function CompetitorsPage() {
  return (
    <>
      <PageHeader
        stage={4}
        title="Competitive Insights"
        badge="Market intelligence"
        description="Before diagnosing your own gaps, read the field — who's winning the SERP and AI answers, where the share of voice sits, and which lanes are open. The competitive picture frames every gap that follows."
      />

      {/* Competitor benchmark */}
      <Card>
        <div className="p-6">
          <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">Competitor set &amp; share of voice</h3>
          <p className="mt-1 text-sm text-slate-600">Benchmarked against the goals and intent mapped upstream — Northwind sits third in the local market.</p>
          <div className="mt-5 space-y-3">
            {COMPETITORS.map((c) => (
              <div key={c.name} className="rounded-lg border border-[var(--border)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 font-mono text-xs font-semibold ring-1 ring-inset ${c.tone}`}>
                      {c.sov}% SOV
                    </span>
                    <span className="text-sm font-semibold text-slate-900">{c.name}</span>
                  </div>
                  <Badge variant={c.ai === "Cited" ? "accent" : "outline"}>{c.ai} in AI</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500">
                  <span>Avg. rank <strong className="text-slate-700">{c.rank}</strong></span>
                  <span>Reviews <strong className="text-slate-700">{c.reviews}</strong></span>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-[#1DA1F2]" style={{ width: `${c.sov}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Search landscape */}
      <div className="grid gap-5 sm:grid-cols-2">
        {SEARCH.map((s) => (
          <Card key={s.label} className="p-6">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{s.label}</div>
            <div className="mt-2 text-lg font-bold text-slate-900">{s.value}</div>
            <p className="mt-1 text-sm text-slate-500">{s.note}</p>
          </Card>
        ))}
      </div>

      {/* Where this feeds */}
      <Card>
        <div className="p-6">
          <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">What this hands to Diagnosis</h3>
          <ul className="mt-4 space-y-2">
            {[
              "The competitor set and share-of-voice baseline to measure every gap against.",
              "SERP and AI-answer coverage the rivals own that Northwind is missing.",
              "Content and backlink gaps ranked by what's actually winning in this market.",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2 text-sm text-slate-700">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </>
  );
}
