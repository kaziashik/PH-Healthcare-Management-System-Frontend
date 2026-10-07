"use client";

import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useSetPassword } from "@/hooks/auth.hook";
import { apiErrorMessage } from "@/utils";
import { setPasswordSchema } from "@/validation";
import { toast } from "../ui/toast";
import { PasswordInput } from "./password-input";

export default function SetPasswordForm({ onDone }: { onDone?: () => void }) {
  const queryClient = useQueryClient();
  const { mutate: createPassword, isPending } = useSetPassword();

  const form = useForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: setPasswordSchema,
    },
    onSubmit: ({ value }) => {
      createPassword(
        { newPassword: value.newPassword },
        {
          onSuccess: async (response) => {
            await queryClient.invalidateQueries({ queryKey: ["user"] });
            toast.add({
              title: "Password set",
              description: response.message,
              type: "success",
            });
            form.reset();
            onDone?.();
          },
          onError: (error) => {
            toast.add({
              title: "Could not set password",
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
            "Set password"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
