import PatientOverview from "@/components/modules/patient-overview/patient-overview";

export default function PatientPage() {
  return (
    <section>
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Doctors open later today, and your recent visits.
        </p>
      </div>
      <PatientOverview />
    </section>
  );
}
