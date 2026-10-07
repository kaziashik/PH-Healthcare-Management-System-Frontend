import AdminOverview from "@/components/modules/admin-overview/admin-overview";

export default function AdminAnalyticsPage() {
  return (
    <section>
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Live totals for pending doctor applications, patients, and admins.
        </p>
      </div>
      <AdminOverview />
    </section>
  );
}
