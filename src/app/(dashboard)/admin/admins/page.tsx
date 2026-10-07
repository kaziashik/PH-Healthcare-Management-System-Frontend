import AdminsPanel from "@/components/modules/admins/admins-panel";

export default function AdminsPage() {
  return (
    <section className="p-5">
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">Admins</h1>
        <p className="text-sm text-muted-foreground">
          Create admin accounts. A super admin can also create a super admin and
          block or unblock staff.
        </p>
      </div>
      <AdminsPanel />
    </section>
  );
}
