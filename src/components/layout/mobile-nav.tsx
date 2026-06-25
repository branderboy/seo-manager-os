"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, Users, ShieldAlert, Trophy, Workflow, LineChart, Rocket, Bot, MapPin, Cloud, Building2, Plug, Settings } from "lucide-react";
import { STAGES } from "@/lib/stages";
import { cn } from "@/lib/utils";

type Item = { href: string; label: string; icon: React.ComponentType<{ className?: string }>; step?: number };

const dashIcons = { local: MapPin, saas: Cloud, enterprise: Building2 } as const;

export function MobileNav() {
  const [open, setOpen] = useState(false);
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
    ...STAGES.map((s) => ({ href: `/${s.slug}`, label: s.name, icon: s.icon, step: s.n })),
  ];
  const dashboards: Item[] = [
    { href: "/dashboards/local", label: "Local SEO", icon: dashIcons.local },
  ];
  const workspace: Item[] = [
    { href: "/integrations", label: "Integrations", icon: Plug },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-2 hover:bg-surface-2 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <nav className="absolute left-0 top-0 flex h-full w-[270px] flex-col overflow-y-auto border-r border-line bg-surface shadow-pop">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-4">
              <span className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink text-xs font-bold text-ink-inv">S</span>
                <span className="text-sm font-semibold tracking-tight text-ink">SEO Manager OS</span>
              </span>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-ink-3 hover:text-ink">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-3 py-3">
              <Group items={main} pathname={pathname} onNavigate={() => setOpen(false)} />
              <Label>Client Dashboards</Label>
              <Group items={dashboards} pathname={pathname} onNavigate={() => setOpen(false)} />
              <div className="my-3 h-px bg-line" />
              <Group items={workspace} pathname={pathname} onNavigate={() => setOpen(false)} />
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

function Group({ items, pathname, onNavigate }: { items: Item[]; pathname: string; onNavigate: () => void }) {
  return (
    <ul className="space-y-0.5">
      {items.map((it) => {
        const active = pathname === it.href;
        const Icon = it.icon;
        return (
          <li key={it.href}>
            <Link
              href={it.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                active ? "bg-surface-2 font-medium text-ink" : "text-ink-2 hover:bg-surface-2 hover:text-ink"
              )}
            >
              {active && <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-signal" />}
              {typeof it.step === "number" ? (
                <span
                  className={cn(
                    "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md text-2xs font-semibold nums",
                    active ? "bg-signal text-white" : "bg-surface-2 text-ink-3"
                  )}
                >
                  {it.step}
                </span>
              ) : (
                <Icon className={cn("h-[17px] w-[17px] shrink-0", active ? "text-signal" : "text-ink-3")} />
              )}
              <span className="truncate">{it.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2.5 pb-1 pt-4 text-2xs font-semibold uppercase tracking-wider text-ink-3">{children}</div>
  );
}
