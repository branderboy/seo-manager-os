"use client";

import { useState } from "react";
import { Users, MessageSquare, Mail, Link2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Key = "slack" | "email" | "link";

const TARGETS: { key: Key; icon: React.ReactNode; title: string; detail: string; done: string }[] = [
  { key: "slack", icon: <MessageSquare className="h-4 w-4" />, title: "Share on Slack", detail: "#seo-team", done: "Posted to #seo-team" },
  { key: "email", icon: <Mail className="h-4 w-4" />, title: "Email the team", detail: "SEO & marketing", done: "Emailed to the team" },
  { key: "link", icon: <Link2 className="h-4 w-4" />, title: "Copy link", detail: "View-only", done: "Link copied" },
];

export function BriefShare() {
  const [done, setDone] = useState<Record<string, boolean>>({});

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-accent-300 shadow-border">
      <div className="bg-accent-600 px-5 py-3.5 text-white">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Users className="h-4 w-4" /> Share Project Brief
        </div>
        <p className="mt-0.5 text-xs text-white/80">Send the brief to the SEO &amp; marketing team for review.</p>
      </div>
      <div className="grid gap-3 bg-white p-4 sm:grid-cols-3">
        {TARGETS.map((t) => {
          const isDone = done[t.key];
          if (isDone) {
            return (
              <div key={t.key} className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
                <Check className="h-4 w-4 shrink-0" /> {t.done}
              </div>
            );
          }
          return (
            <button
              key={t.key}
              onClick={() => setDone((d) => ({ ...d, [t.key]: true }))}
              className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-left transition-colors hover:border-accent-300 hover:bg-accent-50/40"
            >
              <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-600")}>
                {t.icon}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-slate-800">{t.title}</span>
                <span className="block truncate text-xs text-slate-600">{t.detail}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
