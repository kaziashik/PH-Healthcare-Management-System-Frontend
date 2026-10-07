import AdminOverview from "@/components/modules/admin-overview/admin-overview";

export default function AdminDashboard() {
  return (
    <section className="p-5">
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Review new doctors, and manage patient and admin accounts.
        </p>
      </div>
      <AdminOverview />
    </section>
  );
}
