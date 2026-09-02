import type { Metadata } from "next";
import { TemplatesScreen } from "@/components/local-growth/module-screens";

export const metadata: Metadata = { title: "Templates" };

export default function TemplatesPage() {
  return <TemplatesScreen />;
}
