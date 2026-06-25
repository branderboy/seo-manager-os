import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";

/** Quiet labeled band that chunks a page into glanceable zones. */
export function Section({
  label,
  action,
  children,
}: {
  label: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="eyebrow">{label}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

/** High-contrast root-cause callout for the top "read-first" band. */
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
    <div className="flex flex-col justify-between rounded-xl border border-signal-line bg-signal-weak/50 p-5">
      <div>
        <div className="flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-wider text-signal-ink">
          <AlertTriangle className="h-3.5 w-3.5" />
          Primary root cause
        </div>
        <div className="mt-2 text-base font-semibold tracking-tight text-ink">{title}</div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white">
          <div className="h-full rounded-full bg-signal" style={{ width: `${confidence}%` }} />
        </div>
        <div className="mt-1.5 flex justify-between text-xs text-ink-2">
          <span className="nums">{confidence}% confidence</span>
          <span>{impact}</span>
        </div>
      </div>
      <Link
        href={href}
        className="mt-4 inline-flex w-max items-center gap-1 text-sm font-medium text-signal-ink hover:text-signal-press"
      >
        Full diagnosis <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
