"use client";

import {
  CalendarCheck,
  CalendarClock,
  Check,
  Clock,
  FileText,
  Hash,
  PenLine,
  Phone,
  Play,
  Stethoscope,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import PrescriptionForm from "@/components/form/prescription-form";
import PrescriptionRecord from "@/components/modules/prescriptions/prescription-record";
import { doctorInitials } from "@/components/modules/doctors/doctor-card";
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
import { useGetMe } from "@/hooks/auth.hook";
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

const filterIcon: Record<(typeof filters)[number], LucideIcon> = {
  BOOKED: CalendarCheck,
  ONGOING: Stethoscope,
  COMPLETED: Check,
  CANCELLED: X,
  ALL: CalendarClock,
};

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

function PatientFace({
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

export default function DoctorAppointmentsPanel() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<(typeof filters)[number]>("ALL");
  const [prescriptionFor, setPrescriptionFor] = useState<Appointment | null>(
    null,
  );
  const [historyFor, setHistoryFor] = useState<Appointment | null>(null);
  const { data, isPending, isError } = useGetDoctorAppointments({
    page,
    limit: 10,
    ...(status === "ALL" ? {} : { status }),
  });
  const updateStatus = useUpdateAppointmentStatus();
  const doctorName = useGetMe().data?.data?.name ?? "Doctor";
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
            description:
              nextStatus === "COMPLETED"
                ? "Write the prescription for this patient."
                : response.message,
            type: "success",
          });
          if (nextStatus === "COMPLETED") {
            setStatus("COMPLETED");
            setPage(1);
            setPrescriptionFor({ ...appointment, status: "COMPLETED" });
          }
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
        {filters.map((filter) => {
          const FilterIcon = filterIcon[filter];
          return (
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
              <FilterIcon aria-hidden="true" />
              {filter === "ALL"
                ? "All"
                : filter.charAt(0) + filter.slice(1).toLowerCase()}
            </Button>
          );
        })}
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
                  const moving =
                    updateStatus.isPending &&
                    updateStatus.variables?.appointmentId === appointment.id;
                  const canStart =
                    appointment.status === "BOOKED" ||
                    appointment.status === "CONFIRMED";
                  const meetingLink =
                    appointment.schedule?.meetingLink &&
                    appointment.status !== "CANCELLED" &&
                    appointment.status !== "PENDING"
                      ? appointment.schedule.meetingLink
                      : "";
                  const statusView = statusMeta[appointment.status];
                  const StatusIcon = statusView.icon;
                  const patientName = appointment.patient?.name ?? "Patient";

                  return (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <PatientFace
                            name={patientName}
                            imageUrl={appointment.patient?.user?.imageUrl}
                          />
                          <div className="min-w-0">
                            <p className="font-medium">{patientName}</p>
                            {appointment.patient?.contactNumber ? (
                              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Phone
                                  className="size-3.5 shrink-0"
                                  aria-hidden="true"
                                />
                                <span className="truncate">
                                  {appointment.patient.contactNumber}
                                </span>
                              </p>
                            ) : null}
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
                            —
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
                        <div className="flex flex-wrap justify-end gap-2">
                          {canStart ? (
                            <Button
                              type="button"
                              size="sm"
                              disabled={moving}
                              onClick={() => moveVisit(appointment, "ONGOING")}
                            >
                              {moving ? <Spinner /> : <Play aria-hidden="true" />}
                              Start visit
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
                              {moving ? <Spinner /> : <Check aria-hidden="true" />}
                              Complete visit
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
                              <PenLine aria-hidden="true" />
                              Write prescription
                            </Button>
                          ) : null}
                          {appointment.prescription || appointment.prescriptionUrl ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => setHistoryFor(appointment)}
                            >
                              <FileText aria-hidden="true" />
                              View prescription
                            </Button>
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
              patientName={prescriptionFor.patient?.name ?? "the patient"}
              onDone={() => setPrescriptionFor(null)}
            />
          ) : null}
        </SheetContent>
      </Sheet>

      <PrescriptionRecord
        open={historyFor !== null}
        patientName={historyFor?.patient?.name ?? "Patient"}
        doctorName={doctorName}
        specialty={historyFor?.doctor?.specialization}
        visit={historyFor?.joiningTime}
        prescription={historyFor?.prescription ?? null}
        fileUrl={historyFor?.prescriptionUrl}
        onClose={() => setHistoryFor(null)}
      />
    </div>
  );
}
