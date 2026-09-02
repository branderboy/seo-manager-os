import type { Metadata } from "next";
import { ReviewsScreen } from "@/components/local-growth/module-screens";

export const metadata: Metadata = { title: "Reviews" };

export default function ReviewsPage() {
  return <ReviewsScreen />;
}
