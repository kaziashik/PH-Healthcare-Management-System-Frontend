"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PayChoiceNotice from "@/components/modules/patient-book/pay-choice-notice";
import UnpaidSlotNotice, {
  isUnpaidDayError,
} from "@/components/modules/patient-book/unpaid-slot-notice";
import { toast } from "@/components/ui/toast";
import { useGetMe } from "@/hooks/auth.hook";
import { useBookAppointment } from "@/hooks/appointment.hook";
import { useGetDoctorOpenSlots } from "@/hooks/schedule.hook";
import type { OpenSlot } from "@/types/schedule.type";
import { apiErrorMessage } from "@/utils";

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
  const router = useRouter();
  const queryClient = useQueryClient();
  const [unpaidScheduleId, setUnpaidScheduleId] = useState<string | null>(null);
  const [heldPayment, setHeldPayment] = useState<{
    paymentUrl: string;
    scheduleId: string;
    whenLabel: string;
  } | null>(null);
  const me = useGetMe();
  const role = me.data?.data?.role;
  const slots = useGetDoctorOpenSlots(doctorId);
  const book = useBookAppointment();
  const times = slots.data?.data ?? [];
  const days = times.reduce<Record<string, OpenSlot[]>>((groups, slot) => {
    const day = new Date(slot.startDateTime).toLocaleDateString(undefined, {
      day: "numeric",
      month: "long",
    });
    groups[day] = [...(groups[day] ?? []), slot];
    return groups;
  }, {});

  const payFor = (slot: OpenSlot) => {
    if (me.isPending) return;
    if (role !== "PATIENT") {
      if (!role) {
        router.push("/login");
        return;
      }
      toast.add({
        title: "Patient account needed",
        description: "Booking opens from a patient account.",
        type: "error",
      });
      return;
    }

    book.mutate(
      { scheduleId: slot.scheduleId, serialNumber: slot.serialNumber },
      {
        onSuccess: (response) => {
          queryClient.invalidateQueries({ queryKey: ["open-slots", doctorId] });
          if (response.data?.paymentUrl) {
            setHeldPayment({
              paymentUrl: response.data.paymentUrl,
              scheduleId: slot.scheduleId,
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
    <section id="times" className="panel scroll-mt-24 p-4">
      <h2 className="text-xl font-semibold">Free times</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Choose a time with {doctorName}. You can pay now or within 5 minutes.
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
              {daySlots.map((slot) => {
                const paying =
                  book.isPending &&
                  book.variables?.scheduleId === slot.scheduleId &&
                  book.variables?.serialNumber === slot.serialNumber;
                return (
                  <li key={`${slot.scheduleId}-${slot.serialNumber}`}>
                    <button
                      type="button"
                      disabled={book.isPending}
                      onClick={() => payFor(slot)}
                      className="rounded-full border border-border bg-background px-3 py-1.5 text-sm transition hover:border-[#14b8a6] hover:bg-[#0f766e] hover:text-white disabled:opacity-60"
                    >
                      {paying
                        ? "Holding this time"
                        : `${formatSlotTime(slot.startDateTime)} – ${formatSlotTime(slot.endDateTime)}`}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <PayChoiceNotice
        open={heldPayment !== null}
        paymentUrl={heldPayment?.paymentUrl ?? null}
        scheduleId={heldPayment?.scheduleId ?? null}
        whenLabel={heldPayment?.whenLabel ?? ""}
        onClose={() => setHeldPayment(null)}
      />
      <UnpaidSlotNotice
        open={unpaidScheduleId !== null}
        scheduleId={unpaidScheduleId}
        onClose={() => setUnpaidScheduleId(null)}
      />
    </section>
  );
}
