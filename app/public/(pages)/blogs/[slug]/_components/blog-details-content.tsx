import Image from "next/image";
import { BlogDetailsApi } from "@/types/public/blogs/blog-type";

export default function BlogDetailsContent({ blog }: { blog: BlogDetailsApi }) {
  const content = blog.content || `<p>${blog.description ?? ""}</p>`;

  const inlineImages =
    blog.coverImageUrl?.filter((img) => img.imageType === "article_inline") ??
    [];

  return (
    <div className="space-y-10">
      <article
        className="
          prose max-w-none text-justify

          prose-p:text-sm prose-p:leading-7 prose-p:text-light-slate/75
          prose-p:mb-4

          prose-strong:text-black prose-strong:font-semibold
          prose-em:text-light-slate/80

          prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline

          prose-h1:text-[32px] prose-h1:font-bold prose-h1:text-black
          prose-h2:text-[26px] prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4
          prose-h3:text-[20px] prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3

          prose-ul:pl-5 prose-ul:space-y-2
          prose-li:text-sm prose-li:leading-7 prose-li:text-light-slate/75

          prose-img:rounded-[18px] prose-img:my-6 prose-img:w-full
        "
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {inlineImages.length > 0 && (
        <div className="space-y-6">
          <h4 className="text-[18px] font-semibold text-black">
            Related Images
          </h4>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {inlineImages.map((img, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[20px] border border-light-slate/10"
              >
                <div className="relative h-[220px] w-full">
                  <img
                    src={img.imageUrl}
                    alt={`blog-image-${index}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
