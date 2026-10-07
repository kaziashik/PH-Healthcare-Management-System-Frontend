import type { ReactNode } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import type { UserRole } from "@/types";
import AccountMenu from "./account-menu";
import { DashboardSidebar } from "./dashboard-sidebar";

export default function DashboardShell({
  children,
  role,
}: {
  children: ReactNode;
  role: UserRole;
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar role={role} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sm:px-6">
          <SidebarTrigger className="-ml-1" />
          <AccountMenu />
        </header>
        <div className="flex flex-1 flex-col px-4 py-6 sm:px-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
