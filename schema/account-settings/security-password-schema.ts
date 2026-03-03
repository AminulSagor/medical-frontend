import { z } from "zod";

export const securityPasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z
      .string()
      .min(8)
      .refine((v) => /[A-Z]/.test(v))
      .refine((v) => /[0-9\W_]/.test(v)),
    confirmNewPassword: z.string().min(1),
  })
  .refine((v) => v.newPassword === v.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match",
  });

export type SecurityPasswordValidated = z.infer<typeof securityPasswordSchema>;