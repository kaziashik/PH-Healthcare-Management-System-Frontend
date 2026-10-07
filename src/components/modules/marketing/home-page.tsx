"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGetMe } from "@/hooks/auth.hook";
import { useGetAllDoctors } from "@/hooks/doctor.hook";
import DoctorCard, { DoctorCardSkeleton } from "../doctors/doctor-card";

const services = [
  {
    title: "Same-day schedules",
    text: "A doctor publishes a 3 to 8 hour window. Patients can book only before it starts.",
  },
  {
    title: "bKash checkout",
    text: "Booking opens the bKash payment page. The visit is confirmed after payment succeeds.",
  },
  {
    title: "Serial slots",
    text: "Each paid visit gets the next open 20-minute serial inside the schedule.",
  },
  {
    title: "Prescriptions",
    text: "After a completed visit, the doctor records findings and medicines. The patient can open the prescription.",
  },
];

const rules = [
  "A schedule stays on one calendar date.",
  "The date locks after the schedule is published.",
  "The time range locks after the first booking.",
  "Cancel more than 1 hour before the start time to receive a refund.",
];

const questions = [
  {
    q: "Who can book a visit?",
    a: "A verified patient account. Google sign-in creates a patient account, and a password can be set afterward.",
  },
  {
    q: "When does a doctor appear in the directory?",
    a: "After email verification and admin approval. Pending and rejected applications stay off the public list.",
  },
  {
    q: "What does the consultation fee cover?",
    a: "The doctor's consultation fee is the bKash amount charged when the appointment is booked.",
  },
];

export default function HomePage() {
  const doctors = useGetAllDoctors({ page: 1, limit: 50 });
  const me = useGetMe();
  const role = me.data?.data?.role;
  const primary =
    role === "PATIENT"
      ? { href: "/patient/book", label: "Book an open visit" }
      : role === "DOCTOR"
        ? { href: "/doctor/schedules", label: "Open my schedules" }
        : role === "ADMIN" || role === "SUPER_ADMIN"
          ? { href: "/admin", label: "Open the dashboard" }
          : { href: "/doctors", label: "Find a doctor" };
  const secondary =
    role === "DOCTOR" || role === "ADMIN" || role === "SUPER_ADMIN"
      ? null
      : role === "PATIENT"
        ? { href: "/doctors", label: "Browse doctors" }
        : { href: "/register", label: "Create a patient account" };

  const specialties = [
    ...new Set(
      (doctors.data?.data ?? []).map((doctor) => doctor.specialization),
    ),
  ];

  return (
    <div>
      <section className="mx-auto flex min-h-[70vh] max-h-[640px] max-w-7xl flex-col justify-center px-4 py-12 sm:px-6">
        <p className="text-sm font-medium tracking-normal text-primary">
          PH Healthcare
        </p>
        <h1 className="mt-3 max-w-2xl text-3xl font-bold sm:text-4xl md:text-5xl">
          See an approved doctor later today
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted-foreground">
          Choose a doctor, pay the consultation fee with bKash, and receive a
          20-minute serial.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            nativeButton={false}
            render={<Link href={primary.href}>{primary.label}</Link>}
          >
            {primary.label}
          </Button>
          {secondary ? (
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href={secondary.href}>{secondary.label}</Link>}
            >
              {secondary.label}
            </Button>
          ) : null}
          {!role ? (
            <Link
              href="/apply"
              className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
            >
              Apply as a doctor
            </Link>
          ) : null}
        </div>
      </section>

      <section className="border-t bg-muted/40">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-14 sm:px-6 md:grid-cols-3 md:py-16">
          {[
            [
              "1",
              "Create an account",
              "Patients register and verify an email code. Doctors apply with a resume.",
            ],
            [
              "2",
              "Open a schedule",
              "An approved doctor publishes today's hours and a meeting link.",
            ],
            [
              "3",
              "Pay and attend",
              "The patient pays the consultation fee, then joins at the assigned serial time.",
            ],
          ].map(([step, title, text]) => (
            <article key={step} className="panel p-4">
              <p className="text-sm font-medium text-primary">Step {step}</p>
              <h2 className="mt-2 text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Approved doctors
            </h2>
            <p className="text-sm text-muted-foreground">
              Profiles currently open for booking.
            </p>
          </div>
          <Link
            className="text-sm underline underline-offset-4"
            href="/doctors"
          >
            View all
          </Link>
        </div>
        {doctors.isPending ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DoctorCardSkeleton />
            <DoctorCardSkeleton />
            <DoctorCardSkeleton />
          </div>
        ) : null}
        {doctors.isError ? (
          <p className="text-sm text-destructive">Could not load doctors.</p>
        ) : null}
        {!doctors.isPending && (doctors.data?.data.length ?? 0) === 0 ? (
          <p className="text-sm text-muted-foreground">
            No approved doctors are listed yet.
          </p>
        ) : null}
        {(doctors.data?.data.length ?? 0) > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.data?.data.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : null}
      </section>

      <section className="border-t">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-16 lg:grid-cols-4">
          {services.map((service) => (
            <article key={service.title} className="panel p-4">
              <h2 className="font-semibold">{service.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {service.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 md:grid-cols-3 md:py-16">
          <div>
            <p className="text-3xl font-bold">
              {doctors.data?.meta?.total ?? "—"}
            </p>
            <p className="text-sm">Approved doctors in the directory</p>
          </div>
          <div>
            <p className="text-3xl font-bold">20 min</p>
            <p className="text-sm">Length of each booked serial</p>
          </div>
          <div>
            <p className="text-3xl font-bold">1 hour</p>
            <p className="text-sm">
              Latest moment a cancellation can be refunded
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16">
        <h2 className="text-2xl font-bold tracking-tight">
          Specialties on the roster
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {specialties.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Specialties appear here after a doctor is approved.
            </p>
          ) : (
            specialties.map((item) => (
              <Link
                key={item}
                href={`/doctors?specialty=${encodeURIComponent(item)}`}
                className="rounded-lg border px-3 py-2 text-sm hover:bg-muted focus-visible:bg-muted"
              >
                {item}
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="border-t">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-16">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Visit rules</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Questions</h2>
            <div className="mt-4 flex flex-col gap-4">
              {questions.map((item) => (
                <article key={item.q}>
                  <h3 className="font-semibold">{item.q}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.a}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-14 sm:px-6 md:py-16">
          <h2 className="text-2xl font-bold">Questions about a visit?</h2>
          <p className="max-w-xl text-base text-muted-foreground">
            The clinic inbox is for messages that are not a booking. Booking
            stays on the doctor directory and the patient dashboard.
          </p>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/contact">Contact the clinic</Link>}
          >
            Contact the clinic
          </Button>
        </div>
      </section>
    </div>
  );
}
