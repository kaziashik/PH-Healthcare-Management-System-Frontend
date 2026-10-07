"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGetMe } from "@/hooks/auth.hook";
import { useGetAllDoctors, useGetDoctor } from "@/hooks/doctor.hook";
import DoctorCard, { doctorFeeLabel, doctorInitials } from "./doctor-card";

export default function DoctorDetails({ doctorId }: { doctorId: string }) {
  const me = useGetMe();
  const role = me.data?.data?.role;
  const doctorQuery = useGetDoctor(doctorId);
  const doctor = doctorQuery.data?.data;
  const relatedQuery = useGetAllDoctors({
    page: 1,
    limit: 3,
    ...(doctor?.specialization
      ? { specialization: doctor.specialization }
      : {}),
  });
  const related = (relatedQuery.data?.data ?? []).filter(
    (item) => item.id !== doctorId,
  );

  if (doctorQuery.isPending) {
    return <p className="text-sm text-muted-foreground">Loading doctor...</p>;
  }

  if (doctorQuery.isError || !doctor) {
    return (
      <p className="text-sm text-destructive">
        This doctor profile is not available.
      </p>
    );
  }

  const facts = [
    ["Specialty", doctor.specialization],
    ["Qualifications", doctor.qualifications],
    ["Experience", `${doctor.experienceYears} years`],
    ["Consultation fee", doctorFeeLabel(doctor.consultationFee)],
    ["BMDC registration", doctor.licenseNumber],
    ["Contact", doctor.contactNumber || "Shared after booking"],
    ["Chamber", doctor.address || "Listed after approval"],
  ];

  return (
    <div className="flex flex-col gap-8">
      <section className="grid gap-6 rounded-lg border bg-card p-5 md:grid-cols-[180px_1fr]">
        <div className="flex h-44 items-center justify-center rounded-lg bg-primary/10 text-4xl font-semibold text-primary">
          {doctorInitials(doctor.name)}
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{doctor.name}</h1>
          <p className="text-muted-foreground">{doctor.specialization}</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            {role === "PATIENT" ? (
              <Button
                nativeButton={false}
                render={<Link href="/patient/book">Book an open visit</Link>}
              >
                Book an open visit
              </Button>
            ) : role ? (
              <p className="text-sm text-muted-foreground">
                Booking is available from a patient account.
              </p>
            ) : (
              <Button
                nativeButton={false}
                render={<Link href="/login">Sign in to book</Link>}
              >
                Sign in to book
              </Button>
            )}
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/doctors">All doctors</Link>}
            >
              All doctors
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-lg border p-5">
        <h2 className="text-xl font-semibold">Overview</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {doctor.bio?.trim() ||
            `${doctor.name} is an approved ${doctor.specialization} physician. Qualifications: ${doctor.qualifications}.`}
        </p>
      </section>

      <section className="rounded-lg border p-5">
        <h2 className="text-xl font-semibold">Key information</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {facts.map(([label, value]) => (
            <div key={label} className="rounded-lg bg-muted/50 p-3">
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="mt-1 text-sm font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-lg border p-5">
        <h2 className="text-xl font-semibold">How a visit works</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Published schedules are 3 to 8 hours on one calendar date.</li>
          <li>Each patient receives a 20-minute serial after bKash payment.</li>
          <li>
            A refund is issued only when you cancel more than 1 hour before the
            visit starts.
          </li>
        </ul>
      </section>

      {related.length > 0 ? (
        <section>
          <h2 className="mb-4 text-xl font-semibold">Related doctors</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <DoctorCard key={item.id} doctor={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
