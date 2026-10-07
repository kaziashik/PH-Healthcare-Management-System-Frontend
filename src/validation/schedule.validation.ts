import z from "zod";
import { scheduleDurationMinutes } from "@/lib/visit-time";

export const scheduleFormSchema = z
  .object({
    date: z.string().min(1, "Choose a date"),
    startTime: z.string().min(1, "Choose a start time"),
    endTime: z.string().min(1, "Choose an end time"),
    meetingLink: z.url("Enter a valid meeting link"),
  })
  .refine(
    (value) => {
      const minutes = scheduleDurationMinutes(
        value.date,
        value.startTime,
        value.endTime,
      );
      return minutes >= 180 && minutes <= 480;
    },
    {
      message:
        "The visit window must be between 3 and 8 hours on the same date.",
      path: ["endTime"],
    },
  );
