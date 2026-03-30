"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";
import type { BlogCreateInput } from "../../_lib/blog-create-schema";
import { cx } from "../ui/shared";
import PostToolbar, { type PostToolbarActions } from "./post-toolbar";

export default function PostBodyEditor({
  className,
}: {
  className?: string;
}) {
  const { watch, setValue, formState } = useFormContext<BlogCreateInput>();
  const content = watch("content");
  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const initializedRef = useRef(false);

  const contentError = formState.errors.content?.message;

  const syncContentFromDom = () => {
    const html = editorRef.current?.innerHTML ?? "";
    setValue("content", html, { shouldDirty: true, shouldValidate: true });
  };

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  const actions: PostToolbarActions = useMemo(
    () => ({
      onBold: () => {
        focusEditor();
        document.execCommand("bold");
        requestAnimationFrame(syncContentFromDom);
      },
      onItalic: () => {
        focusEditor();
        document.execCommand("italic");
        requestAnimationFrame(syncContentFromDom);
      },
      onUnderline: () => {
        focusEditor();
        document.execCommand("underline");
        requestAnimationFrame(syncContentFromDom);
      },
      onHeading1: () => {
        focusEditor();
        document.execCommand("formatBlock", false, "h1");
        requestAnimationFrame(syncContentFromDom);
      },
      onHeading2: () => {
        focusEditor();
        document.execCommand("formatBlock", false, "h2");
        requestAnimationFrame(syncContentFromDom);
      },
      onQuote: () => {
        focusEditor();
        document.execCommand("formatBlock", false, "blockquote");
        requestAnimationFrame(syncContentFromDom);
      },
      onLink: () => {
        focusEditor();
        const url = window.prompt("Enter URL");
        if (!url) return;
        // This inserts a link for the current selection in many browsers.
        document.execCommand("createLink", false, url);
        requestAnimationFrame(syncContentFromDom);
      },
      onImage: () => {
        fileInputRef.current?.click();
      },
    }),
    []
  );

  useEffect(() => {
    // Initialize once to avoid cursor jumps (React re-rendering would otherwise overwrite contentEditable).
    if (initializedRef.current) return;
    if (!editorRef.current) return;
    editorRef.current.innerHTML = content ?? "";
    initializedRef.current = true;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className={cx("mt-6", className)}>
      <PostToolbar actions={actions} />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = () => reject(new Error("Failed to read image file."));
            reader.onload = () => resolve(String(reader.result));
            reader.readAsDataURL(file);
          });

          const alt = file.name.replace(/\.[^/.]+$/, "") || "image";
          // Figure markup to look like your screenshot.
          const figureHtml = `
            <figure style="margin:16px 0; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden; background:#fff;">
              <img src="${dataUrl}" alt="${alt}" style="display:block; width:100%; height:auto;"/>
              <figcaption style="font-size:11px; color:#64748b; padding:8px 16px; text-align:center; border-top:1px solid #e2e8f0;">
                Figure: ${alt}
              </figcaption>
            </figure>
          `;

          focusEditor();
          document.execCommand("insertHTML", false, figureHtml);
          requestAnimationFrame(syncContentFromDom);
          // Reset input so picking same file again still triggers change.
          if (fileInputRef.current) fileInputRef.current.value = "";
        }}
      />

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => syncContentFromDom()}
        className={cx(
          "min-h-[520px] w-full overflow-auto rounded-xl border border-slate-200 bg-white px-6 py-6 text-[14px] leading-7 text-slate-800 outline-none",
          // Typography for common blocks inside the editor.
          "[&p]:my-3 [&p]:text-slate-700",
          "[&h1]:mt-6 [&h1]:mb-3 [&h1]:text-3xl [&h1]:font-extrabold [&h1]:tracking-tight [&h1]:text-slate-900",
          "[&h2]:mt-5 [&h2]:mb-3 [&h2]:text-xl [&h2]:font-extrabold [&h2]:text-slate-900",
          "[&blockquote]:mt-4 [&blockquote]:mb-4 [&blockquote]:border-l-4 [&blockquote]:border-cyan-200 [&blockquote]:bg-cyan-50 [&blockquote]:pl-4 [&blockquote]:py-2 [&blockquote]:text-slate-700",
          "[&img]:max-w-full [&img]:rounded-xl [&img]:border [&img]:border-slate-200"
        )}
      />

      {contentError ? <p className="mt-2 text-xs font-medium text-rose-600">{contentError}</p> : null}
    </section>
  );
}

