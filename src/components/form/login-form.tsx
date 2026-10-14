"use client";

import { useForm } from "@tanstack/react-form";
import { Eye, EyeClosed, House } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BrandMark from "@/components/layout/brand-mark";
import { useContinueAfterAuth, useLogin } from "@/hooks/auth.hook";
import { demoAccounts } from "@/lib/demo-accounts";
import { apiErrorMessage } from "@/utils";
import { loginSchema } from "@/validation";
import FacebookLoginButton from "../modules/facebook-login/FacebookLogin";
import GoogleLoginComponent from "../modules/google-login/GoogleLogin";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

const roleNotes: Record<(typeof demoAccounts)[number]["label"], string> = {
  Patient: "Book and pay a visit",
  Doctor: "Open hours and prescribe",
  Admin: "Approve doctors",
  "Super admin": "Manage staff accounts",
};

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

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [continuing, setContinuing] = useState(false);
  const router = useRouter();
  const { mutate: login, isPending: loginPending } = useLogin();
  const continueAfterAuth = useContinueAfterAuth();
  const busy = loginPending || continuing;

  const startLogin = (email: string, password: string) => {
    login(
      { email, password },
      {
        onSuccess: async () => {
          setContinuing(true);
          toast.add({
            title: "Login Success",
            description: "Welcome back",
            type: "success",
          });

          try {
            await continueAfterAuth();
          } catch {
            router.push("/");
          } finally {
            setContinuing(false);
          }
        },
        onError: (err) => {
          toast.add({
            title: "Authorization failure",
            description: apiErrorMessage(err),
            type: "error",
          });
        },
      },
    );
  };

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: ({ value }) => {
      startLogin(value.email, value.password);
    },
  });

  return (
    <div className="flex flex-col gap-5 text-white">
      <div className="flex flex-col items-center gap-3 text-center">
        <BrandMark />
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-300">
            Sign in to book a visit, open hours, or manage the clinic.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-[#245864] p-3">
        <p className="mb-3 text-center text-[11px] font-medium tracking-[0.18em] text-slate-400">
          QUICK DEMO ACCESS
        </p>
        <div className="grid grid-cols-2 gap-2">
          {demoAccounts.map((account) => (
            <button
              key={account.label}
              type="button"
              disabled={busy}
              className="rounded-xl border border-[#245864] px-2 py-3 text-center transition hover:border-[#5eead4] disabled:opacity-60"
              onClick={() => {
                form.setFieldValue("email", account.email);
                form.setFieldValue("password", account.password);
                startLogin(account.email, account.password);
              }}
            >
              <span className="block text-sm font-semibold text-[#5eead4]">
                {account.label}
              </span>
              <span className="mt-1 block text-xs text-slate-400">
                {roleNotes[account.label]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Divider>OR SIGN IN WITH EMAIL</Divider>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
        className="flex flex-col gap-4"
      >
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
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  value={field.state.value}
                  autoComplete="off"
                  aria-invalid={isInvalid}
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
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor={field.name} className="text-slate-200">
                    Password
                  </FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-[#5eead4] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id={field.name}
                    name={field.name}
                    type={showPassword ? "text" : "password"}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    value={field.state.value}
                    autoComplete="off"
                    aria-invalid={isInvalid}
                    className={`${fieldClass} pr-10`}
                  />
                  <button
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-300"
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    {showPassword ? (
                      <EyeClosed className="size-4" />
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

        <Button
          className="h-11 w-full rounded-full bg-[#2dd4bf] text-[#042028] hover:bg-[#5eead4]"
          disabled={busy}
          type="submit"
        >
          {busy ? (
            <>
              <Spinner /> Signing in
            </>
          ) : (
            "Sign in"
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
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-[#5eead4] hover:underline">
          Sign up
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
