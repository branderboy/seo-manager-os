import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Mechanical radii, weighty-but-quiet. No pills, no glow.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-200 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary action = near-black, the most confident control on the page.
        primary:
          "bg-[var(--foreground)] text-white shadow-xs hover:bg-[#262c36] active:bg-black",
        // Accent = the one blue call-to-action when emphasis is warranted.
        accent:
          "bg-accent-500 text-white shadow-xs hover:bg-accent-600 active:bg-accent-700",
        secondary:
          "border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-soft)] shadow-xs hover:bg-[var(--surface-3)] hover:text-[var(--foreground)]",
        ghost:
          "text-[var(--ink-soft)] hover:bg-[var(--surface-3)] hover:text-[var(--foreground)]",
        danger:
          "bg-[var(--danger)] text-white shadow-xs hover:brightness-95 active:brightness-90",
        // Back-compat alias used in a few places.
        dark:
          "bg-[var(--foreground)] text-white shadow-xs hover:bg-[#262c36] active:bg-black",
      },
      size: {
        xs: "h-7 px-2 text-xs",
        sm: "h-8 px-2.5",
        md: "h-9 px-3.5",
        lg: "h-10 px-4 text-md",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

type CommonProps = VariantProps<typeof buttonVariants> & { className?: string };

export function Button({
  className,
  variant,
  size,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & CommonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export function ButtonLink({
  className,
  variant,
  size,
  href,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & CommonProps & { href: string }) {
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
