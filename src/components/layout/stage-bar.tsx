"use client";

import { usePathname } from "next/navigation";
import { Search, LifeBuoy, Bell, ChevronRight } from "lucide-react";
import { STAGES } from "@/lib/stages";
import { currentUser } from "@/lib/model";
import { ClientSwitcher } from "@/components/engagement/client-switcher";
import { MobileNav } from "@/components/layout/mobile-nav";

const TITLES: Record<string, string> = {
  command: "Command Center",
  clients: "Clients",
  risk: "Risk Center",
  wins: "Wins",
  deployments: "Deployment Verification",
  integrations: "Integrations",
  settings: "Settings",
};

const DASH_TITLES: Record<string, string> = {
  local: "Local SEO Dashboard",
  saas: "SaaS SEO Dashboard",
  enterprise: "Enterprise SEO Dashboard",
};

function titleFor(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return "Dashboard";
  if (parts[0] === "dashboards" && parts[1]) return DASH_TITLES[parts[1]] ?? "Dashboard";
  if (parts[0] === "clients" && parts[1]) return "Client";
  const stage = STAGES.find((s) => s.slug === parts[0]);
  if (stage) return stage.name;
  return TITLES[parts[0]] ?? "SEO Manager OS";
}

/** Clean, light top bar — breadcrumb, search, and account, SaaS-style. */
export function StageBar() {
  const pathname = usePathname();
  const title = titleFor(pathname);

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-[var(--border)] bg-white/95 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <MobileNav />
        <h1 className="truncate text-[15px] font-semibold text-slate-900">{title}</h1>
        <ChevronRight className="hidden h-4 w-4 shrink-0 text-slate-300 lg:block" />
        <ClientSwitcher />
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search…"
            className="h-9 w-52 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] pl-9 pr-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-500 focus:border-accent-400 focus:bg-white focus:ring-2 focus:ring-accent-100 lg:w-72"
          />
        </div>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-700" aria-label="Help">
          <LifeBuoy className="h-5 w-5" />
        </button>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-700" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>
        <div className="mx-1 hidden h-6 w-px bg-[var(--border)] sm:block" />
        <button className="flex items-center gap-2 rounded-lg p-1 pr-2 transition-colors hover:bg-slate-100">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-white">
            {currentUser.initials}
          </span>
          <span className="hidden leading-tight lg:block">
            <span className="block text-sm font-medium text-slate-800">{currentUser.name}</span>
            <span className="block text-xs text-slate-500">{currentUser.agency}</span>
          </span>
        </button>
      </div>
    </header>
  );
}
