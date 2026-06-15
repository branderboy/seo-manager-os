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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Multi = Record<string, boolean>;

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

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-all",
        active
          ? "border-accent-300 bg-accent-50 text-accent-700 shadow-soft"
          : "border-[var(--border)] bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
      )}
    >
      <span
        className={cn(
          "flex h-4 w-4 items-center justify-center rounded-[5px] border",
          active ? "border-accent-500 bg-accent-500 text-white" : "border-slate-300"
        )}
      >
        {active && <Check className="h-3 w-3" />}
      </span>
      {children}
    </button>
  );
}

function Field({ label, value, placeholder }: { label: string; value?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <input
        defaultValue={value}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-100"
      />
    </label>
  );
}

export function DiscoveryWizard() {
  const [step, setStep] = React.useState(0);
  const [model, setModel] = React.useState<"Local" | "SaaS" | "Enterprise">("Local");
  const [revenue, setRevenue] = React.useState<Multi>({ Leads: true, Calls: true });
  const [goals, setGoals] = React.useState<Multi>({ "More Leads": true, "More Calls": true, "More AI Visibility": true });
  const [problems, setProblems] = React.useState<Multi>({ "GBP Visibility Problems": true, "Leads Down": true, "AI Visibility Problems": true });
  const [assets, setAssets] = React.useState<Multi>({ "Google Business Profile": true, GA4: true, "Search Console": true, CRM: true });

  const toggle = (set: React.Dispatch<React.SetStateAction<Multi>>, key: string) =>
    set((s) => ({ ...s, [key]: !s[key] }));

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
      <div>
        {/* Progress */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">{STEPS[step]}</span>
            <span className="text-slate-400">
              Section {step + 1} of {STEPS.length}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-accent-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-soft sm:p-8">
          {step === 0 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Business Name" value="Northwind Heating & Air" />
              <Field label="Website" value="northwindhvac.com" />
              <Field label="Industry" value="HVAC / Home Services" />
              <Field label="Locations" value="3" />
              <Field label="Years In Business" value="14" />
              <Field label="Revenue Range" value="$5M–$10M" />
              <Field label="Team Size" value="25–50" />
              <Field label="Primary Market" value="Austin, TX" />
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="mb-4 text-sm text-slate-500">
                Which best describes the business model?
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { id: "Local", label: "Local Service Business", icon: MapPin },
                  { id: "SaaS", label: "SaaS", icon: Cloud },
                  { id: "Enterprise", label: "Enterprise", icon: Building2 },
                ].map((m) => {
                  const Icon = m.icon;
                  const active = model === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setModel(m.id as typeof model)}
                      className={cn(
                        "flex flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all",
                        active
                          ? "border-accent-300 bg-accent-50 shadow-soft"
                          : "border-[var(--border)] bg-white hover:border-slate-300"
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
            <ChipGroup
              prompt="How does the business make money? Select all that apply."
              options={["Leads", "Sales", "Trials", "Subscriptions", "Memberships", "Advertising", "Calls"]}
              state={revenue}
              onToggle={(k) => toggle(setRevenue, k)}
            />
          )}
          {step === 3 && (
            <ChipGroup
              prompt="What are the primary goals?"
              options={["More Leads", "More Calls", "More Revenue", "More Visibility", "More AI Visibility", "Traffic Recovery"]}
              state={goals}
              onToggle={(k) => toggle(setGoals, k)}
            />
          )}
          {step === 4 && (
            <ChipGroup
              prompt="What problems is the business experiencing?"
              options={["Rankings Down", "Traffic Down", "Leads Down", "Not Ranking", "GBP Visibility Problems", "AI Visibility Problems", "Unknown"]}
              state={problems}
              onToggle={(k) => toggle(setProblems, k)}
            />
          )}
          {step === 5 && (
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Competitor 1" value="ATX Comfort Pros" />
              <Field label="Competitor 2" value="Lone Star Mechanical" />
              <Field label="Competitor 3" value="Hill Country HVAC" />
            </div>
          )}
          {step === 6 && (
            <ChipGroup
              prompt="Which assets and integrations are available?"
              options={["Google Business Profile", "GA4", "Search Console", "CRM", "Review Platform", "SEO Tools"]}
              state={assets}
              onToggle={(k) => toggle(setAssets, k)}
            />
          )}

          {step === 7 && (
            <Classification model={model} />
          )}
        </div>

        {/* Nav */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="secondary"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
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
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Intake progress
          </div>
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
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold",
                      i < step ? "bg-emerald-500 text-white" : i === step ? "bg-accent-500 text-white" : "bg-slate-100 text-slate-500"
                    )}
                  >
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

function ChipGroup({
  prompt,
  options,
  state,
  onToggle,
}: {
  prompt: string;
  options: string[];
  state: Multi;
  onToggle: (k: string) => void;
}) {
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

function Classification({ model }: { model: "Local" | "SaaS" | "Enterprise" }) {
  const detail: Record<string, { conf: number; reasons: string[] }> = {
    Local: {
      conf: 92,
      reasons: [
        "Multi-location service business with a defined service area",
        "Revenue driven by leads and phone calls",
        "Google Business Profile is a primary asset",
      ],
    },
    SaaS: {
      conf: 88,
      reasons: ["Subscription / trial revenue model", "Product-led growth motion", "Comparison & BOFU intent demand"],
    },
    Enterprise: {
      conf: 90,
      reasons: ["Large URL footprint and templated content", "Technical crawl & indexation constraints", "Multiple stakeholders and revenue templates"],
    },
  };
  const d = detail[model];

  return (
    <div className="text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
        <Sparkles className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-900">
        Classified as {model} SEO
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Based on the interview, the OS will run the {model} playbook.
      </p>
      <div className="mx-auto mt-5 max-w-xs">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Classification confidence</span>
          <span className="font-semibold text-slate-800">{d.conf}%</span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-accent-500" style={{ width: `${d.conf}%` }} />
        </div>
      </div>
      <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left">
        {d.reasons.map((r) => (
          <li key={r} className="flex items-start gap-2 text-sm text-slate-600">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            {r}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex justify-center gap-2">
        <Badge variant="accent">Local SEO</Badge>
        <Badge variant="outline">+ AEO module</Badge>
      </div>
    </div>
  );
}
