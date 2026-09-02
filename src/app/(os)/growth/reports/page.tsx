import type { Metadata } from "next";
import { ReportsScreen } from "@/components/local-growth/module-screens";

export const metadata: Metadata = { title: "Report Builder" };

export default function GrowthReportsPage() {
  return <ReportsScreen />;
}
