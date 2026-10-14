"use client";

import {
  ArrowRight,
  Banknote,
  ClipboardList,
  Stethoscope,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useGetPaymentSummary } from "@/hooks/appointment.hook";
import { useGetAllDoctors } from "@/hooks/doctor.hook";
import { useGetAdmins, useGetPatients } from "@/hooks/user.hook";

const pieColors = ["#14b8a6", "#e2b15a", "#5eead4"];

function taka(amount: number) {
  return `৳${amount.toLocaleString("en-US", {
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  })}`;
}

function paymentHint(count: number) {
  return count === 1 ? "1 payment" : `${count} payments`;
}

function AttentionCard({
  title,
  description,
  href,
  total,
  pending,
  emphasized,
}: {
  title: string;
  description: string;
  href: string;
  total: number | undefined;
  pending: boolean;
  emphasized?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`panel flex items-start justify-between gap-4 p-4 transition hover:border-primary/50 ${
        emphasized ? "border-amber-400/80 ring-1 ring-amber-400/50" : ""
      }`}
    >
      <div className="min-w-0">
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <span className="flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-sm font-medium">
        {pending ? "…" : (total ?? 0)}
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </span>
    </Link>
  );
}

function StatCard({
  title,
  value,
  hint,
  icon: Icon,
  pending,
}: {
  title: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  pending: boolean;
}) {
  return (
    <section className="panel p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground">{title}</p>
        <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight">
        {pending ? "…" : value}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
    </section>
  );
}

function Pipeline({
  items,
}: {
  items: { label: string; value: number }[];
}) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <section className="panel p-5">
      <h2 className="font-semibold">Doctor applications</h2>
      <div className="mt-6 grid grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.label} className="min-w-0">
            <div className="h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${Math.max((item.value / max) * 100, item.value > 0 ? 8 : 0)}%`,
                }}
              />
            </div>
            <p className="mt-3 text-center text-sm font-medium">{item.value}</p>
            <p className="mt-1 text-center text-xs text-muted-foreground">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Distribution({
  items,
}: {
  items: { label: string; value: number }[];
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  let cursor = 0;
  const stops =
    total === 0
      ? ["var(--muted) 0% 100%"]
      : items.map((item, index) => {
          const start = cursor;
          cursor += (item.value / total) * 100;
          return `${pieColors[index]} ${start}% ${cursor}%`;
        });

  return (
    <section className="panel p-5">
      <h2 className="font-semibold">Account distribution</h2>
      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
        <div
          className="size-40 shrink-0 rounded-full"
          style={{ background: `conic-gradient(${stops.join(", ")})` }}
          aria-hidden="true"
        />
        <ul className="flex flex-col gap-2 text-sm">
          {items.map((item, index) => (
            <li key={item.label} className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: pieColors[index] }}
              />
              <span>{item.label}</span>
              <span className="font-medium">{item.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function AdminOverview() {
  const pendingDoctors = useGetAllDoctors({
    page: 1,
    limit: 1,
    verificationStatus: "PENDING",
  });
  const approvedDoctors = useGetAllDoctors({
    page: 1,
    limit: 1,
    verificationStatus: "APPROVED",
  });
  const rejectedDoctors = useGetAllDoctors({
    page: 1,
    limit: 1,
    verificationStatus: "REJECTED",
  });
  const patients = useGetPatients({ page: 1, limit: 1 });
  const admins = useGetAdmins({ page: 1, limit: 1 });
  const payments = useGetPaymentSummary();

  const waiting = pendingDoctors.data?.meta?.total ?? 0;
  const approved = approvedDoctors.data?.meta?.total ?? 0;
  const rejected = rejectedDoctors.data?.meta?.total ?? 0;
  const patientTotal = patients.data?.meta?.total ?? 0;
  const adminTotal = admins.data?.meta?.total ?? 0;
  const doctorTotal = waiting + approved + rejected;
  const countsPending =
    pendingDoctors.isPending ||
    approvedDoctors.isPending ||
    rejectedDoctors.isPending ||
    patients.isPending ||
    admins.isPending;

  return (
    <div className="flex flex-col gap-5">
      <section>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">
          Needs attention
        </h2>
        <div className="grid gap-3 lg:grid-cols-3">
          <AttentionCard
            title="Need approval"
            description="Review doctor applications that are still waiting."
            href="/admin/need-approval"
            total={waiting}
            pending={pendingDoctors.isPending}
            emphasized
          />
          <AttentionCard
            title="Patients"
            description="Open patient accounts and their contact details."
            href="/admin/patients"
            total={patientTotal}
            pending={patients.isPending}
          />
          <AttentionCard
            title="Approved doctors"
            description="Doctors who are active and can be booked."
            href="/admin/approved-doctors"
            total={approved}
            pending={approvedDoctors.isPending}
          />
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Patients"
          value={String(patientTotal)}
          hint="Patient accounts"
          icon={Users}
          pending={patients.isPending}
        />
        <StatCard
          title="Doctors"
          value={String(approved)}
          hint={`${waiting} waiting · ${rejected} rejected`}
          icon={Stethoscope}
          pending={countsPending}
        />
        <StatCard
          title="Applications"
          value={String(doctorTotal)}
          hint={`${waiting} waiting · ${approved} approved`}
          icon={ClipboardList}
          pending={countsPending}
        />
        <StatCard
          title="Revenue"
          value={taka(payments.data?.data?.paidAmount ?? 0)}
          hint={paymentHint(payments.data?.data?.paidCount ?? 0)}
          icon={Banknote}
          pending={payments.isPending}
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Pipeline
          items={[
            { label: "Waiting", value: waiting },
            { label: "Approved", value: approved },
            { label: "Total", value: doctorTotal },
          ]}
        />
        <Distribution
          items={[
            { label: "Patients", value: patientTotal },
            { label: "Doctors", value: approved },
            { label: "Admins", value: adminTotal },
          ]}
        />
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Applications still waiting?{" "}
        <Link
          href="/admin/need-approval"
          className="text-primary underline-offset-4 hover:underline"
        >
          Open need approval
        </Link>
      </p>
    </div>
  );
}
