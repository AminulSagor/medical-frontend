import type {
  // BlogAuthorOption,
  BlogCategoryOption,
  BlogTagOption,
} from "@/types/admin/blogs/blog-create.types";

export const BLOG_MANAGEMENT_PATH = "/dashboard/admin/blogs";

// export const BLOG_CREATE_AUTHOR_OPTIONS: BlogAuthorOption[] = [
//   { id: "author_1", name: "Dr. Sarah Miller" },
//   { id: "author_2", name: "Dr. Jonathan Hayes" },
//   { id: "author_3", name: "Dr. Emily Carter" },
// ];

export const BLOG_CREATE_CATEGORY_OPTIONS: BlogCategoryOption[] = [
  { id: "category_1", name: "Airway Management" },
  { id: "category_2", name: "Clinical Research" },
  { id: "category_3", name: "Pediatrics" },
  { id: "category_4", name: "Emergency Medicine" },
];

export const BLOG_CREATE_TAG_OPTIONS: BlogTagOption[] = [
  { id: "tag_1", name: "Laryngoscopy" },
  { id: "tag_2", name: "Intubation" },
  { id: "tag_3", name: "Ventilation" },
  { id: "tag_4", name: "Trauma" },
];

export const DEFAULT_BLOG_CREATE_TITLE = "New Approaches in Pediatric";
export const DEFAULT_BLOG_CREATE_EXCERPT = "";
export const DEFAULT_BLOG_CREATE_META_TITLE = "";
export const DEFAULT_BLOG_CREATE_META_DESCRIPTION = "";
export const DEFAULT_BLOG_CREATE_COVER_IMAGE_URL =
  "https://storage.example.com/images/cover-pediatric-airway.jpg";

export const DEFAULT_BLOG_CREATE_SCHEDULE_DATE_LABEL = "Oct 24, 2023";
export const DEFAULT_BLOG_CREATE_SCHEDULE_TIME_LABEL = "10:00 AM";

export const DEFAULT_BLOG_CREATE_SEARCH_PREVIEW_HOST =
  "texasairwayinstitute.com";
