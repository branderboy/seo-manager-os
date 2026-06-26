"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GitBranch,
  LineChart,
  Bot,
  Stethoscope,
  BookOpen,
  FileBarChart,
  Plug,
  Settings,
  Leaf,
} from "lucide-react";
import { currentUser, clients } from "@/lib/model";
import { riskForClient } from "@/lib/risk";
import { workforceSummary } from "@/lib/workforce";
import { cn } from "@/lib/utils";

type Item = { href: string; label: string; icon: React.ComponentType<{ className?: string }> };

const NAV: Item[] = [
  { href: "/command", label: "Command Center", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/workflow", label: "SEO Pipeline", icon: GitBranch },
  { href: "/tracker", label: "Operations Tracker", icon: LineChart },
  { href: "/agents", label: "AI Workforce", icon: Bot },
  { href: "/diagnosis", label: "Diagnosis", icon: Stethoscope },
  { href: "/tools", label: "Playbooks", icon: BookOpen },
  { href: "/reports", label: "Reports", icon: FileBarChart },
  { href: "/integrations", label: "Integrations", icon: Plug },
  { href: "/settings", label: "Settings", icon: Settings },
];

const riskText: Record<string, string> = {
  High: "text-rose-300",
  Medium: "text-amber-300",
  Low: "text-emerald-300",
};

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export function Sidebar() {
  const pathname = usePathname();
  const favorites = clients.slice(0, 5).map((c) => ({ c, risk: riskForClient(c) }));

  return (
    <aside className="hidden w-[256px] shrink-0 flex-col bg-[#15181e] text-white lg:flex">
      <div className="flex h-screen flex-col">
        {/* Brand */}
        <Link href="/command" className="flex shrink-0 items-center gap-3 px-5 pb-4 pt-6">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-500 text-white shadow-[0_4px_12px_-2px_rgba(22,179,100,0.5)]">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="flex flex-col text-[15px] font-bold leading-[1.15] tracking-tight">
            <span>SEO</span>
            <span className="text-white/90">MANAGER OS</span>
          </span>
        </Link>

        {/* Scrollable: nav + favorites */}
        <div className="flex-1 overflow-y-auto px-3">
          <nav>
            <ul className="space-y-0.5">
              {NAV.map((it) => {
                const active = isActive(pathname, it.href);
                const Icon = it.icon;
                return (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      className={cn(
                        "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-white/15 text-white"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      {active && <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-r-full bg-accent-500" />}
                      <Icon className={cn("h-[18px] w-[18px] shrink-0", active ? "text-accent-400" : "text-white/70")} />
                      {it.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Favorite clients */}
          <div className="mt-5">
            <div className="flex items-center justify-between px-3 pb-2">
              <span className="text-2xs font-bold uppercase tracking-[0.1em] text-white/55">Favorite clients</span>
            </div>
            <ul className="space-y-0.5">
              {favorites.map(({ c, risk }) => (
                <li key={c.id}>
                  <Link
                    href={`/clients/${c.id}`}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors hover:bg-white/5"
                  >
                    <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-2xs font-bold text-white", c.color)}>
                      {c.initials}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-white/85">{c.name}</span>
                    <span className={cn("text-2xs font-semibold", riskText[risk.level])}>{risk.level}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* AI Workforce promo */}
        <div className="shrink-0 px-3 pb-3 pt-2">
          <Link href="/agents" className="block overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <div className="text-sm font-bold">AI Workforce</div>
            <p className="mt-1 text-xs leading-relaxed text-white/70">{workforceSummary.working} specialists are working for you today.</p>
            <span className="mt-3 inline-flex items-center rounded-lg bg-accent-500 px-3 py-1.5 text-xs font-semibold text-white">
              View Workforce
            </span>
          </Link>
        </div>

        {/* User */}
        <div className="flex shrink-0 items-center gap-2.5 border-t border-white/10 px-4 py-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-500 text-2xs font-bold text-white">
            {currentUser.initials}
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-sm font-semibold">{currentUser.name}</span>
            <span className="block truncate text-2xs text-white/45">SEO Manager</span>
          </span>
        </div>
      </div>
    </aside>
  );
}
