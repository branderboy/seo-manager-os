"use client";

import { usePathname } from "next/navigation";
import { Search, Bell, Plus } from "lucide-react";
import { STAGES } from "@/lib/stages";
import { ClientSwitcher } from "@/components/engagement/client-switcher";
import { MobileNav } from "@/components/layout/mobile-nav";

const TITLES: Record<string, string> = {
  command: "Command Center",
  clients: "Clients",
  risk: "Risk Center",
  wins: "Wins",
  workflow: "SEO Pipeline",
  tracker: "Performance",
  agents: "AI Workforce",
  deployments: "Deployments",
  reports: "Reports",
  integrations: "Integrations",
  settings: "Settings",
};

const DASH_TITLES: Record<string, string> = {
  local: "Local SEO Dashboard",
  saas: "SaaS SEO Dashboard",
  enterprise: "Enterprise SEO Dashboard",
};

function crumbsFor(pathname: string): string[] {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return ["Dashboard"];
  if (parts[0] === "dashboards" && parts[1]) return ["Dashboards", DASH_TITLES[parts[1]] ?? "Dashboard"];
  if (parts[0] === "clients" && parts[1]) return ["Clients", "Account"];
  const stage = STAGES.find((s) => s.slug === parts[0]);
  if (stage) return ["Pipeline", stage.name];
  return [TITLES[parts[0]] ?? "SEO Manager OS"];
}

/** Light, structural top bar · breadcrumb context, search, quick actions, account. */
export function StageBar() {
  const pathname = usePathname();
  const crumbs = crumbsFor(pathname);

  return (
    <header className="sticky top-0 z-20 flex h-[60px] shrink-0 items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface)]/90 px-5 backdrop-blur-md">
      <div className="flex min-w-0 items-center gap-2.5">
        <MobileNav />
        <nav className="flex min-w-0 items-center gap-1.5 text-sm">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-[var(--faint)]">/</span>}
              <span
                className={
                  i === crumbs.length - 1
                    ? "truncate font-semibold text-[var(--foreground)]"
                    : "truncate text-[var(--muted)]"
                }
              >
                {c}
              </span>
            </span>
          ))}
        </nav>
        <div className="ml-1 hidden h-5 w-px bg-[var(--border)] lg:block" />
        <div className="hidden lg:block">
          <ClientSwitcher />
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--faint)]" />
          <input
            type="text"
            aria-label="Search clients, tasks and keywords"
            placeholder="Search clients, tasks, keywords…"
            className="h-8 w-56 rounded-md border border-[var(--border)] bg-[var(--surface-2)] pl-8 pr-3 text-sm text-[var(--foreground)] outline-none transition-all placeholder:text-[var(--faint)] focus:w-72 focus:border-accent-400 focus:bg-white focus:ring-2 focus:ring-accent-100"
          />
        </div>
        <button className="flex h-9 select-none items-center gap-1.5 rounded-lg bg-gradient-to-b from-accent-400 to-accent-600 px-3.5 text-sm font-semibold text-white shadow-[0_3px_0_0_#064e2f,0_6px_14px_-4px_rgba(9,146,80,0.5),inset_0_1px_0_rgba(255,255,255,0.3)] transition-all duration-100 hover:from-accent-300 hover:to-accent-500 active:translate-y-[3px] active:shadow-[0_0_0_0_#064e2f]">
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">New</span>
        </button>
        <button
          className="relative flex h-8 w-8 items-center justify-center rounded-md text-[var(--muted)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--foreground)]"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--danger)] ring-2 ring-[var(--surface)]" />
        </button>
      </div>
    </header>
  );
}
