"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, CircleAlert, Plus, Sparkles, X } from "lucide-react";

const steps = ["Client details", "Services & economics", "Local market", "Access & integrations", "Baseline setup"];
const accessStates = ["not requested", "requested", "received", "connected", "blocked"] as const;
const integrationNames = ["GA4", "Google Search Console", "Google Business Profile", "Tag Manager", "CMS", "Call tracking", "CRM", "Rank tracker", "Citation provider", "Website host", "Domain registrar"];

type FormState = {
  legalName: string;
  brandName: string;
  website: string;
  industry: string;
  businessModel: "storefront" | "service area" | "hybrid" | "";
  primaryContact: string;
  email: string;
  phone: string;
  address: string;
  timezone: string;
  startDate: string;
  contractStatus: string;
  coreServices: string[];
  priorityServices: string[];
  highMarginServices: string[];
  averageTickets: Record<string, string>;
  minimumJobSize: string;
  customerMix: "residential" | "commercial" | "both";
  emergency: boolean;
  trustSignals: string;
  seasonalNotes: string;
  capacityConstraints: string;
  primaryCity: string;
  targetCities: string[];
  targetZips: string[];
  serviceAreas: string[];
  excludedAreas: string[];
  priorityMarkets: string[];
  competitors: string[];
  integrations: Record<string, (typeof accessStates)[number]>;
  baselineDate: string;
  kpis: string[];
  keywordClusters: string[];
  landingPages: string[];
  initialNotes: string;
};

const initial: FormState = {
  legalName: "",
  brandName: "",
  website: "",
  industry: "",
  businessModel: "",
  primaryContact: "",
  email: "",
  phone: "",
  address: "",
  timezone: "America/New_York",
  startDate: "2026-09-01",
  contractStatus: "active",
  coreServices: [""],
  priorityServices: [],
  highMarginServices: [],
  averageTickets: {},
  minimumJobSize: "",
  customerMix: "residential",
  emergency: false,
  trustSignals: "",
  seasonalNotes: "",
  capacityConstraints: "",
  primaryCity: "",
  targetCities: [""],
  targetZips: [""],
  serviceAreas: [""],
  excludedAreas: [""],
  priorityMarkets: [""],
  competitors: [""],
  integrations: Object.fromEntries(integrationNames.map((name) => [name, "not requested"])) as FormState["integrations"],
  baselineDate: "2026-09-01",
  kpis: ["Organic leads", "GBP calls", "Local-pack visibility", "Booked estimates", "Reviews"],
  keywordClusters: [""],
  landingPages: [""],
  initialNotes: "",
};

export function OnboardingWizard() {
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState<FormState>(initial);
  const [submitted, setSubmitted] = React.useState(false);
  const [errors, setErrors] = React.useState<string[]>([]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setData((current) => ({ ...current, [key]: value }));
  const core = data.coreServices.map((value) => value.trim()).filter(Boolean);

  function validateCurrent() {
    const next: string[] = [];
    if (step === 0) {
      if (!data.legalName.trim()) next.push("Legal name is required.");
      if (!data.brandName.trim()) next.push("Public brand name is required.");
      if (!data.industry.trim()) next.push("Industry/trade is required.");
      if (!data.businessModel) next.push("Choose storefront, service-area business, or hybrid.");
      if (!data.primaryContact.trim()) next.push("Primary contact is required.");
      if (!/^\S+@\S+\.\S+$/.test(data.email)) next.push("Enter a valid contact email.");
    }
    if (step === 1 && core.length === 0) next.push("Add at least one core service.");
    if (step === 2 && !data.primaryCity.trim()) next.push("Primary city is required.");
    if (step === 4 && !data.baselineDate) next.push("Baseline date is required.");
    setErrors(next);
    return next.length === 0;
  }

  function next() {
    if (!validateCurrent()) return;
    setStep((value) => Math.min(steps.length - 1, value + 1));
  }

  function createCampaign() {
    if (!validateCurrent()) return;
    setSubmitted(true);
  }

  const roadmap = buildRoadmap(data);

  if (submitted) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-emerald-200 bg-white p-8 shadow-[var(--shadow-card)]">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Check className="h-6 w-6" /></div>
        <h1 className="mt-5 text-2xl font-semibold text-slate-950">Campaign draft created</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {data.brandName} has a validated onboarding record and a draft 90-day roadmap. In demo mode this stays in the browser; the Supabase schema on this branch is the production persistence target.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Summary label="Primary market" value={data.primaryCity} />
          <Summary label="Core services" value={String(core.length)} />
          <Summary label="Roadmap initiatives" value={String(roadmap.length)} />
        </div>
        <div className="mt-6 rounded-xl bg-slate-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Generated first 90 days</div>
          <ol className="mt-3 space-y-2">
            {roadmap.map((item, index) => <li key={item} className="flex gap-3 text-sm text-slate-700"><span className="font-semibold text-emerald-700">{index + 1}.</span>{item}</li>)}
          </ol>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/growth/campaigns" className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">Back to campaigns</Link>
          <button onClick={() => { setSubmitted(false); setStep(0); }} className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-slate-700">Edit onboarding</button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-5">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">Campaign onboarding</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">New home-service campaign</h1>
          <p className="mt-2 text-sm text-slate-600">Capture economics, market boundaries, access and baseline before strategy work starts.</p>
        </header>

        <div className="rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow-card)]">
          <div className="border-b border-[var(--border)] px-5 py-4">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-semibold text-slate-800">Step {step + 1} of {steps.length} · {steps[step]}</span>
              <span className="text-xs text-slate-500">{Math.round(((step + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
          </div>

          <div className="p-5 sm:p-6">
            {errors.length > 0 && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <div className="flex items-center gap-2 font-semibold"><CircleAlert className="h-4 w-4" />Fix these before continuing</div>
                <ul className="mt-2 list-disc space-y-1 pl-5">{errors.map((error) => <li key={error}>{error}</li>)}</ul>
              </div>
            )}

            {step === 0 && <ClientDetails data={data} set={set} />}
            {step === 1 && <ServicesEconomics data={data} set={set} />}
            {step === 2 && <LocalMarket data={data} set={set} />}
            {step === 3 && <AccessIntegrations data={data} set={set} />}
            {step === 4 && <Baseline data={data} set={set} roadmap={roadmap} />}
          </div>

          <div className="flex items-center justify-between border-t border-[var(--border)] px-5 py-4">
            <button onClick={() => { setErrors([]); setStep((value) => Math.max(0, value - 1)); }} disabled={step === 0} className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40"><ArrowLeft className="h-4 w-4" />Back</button>
            {step < steps.length - 1 ? (
              <button onClick={next} className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Continue<ArrowRight className="h-4 w-4" /></button>
            ) : (
              <button onClick={createCampaign} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"><Sparkles className="h-4 w-4" />Create campaign + roadmap</button>
            )}
          </div>
        </div>
      </div>

      <aside className="space-y-4 xl:pt-[88px]">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-card)]">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Onboarding map</div>
          <ol className="mt-4 space-y-2">
            {steps.map((label, index) => (
              <li key={label}>
                <button onClick={() => { setErrors([]); setStep(index); }} className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm ${index === step ? "bg-emerald-50 font-semibold text-emerald-800" : "text-slate-600 hover:bg-slate-50"}`}>
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${index < step ? "bg-emerald-600 text-white" : index === step ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-500"}`}>{index < step ? <Check className="h-3.5 w-3.5" /> : index + 1}</span>
                  {label}
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm text-blue-900">
          <div className="font-semibold">Why economics are captured</div>
          <p className="mt-2 leading-6 text-blue-800">Service priority, margin and job size influence keyword priority, content sequencing and which local markets deserve effort first. They do not create made-up revenue forecasts.</p>
        </div>
      </aside>
    </div>
  );
}

type Setter = <K extends keyof FormState>(key: K, value: FormState[K]) => void;

function ClientDetails({ data, set }: { data: FormState; set: Setter }) {
  return <div className="grid gap-4 sm:grid-cols-2">
    <Field label="Client legal name" required value={data.legalName} onChange={(value) => set("legalName", value)} />
    <Field label="Public brand name" required value={data.brandName} onChange={(value) => set("brandName", value)} />
    <Field label="Website" value={data.website} onChange={(value) => set("website", value)} placeholder="https://example.com" />
    <Field label="Industry / trade" required value={data.industry} onChange={(value) => set("industry", value)} placeholder="HVAC, plumbing, roofing…" />
    <Select label="Business model" required value={data.businessModel} onChange={(value) => set("businessModel", value as FormState["businessModel"])} options={["storefront", "service area", "hybrid"]} />
    <Field label="Primary contact" required value={data.primaryContact} onChange={(value) => set("primaryContact", value)} />
    <Field label="Contact email" required value={data.email} onChange={(value) => set("email", value)} type="email" />
    <Field label="Main business phone" value={data.phone} onChange={(value) => set("phone", value)} />
    <Field label="Business address" value={data.address} onChange={(value) => set("address", value)} />
    <Field label="Time zone" value={data.timezone} onChange={(value) => set("timezone", value)} />
    <Field label="Start date" value={data.startDate} onChange={(value) => set("startDate", value)} type="date" />
    <Select label="Contract status" value={data.contractStatus} onChange={(value) => set("contractStatus", value)} options={["active", "signed - pending", "month-to-month", "paused"]} />
  </div>;
}

function ServicesEconomics({ data, set }: { data: FormState; set: Setter }) {
  const services = data.coreServices;
  return <div className="space-y-6">
    <div>
      <div className="flex items-center justify-between"><Label>Core services</Label><button onClick={() => set("coreServices", [...services, ""])} className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><Plus className="h-3.5 w-3.5" />Add service</button></div>
      <div className="mt-2 space-y-2">{services.map((service, index) => <div key={index} className="grid gap-2 sm:grid-cols-[1fr_150px_auto]"><input value={service} onChange={(event) => set("coreServices", replaceAt(services, index, event.target.value))} placeholder="e.g. AC Replacement" className={inputClass} /><input value={data.averageTickets[service] ?? ""} onChange={(event) => set("averageTickets", { ...data.averageTickets, [service]: event.target.value })} placeholder="Avg ticket $" className={inputClass} /><button aria-label="Remove service" onClick={() => set("coreServices", services.filter((_, itemIndex) => itemIndex !== index))} className="rounded-lg border border-[var(--border)] px-3 text-slate-500"><X className="h-4 w-4" /></button></div>)}</div>
    </div>
    <div className="grid gap-5 lg:grid-cols-2"><ServiceChips title="Highest-priority services" options={services.filter(Boolean)} selected={data.priorityServices} onChange={(value) => set("priorityServices", value)} /><ServiceChips title="High-margin services" options={services.filter(Boolean)} selected={data.highMarginServices} onChange={(value) => set("highMarginServices", value)} /></div>
    <div className="grid gap-4 sm:grid-cols-3"><Field label="Minimum job size" value={data.minimumJobSize} onChange={(value) => set("minimumJobSize", value)} placeholder="$325" /><Select label="Customer mix" value={data.customerMix} onChange={(value) => set("customerMix", value as FormState["customerMix"])} options={["residential", "commercial", "both"]} /><Toggle label="Emergency services" checked={data.emergency} onChange={(value) => set("emergency", value)} /></div>
    <TextArea label="Licensing, insurance, warranty, financing, certifications" value={data.trustSignals} onChange={(value) => set("trustSignals", value)} placeholder="Only enter facts the client can substantiate." />
    <div className="grid gap-4 sm:grid-cols-2"><TextArea label="Seasonal notes" value={data.seasonalNotes} onChange={(value) => set("seasonalNotes", value)} /><TextArea label="Capacity constraints" value={data.capacityConstraints} onChange={(value) => set("capacityConstraints", value)} /></div>
  </div>;
}

function LocalMarket({ data, set }: { data: FormState; set: Setter }) {
  return <div className="space-y-5"><Field label="Primary city" required value={data.primaryCity} onChange={(value) => set("primaryCity", value)} placeholder="Washington, DC" /><div className="grid gap-5 lg:grid-cols-2"><ListField label="Target cities" values={data.targetCities} onChange={(values) => set("targetCities", values)} /><ListField label="Target ZIP codes" values={data.targetZips} onChange={(values) => set("targetZips", values)} /><ListField label="Service areas" values={data.serviceAreas} onChange={(values) => set("serviceAreas", values)} /><ListField label="Excluded areas" values={data.excludedAreas} onChange={(values) => set("excludedAreas", values)} /><ListField label="Priority markets" values={data.priorityMarkets} onChange={(values) => set("priorityMarkets", values)} /><ListField label="Competitor domains / GBP URLs" values={data.competitors} onChange={(values) => set("competitors", values)} /></div></div>;
}

function AccessIntegrations({ data, set }: { data: FormState; set: Setter }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-sm"><thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500"><tr><th className="rounded-l-lg px-3 py-3">System</th><th className="px-3 py-3">Access status</th><th className="rounded-r-lg px-3 py-3">Operating note</th></tr></thead><tbody className="divide-y divide-[var(--border)]">{integrationNames.map((name) => <tr key={name}><td className="px-3 py-3 font-semibold text-slate-800">{name}</td><td className="px-3 py-3"><select aria-label={`${name} access status`} value={data.integrations[name]} onChange={(event) => set("integrations", { ...data.integrations, [name]: event.target.value as (typeof accessStates)[number] })} className="h-9 rounded-lg border border-[var(--border)] bg-white px-2 text-sm">{accessStates.map((state) => <option key={state}>{state}</option>)}</select></td><td className="px-3 py-3 text-slate-500">{data.integrations[name] === "blocked" ? "Create an access client request and dependency automatically." : data.integrations[name] === "connected" ? "Eligible for freshness/sync monitoring." : "Demo data remains available until connected."}</td></tr>)}</tbody></table></div>;
}

function Baseline({ data, set, roadmap }: { data: FormState; set: Setter; roadmap: string[] }) {
  return <div className="space-y-6"><div className="grid gap-4 sm:grid-cols-2"><Field label="Baseline date" required value={data.baselineDate} onChange={(value) => set("baselineDate", value)} type="date" /><ListField label="Main KPIs" values={data.kpis} onChange={(values) => set("kpis", values)} /></div><div className="grid gap-5 lg:grid-cols-2"><ListField label="Primary keyword clusters" values={data.keywordClusters} onChange={(values) => set("keywordClusters", values)} /><ListField label="Target landing pages" values={data.landingPages} onChange={(values) => set("landingPages", values)} /></div><TextArea label="Initial notes" value={data.initialNotes} onChange={(value) => set("initialNotes", value)} /><div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"><div className="flex items-center gap-2 font-semibold text-emerald-900"><Sparkles className="h-4 w-4" />Draft 90-day roadmap preview</div><p className="mt-1 text-xs text-emerald-800">Generated from the supplied services, access state, business model and market. It stays draft until a strategist approves it.</p><ol className="mt-3 space-y-2">{roadmap.map((item, index) => <li key={item} className="flex gap-2 text-sm text-emerald-950"><span className="font-bold">{index + 1}.</span>{item}</li>)}</ol></div></div>;
}

function buildRoadmap(data: FormState) {
  const topService = data.priorityServices[0] || data.coreServices.find(Boolean) || "priority service";
  const blocked = Object.entries(data.integrations).filter(([, value]) => value === "blocked" || value === "requested").map(([name]) => name);
  const list = [
    `Validate the baseline for ${topService} across ${data.primaryCity || "the primary market"}: rankings, GBP, organic traffic and leads.`,
    `Complete GBP, citation/NAP, technical, on-page/conversion and local competitor audits before publishing strategy.`,
    `Map high-business-value service + market keyword clusters to one preferred landing page each and flag cannibalization.`,
    `Build or strengthen real-proof service content around ${topService}; require client facts/assets instead of city-swapped doorway copy.`,
    `Launch a policy-compliant review velocity program and citation accuracy queue.`,
  ];
  if (blocked.length) list.splice(1, 0, `Resolve access dependencies: ${blocked.join(", ")}. Keep affected reporting clearly marked unavailable/stale until verified.`);
  if (data.emergency) list.push("Separate emergency-intent keywords, landing pages, calls and conversion reporting from routine service demand.");
  return list.slice(0, 7);
}

const inputClass = "h-10 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100";
function Label({ children }: { children: React.ReactNode }) { return <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">{children}</div>; }
function Field({ label, value, onChange, placeholder, required, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; required?: boolean; type?: string }) { return <label className="block"><Label>{label}{required ? " *" : ""}</Label><input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={`mt-1.5 ${inputClass}`} /></label>; }
function TextArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) { return <label className="block"><Label>{label}</Label><textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={3} className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" /></label>; }
function Select({ label, value, onChange, options, required }: { label: string; value: string; onChange: (value: string) => void; options: string[]; required?: boolean }) { return <label className="block"><Label>{label}{required ? " *" : ""}</Label><select value={value} onChange={(event) => onChange(event.target.value)} className={`mt-1.5 ${inputClass}`}><option value="">Select…</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>; }
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) { return <label className="flex h-[62px] items-end"><button type="button" onClick={() => onChange(!checked)} className={`flex h-10 w-full items-center justify-between rounded-lg border px-3 text-sm font-medium ${checked ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-[var(--border)] bg-white text-slate-600"}`}><span>{label}</span><span className={`relative h-5 w-9 rounded-full ${checked ? "bg-emerald-600" : "bg-slate-300"}`}><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${checked ? "left-[18px]" : "left-0.5"}`} /></span></button></label>; }
function ServiceChips({ title, options, selected, onChange }: { title: string; options: string[]; selected: string[]; onChange: (values: string[]) => void }) { return <div><Label>{title}</Label><div className="mt-2 flex flex-wrap gap-2">{options.length ? options.map((option) => { const active = selected.includes(option); return <button key={option} onClick={() => onChange(active ? selected.filter((value) => value !== option) : [...selected, option])} className={`rounded-lg border px-3 py-2 text-sm ${active ? "border-emerald-300 bg-emerald-50 font-semibold text-emerald-800" : "border-[var(--border)] text-slate-600"}`}>{active ? "✓ " : ""}{option}</button>; }) : <span className="text-sm text-slate-500">Add core services first.</span>}</div></div>; }
function ListField({ label, values, onChange }: { label: string; values: string[]; onChange: (values: string[]) => void }) { return <div><div className="flex items-center justify-between"><Label>{label}</Label><button onClick={() => onChange([...values, ""])} className="text-xs font-semibold text-emerald-700">+ Add</button></div><div className="mt-2 space-y-2">{values.map((value, index) => <div key={index} className="flex gap-2"><input value={value} onChange={(event) => onChange(replaceAt(values, index, event.target.value))} className={inputClass} /><button aria-label={`Remove ${label} row`} onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))} className="rounded-lg border border-[var(--border)] px-3 text-slate-500"><X className="h-4 w-4" /></button></div>)}</div></div>; }
function replaceAt(values: string[], index: number, value: string) { return values.map((item, itemIndex) => itemIndex === index ? value : item); }
function Summary({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-slate-50 p-3"><div className="text-xs text-slate-500">{label}</div><div className="mt-1 font-semibold text-slate-900">{value || "—"}</div></div>; }
