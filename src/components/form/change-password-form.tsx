"use client";

import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getMe } from "@/api/auth.api";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useChangePassword, useGetMe } from "@/hooks/auth.hook";
import { pathAfterPasswordChange } from "@/lib/auth-redirect";
import type { ApiResponse } from "@/types/api.type";
import type { User } from "@/types/user.type";
import { apiErrorMessage } from "@/utils";
import { changePasswordSchema } from "@/validation";
import { toast } from "../ui/toast";
import { PasswordInput } from "./password-input";

export default function ChangePasswordForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useGetMe();
  const user = data?.data;
  const { mutate: updatePassword, isPending } = useChangePassword();

  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: changePasswordSchema,
    },
    onSubmit: ({ value }) => {
      updatePassword(
        {
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
        },
        {
          onSuccess: async (response) => {
            await queryClient.invalidateQueries({ queryKey: ["user"] });
            const me =
              queryClient.getQueryData<ApiResponse<User>>(["user"]) ??
              (await queryClient.fetchQuery({
                queryKey: ["user"],
                queryFn: getMe,
                staleTime: 0,
              }));

            toast.add({
              title: "Password changed",
              description: response.message,
              type: "success",
            });
            router.push(me?.data ? pathAfterPasswordChange(me.data) : "/");
          },
          onError: (error) => {
            toast.add({
              title: "Could not change password",
              description: apiErrorMessage(error),
              type: "error",
            });
          },
        },
      );
    },
  });

  const backHref = user ? pathAfterPasswordChange(user) : "/";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Change password</h1>
        <p className="text-balance text-sm text-muted-foreground">
          {user?.needPasswordChange
            ? "Choose a new password before you continue."
            : "Enter your current password, then choose a new one."}
        </p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.Field name="currentPassword">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Current password</FieldLabel>
                  <PasswordInput
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    invalid={isInvalid}
                    autoComplete="current-password"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="newPassword">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>New password</FieldLabel>
                  <PasswordInput
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    invalid={isInvalid}
                  />
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
                  <FieldLabel htmlFor={field.name}>Confirm password</FieldLabel>
                  <PasswordInput
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <Button disabled={isPending} type="submit">
            {isPending ? (
              <>
                <Spinner /> Saving
              </>
            ) : (
              "Change password"
            )}
          </Button>
        </FieldGroup>
      </form>

      {!user?.needPasswordChange && (
        <div className="text-center text-sm text-muted-foreground">
          <Link
            href={backHref}
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            Back
          </Link>
        </div>
      )}
    </div>
  );
}
