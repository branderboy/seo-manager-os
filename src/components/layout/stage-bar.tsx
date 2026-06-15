"use client";

import { usePathname } from "next/navigation";
import { Search, HelpCircle, Plus, Bell } from "lucide-react";
import { STAGES } from "@/lib/stages";
import { currentUser } from "@/lib/crm";

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

  return (
    <header className="flex h-[56px] shrink-0 items-center justify-between bg-[#4CAF50] px-4">
      <div className="flex max-w-3xl flex-1 items-center gap-6">
        <span className="whitespace-nowrap text-lg font-medium text-white">{title}</span>
        <div className="relative max-w-xl flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded-md border border-transparent bg-black/10 py-1.5 pl-9 pr-4 text-sm text-white placeholder-white/70 outline-none transition-colors hover:bg-black/20 focus:border-green-700 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400"
          />
        </div>
      </div>
      <div className="flex items-center gap-5 text-white/90">
        <div className="hidden text-sm md:block">
          Your trial ends in <span className="font-bold text-white">{currentUser.trialDays} days</span>
        </div>
        <button className="rounded bg-white/20 px-4 py-1.5 text-xs font-bold uppercase text-white transition-colors hover:bg-white/30">
          Purchase
        </button>
        <HelpCircle className="h-5 w-5 cursor-pointer hover:text-white" />
        <Plus className="h-[22px] w-[22px] cursor-pointer hover:text-white" />
        <Bell className="h-5 w-5 cursor-pointer hover:text-white" />
      </div>
    </header>
  );
}
