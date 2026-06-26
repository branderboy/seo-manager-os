"use client";

import * as React from "react";
import { UserPlus, Send, Check, Clock, KeyRound, ClipboardList, FolderUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// What the client is asked to do when they accept — this is what unblocks the
// rest of the workflow (the OS can't pull data until access is granted).
const ASKS = [
  { icon: KeyRound, text: "Grant access: Search Console, Analytics and Google Business Profile" },
  { icon: ClipboardList, text: "Confirm goals, services and target locations" },
  { icon: FolderUp, text: "Upload brand assets and any past SEO reports" },
];

type Invite = { email: string; status: "Accepted" | "Invited" };

export function ClientInvite() {
  const [email, setEmail] = React.useState("");
  const [invites, setInvites] = React.useState<Invite[]>([
    { email: "maria@northwindhvac.com", status: "Accepted" },
  ]);

  const send = () => {
    const e = email.trim();
    if (!e) return;
    setInvites((prev) => [...prev, { email: e, status: "Invited" }]);
    setEmail("");
  };

  return (
    <Card className="p-6">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-tint)] text-accent-600">
          <UserPlus className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">Invite the client</h3>
          <p className="mt-0.5 max-w-2xl text-sm text-[var(--muted)]">
            Send a secure invite so the client can grant access and confirm details. Nothing downstream
            runs until access is in — this is what starts the data flowing.
          </p>
        </div>
      </div>

      {/* What they'll be asked */}
      <ul className="mt-4 grid gap-2 sm:grid-cols-3">
        {ASKS.map((a) => (
          <li key={a.text} className="flex items-start gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3">
            <a.icon className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
            <span className="text-xs leading-snug text-[var(--ink-soft)]">{a.text}</span>
          </li>
        ))}
      </ul>

      {/* Invite form */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="client@company.com"
          className="h-10 flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm shadow-card outline-none placeholder:text-[var(--faint)] focus:border-accent-400 focus:ring-2 focus:ring-accent-100"
        />
        <Button onClick={send} disabled={!email.trim()}>
          <Send className="h-4 w-4" />
          Send invite
        </Button>
      </div>

      {/* Invited so far */}
      <ul className="mt-4 divide-y divide-[var(--border)] border-t border-[var(--border)]">
        {invites.map((inv) => {
          const accepted = inv.status === "Accepted";
          return (
            <li key={inv.email} className="flex items-center justify-between gap-3 py-2.5">
              <span className="truncate text-sm text-[var(--ink-soft)]">{inv.email}</span>
              <Badge variant={accepted ? "good" : "warn"} className="gap-1">
                {accepted ? <Check className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                {inv.status}
              </Badge>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
