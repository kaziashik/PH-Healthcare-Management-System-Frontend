"use client";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useBookAppointment } from "@/hooks/appointment.hook";
import { useGetDoctor } from "@/hooks/doctor.hook";
import { useGetDoctorOpenSlots } from "@/hooks/schedule.hook";
import type { OpenSlot } from "@/types/schedule.type";
import { apiErrorMessage } from "@/utils";

function formatSlotTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function BookPanel({ doctorId }: { doctorId?: string }) {
  const queryClient = useQueryClient();
  const doctor = useGetDoctor(doctorId ?? "");
  const slots = useGetDoctorOpenSlots(doctorId ?? "");
  const book = useBookAppointment();

  if (!doctorId) {
    return (
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Choose a doctor</h1>
        <p className="text-sm text-muted-foreground">
          Search the roster, open a doctor, then pick a free time.
        </p>
        <Button nativeButton={false} render={<Link href="/doctors">Find a doctor</Link>}>
          Find a doctor
        </Button>
      </div>
    );
  }

  const name = doctor.data?.data?.name;
  const times = slots.data?.data ?? [];
  const days = times.reduce<Record<string, OpenSlot[]>>((groups, slot) => {
    const day = new Date(slot.startDateTime).toLocaleDateString(undefined, {
      day: "numeric",
      month: "long",
    });
    groups[day] = [...(groups[day] ?? []), slot];
    return groups;
  }, {});

  const bookTime = (slot: OpenSlot) => {
    book.mutate(
      { scheduleId: slot.scheduleId, serialNumber: slot.serialNumber },
      {
        onSuccess: (response) => {
          queryClient.invalidateQueries({ queryKey: ["open-slots", doctorId] });
          if (response.data?.paymentUrl) {
            window.location.assign(response.data.paymentUrl);
            return;
          }
          toast.add({
            title: "Payment link missing",
            description: "The booking did not return a bKash URL.",
            type: "error",
          });
        },
        onError: (error) => {
          toast.add({
            title: "Could not start booking",
            description: apiErrorMessage(error),
            type: "error",
          });
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Choose a time with {name ?? "this doctor"}.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Each time is 20 minutes. Book and pay keeps that time for you.
        </p>
      </div>
      {doctor.isPending || slots.isPending ? (
        <p className="text-sm text-muted-foreground">Loading times...</p>
      ) : null}
      {slots.isError || doctor.isError ? (
        <p className="text-sm text-destructive">Could not load times.</p>
      ) : null}
      {!slots.isPending && !slots.isError && times.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No free times are published for this doctor.
        </p>
      ) : null}
      {Object.entries(days).map(([day, daySlots]) => (
        <section key={day} className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">{day}</h2>
          {daySlots.map((slot) => {
            const booking =
              book.isPending &&
              book.variables?.scheduleId === slot.scheduleId &&
              book.variables?.serialNumber === slot.serialNumber;
            return (
              <article
                key={`${slot.scheduleId}-${slot.serialNumber}`}
                className="panel flex flex-wrap items-center justify-between gap-3 p-4"
              >
                <p className="font-medium">
                  {formatSlotTime(slot.startDateTime)} –{" "}
                  {formatSlotTime(slot.endDateTime)}
                </p>
                <Button
                  type="button"
                  disabled={book.isPending}
                  onClick={() => bookTime(slot)}
                >
                  {booking ? (
                    <>
                      <Spinner /> Opening bKash
                    </>
                  ) : (
                    "Book and pay"
                  )}
                </Button>
              </article>
            );
          })}
        </section>
      ))}
    </div>
  );
}
