"use client";

import { useState } from "react";
import ListPager from "@/components/modules/list-pager";
import { Button } from "@/components/ui/button";
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
  useCancelAppointment,
  useGetMyAppointments,
} from "@/hooks/appointment.hook";
import { formatVisitRange } from "@/lib/visit-time";
import type { AppointmentStatus } from "@/types/appointment.type";
import { apiErrorMessage } from "@/utils";

const filters: ("ALL" | AppointmentStatus)[] = [
  "ALL",
  "BOOKED",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
];

export default function PatientAppointmentsPanel() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<(typeof filters)[number]>("ALL");
  const { data, isPending, isError } = useGetMyAppointments({
    page,
    limit: 10,
    ...(status === "ALL" ? {} : { status }),
  });
  const cancelVisit = useCancelAppointment();
  const appointments = data?.data ?? [];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter}
            type="button"
            size="sm"
            variant={status === filter ? "default" : "outline"}
            onClick={() => {
              setStatus(filter);
              setPage(1);
            }}
          >
            {filter === "ALL"
              ? "All"
              : filter.charAt(0) + filter.slice(1).toLowerCase()}
          </Button>
        ))}
      </div>

      {isPending ? (
        <p className="text-sm text-muted-foreground">Loading visits...</p>
      ) : null}
      {isError ? (
        <p className="text-sm text-destructive">Could not load visits.</p>
      ) : null}

      {!isPending && !isError ? (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead>When</TableHead>
                <TableHead>Serial</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>No visits found.</TableCell>
                </TableRow>
              ) : (
                appointments.map((appointment) => {
                  const cancelling =
                    cancelVisit.isPending &&
                    cancelVisit.variables?.appointmentId === appointment.id;

                  return (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        {appointment.doctor?.name}
                        <span className="block text-xs text-muted-foreground">
                          {appointment.doctor?.specialization}
                        </span>
                      </TableCell>
                      <TableCell>
                        {formatVisitRange(
                          appointment.schedule.startDateTime,
                          appointment.schedule.endDateTime,
                        )}
                      </TableCell>
                      <TableCell>{appointment.serialNumber ?? "—"}</TableCell>
                      <TableCell>{appointment.status}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end gap-2">
                          {appointment.prescriptionUrl ? (
                            <a
                              className="text-sm font-medium underline underline-offset-4"
                              href={appointment.prescriptionUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              View prescription
                            </a>
                          ) : null}
                          {appointment.status !== "CANCELLED" ? (
                            <div className="flex flex-col items-end gap-1">
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                disabled={cancelling}
                                onClick={() =>
                                  cancelVisit.mutate(
                                    { appointmentId: appointment.id },
                                    {
                                      onSuccess: (response) => {
                                        toast.add({
                                          title: "Visit cancelled",
                                          description: response.message,
                                          type: "success",
                                        });
                                      },
                                      onError: (error) => {
                                        toast.add({
                                          title: "Could not cancel visit",
                                          description: apiErrorMessage(error),
                                          type: "error",
                                        });
                                      },
                                    },
                                  )
                                }
                              >
                                {cancelling ? <Spinner /> : "Cancel visit"}
                              </Button>
                              <span className="max-w-56 text-right text-xs text-muted-foreground">
                                A refund is issued only when you cancel more
                                than 1 hour before the visit starts.
                              </span>
                            </div>
                          ) : null}
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
    </div>
  );
}
