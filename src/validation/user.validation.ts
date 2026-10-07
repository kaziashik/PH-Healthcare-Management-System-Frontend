import z from "zod";

const optionalText = (minimum: number, message: string) =>
  z
    .string()
    .trim()
    .refine((value) => value === "" || value.length >= minimum, { message });

export const createManagedAccountSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long"),
  organizationEmail: z.email("Invalid organization email"),
  personalEmail: z.email("Invalid personal email"),
  contactNumber: optionalText(5, "Contact number is invalid"),
  address: optionalText(5, "Address must be at least 5 characters long"),
});
