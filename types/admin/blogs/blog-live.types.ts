export interface BlogLiveSeo {
  id: string;
  postId: string;
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogLiveAuthor {
  id: string;
  fullLegalName: string;
  medicalEmail: string;
  professionalRole: string;
}

export interface BlogLiveCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogLiveTag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface BlogLivePost {
  id: string;
  title: string;
  content: string;
  coverImageUrl: string;
  publishingStatus: string;
  scheduledPublishDate: string | null;
  isFeatured: boolean;
  excerpt: string;
  readTimeMinutes: number;
  readCount: number;
  publishedAt: string | null;
  seo: BlogLiveSeo | null;
  authors: BlogLiveAuthor[];
  categories: BlogLiveCategory[];
  tags: BlogLiveTag[];
  createdAt: string;
  updatedAt: string;
}