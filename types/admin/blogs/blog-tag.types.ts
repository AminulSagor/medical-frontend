export interface BlogTagItem {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface CreateBlogTagsRequest {
  tags: Array<{
    name: string;
  }>;
}