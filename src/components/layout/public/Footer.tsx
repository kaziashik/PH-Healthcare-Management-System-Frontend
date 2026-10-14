"use client";

import {
  BookOpen,
  Building2,
  CircleHelp,
  ClipboardPlus,
  HeartPulse,
  Info,
  LogIn,
  Mail,
  ScrollText,
  Search,
  Shield,
  ShieldCheck,
  Stethoscope,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import BrandMark from "@/components/layout/brand-mark";
import { useGetMe } from "@/hooks/auth.hook";

type FooterLink = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const groups: { title: string; icon: LucideIcon; links: FooterLink[] }[] = [
  {
    title: "Care",
    icon: Stethoscope,
    links: [
      { label: "Find a doctor", href: "/doctors", icon: Search },
      { label: "Patient sign in", href: "/login", icon: LogIn },
      { label: "Create a patient account", href: "/register", icon: UserPlus },
      { label: "Apply as a doctor", href: "/apply", icon: ClipboardPlus },
    ],
  },
  {
    title: "Clinic",
    icon: Building2,
    links: [
      { label: "About", href: "/about-us", icon: Info },
      { label: "Journal", href: "/journal", icon: BookOpen },
      { label: "Help", href: "/help", icon: CircleHelp },
      { label: "Contact", href: "/contact", icon: Mail },
    ],
  },
  {
    title: "Policies",
    icon: ShieldCheck,
    links: [
      { label: "Privacy", href: "/privacy", icon: Shield },
      { label: "Terms", href: "/terms", icon: ScrollText },
      { label: "Sign in", href: "/login", icon: LogIn },
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
      (link) => link.href !== "/apply" || !role || role === "PATIENT",
    );

  return (
    <footer className="bg-[#06282f] text-slate-300">
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
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <Link href="/" className="text-white">
            <BrandMark />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-300">
            Same-day visits with approved doctors. Pay the consultation fee
            with bKash and receive a 20-minute serial.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300">
            <HeartPulse className="size-4 text-[#5eead4]" aria-hidden="true" />
            Booking stays on an open schedule.
          </p>
        </div>
        {groups.map((group) => {
          const GroupIcon = group.icon;
          return (
            <div key={group.title}>
              <p className="flex items-center gap-2 text-sm font-semibold text-white">
                <GroupIcon className="size-4 text-[#5eead4]" aria-hidden="true" />
                {group.title}
              </p>
              <ul className="mt-4 space-y-1">
                {linksFor(group).map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={`${group.title}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="group flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-sm text-slate-300 transition-colors hover:bg-white/8 hover:text-white"
                      >
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/8 text-[#5eead4] transition-colors group-hover:bg-[#14b8a6]/20">
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-sm text-slate-400">
        PH Healthcare. Consultation fees are paid through bKash.
      </div>
    </footer>
  );
}
