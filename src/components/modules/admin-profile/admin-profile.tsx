"use client";

import {
  BadgeCheck,
  CalendarDays,
  Mail,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import AccountProfile from "@/components/modules/account-profile/account-profile";
import { useGetMe } from "@/hooks/auth.hook";

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

export default function AdminProfile() {
  const { data, isPending } = useGetMe();
  const user = data?.data;

  if (isPending || !user) {
    return <p className="text-sm text-muted-foreground">Loading profile...</p>;
  }

  const admin = user.admin;

  if (!admin) {
    return (
      <p className="text-sm text-muted-foreground">
        This admin profile is not available.
      </p>
    );
  }

  return (
    <AccountProfile
      user={user}
      phone={admin.contactNumber ?? ""}
      details={[
        {
          icon: <Mail className="size-4" aria-hidden="true" />,
          label: "Organization email",
          value: admin.organizationEmail,
        },
        {
          icon: <Mail className="size-4" aria-hidden="true" />,
          label: "Personal email",
          value: shown(admin.personalEmail),
        },
        {
          icon: <MapPin className="size-4" aria-hidden="true" />,
          label: "Address",
          value: shown(admin.address),
        },
        {
          icon: <UserRound className="size-4" aria-hidden="true" />,
          label: "Role",
          value: user.role === "SUPER_ADMIN" ? "Super admin" : "Admin",
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
          icon: <CalendarDays className="size-4" aria-hidden="true" />,
          label: "Member since",
          value: formatDate(user.createdAt),
        },
      ]}
    />
  );
}
