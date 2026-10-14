"use client";

import {
  BadgeCheck,
  CalendarDays,
  Droplet,
  HeartPulse,
  Mail,
  MapPin,
  ShieldCheck,
  UserRound,
  VenusAndMars,
} from "lucide-react";
import AccountProfile from "@/components/modules/account-profile/account-profile";
import { useGetMe } from "@/hooks/auth.hook";
import type { PatientAccount } from "@/types/user.type";

const genderLabel: Record<NonNullable<PatientAccount["gender"]>, string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
};

function formatDate(iso: string | null | undefined) {
  if (!iso) return "Not added";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Not added";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function shown(value: string | null | undefined) {
  const text = value?.trim();
  return text ? text : "Not added";
}

export default function PatientProfile() {
  const { data, isPending } = useGetMe();
  const user = data?.data;

  if (isPending || !user) {
    return <p className="text-sm text-muted-foreground">Loading profile...</p>;
  }

  const patient = user.patient;

  return (
    <AccountProfile
      user={user}
      phone={patient?.contactNumber ?? ""}
      details={[
        {
          icon: <Mail className="size-4" aria-hidden="true" />,
          label: "Email",
          value: user.email,
        },
        {
          icon: <VenusAndMars className="size-4" aria-hidden="true" />,
          label: "Gender",
          value: patient?.gender ? genderLabel[patient.gender] : "Not added",
        },
        {
          icon: <CalendarDays className="size-4" aria-hidden="true" />,
          label: "Date of birth",
          value: formatDate(patient?.dateOfBirth),
        },
        {
          icon: <Droplet className="size-4" aria-hidden="true" />,
          label: "Blood group",
          value: shown(patient?.bloodGroup),
        },
        {
          icon: <MapPin className="size-4" aria-hidden="true" />,
          label: "Address",
          value: shown(patient?.address),
        },
        {
          icon: <ShieldCheck className="size-4" aria-hidden="true" />,
          label: "Account status",
          value: user.status === "ACTIVE" ? "Active" : user.status,
        },
        {
          icon: <BadgeCheck className="size-4" aria-hidden="true" />,
          label: "Email verification",
          value: user.emailVerified ? "Verified" : "Not verified",
        },
        {
          icon: <UserRound className="size-4" aria-hidden="true" />,
          label: "Member since",
          value: formatDate(user.createdAt),
        },
        {
          icon: <HeartPulse className="size-4" aria-hidden="true" />,
          label: "Medical history",
          value: shown(patient?.medicalHistory),
          wide: true,
        },
      ]}
    />
  );
}
