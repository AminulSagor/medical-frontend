"use client";

import CreateBlogPostSettingsSection from "./create-blog-post-settings-section";

type CreateBlogPostSettingsExcerptSectionProps = {
  excerpt: string;
  onExcerptChange: (value: string) => void;
};

export default function CreateBlogPostSettingsExcerptSection({
  excerpt,
  onExcerptChange,
}: CreateBlogPostSettingsExcerptSectionProps) {
  return (
    <CreateBlogPostSettingsSection title="Excerpt">
      <textarea
        value={excerpt}
        onChange={(e) => onExcerptChange(e.target.value)}
        placeholder="Write a summary for the blog grid..."
        rows={5}
        maxLength={150}
        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
      />

      <p className="mt-2 text-right text-sm text-slate-400">
        {excerpt.length}/150 characters
      </p>
    </CreateBlogPostSettingsSection>
  );
}