import DoctorApprovalTabs from "@/components/modules/doctor-approval/doctor-approval-tabs";

export default function ApprovedDoctorsPage() {
  return (
    <section>
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">Approved doctors</h1>
        <p className="text-sm text-muted-foreground">
          These doctors are active. Patients can see them, and they can create
          a schedule.
        </p>
      </div>
      <DoctorApprovalTabs status="APPROVED" />
    </section>
  );
}
