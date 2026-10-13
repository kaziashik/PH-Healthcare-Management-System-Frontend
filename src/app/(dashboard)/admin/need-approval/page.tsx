import DoctorApprovalTabs from "@/components/modules/doctor-approval/doctor-approval-tabs";

export default function NeedApprovalPage() {
  return (
    <section>
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">Need approval</h1>
        <p className="text-sm text-muted-foreground">
          A doctor who applies waits here. Review the profile, then approve or
          reject it.
        </p>
      </div>
      <DoctorApprovalTabs status="PENDING" />
    </section>
  );
}
