import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Quiet, low-chroma status chips. A leading dot carries the color; the fill stays calm.
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-surface-2 text-ink-2",
        accent: "bg-signal-weak text-signal-ink",
        good: "bg-ok-weak text-ok",
        warn: "bg-warn-weak text-warn",
        bad: "bg-danger-weak text-danger",
        outline: "border border-line text-ink-2",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
