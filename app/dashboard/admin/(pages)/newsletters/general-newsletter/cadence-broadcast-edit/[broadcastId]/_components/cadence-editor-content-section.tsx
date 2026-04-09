"use client";

import React, { useMemo } from "react";
import {
  AtSign,
  Bold,
  CheckCircle2,
  ChevronDown,
  FileText,
  Italic,
  Link2,
  List,
  ListOrdered,
  Paperclip,
  PenSquare,
  Search,
  UploadCloud,
} from "lucide-react";

export type ContentTypeMode = "link_article" | "custom_message";

type Props = {
  contentType: ContentTypeMode;
  onChangeContentType: (value: ContentTypeMode) => void;

  selectedArticleLabel: string;
  subjectLine: string;
  onChangeSubjectLine: (value: string) => void;

  preheader: string;
  onChangePreheader: (value: string) => void;

  messageBody: string;
  onChangeMessageBody: (value: string) => void;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function ShellCard({
  title,
  subtitle,
  rightAction,
  children,
}: {
  title: string;
  subtitle: string;
  rightAction?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_10px_40px_rgba(15,23,42,0.04)] md:p-7">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-[16px] font-semibold text-slate-800">{title}</h2>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            {subtitle}
          </p>
        </div>

        {rightAction ? <div className="shrink-0">{rightAction}</div> : null}
      </div>

      {children}
    </section>
  );
}

function ContentTypeCard({
  selected,
  title,
  description,
  icon,
  onClick,
}: {
  selected: boolean;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "relative flex min-h-[162px] w-full flex-col items-center justify-center rounded-3xl border p-6 text-center transition-all",
        selected
          ? "border-[#14b8ad] bg-[#f5fffe] shadow-[0_8px_24px_rgba(20,184,173,0.14)]"
          : "border-slate-200 bg-white hover:border-slate-300",
      )}
    >
      {selected && (
        <span className="absolute right-4 top-4 inline-flex h-5 w-5 items-center justify-center rounded-full text-[#14b8ad]">
          <CheckCircle2 size={18} />
        </span>
      )}

      <span
        className={cx(
          "mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl",
          selected
            ? "bg-[#dff7f4] text-[#14b8ad]"
            : "bg-slate-100 text-slate-300",
        )}
      >
        {icon}
      </span>

      <h3
        className={cx(
          "text-[15px] font-semibold",
          selected ? "text-slate-800" : "text-slate-500",
        )}
      >
        {title}
      </h3>

      <p
        className={cx(
          "mt-2 max-w-[270px] text-sm leading-6",
          selected ? "text-slate-500" : "text-slate-400",
        )}
      >
        {description}
      </p>
    </button>
  );
}

function FieldLabel({
  label,
  rightHint,
}: {
  label: string;
  rightHint?: string;
}) {
  return (
    <div className="mb-2 flex items-center justify-between gap-3">
      <label className="text-sm font-semibold text-slate-600">{label}</label>
      {rightHint ? (
        <span className="text-[11px] text-slate-400">{rightHint}</span>
      ) : null}
    </div>
  );
}

function InputShell({
  leftIcon,
  rightIcon,
  value,
}: {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  value: string;
}) {
  return (
    <button
      type="button"
      className="flex h-11 w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-left text-slate-700 hover:border-slate-300"
    >
      {leftIcon ? (
        <span className="shrink-0 text-slate-400">{leftIcon}</span>
      ) : null}
      <span className="min-w-0 flex-1 truncate text-sm">{value}</span>
      {rightIcon ? (
        <span className="shrink-0 text-slate-400">{rightIcon}</span>
      ) : null}
    </button>
  );
}

function TextInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-300"
    />
  );
}

function ToolbarIconButton({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700"
    >
      {children}
    </button>
  );
}

function MessageBodyEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
        <div className="flex flex-wrap items-center gap-1">
          <ToolbarIconButton label="Bold">
            <Bold size={16} />
          </ToolbarIconButton>
          <ToolbarIconButton label="Italic">
            <Italic size={16} />
          </ToolbarIconButton>

          <span className="mx-1 h-6 w-px bg-slate-200" />

          <ToolbarIconButton label="Bulleted list">
            <List size={16} />
          </ToolbarIconButton>
          <ToolbarIconButton label="Numbered list">
            <ListOrdered size={16} />
          </ToolbarIconButton>

          <span className="mx-1 h-6 w-px bg-slate-200" />

          <ToolbarIconButton label="Insert link">
            <Link2 size={16} />
          </ToolbarIconButton>
          <ToolbarIconButton label="Attach file">
            <Paperclip size={16} />
          </ToolbarIconButton>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="inline-flex items-center rounded-md bg-[#e9fbf8] px-2 py-1 text-xs font-semibold text-[#14b8ad]">
            {"{{Student_Name}}"}
          </span>
          <span className="font-semibold text-slate-500">Tag</span>
        </div>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[290px] w-full resize-y border-0 bg-white px-6 py-5 text-[15px] leading-8 text-slate-600 outline-none placeholder:text-slate-400"
      />
    </div>
  );
}

function AttachmentDropzone() {
  return (
    <button
      type="button"
      className="flex w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white px-6 py-10 text-center hover:border-slate-300"
    >
      <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-[#14b8ad]">
        <UploadCloud size={22} />
      </span>

      <p className="text-[15px] font-medium text-slate-600">
        Drag and drop clinical reports, PDFs, or images here,{" "}
        <span className="font-semibold text-[#14b8ad]">or click to browse</span>
      </p>

      <p className="mt-1 text-xs text-slate-400">
        Supported formats: PDF, JPEG, PNG (Max 10MB per file)
      </p>
    </button>
  );
}

export default function CadenceEditorContentSection({
  contentType,
  onChangeContentType,
  selectedArticleLabel,
  subjectLine,
  onChangeSubjectLine,
  preheader,
  onChangePreheader,
  messageBody,
  onChangeMessageBody,
}: Props) {
  const preheaderHint = useMemo(
    () => `Character Limit: ${preheader.length}/150`,
    [preheader.length],
  );

  return (
    <div className="space-y-6">
      {/* 1) Content Type Selection */}
      <ShellCard
        title="Content Type Selection"
        subtitle="Select your primary newsletter format"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ContentTypeCard
            selected={contentType === "link_article"}
            title="Link Clinical Article"
            description="Select from published research, surgical insights, and peer-reviewed journals."
            icon={<FileText size={20} />}
            onClick={() => onChangeContentType("link_article")}
          />

          <ContentTypeCard
            selected={contentType === "custom_message"}
            title="Compose Custom Message"
            description="Write a standalone announcement, update, or personalized clinical memo."
            icon={<PenSquare size={20} />}
            onClick={() => onChangeContentType("custom_message")}
          />
        </div>
      </ShellCard>

      {/* 2) Content Details - ALWAYS VISIBLE */}
      <ShellCard
        title="Content Details"
        subtitle="Configure the email metadata and source"
      >
        <div className="space-y-5">
          <div>
            <FieldLabel label="Select Published Article" />
            <InputShell
              leftIcon={<Search size={16} />}
              value={selectedArticleLabel}
              rightIcon={<ChevronDown size={16} />}
            />
          </div>

          <div>
            <FieldLabel label="Subject Line" />
            <TextInput value={subjectLine} onChange={onChangeSubjectLine} />
          </div>

          <div>
            <FieldLabel
              label="Pre-header (Preview Text)"
              rightHint={preheaderHint}
            />
            <TextInput value={preheader} onChange={onChangePreheader} />
          </div>
        </div>
      </ShellCard>

      {/* 3) + 4) Extra sections only for custom message */}
      {contentType === "custom_message" && (
        <>
          <ShellCard
            title="Message Body"
            subtitle="Compose your custom clinical message"
            rightAction={
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                <AtSign size={15} />
                Insert Personalization Tag
              </button>
            }
          >
            <MessageBodyEditor
              value={messageBody}
              onChange={onChangeMessageBody}
            />
          </ShellCard>

          <ShellCard
            title="Attachments"
            subtitle="Upload clinical reports and references"
          >
            <AttachmentDropzone />
          </ShellCard>
        </>
      )}
    </div>
  );
}
