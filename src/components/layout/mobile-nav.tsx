"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Users, Workflow, MapPin, Cloud, Building2, Plug, Settings } from "lucide-react";
import { STAGES } from "@/lib/stages";
import { cn } from "@/lib/utils";

type Item = { href: string; label: string; icon: React.ComponentType<{ className?: string }>; step?: number };

const dashIcons = { local: MapPin, saas: Cloud, enterprise: Building2 } as const;

export function MobileNav() {
  const [open, setOpen] = useState(false);
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
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-9 w-9 items-center justify-center rounded-md text-white hover:bg-black/15 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <nav className="absolute left-0 top-0 flex h-full w-[270px] flex-col overflow-y-auto bg-brand-950 shadow-2xl">
            <div className="flex h-[56px] shrink-0 items-center justify-between border-b border-white/10 px-4">
              <span className="text-sm font-bold tracking-wide text-white">SEO MANAGER OS</span>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-white/80 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="py-3">
              <Group items={main} pathname={pathname} onNavigate={() => setOpen(false)} />
              <Label>Client Dashboards</Label>
              <Group items={dashboards} pathname={pathname} onNavigate={() => setOpen(false)} />
              <div className="my-2 border-t border-white/10" />
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
    <ul>
      {items.map((it) => {
        const active = pathname === it.href;
        const Icon = it.icon;
        return (
          <li key={it.href}>
            <Link
              href={it.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3.5 border-l-4 py-2.5 pr-4 text-sm transition-colors",
                active ? "border-white bg-white/10 pl-5 font-medium text-white" : "border-transparent pl-6 text-white/85 hover:bg-white/5"
              )}
            >
              {typeof it.step === "number" ? (
                <span
                  className={cn(
                    "flex h-[22px] w-[22px] items-center justify-center rounded-full text-[11px] font-bold",
                    active ? "bg-white text-brand-900 ring-2 ring-brand-300" : "border-2 border-brand-300 text-white"
                  )}
                >
                  {it.step}
                </span>
              ) : (
                <Icon className={cn("h-[18px] w-[18px]", active ? "text-white" : "text-white/70")} />
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
    <div className="px-6 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">{children}</div>
  );
}
