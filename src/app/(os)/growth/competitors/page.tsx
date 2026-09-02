import type { Metadata } from "next";
import { CompetitorsScreen } from "@/components/local-growth/module-screens";

export const metadata: Metadata = { title: "Competitors" };

export default function CompetitorsPage() {
  return <CompetitorsScreen />;
}
