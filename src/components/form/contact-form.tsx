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
import { useSendContactMessage } from "@/hooks/contact.hook";
import { apiErrorMessage } from "@/utils";
import { contactMessageSchema } from "@/validation";

export default function ContactForm() {
  const sendMessage = useSendContactMessage();
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    validators: {
      onSubmit: contactMessageSchema,
    },
    onSubmit: ({ value }) => {
      sendMessage.mutate(
        {
          name: value.name.trim(),
          email: value.email.trim(),
          subject: value.subject.trim(),
          message: value.message.trim(),
        },
        {
          onSuccess: (response) => {
            toast.add({
              title: "Message sent",
              description: response.message,
              type: "success",
            });
            form.reset();
          },
          onError: (error) => {
            toast.add({
              title: "Message was not sent",
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
      className="max-w-xl"
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        {(
          [
            ["name", "Name", "text"],
            ["email", "Email", "email"],
            ["subject", "Subject", "text"],
          ] as const
        ).map(([name, label, type]) => (
          <form.Field key={name} name={name}>
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type={type}
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
        ))}
        <form.Field name="message">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Message</FieldLabel>
                <textarea
                  id={field.name}
                  name={field.name}
                  className="min-h-32 rounded-lg border border-input bg-background px-3 py-2 text-sm"
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
        <Button disabled={sendMessage.isPending} type="submit">
          {sendMessage.isPending ? (
            <>
              <Spinner /> Sending
            </>
          ) : (
            "Send message"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
