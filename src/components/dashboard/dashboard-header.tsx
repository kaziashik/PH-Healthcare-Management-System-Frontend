"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandMark from "@/components/layout/brand-mark";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { UserRole } from "@/types";
import AccountMenu from "./account-menu";

const dashboardRoute: Record<UserRole, string> = {
  SUPER_ADMIN: "/admin",
  ADMIN: "/admin",
  DOCTOR: "/doctor",
  PATIENT: "/patient",
};

export default function DashboardHeader({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const links = [
    { name: "Home", url: "/" },
    { name: "Doctors", url: "/doctors" },
    { name: "Dashboard", url: dashboardRoute[role] },
    { name: "Journal", url: "/journal" },
    { name: "About", url: "/about-us" },
    { name: "Contact", url: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b border-white/10 bg-[#06282f] px-3 text-white sm:gap-4 sm:px-5">
      <SidebarTrigger className="text-white hover:bg-white/10 hover:text-white" />
      <Link href="/" className="text-white">
        <BrandMark wordmarkClassName="hidden sm:inline" />
      </Link>
      <nav className="mx-auto hidden items-center gap-0.5 md:flex">
        {links.map((link) => {
          const current =
            link.url === "/"
              ? pathname === "/"
              : pathname === link.url || pathname.startsWith(`${link.url}/`);
          return (
            <Link
              key={link.url}
              href={link.url}
              aria-current={current ? "page" : undefined}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                current
                  ? "bg-white/15 text-white"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>
      <AccountMenu />
    </header>
  );
}
