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
} from "lucide-react";
import { STAGES } from "@/lib/stages";
import { currentUser } from "@/lib/crm";
import { cn } from "@/lib/utils";

const dashIcons = { local: MapPin, saas: Cloud, enterprise: Building2 } as const;

type Item = { href: string; label: string; icon: React.ComponentType<{ className?: string }>; step?: number };

export function Sidebar() {
  const pathname = usePathname();

  const main: Item[] = [
    { href: "/clients", label: "Clients", icon: Users },
    { href: "/workflow", label: "Workflow", icon: Workflow },
    ...STAGES.map((s) => ({ href: `/${s.slug}`, label: s.name, icon: s.icon, step: s.n })),
  ];
  const dashboards: Item[] = [
    { href: "/dashboards/local", label: "Local SEO", icon: dashIcons.local },
    { href: "/dashboards/saas", label: "SaaS SEO", icon: dashIcons.saas },
    { href: "/dashboards/enterprise", label: "Enterprise SEO", icon: dashIcons.enterprise },
  ];
  const workspace: Item[] = [
    { href: "/integrations", label: "Integrations", icon: Plug },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="hidden w-[240px] shrink-0 flex-col bg-brand-800 lg:flex">
      <div className="sticky top-0 flex h-screen flex-col">
        {/* Profile */}
        <Link
          href="/clients"
          className="flex h-[72px] items-center justify-between border-b border-white/10 px-4 hover:bg-white/5"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 font-bold text-white ring-1 ring-white/25">
              {currentUser.initials}
            </span>
            <div className="truncate">
              <div className="truncate text-sm font-medium text-white">{currentUser.name}</div>
              <div className="truncate text-xs text-white/60">{currentUser.agency}</div>
            </div>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3">
          <NavGroup items={main} pathname={pathname} />
          <Divider />
          <NavLabel>Client Dashboards</NavLabel>
          <NavGroup items={dashboards} pathname={pathname} />
          <Divider />
          <NavGroup items={workspace} pathname={pathname} />
        </nav>

        {/* Branding footer */}
        <div className="flex items-center justify-between border-t border-white/10 p-4">
          <div className="flex items-center gap-2 text-sm font-bold tracking-wide text-white">
            <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-white">
              <span className="h-3 w-3 rounded-sm bg-brand-800" />
            </span>
            <span className="text-xs">SEO MANAGER OS</span>
          </div>
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
                  ? "border-white bg-white/10 pl-5 font-medium text-white"
                  : "border-transparent pl-6 text-white/85 hover:bg-white/5"
              )}
            >
              <span className="flex items-center gap-3.5">
                {typeof it.step === "number" ? (
                  <span
                    className={cn(
                      "flex h-[22px] w-[22px] items-center justify-center rounded-full text-[11px] font-bold",
                      active
                        ? "bg-white text-brand-800 ring-2 ring-brand-300"
                        : "border-2 border-brand-300 text-white"
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
