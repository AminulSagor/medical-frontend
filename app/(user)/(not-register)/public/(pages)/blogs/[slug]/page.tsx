import BlogDetailsContent from "./_components/blog-details-content";
import BlogDetailsHeader from "./_components/blog-details-header";
import BlogDetailsHeroImage from "./_components/blog-details-hero-image";
import BlogDetailsSidebar from "./_components/blog-details-sidebar";

export default function BlogDetailsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* top spacing because navbar is fixed overlay */}
      <div className="padding pt-28 pb-16">
        {/* Header */}
        <BlogDetailsHeader />

        {/* Hero Image (FULL WIDTH) */}
        <div className="mt-10">
          <BlogDetailsHeroImage />
        </div>

        {/* Content + Sidebar Grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            <BlogDetailsContent />
          </div>

          <div className="lg:pt-4">
            <BlogDetailsSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}