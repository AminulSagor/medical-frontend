"use client";

import { Bold, Italic, List, Link2 } from "lucide-react";
import { useRef, useState } from "react";

function exec(command: string, value?: string) {
  document.execCommand(command, false, value);
}

export default function MessageContentPanel() {
  const editorRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState({
    bold: false,
    italic: false,
    list: false,
  });

  const updateActiveState = () => {
    setActive({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      list: document.queryCommandState("insertUnorderedList"),
    });
  };

  const applyBold = () => {
    exec("bold");
    updateActiveState();
  };

  const applyItalic = () => {
    exec("italic");
    updateActiveState();
  };

  const applyList = () => {
    exec("insertUnorderedList");
    updateActiveState();
  };

  const applyLink = () => {
    const url = prompt("Enter URL");
    if (!url) return;
    exec("createLink", url);
  };

  const btn = (isActive: boolean) =>
    [
      "rounded-lg p-2 transition",
      isActive
        ? "bg-slate-200 text-slate-900"
        : "text-slate-600 hover:bg-slate-100",
    ].join(" ");

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60">
      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <p className="text-[14px] font-bold leading-[17.5px] text-slate-900">
            Message Content
          </p>
          <p className="text-xs text-slate-500">
            Compose your transmission details
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white px-2 py-1 shadow-sm">

          <button
            type="button"
            onClick={applyBold}
            className={btn(active.bold)}
          >
            <Bold size={18} />
          </button>

          <button
            type="button"
            onClick={applyItalic}
            className={btn(active.italic)}
          >
            <Italic size={18} />
          </button>

          <button
            type="button"
            onClick={applyList}
            className={btn(active.list)}
          >
            <List size={18} />
          </button>

          <div className="mx-1 h-6 w-px bg-slate-200" />

          <button
            type="button"
            onClick={applyLink}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            <Link2 size={18} />
          </button>

        </div>
      </div>

      {/* Editor */}
      <div className="mt-5">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onKeyUp={updateActiveState}
          onMouseUp={updateActiveState}
          data-placeholder="Start typing clinical instructions here..."
          className={[
            "min-h-[180px] w-full rounded-xl border border-slate-200 px-5 py-4",
            "text-sm text-slate-900 focus:outline-none",
            "empty:before:content-[attr(data-placeholder)]",
            "empty:before:text-slate-400",
            "empty:before:pointer-events-none",
          ].join(" ")}
        />
      </div>

    </section>
  );
}