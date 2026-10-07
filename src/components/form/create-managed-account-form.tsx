"use client";

import { useForm } from "@tanstack/react-form";
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
import { useCreateAdmin, useCreateSuperAdmin } from "@/hooks/user.hook";
import { apiErrorMessage } from "@/utils";
import { createManagedAccountSchema } from "@/validation";

export default function CreateManagedAccountForm({
  kind,
  onDone,
}: {
  kind: "ADMIN" | "SUPER_ADMIN";
  onDone: () => void;
}) {
  const createAdminAccount = useCreateAdmin();
  const createSuperAdminAccount = useCreateSuperAdmin();
  const mutation =
    kind === "SUPER_ADMIN" ? createSuperAdminAccount : createAdminAccount;

  const form = useForm({
    defaultValues: {
      name: "",
      organizationEmail: "",
      personalEmail: "",
      contactNumber: "",
      address: "",
    },
    validators: {
      onSubmit: createManagedAccountSchema,
    },
    onSubmit: ({ value }) => {
      mutation.mutate(
        {
          name: value.name.trim(),
          organizationEmail: value.organizationEmail.trim(),
          personalEmail: value.personalEmail.trim(),
          ...(value.contactNumber.trim()
            ? { contactNumber: value.contactNumber.trim() }
            : {}),
          ...(value.address.trim() ? { address: value.address.trim() } : {}),
        },
        {
          onSuccess: (response) => {
            toast.add({
              title:
                kind === "SUPER_ADMIN"
                  ? "Super admin created"
                  : "Admin created",
              description: response.message,
              type: "success",
            });
            form.reset();
            onDone();
          },
          onError: (error) => {
            toast.add({
              title: "Could not create account",
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
        <form.Field name="name">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={`${kind}-${field.name}`}>Name</FieldLabel>
                <Input
                  id={`${kind}-${field.name}`}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="organizationEmail">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={`${kind}-${field.name}`}>
                  Organization email
                </FieldLabel>
                <Input
                  id={`${kind}-${field.name}`}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="personalEmail">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={`${kind}-${field.name}`}>
                  Personal email
                </FieldLabel>
                <Input
                  id={`${kind}-${field.name}`}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                />
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
                <FieldLabel htmlFor={`${kind}-${field.name}`}>
                  Contact number
                </FieldLabel>
                <Input
                  id={`${kind}-${field.name}`}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                <FieldLabel htmlFor={`${kind}-${field.name}`}>
                  Address
                </FieldLabel>
                <Input
                  id={`${kind}-${field.name}`}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <Button disabled={mutation.isPending} type="submit">
          {mutation.isPending ? (
            <>
              <Spinner /> Creating
            </>
          ) : kind === "SUPER_ADMIN" ? (
            "Create super admin"
          ) : (
            "Create admin"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
