import type { ReactNode } from "react";
import RuleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard.shell";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <RuleGuard roles={["PATIENT"]}>
      <DashboardShell role="PATIENT">{children}</DashboardShell>
    </RuleGuard>
  );
}
