"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import type { BlogCreateInput } from "../../_lib/blog-create-schema";
import { cx } from "../ui/shared";

export default function PostTitleEditor() {
  const { watch, setValue, formState } = useFormContext<BlogCreateInput>();
  const title = watch("title");
  const titleError = formState.errors.title?.message;

  return (
    <div>
      <input
        value={title}
        onChange={(e) => setValue("title", e.target.value, { shouldDirty: true, shouldValidate: true })}
        className={cx(
          "mt-6 w-full bg-transparent text-3xl font-extrabold tracking-tight text-slate-900 outline-none",
          "placeholder:text-slate-300"
        )}
        placeholder="Write your blog title..."
      />

      {titleError ? <p className="mt-2 text-xs font-medium text-rose-600">{titleError}</p> : null}
    </div>
  );
}

