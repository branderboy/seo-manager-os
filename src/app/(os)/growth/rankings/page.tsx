import type { Metadata } from "next";
import { RankingsDashboard } from "@/components/local-growth/module-screens";

export const metadata: Metadata = { title: "Rankings" };

export default function RankingsPage() {
  return <RankingsDashboard />;
}
