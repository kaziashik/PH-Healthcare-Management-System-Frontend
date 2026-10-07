"use client";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useGetMe, useLogout } from "@/hooks/auth.hook";
import type { UserRole } from "@/types";

const profileRoute: Record<UserRole, string> = {
  SUPER_ADMIN: "/change-password",
  ADMIN: "/change-password",
  DOCTOR: "/doctor/profile",
  PATIENT: "/patient/profile",
};

export default function AccountMenu() {
  const [open, setOpen] = useState(false);
  const { data } = useGetMe();
  const { mutate: logout } = useLogout();
  const queryClient = useQueryClient();
  const user = data?.data;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.add({
          title: "Signed out",
          description: "You have left your account.",
          type: "success",
        });
        queryClient.removeQueries({ queryKey: ["user"] });
        window.location.assign("/");
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

  return (
    <div className="ml-auto flex items-center gap-2">
      <ThemeToggle />
      {user ? (
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            aria-expanded={open}
            aria-haspopup="menu"
            onClick={() => setOpen((current) => !current)}
          >
            {user.name}
          </Button>
          {open ? (
            <div
              role="menu"
              className="absolute right-0 z-20 mt-2 w-48 rounded-lg border bg-popover p-1 text-popover-foreground shadow-md"
            >
              <Link
                href={profileRoute[user.role]}
                className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                Profile
              </Link>
              <Link
                href="/"
                className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                Clinic home
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
      ) : null}
    </div>
  );
}
