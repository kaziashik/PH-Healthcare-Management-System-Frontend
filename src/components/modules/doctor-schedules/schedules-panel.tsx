"use client";

import { useState } from "react";
import ScheduleForm, {
  scheduleTimeIsLocked,
} from "@/components/form/schedule-form";
import ListPager from "@/components/modules/list-pager";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import {
  useDeleteSchedule,
  useGetMySchedules,
  usePublishSchedule,
} from "@/hooks/schedule.hook";
import { formatVisitRange } from "@/lib/visit-time";
import type { Schedule } from "@/types/schedule.type";
import { apiErrorMessage } from "@/utils";

export default function SchedulesPanel() {
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Schedule | null>(null);
  const { data, isPending, isError } = useGetMySchedules({ page, limit: 10 });
  const publishSchedule = usePublishSchedule();
  const deleteSchedule = useDeleteSchedule();
  const schedules = data?.data ?? [];

  return (
    <div className="flex flex-col gap-8">
      <div className="max-w-xl">
        <ScheduleForm />
      </div>

      {isPending ? (
        <p className="text-sm text-muted-foreground">Loading schedules...</p>
      ) : null}
      {isError ? (
        <p className="text-sm text-destructive">Could not load schedules.</p>
      ) : null}

      {!isPending && !isError ? (
        <div className="panel">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Slots</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Meeting</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>No schedules yet.</TableCell>
                </TableRow>
              ) : (
                schedules.map((schedule) => {
                  const publishing =
                    publishSchedule.isPending &&
                    publishSchedule.variables === schedule.id;
                  const deleting =
                    deleteSchedule.isPending &&
                    deleteSchedule.variables === schedule.id;

                  return (
                    <TableRow key={schedule.id}>
                      <TableCell>
                        {formatVisitRange(
                          schedule.startDateTime,
                          schedule.endDateTime,
                        )}
                      </TableCell>
                      <TableCell>
                        {schedule.availableSlots}/{schedule.totalSlots}
                      </TableCell>
                      <TableCell>{schedule.status}</TableCell>
                      <TableCell>
                        <a
                          className="underline underline-offset-4"
                          href={schedule.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open
                        </a>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {schedule.status === "DRAFT" ? (
                            <Button
                              type="button"
                              size="sm"
                              disabled={publishing}
                              onClick={() =>
                                publishSchedule.mutate(schedule.id, {
                                  onSuccess: (response) => {
                                    toast.add({
                                      title: "Day published",
                                      description: response.message,
                                      type: "success",
                                    });
                                  },
                                  onError: (error) => {
                                    toast.add({
                                      title: "Could not publish",
                                      description: apiErrorMessage(error),
                                      type: "error",
                                    });
                                  },
                                })
                              }
                            >
                              {publishing ? <Spinner /> : "Publish"}
                            </Button>
                          ) : null}
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setEditing(schedule)}
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            disabled={
                              deleting || scheduleTimeIsLocked(schedule)
                            }
                            onClick={() =>
                              deleteSchedule.mutate(schedule.id, {
                                onSuccess: (response) => {
                                  toast.add({
                                    title: "Schedule deleted",
                                    description: response.message,
                                    type: "success",
                                  });
                                },
                                onError: (error) => {
                                  toast.add({
                                    title: "Could not delete schedule",
                                    description: apiErrorMessage(error),
                                    type: "error",
                                  });
                                },
                              })
                            }
                          >
                            {deleting ? <Spinner /> : "Delete"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      ) : null}

      <ListPager
        page={page}
        totalPages={data?.meta?.totalPages ?? 1}
        onPageChange={setPage}
      />

      <Sheet
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null);
          }
        }}
      >
        <SheetContent className="overflow-y-auto p-6">
          <SheetHeader>
            <SheetTitle>Edit schedule</SheetTitle>
            <SheetDescription>
              A published date stays fixed. The time range stays fixed after the
              first booking. The meeting link can still change.
            </SheetDescription>
          </SheetHeader>
          {editing ? (
            <ScheduleForm
              key={editing.id}
              schedule={editing}
              onDone={() => setEditing(null)}
            />
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
