"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGetMe } from "@/hooks/auth.hook";
import AppointmentShortcut from "./appointment-shortcut";

export default function DoctorRosterActions() {
  const role = useGetMe().data?.data?.role;
  if (role && role !== "PATIENT") return null;

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        nativeButton={false}
        render={<Link href="/apply">Apply as a doctor</Link>}
      >
        Apply as a doctor
      </Button>
      <AppointmentShortcut />
    </div>
  );
}
