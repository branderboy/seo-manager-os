import * as React from "react";
import { ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Enterprise table primitives — sticky header, tabular figures, quiet zebra on
 * hover, hairline rules. Compose with TableShell / THead / TR / TH / TD, or use
 * these inside a Card to get a Linear/Stripe-grade data grid.
 */

export function TableShell({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-card",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">{children}</table>
      </div>
    </div>
  );
}

export function THead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="sticky top-0 z-10 bg-[var(--surface-2)]">
      <tr className="border-b border-[var(--border)]">{children}</tr>
    </thead>
  );
}

type SortDir = "asc" | "desc" | null;

export function TH({
  children,
  className,
  align = "left",
  sortable,
  sortDir = null,
  onSort,
}: {
  children?: React.ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
  sortable?: boolean;
  sortDir?: SortDir;
  onSort?: () => void;
}) {
  const alignClass =
    align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";
  return (
    <th
      className={cn(
        "whitespace-nowrap px-3 py-2.5 text-2xs font-semibold uppercase tracking-[0.05em] text-[var(--muted)] first:pl-4 last:pr-4",
        alignClass,
        className
      )}
    >
      {sortable ? (
        <button
          onClick={onSort}
          className={cn(
            "inline-flex items-center gap-1 transition-colors hover:text-[var(--foreground)]",
            align === "right" && "flex-row-reverse"
          )}
        >
          {children}
          {sortDir === "asc" ? (
            <ArrowUp className="h-3 w-3" />
          ) : sortDir === "desc" ? (
            <ArrowDown className="h-3 w-3" />
          ) : (
            <ArrowUpDown className="h-3 w-3 opacity-40" />
          )}
        </button>
      ) : (
        children
      )}
    </th>
  );
}

export function TBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-[var(--border)]">{children}</tbody>;
}

export function TR({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "group transition-colors hover:bg-[var(--surface-2)]",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </tr>
  );
}

export function TD({
  children,
  className,
  align = "left",
  muted,
}: {
  children?: React.ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
  muted?: boolean;
}) {
  const alignClass =
    align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";
  return (
    <td
      className={cn(
        "px-3 py-2.5 align-middle first:pl-4 last:pr-4",
        alignClass,
        muted ? "text-[var(--muted)]" : "text-[var(--ink-soft)]",
        className
      )}
    >
      {children}
    </td>
  );
}
