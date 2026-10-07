"use client";

import Link from "next/link";
import { useGetMyAppointments } from "@/hooks/appointment.hook";
import { useGetTodaysSchedules } from "@/hooks/schedule.hook";
import { formatVisitRange } from "@/lib/visit-time";

export default function PatientOverview() {
  const schedules = useGetTodaysSchedules({ page: 1, limit: 5 });
  const visits = useGetMyAppointments({ page: 1, limit: 5 });

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="rounded-lg border p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Open today</h2>
          <Link
            className="text-sm underline underline-offset-4"
            href="/patient/book"
          >
            Book
          </Link>
        </div>
        {schedules.isPending ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : null}
        {schedules.data?.data?.length ? (
          <ul className="flex flex-col gap-2 text-sm">
            {schedules.data.data.map((schedule) => (
              <li key={schedule.id}>
                {schedule.doctor?.name} ·{" "}
                {formatVisitRange(schedule.startDateTime, schedule.endDateTime)}
              </li>
            ))}
          </ul>
        ) : schedules.isPending ? null : (
          <p className="text-sm text-muted-foreground">
            No doctors have an open schedule later today.
          </p>
        )}
      </section>

      <section className="rounded-lg border p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Your visits</h2>
          <Link
            className="text-sm underline underline-offset-4"
            href="/patient/appointments"
          >
            Open
          </Link>
        </div>
        {visits.isPending ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : null}
        {visits.data?.data?.length ? (
          <ul className="flex flex-col gap-2 text-sm">
            {visits.data.data.map((visit) => (
              <li key={visit.id}>
                {visit.doctor?.name} · {visit.status}
              </li>
            ))}
          </ul>
        ) : visits.isPending ? null : (
          <p className="text-sm text-muted-foreground">No visits yet.</p>
        )}
      </section>
    </div>
  );
}
