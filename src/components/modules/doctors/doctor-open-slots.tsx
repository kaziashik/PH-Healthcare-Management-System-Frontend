"use client";

import { useGetDoctorOpenSlots } from "@/hooks/schedule.hook";

function formatSlotTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function DoctorOpenSlots({
  doctorId,
  doctorName,
}: {
  doctorId: string;
  doctorName: string;
}) {
  const slots = useGetDoctorOpenSlots(doctorId);
  const times = slots.data?.data ?? [];
  const days = times.reduce<Record<string, typeof times>>((groups, slot) => {
    const day = new Date(slot.startDateTime).toLocaleDateString(undefined, {
      day: "numeric",
      month: "long",
    });
    groups[day] = [...(groups[day] ?? []), slot];
    return groups;
  }, {});

  return (
    <section id="times" className="panel scroll-mt-24 p-4">
      <h2 className="text-xl font-semibold">Free times</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Open 20-minute visits with {doctorName}. Taken times and times held for
        payment are hidden.
      </p>
      {slots.isPending ? (
        <p className="mt-4 text-sm text-muted-foreground">Loading times...</p>
      ) : null}
      {slots.isError ? (
        <p className="mt-4 text-sm text-destructive">Could not load times.</p>
      ) : null}
      {!slots.isPending && !slots.isError && times.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No free times are published for this doctor.
        </p>
      ) : null}
      <div className="mt-4 flex flex-col gap-4">
        {Object.entries(days).map(([day, daySlots]) => (
          <div key={day}>
            <h3 className="text-sm font-medium">{day}</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {daySlots.map((slot) => (
                <li
                  key={`${slot.scheduleId}-${slot.serialNumber}`}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-sm"
                >
                  {formatSlotTime(slot.startDateTime)} –{" "}
                  {formatSlotTime(slot.endDateTime)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
