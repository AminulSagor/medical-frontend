import { BlogDetailsApi } from "@/types/public/blogs/blog-type";
import FallbackNetworkImage from "../../_components/fallback-network-image";

function getHeroImageUrl(blog: BlogDetailsApi): string {
  const images = Array.isArray(blog.coverImageUrl) ? blog.coverImageUrl : [];

  const heroImage = images.find(
    (image) =>
      image?.imageType === "hero" &&
      typeof image.imageUrl === "string" &&
      image.imageUrl.trim(),
  );

  if (heroImage?.imageUrl?.trim()) {
    return heroImage.imageUrl.trim();
  }

  const thumbnailImage = images.find(
    (image) =>
      image?.imageType === "thumbnail" &&
      typeof image.imageUrl === "string" &&
      image.imageUrl.trim(),
  );

  if (thumbnailImage?.imageUrl?.trim()) {
    return thumbnailImage.imageUrl.trim();
  }

  const firstValidImage = images.find(
    (image) => typeof image?.imageUrl === "string" && image.imageUrl.trim(),
  );

  return firstValidImage?.imageUrl?.trim() ?? "";
}

export default function BlogDetailsHeroImage({
  blog,
}: {
  blog: BlogDetailsApi;
}) {
  const heroImageUrl = getHeroImageUrl(blog);

  if (!heroImageUrl) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-[22px] border border-light-slate/10 bg-white shadow-sm">
      <div className="relative h-[260px] w-full md:h-[340px]">
        <FallbackNetworkImage
          src={heroImageUrl}
          alt={blog.title}
          priority
          className="object-cover"
          iconSize={36}
        />
      </div>
    </div>
  );
}
