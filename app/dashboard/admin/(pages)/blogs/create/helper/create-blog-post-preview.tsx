"use client";

import { Eye } from "lucide-react";

type CreateBlogPostPreviewProps = {
  onClick?: () => void;
};

export default function CreateBlogPostPreview({
  onClick,
}: CreateBlogPostPreviewProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
    >
      <Eye size={16} />
      Preview Article
    </button>
  );
}
