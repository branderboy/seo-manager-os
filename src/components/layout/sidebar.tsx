"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  MapPin,
  Cloud,
  Plug,
  Settings,
  MoreVertical,
  Users,
  Workflow,
  LineChart,
  Bot,
  LayoutDashboard,
  ShieldAlert,
  Trophy,
  Rocket,
} from "lucide-react";
import { STAGES } from "@/lib/stages";
import { currentUser } from "@/lib/model";
import { cn } from "@/lib/utils";

const dashIcons = { local: MapPin, saas: Cloud, enterprise: Building2 } as const;

type Item = { href: string; label: string; icon: React.ComponentType<{ className?: string }>; step?: number };

export function Sidebar() {
  const pathname = usePathname();

  const main: Item[] = [
    { href: "/command", label: "Command Center", icon: LayoutDashboard },
    { href: "/clients", label: "Clients", icon: Users },
    { href: "/risk", label: "Risk Center", icon: ShieldAlert },
    { href: "/wins", label: "Wins", icon: Trophy },
    { href: "/workflow", label: "Workflow", icon: Workflow },
    { href: "/tracker", label: "Tracker", icon: LineChart },
    { href: "/deployments", label: "Deployments", icon: Rocket },
    { href: "/agents", label: "Agent Store", icon: Bot },
  ];
  const pipeline: Item[] = STAGES.map((s) => ({ href: `/${s.slug}`, label: s.name, icon: s.icon, step: s.n }));
  const dashboards: Item[] = [
    { href: "/dashboards/local", label: "Local SEO", icon: dashIcons.local },
  ];
  const workspace: Item[] = [
    { href: "/integrations", label: "Integrations", icon: Plug },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="hidden w-[240px] shrink-0 flex-col bg-[#2F3E4D] shadow-xl lg:flex">
      <div className="sticky top-0 flex h-screen flex-col">
        {/* Brand */}
        <Link
          href="/command"
          className="flex h-14 items-center gap-2.5 border-b border-white/10 px-4 hover:bg-white/5"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-500 text-sm font-bold text-white">
            S
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold tracking-tight text-white">SEO Manager OS</span>
            <span className="block truncate text-xs text-white/50">{currentUser.agency}</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3">
          <NavGroup items={main} pathname={pathname} />
          <Divider />
          <NavLabel>The Pipeline</NavLabel>
          <NavGroup items={pipeline} pathname={pathname} />
          <Divider />
          <NavLabel>Client Dashboards</NavLabel>
          <NavGroup items={dashboards} pathname={pathname} />
          <Divider />
          <NavGroup items={workspace} pathname={pathname} />
        </nav>

        {/* Branding footer */}
        <div className="flex items-center justify-between border-t border-white/10 p-4">
          <div className="text-xs font-bold tracking-wide text-white">SEO MANAGER OS</div>
          <MoreVertical className="h-4 w-4 text-white/60" />
        </div>
      </div>
    </aside>
  );
}

function NavGroup({ items, pathname }: { items: Item[]; pathname: string }) {
  return (
    <ul>
      {items.map((it) => {
        const active = pathname === it.href;
        const Icon = it.icon;
        return (
          <li key={it.href}>
            <Link
              href={it.href}
              className={cn(
                "flex items-center border-l-4 py-2.5 pr-4 text-sm transition-colors",
                active
                  ? "border-brand-500 bg-white/10 pl-5 font-medium text-white"
                  : "border-transparent pl-6 text-white hover:bg-white/5 hover:text-white"
              )}
            >
              <span className="flex items-center gap-3.5">
                {typeof it.step === "number" ? (
                  <span
                    className={cn(
                      "flex h-[22px] w-[22px] items-center justify-center rounded-full text-[11px] font-bold",
                      active
                        ? "bg-brand-500 text-white"
                        : "border-2 border-white/30 text-white"
                    )}
                  >
                    {it.step}
                  </span>
                ) : (
                  <Icon className={cn("h-[18px] w-[18px]", active ? "text-white" : "text-white/70")} />
                )}
                <span className="truncate">{it.label}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function NavLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-6 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">
      {children}
    </div>
  );
}

function Divider() {
  return <div className="my-2 border-t border-white/10" />;
}
