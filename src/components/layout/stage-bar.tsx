"use client";

import { usePathname } from "next/navigation";
import { Search, HelpCircle, Plus, Bell } from "lucide-react";
import { STAGES } from "@/lib/stages";
import { useEngagement } from "@/components/engagement/store";
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
    <header className="z-10 flex h-[72px] shrink-0 items-center justify-between bg-[#51B34E] px-6 text-white shadow-md">
      <div className="flex flex-1 items-center gap-4 sm:gap-8">
        <MobileNav />
        <h1 className="whitespace-nowrap text-xl font-bold tracking-wide">{title}</h1>
        <ClientSwitcher />
        <div className="relative w-full max-w-lg">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/70" />
          <input
            type="text"
            placeholder="Search across workspace..."
            className="block w-full rounded-lg border border-white/20 bg-black/10 py-2.5 pl-11 pr-4 text-[15px] text-white placeholder-white/70 shadow-inner outline-none transition-all focus:bg-white focus:text-slate-900 focus:placeholder-slate-400 focus:ring-4 focus:ring-green-400/30"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="rounded-lg p-2 text-white/80 transition-all hover:bg-white/10 hover:text-white">
          <HelpCircle className="h-6 w-6" />
        </button>
        <button className="relative rounded-lg p-2 text-white/80 transition-all hover:bg-white/10 hover:text-white">
          <Bell className="h-6 w-6" />
          <span className="absolute right-2 top-2 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-[#51B34E]" />
        </button>
      </div>
    </header>
  );
}
