import type { Metadata } from "next";
import { OnboardingWizard } from "@/components/local-growth/onboarding-wizard";

export const metadata: Metadata = { title: "New Campaign" };

export default function NewCampaignPage() {
  return <OnboardingWizard />;
}
