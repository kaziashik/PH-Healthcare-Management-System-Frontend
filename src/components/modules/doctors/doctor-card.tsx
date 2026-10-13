"use client";

import { Stethoscope } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Doctor } from "@/types";

export function doctorInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function doctorPhoto(doctor: Doctor) {
  return doctor.user?.imageUrl?.trim() || "";
}

export function doctorFeeLabel(fee: Doctor["consultationFee"]) {
  if (fee == null || fee === "") return "Fee set at the clinic";
  return `৳${fee}`;
}

export default function DoctorCard({ doctor }: { doctor: Doctor }) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const photo = photoFailed ? "" : doctorPhoto(doctor);

  return (
    <article className="group panel flex min-h-80 flex-col bg-card shadow-sm transition duration-300 motion-safe:hover:-translate-y-2 motion-safe:hover:border-[#14b8a6]/60 motion-safe:hover:shadow-[0_22px_50px_rgba(6,40,47,0.22)]">
      {photo ? (
        <div className="overflow-hidden">
          <img
            src={photo}
            alt={`${doctor.name}, ${doctor.specialization} physician`}
            className="aspect-[5/4] w-full object-cover object-top transition duration-700 ease-out motion-safe:group-hover:scale-105"
            onError={() => setPhotoFailed(true)}
          />
        </div>
      ) : (
        <div
          aria-hidden="true"
          className="flex aspect-[5/4] items-center justify-center bg-primary/10 text-3xl font-semibold text-primary"
        >
          {doctorInitials(doctor.name)}
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg font-semibold">{doctor.name}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {doctor.bio?.trim() ||
            `${doctor.qualifications}. ${doctor.specialization}.`}
        </p>
        <p className="flex items-center gap-1.5 text-sm">
          <Stethoscope className="size-3.5 text-primary" aria-hidden="true" />
          {doctor.specialization} · {doctorFeeLabel(doctor.consultationFee)} ·{" "}
          {doctor.experienceYears}{" "}
          {doctor.experienceYears === 1 ? "year" : "years"}
        </p>
        <div className="mt-auto flex flex-col gap-2 sm:flex-row">
          <Button
            className="bg-[#0f766e] text-white hover:bg-[#115e59]"
            nativeButton={false}
            render={
              <Link href={`/doctors/${doctor.id}#appointment`}>
                Appointment
              </Link>
            }
          >
            Appointment
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href={`/doctors/${doctor.id}`}>View details</Link>}
          >
            View details
          </Button>
        </div>
      </div>
    </article>
  );
}

export function DoctorCardSkeleton() {
  return (
    <div className="panel flex min-h-80 flex-col">
      <div className="aspect-[5/4] animate-pulse bg-muted" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="mt-auto h-8 w-28 animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  );
}
