"use client";

import * as React from "react";
import {
  Building2,
  BellRing,
  SlidersHorizontal,
  Users,
  CreditCard,
  Check,
  Plus,
  Database,
  Plug,
  Loader2,
  ArrowUpRight,
  Upload,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { team } from "@/lib/model";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { playbooks } from "@/lib/data";

const SECTIONS = [
  { id: "workspace", label: "Workspace", icon: Building2 },
  { id: "skills", label: "Skills", icon: GraduationCap },
  { id: "data", label: "SEO Data", icon: Database },
  { id: "notifications", label: "Notifications", icon: BellRing },
  { id: "scoring", label: "Scoring", icon: SlidersHorizontal },
  { id: "team", label: "Team", icon: Users },
  { id: "plan", label: "Plan & Billing", icon: CreditCard },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

export function SettingsView() {
  const [section, setSection] = React.useState<SectionId>("workspace");
  const [dirty, setDirty] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const touch = () => {
    setDirty(true);
    setSaved(false);
  };
  const save = () => {
    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
      {/* Sub-nav */}
      <nav className="lg:sticky lg:top-20 lg:self-start">
        <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            const on = section === s.id;
            return (
              <li key={s.id}>
                <button
                  onClick={() => setSection(s.id)}
                  className={cn(
                    "flex w-full items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors",
                    on
                      ? "bg-accent-50 font-medium text-accent-700"
                      : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {s.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="space-y-6">
        {section === "workspace" && <Workspace onChange={touch} />}
        {section === "skills" && <Skills onChange={touch} />}
        {section === "data" && <DataSources />}
        {section === "notifications" && <Notifications onChange={touch} />}
        {section === "scoring" && <Scoring onChange={touch} />}
        {section === "team" && <Team />}
        {section === "plan" && <Plan />}

        {/* Save bar */}
        <div className="sticky bottom-4 flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-white/90 px-4 py-3 shadow-card backdrop-blur">
          <span className="text-sm text-slate-700">
            {saved ? (
              <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600">
                <Check className="h-4 w-4" /> All changes saved
              </span>
            ) : dirty ? (
              "You have unsaved changes"
            ) : (
              "Everything up to date"
            )}
          </span>
          <Button size="sm" onClick={save} disabled={!dirty}>
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Sections ────────────────────────────────────────────────────────────────
function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <Card className="p-6">
      <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">{title}</h3>
      {desc && <p className="mt-1 text-sm text-slate-700">{desc}</p>}
      <div className="mt-5 space-y-5">{children}</div>
    </Card>
  );
}

function Field({
  label,
  defaultValue,
  onChange,
  hint,
}: {
  label: string;
  defaultValue?: string;
  onChange: () => void;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-700">{label}</span>
      <input
        defaultValue={defaultValue}
        onChange={onChange}
        className="h-10 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100"
      />
      {hint && <span className="mt-1 block text-xs text-slate-600">{hint}</span>}
    </label>
  );
}

function SelectField({
  label,
  options,
  defaultValue,
  onChange,
}: {
  label: string;
  options: string[];
  defaultValue?: string;
  onChange: () => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-700">{label}</span>
      <select
        defaultValue={defaultValue}
        onChange={onChange}
        className="h-10 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function ToggleRow({
  title,
  desc,
  defaultOn,
  onChange,
}: {
  title: string;
  desc: string;
  defaultOn: boolean;
  onChange: () => void;
}) {
  const [on, setOn] = React.useState(defaultOn);
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-sm font-medium text-slate-800">{title}</div>
        <div className="text-xs text-slate-700">{desc}</div>
      </div>
      <Switch
        checked={on}
        onChange={(v) => {
          setOn(v);
          onChange();
        }}
        label={title}
      />
    </div>
  );
}

function Workspace({ onChange }: { onChange: () => void }) {
  return (
    <Section title="Workspace" desc="How the OS identifies your agency and the active engagement.">
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-600 text-lg font-bold text-white">
          MA
        </span>
        <div>
          <Button variant="secondary" size="sm">Upload logo</Button>
          <p className="mt-1.5 text-xs text-slate-600">PNG or SVG, up to 1MB.</p>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Agency name" defaultValue="Meridian Agency" onChange={onChange} />
        <Field label="Active client" defaultValue="Northwind Heating & Air" onChange={onChange} />
        <Field label="Primary domain" defaultValue="northwindhvac.com" onChange={onChange} />
        <SelectField
          label="Default SEO model"
          options={["Local", "SaaS", "Enterprise"]}
          defaultValue="Local"
          onChange={onChange}
        />
        <SelectField
          label="Timezone"
          options={["Central (CT)", "Eastern (ET)", "Mountain (MT)", "Pacific (PT)"]}
          defaultValue="Central (CT)"
          onChange={onChange}
        />
        <SelectField
          label="Currency"
          options={["USD ($)", "EUR (€)", "GBP (£)"]}
          defaultValue="USD ($)"
          onChange={onChange}
        />
      </div>
    </Section>
  );
}

// ── Skills ──────────────────────────────────────────────────────────────────
// Top level = the business BENEFIT the client buys (Traffic, Leads, Revenue, AI
// mentions/recommendations). The playbook is the outcome that delivers it; the
// plays are the related skills (the effect) nested underneath. These are the
// capabilities you select in Playbooks before the Project Brief.
type Benefit = { benefit: string; tag: string; ringTone: string };

const BENEFITS: Record<string, Benefit> = {
  traffic: { benefit: "More Organic Traffic", tag: "Traffic", ringTone: "bg-blue-50 text-blue-700 ring-blue-200" },
  ctr: { benefit: "More Clicks", tag: "CTR", ringTone: "bg-cyan-50 text-cyan-700 ring-cyan-200" },
  lead: { benefit: "More Qualified Leads", tag: "Leads", ringTone: "bg-amber-50 text-amber-700 ring-amber-200" },
  revenue: { benefit: "More Revenue", tag: "Revenue", ringTone: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  local: { benefit: "Local Market Dominance", tag: "Local", ringTone: "bg-rose-50 text-rose-700 ring-rose-200" },
  geo: { benefit: "AI Mentions", tag: "GEO", ringTone: "bg-violet-50 text-violet-700 ring-violet-200" },
  aeo: { benefit: "AI Recommendations", tag: "AEO", ringTone: "bg-indigo-50 text-indigo-700 ring-indigo-200" },
};

const BENEFIT_GOAL: Record<string, string> = {
  geo: "Get the brand mentioned across AI engines and the knowledge graph.",
  aeo: "Get cited and recommended inside AI answers and featured results.",
};

function Skills({ onChange }: { onChange: () => void }) {
  const [on, setOn] = React.useState<Record<string, boolean>>(
    () => Object.fromEntries(playbooks.map((p) => [p.key, true]))
  );
  const toggle = (key: string) => {
    setOn((s) => ({ ...s, [key]: !s[key] }));
    onChange();
  };
  const active = Object.values(on).filter(Boolean).length;

  return (
    <Section
      title="Skills"
      desc="The top-level benefits this workspace delivers · what the business actually buys. Each benefit is powered by a playbook; the related skills underneath are how it gets done. Select these in Playbooks before the Project Brief."
    >
      <div className="flex items-center justify-between">
        <Badge variant="good">{active} of {playbooks.length} benefits active</Badge>
        <Link href="/tools" className="inline-flex items-center gap-1 text-sm font-medium text-accent-600 hover:text-accent-700">
          Select in Playbooks <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {playbooks.map((p) => {
          const b = BENEFITS[p.key] ?? { benefit: p.name, tag: p.name, ringTone: "bg-slate-100 text-slate-700 ring-slate-200" };
          const enabled = on[p.key];
          const goal = BENEFIT_GOAL[p.key] ?? p.goal;
          return (
            <div
              key={p.key}
              className={cn(
                "rounded-xl border p-5 transition-colors",
                enabled ? "border-[var(--border)] bg-white" : "border-dashed border-slate-200 bg-slate-50/60"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn("text-[15px] font-semibold", enabled ? "text-slate-900" : "text-slate-600")}>
                      {b.benefit}
                    </span>
                    <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset", b.ringTone, !enabled && "opacity-50")}>
                      {b.tag}
                    </span>
                  </div>
                  <p className={cn("mt-1 text-sm", enabled ? "text-slate-700" : "text-slate-500")}>{goal}</p>
                </div>
                <Switch checked={enabled} onChange={() => toggle(p.key)} label={b.benefit} />
              </div>

              <div className="mt-4 border-t border-[var(--border)] pt-3">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Related skills
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {p.plays.map((play) => (
                    <span
                      key={play}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium",
                        enabled ? "bg-slate-100 text-slate-700" : "bg-slate-100 text-slate-500"
                      )}
                    >
                      {play}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

type DataConn = {
  id: string;
  name: string;
  desc: string;
  initials: string;
  color: string;
  connected: boolean;
  account?: string;
  uploadOnly?: boolean;
};

function DataSources() {
  const [conns, setConns] = React.useState<DataConn[]>([
    { id: "gsc", name: "Google Search Console", desc: "Queries, clicks, impressions, indexation.", initials: "SC", color: "bg-emerald-500", connected: true, account: "sc-domain:northwindhvac.com" },
    { id: "ga4", name: "Google Analytics 4", desc: "Sessions, conversions, channels.", initials: "GA", color: "bg-amber-500", connected: true, account: "GA4 · 312,480 sessions / 90d" },
    { id: "semrush", name: "Semrush", desc: "Keyword, backlink and competitor data.", initials: "SE", color: "bg-orange-600", connected: true, account: "Project: Northwind Heating & Air" },
    { id: "psi", name: "PageSpeed Insights", desc: "Core Web Vitals and Lighthouse audits.", initials: "PS", color: "bg-blue-500", connected: false },
    { id: "ahrefs", name: "Ahrefs", desc: "Backlinks, referring domains, rank tracking.", initials: "AH", color: "bg-blue-600", connected: false },
    { id: "sf", name: "Screaming Frog", desc: "Technical crawl data via manual export.", initials: "SF", color: "bg-green-600", connected: false, uploadOnly: true },
  ]);
  const [pending, setPending] = React.useState<string | null>(null);

  const connect = (id: string) => {
    setPending(id);
    setTimeout(() => {
      setConns((cs) => cs.map((c) => (c.id === id ? { ...c, connected: true, account: c.account ?? "Connected just now" } : c)));
      setPending(null);
    }, 800);
  };
  const disconnect = (id: string) =>
    setConns((cs) => cs.map((c) => (c.id === id ? { ...c, connected: false } : c)));

  const connected = conns.filter((c) => c.connected).length;

  return (
    <Section title="SEO data connections" desc="Sources that feed the research, investigation and scoring engines.">
      <div className="flex items-center justify-between">
        <Badge variant="good">{connected} connected</Badge>
        <Link href="/integrations" className="inline-flex items-center gap-1 text-sm font-medium text-accent-600 hover:text-accent-700">
          All integrations <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <ul className="divide-y divide-[var(--border)]">
        {conns.map((c) => (
          <li key={c.id} className="flex items-center justify-between gap-3 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white", c.color)}>
                {c.initials}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium text-slate-800">{c.name}</span>
                  {c.connected && <Badge variant="good"><Check className="h-3 w-3" /> Connected</Badge>}
                  {c.uploadOnly && !c.connected && <Badge variant="outline">Upload</Badge>}
                </div>
                <div className="truncate text-xs text-slate-600">{c.connected ? c.account : c.desc}</div>
              </div>
            </div>
            {c.connected ? (
              <Button size="sm" variant="ghost" onClick={() => disconnect(c.id)}>Disconnect</Button>
            ) : c.uploadOnly ? (
              <Button size="sm" variant="secondary"><Upload className="h-4 w-4" /> Upload</Button>
            ) : (
              <Button size="sm" onClick={() => connect(c.id)} disabled={pending === c.id}>
                {pending === c.id ? <><Loader2 className="h-4 w-4 animate-spin" /> …</> : <><Plug className="h-4 w-4" /> Connect</>}
              </Button>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Notifications({ onChange }: { onChange: () => void }) {
  return (
    <>
      <Section title="Daily task alerts" desc="The email reminders from the Daily Task Engine (Stage 9).">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Send digests to" defaultValue="alerts@northwindhvac.com" onChange={onChange} />
          <SelectField
            label="Morning digest time"
            options={["7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM"]}
            defaultValue="8:00 AM"
            onChange={onChange}
          />
        </div>
        <div className="space-y-4 border-t border-[var(--border)] pt-5">
          <ToggleRow title="Morning digest" desc="Today's tasks, owners and due times." defaultOn onChange={onChange} />
          <ToggleRow title="Midday nudge" desc="Anything still open and due today." defaultOn onChange={onChange} />
          <ToggleRow title="Overdue alerts" desc="Escalate past-due tasks to the owner." defaultOn onChange={onChange} />
          <ToggleRow title="End-of-day recap" desc="Completed, carried over, and the streak." defaultOn={false} onChange={onChange} />
        </div>
      </Section>
      <Section title="Channels" desc="Where alerts are delivered.">
        <ToggleRow title="Email" desc="Daily digests and overdue alerts." defaultOn onChange={onChange} />
        <ToggleRow title="Slack" desc="Post to #seo-northwind." defaultOn onChange={onChange} />
        <ToggleRow title="SMS" desc="Text overdue alerts (requires Twilio)." defaultOn={false} onChange={onChange} />
      </Section>
      <Section title="Reports" desc="Recurring intelligence reports.">
        <ToggleRow title="Weekly score summary" desc="Visibility, trust, authority and AI scores." defaultOn onChange={onChange} />
        <ToggleRow title="Monthly strategy review" desc="Diagnosis re-run and forecast update." defaultOn onChange={onChange} />
      </Section>
    </>
  );
}

function Scoring({ onChange }: { onChange: () => void }) {
  const [good, setGood] = React.useState(75);
  const [warn, setWarn] = React.useState(50);
  return (
    <Section title="Score thresholds" desc="Where scores turn green, amber and red across the OS.">
      <Slider
        label="Healthy (green) at or above"
        value={good}
        tone="bg-emerald-500"
        onChange={(v) => {
          setGood(v);
          onChange();
        }}
      />
      <Slider
        label="Warning (amber) at or above"
        value={warn}
        tone="bg-amber-500"
        onChange={(v) => {
          setWarn(v);
          onChange();
        }}
      />
      <div className="flex items-center gap-2 rounded-lg bg-[var(--surface-2)] p-3 text-xs text-slate-700">
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500" /> Below {warn}</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /> {warn} · {good - 1}</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> {good}+</span>
      </div>
    </Section>
  );
}

function Slider({
  label,
  value,
  tone,
  onChange,
}: {
  label: string;
  value: number;
  tone: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-slate-700">{label}</span>
        <span className="font-semibold text-slate-800">{value}</span>
      </div>
      <input
        type="range"
        aria-label={label}
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn("h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-accent-500")}
      />
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={cn("h-full rounded-full", tone)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Team() {
  return (
    <Section title="Team" desc="People with access to this workspace.">
      <ul className="divide-y divide-[var(--border)]">
        {team.map((m) => (
          <li key={m.id} className="flex items-center justify-between gap-3 py-3">
            <div className="flex items-center gap-3">
              <span className={cn("flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white", m.color)}>
                {m.initials}
              </span>
              <div>
                <div className="text-sm font-medium text-slate-800">{m.name}</div>
                <div className="text-xs text-slate-600">{m.email}</div>
              </div>
            </div>
            <Badge variant={m.id === "josh" ? "accent" : "outline"}>{m.role}</Badge>
          </li>
        ))}
      </ul>
      <Button variant="secondary" size="sm">
        <Plus className="h-4 w-4" />
        Invite teammate
      </Button>
    </Section>
  );
}

function Plan() {
  return (
    <Section title="Plan & Billing" desc="Your subscription and usage.">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-accent-200 bg-accent-50/50 p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-slate-900">Agency</span>
            <Badge variant="accent">Current plan</Badge>
          </div>
          <p className="mt-1 text-sm text-slate-700">Up to 25 clients · all SEO models · AEO module</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold text-slate-900">$499<span className="text-sm font-normal text-slate-600">/mo</span></div>
          <Button variant="secondary" size="sm" className="mt-1">Manage billing</Button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Usage label="Clients" value="4 / 25" pct={16} />
        <Usage label="Tracked keywords" value="1,860 / 5,000" pct={37} />
        <Usage label="Daily alerts sent" value="312 this month" pct={62} />
      </div>
    </Section>
  );
}

function Usage({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white p-4">
      <div className="text-xs text-slate-600">{label}</div>
      <div className="mt-0.5 text-sm font-semibold text-slate-800">{value}</div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-accent-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
