import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";

/** Labeled divider that chunks a dashboard into glanceable zones. */
export function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</h2>
        <div className="h-px flex-1 bg-[var(--border)]" />
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
    <div className="flex flex-col justify-between rounded-xl bg-slate-900 p-5 text-white">
      <div>
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
          Primary root cause
        </div>
        <div className="mt-1.5 text-lg font-semibold">{title}</div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-amber-400" style={{ width: `${confidence}%` }} />
        </div>
        <div className="mt-1.5 flex justify-between text-xs text-slate-400">
          <span>{confidence}% confidence</span>
          <span>{impact}</span>
        </div>
      </div>
      <Link href={href} className="mt-4 inline-flex w-max items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium hover:bg-white/20">
        Full diagnosis <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
