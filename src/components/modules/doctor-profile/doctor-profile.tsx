"use client";

import {
  Award,
  BadgeCheck,
  BriefcaseMedical,
  CalendarDays,
  FileBadge,
  GraduationCap,
  Mail,
  MapPin,
  ShieldCheck,
  Stethoscope,
  Wallet,
} from "lucide-react";
import AccountProfile from "@/components/modules/account-profile/account-profile";
import { useGetMe } from "@/hooks/auth.hook";
import type { DoctorAccount } from "@/types/user.type";

const verificationLabel: Record<DoctorAccount["verificationStatus"], string> = {
  APPROVED: "Approved",
  PENDING: "Need approval",
  REJECTED: "Rejected",
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

function feeLabel(value: DoctorAccount["consultationFee"]) {
  if (value == null || value === "") return "Not added";
  const amount = Number(value);
  if (Number.isNaN(amount)) return String(value);
  return `৳${amount}`;
}

export default function DoctorProfile() {
  const { data, isPending } = useGetMe();
  const user = data?.data;

  if (isPending || !user) {
    return <p className="text-sm text-muted-foreground">Loading profile...</p>;
  }

  const doctor = user.doctor;

  if (!doctor) {
    return (
      <p className="text-sm text-muted-foreground">
        Your public profile appears here after the application is approved.
      </p>
    );
  }

  return (
    <AccountProfile
      user={user}
      phone={doctor.contactNumber ?? ""}
      details={[
        {
          icon: <Mail className="size-4" aria-hidden="true" />,
          label: "Email",
          value: user.email,
        },
        {
          icon: <Stethoscope className="size-4" aria-hidden="true" />,
          label: "Specialty",
          value: shown(doctor.specialization),
        },
        {
          icon: <FileBadge className="size-4" aria-hidden="true" />,
          label: "License",
          value: shown(doctor.licenseNumber),
        },
        {
          icon: <GraduationCap className="size-4" aria-hidden="true" />,
          label: "Qualifications",
          value: shown(doctor.qualifications),
        },
        {
          icon: <Award className="size-4" aria-hidden="true" />,
          label: "Experience",
          value: `${doctor.experienceYears} years`,
        },
        {
          icon: <Wallet className="size-4" aria-hidden="true" />,
          label: "Consultation fee",
          value: feeLabel(doctor.consultationFee),
        },
        {
          icon: <MapPin className="size-4" aria-hidden="true" />,
          label: "Chamber address",
          value: shown(doctor.address),
        },
        {
          icon: <BadgeCheck className="size-4" aria-hidden="true" />,
          label: "Approval",
          value: verificationLabel[doctor.verificationStatus],
        },
        {
          icon: <ShieldCheck className="size-4" aria-hidden="true" />,
          label: "Account status",
          value: user.status === "ACTIVE" ? "Active" : user.status,
        },
        {
          icon: <CalendarDays className="size-4" aria-hidden="true" />,
          label: "Member since",
          value: formatDate(user.createdAt),
        },
        {
          icon: <BriefcaseMedical className="size-4" aria-hidden="true" />,
          label: "Bio",
          value: shown(doctor.bio),
          wide: true,
        },
      ]}
    />
  );
}
