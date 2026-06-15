"use client";

import { Badge } from "@/components/ui/badge";
import { useEngagement } from "@/components/engagement/store";

/** Inline business name (or another scalar engagement field). */
export function EngName() {
  const { engagement } = useEngagement();
  return <>{engagement.business || "this business"}</>;
}

export function EngModel() {
  const { engagement } = useEngagement();
  return <>{engagement.model}</>;
}

export function EngMarket() {
  const { engagement } = useEngagement();
  return <>{engagement.market || "—"}</>;
}

/** Accent badge that reflects the classified model, e.g. "Local playbook active". */
export function ModelBadge({ suffix }: { suffix: string }) {
  const { engagement } = useEngagement();
  return <Badge variant="accent">{engagement.model} {suffix}</Badge>;
}
