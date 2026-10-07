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
import { useCreateSchedule, useUpdateSchedule } from "@/hooks/schedule.hook";
import {
  combineLocalDateTime,
  localDateInput,
  localTimeInput,
} from "@/lib/visit-time";
import type { Schedule } from "@/types/schedule.type";
import { apiErrorMessage } from "@/utils";
import { scheduleFormSchema } from "@/validation";

const activeVisitStatuses = new Set([
  "BOOKED",
  "CONFIRMED",
  "ONGOING",
  "COMPLETED",
]);

export function scheduleTimeIsLocked(schedule: Schedule) {
  return (
    schedule.appointments?.some(
      (appointment) =>
        appointment.serialNumber != null &&
        activeVisitStatuses.has(appointment.status),
    ) ?? false
  );
}

export default function ScheduleForm({
  schedule,
  onDone,
}: {
  schedule?: Schedule;
  onDone?: () => void;
}) {
  const createSchedule = useCreateSchedule();
  const updateSchedule = useUpdateSchedule();
  const dateLocked = schedule?.status === "PUBLISHED";
  const timeLocked = schedule ? scheduleTimeIsLocked(schedule) : false;
  const pending = createSchedule.isPending || updateSchedule.isPending;

  const form = useForm({
    defaultValues: {
      date: schedule ? localDateInput(schedule.startDateTime) : "",
      startTime: schedule ? localTimeInput(schedule.startDateTime) : "",
      endTime: schedule ? localTimeInput(schedule.endDateTime) : "",
      meetingLink: schedule?.meetingLink ?? "",
    },
    validators: {
      onSubmit: scheduleFormSchema,
    },
    onSubmit: ({ value }) => {
      const originalDate = schedule
        ? localDateInput(schedule.startDateTime)
        : "";
      const originalStart = schedule
        ? localTimeInput(schedule.startDateTime)
        : "";
      const originalEnd = schedule ? localTimeInput(schedule.endDateTime) : "";
      const timeUnchanged =
        value.date === originalDate &&
        value.startTime === originalStart &&
        value.endTime === originalEnd;

      const payload = {
        meetingLink: value.meetingLink.trim(),
        ...(!schedule || !timeUnchanged
          ? {
              startDateTime: combineLocalDateTime(
                value.date,
                value.startTime,
              ).toISOString(),
              endDateTime: combineLocalDateTime(
                value.date,
                value.endTime,
              ).toISOString(),
            }
          : {}),
      };

      const onSuccess = (response: { message: string }) => {
        toast.add({
          title: schedule ? "Schedule updated" : "Schedule created",
          description: response.message,
          type: "success",
        });
        if (!schedule) {
          form.reset();
        }
        onDone?.();
      };

      const onError = (error: unknown) => {
        toast.add({
          title: "Could not save schedule",
          description: apiErrorMessage(error),
          type: "error",
        });
      };

      if (schedule) {
        updateSchedule.mutate(
          { scheduleId: schedule.id, payload },
          { onSuccess, onError },
        );
        return;
      }

      createSchedule.mutate(
        {
          startDateTime: payload.startDateTime ?? "",
          endDateTime: payload.endDateTime ?? "",
          meetingLink: payload.meetingLink,
        },
        { onSuccess, onError },
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
        <form.Field name="date">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Date</FieldLabel>
                <Input
                  id={field.name}
                  type="date"
                  value={field.state.value}
                  disabled={dateLocked}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                />
                {dateLocked ? (
                  <p className="text-xs text-muted-foreground">
                    The date stays locked after the schedule is published.
                  </p>
                ) : null}
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="startTime">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Start</FieldLabel>
                  <Input
                    id={field.name}
                    type="time"
                    value={field.state.value}
                    disabled={timeLocked}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="endTime">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>End</FieldLabel>
                  <Input
                    id={field.name}
                    type="time"
                    value={field.state.value}
                    disabled={timeLocked}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {timeLocked ? (
                    <p className="text-xs text-muted-foreground">
                      The time range stays locked after the first booking.
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Use one date, between 3 and 8 hours.
                    </p>
                  )}
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </div>

        <form.Field name="meetingLink">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Meeting link</FieldLabel>
                <Input
                  id={field.name}
                  type="url"
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

        <Button disabled={pending} type="submit">
          {pending ? (
            <>
              <Spinner /> Saving
            </>
          ) : schedule ? (
            "Save changes"
          ) : (
            "Create schedule"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
