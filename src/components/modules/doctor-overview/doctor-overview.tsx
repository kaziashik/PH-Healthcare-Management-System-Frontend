"use client";

import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useGetDoctorAppointments } from "@/hooks/appointment.hook";
import { useGetMySchedules } from "@/hooks/schedule.hook";
import type { AppointmentStatus } from "@/types/appointment.type";

const pieColors = ["#14b8a6", "#e2b15a"];

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
  total?: number;
  pending?: boolean;
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
        {total == null ? null : pending ? "…" : total}
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </span>
    </Link>
  );
}

function StatCard({
  title,
  value,
  pending,
}: {
  title: string;
  value: number;
  pending: boolean;
}) {
  return (
    <section className="panel p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight">
        {pending ? "…" : value}
      </p>
    </section>
  );
}

function VisitBars({
  items,
}: {
  items: { label: string; value: number }[];
}) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <section className="panel p-5">
      <h2 className="font-semibold">Patient visits</h2>
      <div className="mt-8 grid grid-cols-4 gap-3">
        {items.map((item) => (
          <div key={item.label} className="min-w-0">
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${Math.max((item.value / max) * 100, item.value > 0 ? 12 : 0)}%`,
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

function VisitPie({
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
      <h2 className="font-semibold">Visit status</h2>
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

function useVisitCount(status?: AppointmentStatus) {
  return useGetDoctorAppointments({
    page: 1,
    limit: 1,
    ...(status ? { status } : {}),
  });
}

export default function DoctorOverview() {
  const allVisits = useVisitCount();
  const booked = useVisitCount("BOOKED");
  const ongoing = useVisitCount("ONGOING");
  const completed = useVisitCount("COMPLETED");
  const published = useGetMySchedules({
    page: 1,
    limit: 1,
    status: "PUBLISHED",
  });

  const total = allVisits.data?.meta?.total ?? 0;
  const bookedTotal = booked.data?.meta?.total ?? 0;
  const ongoingTotal = ongoing.data?.meta?.total ?? 0;
  const completedTotal = completed.data?.meta?.total ?? 0;
  const publishedTotal = published.data?.meta?.total ?? 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            See your patients, booked visits, and open days.
          </p>
        </div>
        <Link href="/doctor/schedules" className={buttonVariants()}>
          <Plus aria-hidden="true" />
          Add a day
        </Link>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">
          Needs attention
        </h2>
        <div className="grid gap-3 lg:grid-cols-3">
          <AttentionCard
            title="Booked visits"
            description="Patients who paid and are ready to meet."
            href="/doctor/appointments"
            total={bookedTotal}
            pending={booked.isPending}
            emphasized
          />
          <AttentionCard
            title="My schedules"
            description="Published days patients can book."
            href="/doctor/schedules"
            total={publishedTotal}
            pending={published.isPending}
          />
          <AttentionCard
            title="Add a day"
            description="Create a schedule for patients to book."
            href="/doctor/schedules"
          />
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total visits" value={total} pending={allVisits.isPending} />
        <StatCard title="Booked" value={bookedTotal} pending={booked.isPending} />
        <StatCard
          title="Ongoing"
          value={ongoingTotal}
          pending={ongoing.isPending}
        />
        <StatCard
          title="Completed"
          value={completedTotal}
          pending={completed.isPending}
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <VisitBars
          items={[
            { label: "Booked", value: bookedTotal },
            { label: "Ongoing", value: ongoingTotal },
            { label: "Completed", value: completedTotal },
            { label: "Total", value: total },
          ]}
        />
        <VisitPie
          items={[
            { label: "Booked", value: bookedTotal },
            { label: "Completed", value: completedTotal },
          ]}
        />
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Patients ready to meet?{" "}
        <Link
          href="/doctor/appointments"
          className="text-primary underline-offset-4 hover:underline"
        >
          Open appointments
        </Link>
      </p>
    </div>
  );
}
