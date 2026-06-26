"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";
import { clients } from "@/lib/model";
import { riskForClient } from "@/lib/risk";
import { cn } from "@/lib/utils";

const riskTone: Record<string, string> = {
  High: "text-[var(--danger)]",
  Medium: "text-[var(--warn)]",
  Low: "text-[var(--ok)]",
};

/**
 * Profile switcher. For now it opens on a client profile (the active
 * engagement); selecting another client opens that profile, and "All clients"
 * returns to the agency-wide view.
 */
export function ProfileSwitcher({ openClientId }: { openClientId?: string }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const active = clients.find((c) => c.id === openClientId) ?? clients[1] ?? clients[0];

  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 text-sm shadow-card transition-colors hover:border-[var(--border-strong)]"
      >
        <span className={cn("flex h-6 w-6 items-center justify-center rounded-full text-2xs font-bold text-white", active.color)}>
          {active.initials}
        </span>
        <span className="text-left leading-tight">
          <span className="block max-w-[140px] truncate font-semibold text-[var(--foreground)]">{active.name}</span>
          <span className="block text-2xs text-[var(--muted)]">Profile open</span>
        </span>
        <ChevronDown className={cn("h-4 w-4 text-[var(--muted)] transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-72 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-pop">
          <div className="max-h-80 overflow-y-auto py-1">
            <div className="px-3 py-1.5 text-2xs font-semibold uppercase tracking-[0.06em] text-[var(--faint)]">
              Client profiles
            </div>
            {clients.map((c) => {
              const risk = riskForClient(c);
              const isActive = c.id === active.id;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setOpen(false);
                    router.push(`/clients/${c.id}`);
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-[var(--surface-2)]"
                >
                  <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-2xs font-bold text-white", c.color)}>
                    {c.initials}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-[var(--foreground)]">{c.name}</span>
                    <span className="block truncate text-xs text-[var(--muted)]">{c.model} · {c.industry}</span>
                  </span>
                  {isActive ? (
                    <Check className="h-4 w-4 text-accent-600" />
                  ) : (
                    <span className={cn("text-2xs font-semibold", riskTone[risk.level])}>{risk.level}</span>
                  )}
                </button>
              );
            })}
          </div>
          <Link
            href="/command"
            onClick={() => setOpen(false)}
            className="block border-t border-[var(--border)] px-3 py-2.5 text-sm font-medium text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
          >
            All clients · Agency view
          </Link>
        </div>
      )}
    </div>
  );
}
