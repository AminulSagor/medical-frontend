import { getBlogById } from "@/service/public/blogs/blogs.service";
import BlogDetailsContent from "./_components/blog-details-content";
import BlogDetailsHeader from "./_components/blog-details-header";
import BlogDetailsHeroImage from "./_components/blog-details-hero-image";
import BlogDetailsSidebar from "./_components/blog-details-sidebar";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const blog = await getBlogById(params.slug);
    return {
      title: blog.seo?.metaTitle || blog.title,
      description: blog.seo?.metaDescription || blog.description,
    };
  } catch (error) {
    return {
      title: "Blog Not Found",
    };
  }
}

export default async function BlogDetailsPage({ params }: { params: { slug: string } }) {
  let blog;
  try {
    blog = await getBlogById(params.slug);
  } catch (error) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* top spacing because navbar is fixed overlay */}
      <div className="padding pt-28 pb-16">
        {/* Header */}
        <BlogDetailsHeader blog={blog} />

        {/* Hero Image (FULL WIDTH) */}
        <div className="mt-10">
          <BlogDetailsHeroImage blog={blog} />
        </div>

        {/* Content + Sidebar Grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            <BlogDetailsContent blog={blog} />
          </div>

          <div className="lg:pt-4">
            <BlogDetailsSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}