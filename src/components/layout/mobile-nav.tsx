"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  GitBranch,
  LineChart,
  Bot,
  FileBarChart,
  Plug,
  Settings,
} from "lucide-react";
import { STAGES } from "@/lib/stages";
import { cn } from "@/lib/utils";

type Item = { href: string; label: string; icon: React.ComponentType<{ className?: string }>; step?: number };

const PRIMARY: Item[] = [
  { href: "/command", label: "Command Center", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/workflow", label: "SEO Pipeline", icon: GitBranch },
  { href: "/tracker", label: "Performance", icon: LineChart },
  { href: "/agents", label: "AI Workforce", icon: Bot },
  { href: "/reports", label: "Reports", icon: FileBarChart },
];

const PIPELINE: Item[] = STAGES.map((s) => ({ href: `/${s.slug}`, label: s.name, icon: s.icon, step: s.n }));

const WORKSPACE: Item[] = [
  { href: "/integrations", label: "Integrations", icon: Plug },
  { href: "/settings", label: "Settings", icon: Settings },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--ink-soft)] hover:bg-[var(--surface-3)] lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-[var(--foreground)]/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <nav className="absolute left-0 top-0 flex h-full w-[270px] flex-col overflow-y-auto border-r border-[var(--border)] bg-[var(--surface)] shadow-pop">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--border)] px-4">
              <span className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent-600 text-xs font-bold text-white">S</span>
                <span className="text-sm font-semibold tracking-tight text-[var(--foreground)]">SEO Manager OS</span>
              </span>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-[var(--muted)] hover:text-[var(--foreground)]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-3 py-3">
              <Group items={PRIMARY} pathname={pathname} onNavigate={() => setOpen(false)} />
              <Label>Pipeline</Label>
              <Group items={PIPELINE} pathname={pathname} onNavigate={() => setOpen(false)} />
              <div className="my-3 h-px bg-[var(--border)]" />
              <Group items={WORKSPACE} pathname={pathname} onNavigate={() => setOpen(false)} />
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
        const active = isActive(pathname, it.href);
        const Icon = it.icon;
        return (
          <li key={it.href}>
            <Link
              href={it.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                active
                  ? "bg-[var(--accent-tint)] font-medium text-[var(--accent-ink)]"
                  : "text-[var(--ink-soft)] hover:bg-[var(--surface-3)] hover:text-[var(--foreground)]"
              )}
            >
              {active && <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-r-full bg-accent-500" />}
              {typeof it.step === "number" ? (
                <span
                  className={cn(
                    "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] text-2xs font-semibold tnum",
                    active ? "bg-accent-500 text-white" : "bg-[var(--surface-3)] text-[var(--muted)]"
                  )}
                >
                  {it.step}
                </span>
              ) : (
                <Icon className={cn("h-[17px] w-[17px] shrink-0", active ? "text-accent-600" : "text-[var(--muted)]")} />
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
    <div className="px-2.5 pb-1 pt-4 text-2xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">{children}</div>
  );
}
