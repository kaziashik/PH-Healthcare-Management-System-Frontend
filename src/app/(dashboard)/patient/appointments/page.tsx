import PatientAppointmentsPanel from "@/components/modules/patient-appointments/appointments-panel";

export default function PatientAppointmentsPage() {
  return (
    <section>
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
        <p className="text-sm text-muted-foreground">
          A paid visit shows the meeting link. After the visit is completed,
          Follow-up opens that doctor's schedule so you can book again.
        </p>
      </div>
      <PatientAppointmentsPanel />
    </section>
  );
}
