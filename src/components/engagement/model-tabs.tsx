"use client";

import * as React from "react";
import { Tabs } from "@/components/ui/tabs";
import { useEngagement } from "@/components/engagement/store";

/** Tabs whose default selection follows the classified engagement model. */
export function ModelTabs({
  tabs,
}: {
  tabs: { id: string; label: string; content: React.ReactNode; count?: number }[];
}) {
  const { engagement } = useEngagement();
  return <Tabs initial={engagement.model} tabs={tabs} />;
}
