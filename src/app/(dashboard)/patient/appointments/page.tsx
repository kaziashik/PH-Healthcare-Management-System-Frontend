import PatientAppointmentsPanel from "@/components/modules/patient-appointments/appointments-panel";

export default function PatientAppointmentsPage() {
  return (
    <section>
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
        <p className="text-sm text-muted-foreground">
          A paid visit shows the doctor, the date, and your 20-minute time. Pay
          within 5 minutes, or that booking is cancelled.
        </p>
      </div>
      <PatientAppointmentsPanel />
    </section>
  );
}
