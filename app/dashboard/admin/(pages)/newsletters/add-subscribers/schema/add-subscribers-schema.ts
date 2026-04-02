import { z } from "zod";

export const addSubscriberSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z
    .string()
    .optional()
    .refine(
      (v) => !v || /^[+0-9()\-\s]{7,}$/.test(v),
      "Please enter a valid phone number"
    ),

  clinicalRole: z.string().min(1, "Clinical role is required"),
  medicalDesignation: z.string().min(1, "Medical designation is required"),
  primaryInstitution: z.string().min(2, "Primary institution is required"),

  source: z.string().min(1, "Source is required"),
  audienceTags: z.array(z.string()).max(10, "Max 10 tags"),
  initialStatus: z.enum(["subscribed", "unsubscribed"]),
});

export type AddSubscriberSchema = z.infer<typeof addSubscriberSchema>;