import { z } from "zod";

const Htmlish = z
  .string()
  .trim()
  .min(1, "Content is required.")
  .refine((v) => /<\s*[a-z][\s\S]*>/i.test(v), "Content must be valid HTML (at least one tag).");

export const BlogCreateSchema = z
  .object({
  title: z.string().trim().min(5, "Title must be at least 5 characters.").max(120, "Title is too long."),
  content: Htmlish,

  // Backend expects a URL (e.g. `https://storage...`). For now, we store data URLs from the file picker,
  // so the shape matches even before the real upload integration is added.
  coverImageUrl: z.string().trim().max(2_000_000).optional(),

  publishingStatus: z.enum(["draft", "scheduled", "published"]),
  scheduledPublishDate: z.string().datetime().optional(),
  isFeatured: z.boolean(),

  excerpt: z.string().trim().min(20, "Excerpt must be at least 20 characters.").max(150, "Excerpt must be at most 150 characters."),

  // Backend expects ids arrays; in this UI we treat “names” as ids until the backend mapping is implemented.
  authorIds: z.array(z.string().trim().min(1)).min(1).max(5),
  categoryIds: z.array(z.string().trim().min(1)).min(1).max(10),
  tagIds: z.array(z.string().trim().min(1)).max(12),

  seoMetaTitle: z.string().trim().min(5).max(70),
  seoMetaDescription: z.string().trim().min(20).max(160),
  })
  .superRefine((val, ctx) => {
    if (val.publishingStatus === "scheduled") {
      if (!val.scheduledPublishDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Scheduled publish date is required when publishingStatus is scheduled.",
          path: ["scheduledPublishDate"],
        });
      }
    }
  });

export type BlogCreateInput = z.infer<typeof BlogCreateSchema>;

