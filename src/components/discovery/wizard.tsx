"use client";

import * as React from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  MapPin,
  Cloud,
  Building2,
  Sparkles,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEngagement, DEFAULT_ENGAGEMENT, type Model as EngModel } from "@/components/engagement/store";

type Multi = Record<string, boolean>;
type Model = "Local" | "SaaS" | "Enterprise" | "";

type FormState = {
  business: string;
  website: string;
  industry: string;
  locations: string;
  years: string;
  revenueRange: string;
  teamSize: string;
  market: string;
  model: Model;
  revenue: Multi;
  goals: Multi;
  problems: Multi;
  competitors: string[];
  assets: Multi;
};

const EMPTY: FormState = {
  business: "",
  website: "",
  industry: "",
  locations: "",
  years: "",
  revenueRange: "",
  teamSize: "",
  market: "",
  model: "",
  revenue: {},
  goals: {},
  problems: {},
  competitors: ["", "", ""],
  assets: {},
};

const SAMPLE: FormState = {
  business: "Northwind Heating & Air",
  website: "northwindhvac.com",
  industry: "HVAC / Home Services",
  locations: "3",
  years: "14",
  revenueRange: "$5M–$10M",
  teamSize: "25–50",
  market: "Austin, TX",
  model: "Local",
  revenue: { Leads: true, Calls: true },
  goals: { "More Leads": true, "More Calls": true, "More AI Visibility": true },
  problems: { "GBP Visibility Problems": true, "Leads Down": true, "AI Visibility Problems": true },
  competitors: ["ATX Comfort Pros", "Lone Star Mechanical", "Hill Country HVAC"],
  assets: { "Google Business Profile": true, GA4: true, "Search Console": true, CRM: true },
};

const STEPS = [
  "Business Information",
  "Business Model",
  "Revenue Model",
  "Primary Goals",
  "Current Problems",
  "Competitors",
  "Current Assets",
  "Classification",
];

export function DiscoveryWizard() {
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState<FormState>(EMPTY);
  const { setEngagement } = useEngagement();

  // Flow the interview answers into the shared engagement (drives every later
  // stage). Only writes once a business name exists, so empties never overwrite.
  React.useEffect(() => {
    if (!data.business.trim()) return;
    const sel = (m: Multi) => Object.keys(m).filter((k) => m[k]);
    const infoFilled = [data.business, data.website, data.industry, data.market].filter(Boolean).length;
    const signals = sel(data.goals).length + sel(data.problems).length + sel(data.assets).length;
    setEngagement({
      business: data.business,
      website: data.website,
      industry: data.industry,
      market: data.market,
      model: (data.model || "Local") as EngModel,
      goals: sel(data.goals),
      problems: sel(data.problems),
      assets: sel(data.assets),
      competitors: data.competitors.filter(Boolean),
      confidence: Math.min(97, 58 + infoFilled * 4 + Math.min(signals, 12)),
      scores: DEFAULT_ENGAGEMENT.scores,
    });
  }, [data, setEngagement]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setData((d) => ({ ...d, [key]: value }));
  const toggle = (key: keyof FormState, opt: string) =>
    setData((d) => ({ ...d, [key]: { ...(d[key] as Multi), [opt]: !(d[key] as Multi)[opt] } }));

  const canContinue =
    step === 0 ? data.business.trim().length > 0 : step === 1 ? data.model !== "" : true;

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
      <div>
        {/* Progress + prefill */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">{STEPS[step]}</span>
            <button
              onClick={() => setData(SAMPLE)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-accent-600 hover:text-accent-700"
            >
              <Wand2 className="h-3.5 w-3.5" />
              Prefill sample
            </button>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-accent-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-soft sm:p-8">
          {step === 0 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Business Name" value={data.business} onChange={(v) => set("business", v)} placeholder="e.g. Northwind Heating & Air" required />
              <Field label="Website" value={data.website} onChange={(v) => set("website", v)} placeholder="yourbusiness.com" />
              <Field label="Industry" value={data.industry} onChange={(v) => set("industry", v)} placeholder="e.g. HVAC / Home Services" />
              <Field label="Locations" value={data.locations} onChange={(v) => set("locations", v)} placeholder="e.g. 3" />
              <Field label="Years In Business" value={data.years} onChange={(v) => set("years", v)} placeholder="e.g. 14" />
              <Field label="Revenue Range" value={data.revenueRange} onChange={(v) => set("revenueRange", v)} placeholder="e.g. $5M–$10M" />
              <Field label="Team Size" value={data.teamSize} onChange={(v) => set("teamSize", v)} placeholder="e.g. 25–50" />
              <Field label="Primary Market" value={data.market} onChange={(v) => set("market", v)} placeholder="e.g. Austin, TX" />
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="mb-4 text-sm text-slate-500">Which best describes the business model?</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { id: "Local", label: "Local Service Business", icon: MapPin },
                  { id: "SaaS", label: "SaaS", icon: Cloud },
                  { id: "Enterprise", label: "Enterprise", icon: Building2 },
                ].map((m) => {
                  const Icon = m.icon;
                  const active = data.model === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => set("model", m.id as Model)}
                      className={cn(
                        "flex flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all",
                        active ? "border-accent-300 bg-accent-50 shadow-soft" : "border-[var(--border)] bg-white hover:border-slate-300"
                      )}
                    >
                      <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg", active ? "bg-accent-500 text-white" : "bg-slate-100 text-slate-600")}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-sm font-medium text-slate-800">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <ChipGroup prompt="How does the business make money? Select all that apply." options={["Leads", "Sales", "Trials", "Subscriptions", "Memberships", "Advertising", "Calls"]} state={data.revenue} onToggle={(k) => toggle("revenue", k)} />
          )}
          {step === 3 && (
            <ChipGroup prompt="What are the primary goals?" options={["More Leads", "More Calls", "More Revenue", "More Visibility", "More AI Visibility", "Traffic Recovery"]} state={data.goals} onToggle={(k) => toggle("goals", k)} />
          )}
          {step === 4 && (
            <ChipGroup prompt="What problems is the business experiencing?" options={["Rankings Down", "Traffic Down", "Leads Down", "Not Ranking", "GBP Visibility Problems", "AI Visibility Problems", "Unknown"]} state={data.problems} onToggle={(k) => toggle("problems", k)} />
          )}
          {step === 5 && (
            <div className="grid gap-4 sm:grid-cols-3">
              {[0, 1, 2].map((idx) => (
                <Field
                  key={idx}
                  label={`Competitor ${idx + 1}`}
                  value={data.competitors[idx]}
                  onChange={(v) => {
                    const next = [...data.competitors];
                    next[idx] = v;
                    set("competitors", next);
                  }}
                  placeholder="Competitor name"
                />
              ))}
            </div>
          )}
          {step === 6 && (
            <ChipGroup prompt="Which assets and integrations are available?" options={["Google Business Profile", "GA4", "Search Console", "CRM", "Review Platform", "SEO Tools"]} state={data.assets} onToggle={(k) => toggle("assets", k)} />
          )}

          {step === 7 && <Classification data={data} />}
        </div>

        {/* Nav */}
        <div className="mt-6 flex items-center justify-between">
          <Button variant="secondary" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <div className="flex flex-col items-end gap-1">
              <Button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))} disabled={!canContinue}>
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
              {!canContinue && (
                <span className="text-xs text-slate-400">
                  {step === 0 ? "Enter a business name to continue" : "Choose a business model to continue"}
                </span>
              )}
            </div>
          ) : (
            <ButtonLink href="/research">
              Build research plan
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          )}
        </div>
      </div>

      {/* Side rail */}
      <aside className="hidden lg:block">
        <div className="sticky top-20 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-soft">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Intake progress</div>
          {data.business && (
            <div className="mt-3 rounded-lg bg-[var(--surface-2)] px-3 py-2">
              <div className="text-sm font-medium text-slate-800">{data.business}</div>
              {data.model && <div className="text-xs text-slate-500">{data.model} · {data.market || "—"}</div>}
            </div>
          )}
          <ol className="mt-3 space-y-1">
            {STEPS.map((s, i) => (
              <li key={s}>
                <button
                  onClick={() => setStep(i)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
                    i === step ? "bg-accent-50 font-medium text-accent-700" : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  <span className={cn("flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold", i < step ? "bg-emerald-500 text-white" : i === step ? "bg-accent-500 text-white" : "bg-slate-100 text-slate-500")}>
                    {i < step ? <Check className="h-3 w-3" /> : i + 1}
                  </span>
                  <span className="truncate">{s}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </aside>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
        {required && <span className="ml-1 text-accent-500">*</span>}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-100"
      />
    </label>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-all",
        active ? "border-accent-300 bg-accent-50 text-accent-700 shadow-soft" : "border-[var(--border)] bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
      )}
    >
      <span className={cn("flex h-4 w-4 items-center justify-center rounded-[5px] border", active ? "border-accent-500 bg-accent-500 text-white" : "border-slate-300")}>
        {active && <Check className="h-3 w-3" />}
      </span>
      {children}
    </button>
  );
}

function ChipGroup({ prompt, options, state, onToggle }: { prompt: string; options: string[]; state: Multi; onToggle: (k: string) => void }) {
  return (
    <div>
      <p className="mb-4 text-sm text-slate-500">{prompt}</p>
      <div className="flex flex-wrap gap-2.5">
        {options.map((o) => (
          <Chip key={o} active={!!state[o]} onClick={() => onToggle(o)}>
            {o}
          </Chip>
        ))}
      </div>
    </div>
  );
}

function Classification({ data }: { data: FormState }) {
  const model: Exclude<Model, ""> = data.model || "Local";
  const selected = (m: Multi) => Object.keys(m).filter((k) => m[k]);
  const goals = selected(data.goals);
  const problems = selected(data.problems);
  const assets = selected(data.assets);

  // Confidence rises with how complete the intake is — feels responsive.
  const infoFilled = [data.business, data.website, data.industry, data.locations, data.years, data.revenueRange, data.teamSize, data.market].filter(Boolean).length;
  const signalCount = goals.length + problems.length + assets.length + selected(data.revenue).length;
  const confidence = Math.min(97, 58 + infoFilled * 3 + Math.min(signalCount, 12));

  const reasons: Record<Exclude<Model, "">, string[]> = {
    Local: [
      data.locations ? `Multi-location service business (${data.locations} locations)` : "Service-area business profile",
      data.assets["Google Business Profile"] ? "Google Business Profile is a primary asset" : "Revenue driven by local leads and calls",
      problems.some((p) => p.includes("GBP") || p.includes("Leads")) ? "Symptoms point to local pack + lead generation" : "Local search intent dominates demand",
    ],
    SaaS: ["Subscription / trial revenue model", "Product-led growth motion", "Comparison & BOFU search intent"],
    Enterprise: ["Large URL footprint and templated content", "Technical crawl & indexation constraints", "Multiple revenue templates and stakeholders"],
  };

  return (
    <div className="text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
        <Sparkles className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-900">
        {data.business || "This business"} → {model} SEO
      </h3>
      <p className="mt-1 text-sm text-slate-500">Based on the interview, the OS will run the {model} playbook.</p>

      <div className="mx-auto mt-5 max-w-xs">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Classification confidence</span>
          <span className="font-semibold text-slate-800">{confidence}%</span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-accent-500 transition-all" style={{ width: `${confidence}%` }} />
        </div>
      </div>

      <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left">
        {reasons[model].map((r) => (
          <li key={r} className="flex items-start gap-2 text-sm text-slate-600">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            {r}
          </li>
        ))}
      </ul>

      {/* What we heard — reflects real input */}
      <div className="mx-auto mt-6 max-w-md rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-left">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">What we heard</div>
        <dl className="mt-2 space-y-1.5 text-sm">
          <Heard label="Goals" items={goals} />
          <Heard label="Problems" items={problems} />
          <Heard label="Assets" items={assets} />
        </dl>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        <Badge variant="accent">{model} SEO</Badge>
        <Badge variant="outline">+ AEO module</Badge>
      </div>
    </div>
  );
}

function Heard({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="flex gap-2">
      <dt className="w-20 shrink-0 text-slate-400">{label}</dt>
      <dd className="flex flex-wrap gap-1.5">
        {items.length ? (
          items.map((i) => (
            <span key={i} className="rounded-md bg-white px-1.5 py-0.5 text-xs text-slate-600 ring-1 ring-inset ring-[var(--border)]">
              {i}
            </span>
          ))
        ) : (
          <span className="text-xs text-slate-400">—</span>
        )}
      </dd>
    </div>
  );
}
