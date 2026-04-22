"use client";

import { Clock3, Monitor, Smartphone, Tablet, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useBlogPreviewStore } from "@/store/blog-preview.store";

type PreviewViewport = "desktop" | "tablet" | "mobile";

type PreviewImage = {
  imageUrl: string;
  imageType: "hero" | "thumbnail" | string;
};

function formatPublishedDate(date?: string | null) {
  if (!date) return "Draft Preview";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Draft Preview";
  }

  return parsed.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getAuthorName(blog: any) {
  return blog?.authorName || "Unknown Author";
}

function getAuthorRole() {
  return "Medical Contributor";
}

function getCategoryName(blog: any) {
  return blog?.categories?.[0]?.name || "Clinical Case";
}

function getReadTime(blog: any) {
  if (typeof blog?.readTimeMinutes === "number" && blog.readTimeMinutes > 0) {
    return `${blog.readTimeMinutes} min read`;
  }

  return "5 min read";
}

function getPublishedDate(blog: any) {
  return formatPublishedDate(
    blog?.publishedAt || blog?.scheduledPublishDate || blog?.createdAt || null,
  );
}

function getPreviewContent(blog: any) {
  return blog?.content || "";
}

function getPreviewTitle(blog: any) {
  return blog?.title || "Untitled Article";
}

function getPreviewImages(blog: any): PreviewImage[] {
  if (!Array.isArray(blog?.coverImages)) return [];

  return blog.coverImages.filter(
    (image: PreviewImage) =>
      image?.imageUrl && typeof image.imageUrl === "string",
  );
}

function getHeroImage(blog: any) {
  const images = getPreviewImages(blog);

  return (
    images.find((image) => image.imageType === "hero")?.imageUrl ||
    images[0]?.imageUrl ||
    ""
  );
}

function getThumbnailImages(blog: any) {
  return getPreviewImages(blog).filter(
    (image) => image.imageType === "thumbnail",
  );
}

function getOtherImages(blog: any) {
  return getPreviewImages(blog).filter(
    (image) => image.imageType !== "hero" && image.imageType !== "thumbnail",
  );
}

function getAllBodyImages(blog: any) {
  const thumbnails = getThumbnailImages(blog);
  const others = getOtherImages(blog);

  return [...thumbnails, ...others];
}

function getSeoDescription(blog: any) {
  return (
    blog?.seo?.metaDescription ||
    blog?.excerpt ||
    "No article description available."
  );
}

function DeviceButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-8 items-center gap-2 rounded-md border px-3 text-xs font-medium transition ${
        active
          ? "border-slate-500 bg-slate-700 text-white"
          : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function PreviewTopBar({
  viewport,
  onViewportChange,
  onClose,
}: {
  viewport: PreviewViewport;
  onViewportChange: (value: PreviewViewport) => void;
  onClose: () => void;
}) {
  return (
    <div className="sticky top-0 z-50 border-b border-slate-800 bg-[#0b1730] px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
            Article Preview
          </p>

          <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/70 p-1">
            <DeviceButton
              label="Desktop"
              icon={<Monitor size={14} />}
              active={viewport === "desktop"}
              onClick={() => onViewportChange("desktop")}
            />
            <DeviceButton
              label="Tablet"
              icon={<Tablet size={14} />}
              active={viewport === "tablet"}
              onClick={() => onViewportChange("tablet")}
            />
            <DeviceButton
              label="Mobile"
              icon={<Smartphone size={14} />}
              active={viewport === "mobile"}
              onClick={() => onViewportChange("mobile")}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Live Draft Sync
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-300 transition hover:text-white"
          >
            Close Preview
            <span className="grid h-5 w-5 place-items-center rounded-full bg-slate-700 text-slate-200">
              <X size={12} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ArticleImageGallery({
  images,
  title,
}: {
  images: PreviewImage[];
  title: string;
}) {
  if (!images.length) return null;

  if (images.length === 1) {
    return (
      <div className="mb-8 overflow-hidden rounded-sm">
        <img
          src={images[0].imageUrl}
          alt={`${title} image 1`}
          className="h-auto w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
      {images.map((image, index) => (
        <div
          key={`${image.imageUrl}-${index}`}
          className="overflow-hidden rounded-sm"
        >
          <img
            src={image.imageUrl}
            alt={`${title} image ${index + 1}`}
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}

function DesktopArticlePreview({ blog }: { blog: any }) {
  const title = getPreviewTitle(blog);
  const coverImage = getHeroImage(blog);
  const bodyImages = getAllBodyImages(blog);
  const authorName = getAuthorName(blog);
  const authorRole = getAuthorRole();
  const categoryName = getCategoryName(blog);
  const readTime = getReadTime(blog);
  const publishedDate = getPublishedDate(blog);
  const seoDescription = getSeoDescription(blog);
  const content = getPreviewContent(blog);

  return (
    <div className="mx-auto w-full max-w-[1180px] overflow-hidden rounded-none border border-slate-300 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.35)]">
      <div className="relative min-h-[460px] overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-300" />
        )}

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,19,43,0.12)_0%,rgba(8,22,49,0.48)_46%,rgba(8,20,44,0.92)_100%)]" />

        <div className="relative flex min-h-[460px] items-end px-12 pb-12 pt-12">
          <div className="max-w-[860px]">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex h-10 items-center rounded-sm bg-[#16c6c1] px-4 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                {categoryName}
              </span>

              <span className="inline-flex h-10 items-center gap-2 rounded-sm border border-white/20 bg-slate-900/70 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                <Clock3 size={13} />
                {readTime}
              </span>
            </div>

            <h1
              className="max-w-[820px] font-semibold leading-[0.95] text-white"
              style={{
                fontSize: "72px",
                fontFamily: 'Georgia, "Times New Roman", Times, serif',
              }}
            >
              {title}
            </h1>

            <div className="mt-8 flex items-center gap-4">
              <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-white/60 bg-white/20">
                <div className="flex h-full w-full items-center justify-center bg-slate-200 text-base font-semibold text-slate-700">
                  {authorName.charAt(0)}
                </div>
              </div>

              <div>
                <p className="text-base font-semibold text-white">
                  {authorName}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/75">
                  Published {publishedDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white px-12 py-14">
        <div className="grid grid-cols-[minmax(0,1fr)_260px] gap-14">
          <div className="min-w-0">
            <ArticleImageGallery images={bodyImages} title={title} />

            <div
              className="text-slate-600 [&_blockquote]:my-6 [&_blockquote]:border-l-[3px] [&_blockquote]:border-[#16c6c1] [&_blockquote]:pl-4 [&_blockquote]:italic [&_h1]:mb-5 [&_h1]:mt-10 [&_h1]:font-semibold [&_h1]:text-slate-900 [&_h1]:text-base [&_h2]:mb-5 [&_h2]:mt-10 [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h2]:text-base [&_h3]:mb-4 [&_h3]:mt-8 [&_h3]:font-semibold [&_h3]:text-slate-900 [&_h3]:text-base [&_img]:my-6 [&_img]:h-auto [&_img]:w-full [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-5 [&_p]:leading-[2] [&_p]:text-slate-600 [&_p]:text-base [&_strong]:font-semibold [&_strong]:text-slate-900 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6"
              style={{
                fontFamily: 'Georgia, "Times New Roman", Times, serif',
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>

          <aside className="min-w-0">
            <div className="border border-slate-200 bg-white px-8 py-7">
              <div className="mb-5 h-1 w-full bg-[#16c6c1]" />

              <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                <div className="flex h-full w-full items-center justify-center text-base font-semibold text-slate-700">
                  {authorName.charAt(0)}
                </div>
              </div>

              <h3
                className="mt-6 text-center font-semibold text-slate-900"
                style={{
                  fontSize: "22px",
                  fontFamily: 'Georgia, "Times New Roman", Times, serif',
                }}
              >
                {authorName}
              </h3>

              <p className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.28em] text-[#16c6c1]">
                {authorRole}
              </p>

              <div className="my-5 h-px bg-slate-200" />

              <p className="text-center text-sm leading-8 text-slate-500">
                {seoDescription}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function TabletArticlePreview({ blog }: { blog: any }) {
  const title = getPreviewTitle(blog);
  const coverImage = getHeroImage(blog);
  const bodyImages = getAllBodyImages(blog);
  const authorName = getAuthorName(blog);
  const categoryName = getCategoryName(blog);
  const readTime = getReadTime(blog);
  const publishedDate = getPublishedDate(blog);
  const content = getPreviewContent(blog);

  return (
    <div className="mx-auto w-[760px] overflow-hidden rounded-[28px] border-[6px] border-slate-900 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.45)]">
      <div className="flex justify-center bg-white py-2">
        <div className="h-1.5 w-14 rounded-full bg-slate-900" />
      </div>

      <div className="relative min-h-[320px] overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-300" />
        )}

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,19,43,0.1)_0%,rgba(8,20,44,0.72)_100%)]" />

        <div className="relative px-8 pb-8 pt-8">
          <div className="mb-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center bg-slate-900 text-xs font-bold text-white">
                T
              </div>
              <p className="text-sm font-semibold text-slate-900">
                Texas Airway Institute
              </p>
            </div>

            <button
              type="button"
              className="h-8 rounded-sm bg-slate-900 px-4 text-xs font-semibold uppercase tracking-[0.14em] text-white"
            >
              Register
            </button>
          </div>

          <div className="max-w-[520px]">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex h-8 items-center rounded-sm bg-[#16c6c1] px-3 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                {categoryName}
              </span>
              <span className="inline-flex h-8 items-center gap-1.5 rounded-sm bg-slate-900/70 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                <Clock3 size={12} />
                {readTime}
              </span>
            </div>

            <h1
              className="font-semibold leading-[1.02] text-white"
              style={{
                fontSize: "44px",
                fontFamily: 'Georgia, "Times New Roman", Times, serif',
              }}
            >
              {title}
            </h1>

            <div className="mt-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-100" />
              <div>
                <p className="text-sm font-semibold text-white">{authorName}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/75">
                  {publishedDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white px-8 py-8">
        <ArticleImageGallery images={bodyImages} title={title} />

        <div
          className="text-slate-700 [&_blockquote]:my-5 [&_blockquote]:border-l-[3px] [&_blockquote]:border-[#16c6c1] [&_blockquote]:pl-4 [&_blockquote]:italic [&_h1]:mb-4 [&_h1]:mt-8 [&_h1]:font-semibold [&_h1]:text-slate-900 [&_h1]:text-base [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h2]:text-base [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-slate-900 [&_h3]:text-base [&_img]:my-5 [&_img]:h-auto [&_img]:w-full [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4 [&_p]:leading-8 [&_p]:text-base [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5"
          style={{
            fontFamily: 'Georgia, "Times New Roman", Times, serif',
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}

function MobileArticlePreview({ blog }: { blog: any }) {
  const title = getPreviewTitle(blog);
  const coverImage = getHeroImage(blog);
  const bodyImages = getAllBodyImages(blog);
  const authorName = getAuthorName(blog);
  const categoryName = getCategoryName(blog);
  const readTime = getReadTime(blog);
  const publishedDate = getPublishedDate(blog);
  const content = getPreviewContent(blog);

  return (
    <div className="mx-auto w-[320px] overflow-hidden rounded-[34px] border-[6px] border-slate-900 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.45)]">
      <div className="flex justify-center bg-white py-2">
        <div className="h-5 w-28 rounded-full bg-slate-900" />
      </div>

      <div className="relative min-h-[270px] overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-300" />
        )}

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,19,43,0.08)_0%,rgba(8,20,44,0.78)_100%)]" />

        <div className="relative px-4 pb-5 pt-4">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="grid h-6 w-6 place-items-center bg-slate-900 text-[10px] font-bold text-white">
                T
              </div>
              <p className="text-[10px] font-semibold text-slate-900">
                Texas Airway Institute
              </p>
            </div>

            <button
              type="button"
              className="h-6 rounded-sm bg-slate-900 px-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-white"
            >
              Register
            </button>
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex h-6 items-center rounded-sm bg-[#16c6c1] px-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-white">
              {categoryName}
            </span>
            <span className="inline-flex h-6 items-center gap-1 rounded-sm bg-slate-900/70 px-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-white">
              <Clock3 size={10} />
              {readTime}
            </span>
          </div>

          <h1
            className="font-semibold leading-[1.08] text-white"
            style={{
              fontSize: "28px",
              fontFamily: 'Georgia, "Times New Roman", Times, serif',
            }}
          >
            {title}
          </h1>

          <div className="mt-4 flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-slate-100" />
            <div>
              <p className="text-xs font-semibold text-white">{authorName}</p>
              <p className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-white/75">
                {publishedDate}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white px-4 py-5">
        <ArticleImageGallery images={bodyImages} title={title} />

        <div
          className="text-slate-700 [&_blockquote]:my-4 [&_blockquote]:border-l-[3px] [&_blockquote]:border-[#16c6c1] [&_blockquote]:pl-3 [&_blockquote]:italic [&_h1]:mb-3 [&_h1]:mt-6 [&_h1]:font-semibold [&_h1]:text-slate-900 [&_h1]:text-base [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h2]:text-base [&_h3]:mb-3 [&_h3]:mt-5 [&_h3]:font-semibold [&_h3]:text-slate-900 [&_h3]:text-base [&_img]:my-4 [&_img]:h-auto [&_img]:w-full [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4 [&_p]:leading-7 [&_p]:text-sm [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5"
          style={{
            fontFamily: 'Georgia, "Times New Roman", Times, serif',
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}

export default function BlogPreviewPage() {
  const router = useRouter();
  const [viewport, setViewport] = useState<PreviewViewport>("desktop");

  const previewBlog = useBlogPreviewStore((state) => state.previewBlog);

  const hasPreview = useMemo(() => Boolean(previewBlog), [previewBlog]);

  const previewReturnPath = useBlogPreviewStore(
    (state) => state.previewReturnPath,
  );

  const handleClosePreview = () => {
    router.push(
      previewReturnPath || "/dashboard/admin/blogs/create?fromPreview=true",
    );
  };

  if (!hasPreview || !previewBlog) {
    return (
      <div className="min-h-screen bg-[#13233f]">
        <PreviewTopBar
          viewport={viewport}
          onViewportChange={setViewport}
          onClose={handleClosePreview}
        />

        <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4">
          <div className="rounded-2xl border border-slate-700 bg-slate-900/60 px-6 py-5 text-center">
            <p className="text-base font-semibold text-white">
              No preview data found
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Please go back and create a blog preview first.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#13233f]">
      <PreviewTopBar
        viewport={viewport}
        onViewportChange={setViewport}
        onClose={handleClosePreview}
      />

      <div className="px-4 py-6 md:px-6 md:py-8">
        {viewport === "desktop" ? null : (
          <div className="pointer-events-none absolute inset-x-0 top-[73px] bottom-0 bg-[radial-gradient(circle_at_center,rgba(18,51,92,0.35)_0%,rgba(19,35,63,0)_62%)]" />
        )}

        <div className="relative">
          {viewport === "desktop" ? (
            <DesktopArticlePreview blog={previewBlog} />
          ) : null}

          {viewport === "tablet" ? (
            <TabletArticlePreview blog={previewBlog} />
          ) : null}

          {viewport === "mobile" ? (
            <MobileArticlePreview blog={previewBlog} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
