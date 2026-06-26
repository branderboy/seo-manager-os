"use client";

import { usePathname } from "next/navigation";
import { clientById } from "@/lib/model";
import { STAGES } from "@/lib/stages";
import { cn } from "@/lib/utils";

const VIEW_NAMES: Record<string, string> = {
  command: "Command Center",
  clients: "Clients",
  workflow: "SEO Pipeline",
  tracker: "Operations Tracker",
  agents: "AI Workforce",
  diagnosis: "Diagnosis",
  tools: "Playbooks",
  reports: "Reports",
  integrations: "Integrations",
  settings: "Settings",
  risk: "Risk Center",
  wins: "Wins",
  deployments: "Deployments",
};

/**
 * Persistent "you are here" highlighter. Tells you the view you're in — and when
 * you've opened a client, which profile you're viewing.
 */
export function ViewIndicator() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  // Inside a client profile → highlight which one.
  if (parts[0] === "clients" && parts[1]) {
    const c = clientById(parts[1]);
    if (c) {
      return (
        <Pill highlight>
          <span className={cn("flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white", c.color)}>
            {c.initials}
          </span>
          <span className="text-[var(--muted)]">Profile:</span>
          <span className="font-semibold text-[var(--accent-ink)]">{c.name}</span>
        </Pill>
      );
    }
  }

  // Otherwise name the view (agency-wide).
  let view = VIEW_NAMES[parts[0]] ?? "Dashboard";
  if (parts[0] === "dashboards") view = "Client Dashboard";
  const stage = STAGES.find((s) => s.slug === parts[0]);
  if (stage) view = `Pipeline · ${stage.name}`;

  return (
    <Pill>
      <span className="h-2 w-2 rounded-full bg-[var(--faint)]" />
      <span className="text-[var(--muted)]">Agency view ·</span>
      <span className="font-semibold text-[var(--foreground)]">{view}</span>
    </Pill>
  );
}

function Pill({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm shadow-card",
        highlight ? "border-accent-200 bg-[var(--accent-tint)]" : "border-[var(--border)] bg-[var(--surface)]"
      )}
    >
      {children}
    </div>
  );
}
