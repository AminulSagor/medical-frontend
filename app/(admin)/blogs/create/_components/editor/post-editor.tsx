"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import PostCoverImage from "./post-cover-image";
import PostTitleEditor from "./post-title-editor";
import PostBodyEditor from "./post-body-editor";
import { cx } from "../ui/shared";

export default function PostEditor({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-w-0 flex-1">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <span className="text-xs text-slate-300">/</span>
          <p className="text-xs font-semibold text-slate-700">Post Editor</p>
        </div>
      </div>

      <div className={cx("rounded-xl border border-slate-200 bg-white p-6 shadow-sm")}>
        <PostCoverImage />
        <PostTitleEditor />
        <p className="mt-3 max-w-[720px] text-sm leading-6 text-slate-600">
          Write clinical insights with headings, quotes, links, and images. On the right, configure
          your publishing settings and SEO metadata.
        </p>

        <PostBodyEditor />
      </div>
    </div>
  );
}

