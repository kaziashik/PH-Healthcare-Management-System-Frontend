"use client";

import { CalendarClock, ClipboardList, Pill, Stethoscope } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatChosenVisit } from "@/lib/visit-time";
import type { StoredPrescription } from "@/types/appointment.type";

export default function PrescriptionRecord({
  open,
  patientName,
  doctorName,
  specialty,
  visit,
  prescription,
  fileUrl,
  onClose,
}: {
  open: boolean;
  patientName: string;
  doctorName: string;
  specialty?: string | null;
  visit?: string | null;
  prescription: StoredPrescription | null;
  fileUrl?: string | null;
  onClose: () => void;
}) {
  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <SheetContent className="overflow-y-auto p-6 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Prescription</SheetTitle>
          <SheetDescription>
            Saved on this visit for {patientName}.
          </SheetDescription>
        </SheetHeader>
        {prescription ? (
          <article className="mt-4 rounded-xl border bg-card p-4">
            <p className="text-center text-lg font-semibold">PH Healthcare</p>
            <p className="text-center text-xs tracking-wide text-muted-foreground uppercase">
              Prescription
            </p>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex items-start gap-2">
                <ClipboardList className="mt-0.5 size-4 text-primary" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-muted-foreground">Patient</dt>
                  <dd className="font-medium">{patientName}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Stethoscope className="mt-0.5 size-4 text-primary" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-muted-foreground">Doctor</dt>
                  <dd className="font-medium">
                    {doctorName}
                    {specialty ? ` · ${specialty}` : ""}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CalendarClock className="mt-0.5 size-4 text-primary" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-muted-foreground">Visit</dt>
                  <dd className="font-medium">
                    {formatChosenVisit(visit ?? null) ?? "Completed visit"}
                  </dd>
                </div>
              </div>
            </dl>
            <h3 className="mt-5 text-sm font-semibold">Findings</h3>
            <p className="mt-1 text-sm whitespace-pre-wrap">{prescription.findings}</p>
            <h3 className="mt-5 text-sm font-semibold">Medicines</h3>
            <ul className="mt-2 flex flex-col gap-3">
              {prescription.medicines.map((medicine, index) => (
                <li key={`${medicine.name}-${index}`} className="rounded-lg border p-3">
                  <p className="flex items-center gap-2 font-medium">
                    <Pill className="size-4 text-primary" aria-hidden="true" />
                    {index + 1}. {medicine.name}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {medicine.dosage} · {medicine.duration}
                  </p>
                  {medicine.instructions ? (
                    <p className="mt-1 text-sm">{medicine.instructions}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </article>
        ) : fileUrl ? (
          <a
            className="mt-4 inline-flex text-sm font-medium underline underline-offset-4"
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
          >
            Open prescription file
          </a>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            This prescription is not available to read here.
          </p>
        )}
      </SheetContent>
    </Sheet>
  );
}
