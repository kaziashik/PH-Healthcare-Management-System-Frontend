import SchedulesPanel from "@/components/modules/doctor-schedules/schedules-panel";

export default function DoctorSchedulesPage() {
  return (
    <section>
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">Schedules</h1>
        <p className="text-sm text-muted-foreground">
          Create a same-day window of 3 to 8 hours, then publish it. The date
          locks after publish, and the time range locks after the first booking.
        </p>
      </div>
      <SchedulesPanel />
    </section>
  );
}
