"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bold, Italic, Link2, List, ListOrdered } from "lucide-react";
import { cx } from "../../_utils/workshop-create.helpers";

type RichTextEditorProps = {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
};

export default function RichTextEditor({
    value,
    onChange,
    placeholder,
}: RichTextEditorProps) {
    const ref = useRef<HTMLDivElement | null>(null);

    const [active, setActive] = useState({
        bold: false,
        italic: false,
        ul: false,
        ol: false,
        link: false,
    });

    const isEmpty = useMemo(() => {
        const normalized = (value ?? "")
            .replace(/<br\s*\/?>/gi, "")
            .replace(/&nbsp;/gi, " ")
            .replace(/<\/?[^>]+(>|$)/g, "")
            .trim();

        return normalized.length === 0;
    }, [value]);

    useEffect(() => {
        if (!ref.current) return;
        if (ref.current.innerHTML !== value) {
            ref.current.innerHTML = value || "";
        }
    }, [value]);

    useEffect(() => {
        const handler = () => refreshActive();
        document.addEventListener("selectionchange", handler);

        return () => {
            document.removeEventListener("selectionchange", handler);
        };
    }, []);

    function exec(command: string, arg?: string) {
        const element = ref.current;
        if (!element) return;

        element.focus();
        document.execCommand(command, false, arg);
        onChange(element.innerHTML);
    }

    function onToolbarMouseDown(event: React.MouseEvent) {
        event.preventDefault();
    }

    function addLink() {
        const url = window.prompt("Enter link URL");
        if (!url) return;
        exec("createLink", url);
    }

    function refreshActive() {
        const bold = document.queryCommandState("bold");
        const italic = document.queryCommandState("italic");
        const ul = document.queryCommandState("insertUnorderedList");
        const ol = document.queryCommandState("insertOrderedList");

        const selection = window.getSelection();
        const node = selection?.anchorNode;
        const element =
            node && node.nodeType === Node.TEXT_NODE
                ? node.parentElement
                : (node as HTMLElement | null);

        const link = !!element?.closest?.("a");

        setActive({ bold, italic, ul, ol, link });
    }

    function toolButtonClassName(isActive: boolean) {
        return cx(
            "inline-flex h-9 w-9 items-center justify-center rounded-md transition",
            isActive ? "bg-slate-900" : "hover:bg-white",
        );
    }

    function toolIconClassName(isActive: boolean) {
        return isActive ? "text-white" : "text-slate-600";
    }

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div
                className="flex items-center gap-1 border-b border-slate-200 bg-slate-50 px-3 py-2"
                onMouseDown={onToolbarMouseDown}
            >
                <button
                    type="button"
                    onClick={() => {
                        exec("bold");
                        refreshActive();
                    }}
                    className={toolButtonClassName(active.bold)}
                    aria-label="Bold"
                >
                    <Bold size={18} className={toolIconClassName(active.bold)} />
                </button>

                <button
                    type="button"
                    onClick={() => {
                        exec("italic");
                        refreshActive();
                    }}
                    className={toolButtonClassName(active.italic)}
                    aria-label="Italic"
                >
                    <Italic size={18} className={toolIconClassName(active.italic)} />
                </button>

                <span className="mx-1 h-6 w-px bg-slate-200" />

                <button
                    type="button"
                    onClick={() => {
                        exec("insertUnorderedList");
                        refreshActive();
                    }}
                    className={toolButtonClassName(active.ul)}
                    aria-label="Bulleted list"
                >
                    <List size={18} className={toolIconClassName(active.ul)} />
                </button>

                <button
                    type="button"
                    onClick={() => {
                        exec("insertOrderedList");
                        refreshActive();
                    }}
                    className={toolButtonClassName(active.ol)}
                    aria-label="Numbered list"
                >
                    <ListOrdered size={18} className={toolIconClassName(active.ol)} />
                </button>

                <span className="mx-1 h-6 w-px bg-slate-200" />

                <button
                    type="button"
                    onClick={() => {
                        addLink();
                        refreshActive();
                    }}
                    className={toolButtonClassName(active.link)}
                    aria-label="Insert link"
                >
                    <Link2 size={18} className={toolIconClassName(active.link)} />
                </button>
            </div>

            <div className="relative">
                {isEmpty ? (
                    <div className="pointer-events-none absolute left-4 top-4 text-sm text-slate-400">
                        {placeholder}
                    </div>
                ) : null}

                <div
                    ref={ref}
                    contentEditable
                    suppressContentEditableWarning
                    className="min-h-[150px] px-4 py-4 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[var(--primary)]/15"
                    onInput={() => onChange(ref.current?.innerHTML ?? "")}
                    onKeyUp={refreshActive}
                    onMouseUp={refreshActive}
                    onFocus={refreshActive}
                />
            </div>
        </div>
    );
}