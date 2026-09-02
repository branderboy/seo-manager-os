import type { Metadata } from "next";
import { DemoLogin } from "@/components/local-growth/module-screens";

export const metadata: Metadata = { title: "Sign In" };

export default function GrowthLoginPage() {
  return <DemoLogin />;
}
