"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  CircleHelp,
  ClipboardPlus,
  House,
  Info,
  LayoutDashboard,
  LogIn,
  LogOut,
  Mail,
  Menu,
  Search,
  Stethoscope,
  UserPlus,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AccountPill from "@/components/layout/account-pill";
import BrandMark from "@/components/layout/brand-mark";
import ThemeToggle from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useGetMe, useLogout } from "@/hooks/auth.hook";
import type { UserRole } from "@/types";

type NavLink = {
  name: string;
  url: string;
  icon: LucideIcon;
};

const guestLinks: NavLink[] = [
  { name: "Home", url: "/", icon: House },
  { name: "Doctors", url: "/doctors", icon: Stethoscope },
  { name: "About", url: "/about-us", icon: Info },
  { name: "Contact", url: "/contact", icon: Mail },
];

const dashboardRoute: Record<UserRole, string> = {
  SUPER_ADMIN: "/admin",
  ADMIN: "/admin",
  DOCTOR: "/doctor",
  PATIENT: "/patient",
};

const profileRoute: Record<UserRole, string> = {
  SUPER_ADMIN: "/admin/profile",
  ADMIN: "/admin/profile",
  DOCTOR: "/doctor/profile",
  PATIENT: "/patient/profile",
};

const barButton =
  "border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white";

const outlinePill =
  "h-10 rounded-full border-white/30 bg-transparent px-4 text-white hover:bg-white/10 hover:text-white";

function isCurrent(pathname: string, url: string) {
  if (url === "/") return pathname === "/";
  return pathname === url || pathname.startsWith(`${url}/`);
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data } = useGetMe();
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
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const links: NavLink[] = [
    ...(role
      ? [
          ...guestLinks.slice(0, 2),
          { name: "Dashboard", url: dashboardRoute[role], icon: LayoutDashboard },
          { name: "Journal", url: "/journal", icon: BookOpen },
          { name: "Help", url: "/help", icon: CircleHelp },
        ]
      : guestLinks),
    ...(!role || role === "PATIENT"
      ? [{ name: "Apply", url: "/apply", icon: ClipboardPlus }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#06282f]/95 text-white backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="shrink-0 text-white">
          <BrandMark />
        </Link>

        <nav className="hidden items-center gap-0.5 min-[1100px]:flex">
          {links.map((link) => {
            const current = isCurrent(pathname, link.url);
            const Icon = link.icon;
            return (
              <Link
                key={link.url}
                href={link.url}
                aria-current={current ? "page" : undefined}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  current
                    ? "bg-white/15 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 min-[1100px]:flex">
          <ThemeToggle className={`size-10 ${barButton}`} />
          {user && role ? (
            <AccountPill
              name={user.name}
              email={user.email}
              role={role}
              onLogout={handleLogout}
            />
          ) : (
            <>
              <Button
                className="h-10 rounded-full bg-white px-4 text-[#06282f] hover:bg-white/90"
                nativeButton={false}
                render={<Link href="/doctors" />}
              >
                <Search aria-hidden="true" />
                Find a doctor
              </Button>
              <Button
                variant="outline"
                className={outlinePill}
                nativeButton={false}
                render={<Link href="/login" />}
              >
                <LogIn aria-hidden="true" />
                Login
              </Button>
              <Button
                variant="outline"
                className={outlinePill}
                nativeButton={false}
                render={<Link href="/register" />}
              >
                <UserPlus aria-hidden="true" />
                Sign up
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 min-[1100px]:hidden">
          {user && role ? (
            <AccountPill
              name={user.name}
              email={user.email}
              role={role}
              onLogout={handleLogout}
            />
          ) : null}
          <ThemeToggle className={`size-10 ${barButton}`} />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={`size-10 rounded-full ${barButton}`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 top-16 bg-[#02161a]/70 min-[1100px]:hidden"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <nav className="relative z-50 flex max-h-[calc(100dvh-4rem)] flex-col gap-1 overflow-y-auto border-t border-white/10 bg-[#06282f] px-4 py-4 min-[1100px]:hidden">
            {links.map((link) => {
              const current = isCurrent(pathname, link.url);
              const Icon = link.icon;
              return (
                <Link
                  key={link.url}
                  href={link.url}
                  aria-current={current ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${
                    current
                      ? "bg-white/15 text-white"
                      : "text-white/85 hover:bg-white/10"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <span className="flex size-9 items-center justify-center rounded-lg bg-white/10">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  {link.name}
                </Link>
              );
            })}
            {user && role ? (
              <>
                <Link
                  href={profileRoute[role]}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/85 hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  <span className="flex size-9 items-center justify-center rounded-lg bg-white/10">
                    <UserRound className="size-4" aria-hidden="true" />
                  </span>
                  Profile
                </Link>
                <button
                  type="button"
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-white/85 hover:bg-white/10"
                  onClick={handleLogout}
                >
                  <span className="flex size-9 items-center justify-center rounded-lg bg-white/10">
                    <LogOut className="size-4" aria-hidden="true" />
                  </span>
                  Logout
                </button>
              </>
            ) : (
              <div className="mt-3 grid gap-2">
                <Button
                  className="h-10 w-full rounded-full bg-white text-[#06282f] hover:bg-white/90"
                  nativeButton={false}
                  render={<Link href="/doctors" />}
                >
                  <Search aria-hidden="true" />
                  Find a doctor
                </Button>
                <Button
                  variant="outline"
                  className={`${outlinePill} w-full`}
                  nativeButton={false}
                  render={<Link href="/login" />}
                >
                  <LogIn aria-hidden="true" />
                  Login
                </Button>
                <Button
                  variant="outline"
                  className={`${outlinePill} w-full`}
                  nativeButton={false}
                  render={<Link href="/register" />}
                >
                  <UserPlus aria-hidden="true" />
                  Sign up
                </Button>
              </div>
            )}
          </nav>
        </>
      ) : null}
    </header>
  );
}
