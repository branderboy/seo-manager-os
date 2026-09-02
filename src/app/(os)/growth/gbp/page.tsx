import type { Metadata } from "next";
import { GbpScreen } from "@/components/local-growth/module-screens";

export const metadata: Metadata = { title: "GBP Operations" };

export default function GbpPage() {
  return <GbpScreen />;
}
