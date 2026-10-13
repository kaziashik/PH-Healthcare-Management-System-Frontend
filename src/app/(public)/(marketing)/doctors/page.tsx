import Link from "next/link";
import { Suspense } from "react";
import AppointmentShortcut from "@/components/modules/doctors/appointment-shortcut";
import DoctorsExplorer from "@/components/modules/doctors/doctors-explorer";
import { DoctorCardSkeleton } from "@/components/modules/doctors/doctor-card";
import { Button } from "@/components/ui/button";

export default function DoctorsPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">The roster</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Doctors</h1>
          <p className="mt-2 max-w-2xl text-base text-muted-foreground">
            Approved doctors open for booking. Search by name, then filter by
            specialty, fee, and experience.
          </p>
        </div>
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
      </div>
      <Suspense
        fallback={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DoctorCardSkeleton />
            <DoctorCardSkeleton />
            <DoctorCardSkeleton />
          </div>
        }
      >
        <DoctorsExplorer />
      </Suspense>
    </section>
  );
}
