import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { IntentView } from "@/components/stages/intent-view";

export const metadata: Metadata = { title: "Intent Mapping" };

export default function IntentPage() {
  return (
    <>
      <PageHeader
        stage={3}
        title="Intent Mapping"
        badge="Funnel alignment"
        description="Nail down what searchers actually want — mapped across the funnel and aligned to the client's goals. The map adapts to the client's SEO type."
      />
      <IntentView />
    </>
  );
}
