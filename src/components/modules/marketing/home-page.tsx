"use client";

import {
  Baby,
  Bone,
  Brain,
  CalendarClock,
  Clock3,
  Ear,
  Eye,
  Flower2,
  Heart,
  ShieldCheck,
  Smile,
  Sparkles,
  Stethoscope,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGetMe } from "@/hooks/auth.hook";
import { useGetAllDoctors } from "@/hooks/doctor.hook";
import DoctorCard, { DoctorCardSkeleton } from "../doctors/doctor-card";

const rules = [
  "A schedule stays on one calendar date.",
  "The date locks after the schedule is published.",
  "The time range locks after the first booking.",
  "Cancel more than 1 hour before the start time to receive a refund.",
];

const specialtyIcons: Record<string, LucideIcon> = {
  Cardiology: Heart,
  Orthopedics: Bone,
  Pediatrics: Baby,
  Dermatology: Sparkles,
  Gynecology: Flower2,
  Neurology: Brain,
  Ophthalmology: Eye,
  ENT: Ear,
  Psychiatry: Smile,
  "General Medicine": Stethoscope,
};

const facts = [
  {
    icon: CalendarClock,
    label: "Same-day visits",
    detail: "Book only before today's schedule starts",
  },
  {
    icon: Clock3,
    label: "20-minute serial",
    detail: "Assigned after the bKash payment",
  },
  {
    icon: Wallet,
    label: "Consultation fee",
    detail: "The amount shown on the doctor's card",
  },
  {
    icon: ShieldCheck,
    label: "1-hour refund",
    detail: "Cancel earlier than that to be refunded",
  },
];

const rooms = [
  { src: "/clinic/clinic-reception.jpg", alt: "Bright clinic reception", title: "Reception" },
  { src: "/clinic/clinic-consult.jpg", alt: "Private consultation room", title: "Consultation" },
  { src: "/clinic/clinic-corridor.jpg", alt: "Quiet hospital corridor", title: "Corridor" },
  { src: "/clinic/clinic-waiting.jpg", alt: "Waiting room with soft daylight", title: "Waiting room" },
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
      <section className="border-b bg-muted/30">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:py-16">
          <div className="rise-in">
            <p className="text-sm font-medium tracking-normal text-primary">
              PH Healthcare
            </p>
            <h1 className="mt-3 max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">
              See an approved doctor later today
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground">
              Choose a doctor, pay the consultation fee with bKash, and receive
              a 20-minute serial.
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
          </div>
          <div className="rise-in rise-in-late relative h-80 overflow-hidden rounded-lg shadow-sm sm:h-[28rem]">
            <img
              src="/clinic/hero-hospital.jpg"
              alt="Bright hospital lobby with a wood reception desk"
              className="hero-ken h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-b bg-card">
        <ul className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:px-6 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((fact, index) => {
            const Icon = fact.icon;
            return (
              <li
                key={fact.label}
                className="rise-in flex items-start gap-3"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">
                    {fact.label}
                  </span>
                  <span className="block text-sm text-muted-foreground">
                    {fact.detail}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
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
              Doctors open for booking
            </h2>
            <p className="text-sm text-muted-foreground">
              A few approved physicians. The full roster is on the doctors page.
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
          <p className="text-sm text-destructive">
            Doctors could not be loaded right now. Refresh the page when the
            clinic API is available.
          </p>
        ) : null}
        {!doctors.isPending &&
        !doctors.isError &&
        (doctors.data?.data.length ?? 0) === 0 ? (
          <p className="text-sm text-muted-foreground">
            No approved doctors are listed yet.
          </p>
        ) : null}
        {(doctors.data?.data.length ?? 0) > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.data?.data.slice(0, 6).map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : null}
      </section>

      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16">
          <h2 className="text-2xl font-bold tracking-tight">
            Specialties on the roster
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Each specialty opens the directory already filtered.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {doctors.isPending ? (
              <p className="text-sm text-muted-foreground">
                Loading specialties…
              </p>
            ) : doctors.isError ? (
              <p className="text-sm text-muted-foreground">
                Specialties show here when the directory loads.
              </p>
            ) : specialties.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Specialties appear here after a doctor is approved.
              </p>
            ) : (
              specialties.map((item) => {
                const Icon = specialtyIcons[item] ?? Stethoscope;
                return (
                  <Link
                    key={item}
                    href={`/doctors?specialty=${encodeURIComponent(item)}`}
                    className="panel flex items-center gap-3 p-4 transition-colors hover:border-primary/40"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-medium">{item}</span>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16">
          <h2 className="text-2xl font-bold tracking-tight">Inside the clinic</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Reception, consultation rooms, and the waiting area patients see
            before a serial.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {rooms.map((room) => (
              <figure key={room.src} className="panel">
                <div className="h-44 overflow-hidden">
                  <img
                    src={room.src}
                    alt={room.alt}
                    className="h-full w-full object-cover transition duration-700 motion-safe:hover:scale-105"
                  />
                </div>
                <figcaption className="px-4 py-3 text-sm font-medium">
                  {room.title}
                </figcaption>
              </figure>
            ))}
          </div>
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
