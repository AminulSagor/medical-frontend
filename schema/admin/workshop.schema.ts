import { z } from "zod";

const workshopSegmentSchema = z.object({
  segmentNumber: z.number().int().positive("Segment number is required"),
  courseTopic: z.string().min(1, "Course topic is required"),
  topicDetails: z.string().optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

const workshopDaySchema = z.object({
  date: z.string().min(1, "Date is required"),
  dayNumber: z.number().int().positive("Day number is required"),
  segments: z
    .array(workshopSegmentSchema)
    .min(1, "At least one segment is required per day"),
});

const groupDiscountSchema = z.object({
  minimumAttendees: z
    .number()
    .int()
    .positive("Minimum attendees must be a positive number"),
  groupRatePerPerson: z
    .string()
    .min(1, "Group rate per person is required"),
});

export const shortCreateWorkshopSchema = z.object({
  deliveryMode: z.enum(["in_person", "online"], {
    message: "Delivery mode is required",
  }),
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  offersCmeCredits: z.boolean(),
  facilityId: z.string().min(1, "Facility is required"),
  capacity: z
    .number()
    .int()
    .positive("Capacity must be a positive number"),
  alertAt: z
    .number()
    .int()
    .nonnegative("Alert threshold must be a non-negative number"),
  registrationDeadline: z
    .string()
    .min(1, "Registration deadline is required"),
});

export const fullCreateWorkshopSchema = z.object({
  deliveryMode: z.enum(["in_person", "online"], {
    message: "Delivery mode is required",
  }),
  status: z.enum(["draft", "published"], {
    message: "Status is required",
  }),
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  shortBlurb: z.string().optional(),
  coverImageUrl: z.string().optional(),
  learningObjectives: z.string().optional(),
  offersCmeCredits: z.boolean(),
  facilityIds: z.array(z.string()).min(1, "At least one facility is required"),
  webinarPlatform: z.string().nullish(),
  meetingLink: z.string().nullish(),
  meetingPassword: z.string().nullish(),
  autoRecordSession: z.boolean().optional(),
  capacity: z
    .number()
    .int()
    .nonnegative("Capacity must be a non-negative number"),
  alertAt: z
    .number()
    .int()
    .nonnegative("Alert threshold must be a non-negative number"),
  standardBaseRate: z.string().min(1, "Standard base rate is required"),
  groupDiscountEnabled: z.boolean(),
  groupDiscounts: z.array(groupDiscountSchema),
  facultyIds: z.array(z.string()),
  days: z
    .array(workshopDaySchema)
    .min(1, "At least one day is required"),
});

export const createWorkshopSchema = z.union([
  shortCreateWorkshopSchema,
  fullCreateWorkshopSchema,
]);

export type CreateWorkshopFormData = z.infer<typeof createWorkshopSchema>;