import { AuditFlow } from "@/components/audit/AuditFlow";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Spent Audit",
  alternates: { canonical: "/audit" },
};

export default function AuditPage() {
  return <AuditFlow />;
}
