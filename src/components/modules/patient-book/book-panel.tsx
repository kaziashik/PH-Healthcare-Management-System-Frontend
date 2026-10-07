"use client";

import { useState } from "react";
import ListPager from "@/components/modules/list-pager";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useBookAppointment } from "@/hooks/appointment.hook";
import { useGetTodaysSchedules } from "@/hooks/schedule.hook";
import { formatVisitRange } from "@/lib/visit-time";
import { apiErrorMessage } from "@/utils";

export default function BookPanel() {
  const [page, setPage] = useState(1);
  const { data, isPending, isError } = useGetTodaysSchedules({
    page,
    limit: 10,
  });
  const book = useBookAppointment();
  const schedules = data?.data ?? [];

  return (
    <div className="flex flex-col gap-4">
      {isPending ? (
        <p className="text-sm text-muted-foreground">
          Loading today's schedules...
        </p>
      ) : null}
      {isError ? (
        <p className="text-sm text-destructive">
          Could not load today's schedules.
        </p>
      ) : null}

      {!isPending && !isError && schedules.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No doctors have an open schedule later today.
        </p>
      ) : null}

      <div className="grid gap-3">
        {schedules.map((schedule) => {
          const booking =
            book.isPending && book.variables?.scheduleId === schedule.id;
          const fee = schedule.doctor?.consultationFee;

          return (
            <article key={schedule.id} className="rounded-lg border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{schedule.doctor?.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {schedule.doctor?.specialization}
                    {fee != null ? ` · ৳${fee}` : ""}
                  </p>
                  <p className="mt-2 text-sm">
                    {formatVisitRange(
                      schedule.startDateTime,
                      schedule.endDateTime,
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {schedule.availableSlots} open slots
                  </p>
                </div>
                <Button
                  type="button"
                  disabled={booking}
                  onClick={() =>
                    book.mutate(
                      { scheduleId: schedule.id },
                      {
                        onSuccess: (response) => {
                          if (response.data?.paymentUrl) {
                            window.location.assign(response.data.paymentUrl);
                            return;
                          }
                          toast.add({
                            title: "Payment link missing",
                            description:
                              "The booking did not return a bKash URL.",
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
                    )
                  }
                >
                  {booking ? (
                    <>
                      <Spinner /> Opening bKash
                    </>
                  ) : (
                    "Book"
                  )}
                </Button>
              </div>
            </article>
          );
        })}
      </div>

      <ListPager
        page={page}
        totalPages={data?.meta?.totalPages ?? 1}
        onPageChange={setPage}
      />
    </div>
  );
}
