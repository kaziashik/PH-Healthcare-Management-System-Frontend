"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useForgotPassword } from "@/hooks/auth.hook";
import { apiErrorMessage } from "@/utils";
import { forgotPasswordSchema } from "@/validation";
import { toast } from "../ui/toast";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const { mutate: requestReset, isPending } = useForgotPassword();

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: forgotPasswordSchema,
    },
    onSubmit: ({ value }) => {
      requestReset(
        { email: value.email },
        {
          onSuccess: (response) => {
            toast.add({
              title: "Reset code sent",
              description: response.message,
              type: "success",
            });
            router.push(
              `/reset-password?email=${encodeURIComponent(value.email)}`,
            );
          },
          onError: (error) => {
            toast.add({
              title: "Could not send reset code",
              description: apiErrorMessage(error),
              type: "error",
            });
          },
        },
      );
    },
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Forgot password</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter the email on your account. We will send a 6-digit code.
        </p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.Field name="email">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    value={field.state.value}
                    autoComplete="email"
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <Button disabled={isPending} type="submit">
            {isPending ? (
              <>
                <Spinner /> Sending
              </>
            ) : (
              "Send reset code"
            )}
          </Button>
        </FieldGroup>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-medium underline underline-offset-4 hover:text-primary"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
