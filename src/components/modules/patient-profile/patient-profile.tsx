"use client";

import {
  BadgeCheck,
  CalendarDays,
  Camera,
  Droplet,
  HeartPulse,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
  VenusAndMars,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import SetPasswordForm from "@/components/form/set-password-form";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useGetMe } from "@/hooks/auth.hook";
import { useUpdateMyProfile, useUpdateProfileImage } from "@/hooks/user.hook";
import type { PatientAccount, User } from "@/types/user.type";
import { apiErrorMessage } from "@/utils";

const PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_PHOTO_BYTES = 2 * 1024 * 1024;

const genderLabel: Record<NonNullable<PatientAccount["gender"]>, string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
};

function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "P"
  );
}

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

function profileError(name: string, phone: string) {
  const cleanName = name.trim();
  const cleanPhone = phone.trim();
  if (cleanName.length < 2) return "Name must be at least 2 characters long";
  if (cleanName.length > 80) return "Name is too long";
  if (cleanPhone && !/^[0-9+\-() ]{6,20}$/.test(cleanPhone)) {
    return "Phone number is invalid";
  }
  return "";
}

function InfoItem({
  icon,
  label,
  value,
  locked,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  locked?: boolean;
}) {
  return (
    <div className="flex gap-3 rounded-xl border bg-muted/30 px-4 py-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {label}
          {locked ? <Lock className="size-3" aria-hidden="true" /> : null}
        </p>
        <p className="mt-0.5 text-sm font-medium break-words">{value}</p>
      </div>
    </div>
  );
}

export default function PatientProfile() {
  const { data, isPending } = useGetMe();
  const user = data?.data;
  const updateProfile = useUpdateMyProfile();
  const updateImage = useUpdateProfileImage();
  const fileInput = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState("");

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  if (isPending || !user) {
    return <p className="text-sm text-muted-foreground">Loading profile...</p>;
  }

  const patient = user.patient;
  const saving = updateProfile.isPending || updateImage.isPending;
  const photoSrc = photoPreview || user.imageUrl?.trim() || "";

  const startEdit = () => {
    setName(user.name);
    setPhone(patient?.contactNumber ?? "");
    setPhotoFile(null);
    setPhotoPreview(null);
    setFieldError("");
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setPhotoFile(null);
    setPhotoPreview(null);
    setFieldError("");
  };

  const choosePhoto = (file: File | undefined) => {
    if (!file) return;
    if (!PHOTO_TYPES.has(file.type) || file.size > MAX_PHOTO_BYTES) {
      setFieldError("Profile photo must be a JPG, PNG, or WEBP image under 2 MB");
      return;
    }
    setFieldError("");
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const save = async () => {
    const message = profileError(name, phone);
    if (message) {
      setFieldError(message);
      return;
    }
    setFieldError("");
    try {
      const response = await updateProfile.mutateAsync({
        name: name.trim(),
        contactNumber: phone.trim(),
      });
      if (photoFile) {
        await updateImage.mutateAsync(photoFile);
      }
      toast.add({
        title: "Profile updated",
        description: response.message,
        type: "success",
      });
      setEditing(false);
      setPhotoFile(null);
      setPhotoPreview(null);
    } catch (error) {
      toast.add({
        title: "Could not update profile",
        description: apiErrorMessage(error),
        type: "error",
      });
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your account details. Update changes your photo, name, and phone
            number.
          </p>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={cancelEdit}
              disabled={saving}
            >
              <X aria-hidden="true" />
              Cancel
            </Button>
            <Button type="button" onClick={save} disabled={saving}>
              {saving ? <Spinner /> : <Save aria-hidden="true" />}
              Save
            </Button>
          </div>
        ) : (
          <Button type="button" onClick={startEdit}>
            <Pencil aria-hidden="true" />
            Update
          </Button>
        )}
      </div>

      <section className="panel p-4 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative w-fit">
            {photoSrc ? (
              <img
                src={photoSrc}
                alt=""
                className="size-28 rounded-full object-cover ring-2 ring-primary/30"
              />
            ) : (
              <span className="flex size-28 items-center justify-center rounded-full bg-primary/15 text-2xl font-semibold text-primary ring-2 ring-primary/30">
                {initials(user.name)}
              </span>
            )}
            {editing ? (
              <button
                type="button"
                className="absolute right-0 bottom-0 flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md"
                aria-label="Change photo"
                onClick={() => fileInput.current?.click()}
              >
                <Camera className="size-4" aria-hidden="true" />
              </button>
            ) : null}
            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(event) => {
                choosePhoto(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Photo
            </p>
            {editing ? (
              <div className="mt-2">
                <label className="text-xs text-muted-foreground" htmlFor="profile-name">
                  Name
                </label>
                <Input
                  id="profile-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-1"
                  autoComplete="name"
                />
              </div>
            ) : (
              <h2 className="mt-1 truncate text-xl font-semibold">{user.name}</h2>
            )}
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mail className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{user.email}</span>
            </p>
            {editing ? (
              <p className="mt-2 text-xs text-muted-foreground">
                JPG, PNG, or WEBP. Up to 2 MB.
              </p>
            ) : null}
          </div>
        </div>

        {fieldError ? (
          <p className="mt-4 text-sm text-destructive">{fieldError}</p>
        ) : null}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {editing ? (
            <div className="flex gap-3 rounded-xl border bg-muted/30 px-4 py-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Phone className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <label
                  className="text-xs text-muted-foreground"
                  htmlFor="profile-phone"
                >
                  Phone number
                </label>
                <Input
                  id="profile-phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="mt-1"
                  autoComplete="tel"
                  inputMode="tel"
                />
              </div>
            </div>
          ) : (
            <InfoItem
              icon={<Phone className="size-4" aria-hidden="true" />}
              label="Phone number"
              value={shown(patient?.contactNumber)}
            />
          )}
          <InfoItem
            icon={<Mail className="size-4" aria-hidden="true" />}
            label="Email"
            value={user.email}
            locked={editing}
          />
          <InfoItem
            icon={<VenusAndMars className="size-4" aria-hidden="true" />}
            label="Gender"
            value={
              patient?.gender ? genderLabel[patient.gender] : "Not added"
            }
            locked={editing}
          />
          <InfoItem
            icon={<CalendarDays className="size-4" aria-hidden="true" />}
            label="Date of birth"
            value={formatDate(patient?.dateOfBirth)}
            locked={editing}
          />
          <InfoItem
            icon={<Droplet className="size-4" aria-hidden="true" />}
            label="Blood group"
            value={shown(patient?.bloodGroup)}
            locked={editing}
          />
          <InfoItem
            icon={<MapPin className="size-4" aria-hidden="true" />}
            label="Address"
            value={shown(patient?.address)}
            locked={editing}
          />
          <InfoItem
            icon={<ShieldCheck className="size-4" aria-hidden="true" />}
            label="Account status"
            value={user.status === "ACTIVE" ? "Active" : user.status}
            locked={editing}
          />
          <InfoItem
            icon={<BadgeCheck className="size-4" aria-hidden="true" />}
            label="Email verification"
            value={user.emailVerified ? "Verified" : "Not verified"}
            locked={editing}
          />
          <InfoItem
            icon={<UserRound className="size-4" aria-hidden="true" />}
            label="Member since"
            value={formatDate(user.createdAt)}
            locked={editing}
          />
          <div className="sm:col-span-2">
            <InfoItem
              icon={<HeartPulse className="size-4" aria-hidden="true" />}
              label="Medical history"
              value={shown(patient?.medicalHistory)}
              locked={editing}
            />
          </div>
        </div>
      </section>

      <PasswordSection user={user} />
    </div>
  );
}

function PasswordSection({ user }: { user: User }) {
  return (
    <section className="panel p-4 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <KeyRound className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          {user.hasPassword ? (
            <>
              <h2 className="font-semibold">Password</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                This account already has a password.
              </p>
              <Link
                href="/change-password"
                className={`${buttonVariants({ variant: "outline" })} mt-4`}
              >
                <KeyRound aria-hidden="true" />
                Change password
              </Link>
            </>
          ) : (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="font-semibold">Set a password</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  This account can sign in with Google. Set a password if you
                  also want to sign in with email.
                </p>
              </div>
              <SetPasswordForm />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
