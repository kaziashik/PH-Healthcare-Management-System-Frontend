import { Suspense } from "react";
import DoctorsExplorer from "@/components/modules/doctors/doctors-explorer";
import { DoctorCardSkeleton } from "@/components/modules/doctors/doctor-card";

export default function DoctorsPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Doctors</h1>
        <p className="mt-2 max-w-2xl text-base text-muted-foreground">
          Approved physicians. Filter by specialty and fee, then open a profile
          before you book.
        </p>
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
