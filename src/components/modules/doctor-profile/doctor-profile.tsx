"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useGetMe } from "@/hooks/auth.hook";
import {
  useGetAllDoctors,
  useUpdateMyDoctorProfile,
} from "@/hooks/doctor.hook";
import type { Doctor } from "@/types";
import { apiErrorMessage } from "@/utils";

const profileSchema = z.object({
  contactNumber: z.string().trim().min(5, "Contact number is invalid"),
  address: z.string().trim().min(5, "Address must be at least 5 characters"),
  consultationFee: z.string().refine((value) => Number(value) >= 0, {
    message: "Consultation fee cannot be negative",
  }),
  bio: z.string().trim().max(1000, "Bio cannot exceed 1000 characters"),
});

function DoctorProfileForm({ doctor }: { doctor: Doctor }) {
  const updateProfile = useUpdateMyDoctorProfile();
  const form = useForm({
    defaultValues: {
      contactNumber: doctor.contactNumber ?? "",
      address: doctor.address ?? "",
      consultationFee:
        doctor.consultationFee != null ? String(doctor.consultationFee) : "",
      bio: doctor.bio ?? "",
    },
    validators: {
      onSubmit: profileSchema,
    },
    onSubmit: ({ value }) => {
      updateProfile.mutate(
        {
          contactNumber: value.contactNumber.trim(),
          address: value.address.trim(),
          consultationFee: Number(value.consultationFee),
          bio: value.bio.trim(),
        },
        {
          onSuccess: (response) => {
            toast.add({
              title: "Profile updated",
              description: response.message,
              type: "success",
            });
          },
          onError: (error) => {
            toast.add({
              title: "Could not update profile",
              description: apiErrorMessage(error),
              type: "error",
            });
          },
        },
      );
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name="contactNumber">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Contact number</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="address">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Chamber address</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="consultationFee">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Consultation fee (BDT)
                </FieldLabel>
                <Input
                  id={field.name}
                  inputMode="numeric"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="bio">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Bio</FieldLabel>
                <textarea
                  id={field.name}
                  className="min-h-28 rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </Field>
            );
          }}
        </form.Field>
        <Button disabled={updateProfile.isPending} type="submit">
          {updateProfile.isPending ? (
            <>
              <Spinner /> Saving
            </>
          ) : (
            "Save profile"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}

export default function DoctorProfile() {
  const me = useGetMe();
  const email = me.data?.data?.email ?? "";
  const doctors = useGetAllDoctors({
    page: 1,
    limit: 1,
    ...(email ? { searchTerm: email } : {}),
  });
  const doctor = doctors.data?.data?.[0];

  if (me.isPending || (email && doctors.isPending)) {
    return <p className="text-sm text-muted-foreground">Loading profile...</p>;
  }

  return (
    <div className="flex max-w-xl flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">
          {me.data?.data?.name} · {email}
        </p>
      </div>
      {doctor ? (
        <DoctorProfileForm key={doctor.id} doctor={doctor} />
      ) : (
        <p className="text-sm text-muted-foreground">
          Your public profile appears here after the application is approved.
        </p>
      )}
    </div>
  );
}
