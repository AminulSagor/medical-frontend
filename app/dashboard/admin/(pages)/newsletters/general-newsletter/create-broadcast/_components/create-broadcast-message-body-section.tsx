"use client";

import { Bold, Italic, Link2, List, ListOrdered } from "lucide-react";
import { useRef } from "react";
import type {
  CreateBroadcastFormErrors,
  CreateBroadcastFormState,
} from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-create.types";

type Props = {
  form: CreateBroadcastFormState;
  errors: CreateBroadcastFormErrors;
  onChange: <K extends keyof CreateBroadcastFormState>(
    key: K,
    value: CreateBroadcastFormState[K],
  ) => void;
};

export default function CreateBroadcastMessageBodySection({
  form,
  errors,
  onChange,
}: Props) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  const handleInsertLink = () => {
    const url = window.prompt("Enter link URL");
    if (!url) return;

    const textarea = document.querySelector(
      "#message-body-textarea",
    ) as HTMLTextAreaElement;

    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const selectedText = text.substring(start, end);
      const before = text.substring(0, start);
      const after = text.substring(end);
      const linkText = selectedText || "link text";
      const linkMarkdown = `[${linkText}](${url.trim()})`;

      textarea.value = before + linkMarkdown + after;
      onChange("messageBodyText", textarea.value);
      onChange("messageBodyHtml", textarea.value);
      textarea.focus();
      textarea.setSelectionRange(
        start + linkMarkdown.length,
        start + linkMarkdown.length,
      );
    }
  };

  const handleInsertTag = () => {
    const textarea = document.querySelector(
      "#message-body-textarea",
    ) as HTMLTextAreaElement;

    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end);
      const tag = "{{Student_Name}}";

      textarea.value = before + tag + after;
      onChange("messageBodyText", textarea.value);
      onChange("messageBodyHtml", textarea.value);
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, start + tag.length);
    }
  };

  return (
    <section className="rounded-[28px] bg-[#f8fafc] p-5 shadow-sm ring-1 ring-slate-200 sm:p-7">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Message Body</h2>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            Compose your custom clinical message
          </p>
        </div>

        <button
          type="button"
          onClick={handleInsertTag}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-500 shadow-sm hover:bg-slate-50"
        >
          @ Insert Personalization Tag
        </button>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 px-4 py-4">
          <button
            type="button"
            onClick={() => {
              const textarea = document.querySelector(
                "#message-body-textarea",
              ) as HTMLTextAreaElement;
              if (textarea) {
                const start = textarea.selectionStart;
                const text = textarea.value;
                const before = text.substring(0, start);
                const after = text.substring(textarea.selectionEnd);

                textarea.value = before + "**bold**" + after;
                onChange("messageBodyText", textarea.value);
                onChange("messageBodyHtml", textarea.value);
                textarea.focus();
                textarea.setSelectionRange(start + 7, start + 7);
              }
            }}
            className="inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-slate-500 transition hover:bg-slate-100"
          >
            <Bold size={15} />
          </button>

          <button
            type="button"
            onClick={() => {
              const textarea = document.querySelector(
                "#message-body-textarea",
              ) as HTMLTextAreaElement;
              if (textarea) {
                const start = textarea.selectionStart;
                const text = textarea.value;
                const before = text.substring(0, start);
                const after = text.substring(textarea.selectionEnd);

                textarea.value = before + "*italic*" + after;
                onChange("messageBodyText", textarea.value);
                onChange("messageBodyHtml", textarea.value);
                textarea.focus();
                textarea.setSelectionRange(start + 8, start + 8);
              }
            }}
            className="inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-slate-500 transition hover:bg-slate-100"
          >
            <Italic size={15} />
          </button>

          <div className="mx-1 h-5 w-px bg-slate-200" />

          <button
            type="button"
            onClick={() => {
              const textarea = document.querySelector(
                "#message-body-textarea",
              ) as HTMLTextAreaElement;
              if (textarea) {
                const start = textarea.selectionStart;
                const text = textarea.value;
                const before = text.substring(0, start);
                const after = text.substring(textarea.selectionEnd);

                textarea.value = before + "\n- item\n- item\n" + after;
                onChange("messageBodyText", textarea.value);
                onChange("messageBodyHtml", textarea.value);
              }
            }}
            className="inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-slate-500 transition hover:bg-slate-100"
          >
            <List size={15} />
          </button>

          <button
            type="button"
            onClick={() => {
              const textarea = document.querySelector(
                "#message-body-textarea",
              ) as HTMLTextAreaElement;
              if (textarea) {
                const start = textarea.selectionStart;
                const text = textarea.value;
                const before = text.substring(0, start);
                const after = text.substring(textarea.selectionEnd);

                textarea.value = before + "\n1. item\n2. item\n" + after;
                onChange("messageBodyText", textarea.value);
                onChange("messageBodyHtml", textarea.value);
              }
            }}
            className="inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-slate-500 transition hover:bg-slate-100"
          >
            <ListOrdered size={15} />
          </button>

          <div className="mx-1 h-5 w-px bg-slate-200" />

          <button
            type="button"
            onClick={handleInsertLink}
            className="inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-slate-500 transition hover:bg-slate-100"
          >
            <Link2 size={15} />
          </button>

          <div className="ml-auto rounded-md bg-[#eafbf8] px-2.5 py-1 text-xs font-semibold text-[#14b8a6]">
            {`{{Student_Name}}`} Tag
          </div>
        </div>

        <textarea
          id="message-body-textarea"
          value={form.messageBodyText || ""}
          onChange={(e) => {
            onChange("messageBodyText", e.target.value);
            onChange("messageBodyHtml", e.target.value);
          }}
          placeholder="Write your message here..."
          className="min-h-[300px] w-full resize-y px-5 py-6 text-sm leading-8 text-slate-600 outline-none focus:ring-0"
        />
      </div>

      {errors.messageBody ? (
        <p className="mt-2 text-xs text-red-500">{errors.messageBody}</p>
      ) : null}
    </section>
  );
}
