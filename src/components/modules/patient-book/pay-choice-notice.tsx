"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  useCancelAppointment,
  useGetMyAppointments,
} from "@/hooks/appointment.hook";
import { apiErrorMessage } from "@/utils";

export default function PayChoiceNotice({
  open,
  paymentUrl,
  scheduleId,
  whenLabel,
  onClose,
}: {
  open: boolean;
  paymentUrl: string | null;
  scheduleId: string | null;
  whenLabel: string;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [later, setLater] = useState(false);
  const visits = useGetMyAppointments(
    { page: 1, limit: 20, status: "PENDING" },
    open && later,
  );
  const cancelVisit = useCancelAppointment();
  const unpaid = (visits.data?.data ?? []).find(
    (appointment) => appointment.schedule.id === scheduleId,
  );

  useEffect(() => {
    if (open) setLater(false);
  }, [open, paymentUrl]);

  if (!open || !paymentUrl) return null;

  const payNow = () => {
    window.location.assign(paymentUrl);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="pay-choice-title"
        className="relative w-full max-w-md rounded-2xl border bg-popover p-6 text-popover-foreground shadow-lg"
      >
        {later ? (
          <>
            <h2 id="pay-choice-title" className="text-lg font-semibold">
              Pay within 5 minutes
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {whenLabel ? `${whenLabel} is held.` : "This time is held."} You
              have to pay within 5 minutes. Otherwise this booking will be
              cancelled.
            </p>
            {cancelVisit.isError ? (
              <p className="mt-3 text-sm text-destructive">
                {apiErrorMessage(cancelVisit.error)}
              </p>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-2">
              <Button type="button" disabled={cancelVisit.isPending} onClick={payNow}>
                Pay
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={!unpaid || cancelVisit.isPending}
                onClick={() => {
                  if (!unpaid) return;
                  cancelVisit.mutate(
                    { appointmentId: unpaid.id },
                    {
                      onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: ["open-slots"] });
                        queryClient.invalidateQueries({
                          queryKey: ["patient-appointments"],
                        });
                        onClose();
                      },
                    },
                  );
                }}
              >
                {cancelVisit.isPending ? <Spinner /> : "Cancel"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2 id="pay-choice-title" className="text-lg font-semibold">
              Pay now or later
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {whenLabel ? `${whenLabel} is booked.` : "This time is booked."}{" "}
              You have to pay within 5 minutes. Otherwise this booking will be
              cancelled.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button type="button" onClick={payNow}>
                Pay now
              </Button>
              <Button type="button" variant="outline" onClick={() => setLater(true)}>
                Pay later
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
