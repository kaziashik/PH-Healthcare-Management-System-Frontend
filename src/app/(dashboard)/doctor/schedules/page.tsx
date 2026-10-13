import SchedulesPanel from "@/components/modules/doctor-schedules/schedules-panel";

export default function DoctorSchedulesPage() {
  return (
    <section>
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">Add a day</h1>
        <p className="text-sm text-muted-foreground">
          Pick the date, a 3 to 8 hour range, and the Google Meet link, then
          publish.
        </p>
      </div>
      <SchedulesPanel />
    </section>
  );
}
