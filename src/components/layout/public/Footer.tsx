"use client";

import { HeartPulse } from "lucide-react";
import Link from "next/link";
import Logo from "@/assets/svg/Logo";
import { useGetMe } from "@/hooks/auth.hook";

const groups = [
  {
    title: "Care",
    links: [
      { label: "Find a doctor", href: "/doctors" },
      { label: "Patient sign in", href: "/login" },
      { label: "Create a patient account", href: "/register" },
      { label: "Apply as a doctor", href: "/apply" },
    ],
  },
  {
    title: "Clinic",
    links: [
      { label: "About", href: "/about-us" },
      { label: "Journal", href: "/journal" },
      { label: "Help", href: "/help" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Sign in", href: "/login" },
    ],
  },
];

const scenes = [
  { src: "/clinic/clinic-reception.jpg", alt: "Bright clinic reception" },
  { src: "/clinic/clinic-consult.jpg", alt: "Private consultation room" },
  { src: "/clinic/clinic-corridor.jpg", alt: "Quiet hospital corridor" },
  { src: "/clinic/clinic-waiting.jpg", alt: "Waiting room with soft daylight" },
];

export default function Footer() {
  const role = useGetMe().data?.data?.role;
  const linksFor = (group: (typeof groups)[number]) =>
    group.links.filter(
      (link) =>
        link.href !== "/apply" || !role || role === "PATIENT",
    );

  return (
    <footer className="bg-[#07141c] text-slate-300">
      <div className="overflow-hidden border-b border-white/10" aria-label="Clinic rooms">
        <div className="clinic-slide flex w-max gap-3 px-3 py-4">
          {["first", "repeat"].map((copy) => (
            <div
              key={copy}
              className="flex gap-3"
              aria-hidden={copy === "repeat"}
            >
              {scenes.map((scene) => (
                <img
                  key={`${copy}-${scene.src}`}
                  src={scene.src}
                  alt={copy === "first" ? scene.alt : ""}
                  className="h-28 w-52 rounded-xl object-cover sm:h-36 sm:w-72"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2 font-semibold text-white">
            <span className="flex size-9 items-center justify-center overflow-hidden rounded-full bg-white/10">
              <span className="scale-[0.72]">
                <Logo id="footer" />
              </span>
            </span>
            PH Healthcare
          </Link>
          <p className="mt-4 text-sm leading-6">
            Same-day visits with approved doctors. Pay the consultation fee
            with bKash and receive a 20-minute serial.
          </p>
          <p className="mt-4 flex items-center gap-2 text-sm text-slate-400">
            <HeartPulse className="size-4 text-[#5eead4]" aria-hidden="true" />
            Booking stays on an open schedule.
          </p>
        </div>
        {groups.map((group) => (
          <div key={group.title}>
            <p className="text-sm font-semibold tracking-wide text-white">
              {group.title}
            </p>
            <ul className="mt-4 space-y-2.5">
              {linksFor(group).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-sm text-slate-500">
        PH Healthcare. Consultation fees are paid through bKash.
      </div>
    </footer>
  );
}
