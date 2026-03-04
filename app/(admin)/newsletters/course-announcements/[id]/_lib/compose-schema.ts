import { z } from "zod";

export const PrioritySchema = z.enum(["general", "material", "urgent"]);

export const ComposeBroadcastSchema = z.object({
  recipientIds: z.array(z.string()).min(1),
  priority: PrioritySchema,
  subject: z.string().min(5).max(120),
  message: z.string().min(10).max(5000),
  pushToStudentPanel: z.boolean(),
});

export type ComposeBroadcastInput = z.infer<typeof ComposeBroadcastSchema>;