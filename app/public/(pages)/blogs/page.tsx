import BlogsHero from "./_components/blogs-hero";
import LatestDiscoveriesSection from "./_components/latest-discoveries-section";
import { BLOG_FEATURED } from "@/app/public/data/blogs.data";
import {
  getPublicBlogs,
  getTrendingPublicBlogs,
} from "@/service/public/blogs/blogs.service";
import {
  mapApiBlogToTrendingItem,
  mapApiBlogToUiBlog,
} from "./_utils/blogs.mapper";
import type { BlogPost, TrendingItem } from "@/types/public/blogs/blog-type";

const BlogsPage = async () => {
  let featuredPost: BlogPost | null = BLOG_FEATURED;
  let trendingItems: TrendingItem[] = [];

  try {
    const [featuredResponse, trendingResponse] = await Promise.all([
      getPublicBlogs({ limit: 1, sortBy: "featured" }),
      getTrendingPublicBlogs({ limit: 5 }),
    ]);

    if (featuredResponse.items[0]) {
      featuredPost = mapApiBlogToUiBlog(featuredResponse.items[0]);
    }
    trendingItems = trendingResponse.items.map(mapApiBlogToTrendingItem);
  } catch (error) {
    console.error("Failed to load public blog page data", error);
  }

  return (
    <div className="pb-14">
      <BlogsHero post={featuredPost} />
      <LatestDiscoveriesSection trendingItems={trendingItems} />
    </div>
  );
};

export default BlogsPage;
