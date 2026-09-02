import type { Metadata } from "next";
import { CampaignList } from "@/components/local-growth/campaign-list";

export const metadata: Metadata = { title: "Campaigns" };

export default function CampaignsPage() {
  return <CampaignList />;
}
