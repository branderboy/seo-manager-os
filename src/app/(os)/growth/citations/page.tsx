import type { Metadata } from "next";
import { CitationsScreen } from "@/components/local-growth/module-screens";

export const metadata: Metadata = { title: "Citations" };

export default function CitationsPage() {
  return <CitationsScreen />;
}
