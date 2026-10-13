"use client";

import {
  CalendarCheck,
  CalendarClock,
  Check,
  Clock,
  FileText,
  Hash,
  Stethoscope,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import ListPager from "@/components/modules/list-pager";
import { doctorInitials } from "@/components/modules/doctors/doctor-card";
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
  usePayAppointment,
} from "@/hooks/appointment.hook";
import { formatChosenVisit } from "@/lib/visit-time";
import type { Appointment, AppointmentStatus } from "@/types/appointment.type";
import { apiErrorMessage } from "@/utils";

const filters: ("ALL" | AppointmentStatus)[] = [
  "BOOKED",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
  "ALL",
];

const statusMeta: Record<
  AppointmentStatus,
  { label: string; icon: LucideIcon; className: string }
> = {
  PENDING: {
    label: "Waiting for payment",
    icon: Clock,
    className: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  },
  BOOKED: {
    label: "Booked",
    icon: CalendarCheck,
    className: "bg-primary/15 text-primary",
  },
  CONFIRMED: {
    label: "Confirmed",
    icon: CalendarCheck,
    className: "bg-primary/15 text-primary",
  },
  ONGOING: {
    label: "Ongoing",
    icon: Stethoscope,
    className: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  },
  COMPLETED: {
    label: "Completed",
    icon: Check,
    className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: X,
    className: "bg-destructive/10 text-destructive",
  },
};

function DoctorFace({
  name,
  imageUrl,
}: {
  name: string;
  imageUrl?: string | null;
}) {
  const [failed, setFailed] = useState(false);
  const photo = !failed && imageUrl?.trim() ? imageUrl : "";

  if (photo) {
    return (
      <img
        src={photo}
        alt=""
        className="size-10 shrink-0 rounded-full object-cover"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
      {doctorInitials(name)}
    </span>
  );
}

function meetingHref(appointment: Appointment) {
  const paid =
    appointment.payment?.status === "PAID" &&
    appointment.status !== "PENDING" &&
    appointment.status !== "CANCELLED";
  return paid ? appointment.schedule?.meetingLink : "";
}

export default function PatientAppointmentsPanel() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<(typeof filters)[number]>("ALL");
  const { data, isPending, isError } = useGetMyAppointments({
    page,
    limit: 10,
    ...(status === "ALL" ? {} : { status }),
  });
  const cancelVisit = useCancelAppointment();
  const payVisit = usePayAppointment();
  const [cancelTarget, setCancelTarget] = useState<{
    appointmentId: string;
    paid: boolean;
  } | null>(null);
  const appointments = data?.data ?? [];

  const confirmCancel = () => {
    if (!cancelTarget) return;
    const paid = cancelTarget.paid;
    cancelVisit.mutate(
      { appointmentId: cancelTarget.appointmentId },
      {
        onSuccess: (response) => {
          setCancelTarget(null);
          toast.add({
            title: paid ? "Visit cancelled" : "Booking cancelled",
            description: response.message,
            type: "success",
          });
        },
        onError: (error) => {
          toast.add({
            title: paid ? "Could not cancel visit" : "Could not cancel booking",
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
                <TableHead>Doctor</TableHead>
                <TableHead>Join visit</TableHead>
                <TableHead>Date and time</TableHead>
                <TableHead>Serial</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>No visits found.</TableCell>
                </TableRow>
              ) : (
                appointments.map((appointment) => {
                  const cancelling =
                    cancelVisit.isPending &&
                    cancelVisit.variables?.appointmentId === appointment.id;
                  const paying =
                    payVisit.isPending &&
                    payVisit.variables?.appointmentId === appointment.id;
                  const meetingLink = meetingHref(appointment);
                  const statusView = statusMeta[appointment.status];
                  const StatusIcon = statusView.icon;
                  const doctorName = appointment.doctor?.name ?? "Doctor";

                  return (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <DoctorFace
                            name={doctorName}
                            imageUrl={appointment.doctor?.user?.imageUrl}
                          />
                          <div className="min-w-0">
                            <p className="font-medium">{doctorName}</p>
                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Stethoscope
                                className="size-3.5 shrink-0"
                                aria-hidden="true"
                              />
                              <span className="truncate">
                                {appointment.doctor?.specialization}
                              </span>
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {meetingLink ? (
                          <Button
                            size="sm"
                            nativeButton={false}
                            render={
                              <a
                                href={meetingLink}
                                target="_blank"
                                rel="noreferrer"
                              />
                            }
                          >
                            <Video aria-hidden="true" />
                            Join visit
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            {appointment.status === "PENDING"
                              ? "After payment"
                              : "—"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarClock
                            className="size-3.5 shrink-0 text-muted-foreground"
                            aria-hidden="true"
                          />
                          {formatChosenVisit(appointment.joiningTime) ?? "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1">
                          <Hash
                            className="size-3.5 text-muted-foreground"
                            aria-hidden="true"
                          />
                          {appointment.serialNumber ?? "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${statusView.className}`}
                        >
                          <StatusIcon className="size-3.5" aria-hidden="true" />
                          {statusView.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-right whitespace-normal">
                        <div className="flex flex-col items-end gap-2">
                          {appointment.prescriptionUrl ? (
                            <a
                              className="inline-flex items-center gap-1.5 text-sm font-medium underline underline-offset-4"
                              href={appointment.prescriptionUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <FileText
                                className="size-3.5"
                                aria-hidden="true"
                              />
                              View prescription
                            </a>
                          ) : null}
                          {appointment.status === "PENDING" ? (
                            <div className="flex flex-col items-end gap-1">
                              <div className="flex justify-end gap-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  disabled={paying || cancelling}
                                  onClick={() =>
                                    payVisit.mutate(
                                      { appointmentId: appointment.id },
                                      {
                                        onSuccess: (response) => {
                                          if (response.data?.paymentUrl) {
                                            window.location.assign(
                                              response.data.paymentUrl,
                                            );
                                          }
                                        },
                                        onError: (error) => {
                                          toast.add({
                                            title: "Could not open payment",
                                            description: apiErrorMessage(error),
                                            type: "error",
                                          });
                                        },
                                      },
                                    )
                                  }
                                >
                                  {paying ? <Spinner /> : "Pay"}
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  disabled={paying || cancelling}
                                  onClick={() =>
                                    setCancelTarget({
                                      appointmentId: appointment.id,
                                      paid: false,
                                    })
                                  }
                                >
                                  {cancelling ? <Spinner /> : "Cancel"}
                                </Button>
                              </div>
                              <span className="max-w-56 text-right text-xs text-muted-foreground">
                                Pay within 5 minutes or this booking is
                                cancelled.
                              </span>
                            </div>
                          ) : null}
                          {appointment.status !== "CANCELLED" &&
                          appointment.status !== "PENDING" ? (
                            <div className="flex flex-col items-end gap-1">
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                disabled={cancelling}
                                onClick={() =>
                                  setCancelTarget({
                                    appointmentId: appointment.id,
                                    paid: true,
                                  })
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

      {cancelTarget ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Keep this visit"
            className="absolute inset-0 bg-black/45"
            onClick={() => setCancelTarget(null)}
          />
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="cancel-visit-title"
            className="relative w-full max-w-md rounded-2xl border bg-popover p-6 text-popover-foreground shadow-lg"
          >
            <h2 id="cancel-visit-title" className="text-lg font-semibold">
              Are you sure you want to cancel?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {cancelTarget.paid
                ? "A refund is issued only when you cancel more than 1 hour before the visit starts."
                : "This unpaid booking will be released."}
            </p>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCancelTarget(null)}
                disabled={cancelVisit.isPending}
              >
                Keep visit
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={confirmCancel}
                disabled={cancelVisit.isPending}
              >
                {cancelVisit.isPending ? <Spinner /> : "Yes, cancel"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
