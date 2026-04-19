export type BlogBadge = {
  label: string;
};

export type BlogAuthor = {
  name: string;
  avatarSrc?: string;
};

export type BlogPost = {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  dateLabel: string;
  readTimeLabel?: string;
  coverImageSrc: string;
  coverImageAlt: string;
  author?: BlogAuthor;
  href: string;
  badge?: BlogBadge;
};

export type TrendingItem = {
  id: string;
  title: string;
  readsLabel: string;
  href: string;
};

export type BlogPromoCard = {
  pill: string;
  title: string;
  subtitle: string;
  dateLabel: string;
  noteLabel: string;
  ctaLabel: string;
  href: string;
  backgroundImageSrc: string;
  backgroundImageAlt: string;
};

export type BlogCategoryApi = {
  id: string;
  name: string;
};

export type BlogAuthorApi = {
  id: string;
  fullLegalName: string;
  professionalRole?: string;
  profilePhotoUrl?: string;
};

export type BlogImageLike =
  | string
  | null
  | {
      url?: string;
      src?: string;
      secureUrl?: string;
      href?: string;
      location?: string;
    };

export type BlogPostApi = {
  id: string;
  title: string;
  description?: string;
  excerpt?: string;
  coverImageUrl?: BlogImageLike;
  categories?: BlogCategoryApi[] | null;
  authors?: BlogAuthorApi[] | null;
  readTimeMinutes?: number | string | null;
  readCount?: number | string;
  readBy?: string;
  publishedAt?: string | null;
  isFeatured: boolean;
};

export type BlogTagApi = {
  id: string;
  name: string;
};

export type BlogSeoApi = {
  metaTitle?: string;
  metaDescription?: string;
};

export type BlogDetailsApi = BlogPostApi & {
  content: string;
  tags: BlogTagApi[];
  seo?: BlogSeoApi;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type TrendingMeta = {
  limit: number;
  total: number;
};

export type GetBlogsResponseApi = {
  items: BlogPostApi[];
  meta: PaginationMeta;
};

export type GetTrendingBlogsResponseApi = {
  items: BlogPostApi[];
  meta: TrendingMeta;
};
