import type { Metadata } from "next";
import { LeadsScreen } from "@/components/local-growth/module-screens";

export const metadata: Metadata = { title: "Leads" };

export default function LeadsPage() {
  return <LeadsScreen />;
}
