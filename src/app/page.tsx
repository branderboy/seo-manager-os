import Link from "next/link";
import {
  Home,
  Target,
  Building2,
  Briefcase,
  CheckSquare,
  BarChart3,
  Settings,
  MoreVertical,
  Search,
  HelpCircle,
  Plus,
  Bell,
  Star,
  Activity as ActivityIcon,
  FileText,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { cn, scoreToneClasses } from "@/lib/utils";
import {
  currentUser,
  featuredInvestigation as inv,
  clientById,
  personById,
  money,
} from "@/lib/model";

const client = clientById(inv.clientId)!;
const contact = personById(inv.primaryContactId)!;

const NAV_TOP = [
  { label: "Dashboard", icon: Home, href: "/", active: true },
  { label: "Investigations", icon: Target, href: "/investigation" },
  { label: "Clients", icon: Building2, href: "/clients" },
  { label: "Strategy Briefs", icon: Briefcase, href: "/strategy" },
];
const NAV_MID = [
  { label: "Tasks", icon: CheckSquare, href: "/tasks" },
  { label: "Reports", icon: BarChart3, href: "/reports" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

const SCORES: { key: keyof typeof inv.scores; label: string }[] = [
  { key: "visibility", label: "Visibility" },
  { key: "trust", label: "Trust" },
  { key: "authority", label: "Authority" },
  { key: "ai", label: "AI" },
  { key: "lead", label: "Lead" },
  { key: "revenue", label: "Revenue" },
];

export default function HomePage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F5F6] font-sans text-gray-900">
      {/* SIDEBAR */}
      <aside className="flex h-full w-[240px] shrink-0 flex-col bg-brand-600">
        <div className="flex h-[72px] items-center gap-3 border-b border-white/10 px-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 font-bold text-white ring-1 ring-white/25">
            {currentUser.initials}
          </span>
          <div className="truncate">
            <div className="truncate text-sm font-medium text-white">{currentUser.name}</div>
            <div className="truncate text-xs text-white/60">{currentUser.agency}</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-3">
          {NAV_TOP.map((n) => <NavItem key={n.label} {...n} />)}
          <div className="my-2 border-t border-white/10" />
          {NAV_MID.map((n) => <NavItem key={n.label} {...n} />)}
        </nav>
        <div className="flex items-center justify-between border-t border-white/10 p-4">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wide text-white">
            <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-white">
              <span className="h-3 w-3 rounded-sm bg-brand-800" />
            </span>
            SEO MANAGER OS
          </div>
          <MoreVertical className="h-4 w-4 text-white/60" />
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Green header */}
        <header className="flex h-[56px] shrink-0 items-center justify-between bg-[#4CAF50] px-4">
          <div className="flex max-w-3xl flex-1 items-center gap-6">
            <span className="text-lg font-medium text-white">Dashboard</span>
            <div className="relative max-w-xl flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
              <input
                placeholder="Search"
                className="w-full rounded-md border border-transparent bg-black/10 py-1.5 pl-9 pr-4 text-sm text-white placeholder-white/70 outline-none hover:bg-black/20 focus:bg-white focus:text-gray-900"
              />
            </div>
          </div>
          <div className="flex items-center gap-5 text-white/90">
            <div className="hidden text-sm md:block">
              Trial ends in <span className="font-bold text-white">{currentUser.trialDays} days</span>
            </div>
            <HelpCircle className="h-5 w-5" />
            <Plus className="h-[22px] w-[22px]" />
            <Bell className="h-5 w-5" />
          </div>
        </header>

        {/* WORKSPACE — laid out for glanceability: identity → scores → detail */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl space-y-5 p-6">
            {/* 1 — Record identity (read first) */}
            <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className={cn("flex h-12 w-12 items-center justify-center rounded-lg text-sm font-bold text-white", client.color)}>
                    {client.initials}
                  </span>
                  <div>
                    <h1 className="text-xl font-semibold tracking-tight text-gray-900">{inv.name}</h1>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500">
                      <Link href="/clients" className="font-medium text-blue-600 hover:underline">{client.name}</Link>
                      <span>·</span><span>{inv.model} SEO</span>
                      <span>·</span><span className="font-semibold text-gray-700">{money(inv.value)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Pill tone="open">{inv.status}</Pill>
                  <Pill tone="stage">{inv.stageLabel}</Pill>
                  <Star className="h-[18px] w-[18px] fill-current text-yellow-400" />
                </div>
              </div>
              {/* Stage progress — one glance shows how far along */}
              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
                  <span>Stage {inv.currentStage} of 9 · {inv.owner}</span>
                  <span className="font-medium text-gray-700">{inv.progress}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-[#4CAF50]" style={{ width: `${inv.progress}%` }} />
                </div>
              </div>
            </section>

            {/* 2 — Scores: the at-a-glance numbers */}
            <section>
              <SectionLabel>Search health</SectionLabel>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {SCORES.map((s) => {
                  const v = inv.scores[s.key];
                  return (
                    <div key={s.key} className="rounded-lg border border-gray-200 bg-white p-3.5 shadow-sm">
                      <div className="text-[11px] font-medium uppercase tracking-wide text-gray-400">{s.label}</div>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-2xl font-semibold tracking-tight text-gray-900">{v}</span>
                        <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-semibold ring-1 ring-inset", scoreToneClasses(v))}>
                          {v >= 75 ? "Good" : v >= 50 ? "Fair" : "Low"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 3 — Root cause callout (the "why", blue outline) */}
            <section className="flex flex-wrap items-center justify-between gap-4 rounded-lg border-2 border-accent-500 bg-transparent p-5">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-wide text-accent-600">Primary root cause</div>
                <div className="mt-0.5 text-lg font-semibold text-gray-900">{inv.rootCause.title}</div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <div className="text-gray-400">Confidence</div>
                  <div className="text-lg font-semibold text-gray-900">{inv.rootCause.confidence}%</div>
                </div>
                <div>
                  <div className="text-gray-400">Impact</div>
                  <div className="text-lg font-semibold text-gray-900">{inv.rootCause.impact}</div>
                </div>
                <Link href="/diagnosis" className="inline-flex items-center gap-1 rounded-lg border border-accent-500 px-3 py-2 text-sm font-medium text-accent-700 hover:bg-accent-50">
                  Diagnosis <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </section>

            {/* 4 — Grouped detail: details · activity · related */}
            <div className="grid gap-5 lg:grid-cols-3">
              {/* Details */}
              <Panel title="Details" icon={FileText}>
                <DetailRow label="Pipeline" value={inv.pipeline} />
                <DetailRow label="Stage" value={inv.stageLabel} />
                <DetailRow label="Target date" value={inv.target} />
                <DetailRow label="Source" value={inv.source} />
                <DetailRow label="Owner" value={inv.owner} />
                <div className="pt-3">
                  <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-gray-400">Primary contact</div>
                  <div className="flex items-center gap-3">
                    <span className={cn("flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white", contact.color)}>
                      {contact.initials}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-blue-600">{contact.name}</div>
                      <div className="truncate text-xs text-gray-500">{contact.title} · {contact.email}</div>
                    </div>
                  </div>
                </div>
              </Panel>

              {/* Activity */}
              <Panel title="Activity" icon={ActivityIcon} count={inv.activity.length}>
                <ol className="space-y-3">
                  {inv.activity.map((a) => (
                    <li key={a.id} className="flex items-start gap-3">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4CAF50]" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-800">{a.text}</p>
                        <p className="text-xs text-gray-400">{a.day} · {a.time}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Panel>

              {/* Related */}
              <Panel title="Related" icon={Briefcase}>
                <RelatedGroup label="Tasks" count={inv.tasks.length}>
                  {inv.tasks.slice(0, 3).map((t) => (
                    <li key={t.id} className="flex items-center justify-between gap-2 py-1.5">
                      <span className="flex items-center gap-2 truncate text-sm text-gray-700">
                        <CheckSquare className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                        <span className="truncate">{t.title}</span>
                      </span>
                      <span className="shrink-0 text-xs text-gray-400">{t.due}</span>
                    </li>
                  ))}
                </RelatedGroup>
                <RelatedGroup label="Files" count={inv.files.length}>
                  {inv.files.map((f) => (
                    <li key={f.id} className="flex items-center justify-between gap-2 py-1.5 text-sm text-gray-700">
                      <span className="flex items-center gap-2 truncate"><FileText className="h-3.5 w-3.5 shrink-0 text-gray-400" /><span className="truncate">{f.name}</span></span>
                      <span className="shrink-0 text-xs text-gray-400">{f.size}</span>
                    </li>
                  ))}
                </RelatedGroup>
                <RelatedGroup label="Strategy briefs" count={inv.briefs.length}>
                  {inv.briefs.map((b) => (
                    <li key={b.id} className="flex items-center justify-between gap-2 py-1.5 text-sm text-gray-700">
                      <span className="flex items-center gap-2 truncate"><Briefcase className="h-3.5 w-3.5 shrink-0 text-gray-400" /><span className="truncate">{b.title}</span></span>
                      <Pill tone="stage">{b.status}</Pill>
                    </li>
                  ))}
                </RelatedGroup>
              </Panel>
            </div>

            <div className="flex items-center gap-1 pb-2 text-xs text-gray-400">
              <Clock className="h-3 w-3" /> Synced {inv.synced}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ label, icon: Icon, href, active }: { label: string; icon: React.ComponentType<{ className?: string }>; href: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3.5 border-l-4 py-2.5 text-sm transition-colors",
        active ? "border-white bg-white/10 pl-5 font-medium text-white" : "border-transparent pl-6 text-white/85 hover:bg-white/5"
      )}
    >
      <Icon className={cn("h-[18px] w-[18px]", active ? "text-white" : "text-white/70")} />
      {label}
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="mb-2 px-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">{children}</div>;
}

function Panel({ title, icon: Icon, count, children }: { title: string; icon: React.ComponentType<{ className?: string }>; count?: number; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
        <Icon className="h-4 w-4 text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        {typeof count === "number" && <span className="text-xs text-gray-400">({count})</span>}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-2 last:border-0">
      <span className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-800">{value}</span>
    </div>
  );
}

function RelatedGroup({ label, count, children }: { label: string; count: number; children: React.ReactNode }) {
  return (
    <div className="border-b border-gray-100 py-2 last:border-0">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</span>
        <span className="text-xs text-gray-400">{count}</span>
      </div>
      {count > 0 ? <ul className="divide-y divide-gray-50">{children}</ul> : <p className="py-1 text-xs text-gray-300">None</p>}
    </div>
  );
}

function Pill({ tone, children }: { tone: "open" | "stage"; children: React.ReactNode }) {
  const cls = tone === "open"
    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
    : "bg-slate-100 text-slate-600 ring-slate-200";
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset", cls)}>{children}</span>;
}
