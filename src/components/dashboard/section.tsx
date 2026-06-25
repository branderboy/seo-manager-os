import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";

/** Labeled divider that chunks a screen into glanceable zones. */
export function Section({
  label,
  action,
  children,
}: {
  label: string;
  action?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="eyebrow">{label}</span>
        <div className="h-px flex-1 bg-[var(--border)]" />
        {action && (
          <Link
            href={action.href}
            className="inline-flex items-center gap-1 text-xs font-medium text-[var(--muted)] transition-colors hover:text-accent-600"
          >
            {action.label}
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

/** High-contrast root-cause callout for a "read-first" band. */
export function RootCause({
  title,
  confidence,
  impact = "High impact",
  href = "/diagnosis",
}: {
  title: string;
  confidence: number;
  impact?: string;
  href?: string;
}) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-accent-200 bg-[var(--accent-tint)] p-5">
      <div>
        <div className="flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-[0.06em] text-accent-700">
          <AlertTriangle className="h-3.5 w-3.5" />
          Primary root cause
        </div>
        <div className="mt-1.5 text-lg font-semibold text-[var(--foreground)]">{title}</div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white">
          <div className="h-full rounded-full bg-accent-500" style={{ width: `${confidence}%` }} />
        </div>
        <div className="mt-1.5 flex justify-between text-xs text-[var(--ink-soft)]">
          <span className="tnum">{confidence}% confidence</span>
          <span>{impact}</span>
        </div>
      </div>
      <Link
        href={href}
        className="mt-4 inline-flex w-max items-center gap-1 rounded-md border border-accent-300 bg-white px-3 py-1.5 text-sm font-medium text-accent-700 hover:bg-accent-50"
      >
        Full diagnosis <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
