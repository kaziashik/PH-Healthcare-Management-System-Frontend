"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Menu, Stethoscope, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AccountPill from "@/components/layout/account-pill";
import ThemeToggle from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useGetMe, useLogout } from "@/hooks/auth.hook";
import type { UserRole } from "@/types";

const publicLinks = [
  { name: "Home", url: "/" },
  { name: "Doctors", url: "/doctors" },
  { name: "About", url: "/about-us" },
  { name: "Contact", url: "/contact" },
];

const dashboardRoute: Record<UserRole, string> = {
  SUPER_ADMIN: "/admin",
  ADMIN: "/admin",
  DOCTOR: "/doctor",
  PATIENT: "/patient",
};

const profileRoute: Record<UserRole, string> = {
  SUPER_ADMIN: "/change-password",
  ADMIN: "/change-password",
  DOCTOR: "/doctor/profile",
  PATIENT: "/patient/profile",
};

const barButton =
  "border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data, isLoading } = useGetMe();
  const { mutate: logout } = useLogout();
  const queryClient = useQueryClient();
  const user = data?.data;
  const role = user?.role;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.add({
          title: "Signed out",
          description: "You have left your account.",
          type: "success",
        });
        queryClient.removeQueries({ queryKey: ["user"] });
        setOpen(false);
      },
      onError: () => {
        toast.add({
          title: "Logout failed",
          description: "Something went wrong.",
          type: "error",
        });
      },
    });
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const links = role
    ? [
        ...publicLinks.slice(0, 2),
        { name: "Dashboard", url: dashboardRoute[role] },
        { name: "Journal", url: "/journal" },
        { name: "Help", url: "/help" },
      ]
    : publicLinks;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#06282f] text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <span className="flex size-9 items-center justify-center rounded-full bg-[#14b8a6] text-[#042028]">
            <Stethoscope className="size-5" aria-hidden="true" />
          </span>
          <span>PH Healthcare</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
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
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${current ? "bg-white/15 text-white" : "text-white/75 hover:bg-white/10 hover:text-white"}`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle className={barButton} />
          {isLoading ? null : user && role ? (
            <AccountPill
              name={user.name}
              email={user.email}
              role={role}
              onLogout={handleLogout}
            />
          ) : (
            <>
              <Button
                variant="outline"
                className="h-10 rounded-full border-white/25 bg-[#08343c] px-4 text-white hover:bg-[#0c4250] hover:text-white"
                nativeButton={false}
                render={<Link href="/login">Login</Link>}
              >
                Login
              </Button>
              <Button
                className="rounded-full bg-white text-[#06282f] hover:bg-white/90"
                nativeButton={false}
                render={<Link href="/doctors">Find a doctor</Link>}
              >
                Find a doctor
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {user && role ? (
            <AccountPill
              name={user.name}
              email={user.email}
              role={role}
              onLogout={handleLogout}
            />
          ) : null}
          <ThemeToggle className={barButton} />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={barButton}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {open ? (
        <nav className="flex flex-col gap-2 border-t border-white/10 px-4 py-4 md:hidden">
          {links.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              className="rounded-md px-3 py-3 text-sm font-medium text-white/90 hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {user && role ? (
            <>
              <Link
                href={profileRoute[role]}
                className="rounded-md px-3 py-3 text-sm font-medium text-white/90 hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                Profile
              </Link>
              <button
                type="button"
                className="rounded-md px-3 py-3 text-left text-sm font-medium text-white/90 hover:bg-white/10"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md px-3 py-3 text-sm font-medium text-white/90 hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
          )}
        </nav>
      ) : null}
    </header>
  );
}
