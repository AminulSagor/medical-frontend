import { z } from "zod";

const Htmlish = z
  .string()
  .trim()
  .min(1, "Content is required.")
  .refine((v) => /<\s*[a-z][\s\S]*>/i.test(v), "Content must include valid formatted text.");

const OptionalUrl = z
  .string()
  .trim()
  .refine((v) => v.length === 0 || /^https?:\/\/\S+$/i.test(v), {
    message: "Cover image must be a valid URL.",
  })
  .optional();

export const BlogCreateSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required.")
      .min(5, "Title must be at least 5 characters.")
      .max(120, "Title must be 120 characters or less."),
    content: Htmlish,

    coverImageUrl: OptionalUrl,

    publishingStatus: z.enum(["draft", "scheduled", "published"], {
      errorMap: () => ({ message: "Please select a valid publishing status." }),
    }),
    scheduledPublishDate: z
      .string()
      .datetime("Please select a valid schedule date and time.")
      .optional(),
    isFeatured: z.boolean(),

    excerpt: z
      .string()
      .trim()
      .min(1, "Excerpt is required.")
      .min(20, "Excerpt must be at least 20 characters.")
      .max(150, "Excerpt must be at most 150 characters."),

    // Backend expects an array, but UI selects exactly one author.
    authorIds: z
      .array(z.string().trim().min(1))
      .min(1, "Author is required.")
      .max(1, "Select exactly one author."),
    categoryIds: z
      .array(z.string().trim().min(1))
      .min(1, "Select at least one category.")
      .max(10, "You can select up to 10 categories."),
    tagIds: z.array(z.string().trim().min(1)).max(12, "You can select up to 12 tags."),

    seoMetaTitle: z
      .string()
      .trim()
      .min(1, "Meta title is required.")
      .min(5, "Meta title must be at least 5 characters.")
      .max(70, "Meta title must be 70 characters or less."),
    seoMetaDescription: z
      .string()
      .trim()
      .min(1, "Meta description is required.")
      .min(20, "Meta description must be at least 20 characters.")
      .max(160, "Meta description must be 160 characters or less."),
  })
  .superRefine((val, ctx) => {
    if (val.publishingStatus === "scheduled") {
      if (!val.scheduledPublishDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Schedule date and time are required when scheduling a post.",
          path: ["scheduledPublishDate"],
        });
        return;
      }

      const when = new Date(val.scheduledPublishDate);
      if (isNaN(when.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Schedule date and time are invalid.",
          path: ["scheduledPublishDate"],
        });
        return;
      }

      if (when.getTime() < Date.now()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Schedule date and time must be in the future.",
          path: ["scheduledPublishDate"],
        });
      }
    }
  });

export type BlogCreateInput = z.infer<typeof BlogCreateSchema>;

