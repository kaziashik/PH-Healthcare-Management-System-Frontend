"use client";

import Link from "next/link";
import CountChart from "@/components/dashboard/count-chart";
import { useGetAllDoctors } from "@/hooks/doctor.hook";
import { useGetAdmins, useGetPatients } from "@/hooks/user.hook";

function SummaryCard({
  title,
  href,
  label,
  total,
  pending,
}: {
  title: string;
  href: string;
  label: string;
  total: number | undefined;
  pending: boolean;
}) {
  return (
    <section className="rounded-lg border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold">{title}</h2>
        <Link className="text-sm underline underline-offset-4" href={href}>
          Open
        </Link>
      </div>
      {pending ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : (
        <p className="text-2xl font-semibold">{total ?? 0}</p>
      )}
      <p className="text-sm text-muted-foreground">{label}</p>
    </section>
  );
}

export default function AdminOverview() {
  const pendingDoctors = useGetAllDoctors({
    page: 1,
    limit: 1,
    verificationStatus: "PENDING",
  });
  const patients = useGetPatients({ page: 1, limit: 1 });
  const admins = useGetAdmins({ page: 1, limit: 1 });

  const counts = [
    { label: "Pending doctors", value: pendingDoctors.data?.meta?.total ?? 0 },
    { label: "Patients", value: patients.data?.meta?.total ?? 0 },
    { label: "Admins", value: admins.data?.meta?.total ?? 0 },
  ];

  return (
    <div className="flex flex-col gap-5">
      <CountChart items={counts} />
      <div className="grid gap-5 md:grid-cols-3">
        <SummaryCard
          title="Doctor approval"
          href="/admin/approve-doctor"
          label="Waiting for review"
          total={pendingDoctors.data?.meta?.total}
          pending={pendingDoctors.isPending}
        />
        <SummaryCard
          title="Patients"
          href="/admin/patients"
          label="Patient accounts"
          total={patients.data?.meta?.total}
          pending={patients.isPending}
        />
        <SummaryCard
          title="Admins"
          href="/admin/admins"
          label="Admin and super admin accounts"
          total={admins.data?.meta?.total}
          pending={admins.isPending}
        />
      </div>
    </div>
  );
}
