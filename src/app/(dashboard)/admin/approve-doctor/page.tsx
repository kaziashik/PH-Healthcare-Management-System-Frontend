import DoctorApprovalTabs from "@/components/modules/doctor-approval/doctor-approval-tabs";

export default function page() {
  return (
    <section className="p-5">
      <div>
        <h1> Doctor approval </h1>
        <p>Please review and make sure the given data is real.</p>
      </div>
      <DoctorApprovalTabs />
    </section>
  );
}
