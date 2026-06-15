"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Cloud, Building2, Sparkles, Plug, Settings } from "lucide-react";
import { STAGES, DASHBOARDS } from "@/lib/stages";
import { cn } from "@/lib/utils";

const dashIcons = { local: MapPin, saas: Cloud, enterprise: Building2 } as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-[var(--border)] bg-white lg:block">
      <div className="sticky top-0 flex h-screen flex-col">
        <Link href="/" className="flex items-center gap-2.5 px-5 py-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-slate-900">
            SEO Manager OS
          </span>
        </Link>

        <nav className="flex-1 overflow-y-auto px-3 pb-6">
          <div className="px-2 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Operating Flow
          </div>
          <ul className="space-y-0.5">
            {STAGES.map((s) => {
              const href = `/${s.slug}`;
              const active = pathname === href;
              const Icon = s.icon;
              return (
                <li key={s.slug}>
                  <Link
                    href={href}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors",
                      active
                        ? "bg-accent-50 font-medium text-accent-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-semibold",
                        active
                          ? "bg-accent-500 text-white"
                          : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                      )}
                    >
                      {s.n}
                    </span>
                    <Icon className="h-4 w-4 shrink-0 opacity-70" />
                    <span className="truncate">{s.short}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="px-2 pb-2 pt-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Dashboards
          </div>
          <ul className="space-y-0.5">
            {DASHBOARDS.map((d) => {
              const href = `/dashboards/${d.slug}`;
              const active = pathname === href;
              const Icon = dashIcons[d.slug];
              return (
                <li key={d.slug}>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors",
                      active
                        ? "bg-accent-50 font-medium text-accent-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <Icon className="h-4 w-4 opacity-70" />
                    {d.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="px-2 pb-2 pt-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Workspace
          </div>
          <ul className="space-y-0.5">
            {[
              { href: "/integrations", name: "Integrations", icon: Plug },
              { href: "/settings", name: "Settings", icon: Settings },
            ].map((w) => {
              const active = pathname === w.href;
              const Icon = w.icon;
              return (
                <li key={w.href}>
                  <Link
                    href={w.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors",
                      active
                        ? "bg-accent-50 font-medium text-accent-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <Icon className="h-4 w-4 opacity-70" />
                    {w.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-[var(--border)] p-3">
          <div className="rounded-lg bg-slate-50 px-3 py-2.5">
            <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Active engagement
            </div>
            <div className="mt-0.5 text-sm font-medium text-slate-800">
              Northwind Heating &amp; Air
            </div>
            <div className="text-xs text-slate-500">Local · Austin, TX</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
