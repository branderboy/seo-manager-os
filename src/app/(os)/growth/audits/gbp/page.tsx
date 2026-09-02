import type { Metadata } from "next";
import { AuditWorkflow } from "@/components/local-growth/audit-workflow";

export const metadata: Metadata = { title: "GBP Audit" };

export default function GbpAuditPage() {
  return <AuditWorkflow gbpOnly />;
}
