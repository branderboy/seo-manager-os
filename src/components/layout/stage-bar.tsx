"use client";

import { usePathname } from "next/navigation";
import { Search, HelpCircle, Plus, Bell } from "lucide-react";
import { STAGES } from "@/lib/stages";
import { currentUser } from "@/lib/crm";
import { useEngagement } from "@/components/engagement/store";
import { MobileNav } from "@/components/layout/mobile-nav";

const TITLES: Record<string, string> = {
  clients: "Clients",
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
  const stage = STAGES.find((s) => s.slug === parts[0]);
  if (stage) return stage.name;
  return TITLES[parts[0]] ?? "SEO Manager OS";
}

/** Green top action bar from the SEO Manager OS design. */
export function StageBar() {
  const pathname = usePathname();
  const title = titleFor(pathname);
  const { engagement } = useEngagement();

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md">
      <div className="flex max-w-3xl flex-1 items-center gap-2 sm:gap-4">
        <MobileNav />
        <span className="whitespace-nowrap text-base font-semibold tracking-tight text-slate-900">{title}</span>
        {engagement.business && (
          <span className="hidden items-center gap-1.5 whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs font-medium text-slate-600 xl:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
            {engagement.business} · {engagement.model}
          </span>
        )}
        <div className="relative max-w-xl flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 outline-none transition-colors hover:bg-slate-100 focus:border-accent-400 focus:bg-white focus:ring-2 focus:ring-accent-100"
          />
        </div>
      </div>
      <div className="flex items-center gap-4 text-slate-500">
        <div className="hidden text-sm md:block">
          Trial ends in <span className="font-semibold text-slate-900">{currentUser.trialDays} days</span>
        </div>
        <button className="rounded-md bg-accent-500 px-4 py-1.5 text-xs font-semibold uppercase text-white shadow-sm transition-colors hover:bg-accent-600">
          Purchase
        </button>
        <HelpCircle className="h-5 w-5 cursor-pointer hover:text-slate-700" />
        <Plus className="h-[22px] w-[22px] cursor-pointer hover:text-slate-700" />
        <Bell className="h-5 w-5 cursor-pointer hover:text-slate-700" />
      </div>
    </header>
  );
}
