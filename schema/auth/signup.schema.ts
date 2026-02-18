import { z } from "zod";

export const signupSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required."),

  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),

  role: z
    .string()
    .trim()
    .min(1, "Professional role is required."),

  password: z
    .string()
    .min(1, "Password is required.")
    .min(12, "Password must be at least 12 characters.")
    .refine((val) => /[A-Z]/.test(val), {
      message: "Use uppercase, lowercase, number, and symbol for a stronger password.",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Use uppercase, lowercase, number, and symbol for a stronger password.",
    })
    .refine((val) => /\d/.test(val), {
      message: "Use uppercase, lowercase, number, and symbol for a stronger password.",
    })
    .refine((val) => /[^A-Za-z0-9]/.test(val), {
      message: "Use uppercase, lowercase, number, and symbol for a stronger password.",
    }),

  acceptedTerms: z
    .boolean()
    .refine((v) => v === true, { message: "You must accept the terms." }),
});

export type SignupSchemaInput = z.input<typeof signupSchema>;
export type SignupSchemaOutput = z.output<typeof signupSchema>;
