"use client";

import { Bold, Italic, Link2, List, ListOrdered } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  // sync html → editor
  useEffect(() => {
    if (!editorRef.current) return;

    if (editorRef.current.innerHTML !== (form.messageBodyHtml || "")) {
      editorRef.current.innerHTML = form.messageBodyHtml || "";
    }
  }, [form.messageBodyHtml]);

  // sync editor → state
  const syncValue = () => {
    if (!editorRef.current) return;

    const html = editorRef.current.innerHTML;
    const text = editorRef.current.innerText;

    onChange("messageBodyHtml", html);
    onChange("messageBodyText", text);
  };

  // apply formatting
  const applyCommand = (command: string) => {
    editorRef.current?.focus();
    document.execCommand(command);
    syncValue();
  };

  const handleInsertLink = () => {
    const url = window.prompt("Enter link URL");
    if (!url) return;

    editorRef.current?.focus();
    document.execCommand("createLink", false, url);
    syncValue();
  };

  const handleInsertTag = () => {
    editorRef.current?.focus();
    document.execCommand("insertText", false, "{{Student_Name}}");
    syncValue();
  };

  // 🔥 active state tracking
  useEffect(() => {
    const updateState = () => {
      setIsBold(document.queryCommandState("bold"));
      setIsItalic(document.queryCommandState("italic"));
    };

    document.addEventListener("selectionchange", updateState);

    return () => {
      document.removeEventListener("selectionchange", updateState);
    };
  }, []);

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
          {/* Bold */}
          <button
            type="button"
            onClick={() => applyCommand("bold")}
            className={`inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 transition
              ${isBold ? "bg-slate-200 text-black" : "text-slate-500 hover:bg-slate-100"}
            `}
          >
            <Bold size={15} />
          </button>

          {/* Italic */}
          <button
            type="button"
            onClick={() => applyCommand("italic")}
            className={`inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 transition
              ${isItalic ? "bg-slate-200 text-black" : "text-slate-500 hover:bg-slate-100"}
            `}
          >
            <Italic size={15} />
          </button>

          <div className="mx-1 h-5 w-px bg-slate-200" />

          {/* Bullet */}
          <button
            type="button"
            onClick={() => applyCommand("insertUnorderedList")}
            className="inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-slate-500 hover:bg-slate-100"
          >
            <List size={15} />
          </button>

          {/* Numbered */}
          <button
            type="button"
            onClick={() => applyCommand("insertOrderedList")}
            className="inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-slate-500 hover:bg-slate-100"
          >
            <ListOrdered size={15} />
          </button>

          <div className="mx-1 h-5 w-px bg-slate-200" />

          {/* Link */}
          <button
            type="button"
            onClick={handleInsertLink}
            className="inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-slate-500 hover:bg-slate-100"
          >
            <Link2 size={15} />
          </button>

          <div className="ml-auto rounded-md bg-[#eafbf8] px-2.5 py-1 text-xs font-semibold text-[#14b8a6]">
            {`{{Student_Name}}`} Tag
          </div>
        </div>

        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable
          onInput={syncValue}
          className="min-h-[300px] px-5 py-6 text-sm leading-8 text-slate-600 outline-none"
          suppressContentEditableWarning
        />
      </div>

      {errors.messageBody ? (
        <p className="mt-2 text-xs text-red-500">{errors.messageBody}</p>
      ) : null}
    </section>
  );
}
