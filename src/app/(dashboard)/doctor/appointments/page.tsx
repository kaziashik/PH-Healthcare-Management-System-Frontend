import DoctorAppointmentsPanel from "@/components/modules/doctor-appointments/appointments-panel";

export default function DoctorAppointmentsPage() {
  return (
    <section className="p-5">
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
        <p className="text-sm text-muted-foreground">
          Move a booked visit to ongoing, then to completed. Write the
          prescription after the visit is completed.
        </p>
      </div>
      <DoctorAppointmentsPanel />
    </section>
  );
}
