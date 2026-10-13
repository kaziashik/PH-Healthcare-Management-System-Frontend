"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  useCancelAppointment,
  useGetMyAppointments,
  usePayAppointment,
} from "@/hooks/appointment.hook";
import { formatChosenVisit } from "@/lib/visit-time";
import { apiErrorMessage } from "@/utils";

export function isUnpaidDayError(error: unknown) {
  const message = apiErrorMessage(error).toLowerCase();
  return message.includes("have not paid") || message.includes("duplicate key");
}

export default function UnpaidSlotNotice({
  open,
  scheduleId,
  onClose,
}: {
  open: boolean;
  scheduleId: string | null;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const visits = useGetMyAppointments(
    {
      page: 1,
      limit: 20,
      status: "PENDING",
    },
    open,
  );
  const pay = usePayAppointment();
  const cancelVisit = useCancelAppointment();
  const unpaid = (visits.data?.data ?? []).find(
    (appointment) =>
      appointment.schedule.id === scheduleId && appointment.status === "PENDING",
  );
  const when = formatChosenVisit(unpaid?.joiningTime ?? null);
  const busy = pay.isPending || cancelVisit.isPending;

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [busy, onClose, open]);

  if (!open) return null;

  const refreshTimes = () => {
    queryClient.invalidateQueries({ queryKey: ["open-slots"] });
    queryClient.invalidateQueries({ queryKey: ["patient-appointments"] });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/40"
        disabled={busy}
        onClick={onClose}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="unpaid-slot-title"
        className="relative w-full max-w-md rounded-2xl border bg-popover p-6 text-popover-foreground shadow-lg"
      >
        <h2 id="unpaid-slot-title" className="text-lg font-semibold">
          Unpaid time for this day
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You already booked a time for this day and have not paid. Pay that
          time, or cancel it before choosing a new time.
        </p>
        {visits.isPending ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Loading your unpaid time...
          </p>
        ) : null}
        {when ? (
          <p className="mt-3 text-sm font-medium">Your unpaid time is {when}.</p>
        ) : null}
        {pay.isError ? (
          <p className="mt-3 text-sm text-destructive">
            {apiErrorMessage(pay.error)}
          </p>
        ) : null}
        {cancelVisit.isError ? (
          <p className="mt-3 text-sm text-destructive">
            {apiErrorMessage(cancelVisit.error)}
          </p>
        ) : null}
        <div className="mt-5 flex flex-wrap gap-2">
          <Button
            type="button"
            disabled={!unpaid || busy}
            onClick={() => {
              if (!unpaid) return;
              pay.mutate(
                { appointmentId: unpaid.id },
                {
                  onSuccess: (response) => {
                    if (response.data?.paymentUrl) {
                      window.location.assign(response.data.paymentUrl);
                    }
                  },
                },
              );
            }}
          >
            {pay.isPending ? <Spinner /> : "Pay previous time"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!unpaid || busy}
            onClick={() => {
              if (!unpaid) return;
              cancelVisit.mutate(
                { appointmentId: unpaid.id },
                {
                  onSuccess: () => {
                    refreshTimes();
                    onClose();
                  },
                },
              );
            }}
          >
            {cancelVisit.isPending ? <Spinner /> : "Cancel that time"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={busy}
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
