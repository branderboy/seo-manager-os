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
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-line bg-canvas/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <MobileNav />
        <h1 className="truncate text-sm font-semibold tracking-tight text-ink">{title}</h1>
        <ChevronRight className="hidden h-4 w-4 shrink-0 text-ink-3 lg:block" />
        <ClientSwitcher />
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <button className="group hidden h-9 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-sm text-ink-3 transition-colors hover:border-line-strong md:flex lg:w-64">
          <Search className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">Search…</span>
          <kbd className="hidden items-center gap-0.5 rounded border border-line bg-surface-2 px-1.5 py-0.5 text-2xs font-medium text-ink-3 lg:inline-flex">
            ⌘K
          </kbd>
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink-2" aria-label="Help">
          <LifeBuoy className="h-[18px] w-[18px]" />
        </button>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink-2" aria-label="Notifications">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-danger ring-2 ring-canvas" />
        </button>
        <div className="mx-1 hidden h-5 w-px bg-line sm:block" />
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-signal text-xs font-semibold text-white transition-transform hover:scale-105" aria-label="Account">
          {currentUser.initials}
        </button>
      </div>
    </header>
  );
}
