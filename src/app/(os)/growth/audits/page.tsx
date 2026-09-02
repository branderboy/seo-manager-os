import type { Metadata } from "next";
import { AuditWorkflow } from "@/components/local-growth/audit-workflow";

export const metadata: Metadata = { title: "Audits" };

export default function AuditsPage() {
  return <AuditWorkflow />;
}
