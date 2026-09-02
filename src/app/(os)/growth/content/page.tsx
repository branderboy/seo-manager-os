import type { Metadata } from "next";
import { ContentCalendarScreen } from "@/components/local-growth/module-screens";

export const metadata: Metadata = { title: "Content Calendar" };

export default function ContentPage() {
  return <ContentCalendarScreen />;
}
