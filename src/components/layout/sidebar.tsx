"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";
import { STAGES } from "@/lib/stages";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="pw-sidebar z-20 hidden w-64 flex-shrink-0 flex-col shadow-xl lg:flex">
      <div className="sticky top-0 flex h-screen flex-col">
        {/* Profile */}
        <div className="flex h-[72px] items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">KA</span>
            <div className="min-w-0">
              <div className="truncate text-[15px] font-semibold text-white">Kawani Ali</div>
              <div className="truncate text-xs text-white/70">Workspace Admin</div>
            </div>
          </div>
        </div>

        {/* Nav — the 9 stages, shared on every page */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto py-5">
          {STAGES.map((s) => {
            const href = `/${s.slug}`;
            const active = pathname === href;
            const Icon = s.icon;
            return (
              <Link
                key={s.slug}
                href={href}
                className={cn("pw-nav-item flex items-center px-5 py-3 transition-all", active ? "active pl-4" : "")}
              >
                <Icon className="mr-3.5 h-5 w-5 opacity-70" />
                <span className="text-[15px] font-medium">{s.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/5 bg-black/10 py-4">
          <div className="flex flex-col gap-2 px-4">
            <Link
              href="/settings"
              className="pw-nav-item flex items-center rounded px-2 py-2 transition-all hover:bg-white/5"
            >
              <Settings className="mr-3.5 h-5 w-5 opacity-70" />
              <span className="text-[15px] font-medium">Settings</span>
            </Link>
            <Link
              href="/clients"
              className="mt-2 w-full rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-lg"
            >
              All Clients
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
