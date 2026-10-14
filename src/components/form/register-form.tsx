"use client";

import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff, House } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BrandMark from "@/components/layout/brand-mark";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { patientRegistrationSchema } from "@/validation";
import z from "zod";

import { toast } from "../ui/toast";
import { Spinner } from "../ui/spinner";
import { useRegistration } from "@/hooks/auth.hook";
import FacebookLoginButton from "../modules/facebook-login/FacebookLogin";
import GoogleLoginComponent from "../modules/google-login/GoogleLogin";

const fieldClass =
  "h-11 rounded-xl border-[#245864] bg-[#132f38] px-3 text-white placeholder:text-slate-400";

function Divider({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-3 text-[11px] font-medium tracking-[0.16em] text-slate-400">
      <span className="h-px flex-1 bg-[#245864]" />
      {children}
      <span className="h-px flex-1 bg-[#245864]" />
    </div>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    if (!photo) {
      setPhotoPreview("");
      return;
    }
    const url = URL.createObjectURL(photo);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const choosePhoto = (file: File | null) => {
    if (!file) {
      setPhoto(null);
      return;
    }
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.add({
        title: "Use a photo file",
        description: "Choose a JPG, PNG, or WEBP image.",
        type: "error",
      });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.add({
        title: "Photo is too large",
        description: "Choose an image that is 2 MB or smaller.",
        type: "error",
      });
      return;
    }
    setPhoto(file);
  };

  type PatientDefaultValues = z.infer<typeof patientRegistrationSchema>;

  const defaultValues: PatientDefaultValues = {
    name: "",
    email: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
  };

  const { mutate: registration, isPending: registrationPending } =
    useRegistration();

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: patientRegistrationSchema,
    },
    onSubmit: async ({ value }) => {
      const registrationData = {
        name: value.name,
        email: value.email,
        password: value.password,
        patient: {
          contactNumber: value.contactNumber,
        },
      };
      const payload = photo
        ? (() => {
            const formData = new FormData();
            formData.append("name", registrationData.name);
            formData.append("email", registrationData.email);
            formData.append("password", registrationData.password);
            formData.append("patient", JSON.stringify(registrationData.patient));
            formData.append("profileImage", photo);
            return formData;
          })()
        : registrationData;

      registration(payload, {
        onSuccess: (res) => {
          if (!res.success) {
            toast.add({
              title: "Server Failure",
              description: "Something went wrong. Please try again",
              type: "error",
            });
          }

          toast.add({
            title: "Registration Successful",
            description: "Please verify your account",
            type: "success",
          });
          const params = new URLSearchParams({ email: registrationData.email });
          router.push(`/register/verify-account?${params.toString()}`);
        },
        onError: (err) => {
          toast.add({
            title: "Authorization failure",
            description:
              err.message || "Something went wrong. Please try again",
            type: "error",
          });
        },
      });
    },
  });

  return (
    <div className="flex flex-col gap-5 text-white">
      <div className="flex flex-col items-center gap-3 text-center">
        <BrandMark />
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Join PH Healthcare as a patient and book a visit.
          </p>
        </div>
      </div>

      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field name="name">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name} className="text-slate-200">
                  Full name
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="Your full name"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="name"
                  className={fieldClass}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="email">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name} className="text-slate-200">
                  Email
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  placeholder="you@email.com"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="off"
                  className={fieldClass}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="password">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name} className="text-slate-200">
                  Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    id={field.name}
                    name={field.name}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    className={`${fieldClass} pr-10`}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-300"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="confirmPassword">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name} className="text-slate-200">
                  Confirm password
                </FieldLabel>
                <div className="relative">
                  <Input
                    id={field.name}
                    name={field.name}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    className={`${fieldClass} pr-10`}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-300"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="contactNumber">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name} className="text-slate-200">
                  Phone
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="tel"
                  className={fieldClass}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="profile-photo" className="text-sm font-medium text-slate-200">
            Profile photo (optional)
          </label>
          <div className="flex items-center gap-3">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt=""
                className="size-12 shrink-0 rounded-full object-cover"
              />
            ) : null}
            <label
              className={`${fieldClass} flex min-w-0 flex-1 cursor-pointer items-center gap-3`}
            >
              <input
                id="profile-photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(event) => {
                  choosePhoto(event.target.files?.[0] ?? null);
                  event.target.value = "";
                }}
              />
              <span className="shrink-0 rounded-lg bg-[#0b242c] px-2 py-1 text-xs text-slate-200">
                Choose file
              </span>
              <span className="truncate text-slate-400">
                {photo ? photo.name : "No file chosen"}
              </span>
            </label>
          </div>
          {photo ? (
            <button
              type="button"
              className="self-start text-xs font-medium text-[#5eead4] hover:underline"
              onClick={() => setPhoto(null)}
            >
              Remove photo
            </button>
          ) : (
            <p className="text-xs text-slate-400">JPG, PNG, or WEBP, up to 2 MB.</p>
          )}
        </div>

        <Button
          className="h-11 w-full rounded-full bg-[#2dd4bf] text-[#042028] hover:bg-[#5eead4]"
          disabled={registrationPending}
          type="submit"
        >
          {registrationPending ? (
            <>
              <Spinner /> Creating account
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <Divider>OR CONTINUE WITH</Divider>

      <div className="grid gap-3 sm:grid-cols-2">
        <GoogleLoginComponent masked theme="filled_black" />
        <FacebookLoginButton
          label="Facebook"
          className="h-10 rounded-full border-[#245864] bg-[#132f38] text-white hover:bg-[#183843]"
        />
      </div>

      <p className="text-center text-sm text-slate-300">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-[#5eead4] hover:underline">
          Log in
        </Link>
      </p>

      <Link
        href="/"
        className="flex items-center justify-center gap-2 text-sm font-medium text-[#5eead4] hover:underline"
      >
        <House className="size-4" aria-hidden="true" />
        Continue browsing without signing in
      </Link>
    </div>
  );
}
