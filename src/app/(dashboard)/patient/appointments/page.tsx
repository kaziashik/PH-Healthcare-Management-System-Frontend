import PatientAppointmentsPanel from "@/components/modules/patient-appointments/appointments-panel";

export default function PatientAppointmentsPage() {
  return (
    <section className="p-5">
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
        <p className="text-sm text-muted-foreground">
          Cancel more than 1 hour before the visit starts if you need a refund.
        </p>
      </div>
      <PatientAppointmentsPanel />
    </section>
  );
}
