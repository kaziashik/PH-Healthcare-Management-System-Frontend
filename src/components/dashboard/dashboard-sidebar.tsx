"use client";

import {
  BadgeCheck,
  CalendarCheck,
  ClipboardList,
  CalendarClock,
  CalendarPlus,
  ChartColumn,
  KeyRound,
  LayoutDashboard,
  ShieldCheck,
  UserRound,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { adminRoutes, doctorRoutes, patientRoutes } from "@/routes";
import type { UserRole } from "@/types";
import type { SidebarItems } from "@/types/sidbar.type";

const sidebarRoutes: Partial<Record<UserRole, SidebarItems>> = {
  SUPER_ADMIN: adminRoutes,
  ADMIN: adminRoutes,
  DOCTOR: doctorRoutes,
  PATIENT: patientRoutes,
};

const itemIcons: Record<string, LucideIcon> = {
  Overview: LayoutDashboard,
  "Approved doctors": BadgeCheck,
  "Need approval": ClipboardList,
  Patients: Users,
  Admins: ShieldCheck,
  Analytics: ChartColumn,
  Schedules: CalendarClock,
  Appointments: CalendarCheck,
  Book: CalendarPlus,
  Payments: Wallet,
  Profile: UserRound,
  "Change Password": KeyRound,
};

export function DashboardSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const routes: SidebarItems = sidebarRoutes[role] || [];

  return (
    <Sidebar>
      <SidebarContent className="gap-4 px-2 pt-4">
        {routes.map((group) => (
          <SidebarGroup key={group.title} className="p-0">
            <SidebarGroupLabel className="h-7 px-3 text-[11px] font-semibold tracking-[0.14em] text-sidebar-foreground/50 uppercase">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => {
                  const Icon = itemIcons[item.title] ?? LayoutDashboard;
                  const current = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        render={<Link href={item.url} />}
                        isActive={current}
                        className="h-10 rounded-lg px-2.5"
                      >
                        <span
                          className={`flex size-7 items-center justify-center rounded-md ${
                            current
                              ? "bg-primary/15 text-primary"
                              : "bg-sidebar-accent text-sidebar-foreground/70"
                          }`}
                        >
                          <Icon aria-hidden="true" />
                        </span>
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
