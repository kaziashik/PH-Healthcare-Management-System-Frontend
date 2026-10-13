"use client";

import { useState } from "react";
import PrescriptionForm from "@/components/form/prescription-form";
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
  useGetDoctorAppointments,
  useUpdateAppointmentStatus,
} from "@/hooks/appointment.hook";
import { formatChosenVisit } from "@/lib/visit-time";
import type { Appointment, AppointmentStatus } from "@/types/appointment.type";
import { apiErrorMessage } from "@/utils";

const filters: ("ALL" | AppointmentStatus)[] = [
  "ALL",
  "BOOKED",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
];

export default function DoctorAppointmentsPanel() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<(typeof filters)[number]>("ALL");
  const [prescriptionFor, setPrescriptionFor] = useState<Appointment | null>(
    null,
  );
  const { data, isPending, isError } = useGetDoctorAppointments({
    page,
    limit: 10,
    ...(status === "ALL" ? {} : { status }),
  });
  const updateStatus = useUpdateAppointmentStatus();
  const appointments = data?.data ?? [];

  const moveVisit = (
    appointment: Appointment,
    nextStatus: "ONGOING" | "COMPLETED",
  ) => {
    updateStatus.mutate(
      { appointmentId: appointment.id, status: nextStatus },
      {
        onSuccess: (response) => {
          toast.add({
            title:
              nextStatus === "ONGOING" ? "Visit started" : "Visit completed",
            description: response.message,
            type: "success",
          });
        },
        onError: (error) => {
          toast.add({
            title: "Could not update visit",
            description: apiErrorMessage(error),
            type: "error",
          });
        },
      },
    );
  };

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
        <div className="panel">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Date and time</TableHead>
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
                  const moving =
                    updateStatus.isPending &&
                    updateStatus.variables?.appointmentId === appointment.id;
                  const canStart =
                    appointment.status === "BOOKED" ||
                    appointment.status === "CONFIRMED";

                  return (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.patient?.name}</TableCell>
                      <TableCell>
                        {formatChosenVisit(appointment.joiningTime) ?? "—"}
                      </TableCell>
                      <TableCell>{appointment.serialNumber ?? "—"}</TableCell>
                      <TableCell>{appointment.status}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {appointment.schedule.meetingLink &&
                          appointment.status !== "CANCELLED" &&
                          appointment.status !== "PENDING" ? (
                            <a
                              className="text-sm font-medium underline underline-offset-4"
                              href={appointment.schedule.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Join visit
                            </a>
                          ) : null}
                          {canStart ? (
                            <Button
                              type="button"
                              size="sm"
                              disabled={moving}
                              onClick={() => moveVisit(appointment, "ONGOING")}
                            >
                              {moving ? <Spinner /> : "Start visit"}
                            </Button>
                          ) : null}
                          {appointment.status === "ONGOING" ? (
                            <Button
                              type="button"
                              size="sm"
                              disabled={moving}
                              onClick={() =>
                                moveVisit(appointment, "COMPLETED")
                              }
                            >
                              {moving ? <Spinner /> : "Complete visit"}
                            </Button>
                          ) : null}
                          {appointment.status === "COMPLETED" &&
                          !appointment.prescriptionUrl ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => setPrescriptionFor(appointment)}
                            >
                              Write prescription
                            </Button>
                          ) : null}
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
        open={prescriptionFor !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPrescriptionFor(null);
          }
        }}
      >
        <SheetContent className="overflow-y-auto p-6 sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Write prescription</SheetTitle>
            <SheetDescription>
              Findings and medicines are saved for{" "}
              {prescriptionFor?.patient?.name}.
            </SheetDescription>
          </SheetHeader>
          {prescriptionFor ? (
            <PrescriptionForm
              appointmentId={prescriptionFor.id}
              onDone={() => setPrescriptionFor(null)}
            />
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
