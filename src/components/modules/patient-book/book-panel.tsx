"use client";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import PayChoiceNotice from "@/components/modules/patient-book/pay-choice-notice";
import UnpaidSlotNotice, {
  isUnpaidDayError,
} from "@/components/modules/patient-book/unpaid-slot-notice";
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

export default function BookPanel({
  doctorId,
  followUp = false,
}: {
  doctorId?: string;
  followUp?: boolean;
}) {
  const queryClient = useQueryClient();
  const [unpaidScheduleId, setUnpaidScheduleId] = useState<string | null>(null);
  const [heldPayment, setHeldPayment] = useState<{
    paymentUrl: string;
    whenLabel: string;
  } | null>(null);
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
            setHeldPayment({
              paymentUrl: response.data.paymentUrl,
              whenLabel: `${formatSlotTime(slot.startDateTime)} – ${formatSlotTime(slot.endDateTime)}`,
            });
            return;
          }
          toast.add({
            title: "Payment link missing",
            description: "The booking did not return a bKash URL.",
            type: "error",
          });
        },
        onError: (error) => {
          if (isUnpaidDayError(error)) {
            setUnpaidScheduleId(slot.scheduleId);
            return;
          }
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
          {followUp ? "Follow-up" : "Choose a time"} with {name ?? "this doctor"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {followUp
            ? "Pick another free time on this doctor's schedule. Each time is 20 minutes."
            : "Each time is 20 minutes. You can pay now or within 5 minutes."}
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
                      <Spinner /> Holding this time
                    </>
                  ) : (
                    "Book"
                  )}
                </Button>
              </article>
            );
          })}
        </section>
      ))}
      <PayChoiceNotice
        open={heldPayment !== null}
        paymentUrl={heldPayment?.paymentUrl ?? null}
        whenLabel={heldPayment?.whenLabel ?? ""}
        onClose={() => setHeldPayment(null)}
      />
      <UnpaidSlotNotice
        open={unpaidScheduleId !== null}
        scheduleId={unpaidScheduleId}
        onClose={() => setUnpaidScheduleId(null)}
      />
    </div>
  );
}
