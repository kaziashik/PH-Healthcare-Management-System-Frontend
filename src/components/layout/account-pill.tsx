"use client";

import { ChevronDown, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { UserRole } from "@/types";

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

const roleLabel: Record<UserRole, string> = {
  SUPER_ADMIN: "SUPER ADMIN",
  ADMIN: "ADMIN",
  DOCTOR: "DOCTOR",
  PATIENT: "PATIENT",
};

export default function AccountPill({
  name,
  email,
  role,
  onLogout,
}: {
  name: string;
  email: string;
  role: UserRole;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointer = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onPointer);
    };
  }, [open]);

  return (
    <div className="relative" ref={root}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
        className="flex h-10 items-center gap-2 rounded-full border border-white/20 bg-[#08343c] py-1 pr-2.5 pl-1 text-sm font-medium text-white transition-colors hover:bg-[#0c4250]"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-[#14b8a6] text-[#042028]">
          <UserRound className="size-4" aria-hidden="true" />
        </span>
        <span className="max-w-[5.5rem] truncate sm:max-w-36">{name}</span>
        <ChevronDown
          className={`size-4 text-white/80 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-[17rem] rounded-2xl border border-white/10 bg-[#0b333b] p-2 text-white shadow-2xl"
        >
          <div className="px-3 py-2">
            <p className="truncate font-semibold">{name}</p>
            <p className="truncate text-sm text-white/60">{email}</p>
            <p className="mt-1 text-xs font-semibold tracking-[0.14em] text-[#5eead4]">
              {roleLabel[role]}
            </p>
          </div>
          <div className="my-1 border-t border-white/10" />
          <Link
            href={dashboardRoute[role]}
            role="menuitem"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-white/10"
            onClick={() => setOpen(false)}
          >
            <LayoutDashboard className="size-4" aria-hidden="true" />
            Dashboard
          </Link>
          <Link
            href={profileRoute[role]}
            role="menuitem"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-white/10"
            onClick={() => setOpen(false)}
          >
            <UserRound className="size-4" aria-hidden="true" />
            Profile
          </Link>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-rose-300 hover:bg-white/10"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
          >
            <LogOut className="size-4" aria-hidden="true" />
            Log out
          </button>
        </div>
      ) : null}
    </div>
  );
}
