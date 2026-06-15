import { Badge } from "@/components/ui/badge";
import type { Status, Impact } from "@/lib/data";

const statusVariant: Record<Status, "default" | "accent" | "good" | "warn" | "bad" | "outline"> = {
  Complete: "good",
  "In progress": "accent",
  Queued: "warn",
  "Not started": "outline",
  Blocked: "bad",
};

export function StatusBadge({ status }: { status: Status }) {
  return <Badge variant={statusVariant[status]}>{status}</Badge>;
}

const impactVariant: Record<Impact, "good" | "warn" | "bad"> = {
  High: "bad",
  Medium: "warn",
  Low: "good",
};

/** Impact framed as urgency (High = needs attention). */
export function ImpactBadge({ impact }: { impact: Impact }) {
  return <Badge variant={impactVariant[impact]}>{impact}</Badge>;
}
