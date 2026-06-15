"use client";

import * as React from "react";
import Link from "next/link";
import {
  X,
  Home,
  Target,
  Users,
  Building2,
  DollarSign,
  Briefcase,
  CheckSquare,
  Mail,
  BarChart3,
  Settings,
  MoreVertical,
  Search,
  HelpCircle,
  Plus,
  Bell,
  Star,
  ChevronDown,
  RefreshCw,
  User,
  FileText,
} from "lucide-react";

type NavItem = { label: string; icon: React.ComponentType<{ className?: string }>; href?: string; active?: boolean };

const NAV_TOP: NavItem[] = [
  { label: "Dashboard", icon: Home, href: "/clients" },
  { label: "Investigations", icon: Target, active: true },
  { label: "People", icon: Users },
  { label: "Clients", icon: Building2, href: "/clients" },
  { label: "Opportunities", icon: DollarSign },
  { label: "Strategy Briefs", icon: Briefcase, href: "/strategy" },
];
const NAV_MID: NavItem[] = [
  { label: "Tasks", icon: CheckSquare, href: "/tasks" },
  { label: "My Tracked Emails", icon: Mail, href: "/integrations" },
  { label: "Reports", icon: BarChart3, href: "/measurement" },
];

function Avatar({ initials, color, size = "h-10 w-10" }: { initials: string; color: string; size?: string }) {
  return (
    <span className={`flex ${size} shrink-0 items-center justify-center rounded-full ${color} text-xs font-bold text-white`}>
      {initials}
    </span>
  );
}

export default function FirstPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-white font-sans text-gray-900">
      {/* SIDEBAR */}
      <aside className="flex h-full w-[240px] shrink-0 flex-col bg-[#333D49]">
        {/* Profile */}
        <div className="flex h-[72px] cursor-pointer items-center justify-between border-b border-white/10 px-4 hover:bg-white/5">
          <div className="flex items-center gap-3 overflow-hidden">
            <Avatar initials="JW" color="bg-gray-400" />
            <div className="truncate">
              <div className="truncate text-sm font-medium text-white">Josh Williamson</div>
              <div className="truncate text-xs text-slate-400">Boring SEO Agency</div>
            </div>
          </div>
          <X className="h-4 w-4 shrink-0 text-slate-400 hover:text-white" />
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-4">
          {NAV_TOP.map((n) => (
            <NavButton key={n.label} item={n} />
          ))}
          <div className="my-2 border-t border-white/10" />
          {NAV_MID.map((n) => (
            <NavButton key={n.label} item={n} />
          ))}
          <div className="my-2 border-t border-white/10" />
          <div className="flex items-center justify-between pr-4">
            <NavButton item={{ label: "Settings", icon: Settings, href: "/settings" }} className="flex-1" />
            <button className="shrink-0 rounded bg-[#2196F3] px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-blue-500">
              PURCHASE
            </button>
          </div>
        </div>

        {/* Branding footer */}
        <div className="flex items-center justify-between border-t border-white/10 p-4">
          <div className="flex items-center gap-2 text-sm font-bold tracking-wide text-white">
            <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-white">
              <span className="h-3 w-3 rounded-sm bg-[#333D49]" />
            </span>
            <span>SEO MANAGER OS</span>
          </div>
          <MoreVertical className="h-4 w-4 text-slate-400" />
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Green header */}
        <header className="flex h-[56px] shrink-0 items-center justify-between bg-[#4CAF50] px-4">
          <div className="flex max-w-3xl flex-1 items-center gap-6">
            <span className="text-lg font-medium text-white">Investigations</span>
            <div className="relative max-w-xl flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
              <input
                placeholder="Search"
                className="w-full rounded-md border border-transparent bg-black/10 py-1.5 pl-9 pr-4 text-sm text-white placeholder-white/70 outline-none transition-colors hover:bg-black/20 focus:border-green-600 focus:bg-white focus:text-gray-900"
              />
            </div>
          </div>
          <div className="flex items-center gap-5 text-white/90">
            <div className="hidden text-sm md:block">
              Your trial ends in <span className="font-bold text-white">14 days</span>
            </div>
            <button className="rounded bg-white/20 px-4 py-1.5 text-xs font-bold uppercase text-white transition-colors hover:bg-white/30">
              Purchase
            </button>
            <HelpCircle className="h-5 w-5 cursor-pointer hover:text-white" />
            <Plus className="h-[22px] w-[22px] cursor-pointer hover:text-white" />
            <Bell className="h-5 w-5 cursor-pointer hover:text-white" />
          </div>
        </header>

        {/* 3-column workspace */}
        <main className="flex flex-1 overflow-hidden bg-white">
          <DetailsColumn />
          <ActivityColumn />
          <RelatedColumn />
        </main>
      </div>
    </div>
  );
}

function NavButton({ item, className = "" }: { item: NavItem; className?: string }) {
  const Icon = item.icon;
  const inner = (
    <span className="flex items-center gap-4">
      <Icon className={`h-[18px] w-[18px] ${item.active ? "text-[#2196F3]" : "text-slate-400"}`} />
      <span>{item.label}</span>
    </span>
  );
  const cls = `flex w-full items-center justify-between border-l-4 py-3 pr-4 text-sm text-white transition-colors ${
    item.active ? "border-blue-500 bg-black/10 pl-5" : "border-transparent pl-6 hover:bg-white/5"
  } ${className}`;
  return item.href ? (
    <Link href={item.href} className={cls}>
      {inner}
    </Link>
  ) : (
    <button className={cls}>{inner}</button>
  );
}

// ── Column 1: Details ────────────────────────────────────────────────────────
function DetailsColumn() {
  const fields: { label: string; value: React.ReactNode; chevron?: boolean }[] = [
    { label: "Name", value: "SaaS Technical Audit" },
    { label: "Pipeline", value: "Investigations", chevron: true },
    { label: "Target Date", value: "2/12/2026", chevron: true },
    { label: "Company", value: <span className="text-blue-600 hover:underline">Acme Corp (sample)</span> },
    { label: "Status", value: "Open", chevron: true },
    { label: "Stage", value: "Follow-up", chevron: true },
    { label: "Source", value: "No Source", chevron: true },
  ];
  return (
    <div className="flex w-[320px] shrink-0 flex-col overflow-y-auto border-r border-gray-200">
      <div className="border-b border-gray-200 p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-gray-200 bg-gray-100">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </span>
            <div>
              <h1 className="cursor-pointer text-base font-medium text-green-600 hover:underline">SaaS Technical Audit</h1>
              <p className="mt-0.5 text-sm text-gray-500">Acme Corp (sample) / $12,000</p>
            </div>
          </div>
          <div className="flex gap-2 text-gray-400">
            <Star className="h-[18px] w-[18px] cursor-pointer fill-current text-yellow-400" />
            <MoreVertical className="h-[18px] w-[18px] cursor-pointer hover:text-gray-600" />
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="border-b border-gray-100 py-3">
          <label className="mb-1 block text-xs font-medium text-gray-500">Primary Contact</label>
          <div className="mt-2 flex items-center gap-3">
            <Avatar initials="JL" color="bg-blue-500" />
            <div>
              <div className="cursor-pointer text-sm font-medium text-blue-600 hover:underline">Jon Lee</div>
              <div className="text-xs text-gray-500">
                CEO
                <br />
                (415) 355-4776 | <span className="text-blue-600 hover:underline">jonlee@acmecorp.com</span>
              </div>
            </div>
          </div>
        </div>
        {fields.map((f) => (
          <div key={f.label} className="border-b border-gray-100 py-3 last:border-0">
            <label className="mb-1 block text-xs font-medium text-gray-500">{f.label}</label>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-900">{f.value}</span>
              {f.chevron && <ChevronDown className="h-3.5 w-3.5 text-gray-400" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Column 2: Activity log ───────────────────────────────────────────────────
function ActivityColumn() {
  const [tab, setTab] = React.useState<"log" | "note">("log");
  const stats = [
    { value: "0", label: "Interactions" },
    { value: "--", label: "Last Contacted" },
    { value: "--", label: "Inactive Days" },
    { value: "0", label: "Days in Stage" },
  ];
  const feed: { icon: React.ComponentType<{ className?: string }>; node: React.ReactNode; time: string }[] = [
    { icon: DollarSign, node: <>You assigned this to <span className="text-blue-600">&quot;You&quot;</span></>, time: "1:04 PM" },
    { icon: DollarSign, node: <>You added this Investigation</>, time: "1:04 PM" },
    { icon: User, node: <>You added the Person <span className="text-blue-600">&quot;Jo Bennett, (sample)&quot;</span></>, time: "1:04 PM" },
    { icon: User, node: <>You added the Person <span className="text-blue-600">&quot;Jon Lee&quot;</span></>, time: "1:04 PM" },
  ];
  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-[#F4F5F6]">
      <div className="mx-auto w-full max-w-3xl p-6">
        <div className="mb-2 flex items-center gap-1 text-xs text-gray-500">
          <span>Synced 4 minutes ago</span>
          <RefreshCw className="h-3 w-3" />
        </div>

        {/* Stats */}
        <div className="mb-6 flex divide-x divide-gray-200 rounded-sm border border-gray-200 bg-white text-center shadow-sm">
          {stats.map((s) => (
            <div key={s.label} className="flex-1 py-3">
              <div className="text-2xl font-light text-gray-800">{s.value}</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="mb-6 rounded-sm border border-gray-200 bg-white shadow-sm">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setTab("log")}
              className={`px-6 py-3 text-sm font-medium ${tab === "log" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              LOG ACTIVITY
            </button>
            <button
              onClick={() => setTab("note")}
              className={`px-6 py-3 text-sm font-medium ${tab === "note" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              CREATE NOTE
            </button>
          </div>
          <div className="p-4">
            <div className="mb-2 flex w-max cursor-pointer items-center text-sm text-gray-600 hover:text-gray-900">
              {tab === "log" ? "To Do" : "Note"} <ChevronDown className="ml-1 h-3.5 w-3.5" />
            </div>
            <input
              placeholder={tab === "log" ? "Click here to add a note" : "Write a note…"}
              className="w-full border-b-2 border-blue-500 py-2 text-sm outline-none placeholder-gray-400"
            />
          </div>
        </div>

        {/* Feed */}
        <div className="mb-2 flex items-center justify-between px-1">
          <h3 className="text-sm font-medium text-gray-500">Today</h3>
          <div className="cursor-pointer text-sm text-gray-500">
            Showing: <span className="font-medium text-gray-900">All Activity</span> <ChevronDown className="inline h-3.5 w-3.5" />
          </div>
        </div>
        <div className="divide-y divide-gray-100 rounded-sm border border-gray-200 bg-white shadow-sm">
          {feed.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="flex items-start gap-4 p-4">
                <Icon className="mt-1 h-4 w-4 text-gray-400" />
                <p className="flex-1 text-sm text-gray-800">{f.node}</p>
                <span className="whitespace-nowrap text-xs text-gray-400">{f.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Column 3: Related items ──────────────────────────────────────────────────
function RelatedColumn() {
  const [open, setOpen] = React.useState<Record<string, boolean>>({ People: true });
  const toggle = (k: string) => setOpen((o) => ({ ...o, [k]: !o[k] }));

  const sections = [
    { key: "People", count: 2 },
    { key: "Companies", count: 1 },
    { key: "Tasks", count: 0 },
    { key: "Files", count: 0 },
    { key: "Calendar Events", count: 0 },
    { key: "Strategy Briefs", count: 0 },
  ];

  return (
    <div className="hidden w-[300px] shrink-0 overflow-y-auto border-l border-gray-200 bg-white lg:block">
      {sections.map((s) => (
        <div key={s.key} className="border-b border-gray-200">
          <div
            onClick={() => toggle(s.key)}
            className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-gray-50"
          >
            <div className="flex items-center text-sm font-medium text-gray-600">
              {s.key} ({s.count})
              <ChevronDown className={`ml-1 h-3.5 w-3.5 text-gray-400 transition-transform ${open[s.key] ? "rotate-180" : ""}`} />
            </div>
            <Plus className="h-4 w-4 text-blue-500 hover:text-blue-700" />
          </div>
          {open[s.key] && s.key === "People" && (
            <div className="px-4 pb-4">
              <div className="space-y-4 pt-2">
                <PersonRow initials="JL" color="bg-blue-500" name="Jon Lee" meta="(primary contact)" sub="CEO at Acme Corp" contact="(415) 355-4776 | jonlee@acme…" />
                <PersonRow initials="JB" color="bg-rose-500" name="Jo Bennett" meta=", (sample)" sub="CEO at Sabre Inc (sa…" contact="jo@sabreinc.com" />
                <div className="flex cursor-pointer items-center text-sm font-bold text-blue-600 hover:underline">
                  <FileText className="mr-1 h-3.5 w-3.5" /> VIEW IN LIST
                </div>
              </div>
            </div>
          )}
          {open[s.key] && s.key !== "People" && (
            <div className="px-4 pb-4 text-sm text-gray-400">Nothing here yet.</div>
          )}
        </div>
      ))}
    </div>
  );
}

function PersonRow({ initials, color, name, meta, sub, contact }: { initials: string; color: string; name: string; meta: string; sub: string; contact: string }) {
  return (
    <div className="flex items-start gap-3">
      <Avatar initials={initials} color={color} size="h-8 w-8" />
      <div>
        <div className="text-sm text-gray-900">
          <span className="cursor-pointer font-medium text-blue-600 hover:underline">{name}</span>
          {meta}
        </div>
        <div className="mt-0.5 text-xs text-gray-500">{sub}</div>
        <div className="mt-0.5 text-xs text-blue-600 hover:underline">{contact}</div>
      </div>
    </div>
  );
}
