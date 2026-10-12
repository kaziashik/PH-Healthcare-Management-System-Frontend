import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { UserRole } from "@/types";
import DashboardHeader from "./dashboard-header";
import { DashboardSidebar } from "./dashboard-sidebar";

export default function DashboardShell({
  children,
  role,
}: {
  children: ReactNode;
  role: UserRole;
}) {
  return (
    <SidebarProvider className="flex-col">
      <DashboardHeader role={role} />
      <div className="flex min-h-0 w-full flex-1">
        <DashboardSidebar role={role} />
        <SidebarInset>
          <div className="flex flex-1 flex-col px-4 py-6 sm:px-6">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
