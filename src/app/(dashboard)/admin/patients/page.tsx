import PatientsPanel from "@/components/modules/patients/patients-panel";

export default function PatientsPage() {
  return (
    <section className="p-5">
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">Patients</h1>
        <p className="text-sm text-muted-foreground">
          Review patient accounts and block or unblock access.
        </p>
      </div>
      <PatientsPanel />
    </section>
  );
}
