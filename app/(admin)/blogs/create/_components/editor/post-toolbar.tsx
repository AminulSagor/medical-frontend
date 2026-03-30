"use client";

import React from "react";
import {
  Bold,
  Heading1,
  Heading2,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  Quote,
  Underline,
} from "lucide-react";

function ToolBtn({ icon, onClick }: { icon: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
      aria-label="Editor action"
    >
      {icon}
    </button>
  );
}

export type PostToolbarActions = {
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onHeading1: () => void;
  onHeading2: () => void;
  onQuote: () => void;
  onLink: () => void;
  onImage: () => void;
};

export default function PostToolbar({ actions }: { actions: PostToolbarActions }) {
  return (
    <div className="mx-auto mb-5 flex w-full max-w-[560px] items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
      <ToolBtn icon={<Bold size={16} />} onClick={actions.onBold} />
      <ToolBtn icon={<Italic size={16} />} onClick={actions.onItalic} />
      <ToolBtn icon={<Underline size={16} />} onClick={actions.onUnderline} />
      <div className="mx-1 h-6 w-px bg-slate-200" />
      <ToolBtn icon={<Heading1 size={16} />} onClick={actions.onHeading1} />
      <ToolBtn icon={<Heading2 size={16} />} onClick={actions.onHeading2} />
      <ToolBtn icon={<Quote size={16} />} onClick={actions.onQuote} />
      <div className="mx-1 h-6 w-px bg-slate-200" />
      <ToolBtn icon={<LinkIcon size={16} />} onClick={actions.onLink} />
      <ToolBtn icon={<ImageIcon size={16} />} onClick={actions.onImage} />
    </div>
  );
}

