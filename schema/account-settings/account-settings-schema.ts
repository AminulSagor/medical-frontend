import { z } from "zod";

export const settingsSectionSchema = z.enum([
  "public-profile",
  "security-password",
  "payment-methods",
]);

export const accountProfileSchema = z.object({
  section: settingsSectionSchema.default("public-profile"),

  // profile
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),

  email: z.string().email("Invalid email"),
  phone: z.string().min(7, "Invalid phone number").optional().or(z.literal("")),

  titleRole: z.string().min(1, "Title / Role is required"),
  institution: z.string().optional().or(z.literal("")),
  npiNumber: z.string().optional().or(z.literal("")),

  // photo
  avatarUrl: z.string().url().optional().or(z.literal("")),
  avatarInitials: z.string().min(1).max(3).optional().or(z.literal("")),
});

export type AccountProfileInput = z.input<typeof accountProfileSchema>;
export type AccountProfileOutput = z.output<typeof accountProfileSchema>;