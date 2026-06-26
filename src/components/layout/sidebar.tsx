"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { currentUser, clients } from "@/lib/model";
import { riskForClient } from "@/lib/risk";
import { cn } from "@/lib/utils";

type Item = { href: string; label: string };

const NAV: Item[] = [
  { href: "/command", label: "Command Center" },
  { href: "/clients", label: "Clients" },
  { href: "/workflow", label: "SEO Pipeline" },
  { href: "/tracker", label: "Operations Tracker" },
  { href: "/agents", label: "AI Workforce" },
  { href: "/diagnosis", label: "Diagnosis" },
  { href: "/tools", label: "Playbooks" },
  { href: "/reports", label: "Reports" },
  { href: "/integrations", label: "Integrations" },
  { href: "/settings", label: "Settings" },
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
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-base font-bold text-white">
            S
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
                return (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      className={cn(
                        "relative block rounded-lg py-2.5 pl-4 pr-3 text-sm font-medium transition-colors",
                        active
                          ? "bg-white/10 text-white"
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      {active && <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-r-full bg-accent-500" />}
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
              <span className="text-2xs font-bold uppercase tracking-[0.1em] text-white/40">Favorite clients</span>
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
            <p className="mt-1 text-xs leading-relaxed text-white/55">12 specialists are working for you today.</p>
            <span className="mt-3 inline-flex items-center rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-inset ring-white/15">
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
