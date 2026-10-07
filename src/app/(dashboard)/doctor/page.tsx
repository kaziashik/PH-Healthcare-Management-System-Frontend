import DoctorOverview from "@/components/modules/doctor-overview/doctor-overview";

export default function DoctorPage() {
  return (
    <section>
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Your latest schedules and booked visits.
        </p>
      </div>
      <DoctorOverview />
    </section>
  );
}
