"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/assets/svg/Logo";
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

export default function Header() {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
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
        setAccountOpen(false);
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
    if (!open && !accountOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setAccountOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, accountOpen]);

  const links = role
    ? [
        ...publicLinks.slice(0, 2),
        { name: "Dashboard", url: dashboardRoute[role] },
        { name: "Journal", url: "/journal" },
        { name: "Help", url: "/help" },
      ]
    : publicLinks;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Logo />
          <span>PH Healthcare</span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {links.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              aria-current={pathname === link.url ? "page" : undefined}
              className={`text-sm font-medium transition-colors hover:text-foreground ${pathname === link.url ? "text-primary" : "text-foreground/75"}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {isLoading ? null : user && role ? (
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                onClick={() => setAccountOpen((current) => !current)}
              >
                {user.name}
              </Button>
              {accountOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-48 rounded-lg border bg-popover p-1 text-popover-foreground shadow-md"
                >
                  <Link
                    href={profileRoute[role]}
                    className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                    onClick={() => setAccountOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/change-password"
                    className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                    onClick={() => setAccountOpen(false)}
                  >
                    Change password
                  </Link>
                  <button
                    type="button"
                    className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Button
                nativeButton={false}
                render={<Link href="/doctors">Find a doctor</Link>}
              >
                Find a doctor
              </Button>
              <Button
                variant="outline"
                render={<Link href="/login">Login</Link>}
                nativeButton={false}
              >
                Login
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {open ? (
        <nav className="flex flex-col gap-2 border-t px-4 py-4 md:hidden">
          {links.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              className="rounded-md px-3 py-3 text-sm font-medium hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {user && role ? (
            <>
              <Link
                href={profileRoute[role]}
                className="rounded-md px-3 py-3 text-sm font-medium hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                Profile
              </Link>
              <button
                type="button"
                className="rounded-md px-3 py-3 text-left text-sm font-medium hover:bg-muted"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md px-3 py-3 text-sm font-medium hover:bg-muted"
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
