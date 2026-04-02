import { z } from "zod";

export const registerFacultySchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name must be less than 100 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name must be less than 100 characters"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[\d\s\-+()]+$/, "Invalid phone number format"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  imageUrl: z.string().optional(),
  primaryClinicalRole: z
    .string()
    .min(1, "Primary clinical role is required"),
  medicalDesignation: z
    .string()
    .min(1, "Medical designation is required"),
  institutionOrHospital: z
    .string()
    .min(1, "Institution or hospital is required"),
  npiNumber: z
    .string()
    .min(1, "NPI number is required")
    .regex(/^\d{10}$/, "NPI number must be exactly 10 digits"),
  assignedRole: z.enum(["instructor", "faculty", "admin"], {
    message: "Assigned role is required",
  }),
});

export type RegisterFacultyFormData = z.infer<typeof registerFacultySchema>;
