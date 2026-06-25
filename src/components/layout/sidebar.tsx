"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import {
  Plug,
  Settings,
  Users,
  LineChart,
  Bot,
  LayoutDashboard,
  GitBranch,
  FileBarChart,
  ChevronRight,
  Command as CommandIcon,
} from "lucide-react";
import { STAGES } from "@/lib/stages";
import { currentUser } from "@/lib/model";
import { cn } from "@/lib/utils";

type Item = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  step?: number;
};

// Enterprise primary IA — the operations the agency runs on, in priority order.
const PRIMARY: Item[] = [
  { href: "/command", label: "Command Center", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/workflow", label: "SEO Pipeline", icon: GitBranch },
  { href: "/tracker", label: "Operations Tracker", icon: LineChart },
  { href: "/agents", label: "AI Workforce", icon: Bot },
  { href: "/reports", label: "Reports", icon: FileBarChart },
];

const WORKSPACE: Item[] = [
  { href: "/integrations", label: "Integrations", icon: Plug },
  { href: "/settings", label: "Settings", icon: Settings },
];

const PIPELINE: Item[] = STAGES.map((s) => ({
  href: `/${s.slug}`,
  label: s.name,
  icon: s.icon,
  step: s.n,
}));

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export function Sidebar() {
  const pathname = usePathname();
  const pipelineActive = PIPELINE.some((p) => isActive(pathname, p.href));
  const [pipelineOpen, setPipelineOpen] = React.useState(true);

  return (
    <aside className="hidden w-[244px] shrink-0 flex-col border-r border-[var(--border)] bg-[var(--sidebar)] lg:flex">
      <div className="flex h-screen flex-col">
        {/* Brand */}
        <Link
          href="/command"
          className="flex h-[57px] items-center gap-2.5 border-b border-[var(--border)] px-4"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--foreground)] text-[13px] font-bold text-white">
            S
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[13px] font-semibold tracking-tight text-[var(--foreground)]">
              SEO Manager OS
            </span>
            <span className="block truncate text-2xs text-[var(--muted)]">
              {currentUser.agency}
            </span>
          </span>
        </Link>

        {/* Command palette affordance */}
        <div className="px-3 pt-3">
          <button className="group flex w-full items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-sm text-[var(--muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--ink-soft)]">
            <CommandIcon className="h-3.5 w-3.5" />
            <span className="flex-1 text-left">Search…</span>
            <span className="kbd">⌘K</span>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <ul className="space-y-0.5">
            {PRIMARY.map((it) => (
              <NavItem key={it.href} item={it} active={isActive(pathname, it.href)} />
            ))}
          </ul>

          {/* Pipeline — collapsible, the product's spine */}
          <div className="mt-5">
            <button
              onClick={() => setPipelineOpen((v) => !v)}
              className="flex w-full items-center justify-between px-2.5 pb-1 pt-1.5"
            >
              <span className="eyebrow">Pipeline</span>
              <ChevronRight
                className={cn(
                  "h-3.5 w-3.5 text-[var(--faint)] transition-transform",
                  (pipelineOpen || pipelineActive) && "rotate-90"
                )}
              />
            </button>
            {(pipelineOpen || pipelineActive) && (
              <ul className="space-y-0.5">
                {PIPELINE.map((it) => (
                  <NavItem
                    key={it.href}
                    item={it}
                    active={isActive(pathname, it.href)}
                    dense
                  />
                ))}
              </ul>
            )}
          </div>

          <div className="mt-5">
            <div className="px-2.5 pb-1 pt-1.5">
              <span className="eyebrow">Workspace</span>
            </div>
            <ul className="space-y-0.5">
              {WORKSPACE.map((it) => (
                <NavItem key={it.href} item={it} active={isActive(pathname, it.href)} />
              ))}
            </ul>
          </div>
        </nav>

        {/* Account */}
        <div className="border-t border-[var(--border)] p-3">
          <button className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-[var(--surface-3)]">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-500 text-2xs font-bold text-white">
              {currentUser.initials}
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-sm font-medium text-[var(--foreground)]">
                {currentUser.name}
              </span>
              <span className="block truncate text-2xs text-[var(--muted)]">
                SEO Manager
              </span>
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}

function NavItem({
  item,
  active,
  dense,
}: {
  item: Item;
  active: boolean;
  dense?: boolean;
}) {
  const Icon = item.icon;
  return (
    <li>
      <Link
        href={item.href}
        className={cn(
          "group relative flex items-center gap-2.5 rounded-md px-2.5 text-sm transition-colors",
          dense ? "py-1.5" : "py-[7px]",
          active
            ? "bg-[var(--accent-tint)] font-medium text-[var(--accent-ink)]"
            : "text-[var(--ink-soft)] hover:bg-[var(--surface-3)] hover:text-[var(--foreground)]"
        )}
      >
        {active && (
          <span className="absolute inset-y-1 left-0 w-[3px] rounded-r-full bg-accent-500" />
        )}
        {typeof item.step === "number" ? (
          <span
            className={cn(
              "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] text-2xs font-semibold tnum",
              active
                ? "bg-accent-500 text-white"
                : "bg-[var(--surface-3)] text-[var(--muted)] group-hover:bg-[var(--border)]"
            )}
          >
            {item.step}
          </span>
        ) : (
          <Icon
            className={cn(
              "h-[16px] w-[16px] shrink-0",
              active ? "text-accent-600" : "text-[var(--muted)]"
            )}
          />
        )}
        <span className="truncate">{item.label}</span>
      </Link>
    </li>
  );
}
