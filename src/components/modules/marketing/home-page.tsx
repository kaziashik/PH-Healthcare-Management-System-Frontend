"use client";

import {
  ArrowRight,
  Baby,
  BadgeCheck,
  Bone,
  Brain,
  CalendarClock,
  Clock3,
  Ear,
  Eye,
  FileHeart,
  Flower2,
  Heart,
  ShieldCheck,
  Smile,
  Sparkles,
  Stethoscope,
  UserRoundPlus,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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

const slides = [
  {
    src: "/clinic/clinic-consult.jpg",
    alt: "Consultation room prepared for a doctor to see a patient",
    label: "Consultation",
  },
  {
    src: "/clinic/clinic-waiting.jpg",
    alt: "Waiting room with soft daylight",
    label: "Waiting room",
  },
  {
    src: "/clinic/clinic-reception.jpg",
    alt: "Bright clinic reception",
    label: "Reception",
  },
  {
    src: "/clinic/clinic-corridor.jpg",
    alt: "Quiet hospital corridor",
    label: "Corridor",
  },
  {
    src: "/clinic/hero-hospital.jpg",
    alt: "Bright hospital lobby with a wood reception desk",
    label: "Lobby",
  },
];

const rooms = [
  { src: "/clinic/clinic-reception.jpg", alt: "Bright clinic reception", title: "Reception" },
  { src: "/clinic/clinic-consult.jpg", alt: "Private consultation room", title: "Consultation" },
  { src: "/clinic/clinic-corridor.jpg", alt: "Quiet hospital corridor", title: "Corridor" },
  { src: "/clinic/clinic-waiting.jpg", alt: "Waiting room with soft daylight", title: "Waiting room" },
];

const pillars = [
  {
    icon: BadgeCheck,
    title: "Approved doctors only",
    text: "A profile stays off the public list until the doctor verifies email and an admin approves the application.",
  },
  {
    icon: Clock3,
    title: "Same-day serials",
    text: "Patients book before today's schedule starts. Payment assigns the next 20-minute serial.",
  },
  {
    icon: Wallet,
    title: "bKash checkout",
    text: "The consultation fee on the doctor's card is the amount charged when the visit is booked.",
  },
  {
    icon: FileHeart,
    title: "A prescription after the visit",
    text: "After the doctor marks the visit completed, findings and medicines are saved for the patient.",
  },
];

const steps = [
  {
    n: "01",
    icon: UserRoundPlus,
    title: "Create an account",
    text: "Patients register and verify an email code. Doctors apply with a resume.",
  },
  {
    n: "02",
    icon: CalendarClock,
    title: "Open a schedule",
    text: "An approved doctor publishes today's hours and a meeting link.",
  },
  {
    n: "03",
    icon: Wallet,
    title: "Pay and attend",
    text: "The patient pays the consultation fee, then joins at the assigned serial time.",
  },
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
  const [slide, setSlide] = useState(0);
  const slideRef = useRef(0);
  const direction = useRef(1);
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

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      let next = slideRef.current + direction.current;
      if (next >= slides.length - 1) direction.current = -1;
      if (next <= 0) direction.current = 1;
      next = Math.max(0, Math.min(slides.length - 1, next));
      slideRef.current = next;
      setSlide(next);
    }, 4500);
    return () => window.clearInterval(timer);
  }, []);

  const showSlide = (index: number) => {
    slideRef.current = index;
    direction.current = index >= slides.length - 1 ? -1 : 1;
    setSlide(index);
  };

  const specialties = [
    ...new Set(
      (doctors.data?.data ?? []).map((doctor) => doctor.specialization),
    ),
  ];

  return (
    <div>
      <section className="relative isolate min-h-[34rem] overflow-hidden sm:min-h-[40rem] lg:min-h-[46rem]">
        <div className="absolute inset-0 overflow-hidden" aria-roledescription="carousel">
          <div
            className="flex h-full w-full transition-transform duration-700 ease-out motion-reduce:transition-none"
            style={{ transform: `translateX(-${slide * 100}%)` }}
          >
            {slides.map((item, index) => (
              <img
                key={item.src}
                src={item.src}
                alt={index === slide ? item.alt : ""}
                aria-hidden={index === slide ? undefined : true}
                className="h-full min-w-full object-cover"
              />
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#041318]/88 via-[#041318]/55 to-[#041318]/20" />
        <div className="relative mx-auto flex min-h-[34rem] max-w-7xl flex-col justify-end px-4 pt-16 pb-8 sm:min-h-[40rem] sm:justify-center sm:px-6 sm:pb-16 lg:min-h-[46rem]">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#5eead4] sm:text-sm">
            PH HEALTHCARE
          </p>
          <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            See an approved doctor later today
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-white/80">
            The consultation room is where the visit happens. Choose a doctor,
            pay the fee with bKash, and receive a 20-minute serial.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              className="h-11 rounded-full bg-[#f5b942] px-5 text-[#1a1404] hover:bg-[#ffd36a]"
              nativeButton={false}
              render={
                <Link href={primary.href}>
                  {primary.label}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              }
            >
              {primary.label}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            {secondary ? (
              <Button
                variant="outline"
                className="h-11 rounded-full border-white/40 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white"
                nativeButton={false}
                render={<Link href={secondary.href}>{secondary.label}</Link>}
              >
                {secondary.label}
              </Button>
            ) : null}
          </div>
          {!role || role === "PATIENT" ? (
            <Link
              href="/apply"
              className="mt-4 inline-flex text-sm font-medium text-[#5eead4] underline-offset-4 hover:underline"
            >
              Apply as a doctor
            </Link>
          ) : null}
          <div className="mt-8 flex flex-wrap items-center gap-2">
            {slides.map((item, index) => (
              <button
                key={item.src}
                type="button"
                aria-label={`Show ${item.label}`}
                aria-current={index === slide ? "true" : undefined}
                onClick={() => showSlide(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === slide ? "w-8 bg-white" : "w-2.5 bg-white/50"
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-white/80">{slides[slide].label}</span>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <p className="text-sm font-medium text-primary">Why PH Healthcare</p>
          <h2 className="mt-2 max-w-xl text-3xl font-semibold tracking-tight">
            Built for one visit, from booking to the prescription
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {pillars.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="panel lift-card p-5">
                  <span className="icon-bob flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <p className="text-sm font-medium text-primary">How a visit works</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Three steps to today&apos;s serial
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <article key={step.n} className="panel lift-card p-5">
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {step.n}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {step.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <img
          src="/clinic/clinic-consult.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#06282f]/90" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 text-white sm:px-6">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#5eead4]">The roster</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Doctors open for booking
              </h2>
              <p className="mt-2 text-sm text-white/70">
                Approved physicians. The full roster is on the doctors page.
              </p>
            </div>
            <Link
              className="inline-flex items-center gap-1 text-sm font-medium text-[#5eead4] underline-offset-4 hover:underline"
              href="/doctors"
            >
              View all
              <ArrowRight className="size-4" aria-hidden="true" />
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
            <p className="text-sm text-rose-200">
              Doctors could not be loaded right now. Refresh the page when the
              clinic API is available.
            </p>
          ) : null}
          {!doctors.isPending &&
          !doctors.isError &&
          (doctors.data?.data.length ?? 0) === 0 ? (
            <p className="text-sm text-white/70">
              No approved doctors are listed yet.
            </p>
          ) : null}
          {(doctors.data?.data.length ?? 0) > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {doctors.data?.data.slice(0, 6).map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <p className="text-sm font-medium text-primary">Departments</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Browse by specialty
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Each specialty opens the directory already filtered.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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
                    className="panel lift-card flex items-center gap-3 p-4"
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
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <p className="text-sm font-medium text-primary">The rooms</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Inside the clinic
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Reception, consultation rooms, and the waiting area patients see
            before a serial.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {rooms.map((room) => (
              <figure key={room.src} className="panel lift-card">
                <div className="h-48 overflow-hidden">
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

      <section>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-primary">Before you book</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Visit rules
            </h2>
            <ul className="mt-6 grid gap-3">
              {rules.map((rule) => (
                <li
                  key={rule}
                  className="flex items-start gap-3 rounded-2xl border bg-card p-4 text-sm"
                >
                  <ShieldCheck
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  {rule}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium text-primary">FAQ</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Common questions
            </h2>
            <div className="mt-6 flex flex-col gap-3">
              {questions.map((item) => (
                <article key={item.q} className="rounded-2xl border bg-card p-4">
                  <h3 className="font-semibold">{item.q}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {item.a}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 rounded-3xl bg-[#07141c] px-6 py-12 text-white sm:px-10">
          <h2 className="text-3xl font-semibold tracking-tight">
            Ready for a same-day visit?
          </h2>
          <p className="max-w-xl text-base text-slate-300">
            Create a patient account, or write the clinic if the question is
            not a booking. Booking stays on an open schedule.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              className="h-11 rounded-full bg-[#2dd4bf] px-5 text-[#042028] hover:bg-[#5eead4]"
              nativeButton={false}
              render={
                <Link href={role ? primary.href : "/register"}>
                  {role ? primary.label : "Create a patient account"}
                </Link>
              }
            >
              {role ? primary.label : "Create a patient account"}
            </Button>
            <Button
              variant="outline"
              className="h-11 rounded-full border-white/20 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white"
              nativeButton={false}
              render={<Link href="/contact">Contact the clinic</Link>}
            >
              Contact the clinic
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
