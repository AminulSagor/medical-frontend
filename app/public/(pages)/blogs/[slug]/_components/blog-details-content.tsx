import { BlogDetailsApi } from "@/types/public/blogs/blog-type";

export default function BlogDetailsContent({ blog }: { blog: BlogDetailsApi }) {
    if (!blog.content) {
      return (
        <article className="prose max-w-none">
          <div className="space-y-6 text-[14px] leading-7 text-light-slate/70">
            <p>{blog.description}</p>
          </div>
        </article>
      );
    }

    return (
        <article 
          className="prose max-w-none space-y-6 text-[14px] leading-7 text-light-slate/70"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
    );
}