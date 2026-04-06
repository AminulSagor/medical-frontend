"use client";

import CreateBlogPostSettingsSection from "./create-blog-post-settings-section";

type CreateBlogPostSettingsSeoSectionProps = {
  metaTitle: string;
  metaDescription: string;
  onMetaTitleChange: (value: string) => void;
  onMetaDescriptionChange: (value: string) => void;
};

export default function CreateBlogPostSettingsSeoSection({
  metaTitle,
  metaDescription,
  onMetaTitleChange,
  onMetaDescriptionChange,
}: CreateBlogPostSettingsSeoSectionProps) {
  return (
    <CreateBlogPostSettingsSection title="SEO Settings" withBorder={false}>
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Meta Title
        </p>

        <textarea
          value={metaTitle}
          onChange={(e) => onMetaTitleChange(e.target.value)}
          rows={2}
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none"
        />
      </div>

      <div className="mt-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Meta Description
        </p>

        <textarea
          value={metaDescription}
          onChange={(e) => onMetaDescriptionChange(e.target.value)}
          rows={4}
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none"
        />
      </div>

      <div className="mt-6 rounded-xl bg-slate-50 px-4 py-4">
        <p className="text-xs text-slate-400">Search Preview</p>

        <div className="mt-2">
          <p className="truncate text-xs text-slate-500">
            texasairwayinstitute.com › blog › pediatric...
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-indigo-700">
            {metaTitle}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Oct 24, 2023 — {metaDescription}
          </p>
        </div>
      </div>
    </CreateBlogPostSettingsSection>
  );
}