
import RuleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard.shell";
import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  
  return <RuleGuard roles={["ADMIN", "SUPER_ADMIN"]}> 

  <DashboardShell role="ADMIN">
    {children}
  </DashboardShell>
  </RuleGuard>

}