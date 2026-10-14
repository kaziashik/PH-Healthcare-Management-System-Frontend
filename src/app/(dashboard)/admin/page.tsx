import AdminOverview from "@/components/modules/admin-overview/admin-overview";

export default function AdminDashboard() {
  return (
    <section>
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Clinic overview — jump into the queues that need action.
        </p>
      </div>
      <AdminOverview />
    </section>
  );
}
