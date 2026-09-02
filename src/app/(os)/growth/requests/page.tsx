import type { Metadata } from "next";
import { ClientRequestsPortal } from "@/components/local-growth/module-screens";

export const metadata: Metadata = { title: "Requests" };

export default function ClientRequestsPage() {
  return <ClientRequestsPortal />;
}
