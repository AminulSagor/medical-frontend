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

  const placeCaretAfterNode = (node: Node) => {
    const sel = window.getSelection();
    if (!sel) return;
    const range = document.createRange();
    range.setStartAfter(node);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const syncContentFromDom = () => {
    const html = editorRef.current?.innerHTML ?? "";
    // Do not validate on every keystroke/image insert: it can steal focus/caret in contentEditable.
    setValue("content", html, { shouldDirty: true, shouldValidate: false });
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
      <style>{`
        .blog-editor h1{
          font-family: "Newsreader", serif;
          font-weight: 700;
          font-style: normal;
          font-size: 24px;
          line-height: 32px;
          letter-spacing: 0%;
          vertical-align: middle;
          margin: 24px 0 12px;
        }
        .blog-editor h2{
          font-family: "Merriweather", serif;
          font-weight: 400;
          font-style: normal;
          font-size: 16px;
          line-height: 24px;
          letter-spacing: 0%;
          vertical-align: middle;
          margin: 20px 0 10px;
        }
        .blog-editor p{
          margin: 0 0 16px;
          font-family: "Merriweather", serif;
          font-weight: 400;
          font-style: normal;
          font-size: 16px;
          line-height: 24px;
          letter-spacing: 0%;
          vertical-align: middle;
        }
        .blog-editor figure{
          margin: 16px 0;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          background: #fff;
          width: 686px;
          max-width: 100%;
        }
        .blog-editor figure img{
          width: 686px;
          height: 256px;
          transform: rotate(0deg);
          opacity: 1;
          object-fit: cover;
          display: block;
        }
        .blog-editor figcaption{
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          line-height: 16px;
          color: #64748b;
          padding: 0 16px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
        }
      `}</style>
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
            <figure>
              <img src="${dataUrl}" alt="${alt}" />
              <figcaption>Figure: ${alt}</figcaption>
            </figure>
          `;

          const editor = editorRef.current;
          if (!editor) return;
          focusEditor();
          document.execCommand("insertHTML", false, figureHtml);

          // Place caret after the inserted figure so the user can continue typing.
          requestAnimationFrame(() => {
            const lastFigure = editor.querySelectorAll("figure");
            const inserted = lastFigure[lastFigure.length - 1];
            if (inserted) placeCaretAfterNode(inserted);
            syncContentFromDom();
          });

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
          "blog-editor min-h-[520px] w-full overflow-auto rounded-xl border border-slate-200 bg-white px-6 py-6 text-[14px] leading-7 text-slate-800 outline-none",
          // Typography for common blocks inside the editor.
          "[&blockquote]:mt-4 [&blockquote]:mb-4 [&blockquote]:border-l-4 [&blockquote]:border-cyan-200 [&blockquote]:bg-cyan-50 [&blockquote]:pl-4 [&blockquote]:py-2 [&blockquote]:text-slate-700"
        )}
      />

      {contentError ? <p className="mt-2 text-xs font-medium text-rose-600">{contentError}</p> : null}
    </section>
  );
}

