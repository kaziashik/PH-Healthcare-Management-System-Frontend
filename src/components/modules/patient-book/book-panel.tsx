"use client";

import { useState } from "react";
import ListPager from "@/components/modules/list-pager";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useBookAppointment } from "@/hooks/appointment.hook";
import {
  useGetFutureSchedules,
  useGetTodaysSchedules,
} from "@/hooks/schedule.hook";
import { formatVisitRange } from "@/lib/visit-time";
import type { Schedule } from "@/types/schedule.type";
import { apiErrorMessage } from "@/utils";

function ScheduleList({
  title,
  emptyLabel,
  schedules,
  isPending,
  isError,
  page,
  totalPages,
  total,
  bookingId,
  onPageChange,
  onBook,
}: {
  title: string;
  emptyLabel: string;
  schedules: Schedule[];
  isPending: boolean;
  isError: boolean;
  page: number;
  totalPages: number;
  total?: number;
  bookingId?: string;
  onPageChange: (page: number) => void;
  onBook: (scheduleId: string) => void;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {isPending ? (
        <p className="text-sm text-muted-foreground">Loading schedules...</p>
      ) : null}
      {isError ? (
        <p className="text-sm text-destructive">Could not load schedules.</p>
      ) : null}
      {!isPending && !isError && schedules.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      ) : null}
      <div className="grid gap-3">
        {schedules.map((schedule) => {
          const booking = bookingId === schedule.id;
          const fee = schedule.doctor?.consultationFee;

          return (
            <article key={schedule.id} className="panel p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{schedule.doctor?.name}</h3>
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
                  onClick={() => onBook(schedule.id)}
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
        totalPages={totalPages}
        total={total}
        limit={10}
        onPageChange={onPageChange}
      />
    </section>
  );
}

export default function BookPanel() {
  const [todayPage, setTodayPage] = useState(1);
  const [futurePage, setFuturePage] = useState(1);
  const today = useGetTodaysSchedules({ page: todayPage, limit: 10 });
  const future = useGetFutureSchedules({ page: futurePage, limit: 10 });
  const book = useBookAppointment();

  const bookSchedule = (scheduleId: string) => {
    book.mutate(
      { scheduleId },
      {
        onSuccess: (response) => {
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
    <div className="flex flex-col gap-8">
      <ScheduleList
        title="Open later today"
        emptyLabel="No doctors have an open schedule later today."
        schedules={today.data?.data ?? []}
        isPending={today.isPending}
        isError={today.isError}
        page={todayPage}
        totalPages={today.data?.meta?.totalPages ?? 1}
        total={today.data?.meta?.total}
        bookingId={book.isPending ? book.variables?.scheduleId : undefined}
        onPageChange={setTodayPage}
        onBook={bookSchedule}
      />
      <ScheduleList
        title="Later days"
        emptyLabel="No doctors have a published schedule on a later day."
        schedules={future.data?.data ?? []}
        isPending={future.isPending}
        isError={future.isError}
        page={futurePage}
        totalPages={future.data?.meta?.totalPages ?? 1}
        total={future.data?.meta?.total}
        bookingId={book.isPending ? book.variables?.scheduleId : undefined}
        onPageChange={setFuturePage}
        onBook={bookSchedule}
      />
    </div>
  );
}
