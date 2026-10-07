import Link from "next/link";
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

export function doctorFeeLabel(fee: Doctor["consultationFee"]) {
  if (fee == null || fee === "") return "Fee set at the clinic";
  return `৳${fee}`;
}

export default function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <article className="panel flex min-h-80 flex-col transition-colors hover:border-primary/40">
      <div
        aria-hidden="true"
        className="flex h-36 items-center justify-center bg-primary/10 text-3xl font-semibold text-primary"
      >
        {doctorInitials(doctor.name)}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg font-semibold">{doctor.name}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {doctor.bio?.trim() ||
            `${doctor.qualifications}. ${doctor.specialization}.`}
        </p>
        <p className="text-sm">
          {doctor.specialization} · {doctorFeeLabel(doctor.consultationFee)} ·{" "}
          {doctor.experienceYears}{" "}
          {doctor.experienceYears === 1 ? "year" : "years"}
        </p>
        <Button
          className="mt-auto"
          nativeButton={false}
          render={<Link href={`/doctors/${doctor.id}`}>View details</Link>}
        >
          View details
        </Button>
      </div>
    </article>
  );
}

export function DoctorCardSkeleton() {
  return (
    <div className="panel flex min-h-80 flex-col">
      <div className="h-36 animate-pulse bg-muted" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="mt-auto h-8 w-28 animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  );
}
