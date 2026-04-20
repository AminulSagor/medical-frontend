import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogDetailsContent from "./_components/blog-details-content";
import BlogDetailsHeader from "./_components/blog-details-header";
import BlogDetailsHeroImage from "./_components/blog-details-hero-image";
import BlogDetailsSidebar from "./_components/blog-details-sidebar";
import {
  getBlogById,
  getTrendingPublicBlogs,
} from "@/service/public/blogs/blogs.service";
import { mapApiBlogToTrendingItem } from "../_utils/blogs.mapper";
import type { TrendingItem } from "@/types/public/blogs/blog-type";

type BlogDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

function getSafeString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export async function generateMetadata({
  params,
}: BlogDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const blog = await getBlogById(slug);

    return {
      title: getSafeString(blog.seo?.metaTitle, getSafeString(blog.title, "Blog Details")),
      description: getSafeString(
        blog.seo?.metaDescription,
        getSafeString(blog.description ?? blog.excerpt, "Read the latest article."),
      ),
    };
  } catch {
    return {
      title: "Blog Not Found",
    };
  }
}

export default async function BlogDetailsPage({
  params,
}: BlogDetailsPageProps) {
  const { slug } = await params;

  let blog;
  let trendingItems: TrendingItem[] = [];

  try {
    blog = await getBlogById(slug);
  } catch {
    return notFound();
  }

  try {
    const trendingResponse = await getTrendingPublicBlogs({ limit: 3 });
    trendingItems = (trendingResponse.items ?? [])
      .filter((item) => item.id !== blog.id)
      .slice(0, 3)
      .map(mapApiBlogToTrendingItem);
  } catch (error) {
    console.error("Failed to load trending blogs", error);
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="padding pb-16 pt-28">
        <BlogDetailsHeader blog={blog} />

        <div className="mt-10">
          <BlogDetailsHeroImage blog={blog} />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            <BlogDetailsContent blog={blog} />
          </div>

          <div className="lg:pt-4">
            <BlogDetailsSidebar
              author={Array.isArray(blog.authors) ? blog.authors[0] : undefined}
              trendingItems={trendingItems}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
