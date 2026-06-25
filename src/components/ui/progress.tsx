import { cn } from "@/lib/utils";
import { scoreBar } from "@/lib/utils";

export function Progress({
  value,
  className,
  tone,
}: {
  value: number;
  className?: string;
  /** Override the auto score-based color. */
  tone?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-3)]",
        className
      )}
    >
      <div
        className={cn("h-full rounded-full transition-all", tone ?? scoreBar(pct))}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
