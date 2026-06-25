"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  MapPin,
  Cloud,
  Plug,
  Settings,
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
    <aside className="hidden w-[244px] shrink-0 flex-col border-r border-line bg-surface lg:flex">
      <div className="sticky top-0 flex h-screen flex-col">
        {/* Brand */}
        <Link
          href="/command"
          className="flex h-14 items-center gap-2.5 px-4 transition-colors hover:bg-surface-2"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ink text-xs font-bold text-ink-inv">
            S
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold tracking-tight text-ink">SEO Manager OS</span>
            <span className="block truncate text-xs text-ink-3">{currentUser.agency}</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4 pt-2">
          <NavGroup items={main} pathname={pathname} />
          <NavLabel>The Pipeline</NavLabel>
          <NavGroup items={pipeline} pathname={pathname} />
          <NavLabel>Client Dashboards</NavLabel>
          <NavGroup items={dashboards} pathname={pathname} />
          <div className="my-3 h-px bg-line" />
          <NavGroup items={workspace} pathname={pathname} />
        </nav>

        {/* Account */}
        <div className="border-t border-line p-3">
          <button className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-surface-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-signal text-xs font-semibold text-white">
              {currentUser.initials}
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-sm font-medium text-ink">{currentUser.name}</span>
              <span className="block truncate text-xs text-ink-3">{currentUser.agency}</span>
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}

function NavGroup({ items, pathname }: { items: Item[]; pathname: string }) {
  return (
    <ul className="space-y-0.5">
      {items.map((it) => {
        const active = pathname === it.href;
        const Icon = it.icon;
        return (
          <li key={it.href}>
            <Link
              href={it.href}
              className={cn(
                "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                active
                  ? "bg-surface-2 font-medium text-ink"
                  : "text-ink-2 hover:bg-surface-2 hover:text-ink"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-signal" />
              )}
              {typeof it.step === "number" ? (
                <span
                  className={cn(
                    "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md text-2xs font-semibold nums",
                    active ? "bg-signal text-white" : "bg-surface-2 text-ink-3 group-hover:bg-surface-3"
                  )}
                >
                  {it.step}
                </span>
              ) : (
                <Icon className={cn("h-[17px] w-[17px] shrink-0", active ? "text-signal" : "text-ink-3 group-hover:text-ink-2")} />
              )}
              <span className="truncate">{it.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function NavLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2.5 pb-1 pt-4 text-2xs font-semibold uppercase tracking-wider text-ink-3">
      {children}
    </div>
  );
}
