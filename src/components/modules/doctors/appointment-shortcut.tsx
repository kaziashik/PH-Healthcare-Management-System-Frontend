"use client";

import { CalendarCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGetMe } from "@/hooks/auth.hook";

export default function AppointmentShortcut() {
  const role = useGetMe().data?.data?.role;
  const href =
    role === "PATIENT"
      ? "/patient/appointments"
      : role === "DOCTOR"
        ? "/doctor/appointments"
        : role
          ? "/doctors#appointments"
          : "/login";

  return (
    <Button
      nativeButton={false}
      className="bg-[#0f766e] text-white hover:bg-[#115e59]"
      render={
        <Link href={href}>
          <CalendarCheck aria-hidden="true" />
          Appointment
        </Link>
      }
    >
      <CalendarCheck aria-hidden="true" />
      Appointment
    </Button>
  );
}
