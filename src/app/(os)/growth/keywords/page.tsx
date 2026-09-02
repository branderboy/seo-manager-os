import type { Metadata } from "next";
import { KeywordMappingScreen } from "@/components/local-growth/module-screens";

export const metadata: Metadata = { title: "Keywords" };

export default function KeywordsPage() {
  return <KeywordMappingScreen />;
}
