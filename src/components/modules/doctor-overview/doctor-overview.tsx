"use client";

import Link from "next/link";
import { useGetDoctorAppointments } from "@/hooks/appointment.hook";
import { useGetMySchedules } from "@/hooks/schedule.hook";
import { formatVisitRange } from "@/lib/visit-time";

export default function DoctorOverview() {
  const schedules = useGetMySchedules({ page: 1, limit: 5 });
  const visits = useGetDoctorAppointments({
    page: 1,
    limit: 5,
    status: "BOOKED",
  });

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="panel flex flex-col p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Schedules</h2>
          <Link
            className="text-sm underline underline-offset-4"
            href="/doctor/schedules"
          >
            Manage
          </Link>
        </div>
        {schedules.isPending ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : null}
        {schedules.data?.data?.length ? (
          <ul className="flex flex-col gap-2 text-sm">
            {schedules.data.data.map((schedule) => (
              <li key={schedule.id}>
                {formatVisitRange(schedule.startDateTime, schedule.endDateTime)}{" "}
                · {schedule.status}
              </li>
            ))}
          </ul>
        ) : schedules.isPending ? null : (
          <p className="text-sm text-muted-foreground">No schedules yet.</p>
        )}
      </section>

      <section className="panel flex flex-col p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Booked visits</h2>
          <Link
            className="text-sm underline underline-offset-4"
            href="/doctor/appointments"
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
                {visit.patient?.name} · serial {visit.serialNumber ?? "—"}
              </li>
            ))}
          </ul>
        ) : visits.isPending ? null : (
          <p className="text-sm text-muted-foreground">No booked visits.</p>
        )}
      </section>
    </div>
  );
}
