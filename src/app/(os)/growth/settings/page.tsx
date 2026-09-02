import type { Metadata } from "next";
import { SettingsScreen } from "@/components/local-growth/module-screens";

export const metadata: Metadata = { title: "Settings" };

export default function GrowthSettingsPage() {
  return <SettingsScreen />;
}
